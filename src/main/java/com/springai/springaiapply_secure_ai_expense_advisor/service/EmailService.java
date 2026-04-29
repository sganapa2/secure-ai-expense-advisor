package com.springai.springaiapply_secure_ai_expense_advisor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendMaturityNotification(String toEmail, String username, String investmentType,
                                       String institute, String maturityDate, double amount) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("📅 Investment Maturity Reminder - " + investmentType);

            String emailBody = String.format(
                "Dear %s,\n\n" +
                "This is a friendly reminder about your upcoming investment maturity:\n\n" +
                "📊 Investment Details:\n" +
                "• Type: %s\n" +
                "• Institute/Bank: %s\n" +
                "• Maturity Date: %s\n" +
                "• Amount: ₹%.2f\n\n" +
                "Your investment will mature in approximately 1 week. " +
                "Please review your investment strategy and consider reinvestment options.\n\n" +
                "Best regards,\n" +
                "Secure AI Expense Advisor Team",
                username, investmentType, institute, maturityDate, amount
            );

            message.setText(emailBody);
            mailSender.send(message);

            System.out.println("✅ Maturity notification email sent to: " + toEmail);

        } catch (Exception e) {
            System.err.println("❌ Failed to send maturity notification email to " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send email notification", e);
        }
    }

    public void sendTestEmail(String toEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("🧪 Test Email - Secure AI Expense Advisor");

            String emailBody = "Hello!\n\n" +
                "This is a test email from your Secure AI Expense Advisor application.\n\n" +
                "If you received this email, your email configuration is working correctly!\n\n" +
                "Best regards,\n" +
                "Secure AI Expense Advisor Team";

            message.setText(emailBody);
            mailSender.send(message);

            System.out.println("✅ Test email sent successfully to: " + toEmail);

        } catch (Exception e) {
            System.err.println("❌ Failed to send test email to " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Failed to send test email", e);
        }
    }
}
