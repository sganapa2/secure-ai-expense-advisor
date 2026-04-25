package com.springai.springaiapply_secure_ai_expense_advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthRequest {
    private String username;
    private String password;
}