package com.springai.springaiapply_secure_ai_expense_advisor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.ResponseErrorHandler;

@Configuration
public class RetryConfig {

    @Bean
    public RetryTemplate retryTemplate() {
        return new RetryTemplate();
    }

    @Bean
    public ResponseErrorHandler responseErrorHandler() {
        return new DefaultResponseErrorHandler();
    }
}