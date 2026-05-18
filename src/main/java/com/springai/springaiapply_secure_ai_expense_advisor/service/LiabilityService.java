package com.springai.springaiapply_secure_ai_expense_advisor.service;

import com.springai.springaiapply_secure_ai_expense_advisor.dto.LiabilityPaymentRequest;
import com.springai.springaiapply_secure_ai_expense_advisor.dto.LiabilityReportResponse;
import com.springai.springaiapply_secure_ai_expense_advisor.dto.LiabilityRequest;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Liability;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.LiabilityStatus;
import com.springai.springaiapply_secure_ai_expense_advisor.repository.LiabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LiabilityService {

    private final LiabilityRepository repository;

    public Liability create(String username,
                            LiabilityRequest request) {

        Liability liability = new Liability();

        liability.setUsername(username);
        liability.setLiabilityName(request.getLiabilityName());

        liability.setTotalAmount(request.getTotalAmount());

        liability.setPaidAmount(BigDecimal.ZERO);

        liability.setRemainingAmount(request.getTotalAmount());

        liability.setBorrowedFrom(request.getBorrowedFrom());

        liability.setRepaymentSource(
                request.getRepaymentSource());

        liability.setStatus(LiabilityStatus.OPEN);

        liability.setStartDate(request.getStartDate());

        liability.setDueDate(request.getDueDate());

        liability.setNotes(request.getNotes());

        return repository.save(liability);
    }

    public List<Liability> getAll(String username) {
        return repository.findByUsername(username);
    }

    public List<Liability> getOpen(String username) {
        return repository.findByUsernameAndStatus(
                username,
                LiabilityStatus.OPEN
        );
    }

    public Liability pay(Long id,
                         LiabilityPaymentRequest request) {

        Liability liability = repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Liability not found"));

        BigDecimal updatedPaid =
                liability.getPaidAmount()
                        .add(request.getAmount());

        liability.setPaidAmount(updatedPaid);

        BigDecimal remaining =
                liability.getTotalAmount()
                        .subtract(updatedPaid);

        liability.setRemainingAmount(remaining);

        if (remaining.compareTo(BigDecimal.ZERO) <= 0) {

            liability.setRemainingAmount(BigDecimal.ZERO);

            liability.setStatus(LiabilityStatus.CLOSED);
        }

        return repository.save(liability);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Liability not found");
        }
        repository.deleteById(id);
    }

    public LiabilityReportResponse report(String username) {

        List<Liability> liabilities =
                repository.findByUsername(username);

        BigDecimal totalLiability = BigDecimal.ZERO;

        BigDecimal totalPaid = BigDecimal.ZERO;

        BigDecimal remainingDue = BigDecimal.ZERO;

        long open = 0;

        long closed = 0;

        for (Liability liability : liabilities) {

            totalLiability =
                    totalLiability.add(
                            liability.getTotalAmount());

            totalPaid =
                    totalPaid.add(
                            liability.getPaidAmount());

            remainingDue =
                    remainingDue.add(
                            liability.getRemainingAmount());

            if (liability.getStatus()
                    == LiabilityStatus.OPEN) {
                open++;
            } else {
                closed++;
            }
        }

        return new LiabilityReportResponse(
                totalLiability,
                totalPaid,
                remainingDue,
                open,
                closed
        );
    }
}