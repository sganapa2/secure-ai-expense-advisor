package com.springai.springaiapply_secure_ai_expense_advisor.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
public class LiabilityRequest {

    @NotBlank(message = "Liability name cannot be blank")
    private String liabilityName;

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be greater than zero")
    private BigDecimal totalAmount;

    @NotBlank(message = "Borrowed from field cannot be blank")
    private String borrowedFrom;

    @NotBlank(message = "Repayment source cannot be blank")
    private String repaymentSource;// to whom the user will repay the liability

    private LocalDate startDate;

    private LocalDate dueDate;

    private String notes;
}