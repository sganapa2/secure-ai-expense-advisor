package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.User;
import com.springai.springaiapply_secure_ai_expense_advisor.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        // TEMP: skip DB validation for now
        System.out.println("USERNAME: " + user.getUsername());
        System.out.println("PASSWORD: " + user.getPassword());
        if ("admin".equals(user.getUsername()) && "password".equals(user.getPassword())) {
            return jwtUtil.generateToken(user.getUsername());
        }

        throw new RuntimeException("Invalid credentials");
    }
}