---
title: "Platform MXBeans and Platform MBean Server"
sequence: "105"
---

## Platform MXBeans

A platform MXBean is an MBean for monitoring and managing the Java VM, and other components of the Java Runtime Environment (JRE).
Each MXBean encapsulates a part of VM functionality such as the class loading system, just-in-time (JIT) compilation system, garbage collector, and so on.

The following table lists all the platform MXBeans and the aspect of the VM that they manage.
Each platform MXBean has a unique `javax.management.ObjectName` for registration in the platform MBean server.
A Java VM may have zero, one, or more than one instance of each MXBean, depending on its function, as shown in the table.

| Interface                                                    | Part of VM Managed          | Object Name                                        | Instances per VM |
|--------------------------------------------------------------|-----------------------------|----------------------------------------------------|------------------|
| ClassLoadingMXBean                                           | Class loading system        | java.lang:type=ClassLoading                        | One              |
| CompilationMXBean                                            | Compilation system          | java.lang:type=Compilation                         | Zero or one      |
| GarbageCollectorMXBean                                       | Garbage collector           | java.lang:type=GarbageCollector,name=collectorName | One or more      |
| LoggingMXBean                                                | Logging system              | java.util.logging:type=Logging                     | One              |
| MemoryManagerMXBean (subinterface of GarbageCollectorMXBean) | Memory pool                 | java.lang:type=MemoryManager,name=managerName      | One or more      |
| MemoryPoolMXBean                                             | Memory                      | java.lang:type=MemoryPool,name=poolName            | One or more      |
| MemoryMXBean                                                 | Memory system               | java.lang:type=Memory                              | One              |
| OperatingSystemMXBean                                        | Underlying operating system | java.lang:type=OperatingSystem                     | One              |
| RuntimeMXBean                                                | Runtime system              | java.lang:type=Runtime                             | One              |
| ThreadMXBean                                                 | Thread system               | java.lang:type=Threading                           | One              |

The details on platform MXBeans (apart from `LoggingMXBean`) are described in the `java.lang.management` API reference.
The `LoggingMXBean` interface is described in the `java.util.logging` API reference.

## Platform MBean Server

The **platform MBean server** can be shared by different managed components running within the same Java VM.
You can access the platform MBean server with the method `ManagementFactory.getPlatformMBeanServer()`.
The first call to this method creates the platform MBean server and registers the platform MXBeans using their unique object names.
Subsequently, this method returns the initially created platform `MBeanServer` instance.

MXBeans that are created and destroyed dynamically (for example, memory pools and managers) will automatically be registered and unregistered in the platform MBean server.
If the system property `javax.management.builder.initial` is set, then the platform MBean server will be created by the specified `MBeanServerBuilder` parameter.

You can use the **platform MBean server** to register **other MBeans** besides the **platform MXBeans**.
This enables all MBeans to be published through the same MBean server, and makes network publishing and discovery easier.

## Enabling the Ready-to-Use Management

To monitor a Java platform using the JMX API, you must do the following:

- Enable the **JMX agent** (another name for the **platform MBean server**) when you start the Java VM. You can enable the JMX agent for:
  - Local monitoring, for a client management application running on the local system.
  - Remote monitoring, for a client management application running on a remote system.
- Monitor the Java VM with a tool that complies with the JMX specification, such as JConsole.

```text
JMX agent = platform MBean server
```

### Local Monitoring and Management

Earlier while starting the Java VM or Java application, you set the following property to allow the JMX client access to a local Java VM:

```text
com.sun.management.jmxremote
```

Setting this property registered the Java VM platform's MBeans and published the remote method invocation (RMI) connector through a private interface.
This setting allows JMX client applications to monitor a local Java platform, that is, a Java VM running on the same machine as the JMX client.

In the current Java SE platform, **it is no longer necessary to set this system property**.
Any application that is started on the current Java SE platform supports the **Attach API**,
and will automatically be made available for local monitoring and management when needed.

For example, previously, to enable the JMX agent for the Java SE sample application Notepad, you would run the following commands:

```text
% cd JDK_HOME/demo/jfc/Notepad
% java -Dcom.sun.management.jmxremote -jar Notepad.jar
```

In the preceding command, `JDK_HOME` is the directory in which the Java Development Kit (JDK) is installed.
In the current Java SE platform, you have to run the following command to start Notepad.

```text
% java -jar Notepad.jar
```

After Notepad has been started, a JMX client using the **Attach API** can then enable the out-of-the-box management agent to monitor and manage the Notepad application.

