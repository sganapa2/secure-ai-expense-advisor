package com.springai.springaiapply_secure_ai_expense_advisor.service;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Transaction;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.TransactionType;
import com.springai.springaiapply_secure_ai_expense_advisor.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository repo;

    public List<Transaction> getAll(String username) {
        return repo.findByUsername(username);
    }

    // ❌ Delete safely
    public void delete(Long id, String username) {
        Transaction tx = repo.findByIdAndUsername(id, username)
                .orElseThrow(() -> new RuntimeException("Transaction delete operation is not allowed"));
        repo.delete(tx);
    }

    public List<Transaction> findByUsernameAndDateBetween(String name, LocalDate start, LocalDate end) {
        return repo.findByUsernameAndDateBetween(name, start, end);
    }

    public List<Transaction> findByUsernameAndTypeAndCategory(String name, TransactionType type, String category) {
        return repo.findByUsernameAndTypeAndCategory(name, type, category);
    }

    public Transaction save(Transaction t) {
        return repo.save(t);
    }

    public List<Transaction> getByType(String username, TransactionType type) {
        return repo.findByUsernameAndType(username, type);
    }
}
