package com.springai.springaiapply_secure_ai_expense_advisor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.springai.springaiapply_secure_ai_expense_advisor.service.AIFinancialAdvisorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
/*@ActiveProfiles("local")*/
@ActiveProfiles("test")
public class TransactionFlowTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;

    @MockBean
    private AIFinancialAdvisorService aIFinancialAdvisorService;

    @BeforeEach
    void setup() {
        when(aIFinancialAdvisorService.generateInsights(anyDouble(), anyDouble(), anyDouble(), anyDouble()))
                .thenReturn("Test AI response");
    }

    // 🔐 Step 1: Login & get token
    private void login() throws Exception {

        String request = """
                {
                  "username": "admin",
                  "password": "password"
                }
                """;

        String response = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        token = response.replace("\"", ""); // clean JWT
    }

    // ➕ Step 2: Add transaction
    private void addTransaction(String body) throws Exception {

        mockMvc.perform(post("/transactions")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());
    }

    // 🚀 MAIN TEST FLOW
    @Test
    void fullFlowTest() throws Exception {

        // Step 1: login
        login();

        // Step 2: add expense
        addTransaction("""
                {
                  "title": "Food",
                  "amount": 300,
                  "type": "EXPENSE",
                  "category": "Food"
                }
                """);

        // Step 3: add investment
        addTransaction("""
                {
                  "title": "SIP",
                  "amount": 5000,
                  "type": "INVESTMENT",
                  "category": "Mutual Fund"
                }
                """);

        // Step 4: fetch expenses
        mockMvc.perform(get("/transactions?type=EXPENSE")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        // Step 5: monthly report
        mockMvc.perform(get("/transactions/monthly-report?year=2026&month=4")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalExpense").exists())
                .andExpect(jsonPath("$.totalInvestment").exists());

        // Step 6: insights
        mockMvc.perform(get("/insights")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.advice").exists());
    }
}