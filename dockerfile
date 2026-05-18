# ===== BUILD STAGE =====
#FROM gradle:8.7-jdk21 AS build
FROM eclipse-temurin:21-jre-alpine AS build

WORKDIR /app

# Copy project files
COPY . .

# Build application
RUN gradle clean build -x test

# ===== RUN STAGE =====
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy generated jar from build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Render/Cloud compatible port
EXPOSE 8080

# Start Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]