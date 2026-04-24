package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    @GetMapping
    public String getExpenses() {
        return "This is secured expense data";
    }
}
