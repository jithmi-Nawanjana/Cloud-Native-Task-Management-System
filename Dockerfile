FROM maven:3.9.9-eclipse-temurin-17 AS builder
WORKDIR /workspace

# Copy project files and build
COPY pom.xml .
COPY src ./src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre-jammy AS runtime
WORKDIR /app

# Overridable JVM flags and Spring profile
ENV JAVA_OPTS=""
ENV SPRING_PROFILES_ACTIVE=default

# Copy built jar from the builder stage
COPY --from=builder /workspace/target/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]