### Remote Monitoring and Management

By default, the remote stubs for locally created remote objects that are sent to client contains the IP address of the local host in dotted-quad format.
For remote stubs to be associated with a specific interface address, the `java.rmi.server.hostname` system property must be set to IP address of that interface.

To enable monitoring and management from remote systems, you must set the following system property when you start the Java VM:

```text
com.sun.management.jmxremote.port=portNum
```

Where, `portNum` is the port number to enable JMX RMI connections.
Ensure that you specify an unused port number.
In addition to publishing an RMI connector for local access,
setting this property publishes an additional RMI connector in a private read-only registry at the specified port using the name, `jmxrmi`.
The port number to which the RMI connector will be bound using the system property:

```text
com.sun.management.jmxremote.rmi.port
```

## Using the Platform MBean Server

An MBean server is a repository of MBeans that provides management applications access to MBeans.
Applications do not access MBeans directly, but instead access them through the MBean server using their unique `ObjectName` class.
An MBean server implements the interface `javax.management.MBeanServer`.

The **platform MBean server** was introduced in Java SE 5.0,
and is an MBean server that is built into the Java Virtual Machine (Java VM).
The platform MBean server can be shared by all managed components that are running in the Java VM.
You access the platform MBean server using the `java.lang.management.ManagementFactory` method `getPlatformMBeanServer`.
Of course, you can also create your own MBean server using the `javax.management.MBeanServerFactory` class.
**However, there is generally no need for more than one MBean server, so using the platform MBean server is recommended.**

## Accessing Platform MXBeans

A **platform MXBean** is an MBean for monitoring and managing the **Java VM**.
Each MXBean encapsulates a part of the VM functionality.

A management application can access platform MXBeans in three different ways:

- Direct access from the `ManagementFactory` class
- Direct access from an `MXBean` proxy
- Indirect access from the `MBeanServerConnection` class

### Using the ManagementFactory Class

An application can make direct calls to the methods of a platform MXBean that is running in the same Java VM as itself.
To make direct calls, you can use the static methods of the `ManagementFactory` class.
The `ManagementFactory` class has accessor methods for each of the different platform MXBeans,
such as, `getClassLoadingMXBean()`, `getGarbageCollectorMXBeans()`, `getRuntimeMXBean()`, and so on.
In case there are more than one platform MXBean, the method returns a list of the platform MXBeans found.

Accessing a Platform MXBean Using ManagementFactory Class:

```text
RuntimeMXBean mxbean = ManagementFactory.getRuntimeMXBean();
String vendor = mxbean.getVmVendor();
```

### Using an MXBean Proxy

An application can also call platform MXBean methods using an MXBean proxy.
To do so, you must construct an MXBean proxy instance
that forwards the method calls to a given MBean server by calling the static method `ManagementFactory.newPlatformMXBeanProxy()`.
An application typically constructs a proxy to obtain remote access to a platform MXBean of another Java VM.

Accessing a Platform MXBean Using an MXBean Proxy:

```text
MBeanServerConnection mbs;
...
// Get a MBean proxy for RuntimeMXBean interface
RuntimeMXBean proxy = ManagementFactory.newPlatformMXBeanProxy(mbs,ManagementFactory.RUNTIME_MXBEAN_NAME,RuntimeMXBean.class);
// Get standard attribute "VmVendor"
String vendor = proxy.getVmVendor();
```

### Using the MBeanServerConnection Class

An application can indirectly call platform MXBean methods through an `MBeanServerConnection` interface
that connects to the platform MBean server of another running Java VM.
You use the `MBeanServerConnection` class `getAttribute()` method to get an attribute of a platform MXBean
by providing the MBean's `ObjectName` and the attribute name as parameters.

Accessing a Platform MXBean Using the `MBeanServerConnection` Class:

```text
MBeanServerConnection mbs;
...
try {
  ObjectName oname = new ObjectName(ManagementFactory.RUNTIME_MXBEAN_NAME);
  // Get standard attribute "VmVendor"
  String vendor = (String) mbs.getAttribute(oname, "VmVendor");
} catch (....) {
  // Catch the exceptions thrown by ObjectName constructor
  // and MBeanServer.getAttribute method
  ...
}
```

## Reference

- [Using the Platform MBean Server and Platform MXBeans](https://docs.oracle.com/en/java/javase/11/management/using-platform-mbean-server-and-platform-mxbeans.html)
