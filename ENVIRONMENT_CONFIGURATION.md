# Environment Configuration Guide

This document explains how to externalize and configure localhost URLs and other environment-specific settings for the Secure AI Expense Advisor application.

## Overview

The application is now fully externalized to support multiple environments:
- **Local Development**: localhost:3000 (React) & localhost:8080 (Spring Boot)
- **Staging/Production**: Custom domains and ports

---

## Frontend Configuration (React)

### Setup

1. **Copy environment template:**
   ```bash
   cd react-ui-svc
   cp .env.example .env.local
   ```

2. **Edit `.env.local` for your environment:**

   **Local Development:**
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080
   ```

   **Production (AWS):**
   ```env
   REACT_APP_API_BASE_URL=https://api.yourdomain.com
   ```

   **Staging:**
   ```env
   REACT_APP_API_BASE_URL=https://staging-api.yourdomain.com
   ```

### How It Works

- React automatically loads variables from `.env.local` (highest priority)
- Variables must be prefixed with `REACT_APP_` to be accessible in the app
- The base URL is used by:
  - `src/api/api.js` - Centralized Axios instance
  - `src/pages/UserProfile.jsx` - Direct fetch calls
  - `src/services/transactionService.js` - Monthly report endpoint
  - `src/services/liabilityService.js` - All liability operations

### Files Using Environment Variables

| File | Usage |
|------|-------|
| `src/api/api.js` | Sets Axios baseURL |
| `src/pages/UserProfile.jsx` | Profile, email, and auth debug APIs |
| `src/services/liabilityService.js` | Liability CRUD operations |
| `src/services/transactionService.js` | Monthly reports |

---

## Backend Configuration (Spring Boot)

### Setup

1. **Edit `src/main/resources/application.properties`:**

   **Local Development (already configured):**
   ```properties
   server.port=8080
   app.cors.allowed-origins=http://localhost:3000
   ```

   **Production:**
   ```properties
   server.port=8080
   app.cors.allowed-origins=https://yourdomain.com,https://www.yourdomain.com
   ```

   **Multiple Environments (Comma-separated):**
   ```properties
   app.cors.allowed-origins=https://yourdomain.com,https://staging.yourdomain.com,http://localhost:3000
   ```

2. **Or use environment variables:**

   ```bash
   export CORS_ALLOWED_ORIGINS="https://yourdomain.com"
   export PORT=8080
   java -jar build/libs/app.jar
   ```

### Docker Deployment

When deploying via Docker, set environment variables:

```bash
docker run -e CORS_ALLOWED_ORIGINS=https://yourdomain.com \
           -e PORT=8080 \
           -p 8080:8080 \
           expense-advisor:latest
```

Or in `docker-compose.yml`:

```yaml
services:
  backend:
    image: expense-advisor:latest
    ports:
      - "8080:8080"
    environment:
      CORS_ALLOWED_ORIGINS: "https://yourdomain.com"
      PORT: 8080
      SPRING_DATASOURCE_URL: "jdbc:postgresql://db:5432/expense_db"
```

---

## Running Locally

### Terminal 1: Start Backend (Spring Boot)

```bash
# From project root
./gradlew bootRun
# Backend runs at http://localhost:8080
```

### Terminal 2: Start Frontend (React)

```bash
# From react-ui-svc directory
npm install
npm start
# Frontend runs at http://localhost:3000
```

### Terminal 3: Start PostgreSQL (if using local DB)

```bash
docker run --name postgres-local \
  -e POSTGRES_DB=expense_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15
```

---

## Production Deployment Checklist

- [ ] Update `REACT_APP_API_BASE_URL` to your production API domain
- [ ] Update `app.cors.allowed-origins` to your production frontend domain(s)
- [ ] Ensure API domain uses HTTPS (not http://)
- [ ] Verify CORS headers are correct: `Access-Control-Allow-Origin`
- [ ] Test with actual domain names (not localhost)
- [ ] Set secure cookie flags if using authentication cookies
- [ ] Enable HTTPS on both frontend and backend

---

## Troubleshooting

### 403 Forbidden Error

**Cause:** CORS misconfiguration

**Solution:**
1. Check browser console for CORS error message
2. Verify `CORS_ALLOWED_ORIGINS` matches your frontend URL exactly
3. Ensure backend is running at correct port
4. Restart backend after changing CORS config

```bash
# Check CORS is loaded in backend logs
./gradlew bootRun | grep "CORS"
```

### localhost:8080 Not Reachable

1. Verify backend is running: `curl http://localhost:8080/test/public`
2. Check firewall settings
3. Ensure port 8080 isn't used by another service

### Environment Variables Not Loading (React)

1. `.env.local` must be in `react-ui-svc/` root, not in `src/`
2. Variables must start with `REACT_APP_`
3. Restart React dev server after changing `.env.local`:
   ```bash
   npm start
   ```

---

## Environment Variables Reference

### React (Frontend)

| Variable | Default | Example |
|----------|---------|---------|
| `REACT_APP_API_BASE_URL` | `http://localhost:8080` | `https://api.example.com` |
| `REACT_APP_API_TIMEOUT` | `30000` | `60000` |

### Spring Boot (Backend)

| Variable | Property | Default | Example |
|----------|----------|---------|---------|
| `PORT` | `server.port` | `8080` | `8080` |
| `CORS_ALLOWED_ORIGINS` | `app.cors.allowed-origins` | `http://localhost:3000` | `https://yourdomain.com` |

---

## Common Deployment Scenarios

### Scenario 1: Local Development

```bash
# Backend (Terminal 1)
export PORT=8080
export CORS_ALLOWED_ORIGINS=http://localhost:3000
./gradlew bootRun

# Frontend (Terminal 2)
cd react-ui-svc
echo "REACT_APP_API_BASE_URL=http://localhost:8080" > .env.local
npm start
```

### Scenario 2: AWS Lambda + CloudFront

```properties
# application.properties
server.port=8080
app.cors.allowed-origins=https://d123abc.cloudfront.net
```

```env
# react-ui-svc/.env.local
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

### Scenario 3: Docker Compose (Staging)

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      PORT: 8080
      CORS_ALLOWED_ORIGINS: "https://staging.yourdomain.com"
      
  frontend:
    image: node:18
    working_dir: /app/react-ui-svc
    volumes:
      - .:/app
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_BASE_URL: "https://api-staging.yourdomain.com"
    command: npm start
```

---

## Security Notes

⚠️ **Never commit `.env.local` to version control!**

- `.env.local` is gitignored
- Use `.env.example` as template
- Production values should be set via CI/CD or infrastructure

---

## Support

For issues with environment configuration, check:
1. Browser Network tab for actual API URLs being called
2. Backend logs for CORS configuration loaded
3. Console errors for missing environment variables

