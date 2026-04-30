package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import com.springai.springaiapply_secure_ai_expense_advisor.dto.InsightResponse;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Transaction;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.TransactionType;
import com.springai.springaiapply_secure_ai_expense_advisor.repository.TransactionRepository;
import com.springai.springaiapply_secure_ai_expense_advisor.service.AIFinancialAdvisorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/insights")
public class InsightsController {

    @Autowired
    private TransactionRepository repo;

    @Autowired
    private AIFinancialAdvisorService aiService;

    @GetMapping
    public InsightResponse getInsights(Principal principal) {

        List<Transaction> list = repo.findByUsername(principal.getName());

        BigDecimal income = list.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expense = list.stream()
                .filter(t -> t.getUsername().equals(principal.getName()))
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal investment = list.stream()
                .filter(t -> t.getUsername().equals(principal.getName()))
                .filter(t -> t.getType() == TransactionType.INVESTMENT)
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal savings = income.subtract(expense).subtract(investment);
        String aiAdvice = aiService.generateInsights(income, expense, investment, savings);

        return new InsightResponse(aiAdvice, Map.of(
                "income", income,
                "expense", expense,
                "investment", investment,
                "savings", savings
        ));
    }
}
