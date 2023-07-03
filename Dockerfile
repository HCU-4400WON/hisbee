FROM gradle:jdk17 AS server-builder
WORKDIR /backend
COPY . .
RUN gradle clean && gradle build

FROM amazoncorretto:17
ENV JAR_NAME app.jar
WORKDIR /webapp
COPY --from=server-builder /backend/build/libs/$JAR_NAME .
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]