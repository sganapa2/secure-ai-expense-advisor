package com.springai.springaiapply_secure_ai_expense_advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MonthlyReportResponse {

    private double totalIncome;
    private double totalExpense;
    private double totalInvestment;
    private double savings;

    private double expenseRatio;
    private double savingsRate;

    private String message;

}