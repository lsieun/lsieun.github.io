---
title: "Introduction to Plexus"
sequence: "103"
---

[UP](/maven-index.html)


The most important feature of an IoC container implemented in Java is
a mechanism called **dependency injection**.

> IOC container --> DI

The basic idea of IoC is that the control of creating and managing objects
is removed from the code itself and placed into the hands of an IoC framework.

Using dependency injection in an application
that has been programmed to interfaces,
you can create components
which are not bound to specific implementations of these interfaces.
Instead, you program to interfaces and then configure Plexus
to connect the appropriate implementation to the appropriate component.

While your code deals with interfaces,
you can capture the dependencies between classes and components in an XML file
that defines components, implementation classes, and the relationships between your components.
In other words, you can write isolated components,
then you can wire them together using an XML file
that defines how the components are wired together.

In the case of Plexus, system components are defined with an XML document
that is found in `META-INF/plexus/components.xml`.

## injecting dependencies

In a Java IoC container, there are several methods for injecting dependencies values
into a component object: **constructor**, **setter**, or **field injections**.

Although Plexus is capable of all three dependency injection techniques,
Maven only uses two types: field and setter injection.

### Constructor Injection

Constructor injection is populating an object's values through its constructor
when an instance of the object is created.

For example, if you had an object of type `Person` which had a constructor `Person(String name, Job job)`,
you could pass in values for both `name` and the `job` via this constructor.

### Setter Injection

Setter injection is using the setter method of a property on a Java bean to
populate object dependencies.

For example, if you were working with a `Person` object with the properties `name` and `job`,
an IoC container which uses setter injection,
would create an instance of Person using a no-arg constructor.
Once it had an instance of `Person`,
it would proceed to call the `setName()` and `setJob()` methods.

### Field Injection

Both Constructor and Setter injection rely on a call to a public method.
Using Field injection, an IoC container populates a component's dependencies by setting an object's fields directly.

For example, if you were working with a `Person` object that had two fields `name` and `job`,
your IoC container would populate these dependencies by setting these fields directly
(i.e. `person.name = "Thomas"; person.job = job;`)
