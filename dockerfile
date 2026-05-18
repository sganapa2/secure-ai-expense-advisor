# ===== BUILD STAGE =====
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy project files
COPY . .

# Gradle wrapper permission
RUN chmod +x gradlew

# Build app
RUN ./gradlew clean build -x test

# ===== RUN STAGE =====
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy generated jar
COPY --from=0 /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Run Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]