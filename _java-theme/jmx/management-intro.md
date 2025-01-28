---
title: "Management Intro"
sequence: "101"
---

[UP]({% link _java-theme/java-jmx-index.md %})



```java
import java.lang.management.ManagementFactory;

public class A {
    public static void main(String[] args) {
        String nameOfRunningVM = ManagementFactory.getRuntimeMXBean().getName();
        System.out.println(nameOfRunningVM);
        while (true) {
            try {
                Thread.sleep(10000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

## Introducing JMX

A **resource** is any entity in the system that needs to be monitored and/or controlled by a management application;
resources that can be monitored and controlled are called **manageable**.

A **management application** is a piece of software
that can be used to monitor and control manageable resources (typically remotely).

Managing a system of manageable resources is what we call **system management**.

The JMX architecture enables Java applications (or systems) to become **manageable**.

Three fundamental questions must be addressed by any complete management solution:

- How do I make my resources manageable?
- Once my resources are manageable, how do I make them available (visible) for management?  
- Once my resources are visible for management, how do management applications access them?

## The Instrumentation Level

### What is an MBean?

An MBean is an application or system resource
that has been instrumented to be manageable through JMX.

Instrumenting a resource involves writing some code.

### Standard MBeans

For any resource class `XYZ` that is to be instrumented as a standard MBean,
a Java interface called `XYZMBean` must be defined, and it must be implemented by `XYZ`.
Note that the `MBean` suffix is case-sensitive: `Mbean` is incorrect, as is `mBean` or `mbean`. 

The metadata required of every MBean is created automatically by the JMX infrastructure for standard MBeans.
Before an MBean can be managed, it must be registered with a JMX agent.
When a standard MBean is registered, it is inspected,
and metadata placeholder classes are created and maintained by the JMX agent on behalf of the MBean.
The Java reflection API is used to discover the constructor(s) on the MBean class, as well as other features.
The attribute and operation metadata comes from the MBean interface and is verified by the JMX agent.

### Dynamic MBeans

In the case of **standard MBeans**, the **JMX agent** creates the metadata that describes the features of a resource.
In contrast, the developer himself must provide the metadata that describes a resource as a **dynamic MBean**.
With the increased **difficulty** comes a gain in **flexibility**, however,
because the instrumentation developer controls the creation of the metadata.

Dynamic MBeans implement a JMX interface called `javax.management.DynamicMBean`
that contains methods that allow the JMX agent to discover the management interface of the resource at runtime.

```java
package javax.management;

public interface DynamicMBean {
    public Object getAttribute(String attribute) throws AttributeNotFoundException,
            MBeanException, ReflectionException;
    public void setAttribute(Attribute attribute) throws AttributeNotFoundException,
            InvalidAttributeValueException, MBeanException, ReflectionException;

    public AttributeList getAttributes(String[] attributes);
    public AttributeList setAttributes(AttributeList attributes);

    public Object invoke(String actionName, Object params[], String signature[])
            throws MBeanException, ReflectionException;
    public MBeanInfo getMBeanInfo();
}
```

### Model MBeans

Every **model MBean** must implement the `javax.management.modelmbean.ModelMBean` interface.

```java
public interface ModelMBean extends
         DynamicMBean,
         PersistentMBean,
         ModelMBeanNotificationBroadcaster
{
    public void setModelMBeanInfo(ModelMBeanInfo inModelMBeanInfo)
            throws MBeanException, RuntimeOperationsException;
    public void setManagedResource(Object mr, String mr_type)
            throws MBeanException, RuntimeOperationsException,
            InstanceNotFoundException, InvalidTargetObjectTypeException;
}
```

Notice that the `ModelMBean` interface extends the `DynamicMBean` interface,
which means that a **model MBean** is a **dynamic MBean**.
However, every JMX implementation is required to ship
an off-the-shelf implementation of `ModelMBean` called `RequiredModelMBean`.

```java
// Since 1.5
public class RequiredModelMBean
    implements ModelMBean, MBeanRegistration, NotificationEmitter {
    //...
}
```

This presents the developer with a key benefit:
because a model MBean implementation already exists, the work of writing one is already done.
While the instrumentation developer must still create the necessary metadata classes,
she does not have to implement the `ModelMBean` interface, which significantly reduces development time.

### Open MBeans

Using the **standard**, **dynamic**, or **model MBean** instrumentation approaches allows us to describe MBean features
(i.e., attributes, constructors, parameters, operations, and notifications) that are one of the following types:

- A fundamental Java type, such as `boolean`, `char`, `long`, or `float` (through its corresponding JDK wrapper— `Boolean`, `Char`, `Long`, or `Float`, respectively)  
- A string, as `java.lang.String`
- An array of fundamental types or strings 

However, sometimes MBean attributes are more complex.

**Open MBeans** were designed in an effort to make MBeans accessible to the widest possible range of management applications.

Every open MBean type is a concrete subclass of an abstract open MBean class called `javax.management.openmbean.OpenType`,
and only subclasses of `OpenType` are allowed to describe features of **open MBeans**.

```java
public abstract class OpenType<T> implements Serializable {
    //...
}
```

Three new types are defined that allow the instrumentation developer to describe MBean features of arbitrary complexity:

- `ArrayType: Describes an n-dimensional array of any open MBean type
- `CompositeType: Describes an arbitrarily complex structure of open MBean types
- `TabularType: Describes a tabular structure (analogous to a database table) of any number of rows,
  where the same `CompositeType` describes each row in the table

### JMX notifications

The JMX agent is designed so that management applications,
or other components of the system, actively collect information about (i.e., query) the resources
that are being managed by that agent.
This works well when this information is refreshed at reasonable intervals and the application resources are stable.

