---
title: "Property"
sequence: "121"
---

## Java

###  What Is a Property?

In essence, **properties** define the public state of an object that can be read, written, and observed for changes.

Apart from **simple properties**, Java also supports **indexed**, **bound**, and **constrained** properties.
An **indexed property** is an array of values that are accessed using indexes.
An indexed property is implemented using an array data type.
A **bound property** sends a notification to all listeners when it is changed.
A **constrained property** is a bound property in which a listener can veto(拒不接受) a change.

### What Is a Binding?

## JavaFX Properties

```text
                                                  ┌─── ReadOnlyIntegerProperty
                                                  │
                                                  │                               ┌─── BooleanProperty
javafx.beans.property ───┼─── ReadOnlyProperty ───┤                               │
                                                  │                               ├─── IntegerProperty ───┼─── IntegerPropertyBase ───┼─── SimpleIntegerProperty ───┼─── ReadOnlyIntegerWrapper
                                                  │                               │
                                                  └─── Property ──────────────────┼─── LongProperty
                                                                                  │
                                                                                  ├─── FloatProperty
                                                                                  │
                                                                                  └─── DoubleProperty
```

## Property Class Hierarchy

### Observable

```java
public interface Observable {
    void addListener(InvalidationListener listener);
    void removeListener(InvalidationListener listener);
}
```

```java
@FunctionalInterface
public interface InvalidationListener {
    public void invalidated(Observable observable);
}
```

### ObservableValue

```java
public interface ObservableValue<T> extends Observable {
    void addListener(ChangeListener<? super T> listener);
    void removeListener(ChangeListener<? super T> listener);
    T getValue();
}
```

```java
@FunctionalInterface
public interface ChangeListener<T> {
    void changed(ObservableValue<? extends T> observable, T oldValue, T newValue);
}
```

### ReadOnlyProperty

```java
public interface ReadOnlyProperty<T> extends ObservableValue<T> {
    Object getBean();
    String getName();
}
```

### WritableValue

```java
public interface WritableValue<T> {
    T getValue();
    void setValue(T value);
}
```

### Property

```java
public interface Property<T> extends ReadOnlyProperty<T>, WritableValue<T> {
    boolean isBound();
    void bind(ObservableValue<? extends T> observable);
    void unbind();
    void bindBidirectional(Property<T> other);
    void unbindBidirectional(Property<T> other);
}
```

## Property Events

### Handling Property Invalidation Events

Properties in JavaFX use **lazy evaluation**.
When an invalid property becomes invalid again, an invalidation event is not generated.
An invalid property becomes valid when it is recomputed, for example, by calling its get() or getValue() method.

### Handling Property Change Events

Calling the `set()` method with the same value does not fire a property change event.

```java
import javafx.beans.property.IntegerProperty;
import javafx.beans.property.SimpleIntegerProperty;
import javafx.beans.value.ObservableValue;

public class ChangeTest {
    public static void main(String[] args) {
        IntegerProperty counter = new SimpleIntegerProperty(100);

        // Add a change listener to the counter property
        counter.addListener(ChangeTest::changed);

        System.out.println("\nBefore changing the counter value-1");
        counter.set(101);
        System.out.println("After changing the counter value-1");

        System.out.println("\nBefore changing the counter value-2");
        counter.set(102);
        System.out.println("After changing the counter value-2");

        // Try to set the same value
        System.out.println("\nBefore changing the counter value-3");
        counter.set(102); // No change event is fired.
        System.out.println("After changing the counter value-3");

        // Try to set a different value
        System.out.println("\nBefore changing the counter value-4");
        counter.set(103);
        System.out.println("After changing the counter value-4");
    }

    public static void changed(ObservableValue<? extends Number> prop,
                               Number oldValue,
                               Number newValue) {
        System.out.print("Counter changed: ");
        System.out.println("Old = " + oldValue +
                ", new = " + newValue);
    }
}
```

### Handling Invalidation and Change Events

You need to consider performance when you have to decide
between using **invalidation listeners** and **change listeners**.

Generally, invalidation listeners perform better than change listeners.
The reason is twofold:

- Invalidation listeners make it possible to compute the value lazily.
- Multiple invalidations in a row fire only one invalidation event.

However, which listener you use depends on the situation at hand.
A rule of thumb is that if you **read the value of the property** inside the **invalidation event handler**,
you should use a **change listener** instead.
When you read the value of a property inside an invalidation listener,
it triggers the recomputation of the value,
which is automatically done before firing a change event.
If you do not need to read the value of a property, use **invalidation listeners**.





