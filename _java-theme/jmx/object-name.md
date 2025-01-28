---
title: "ObjectName"
sequence: "103"
---

[UP]({% link _java-theme/java-jmx-index.md %})

## The ObjectName class

The `ObjectName` class is provided by the RI and is crucial to the MBean registration process.

Every MBean must be represented by an `ObjectName` in the MBean server and
no two MBeans may be represented by the same `ObjectName`.
Each `ObjectName` contains a string made up of two components: the **domain name** and the **key property list**.
The combination of **domain name** and **key property list** must be unique for any given MBean and has the format:

```text
domain-name:key1=value1[,key2=value2,...,keyN=valueN]
```

where `domain-name` is the domain name, followed by a colon (no spaces), followed by at least one key property.
Think of a domain name as JMX's namespace mechanism.
A key property is just a name/value pair, where each property name must be unique.

在`java.lang.management.ManagementFactory`类的文档注释中，有如下示例：

| Management Interface  | ObjectName                     |
|-----------------------|--------------------------------|
| ClassLoadingMXBean    | java.lang:type=ClassLoading    |
| MemoryMXBean          | java.lang:type=Memory          |
| ThreadMXBean          | java.lang:type=Threading       |
| RuntimeMXBean         | java.lang:type=Runtime         |
| OperatingSystemMXBean | java.lang:type=OperatingSystem |
| PlatformLoggingMXBean | java.util.logging:type=Logging |


Every compliant JMX implementation must provide a default domain name.
For the JMX 1.0 RI, that name is `DefaultDomain`,
but you can't depend on this to be the case all of the time.
The MBean server `javax.management.MBeanServer` provides a method called `getDefaultDomain()` that returns the name of the default domain.

As a convenience, the JMX 1.0 RI allows you to pass an **empty string** for the domain name if you want to use the default domain.
However, the domain name you pass may never be `null`, or a `MalformedObjectNameException` will be thrown.

There is only one restriction on domain names: you cannot use `JMImplementation` as the domain name for your MBeans.
This domain name is reserved for the implementation (hence the name) and contains a single metadata MBean
that provides information about the implementation, such as its name, version, and vendor.

To create an `ObjectName` instance, use one of the three constructors provided.
The simplest constructor to use takes a single `String` parameter
that contains the full object name string, as described above:

```java
import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;

public class HelloWorld {
    public static void main(String[] args) {
        try {
            String name = "UserDomain:Name=Worker,Role=Supplier";
            ObjectName objectName = new ObjectName(name);
        } catch (MalformedObjectNameException e) {
            e.printStackTrace();
        }
    }
}
```

In this example, you can also **leave off the domain name** preceding **the colon** if you want to use the **default domain**:

```java
import javax.management.MalformedObjectNameException;
import javax.management.ObjectName;

public class HelloWorld {
    public static void main(String[] args) {
        try {
            String name = ":Name=Worker,Role=Supplier";
            ObjectName objectName = new ObjectName(name);
        } catch (MalformedObjectNameException e) {
            e.printStackTrace();
        }
    }
}
```

Once the `ObjectName` instance for your MBean has been created successfully,
you can use that `ObjectName` to register the MBean.

## Registering the MBean with the MBean server

Without an `ObjectName` instance, an MBean cannot be registered with the MBean server.
In fact, the `ObjectName` is critical to doing anything meaningful with the MBean server.

In this section, we will see how to use that `ObjectName` to register an MBean.

The first step in using the MBean server is to obtain a reference to it.
Every compliant JMX implementation must provide an `MBeanServerFactory` class
that contains several methods that allow you to gain access to the MBean server.

The easiest method to use is `MBeanServerFactory.createMBeanServer()`,
which takes no arguments and returns a reference to a newly created MBean server:

```java
import javax.management.*;

public class HelloWorld {
    public static void main(String[] args) {
        try {
            Worker worker = new Worker();
            ObjectName objectName = new ObjectName("UserDomain:Name=Worker");
            
            MBeanServer beanServer = MBeanServerFactory.createMBeanServer();
            beanServer.registerMBean(worker, objectName);
        } catch (MalformedObjectNameException | InstanceAlreadyExistsException | 
                MBeanRegistrationException | NotCompliantMBeanException e) {
            e.printStackTrace();
        }
    }
}
```

Once the MBean is registered with the MBean server, it is available for management.
