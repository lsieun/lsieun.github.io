---
title: "MBean"
sequence: "104"
---

## What Are MBeans?

JMX technology MBeans are managed beans, namely **Java objects** that represent resources to be managed.
An MBean has a management interface consisting of the following:

- Named and typed attributes that can be read and written.
- Named and typed operations that can be invoked.
- Typed notifications that can be emitted by the MBean.

For example, an MBean representing an application's configuration can have attributes representing different configuration parameters, such as a `CacheSize`.
Reading the `CacheSize` attribute will return the current size of the cache.
Writing `CacheSize` updates the size of the cache, potentially changing the behavior of the running application.
An operation such as `save` stores the current configuration persistently.
The MBean can send a **notification** such as `ConfigurationChangedNotification` when the configuration changes.

MBeans can be **standard** or **dynamic**.
**Standard MBeans** are Java objects that conform to design patterns derived from the JavaBeans component model.
**Dynamic MBeans** define their management interface at runtime.
An additional type of MBean, called **MXBean**, is added to the Java platform.

A **standard MBean** exposes the resource to be managed directly through its **attributes** and **operations**.
**Attributes** are exposed through getter and setter methods.
**Operations** are the other methods of the class that are available to managers.
All these methods are defined statically in the MBean interface and are visible to a JMX agent through introspection.
This method is the most straightforward way of making a new resource **manageable**.

A **dynamic MBean** is an MBean that defines its **management interface** at runtime.
For example, a configuration MBean determines the names and types of the attributes that it exposes, by parsing an XML file.

An **MXBean** is a type of MBean that provides a simple way to code an MBean that references only a predefined set of types.
In this way, you can ensure that the MBean is usable by any client.
It includes remote clients without any requirement that the client has access to model-specific classes,
which represents the types of your MBeans.
**The platform MBeans are all MXBeans.**

## MBean Server

To be useful, an MBean must be registered in an MBean server.
**An MBean server is a repository of MBeans.**
**Each MBean is registered with a unique name within the MBean server.**
Usually the only access to the MBeans is through the MBean server.
In other words, code does not access an MBean directly,
but rather accesses the MBean by the name through the MBean server.

The Java SE platform includes a **built-in platform MBean server**.

## Creating and Registering MBeans

There are two ways to create an MBean.

One is to construct a Java object that will be the MBean,
then use the `registerMBean` method to register it in the MBean server.

The other method is to create and register the MBean in a single operation using one of the `createMBean` methods.

The `registerMBean` method is simpler for local use, but cannot be used remotely.
The `createMBean` method can be used remotely, but sometimes requires attention to the class loading issues.
An MBean can perform actions when it is registered in or unregistered from an MBean server if it implements the `MBeanRegistration` interface.

## Instrumenting Applications

General instructions on how to instrument your applications for management by the JMX API is beyond the scope of this document.

## Reference

- [Overview of Java SE Monitoring and Management](https://docs.oracle.com/en/java/javase/11/management/overview-java-se-monitoring-and-management.html)
