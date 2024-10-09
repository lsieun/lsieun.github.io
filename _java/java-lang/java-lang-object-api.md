---
title: "java.lang.Object"
sequence: "101"
---

## equals and hashCode

The `Object` class defines both the `equals()` and `hashCode()` methods – which means
that these two methods are implicitly defined in every Java class.

```java
public class Object {
    public boolean equals(Object obj) {
        return (this == obj);
    }

    public native int hashCode();
}
```

### equals

The default implementation of `equals()` in the class `Object` says that equality is the same as object identity.

```java
public class Object {
    public boolean equals(Object obj) {
        return (this == obj);
    }
}
```

The general contract of `equals` is:

- **reflexive**: an object must equal itself, `x.equals(x)` should return `true`.
- **symmetric**: `x.equals(y)` must return the same result as `y.equals(x)`
- **transitive**: if `x.equals(y)` and `y.equals(z)` then also `x.equals(z)`
- **consistent**: multiple invocations of `x.equals(y)` consistently return `true` or consistently return `false`
- For any non-null reference value `x`, `x.equals(null)` should return `false`.

```java
class Money {
    int amount;
    String currencyCode;

    @Override
    public boolean equals(Object o) {
        // same reference
        if (o == this) {
            return true;
        }

        // different type
        if (!(o instanceof Money)) {
            return false;
        }

        // field value
        Money other = (Money) o;
        boolean currencyCodeEquals = (this.currencyCode == null && other.currencyCode == null)
                || (this.currencyCode != null && this.currencyCode.equals(other.currencyCode));
        return this.amount == other.amount && currencyCodeEquals;
    }
}
```

### Violating equals() Symmetry With Inheritance

If the criteria for `equals()` is such common sense, then how can we violate it at all?
Well, **violations happen most often if we extend a class that has overridden `equals()`.**
Let's consider a `Voucher` class that extends our `Money` class:

```java
class WrongVoucher extends Money {

    private String store;

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof WrongVoucher))
            return false;
        WrongVoucher other = (WrongVoucher)o;
        boolean currencyCodeEquals = (this.currencyCode == null && other.currencyCode == null)
          || (this.currencyCode != null && this.currencyCode.equals(other.currencyCode));
        boolean storeEquals = (this.store == null && other.store == null)
          || (this.store != null && this.store.equals(other.store));
        return this.amount == other.amount && currencyCodeEquals && storeEquals;
    }

    // other methods
}
```

At first glance, the `Voucher` class and its override for `equals()` seem to be correct.
And both `equals()` methods behave correctly as long as we compare `Money` to `Money` or `Voucher` to `Voucher`.
But what happens, if we compare these two objects:

```text
Money cash = new Money(42, "USD");
WrongVoucher voucher = new WrongVoucher(42, "USD", "Amazon");

voucher.equals(cash) => false // As expected.
cash.equals(voucher) => true // That's wrong.
```

**That violates the symmetry criteria of the `equals()` contract.**

### Fixing equals() Symmetry With Composition

To avoid this pitfall, we should **favor composition over inheritance.**

Instead of subclassing `Money`, let's create a `Voucher` class with a `Money` property:

```text
class Voucher {

    private Money value;
    private String store;

    Voucher(int amount, String currencyCode, String store) {
        this.value = new Money(amount, currencyCode);
        this.store = store;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Voucher))
            return false;
        Voucher other = (Voucher) o;
        boolean valueEquals = (this.value == null && other.value == null)
          || (this.value != null && this.value.equals(other.value));
        boolean storeEquals = (this.store == null && other.store == null)
          || (this.store != null && this.store.equals(other.store));
        return valueEquals && storeEquals;
    }

    // other methods
}
```

Now equals will work symmetrically as the contract requires.

### hashCode

`hashCode()` returns an integer representing the current instance of the class.
We should calculate this value consistent with the definition of equality for the class.
Thus, **if we override the `equals()` method, we also have to override `hashCode()`.**

#### hashCode() Contract

The general contract of `hashCode` is:

- **internal consistency**: the value of `hashCode()` may only change if a property that is in `equals()` changes.
- **equals consistency**: **objects that are equal to each other must return the same `hashCode`.**
- **collisions**: **unequal objects may have the same `hashCode`.**


The 2nd criteria of the `hashCode` methods contract has an important consequence:
**If we override `equals()`, we must also override `hashCode()`**.
And this is by far the most widespread violation regarding the contracts of the `equals()` and `hashCode()` methods.

## Verifying the Contracts

If we want to check whether our implementations adhere to the Java SE contracts,
and also to best practices, we can use the `EqualsVerifier` library.

Let's add the `EqualsVerifier` Maven test dependency:

```xml
<dependency>
    <groupId>nl.jqno.equalsverifier</groupId>
    <artifactId>equalsverifier</artifactId>
    <version>3.15.1</version>
    <scope>test</scope>
</dependency>
```

## References

- [Baeldung: Java equals() and hashCode() Contracts](https://www.baeldung.com/java-equals-hashcode-contracts)
- [Guide to hashCode() in Java](https://www.baeldung.com/java-hashcode)
