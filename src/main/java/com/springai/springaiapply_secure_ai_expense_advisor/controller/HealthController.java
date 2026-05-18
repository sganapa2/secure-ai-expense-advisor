package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String home() {
        return "✅ Secure AI Expense Advisor API Running";
    }

    @GetMapping("/health")
    public String health() {
        return "UP";
    }
}