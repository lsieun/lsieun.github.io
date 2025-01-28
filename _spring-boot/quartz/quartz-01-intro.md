---
title: "Quartz Intro"
sequence: "101"
---

```text
              ┌─── Job
              │
              │                 ┌─── Quartz JobBuilder
              ├─── JobDetail ───┤
              │                 └─── Spring JobDetailFactoryBean
              │
              │                 ┌─── Quartz StdSchedulerFactory
              ├─── Scheduler ───┤
Quartz API ───┤                 └─── Spring SchedulerFactoryBean
              │
              │                 ┌─── Quartz TriggerBuilder
              ├─── Trigger ─────┤
              │                 └─── Spring SimpleTriggerFactoryBean
              │
              │                                   ┌─── JobDetail
              │                 ┌─── component ───┤
              │                 │                 └─── Trigger
              └─── JobStore ────┤
                                │                 ┌─── In-Memory
                                └─── store ───────┤
                                                  │                 ┌─── JobStoreTX
                                                  └─── JDBC ────────┤
                                                                    └─── JobStoreCMT
```

```text
                                               ┌─── JobDetail (what) ───┼─── Job
Quartz Role ───┼─── Scheduler (coordinator) ───┤
                                               └─── Trigger (when)
```

## Reference

Baeldung

- [Introduction to Quartz](https://www.baeldung.com/quartz)
- [Scheduling in Spring with Quartz](https://www.baeldung.com/spring-quartz-schedule)
- [The @Scheduled Annotation in Spring](https://www.baeldung.com/spring-scheduled-tasks)
- [A Guide to the Spring Task Scheduler](https://www.baeldung.com/spring-task-scheduler)

- [lsieun/learn-java-quartz](https://github.com/lsieun/learn-java-quartz)

- [How to Schedule Jobs With Quartz in Spring Boot-非常好](https://hackernoon.com/how-to-schedule-jobs-with-quartz-in-spring-boot)
- [Adding Quartz to Spring Boot](https://dzone.com/articles/adding-quartz-to-spring-boot)
- [Guide to Quartz with Spring Boot - Job Scheduling and Automation](https://stackabuse.com/guide-to-quartz-with-spring-boot-job-scheduling-and-automation/)
- [Spring Boot Quartz 使用介绍](https://www.jianshu.com/p/06c4307214b7)

- [Introduction to Drools](https://www.baeldung.com/drools)
