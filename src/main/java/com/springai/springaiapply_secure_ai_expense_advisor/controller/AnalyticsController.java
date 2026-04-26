package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import com.springai.springaiapply_secure_ai_expense_advisor.service.AnalyticsService;
import com.springai.springaiapply_secure_ai_expense_advisor.util.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/summary")
    public Map<String, Double> getSummary() {
        String username = SecurityUtil.getCurrentUsername();
        return analyticsService.getSummary(username);
    }
}