package com.springai.springaiapply_secure_ai_expense_advisor.service;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Transaction;
import com.springai.springaiapply_secure_ai_expense_advisor.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private TransactionRepository repo;

    public Map<String, Double> getSummary(String username) {

        List<Transaction> txs = repo.findByUsername(username);

        double income = 0;
        double expense = 0;
        double investment = 0;

        for (Transaction t : txs) {
            switch (t.getType()) {
                case INCOME -> income += t.getAmount();
                case EXPENSE -> expense += t.getAmount();
                case INVESTMENT -> investment += t.getAmount();
            }
        }

        Map<String, Double> result = new HashMap<>();
        result.put("income", income);
        result.put("expense", expense);
        result.put("investment", investment);
        result.put("savings", income - expense - investment);

        return result;
    }
}