package com.springai.springaiapply_secure_ai_expense_advisor.dto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LiabilityPaymentRequest {

    private BigDecimal amount;
}