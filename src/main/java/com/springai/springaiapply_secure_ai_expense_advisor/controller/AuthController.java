package com.springai.springaiapply_secure_ai_expense_advisor.controller;

import com.springai.springaiapply_secure_ai_expense_advisor.entitiy.User;
import com.springai.springaiapply_secure_ai_expense_advisor.service.UserService;
import com.springai.springaiapply_secure_ai_expense_advisor.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;


    @PostMapping("/login")
    public String login(@RequestBody User request) {

        User user = userService.validateUser(
                request.getUsername(),
                request.getPassword()
        );

        return jwtUtil.generateToken(user.getUsername());
    }


    /**
     * @deprecated This method is obsolete and should not be used.
     * Use {@link #login(User)} instead for proper user validation.
     */
    @PostMapping("/loginObsolete")
    @Deprecated
    public String login2(@RequestBody User user) {

        logger.debug("USERNAME: {}", user.getUsername());
        logger.debug("PASSWORD: {}", user.getPassword());
        if ("admin".equals(user.getUsername()) && "password".equals(user.getPassword())) {
            return jwtUtil.generateToken(user.getUsername());
        }
        throw new RuntimeException("Invalid credentials");
    }
}