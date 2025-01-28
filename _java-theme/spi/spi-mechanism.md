---
title: "SPI Mechanism"
sequence: "102"
---

[UP]({% link _java-theme/java-spi-index.md %})

## How Does ServiceLoader Work?

We can describe the **SPI** as **a discovery mechanism** since it automatically loads the different providers defined in the classpath.

The `ServiceLoader` is the main tool used to do that by providing some methods to allow this discovery:

### iterator()

Creates an iterator to lazily load and instantiate the available providers.
At this moment, the providers are not instantiated yet, that's why we called it a lazy load.
The instantiation is done when calling the methods `next()` or `hasNext()` of the iterator.
The iterator maintains a cache of these providers for performance reasons so that they don't get loaded with each call.
A simple way to get the providers instantiated is through a loop:

```text
Iterator<ServiceInterface> providers = loader.iterator();
while (providers.hasNext()) {
  ServiceProvider provider = providers.next();
  //actions...
}
```

### stream()

Creates a stream to lazily load and instantiate the available providers.
The stream elements are of type `Provider`.
The providers are loaded and instantiated when invoking the `get()` method of the `Provider` class.

### reload()

Clears the loader's provider cache and reloads the providers.
This method is used in situations in which new service providers are installed into a running JVM.


Apart from the service providers implemented and the service provider interface created,
we need to register these providers so that the `ServiceLoader` can identify and load them.
**The configuration files need to be created in the folder `META-INF/services`.**
