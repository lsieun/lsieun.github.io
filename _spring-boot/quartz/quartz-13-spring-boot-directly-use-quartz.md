---
title: "Quartz: Directly use Quartz"
sequence: "113"
---

## Quick Example

### pom.xml

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.quartz-scheduler</groupId>
        <artifactId>quartz</artifactId>
    </dependency>
</dependencies>
```

### Application

```java
import org.quartz.*;
import org.quartz.impl.StdSchedulerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@SpringBootApplication
public class QuartzApplication {
    public static void main(String[] args) throws SchedulerException {
        SpringApplication.run(QuartzApplication.class, args);
        onStartup();
    }

    private static void onStartup() throws SchedulerException {
        JobDetail job = JobBuilder.newJob(SimpleJob.class)
                .usingJobData("param", "value") // add a parameter
                .build();

        Date afterFiveSeconds = Date.from(LocalDateTime.now().plusSeconds(5)
                .atZone(ZoneId.systemDefault()).toInstant());
        Trigger trigger = TriggerBuilder.newTrigger()
                .startAt(afterFiveSeconds)
                .build();

        SchedulerFactory schedulerFactory = new StdSchedulerFactory();
        Scheduler scheduler = schedulerFactory.getScheduler();
        scheduler.start();
        scheduler.scheduleJob(job, trigger);
    }
}
```

### Job

```java
import org.quartz.Job;
import org.quartz.JobExecutionContext;

import java.text.MessageFormat;

public class SimpleJob implements Job {

    @Override
    public void execute(JobExecutionContext context) {
        System.out.println(MessageFormat.format("Job: {0}", getClass()));
    }

}
```


