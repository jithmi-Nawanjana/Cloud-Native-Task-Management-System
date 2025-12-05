# Cloud Native Task Management System

Initial Spring Boot 3.3 service skeleton for a task management platform targeting Java 17 (can be switched to 21) and MySQL.

## Tech Stack
- Spring Boot 3.3 (Java 17 by default; update `pom.xml` to target 21 if available)
- Spring Web, Spring Data JPA, Spring Security
- MySQL 8.x
- Maven Wrapper (`mvnw`)

## Getting Started
1. **Prerequisites**
   - JDK 17 (`java -version`) — upgrade the `java.version` property in `pom.xml` if you prefer Java 21
   - Docker Desktop _or_ local MySQL 8 instance
   - (Optional) `direnv`/shell exports for database credentials

2. **Install dependencies**
   ```bash
   cd "/Users/jithminawanjana/projects/Cloud Native - Task Management System"
   ./mvnw -q verify
   ```

3. **Configure environment**
   - Copy `src/main/resources/application.properties` and update values if needed.
   - Or export credentials before running the app:
     ```bash
     export DB_USERNAME=task_app_user
     export DB_PASSWORD=change-me
     ```

4. **Provision MySQL schema**
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS task_management_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   mysql -u root -p -e "CREATE USER IF NOT EXISTS 'task_app_user'@'%' IDENTIFIED BY 'change-me';"
   mysql -u root -p -e "GRANT ALL ON task_management_db.* TO 'task_app_user'@'%'; FLUSH PRIVILEGES;"
   mysql -u root -p task_management_db < src/main/resources/schema.sql
   ```
   The schema script creates `users`, `projects`, `tasks`, and `comments` tables with foreign keys suitable for a basic task workflow.

5. **Run the service**
   ```bash
   ./mvnw spring-boot:run
   ```
   The API will be available at `http://localhost:8080`.

## Run with Docker
1. **Build image**
   ```bash
   docker build -t cloudnative/task-management:dev .
   ```
2. **Run container (connects to an existing MySQL instance)**
   ```bash
   docker run --rm -p 8080:8080 \
     -e DB_USERNAME=task_app_user \
     -e DB_PASSWORD=change-me \
     -e SPRING_DATASOURCE_URL="jdbc:mysql://host.docker.internal:3306/task_management_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC" \
     cloudnative/task-management:dev
   ```
   Adjust `SPRING_DATASOURCE_URL` (or other Spring properties) to point at your database. You can also override `JAVA_OPTS` or `SPRING_PROFILES_ACTIVE` at runtime.

3. **Optional: run MySQL via Docker**
   ```bash
   docker network create tasknet
   docker run -d --name task-mysql --network tasknet -e MYSQL_ROOT_PASSWORD=rootpw -e MYSQL_DATABASE=task_management_db mysql:8.4
   docker run --rm --name task-app --network tasknet -p 8080:8080 \
     -e DB_USERNAME=root \
     -e DB_PASSWORD=rootpw \
     -e SPRING_DATASOURCE_URL="jdbc:mysql://task-mysql:3306/task_management_db?useSSL=false&serverTimezone=UTC" \
     cloudnative/task-management:dev
   ```

## Run Backend + MySQL via Docker Compose
```bash
docker compose up -d --build
```
- Builds the backend image (if needed) and starts `task-app` plus a MySQL 8.4 instance (`task-mysql`)
- MySQL credentials are defined in `docker-compose.yml`; override by exporting `MYSQL_ROOT_PASSWORD`, `MYSQL_PASSWORD`, etc. before running `docker compose`
- Logs: `docker compose logs -f app mysql`
- Stop and remove containers: `docker compose down`
## Authentication & Testing
- Set `JWT_SECRET` (and optional `JWT_EXPIRATION_MS`) before running the app or Compose stack. Default values exist for local dev but you should override them for any shared environment.
- Register a user: `POST /auth/register` with JSON body  
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "PlainText!23"
  }
  ```
  Response includes a `token`.
- Login: `POST /auth/login` with `email`/`password` to obtain another JWT.
- Include the token in subsequent requests: `Authorization: Bearer <token>`.
- Task APIs exposed:
  - `GET /tasks`
  - `POST /tasks`
  - `PUT /tasks/{id}`
  - `DELETE /tasks/{id}`
  - `GET /tasks/search?status=IN_PROGRESS&priority=HIGH&assigneeId=1`

## Next Steps
- Add validation annotations and better error messaging
- Implement role-based authorization (admin vs regular user)
- Introduce Flyway/Liquibase for migration tracking