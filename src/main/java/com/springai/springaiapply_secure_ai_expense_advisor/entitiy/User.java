package com.springai.springaiapply_secure_ai_expense_advisor.entitiy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class User {
    String username;
    String password;
}
