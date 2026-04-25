package com.springai.springaiapply_secure_ai_expense_advisor.config;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.User;
import com.springai.springaiapply_secure_ai_expense_advisor.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Profile({"local", "dev"})
@Component
public class UserDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(UserDataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Value("${app.default.user:admin}")
    private String defaultUser;

    @Value("${app.default.password:}")
    private String defaultPassword;


    @Override
    public void run(String... args) {

        if (userRepository.findByUsername("admin").isEmpty()) {

            User user = new User();
            user.setUsername("admin");
            user.setPassword(passwordEncoder.encode("password"));

            userRepository.save(user);

            logger.info("✅ Default user created: admin/password");
        }
    }

    @PostConstruct
    public void init() {
        if (defaultPassword == null || defaultPassword.isBlank()) {
            logger.info("⚠️ No default password provided.");
            defaultPassword = "password"; // fallback for local/dev if not set
        }

        if (userRepository.findByUsername(defaultUser).isEmpty()) {
            User user = new User();
            user.setUsername(defaultUser);
            user.setPassword(passwordEncoder.encode(defaultPassword));
            userRepository.save(user);
        }
    }
/*
    @PostConstruct
    public void init() {

        if (userRepository.findByUsername("admin").isEmpty()) {

            User user = new User();
            user.setUsername("admin");
            String rawPassword = passwordEncoder.encode("password");
            user.setPassword(rawPassword);

            userRepository.save(user);

            logger.info("✅ Default user created: admin / {} ", rawPassword);
        }
    }*/

}