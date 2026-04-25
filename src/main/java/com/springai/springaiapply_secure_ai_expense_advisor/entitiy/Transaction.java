package com.springai.springaiapply_secure_ai_expense_advisor.entitiy;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Double amount;

    @Enumerated(EnumType.STRING)
    private TransactionType type; // EXPENSE / INVESTMENT

    private String category; // Food, Travel, SIP, FD

    private String username;

    private LocalDate date;

}