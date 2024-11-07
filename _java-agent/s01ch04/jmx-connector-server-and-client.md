---
title: "JMX: JMXConnectorServer 和 JMXConnector"
sequence: "156"
---

[UP]({% link _java-agent/java-agent-01.md %})

JMX 是 Java Management Extension 的缩写。在本文当中，我们对 JMX 进行一个简单的介绍，目的是为后续内容做一个铺垫。

## JMX 介绍

如果两个 JVM，当它们使用 JMX 进行沟通时，可以简单的描述成下图：

![](/assets/images/java/jmx/jmx-mbean-server-connector.png)

### MBean

要理解 MBean，我们需要把握住两个核心概念：resource 和 MBean。两者的关系是，先有 resource，后有 MBean。

#### Resource 和 MBean

首先，我们说第一个概念：resource。其实，一个事物是不是 resource（资源），是一个非常主观的判断。比如说，地上有一块石头，我们会觉得它是一个无用的事物；换一个场景，有一天需要盖房子，石头就成了盖房子的有用资源。

在编程的语言环境当中，resource 也是一个模糊的概念，可以体现在不同的层面上：

- 可能是 Class 层面，例如，类里的一个字段，它记录了某个方法被调用的次数
- 可能是 Application 层面，例如，在线用户的数量
- 可能是 JVM 层面，例如：线程信息、垃圾回收信息
- 可能是硬件层面，例如：CPU 的能力、磁盘空间的大小

**JMX 的一个主要目标就是对 resource（资源）进行 management（管理）和 monitor（监控），它要把一个我们关心的事物（resource）给转换成 manageable resource。**

```text
A **resource** is any entity in the system that needs to be monitored and/or controlled by a management application;
resources that can be monitored and controlled are called **manageable**.
```

接着，我们来说第二个概念：MBean。MBean 是 managed bean 的缩写，它就代表 manageable resource 本身，或者是对 manageable resource 的进一步封装，
它就是 manageable resource 在 JMX 架构当中所对应的一个“术语”或标准化之后的“概念”。

```text
An MBean is an application or system resource
that has been instrumented to be manageable through JMX.
```

- Application components designed with their *management interface* in mind can typically be written as *MBeans*.
- *MBeans* can be used as *wrappers* for legacy code without a management interface or as *proxies* for code with a legacy management interface.

#### Standard MBean

在 JMX 当中，MBean 有不同的类型：

- Standard MBean
- Dynamic MBean
- Open MBean
- Model MBean

在这里，我们只关注 Standard MBean。在 JMX 当中，Standard MBean 有一些要求，需要我们在编写代码的过程当中遵守：

- 类名层面。比如说，有一个 `SmartChild` 类，它就是我们关心的 resource，它必须实现一个接口（management interface），这个接口的名字必须是 `SmartChildMBean`。
  也就是，在原来 `SmartChild` 类名的基础上，再加上 `MBean` 后缀。
- 构造方法层面。比如说，`SmartChild` 类必须有一个**public constructor**。
- Attributes 层面，或者 Getter 和 Setter 层面。
  - 比如，getter 方法不能接收参数，`int getAge()` 是合理的，而 `int getAge(String name)` 是不合理的。
  - 比如说，setter 方法只能接收一个参数，`void setAge(int age)` 是合理的，而 `void setAge(int age, String name)` 是不合理的。
- Operations。在 MBean 当中，排除 Attributes 之外的方法，就属于 Operations 操作。

```text
                                                           ┌─── getter
                                         ┌─── attribute ───┤
                  ┌─── Java interface ───┤                 └─── setter
                  │                      └─── operation
Standard MBean ───┤
                  │
                  └─── Java class
```

---

For any resource class `XYZ` that is to be instrumented as a standard MBean,
a Java interface called `XYZMBean` must be defined, and it must be implemented by `XYZ`.
Note that the `MBean` suffix is case-sensitive: `Mbean` is incorrect, as is `mBean` or `mbean`.

