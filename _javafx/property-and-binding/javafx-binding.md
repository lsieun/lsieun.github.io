---
title: "Binding"
sequence: "122"
---

In JavaFX, a binding is an expression that evaluates to a value.
It consists of one or more observable values known as its **dependencies**.

A binding observes its dependencies for changes and recomputes its value automatically.

**JavaFX uses lazy evaluation for all bindings.**
When a binding is initially defined or when its dependencies change, its value is marked as invalid.
The value of an invalid binding is computed when it is requested next time,
usually using its `get()` or `getValue()` method.
All property classes in JavaFX have built-in support for binding.

A binding has an `isValid()` method that returns `true` if it is valid; otherwise, it returns `false`.
You can get the value of a `NumberBinding`
using the methods `intValue()`, `longValue()`, `floatValue()`, and `doubleValue()`
as `int`, `long`, `float`, and `double`, respectively.

A binding, internally, adds **invalidation listeners** to all of its **dependencies*.
When any of its dependencies become invalid, it marks itself as invalid.
An invalid binding does not mean that its value has changed.
All it means is that it needs to recompute its value when the value is requested next time.

In JavaFX, you can also bind a property to a binding.
Recall that a binding is an expression that is synchronized with its dependencies automatically.
Using this definition, a bound property is a property
whose value is computed based on an expression,
which is automatically synchronized when the dependencies change.

## Unidirectional and Bidirectional Bindings

A binding has a direction, which is the direction in which changes are propagated.
JavaFX supports two types of binding for properties: **unidirectional binding** and **bidirectional binding**.
A **unidirectional binding** works only in one direction;
changes in dependencies are propagated to the bound property and not vice versa.
A **bidirectional binding** works in both directions;
changes in dependencies are reflected in the property and vice versa.

```java
public interface Property<T> extends ReadOnlyProperty<T>, WritableValue<T> {
    boolean isBound();
    void bind(ObservableValue<? extends T> observable);
    void unbind();
    void bindBidirectional(Property<T> other);
    void unbindBidirectional(Property<T> other);
}
```

The `bind()` method of the `Property` interface creates a **unidirectional binding**
between a property and an `ObservableValue`, which could be a complex expression.
The `bindBidirectional()` method creates a **bidirectional binding**
between a property and another property of the same type.

### Unidirectional binding

**Unidirectional binding has a restriction.**
Once a property has a unidirectional binding, you cannot change the value of the property directly;
its value must be computed automatically based on the binding.
You must unbind it before changing its value directly.

**Unidirectional binding has another restriction.**
A property can have only one unidirectional binding at a time.

### bidirectional binding

A bidirectional binding works in both directions.
**It has some restrictions.**
It can only be created between properties of the same type.

Bidirectional binding **removes some restrictions** that are present for unidirectional binding.
**A property can have multiple bidirectional bindings at the same time.**
A bidirectional bound property can also be changed independently;
the change is reflected in all properties that are bound to this property.


