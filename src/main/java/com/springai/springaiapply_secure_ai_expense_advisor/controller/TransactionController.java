package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Transaction;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.TransactionType;
import com.springai.springaiapply_secure_ai_expense_advisor.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionRepository repo;

    // 📊 Monthly Report
    @GetMapping("/monthly-report")
    public Map<String, Double> getMonthlyReport(
            @RequestParam int year,
            @RequestParam int month,
            Principal principal) {

        YearMonth yearMonth = YearMonth.of(year, month);

        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        List<Transaction> list =
                repo.findByUsernameAndDateBetween(principal.getName(), start, end);

        double expense = list.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double investment = list.stream()
                .filter(t -> t.getType() == TransactionType.INVESTMENT)
                .mapToDouble(Transaction::getAmount)
                .sum();

        Map<String, Double> result = new HashMap<>();
        result.put("totalExpense", expense);
        result.put("totalInvestment", investment);

        return result;
    }

    @GetMapping("/filter")
    public List<Transaction> filterByCategory(
            @RequestParam TransactionType type,
            @RequestParam String category,
            Principal principal) {

        return repo.findByUsernameAndTypeAndCategory(
                principal.getName(),
                type,
                category
        );
    }

    // ➕ Add transaction
    @PostMapping
    public Transaction add(@RequestBody Transaction t, Principal principal) {
        t.setUsername(principal.getName());
        t.setDate(LocalDate.now());
        return repo.save(t);
    }

    // 📄 Get by type (Expense / Investment)
    @GetMapping
    public List<Transaction> getByType(
            @RequestParam TransactionType type,
            Principal principal) {

        return repo.findByUsernameAndType(principal.getName(), type);
    }

}