A standard MBean is defined by writing a Java interface called `SomethingMBean` and
a Java class called `Something` that implements that interface.
Every method in the interface defines either an **attribute** or an **operation** in the MBean.
By default, every method defines an operation.
Attributes and operations are methods that follow certain design patterns.
A **standard MBean** is composed of **an MBean interface** and **a class**.
[Link](https://docs.oracle.com/javase/tutorial/jmx/mbeans/standard.html)

- The MBean interface lists the methods for all exposed attributes and operations.
- The class implements this interface and provides the functionality of the instrumented resource.

Management **attributes** are named characteristics of an MBean.
With Standard MBeans, attributes are defined in the MBean interface
via the use of **naming conventions** in the interface methods.
There are three kinds of attributes, read-only, write-only, and read-write attributes.
[Link](https://www.informit.com/articles/article.aspx?p=27842&seqNum=3)

Management **operations** for Standard MBeans include all the methods declared in the MBean interface
that are not recognized as being either a read or write method to an attribute.
The operations don't have to follow any specific naming rules
as long as they do not intervene with the management attribute naming conventions.

---

### MBeanServer

在 JMX 当中，`MBeanServer` 表示 managed bean server。

在某一个 `MBean` 对象创建好之后，需要将 `MBean` 对象注册到 `MBeanServer` 当中，分成两个步骤：

- 第一步，创建 `MBeanServer` 对象
- 第二步，将 `MBean` 对象注册到 `MBeanServer` 上

#### 创建 MBeanServer

在这里，我们介绍两种创建 MBeanServer 对象的方式。

```text
               ┌─── MBeanServerFactory.createMBeanServer()
MBeanServer ───┤
               └─── ManagementFactory.getPlatformMBeanServer()
```

第一种方式：借助于 `javax.management.MBeanServerFactory` 类的 `createMBeanServer()` 方法：

```text
MBeanServer beanServer = MBeanServerFactory.createMBeanServer();
```

第二种方式：借助于 `java.lang.management.ManagementFactory` 类的 `getPlatformMBeanServer()` 方法：

```text
MBeanServer platformMBeanServer = ManagementFactory.getPlatformMBeanServer();
```

两种方式相比较，推荐使用 `ManagementFactory.getPlatformMBeanServer()`。

- The **platform MBean server** was introduced in Java SE 5.0,
  and is an MBean server that is built into the Java Virtual Machine (Java VM).
- The **platform MBean server** can be shared by all managed components that are running in the Java VM.
- However, there is generally no need for more than one MBean server, so **using the platform MBean server is recommended.**

#### 注册 MBean

注册 `MBean` 对象，需要使用 `MBeanServer` 类的 `registerMBean(Object object, ObjectName name)` 方法：

```text
SmartChild bean = new SmartChild("Tom", 10);
ObjectName objectName = new ObjectName(Const.SMART_CHILD_BEAN);
beanServer.registerMBean(bean, objectName);
```

其中，`Const.SMART_CHILD_BEAN` 的值为 `lsieun.management.bean:type=child,name=SmartChild`。

在注册 MBean 的时候，需要指定唯一的**object name**：

```text
                               ┌─── MBean
MBeanServer.registerMBean() ───┤
                               └─── ObjectName
```

Each `ObjectName` contains a string made up of two components: the **domain name** and the **key property list**.  
The combination of **domain name** and **key property list** must be unique for any given MBean and has the format:

```text
domain-name:key1=value1[,key2=value2,...,keyN=valueN]
```

在 `java.lang.management.ManagementFactory` 类的文档注释中，有如下示例：

| Management Interface    | ObjectName                       |
|-------------------------|----------------------------------|
| `ClassLoadingMXBean`    | `java.lang:type=ClassLoading`    |
| `MemoryMXBean`          | `java.lang:type=Memory`          |
| `ThreadMXBean`          | `java.lang:type=Threading`       |
| `RuntimeMXBean`         | `java.lang:type=Runtime`         |
| `OperatingSystemMXBean` | `java.lang:type=OperatingSystem` |
| `PlatformLoggingMXBean` | `java.util.logging:type=Logging` |

### Connector

A connector consists of a **connector client** and a **connector server**.

- A **connector server** is attached to an **MBean server** and listens for connection requests from clients.
  **A given connector server may establish many concurrent connections with different clients.**
- A **connector client** is responsible for establishing a connection with the **connector server**.

A **connector client** will usually be in a different Java Virtual Machine (Java VM) from the connector server, and will often be running on a different machine.

A **connector server** usually has **an address**, used to establish connections between connector clients and the connector server.

#### Connector Server

创建 `JMXConnectorServer` 对象，我们可以可以借助于 `javax.management.remote.JMXConnectorServerFactory` 类的 `newJMXConnectorServer()` 方法：

```text
JMXServiceURL serviceURL = new JMXServiceURL("rmi", "127.0.0.1", 9876);
JMXConnectorServer connectorServer = JMXConnectorServerFactory.newJMXConnectorServer(serviceURL, null, beanServer);
```

在创建 `JMXConnectorServer` 对象时，我们用到了 `JMXServiceURL` 类，如果打印一下 `serviceURL` 变量，会输出以下结果：

```text
service:jmx:rmi://127.0.0.1:9876
```

一个更通用的表达形式如下：

```text
service:jmx:protocol://host[:port][url-path]
```

在创建 `JMXConnectorServer` 对象完成之后，它处于“未激活”状态：

```text
boolean status = connectorServer.isActive();
System.out.println(status); // false
```

当我们调用 `start()` 方法后，它才开始监听 connector client 的连接请求，并进入“激活”状态：

```text
connectorServer.start();
```

当监听开始之后，我们可以调用 `getAddress()` 方法来获取 connector client 可以连接到 connector server 的服务地址：

```text
JMXServiceURL connectorServerAddress = connectorServer.getAddress();
```

示例如下：

```text
service:jmx:rmi://127.0.0.1:9876/stub/rO0ABX...
```

当我们调用 `stop()` 方法后，它停止监听 connector client 的连接请求，并进入“未激活”状态：

```text
connectorServer.stop();
```

#### Connector Client

现在 connector server 端已经准备好了，接下来就是 connector client 端要做的事情了。
从 API 的角度来说，`JMXConnector` 类就是 connector client。

要创建 `JMXConnector` 类的实例，我们可以借助于 `javax.management.remote.JMXConnectorFactory` 类的 `connect()` 方法：

```text
JMXServiceURL address = new JMXServiceURL(connectorAddress);
JMXConnector connector = JMXConnectorFactory.connect(address);
```

然后，我们再利用 `JMXConnector` 类的 `getMBeanServerConnection()` 方法来获取一个 `MBeanServerConnection` 对象：

```text
MBeanServerConnection beanServerConnection = connector.getMBeanServerConnection();
```

有了 `MBeanServerConnection` 对象之后，就可以与 `MBeanServer` 对象进行交互了：

```text
ObjectName objectName = new ObjectName(Const.SMART_CHILD_BEAN);
MBeanInfo beanInfo = beanServerConnection.getMBeanInfo(objectName);
```

值得一提的是，`MBeanServer` 本身是一个接口，它继承自 `MBeanServerConnection` 接口。

```text
    MBeanServer         MBeanServerConnection
------------------------------------------------
  connector server        connector client
```

## JMX 示例

### MBean

```java
package lsieun.management.bean;

public interface SmartChildMBean {
    String getName();
    void setName(String name);
    
    int getAge();
    void setAge(int age);
    
    void study(String subject);
}
```

```java
package lsieun.management.bean;

public class SmartChild implements SmartChildMBean {
    private String name;
    private int age;

    public SmartChild(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public int getAge() {
        return age;
    }

    @Override
    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public void study(String subject) {
        String message = String.format("%s (%d) is studying %s.", name, age, subject);
        System.out.println(message);
    }
}
```

### Server

```java
package run.jmx;

import lsieun.cst.Const;
import lsieun.management.bean.SmartChild;

import javax.management.MBeanServer;
import javax.management.MBeanServerFactory;
import javax.management.ObjectName;
import javax.management.remote.JMXConnectorServer;
import javax.management.remote.JMXConnectorServerFactory;
import javax.management.remote.JMXServiceURL;
import java.util.concurrent.TimeUnit;

public class JMXServer {
    public static void main(String[] args) throws Exception {
        // 第一步，创建 MBeanServer
        MBeanServer beanServer = MBeanServerFactory.createMBeanServer();

        // 第二步，注册 MBean
        SmartChild bean = new SmartChild("Tom", 10);
        ObjectName objectName = new ObjectName(Const.SMART_CHILD_BEAN);
        beanServer.registerMBean(bean, objectName);

        // 第三步，创建 Connector Server
        JMXServiceURL serviceURL = new JMXServiceURL("rmi", "127.0.0.1", 9876);
        JMXConnectorServer connectorServer = JMXConnectorServerFactory.newJMXConnectorServer(serviceURL, null, beanServer);

        // 第四步，开启 Connector Server 监听
        connectorServer.start();
        JMXServiceURL connectorServerAddress = connectorServer.getAddress();
        System.out.println(connectorServerAddress);

        // 休息 5 分钟
        TimeUnit.MINUTES.sleep(5);

        // 第五步，关闭 Connector Server 监听
        connectorServer.stop();
    }
}
```

### Client

```java
package run.jmx;

import lsieun.cst.Const;

import javax.management.MBeanServerConnection;
import javax.management.ObjectName;
import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;

public class JMXClient {
    public static void main(String[] args) throws Exception {
        // 第一步，创建 Connector Client
        String connectorAddress = "service:jmx:rmi://127.0.0.1:9876/stub/rO0AB...";
        JMXServiceURL address = new JMXServiceURL(connectorAddress);
        JMXConnector connector = JMXConnectorFactory.connect(address);

        // 第二步，获取 MBeanServerConnection 对象
        MBeanServerConnection beanServerConnection = connector.getMBeanServerConnection();

        // 第三步，向 MBean Server 发送请求
        ObjectName objectName = new ObjectName(Const.SMART_CHILD_BEAN);
        String[] array = new String[]{"Chinese", "Math", "English"};
        for (String item : array) {
            beanServerConnection.invoke(objectName, "study", new Object[]{item}, new String[]{String.class.getName()});
        }

        // 第四步，关闭 Connector Client
        connector.close();
    }
}
```

## 总结

本文内容总结如下：

- 第一点，理解两个 JVM 使用 JMX 进行沟通的整体思路和相关概念。
- 第二点，介绍 JMX 的目的是为了结合 Java Agent 和 JMX 一起使用。
