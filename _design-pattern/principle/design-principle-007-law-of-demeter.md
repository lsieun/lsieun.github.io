---
title: "迪米特法则"
sequence: "107"
---

The Law of Demeter (LoD), or principle of least knowledge,
provides object-oriented design principles for **modular software development**.
It helps to build components that are less dependent on each other and loosely coupled.

## Understanding the Law of Demeter

The Law of Demeter is one of several design guidelines in object-oriented programming.
It recommends that **objects should avoid accessing the internal data and methods of other objects.**
Instead, an object should only interact with its immediate dependencies.

Simply put, the Law says that a method `X` of class `C` should only invoke the methods of:

- Class `C` itself
- An object created by `X`
- An object passed as an argument to `X`
- An object held in an instance variable of `C`
- A static field

This sums up the law in five points.

## 示例

### The First Rule

The first rule says that **a method `X` of class `C` should only invoke the methods of `C`**:

```java
class Greetings {
    
    String generalGreeting() {
        return "Welcome" + world();
    }
    String world() {
        return "Hello World";
    }
}
```

Here, the `generalGreeting()` method invokes the `world()` methods in the same class.
This adheres to the law as they belong to the same class.

### The Second Rule

**Method `X` of class `C` should only invoke the methods of an object created by `X`**:

```text
String getHelloBrazil() {
    HelloCountries helloCountries = new HelloCountries();
    return helloCountries.helloBrazil();
}
```

In the code above, we create an object of `HelloCountries` and invoke `helloBrazil()` on it.
This follows the law as the `getHelloBrazil()` method itself created the object.

### The Third Rule

Furthermore, the third rule state that **method `X` should only invoke an object passed as an argument to `X`**:

```text
String getHelloIndia(HelloCountries helloCountries) {
    return helloCountries.helloIndia();
}
```

Here, we pass an `HelloCountries` object as an argument to `getHelloIndia()`.
Passing the object as an argument gave the method close proximity to the object,
and it can invoke its method without violating the rule of Demeter.

### The Fourth Rule

Method `X` of class `C` should only invoke the method of an object held in an instance variable of `C`:

```text
// ... 
HelloCountries helloCountries = new HelloCountries();
  
String getHelloJapan() {
    return helloCountries.helloJapan();
}
// ...
```

In the code above, we create an instance variable, `helloCountries`, in the `Greetings` class.
Then, we invoke the `helloJapan()` method on the instance variable inside the `getHelloJapan()` method.
This conforms to the fourth rule.

### The Fifth Rule

Finally, **method `X` of class `C` can invoke the method of a static field created in `C`**:

```text
// ...
static HelloCountries helloCountriesStatic = new HelloCountries();
    
String getHellStaticWorld() {
    return helloCountriesStatic.helloStaticWorld();
}
// ...
```

Here, the method invokes `helloStaticWorld()` method on a static object created in the class.
