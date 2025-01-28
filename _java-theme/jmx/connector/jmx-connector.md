---
title: "JMX Connectors"
sequence: "301"
---

[UP]({% link _java-theme/java-jmx-index.md %})

A connector consists of a **connector client** and a **connector server** as follows:

- A **connector server** is attached to an MBean server and listens for connection requests from clients.
  **A given connector server may establish many concurrent connections with different clients.**
- A connector client takes care of finding the server and establishing a connection with it.
  A connector client will usually be in a different Java Virtual Machine (JVM) from the connector server,
  and will often be running on a different machine.
  A given connector client is connected to exactly one connector server.
  A client application may contain many connector clients connected to different connector servers.
  Also, more than one connection may exist between a given client and a given server.

The JMX Remoting specification defines a **standard protocol** based on **RMI**
that must be supported by every conformant implementation.

## Connector Server

### Creating a Connector Server

A connector server is represented by an object of a subdass of `JMXConnectorServer`.
To create a connector server, you must instantiate such a subclass.

A connector server can be attached to an MBean server in one of two ways.
Either the MBean server it is attached to is specified when the connector server is constructed,
or the connector server is registered as an MBean in the MBean server it is attached to.

A connector server does not have to be registered in an MBean server.
It is even possible, though unusual,
for a connector server to be registered in an MBean server different from the one it is attached to.

The abstract dass `JMXConnectorServer` extends the `javax.management.NotificationBroadcasterSupport` dass and
implements the `JMXConnectorServerMBean` interface and the `MBeanRegistration` interface.
`JMXConnectorServer` is the superdass of every connector server.
As mentioned earlier, connector server is attached to an MBean server.
It listens for client connection requests and creates a connection for each one.

```java
public abstract class JMXConnectorServer
        extends NotificationBroadcasterSupport
        implements JMXConnectorServerMBean, MBeanRegistration, JMXAddressable {
    //...
}
```

```java
public class RMIConnectorServer extends JMXConnectorServer {
    //...
}
```

A connector server is associated with an MBean server
either by registering it in that MBean server, or by passing the MBean server to its constructor.

**A connector server is inactive when created.**
It only starts listening for client connections when the `JMXConnectorServerMBean.start()` method is called.
A connector server stops listening for client connections when the `JMXConnectorServerMBean.stop ()` method is called or
when the connector server is unregistered from its MBean server.

Stopping a connector server does not unregister it from its MBean server.
A connector server once stopped cannot be restarted.

Each time a client connection is made or broken,
a notification of class `JMXConnectionNotification` is emitted.

The following code extract shows how to create a connector server
that listens on an unspecified port on the local host.
It is attached to the MBean server mbs but not registered in it.

```text
MBeanServer mbs = MBeanServerFactory.createMBeanServer();
JMXServiceURL addr = new JMXServiceURL("rmi", null, 0);
JMXConnectorServer cs = new RMIConnectorServer(addr, null, mbs);
cs.start();
```

The address that the connector server is actually listening on,
induding the port number that was allocated,
can be obtained by calling `cs.getAddress()`.

The following code extract shows how to do the same thing,
but with a connector server that is registered as an MBean in the MBean server it is attached to:

```text
MBeanServer mbs = MBeanServerFactory.createMBeanServer();
JMXServiceURL addr = new JMXServiceURL("rmi", null, 0);
JMXConnectorServer cs = new RMIConnectorServer(addr, null);
ObjectName csName = new ObjectName(":type=cserver,name=mycserver");
mbs.registerMBean(cs, csName);
cs.start();
```

### Establishing a JMX Remote Connection

## Connector Client

### Connecting to Connector Servers Using Connector Server Addresses

A connector server usually has an address that clients can use to establish connections to it.
Some connectors may provide alternative ways to establish connections, such as through connection stubs.

When a connector server has an address, this address is typically described by the `JMXServiceURL` class.
A user-defined connector may choose to use another address format,
but it is recommended to use `JMXServiceURL` where possible.



### MBean Server Operations Through a Connection

From the client end of a connection, user code can obtain an object that implements the `MBeanServerConnection` interface.
This interface is very similar to the `MBeanServer` interface
that user code would use to interact with the MBean server as if it were running in the same JVM.

```java
public interface MBeanServerConnection {
    //...
}
```

```java
public interface MBeanServer extends MBeanServerConnection {
    //...
}
```

`MBeanServerConnection` is the parent interface of `MBeanServer`.
It contains all of the same methods except for a small number of methods only appropriate for local access to the MBean server.
All of the methods in `MBeanServerConnection` declare `IOException` in their "throws" clause
in addition to the exceptions declared in `MBeanServer`.

Because `MBeanServer` extends `MBeanServerConnection`,
client code can be written that works identically
whether it is operating on a local MBean server or on a remote one through a connector.

### MBeanServerConnection

```java
public interface MBeanServerConnection {
}
```

#### getMBeanInfo

```java
public interface MBeanServerConnection {
    MBeanInfo getMBeanInfo(ObjectName name)
            throws InstanceNotFoundException, IntrospectionException,
            ReflectionException, IOException;
}
```

## Terminating a Connection

Either end of a connection may terminate the connection at any time.

**If the client terminates a connection,**
the server will clean up any state relative to that client, such as listener proxies.
If client operations are in progress when the client terminates the connection,
then the threads that invoked them will receive an `IOException`.

**If the server terminates a connection,**
the client will get an `IOException` for any remote operations
that were in progress and any remote operations subsequently attempted.





## The RMI Connector

The RMI connector is the only connector that must be present in all implementations of the JMX Remoting specification.
It uses the RMI infrastructure to communicate between client and server.

The `javax.managernent.remote.rmi.RMIConnector` class extends `java.lang.Object` and implements the
`javax.management.remote.JMXConnector` interface and the `java.io.Serializable` interface.

```java
public class RMIConnector implements JMXConnector, Serializable, JMXAddressable {
    //...
}
```

An instance of the `RMIConnector` class represents a connection to a remote RMI connector.
Usually, such connections are made using `javax.managernent.rernote.JMXConnectorFaetory`.
However, specialized applications can use this class directly, for example,
with a `javax.managernent.remote.rmi.RMIServer` stub obtained without going through JNDI.

The Generic Connector

## Reference

- [JMX Connectors](https://docs.oracle.com/en/java/javase/17/jmx/jmx-connectors.html)

