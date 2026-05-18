package com.springai.springaiapply_secure_ai_expense_advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
public class LiabilityReportResponse {

    private BigDecimal totalLiability;

    private BigDecimal totalPaid;

    private BigDecimal remainingDue;

    private long openLiabilities;

    private long closedLiabilities;
}