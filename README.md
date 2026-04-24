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