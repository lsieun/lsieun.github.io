---
title: "java.util.ServiceLoader (Java 9)"
sequence: "103"
---

[UP]({% link _java-theme/java-spi-index.md %})

## Important Methods

Let's look at the important methods of the `ServiceLoader` class.

- `load()`: The static method to load the services of a particular SPI.
- `findFirst()`: returns the first service available for this service provider.
- `forEach()`: useful to run some code for every service provider in this service loader instance.
- `stream()`: returns the stream of the service providers in this service loader.
- `iterator()`: returns an iterator of the service providers.
- `reload()`: reloads the service providers. It's useful when we change the service provider configurations on the fly and want to reload the services list.
