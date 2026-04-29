# Secure AI Expense Advisor

Spring Boot project to build a secure backend system with AI-based financial suggestions.

## Tech Stack
- Java
- Spring Boot
- H2 Database

## Status
- Project initialized
- DB connected


Built a secure Spring Boot microservice implementing JWT-based authentication and 
resolved real-world security and API integration challenges.

Day-2
## 🔐 Authentication & Security

- Implemented stateless authentication using JWT
- Created custom login API: `/auth/login`
- Disabled default Spring Security login and configured custom security rules

## 🛠️ Challenges Solved

- Fixed 403 Forbidden error caused by CSRF protection
- Resolved JSON mapping issue (null username)
- Handled JWT weak key exception by upgrading to secure key (256-bit+)

## 📌 Learnings

- Understanding of Spring Security filter chain
- JWT token generation and security standards
- Debugging real-world backend issues

## 🔐 Secured APIs with JWT

### Authentication Flow
1. User logs in via `/auth/login`
2. Server returns JWT token
3. Client sends token in header:
   Authorization: Bearer <token>

### Protected Endpoint
- `/expenses` → requires valid JWT

### Security Features
- Stateless authentication
- Custom JWT filter
- Token validation on each request

### Example

###without token
→ 403 Forbidden

#### With token
→ Access granted


## 📬 Postman Collection

You can test all APIs using the Postman collection:

Location:
docs/postman-collection/Secure AI Expense Advisor APIs.postman_collection.json

Steps:
1. Import into Postman
2. Run Login API
3. Copy token
4. Set token in collection variable
5. Test secured APIs

## ✅ Features
- JWT-based authentication
- Expense & Investment tracking
- Monthly financial reports
- Category-based filtering
- Rule-based insights
- Integration tests (MockMvc)

## 🧪 Run Tests
./gradlew test

## ✅ Features Implemented

- User Authentication (JWT based)
- Add / View / Delete Transactions
- User-specific data isolation
- Transaction Types:
   - INCOME
   - EXPENSE
   - INVESTMENT
- Dynamic Category Dropdown (based on Type)
- Validation for clean financial data
- Analytics Dashboard:
   - Total Income
   - Total Expense
   - Savings Calculation
- **Email Notifications** for investment maturity reminders

## 📧 Email Notifications Setup

### Features
- **Maturity Reminders**: Automatic emails 1 week before investment maturity
- **Daily Schedule**: Notifications sent at 9 AM daily
- **Investment Types**: FD, RD, RBI Bonds supported
- **User Profile**: Configure email in Profile tab

### Email Configuration

1. **Update `application.properties`**:
```properties
# Email Configuration (Configure with your SMTP settings)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

2. **For Gmail**:
   - Enable 2-Factor Authentication
   - Generate App Password: https://support.google.com/accounts/answer/185833
   - Use App Password (not regular password)

3. **Test Email**:
   - Go to Profile tab in the app
   - Update your email address
   - Click "Test Email" to verify configuration

### Notification Schedule
- **Runs Daily**: 9:00 AM
- **Advance Notice**: 1 week before maturity
- **Coverage**: FD, RD, RBI Bonds only
- **Email Content**: Investment details, maturity date, amount

## 🐛 Debug Endpoints

### Authentication Debug
- **Endpoint**: `GET /api/user/debug/auth`
- **Purpose**: Check authentication status and troubleshoot 403 errors
- **Usage**: Click "🔍 Debug Auth" button in Profile tab
- **Response**: Shows authenticated username and authorities, or "No authentication found"

### When to Use
- Getting 403 Forbidden errors on authenticated endpoints
- Verifying JWT token validity
- Debugging authentication issues
- Checking if user is properly logged in

### Example Response
```
✅ Authenticated as: admin | Authorities: []
❌ 401 Unauthorized: Your JWT token is invalid or expired.
❌ Network Error: Failed to fetch
```

### What Each Response Means
- **"Authenticated as: [username]"** → ✅ Token is valid, user is logged in
- **"No authentication found"** → ❌ No valid token, need to log in
- **"401 Unauthorized"** → ❌ Token expired/invalid, log out and log in again
- **"403 Forbidden"** → ❌ Security configuration issue
- **"Network Error"** → ❌ Server not running or network issues

### Production Note
- This endpoint is primarily for **development and debugging**
- Can be **disabled or removed** in production builds
- Helps troubleshoot authentication issues during development
