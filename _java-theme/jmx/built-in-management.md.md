---
title: "JVM Built-in Management"
sequence: "103"
---

The JMX technology can also be used to monitor and manage the Java virtual machine (Java VM).

The Java VM has **built-in instrumentation** that enables you to monitor and manage it by using the JMX technology.
These **built-in management** utilities are often referred to as out-of-the-box management tools for the Java VM.
To monitor and manage different aspects of the Java VM,
the Java VM includes a **platform MBean server** and **special MXBeans** for use by management applications that conform to the JMX specification.

## Platform MXBeans and the Platform MBean Server

The **platform MXBeans** are a set of MXBeans that is provided with the Java SE platform for
monitoring and managing the Java VM and other components of the Java Runtime Environment (JRE).
Each **platform MXBean** encapsulates a part of Java VM functionality,
such as the class-loading system, just-in-time (JIT) compilation system, garbage collector, and so on.
These MXBeans can be displayed and interacted with by using a monitoring and management tool
that complies with the JMX specification,
to enable you to monitor and manage these different VM functionalities.
One such monitoring and management tool is the Java SE platform's **JConsole** graphical user interface (GUI).

The Java SE platform provides a **standard platform MBean server** in which these **platform MXBeans** are registered.
The platform MBean server can also register any other MBeans you wish to create.

## JConsole

The Java SE platform includes the JConsole monitoring and management tool, which complies with the JMX specification.
JConsole uses the extensive instrumentation of the Java VM (the platform MXBeans)
to provide information about the performance and resource consumption of applications that are running on the Java platform.

## Reference

- [Monitoring and Management of the Java Virtual Machine](https://docs.oracle.com/javase/tutorial/jmx/overview/javavm.html)
