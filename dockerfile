# ===== BUILD STAGE =====
FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copy all project files
COPY . .

# Give permission to gradlew
RUN chmod +x gradlew

# Build Spring Boot app
RUN ./gradlew clean build -x test

# ===== RUN STAGE =====
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy generated jar
COPY --from=0 /app/build/libs/*.jar app.jar

# Cloud port
EXPOSE 8080

# Start application
ENTRYPOINT ["java", "-jar", "app.jar"]