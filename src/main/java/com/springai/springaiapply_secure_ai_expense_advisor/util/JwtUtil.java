package com.springai.springaiapply_secure_ai_expense_advisor.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key = Keys.hmacShaKeyFor(
            "mysecretkeymysecretkeymysecretkey123456".getBytes()
    );

    // Use the static key for consistent JWT validation
    private final SecretKey LibGeneratedSecuredKey = Keys.hmacShaKeyFor(
            "mysecretkeymysecretkeymysecretkey12345678901234567890".getBytes(StandardCharsets.UTF_8)
    );

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
                .signWith(LibGeneratedSecuredKey)
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(LibGeneratedSecuredKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

}