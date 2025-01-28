---
title: "Guice Injector"
sequence: "102"
---

An injector object basically picks up all declared configuration in modules and prepares a graph of objects.  

Once request for an instance is made, it does two things:

- Resolves the dependencies using configurations, which are called **bindings**.
  Bindings could be explicit or implicit.
- Wires the object graph to instantiate the requested object.

Injector could be initialized using any of the four available static APIs in the `Injector` class.

The preferred API accepts the variable number of arguments of `com.google.inject.Module` type.
Here, we could pass all the instances of various modules, which have binding configurations.

```text
Injector injector = Guice.createInjector(...);
```

Injector then could be used to create the instances of the objects, which we need in our application logic.
The instances which are created using injector are termed as the **Guice managed objects**.
For all the Guice managed objects, which are having various dependencies annotated with `@Inject`,
dependency injection is done by injector.
For example, following is a way to prepare an instance of `FlightEngine`.

```text
FlightEngine flightEngine = injector.getInstance(FlightEngine.class);
```

## Various kinds of injections

There are three ways of injecting dependencies:

- Field injection
- Method injection
- Constructor injection

### Field injection

The kind of injection we have used so far is basically the field injection.
A field if annotated with `@Inject` annotation gets dependency injected in it.
The member variables often have accessibility as `private`,
which makes them non-testable, so it is not a preferred way.

```text
@Inject 
private FlightSupplier flightSupplier;
```

### Method injection

In case we need to have our fields properly testable,
we usually declare them as `private`, along with getter and setter APIs.
We could inject the dependency by applying the `@Inject` annotation over the setter API,
which is in fact a suggested way.

```text
@Inject
public void setFlightSupplier (FlightSupplier flightSupplier) {
    this.flightSupplier = flightSupplier;
}
```

This way of injecting dependencies is termed as method injection.

### Constructor injection

Constructor injection is a way to combine instantiation of objects with dependency injection.
Assume a case where in the constructor for `FlightEngine` is changed and
`FlightSupplier` needs to be supplied as an argument to the constructor.

In such a case, all we need to do is to annotate the `FlightEngine` constructor with `@Inject` annotation.
In this way the injector while instantiation of the `FlightEngine` instance, injects the dependency directly.

```text
@Inject
public FlightEngine(CSVSupplier flightSupplier) {
    this.flightSupplier = flightSupplier;
}
```