However, there are times when an immediate notification of a resource fault needs to be communicated to an interested party
(such as a management application) outside the JMX agent.
It is for this reason that the **JMX notification model** was designed.
A JMX notification is similar to an SNMP trap and
can be used to send critical, warning, or simply system or application information
when certain events occur in the system.

At the core of the notification model are two principal participants:

- **A notification broadcaster**, which emits notifications
- **A notification listener**, which registers its interest in receiving certain notifications through the JMX agent infrastructure and
  receives those notifications when they are broadcast

A **notification broadcaster** is an object that implements the `javax.management.NotificationBroadcaster` interface.

```java
public interface NotificationBroadcaster {
    public void addNotificationListener(NotificationListener listener,
                                        NotificationFilter filter,
                                        Object handback)
            throws java.lang.IllegalArgumentException;
    public void removeNotificationListener(NotificationListener listener)
            throws ListenerNotFoundException;
    public MBeanNotificationInfo[] getNotificationInfo();
}
```

Through this interface, a notification listener can register or remove its interest in receiving notifications and
can query the notification broadcaster about what notifications it emits.

A **notification listener** is an object that implements the `javax.management.NotificationListener` interface,
which has a single method, `handleNotification()`, that it uses to process all the notifications it receives.

```java
public interface NotificationListener extends java.util.EventListener   {
    public void handleNotification(Notification notification, Object handback);
}
```

To receive notifications, a notification listener must register its interest in receiving the notifications
emitted by the broadcaster through the broadcaster's implementation of `NotificationBroadcaster`.
When the notification listener does so, it passes references to itself,
an optional **`notification` filter object**, and an optional **`handback` object**.
The `notification` filter is an object that implements the `NotificationFilter` interface,
and it is used by the broadcaster to determine which notifications it will send to the listener.
Only those notification types that have been enabled in the filter will be sent to the listener.
The `handback` object is opaque to the broadcaster and has meaning only to the listener,
which uses the handback object in its processing of the notification.

If no notification filter object is passed to the notification broadcaster,
the listener is in effect telling the broadcaster that it wants to receive every notification the broadcaster emits.
However, if the notification listener wants to receive only a subset of the notifications emitted by the broadcaster,
it creates a notification filter object and adds the notification types in which it is interested through the `NotificationFilter` interface.

## The Agent Level

The agent level of the JMX architecture is made up of the **MBean server** and the **JMX agent services**.

The **MBean server** has two purposes:
it serves as a registry of MBeans and as a communications broker between MBeans and management applications (and other JMX agents).

The **JMX agent services** provide additional functionality that is mandated by the JMX specification, such as scheduling and dynamic loading.

### The MBean server

The MBean server is at the heart of the JMX agent.
The MBean server acts as a registry for MBeans, and the JMX agent accesses this registry through the `MBeanServer` interface.

To decouple the interaction between the agent and the MBean instance,
JMX introduces the concept of an **object name**, which is implemented by a JMX class called `ObjectName`.

Before an MBean is registered, an object name that uniquely identifies the MBean within the MBean server's internal registry
must be created for the MBean (this can be done by the agent who registers the MBean or by the MBean itself).
If the object name is unique within the MBean server's registry,
a new entry containing the object name and a reference to the MBean is created for that MBean.
If the object name used to register the MBean is not unique,
the registration attempt will fail because another MBean has already been registered using that object name.

Once an MBean is registered,
the object name assigned to the MBean is used as the means of indirect communication between the agent and the MBean.
The MBean server acts as a broker for the request through its implementation of the `MBeanServer` interface.
If the agent wants to query an MBean for its attribute values,
it invokes the appropriate method on the `MBeanServer` interface and
passes the object name of the MBean whose values are to be retrieved.
The MBean server uses the object name as a lookup into its registry,
retrieves the reference to the MBean object, and makes the invocation.
The results of the invocation on the MBean object are then returned to the agent.
At no time does the agent have a direct reference to the MBean.

A factory class, `MBeanServerFactory`, is provided to obtain a reference to the MBean server.
The use of a factory decouples the `MBeanServer` interface from its implementation.
`MBeanServerFactory` provides two static methods that allow us to create an MBean server:

```java

```

- `createMBeanServer()`: Creates an instance of the MBean server,
  holds that reference internally to the `MBeanServerFactory`, and returns the reference to the caller.
  The `MBeanServerFactory` internal reference to the MBean server
  that was created prevents it from being subject to garbage collection.  
- `newMBeanServer()`: Creates an instance of the MBean server and returns that reference to the caller.
  No internal reference is maintained inside the `MBeanServerFactory`.
  When there are no more live references to the MBean server, it is eligible for garbage collection.

## The Distributed Services Level

### Protocol adaptors and connectors

There is a clear difference between a **connector** and an **adaptor**.

A **connector** consists of two parts: **a client proxy** and **a server stub**.
Connectors are intended to do the following:

- Hide the specific details regarding the network location of the resources in an application under management (i.e., provide location transparency).  
- Present a consistent view (via an interface) of an MBean server that is located in a different process space than the local MBean server.

Shielding the **proxy client** from the details of how to send and receive messages to the **server stub** (and vice versa)
makes it unnecessary for any particular instance of the MBean server to know its location on the network,
which means that this can be left as a configuration detail.

An **adaptor** is different from a **connector** in that there is no client component.
The adaptor runs at the server location and renders the MBean server state in a form
that is appropriate for, and can be recognized by, the client.
An example of this is the `HtmlAdaptorServer` that ships as part of the JMX RI
(note that it is not officially part of the RI, as the distributed services level has yet to be fully specified).
It is unlikely that any adaptors will be mandated by the JMX specification in the near future.


