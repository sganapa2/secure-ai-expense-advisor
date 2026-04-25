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

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/insights")
public class InsightsController {

    @Autowired
    private TransactionRepository repo;

    @Autowired
    private AIFinancialAdvisorService aiService;

    @GetMapping
    public InsightResponse getInsights(Principal principal) {

        List<Transaction> list = repo.findAll();

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

        String aiAdvice = aiService.generateInsights(expense, investment);

        return new InsightResponse(aiAdvice, null);
    }
}
