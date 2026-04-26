package com.springai.springaiapply_secure_ai_expense_advisor.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class AIFinancialAdvisorService {

    private static final Logger logger = LoggerFactory.getLogger(AIFinancialAdvisorService.class);

    private final ChatClient chatClient;

    public AIFinancialAdvisorService(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    public String generateInsights(double income, double expense, double investment, double savings) {
        return getFinancialAdvice(income, expense, investment, savings);
    }

    public String getFinancialAdvice(double income, double expense, double investment, double savings) {
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

    private String fallbackAdvice(double income, double expense, double investment, double savings) {

        if (income == 0) {
            return "⚠️ No income recorded. Add income to get insights.";
        }

        double expenseRatio = (expense / income) * 100;

        if (expenseRatio > 70) {
            return "⚠️ High spending. Try reducing expenses.";
        }

        if (savings < income * 0.2) {
            return "⚠️ Low savings. Aim to save at least 20%.";
        }

        return "✅ Good financial balance. Keep investing consistently.";
    }
}
