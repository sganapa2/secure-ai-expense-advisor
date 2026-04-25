package com.springai.springaiapply_secure_ai_expense_advisor.service;

import com.springai.springaiapply_secure_ai_expense_advisor.controller.AuthController;
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

    public String generateInsights(double expense, double investment) {



        return getFinancialAdvice(expense, investment);


    }
    public String getFinancialAdvice(double expense, double investment) {
        String prompt = """
                You are a financial advisor.
                
                User data:
                - Total Expense: %f
                - Total Investment: %f
                
                Give short, practical financial advice in 2-3 lines.
                """.formatted(expense, investment);
        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception ex) {
            logger.error("AI service failed generating financial advice: {} Hence trying with custom approach.", ex.getMessage());
            return fallbackAdvice(expense, investment);
        }
    }

    private String fallbackAdvice(double expense, double investment) {
        if (expense > investment) {
            return "⚠️ Your expenses are higher than investments. Try saving more. Custom advice not AI generated.";
        } else {
            return "✅ Great! You are investing well. Customized analysis not AI generated response.";
        }
    }
}
