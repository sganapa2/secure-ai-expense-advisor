package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import com.springai.springaiapply_secure_ai_expense_advisor.dto.LiabilityPaymentRequest;
import com.springai.springaiapply_secure_ai_expense_advisor.dto.LiabilityReportResponse;
import com.springai.springaiapply_secure_ai_expense_advisor.dto.LiabilityRequest;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Liability;
import com.springai.springaiapply_secure_ai_expense_advisor.service.AIFinancialAdvisorService;
import com.springai.springaiapply_secure_ai_expense_advisor.service.LiabilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/liabilities")
@RequiredArgsConstructor
@CrossOrigin
public class LiabilityController {

    private final LiabilityService service;
    private static final Logger logger = LoggerFactory.getLogger(LiabilityController.class);

    // CREATE LIABILITY
    @PostMapping
    public Liability create(
            @Valid @RequestBody LiabilityRequest request, Principal principal) {

        return service.create(principal.getName(), request);
    }

    // GET ALL
    @GetMapping
    public List<Liability> getAll(
            Principal principal) {

        return service.getAll(principal.getName());
    }

    // GET OPEN
    @GetMapping("/open")
    public List<Liability> getOpen(
            Principal principal) {

        return service.getOpen(principal.getName());
    }

    // PAY LIABILITY
    @PutMapping("/{id}/pay")
    public Liability pay(
            @PathVariable Long id,
            @RequestBody LiabilityPaymentRequest request) {

        return service.pay(id, request);
    }

    // DELETE LIABILITY
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Principal principal) {
        String userName = principal.getName(); // Ensure user is authenticated and can be used for authorization if needed
        logger.info("User '{}' is attempting to delete liability with ID: {}", userName, id);
        service.delete(id);
        logger.info("Liability with ID: {} has been deleted by user '{}'", id, userName);
    }

    // REPORT
    @GetMapping("/report")
    public LiabilityReportResponse report(
            Principal principal) {

        return service.report(principal.getName());
    }
}
