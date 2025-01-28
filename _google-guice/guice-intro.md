---
title: "Guice Intro"
sequence: "101"
---

A DI container should provide:

**An injector**, which prepares the object graph to inject the dependencies.
It should take care as what implementation should be injected against a particular interface reference.
Guice provides `com.google.inject.Injector` to address this problem.
It builds the object graph, tracks the dependencies for each type,
and forms what is core of a dependency injection framework.

> injector --> object graph

**A declaration of component dependencies**.
A mechanism is required to provide configuration for the dependencies,
which could serve as the basis for binding.
Assuming that two implementations of an interface exist.
In such a case, a binding mechanism is required as
what implementation should be injected to a particular interface reference.
Guice provides `com.google.inject.AbstractModule` to provide a readable configuration.
We need to simply extend this abstract class and provide configurations in it.
The `protected abstract void configure()` method is overridden,
which is a place to write configurations referred to as bindings.

**A dependent consumer**.
Guice provides `@Inject` annotation to indicate that  
a consumer is dependent on a particular dependency.
Injector takes care of initializing this dependency using the object graph.



