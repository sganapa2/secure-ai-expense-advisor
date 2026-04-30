package com.springai.springaiapply_secure_ai_expense_advisor.service;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.Transaction;
import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.User;
import com.springai.springaiapply_secure_ai_expense_advisor.repository.TransactionRepository;
import com.springai.springaiapply_secure_ai_expense_advisor.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class MaturityNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(MaturityNotificationService.class);

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Run daily at 9 AM
    @Scheduled(cron = "0 0 9 * * ?")
    public void checkUpcomingMaturities() {
        logger.info("🔍 Checking for upcoming investment maturities...");

        LocalDate oneWeekFromNow = LocalDate.now().plusWeeks(1);
        LocalDate today = LocalDate.now();

        // Find all transactions with maturity dates within the next week
        List<Transaction> upcomingMaturities = transactionRepository
            .findByMaturityDateBetween(today, oneWeekFromNow);

        logger.info("📊 Found " + upcomingMaturities.size() + " investments maturing within 1 week");

        for (Transaction transaction : upcomingMaturities) {
            try {
                // Get user details
                Optional<User> userOptional = userRepository.findByUsername(transaction.getUsername());

                if (userOptional.isPresent()) {
                    User user = userOptional.get();

                    if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                        // Send notification email
                        emailService.sendMaturityNotification(
                            user.getEmail(),
                            user.getUsername(),
                            transaction.getCategory(),
                            transaction.getInvestmentInstitute(),
                            formatDate(transaction.getMaturityDate()),
                            transaction.getAmount()
                        );

                        logger.info("📧 Notification sent for " + transaction.getCategory() +
                                         " maturing on " + transaction.getMaturityDate());

                    } else {
                        logger.info("⚠️  No email configured for user: " + transaction.getUsername());
                    }
                } else {
                    logger.info("⚠️  User not found: " + transaction.getUsername());
                }

            } catch (Exception e) {
                System.err.println("❌ Failed to send notification for transaction ID " +
                                 transaction.getId() + ": " + e.getMessage());
            }
        }

        logger.info("✅ Maturity check completed");
    }

    private String formatDate(LocalDate date) {
        if (date == null) return "N/A";
        return date.format(DateTimeFormatter.ofPattern("dd MMM yyyy"));
    }
}
