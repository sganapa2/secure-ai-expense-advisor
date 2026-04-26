package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Transaction;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.TransactionType;
import com.springai.springaiapply_secure_ai_expense_advisor.service.TransactionService;
import com.springai.springaiapply_secure_ai_expense_advisor.util.SecurityUtil;
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
    private TransactionService transactionService;

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
                transactionService.findByUsernameAndDateBetween(principal.getName(), start, end);

        double expense = list.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double investment = list.stream()
                .filter(t -> t.getType() == TransactionType.INVESTMENT)
                .mapToDouble(Transaction::getAmount)
                .sum();
        double income = list.stream()
                .filter(t -> t.getType() == TransactionType.INCOME)
                .mapToDouble(Transaction::getAmount)
                .sum();

        Map<String, Double> result = new HashMap<>();
        result.put("totalExpense", expense);
        result.put("totalInvestment", investment);
        result.put("totalIncome", income);

        return result;
    }

    @GetMapping("/filter")
    public List<Transaction> filterByCategory(
            @RequestParam TransactionType type,
            @RequestParam String category,
            Principal principal) {

        return transactionService.findByUsernameAndTypeAndCategory(
                principal.getName(),
                type,
                category
        );
    }

    // ➕ Add transaction
    @PostMapping
    public Transaction add(@RequestBody Transaction t, Principal principal) {
        t.setUsername(principal.getName());
        t.setTitle(t.getDescription()); // Set title same as description for simplicity
        t.setDate(LocalDate.now());
        return transactionService.save(t);
    }

    // 📄 Get by type (Expense / Investment)
    // 🔍 Filter by type
    @GetMapping("/type/{type}")
    public List<Transaction> getByType(@PathVariable TransactionType type) {
        String username = SecurityUtil.getCurrentUsername();
        return transactionService.getByType(username, type);
    }

    // 📄 Get all
    @GetMapping
    public List<Transaction> getAll() {
        String username = SecurityUtil.getCurrentUsername();
        return transactionService.getAll(username);
    }

     // 🗑️ Delete transaction
     @DeleteMapping("/{id}")
     public String delete(@PathVariable Long id) {
         String username = SecurityUtil.getCurrentUsername();
         transactionService.delete(id, username);
         return "Transaction with id " + id + "Deleted";
     }

}