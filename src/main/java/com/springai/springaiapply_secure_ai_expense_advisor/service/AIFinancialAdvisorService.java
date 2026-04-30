package com.springai.springaiapply_secure_ai_expense_advisor.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class AIFinancialAdvisorService {

    private static final Logger logger = LoggerFactory.getLogger(AIFinancialAdvisorService.class);

    private final ChatClient chatClient;

    public AIFinancialAdvisorService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String generateInsights(BigDecimal income, BigDecimal expense, BigDecimal investment, BigDecimal savings) {
        return getFinancialAdvice(income, expense, investment, savings);
    }

    public String getFinancialAdvice(BigDecimal income, BigDecimal expense, BigDecimal investment, BigDecimal savings) {
        String prompt = """
                You are a smart financial advisor.
                
                User financial summary:
                - Income: %f
                - Expense: %f
                - Investment: %f
                
                Notes:
                - Investment is part of savings (not expense)
                
                Analyze and give:
                1. Spending behavior
                2. Savings quality
                3. Investment advice
                
                Keep response short (2-3 lines), practical and realistic.
                """.formatted(income, expense, investment);
        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception ex) {
            logger.error("AI service failed generating financial advice: {} Hence trying with custom approach.", ex.getMessage());
            return fallbackAdvice(income, expense, investment, savings);
        }
    }

    private String fallbackAdvice(BigDecimal income, BigDecimal expense, BigDecimal investment, BigDecimal savings) {

        if (income.compareTo(BigDecimal.ZERO) == 0) {
            return "⚠️ No income recorded. Add income to get insights.";
        }

        BigDecimal expenseRatio = (expense.divide(income, 2, RoundingMode.HALF_UP)).multiply(BigDecimal.valueOf(100));

        if (expenseRatio.compareTo(new BigDecimal("70")) > 0) {
            return "⚠️ High spending. Try reducing expenses.";
        }

        if (savings.compareTo(income.multiply(BigDecimal.valueOf(0.2))) < 0) {
            return "⚠️ Low savings. Aim to save at least 20%.";
        }

        return "✅ Good financial balance. Keep investing consistently.";
    }
}
