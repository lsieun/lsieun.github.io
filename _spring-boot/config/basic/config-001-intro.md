---
title: "Managing Configurations"
sequence: "101"
---

Depending on how you develop and manage applications,
you can have multiple environments (e.g., `dev`, `test`, `staging`, and `prod`) for an application in your organization.

- `dev`
- `test`
- `staging`: Staging is an environment for us to test and view your web application and changes
  before they go live to the world (production).
- `prod`

Spring Boot provides several approaches to let you externalize application configurations
without altering the application source code.
The various approaches include

- property files,
- YAML files,
- environment variables, and
- command-line arguments.

The configurations we use can be classified into two categories:

- Spring Boot built-in properties and
- custom properties.

Managing application configuration is a key part of any application, and Spring Boot applications are no exception.
Depending on how you develop and manage applications,
you can have multiple environments (e.g., dev, test, staging, and prod)
for an application in your organization.
For instance, you can have one environment for
development, one for testing, one for staging, and one for production.
For all these environments, your **application code** mostly remains the same,
and you need to manage **many different configurations based on the environment**.
As an example, the _database configurations_ or the _security configurations_ are different in all these environments.
Besides, as the application grows, and you incorporate new features,
it becomes more tedious to manage the configurations.

Spring Boot provides several approaches to let you **externalize application configurations**
**without altering the application source code.**
The various approaches include **property files**, **YAML files**, **environment variables**,
and **command-line arguments**.


## Reference

- [Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#features.external-config)







