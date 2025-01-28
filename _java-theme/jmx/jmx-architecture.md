---
title: "JMX Architecture"
sequence: "102"
---

## Overview of the JMX Technology

[Overview of the JMX Technology](https://docs.oracle.com/javase/tutorial/jmx/overview/index.html)

The Java Management Extensions (JMX) technology is a standard part of the Java Platform, Standard Edition (Java SE platform).
The JMX technology was added to the platform in the Java 2 Platform, Standard Edition (J2SE) 5.0 release.

**The JMX technology** provides a simple, standard way of managing **resources** such as **applications**, **devices**, and **services**.
Because the JMX technology is dynamic, you can use it to **monitor and manage resources as they are created, installed and implemented**.
You can also use the JMX technology to **monitor and manage the Java Virtual Machine (Java VM)**.

- monitor and manage
  - resources
  - JVM

The **JMX specification** defines the architecture, design patterns, APIs, and services
in the Java programming language for management and monitoring of applications and networks.

Using the JMX technology, **a given resource** is instrumented by one or more Java objects known as **Managed Beans**, or **MBeans**.
These **MBeans** are registered in a core-managed object server, known as an **MBean server**.
The **MBean server** acts as a **management agent** and can run on most devices that have been enabled for the Java programming language.

The specifications define **JMX agents** that you use to manage **any resources** that have been correctly configured for management.
A **JMX agent** consists of **an MBean server**, in which **MBeans** are registered,
and **a set of services** for handling the **MBeans**.
In this way, **JMX agents** directly control **resources** and make them available to **remote management applications**.

The way in which resources are instrumented is completely independent from the management infrastructure.
Resources can therefore be rendered manageable regardless of how their management applications are implemented.

The JMX technology defines **standard connectors** (known as **JMX connectors**)
that enable you to access **JMX agents** from **remote management applications**.
JMX connectors using different protocols provide the same management interface.
Consequently, a management application can manage resources transparently,
regardless of the communication protocol used.
JMX agents can also be used by systems or applications that are not compliant with the JMX specification,
as long as those systems or applications support JMX agents.

```text
                                                                   ┌─── applications
                                                                   │
                                              ┌─── resource ───────┼─── devices
                                              │                    │
                                              │                    └─── services
                                              │
                    ┌─── Instrumentation ─────┤                                           ┌─── SmartBoyMBean
                    │                         │                    ┌─── standard MBean ───┤
                    │                         │                    │                      └─── StupidBoyMBean
                    │                         │                    │
                    │                         └─── Managed Bean ───┤
                    │                                              │                      ┌─── MemoryMXBean
                    │                                              │                      │
                    │                                              └─── MXBean ───────────┼─── RuntimeMXBean
                    │                                                                     │
                    │                                                                     └─── ThreadMXBean
                    │                         ┌─── an MBean Server
JMX Architecture ───┤                         │
                    │                         │                                           ┌─── JMXServiceURL
                    │                         │                                           │
                    ├─── JMX Agent ───────────┤                                           ├─── JMXConnectorServer
                    │                         │                         ┌─── connector ───┤
                    │                         │                         │                 ├─── JMXConnector
                    │                         │                         │                 │
                    │                         └─── a set of services ───┤                 └─── MBeanServerConnection
                    │                                                   │
                    │                                                   │
                    │                                                   └─── adaptor
                    └─── Remote Management
```

JMX technology is defined by two closely related **specifications** developed
through the Java Community Process (JCP) as Java Specification Request (JSR) 3 and JSR 160:
[Link](https://docs.oracle.com/javase/8/docs/technotes/guides/jmx/overview/architecture.html)

- JSR 3, Java Management Extensions Instrumentation and Agent Specification
- JSR 160, Java Management Extensions Remote API

The following table shows that the management architecture can be broken down into three levels.

- The first two levels, instrumentation and agent, are defined by JSR 3.
- The remote management level is defined by JSR 160.

| Level             | Description                                                                                                                                                                                                                                                                             |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Instrumentation   | Resources, such as applications, devices, or services, are instrumented using Java objects called Managed Beans (MBeans). MBeans expose their management interfaces, composed of attributes and operations, through a JMX agent for remote management and monitoring.                   |
| Agent             | The main component of a JMX agent is the MBean server. This is a core managed object server in which MBeans are registered. A JMX agent also includes a set of services for handling MBeans. JMX agents directly control resources and make them available to remote management agents. |
| Remote Management | Protocol adaptors and standard connectors make a JMX agent accessible from remote management applications outside the agent's Java Virtual Machine (Java VM).                                                                                                                           |

## Architecture of the JMX Technology

The JMX technology can be divided into three levels, as follows:

- Instrumentation
- JMX agent
- Remote management

### Instrumentation

To manage resources using the JMX technology, you must first instrument the resources in the Java programming language.
You use Java objects known as MBeans to implement the access to the resources' instrumentation.
MBeans must follow the design patterns and interfaces defined in the JMX specification.
Doing so ensures that all MBeans provide managed resource instrumentation in a standardized way.
In addition to **standard MBeans**, the JMX specification also defines a special type of MBean called an **MXBean**.
An MXBean is an MBean that references only a pre-defined set of data types.
Other types of MBean exist, but this trail will concentrate on standard MBeans and MXBeans.

Once a **resource** has been instrumented by **MBeans**, it can be managed through a **JMX agent**.
MBeans do not require knowledge of the JMX agent with which they will operate.

MBeans are designed to be flexible, simple, and easy to implement.
Developers of applications, systems, and networks can make their products manageable in a standard way
without having to understand or invest in complex management systems.
Existing resources can be made manageable with minimum effort.

In addition, the instrumentation level of the JMX specification provides a **notification mechanism**.
This mechanism enables MBeans to generate and propagate notification events to components of the other levels.

## JMX Agent

A **JMX technology-based agent** (**JMX agent**) is a standard management agent
that directly controls resources and makes them available to remote management applications.
JMX agents are usually located on the same machine as the resources they control,
but this arrangement is not a requirement.

The core component of a **JMX agent** is the **MBean server**, a managed object server in which **MBeans** are registered.
A JMX agent also includes a set of services to manage MBeans,
and at least one communications adaptor or connector to allow access by a management application.

When you implement a JMX agent, you do not need to know the semantics or functions of the resources that it will manage.
In fact, a JMX agent does not even need to know which resources it will serve
because any resource instrumented in compliance with the JMX specification can use any JMX agent
that offers the services that the resource requires.
Similarly, the JMX agent does not need to know the functions of the management applications that will access it.

## Remote Management

JMX technology instrumentation can be accessed in many different ways,
either through existing management protocols such as the Simple Network Management Protocol (SNMP) or through proprietary protocols.
The MBean server relies on protocol **adaptors** and **connectors** to make a JMX agent accessible from management applications outside the agent's Java Virtual Machine (Java VM).

Each **adaptor** provides a view through a specific protocol of all MBeans that are registered in the MBean server.
For example, an HTML adaptor could display an MBean in a browser.

**Connectors** provide a manager-side interface that handles the communication between manager and JMX agent.
Each connector provides the same remote management interface through a different protocol.
When a remote management application uses this interface,
it can connect to a JMX agent transparently through the network, regardless of the protocol.

The JMX technology provides **a standard solution** for exporting **JMX technology instrumentation** to **remote applications** based on **Java Remote Method Invocation** (**Java RMI**).
In addition, the **JMX Remote API** defines an optional protocol based directly on TCP sockets, called the **JMX Messaging Protocol** (**JMXMP**).
An implementation of the JMX Remote API does not have to support this optional protocol.
The Java SE platform does not include the optional protocol.

The **JMX Remote API** specification describes how you can advertise and find JMX agents using existing discovery and lookup infrastructures.
Examples of how to do this are provided and are described in the **Java Management Extensions (JMX) Technology** Tutorial.
The specification does not define its own discovery and lookup service.
The use of existing discovery and lookup services is optional:
alternatively you can encode the addresses of your JMX API agents in the form of URLs, and communicate these URLs to the manager.

## Java Virtual Machine Instrumentation

The **Java Virtual Machine** (**Java VM**) is highly instrumented using **JMX technology**.
You can easily start a JMX agent to access the built-in Java VM instrumentation,
and thereby monitor and manage the Java VM remotely by means of JMX technology.

To find out more about using JMX technology to monitor and manage the Java VM, see the [Java SE Monitoring and Management Guide](https://docs.oracle.com/javase/8/docs/technotes/guides/management/index.html).

## Reference

- [Architecture of the JMX Technology](https://docs.oracle.com/javase/tutorial/jmx/overview/architecture.html)
- [JMX Architecture](https://docs.oracle.com/javase/8/docs/technotes/guides/jmx/overview/architecture.html)
