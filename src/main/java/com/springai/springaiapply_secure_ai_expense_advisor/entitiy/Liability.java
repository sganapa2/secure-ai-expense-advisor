package com.springai.springaiapply_secure_ai_expense_advisor.entitiy;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "liabilities")
public class Liability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username")
    private String username;

    private String liabilityName;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(precision = 12, scale = 2)
    private BigDecimal paidAmount;

    @Column(precision = 12, scale = 2)
    private BigDecimal remainingAmount;

    private String borrowedFrom;

    private String repaymentSource;

    @Enumerated(EnumType.STRING)
    private LiabilityStatus status;

    private LocalDate startDate;

    private LocalDate dueDate;

    private String notes;

}