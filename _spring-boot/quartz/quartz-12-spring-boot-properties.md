---
title: "Quartz: Spring Boot Properties"
sequence: "112"
---

## Quick Start

### pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-quartz</artifactId>
    </dependency>
</dependencies>
```

### application.properties

```text
cron-string=0/5 * * * * ?
```

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class QuartzApplication {
    public static void main(String[] args) {
        SpringApplication.run(QuartzApplication.class, args);
    }
}
```

### Config

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class QuartzConfig {
}
```

### Task

```java
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class PeriodicTask {
    @Scheduled(cron = "${cron-string}")
    public void everyFiveSeconds() {
        System.out.println("Periodic task: " + new Date());
    }
}
```

To use properties, you can utilize `fixedRateString`, `fixedDelayString`,
and `initialDelayString` parameters instead of
`fixedRate`, `fixedDelay` and `initialDelay` accordingly.

