# ---------- Stage 1: build the jar ----------
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Copy only the build files first, so the dependency download is cached
# and re-runs only when pom.xml changes
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B -ntp dependency:go-offline

# Now copy the source and package (tests already ran in CI)
COPY src/ src/
RUN ./mvnw -B -ntp package -DskipTests

# ---------- Stage 2: small runtime image ----------
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Links the image to your repo on GitHub (used by GHCR)
LABEL org.opencontainers.image.source="https://github.com/Ch-etan/staylite"

# Don't run as root
RUN addgroup -S app && adduser -S app -G app
COPY --from=build /app/target/*.jar app.jar
USER app

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

# Use at most 75% of the container's memory for the heap (important on small EC2)
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]