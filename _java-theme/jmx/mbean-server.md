---
title: "MBean Server"
sequence: "104"
---

[UP]({% link _java-theme/java-jmx-index.md %})

## Creating an MBean Server

An MBean server is created by invoking one of the static `createMBeanServer` methods or `newMBeanServer` methods
on the `javax.management.MBeanServerFactory` class.

```java
public class MBeanServerFactory {
    public static MBeanServer createMBeanServer() {
        return createMBeanServer(null);
    }

    public static MBeanServer createMBeanServer(String domain)  {
        final MBeanServer mBeanServer = newMBeanServer(domain);
        addMBeanServer(mBeanServer);
        return mBeanServer;
    }

    public static MBeanServer newMBeanServer() {
        return newMBeanServer(null);
    }
}
```

The `MBeanServerFactory` maintains a reference to each MBean server created by the `createMBeanServer` methods,
but does not keep a reference to an MBean server created by the `newMBeanServer` methods.

The `releaseMBeanServer(MBeanServer mBeanServer)` method can be called to release any references
that the `MBeanServerFactory` might be maintaining.

```java
public class MBeanServerFactory {
    public static void releaseMBeanServer(MBeanServer mbeanServer) {
        checkPermission("releaseMBeanServer");

        removeMBeanServer(mbeanServer);
    }
}
```

When creating an MBean server, a name for the default domain of the agent must be assigned to it.
If the `create` method not requiring a domain name is used,
a domain name will be assigned to the MBean server by the JMX implementation.
If the `create` method requiring a domain name is used,
the caller of the method must supply the default domain name.

## Finding an MBean Server

The `MBeanServerFactory` class exposes a static method, `findMBeanServer(String mBeanServerid)`,
that can be used to find previously created MBean servers.
The ID of the MBean server is the only parameter that needs to be passed to the method.
The `findMBeanServer` method returns a `java.util.Array`list object containing all MBean servers
that match the `mBeanServerld` parameter.
If the `mBeanServerld` parameter is `null`,
all MBean servers the `MBeanServerFactory` class has a reference to will be returned.

```java
public class MBeanServerFactory {
    public synchronized static ArrayList<MBeanServer> findMBeanServer(String agentId) {
        checkPermission("findMBeanServer");

        if (agentId == null)
            return new ArrayList<MBeanServer>(mBeanServerList);

        ArrayList<MBeanServer> result = new ArrayList<MBeanServer>();
        for (MBeanServer mbs : mBeanServerList) {
            String name = mBeanServerId(mbs);
            if (agentId.equals(name))
                result.add(mbs);
        }
        return result;
    }
}
```

The MBean server ID parameter that is passed to `findMBeanServer()` is documented
in most implementations of JMX 1.x as the `agentId`.
However, the parameter is actually compared against the `mBeanServerid` attribute of the delegate object
for each MBean server instance to which the `MBeanServerFactory` instance has a reference.
This is not so confusing,
because the MBean server and agent are so closely coupled; however, this is only the start of a complicated process.

## MBean Server Delegate

Each MBean server must define and reserve a domain called `JMimplementation`
in which to register one MBean of type `javax.management.MBeanServerDelegate`.
The `MBeanServerDelegate` MBean is automatically created and registered
when an MBean server is started.
The purpose of this object is to identify and describe the MBean server,
in terms of its management interface, with which it is registered.
The `MBeanServerDelegate` object also implements the `NotificationEmitter` and
serves to transmit `MBeanServerNotification` events for its MBean server
when an MBean is registered in or deregistered from the MBean server.

```java
public class MBeanServerDelegate implements MBeanServerDelegateMBean, NotificationEmitter {
    public static final ObjectName DELEGATE_NAME =
            Util.newObjectName("JMImplementation:type=MBeanServerDelegate");
}
```

## Modifying the Default MBean Server Implementation

## Naming and Registering MBeans

## Controlling MBean Registration

## MBean Registration Notifications

## MBean Server Queries

Query Expressions

Applying Query Expressions

Using a Match Constraint

Setting the Query Scope

Using Wildcards in Query Expressions

MBean Proxies

MBean Server Remote Communications


