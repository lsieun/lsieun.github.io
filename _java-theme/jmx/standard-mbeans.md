---
title: "Standard MBeans"
sequence: "102"
---

[UP]({% link _java-theme/java-jmx-index.md %})

## What Is a Management Interface?

The idea of a **management interface** revolves around the notion of an **application resource**,
which is any abstraction within an application that provides value.

With respect to JMX (and more broadly, system management), only those resources that must be managed are significant.

Each **resource** that is to be managed must provide a **management interface**,
which consists of the attributes and operations it exposes
so that it can be monitored and controlled by a management application.

## How Do Standard MBeans Work?

### Describing the Management Interface

JMX provides us with a set of patterns to follow when instrumenting our application resources as standard MBeans.

There are three patterns you must follow when instrumenting your resources as standard MBeans:

- The management interface of the resource must have the same name as the resource's Java class, followed by "MBean";
  it must be defined as a Java interface;
  and it must be implemented by the resource to be managed using the `implements` keyword.  
- The implementing class must contain at least **one public constructor**.
- Getters and setters for attributes on the management interface must follow strict naming conventions.

#### Pattern 01: public interface

The management interface must be defined using the Java `interface` keyword,
it must have `public` visibility, and it must be strictly named.

The management interface is contained in its own `.java` file and must have the same name as its corresponding interface.
Thus, every standard MBean requires at least two source code files:
one for the interface and one for the class that implements the interface.

#### Pattern 02: public constructor

The class that implements the MBean interface must have **at least one constructor** declared with `public` visibility.
This class may have any number of public constructors, but it must have at least one.
If you do not provide a constructor, the compiler will generate a no-argument constructor with `public` visibility.
This will work fine for your MBeans,
but I recommend that you explicitly declare a no-argument constructor for these cases,
as your code will follow the rule and be more readable as well.

#### Pattern 03: getters and setters

When defining an attribute on the management interface, you must follow strict naming standards.

If the attribute is readable, it must be declared on the interface (and subsequently implemented) as `getAttributeName()`,
where `AttributeName` is the name of the attribute you want to expose, and take no parameters. This method is called a **getter**.

For `boolean` values, preceding the attribute name with "is" is a common idiom and
one that is acceptable according to the JMX standard MBean design patterns.

If an attribute is writable, the naming pattern is similar to that for readable attributes,
only the word "get" is replaced with "set,"
and the attribute takes a single parameter whose type is that of the attribute to be set.
This method is called a **setter**.

There are two rules about setters:

- The setter can take only a single parameter.
  If you unintentionally provide a second parameter to what you thought you were coding as a setter,
  the MBean server will expose your "setter" as an operation.  
- The parameter types must be the same for read/write attributes,
  or your management interface will not be what you expect.
  In fact, if you have a read/write attribute where the getter returns a different data type than
  the setter takes as a parameter, the setter controls.

#### A word about introspection

Introspection literally means to "look inside" and is performed by the MBean server
to ensure compliance on the part of your MBeans when they are registered.
Because it is possible to write Java code that cleanly compiles and executes
but does not follow the standard MBean design patterns,
the MBean server looks inside your MBean to make sure you followed the patterns correctly.  

When your MBean is registered by the agent,
the MBean server uses Java's reflection API to crawl around inside the MBean and
make sure that the three design patterns were followed.
If they were, your MBean is compliant and its registration proceeds.
If not, the MBean server throws an exception at the agent.

**Introspection takes place only when your MBean is registered by the agent.**
Depending on the code paths your application takes when instantiating your MBean classes,
the notification (via an exception) that one of your MBeans is not compliant will appear only
when the MBean is registered.

### Standard MBean Inheritance Patterns






