---
title: "Quartz: Spring Boot"
sequence: "111"
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

### Application

注意：在`QuartzApplication`类，需要添加`@EnableScheduling`注解；否则，下面用到`@Scheduled`注解将无法生效。

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class QuartzApplication {
    public static void main(String[] args) {
        SpringApplication.run(QuartzApplication.class, args);
    }
}
```

### Task

```java
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class PeriodicTask {
    @Scheduled(cron = "0/5 * * * * ?")
    public void everyFiveSeconds() {
        System.out.println("Periodic task: " + new Date());
    }
}
```

## Spring

### @EnableScheduling

`@EnableScheduling` enables Spring's scheduled task execution capability.
This enables detection of `@Scheduled` annotations on any Spring-managed bean in the container.

### @Scheduled

The `@Scheduled` marks a method to be scheduled.
Exactly one of the `cron`, `fixedDelay`, or `fixedRate` attributes must be specified.

```java
@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(Schedules.class)
public @interface Scheduled {

	/**
	 * A special cron expression value that indicates a disabled trigger: {@value}.
	 * <p>This is primarily meant for use with <code>${...}</code> placeholders,
	 * allowing for external disabling of corresponding scheduled methods.
	 * @since 5.1
	 */
	String CRON_DISABLED = ScheduledTaskRegistrar.CRON_DISABLED;


	/**
	 * A cron-like expression, extending the usual UN*X definition to include triggers
	 * on the second, minute, hour, day of month, month, and day of week.
	 * <p>For example, {@code "0 * * * * MON-FRI"} means once per minute on weekdays
	 * (at the top of the minute - the 0th second).
	 * <p>The fields read from left to right are interpreted as follows.
	 * <ul>
	 * <li>second</li>
	 * <li>minute</li>
	 * <li>hour</li>
	 * <li>day of month</li>
	 * <li>month</li>
	 * <li>day of week</li>
	 * </ul>
	 * <p>The special value {@link #CRON_DISABLED "-"} indicates a disabled cron
	 * trigger, primarily meant for externally specified values resolved by a
	 * <code>${...}</code> placeholder.
	 * @return an expression that can be parsed to a cron schedule
	 */
	String cron() default "";

	String zone() default "";

	long fixedDelay() default -1;

	String fixedDelayString() default "";

	long fixedRate() default -1;

	String fixedRateString() default "";

	long initialDelay() default -1;

	String initialDelayString() default "";

	TimeUnit timeUnit() default TimeUnit.MILLISECONDS;

}
```

### 注解的方法

The annotated method must expect no arguments.
It will typically have a `void` return type;
if not, the returned value will be ignored when called through the scheduler.

```java
@Component
public class PeriodicTask {
    @Scheduled(cron = "0/5 * * * * ?")
    public void everyFiveSeconds() {
        System.out.println("Periodic task: " + new Date());
    }
}
```

### 四个值

The `@Scheduled` annotation supports the following parameters:

- `fixedRate` - Allows you to run a task at a specified fixed interval.
- `fixedDelay` - Execute a task with a fixed delay between the completion of the last invocation and the start of the next.
- `initialDelay` - The parameter is used with `fixedRate` and `fixedDelay` to wait
  before the first execution of the task with the specified delay.
- `cron` - Set the task execution schedule using the cron-string.
  Also supports macros `@yearly` (or `@annually`), `@monthly`, `@weekly`, `@daily` (or `@midnight`), and `@hourly`.

By default, `fixedRate`, `fixedDelay` and `initialDelay` are set in **milliseconds**.
This can be changed using the `timeUnit` parameter, setting the value from `NANOSECONDS` to `DAYS`.
