package com.springai.springaiapply_secure_ai_expense_advisor.repository;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Transaction;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUsernameAndType(String username, TransactionType type);

    List<Transaction> findByUsernameAndDateBetween(String username, LocalDate start, LocalDate end);

    List<Transaction> findByUsernameAndTypeAndCategory(
            String username, TransactionType type, String category
    );
}