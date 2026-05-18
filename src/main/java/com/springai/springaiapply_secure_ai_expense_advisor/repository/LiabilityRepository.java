package com.springai.springaiapply_secure_ai_expense_advisor.repository;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Liability;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.LiabilityStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LiabilityRepository
        extends JpaRepository<Liability, Long> {

    List<Liability> findByUsername(String username);

    List<Liability> findByUsernameAndStatus(
            String username,
            LiabilityStatus status
    );
}