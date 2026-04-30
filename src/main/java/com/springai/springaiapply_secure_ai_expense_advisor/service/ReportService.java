package com.springai.springaiapply_secure_ai_expense_advisor.service;

import com.springai.springaiapply_secure_ai_expense_advisor.dto.MonthlyReportResponse;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Transaction;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.TransactionType;
import com.springai.springaiapply_secure_ai_expense_advisor.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private TransactionRepository transactionRepository;

    public MonthlyReportResponse getMonthlyReport(
            String username,
            int year,
            int month
    ) {

        // ✅ Validate date (max 5 years past)
        LocalDate now = LocalDate.now();
        LocalDate requestedDate = LocalDate.of(year, month, 1);

        if (requestedDate.isAfter(now)) {
            throw new IllegalArgumentException("Future dates not allowed");
        }

        if (requestedDate.isBefore(now.minusYears(5))) {
            throw new IllegalArgumentException("Only last 5 years data allowed");
        }

        // Month start & end
        LocalDate start = requestedDate.withDayOfMonth(1);
        LocalDate end = requestedDate.withDayOfMonth(requestedDate.lengthOfMonth());

        List<Transaction> transactions =
                transactionRepository.findByUsernameAndDateBetween(username, start, end);

        double income = 0;
        double expense = 0;
        double investment = 0;

        for (Transaction t : transactions) {
            switch (t.getType()) {
                case INCOME:
                    income += t.getAmount().doubleValue();
                    break;
                case EXPENSE:
                    expense += t.getAmount().doubleValue();
                    break;
                case INVESTMENT:
                    investment += t.getAmount().doubleValue();
                    break;
            }
        }

        return getMonthlyReportResponse(income, expense, investment);
    }

    private static MonthlyReportResponse getMonthlyReportResponse(double income, double expense, double investment) {
        double savings = income - expense - investment;

        double expenseRatio = income == 0 ? 0 : (expense / income) * 100;
        double savingsRate = income == 0 ? 0 : (savings / income) * 100;

        MonthlyReportResponse response = new MonthlyReportResponse();
        response.setTotalIncome(income);
        response.setTotalExpense(expense);
        response.setTotalInvestment(investment);
        response.setSavings(savings);
        response.setExpenseRatio(expenseRatio);
        response.setSavingsRate(savingsRate);

        if (income == 0) {
            response.setMessage("⚠️ No income recorded");
        } else if (expenseRatio > 70) {
            response.setMessage("⚠️ High spending this month");
        } else if (savingsRate < 20) {
            response.setMessage("⚠️ Low savings rate");
        } else {
            response.setMessage("✅ Healthy financial month");
        }
        return response;
    }
}
