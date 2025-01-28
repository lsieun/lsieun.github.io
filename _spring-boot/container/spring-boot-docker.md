---
title: "Spring Boot + Docker"
sequence: "104"
---

Containers have emerged as the preferred means of
packaging an application with all the software and operating system dependencies and
then shipping that across to different environments.

## Building a Container Image the Conventional Way

We first build an executable JAR and as part of the Docker file instructions,
copy the executable JAR over a base JRE image after applying necessary customizations.

### Building the Application

```text
mvn clean package
```

### Creating a Docker File

- File: `Dockerfile`

```text
FROM openjdk:8-jdk-alpine
LABEL org.opencontainers.image.authors="lsieun"
COPY target/docker-message-server-1.0.0.jar message-server-1.0.0.jar
ENTRYPOINT ["java","-jar","/message-server-1.0.0.jar"]
```

```text
FROM adoptopenjdk:11-jre-hotspot
LABEL org.opencontainers.image.authors="lsieun"
ENV PORT=8080
EXPOSE ${PORT}

RUN mkdir -p /usr/local/work
WORKDIR /usr/local/work




ENTRYPOINT ["java","-jar","/application.jar"]
```

```text
FROM openjdk:8-jdk-alpine
EXPOSE 8080
ARG JAR_FILE=target/demo-app-1.0.0.jar
ADD ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

```text
FROM openjdk:8-jdk-alpine
ENV PORT=8080
EXPOSE ${PORT}
RUN mkdir /usr/local/work
WORKDIR /usr/local/work
COPY hello-world.jar ./app.jar
ENTRYPOINT java -jar ./app.jar --server.port=${PORT}
```

```text
FROM adoptopenjdk:11-jre-hotspot
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} application.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/application.jar"]
```

```text
FROM openjdk:11.0.13-jre
ENV TZ Asia/Shanghai
ADD ./jm-hydraulic-model-service-biz/target/jm-hydraulic-model-service-biz-2022.11-SNAPSHOT.jar /app/jm-hydraulic-model-service-biz.jar
CMD ["java","-jar","/app/jm-hydraulic-model-service-biz.jar", "--spring.profiles.active=prod"]
EXPOSE 4186
```

```text
ENTRYPOINT ["java", "-Dspring.profiles.active=test", "-jar", "/app.jar"]
```

### Building the Container Image

```text
docker build  -t usersignup:v1 .
```

## Reference

- [Spring Boot Docker](https://spring.io/guides/topicals/spring-boot-docker/)
- [Creating Efficient Docker Images with Spring Boot 2.3](https://spring.io/blog/2020/08/14/creating-efficient-docker-images-with-spring-boot-2-3)
- [Creating Optimized Docker Images for a Spring Boot Application](https://reflectoring.io/spring-boot-docker/)
  这里的东西很多，我还没有学会呢，有机会再看一看
- [Build your Java image](https://docs.docker.com/language/java/build-images/)
- Baeldung
    - [Dockerizing a Spring Boot Application](https://www.baeldung.com/dockerizing-spring-boot-application)
    - [Creating Docker Images with Spring Boot](https://www.baeldung.com/spring-boot-docker-images)
    - [Starting Spring Boot Application in Docker With Profile](https://www.baeldung.com/spring-boot-docker-start-with-profile)
    - [Accessing Spring Boot Logs in Docker](https://www.baeldung.com/ops/spring-boot-logs-docker)
    - [Introduction to Docker Compose](https://www.baeldung.com/ops/docker-compose)
    - [Reusing Docker Layers with Spring Boot](https://www.baeldung.com/docker-layers-spring-boot)
    - [Running Spring Boot Applications With Minikube](https://www.baeldung.com/spring-boot-minikube)
