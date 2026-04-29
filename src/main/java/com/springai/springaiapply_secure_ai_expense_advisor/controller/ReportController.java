package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import com.springai.springaiapply_secure_ai_expense_advisor.dto.MonthlyReportResponse;
import com.springai.springaiapply_secure_ai_expense_advisor.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/monthly")
    public ResponseEntity<MonthlyReportResponse> getReport(
            @RequestParam int year,
            @RequestParam int month,
            Principal principal
    ) {
        String username = principal.getName();

        MonthlyReportResponse response =
                reportService.getMonthlyReport(username, year, month);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public Map<String, Double> getReport(Principal principal) {

        return reportService.getSimpleSummaryReport(principal);
    }
}