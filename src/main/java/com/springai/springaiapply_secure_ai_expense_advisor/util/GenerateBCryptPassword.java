package com.springai.springaiapply_secure_ai_expense_advisor.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerateBCryptPassword {
    private static final Logger logger = LoggerFactory.getLogger(GenerateBCryptPassword.class);

    public static void main(String[] args) {
        logger.info(new BCryptPasswordEncoder().encode("password"));
    }
}
