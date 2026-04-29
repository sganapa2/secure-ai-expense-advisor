package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.User;
import com.springai.springaiapply_secure_ai_expense_advisor.repository.UserRepository;
import com.springai.springaiapply_secure_ai_expense_advisor.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication authentication) {
        String username = authentication.getName();
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        // Don't return password in response
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User profileUpdate, Authentication authentication) {
        String username = authentication.getName();
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User existingUser = userOptional.get();

        // Update email if provided
        if (profileUpdate.getEmail() != null && !profileUpdate.getEmail().trim().isEmpty()) {
            existingUser.setEmail(profileUpdate.getEmail().trim());
        }

        User savedUser = userRepository.save(existingUser);

        // Don't return password in response
        savedUser.setPassword(null);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/test-email")
    public ResponseEntity<String> testEmail(Authentication authentication) {
        try {
            String username = authentication.getName();
            Optional<User> userOptional = userRepository.findByUsername(username);

            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOptional.get();

            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("No email configured for your account");
            }

            emailService.sendTestEmail(user.getEmail());
            return ResponseEntity.ok("Test email sent successfully to: " + user.getEmail());

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Failed to send test email: " + e.getMessage());
        }
    }

    @GetMapping("/debug/auth")
    public ResponseEntity<String> debugAuth(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("No authentication found");
        }

        return ResponseEntity.ok("Authenticated as: " + authentication.getName() +
                                " | Authorities: " + authentication.getAuthorities());
    }
}
