package com.springai.springaiapply_secure_ai_expense_advisor.repository;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}