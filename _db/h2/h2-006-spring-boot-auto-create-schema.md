---
title: "Automatically Create Schemas for H2 In-Memory Database"
sequence: "106"
---

**When connecting to an H2 in-memory database, the schema may not exist.**
This is because in-memory databases are transient in nature and only survive
as long as the application they are running inside is also running.
Once that application is terminated, the entire contents of the in-memory database are lost.

When working with Spring Boot applications,
**we can also utilize familiar Spring data properties to initialize H2 in-memory databases.**

## Reference

- [Automatically Create Schemas for H2 In-Memory Database](https://www.baeldung.com/java-h2-automatically-create-schemas)
- [Spring Boot With H2 Database](https://www.baeldung.com/spring-boot-h2-database)
- [Quick Guide on Loading Initial Data with Spring Boot](https://www.baeldung.com/spring-boot-data-sql-and-schema-sql)

