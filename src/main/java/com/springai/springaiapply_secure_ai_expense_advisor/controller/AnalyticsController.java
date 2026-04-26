package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import com.springai.springaiapply_secure_ai_expense_advisor.dto.InsightResponse;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Transaction;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.TransactionType;
import com.springai.springaiapply_secure_ai_expense_advisor.repository.TransactionRepository;
import com.springai.springaiapply_secure_ai_expense_advisor.service.AIFinancialAdvisorService;
import com.springai.springaiapply_secure_ai_expense_advisor.service.AnalyticsService;
import com.springai.springaiapply_secure_ai_expense_advisor.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private TransactionRepository repo;

    @Autowired
    private AIFinancialAdvisorService aiService;

    @GetMapping("/summary")
    public Map<String, Double> getSummary() {
        String username = SecurityUtil.getCurrentUsername();
        return analyticsService.getSummary(username);
    }

    @GetMapping("/insights")
    public InsightResponse getInsights(Principal principal) {

        List<Transaction> list = repo.findByUsername(principal.getName());

        double income = list.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double expense = list.stream()
                .filter(t -> t.getUsername().equals(principal.getName()))
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double investment = list.stream()
                .filter(t -> t.getUsername().equals(principal.getName()))
                .filter(t -> t.getType() == TransactionType.INVESTMENT)
                .mapToDouble(Transaction::getAmount)
                .sum();
        double savings = income - expense;
        String aiAdvice = aiService.generateInsights(income, expense, investment, savings);

        return new InsightResponse(aiAdvice, Map.of(
                "income", income,
                "expense", expense,
                "investment", investment,
                "savings", savings
        ));
    }
}