FROM eclipse-temurin:17-jdk-jammy AS builder
WORKDIR /workspace

# Pre-download Maven wrapper dependencies
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
# Copy source and build
COPY src/ src/
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:17-jre-jammy AS runtime
WORKDIR /app

# Provide overridable JVM flags and Spring profile
ENV JAVA_OPTS=""
ENV SPRING_PROFILES_ACTIVE=default

# Copy built jar from the builder stage
ARG JAR_FILE=target/*.jar
COPY --from=builder /workspace/${JAR_FILE} app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]

