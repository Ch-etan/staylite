# StayLite

![CI](https://github.com/Ch-etan/staylite/actions/workflows/ci.yml/badge.svg)

Airbnb-style booking platform with a booking API that prevents double-bookings at the database level.

**Stack:** Java 25, Spring Boot 4, PostgreSQL 16, Docker, GitHub Actions, AWS EC2

## Run locally

```bash
docker compose up -d
cd backend
./mvnw spring-boot:run
```

- API: http://localhost:8080/api/listings
- Health: http://localhost:8080/actuator/health

## CI pipeline

Every push and pull request to `main` triggers GitHub Actions, which:

1. Starts a throwaway PostgreSQL container
2. Builds the backend with Java 25
3. Runs all tests (unit and full-app)
4. Uploads the test reports and the built jar as artifacts

Dependabot opens weekly PRs for GitHub Actions and Maven dependency updates, and each one is tested by CI before merging.