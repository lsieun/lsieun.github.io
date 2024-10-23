---
title: "RMI Intro"
sequence: "101"
---

[UP]({% link _java-theme/java-rmi-index.md %})

在 IntelliJ IDEA 的 `lib\util_rt.jar` 里，在 `com.intellij.execution.rmi` 包下有一些类，我觉得，可能是学习的资料。

The RMI-related classes and interfaces are in the `java.rmi` module.

## What Is Java Remote Method Invocation?

Although it is possible to invoke a method on an object that resides in a different JVM
(possibly on a different machine too) using **socket programming**, it is not easy to code.
To achieve this, Java provides a separate mechanism called **Java Remote Method Invocation** (**Java RMI**).

Internally, **RMI** uses **sockets** to handle access to the remote object and to invoke its methods.

An **RMI application** consists of two programs, **a client** and **a server**, that run in two different JVMs.
The **server program** creates Java objects and
makes them accessible to the remote client programs to invoke methods on those objects.
The **client program** needs to know the location of the remote objects on the server, so it can invoke methods on them.
The **server program** creates a remote object and registers (or binds) its reference to an RMI registry.

An **RMI registry** is a name service that is used to bind a remote object reference to a name,
so a client can get the reference of the remote object using a name-based lookup in the registry.
An RMI registry runs in a separate process from the server program.
It is supplied as a tool called `rmiregistry`.
When you install a JDK/JRE on your machine,
it is copied in the `bin` sub-directory under the JDK/JRE installation directory.

After the client program gets the remote reference of a remote object,
it invokes methods using that reference as if it were a reference to a local object.
**RMI technology takes care of the details** of
invoking the methods on the remote reference in the server program running on a different JVM on a different machine.
**In an RMI application, Java code is written in terms of interfaces.**
The **server program** contains implementations for the interfaces.
The **client program** uses interfaces along with the remote object references
to invoke methods on the remote object that exists in the server's JVM.
All Java library classes supporting Java RMI are in the `java.rmi` package and its subpackages.

