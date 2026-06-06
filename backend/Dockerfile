# --- Build Stage ---
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
# Downloand dependencies first (cache layer)
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -Dmaven.test.skip=true

# --- Runtime Stage ---
FROM eclipse-temurin:17-jre
WORKDIR /app
# Copy fat jar from build stage
COPY --from=build /app/target/todo-backend-1.0.0.jar app.jar
# Expose default Spring Boot port
EXPOSE 8080
# Create directory for persistent H2 data
RUN mkdir -p data
# Run spring boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
