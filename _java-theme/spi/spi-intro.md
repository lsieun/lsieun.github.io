---
title: "SPI Intro"
sequence: "101"
---

[UP]({% link _java-theme/java-spi-index.md %})

Java SPI provides an easy way to dynamically configure and load the services in our application.
However, it depends a lot on the service configuration file and any change in the file can break the application.

## Terms and Definitions

To work with extensible applications, we need to understand the following terms:

- **Service Provider Interface**: A set of interfaces or abstract classes that a service defines.
  It represents the classes and methods available to your application.
- **Service Provider**: also Called **Provider**, is a specific implementation of a service.
  It is identified by placing the provider configuration file in the resources directory `META-INF/services`.
  It must be available in the application's classpath.
- **ServiceLoader**: The main class used to discover and load a service implementation lazily.
  The `ServiceLoader` maintains a cache of services already loaded.
  Each time we invoke the service loader to load services,
  it first lists the cache's elements in instantiation order,
  then discovers and instantiates the remaining providers.
