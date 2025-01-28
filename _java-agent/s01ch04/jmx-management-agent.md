---
title: "JMX: management-agent.jar"
sequence: "157"
---

[UP]({% link _java-agent/java-agent-01.md %})

## Pre Java 9

### management-agent.jar

A JMX client uses the Attach API to dynamically attach to a target virtual machine and
load the JMX agent (if it is not already loaded) from the `management-agent.jar` file,
which is located in the `lib` subdirectory of the target virtual machine's JRE home directory. 

```text
JRE_HOME/lib/management-agent.jar
```

其中，只有一个 `META-INF/MANIFEST.MF` 文件，内容如下：

```text
Manifest-Version: 1.0
Created-By: 1.7.0_291 (Oracle Corporation)
Agent-Class: sun.management.Agent
Premain-Class: sun.management.Agent

```

在 `sun.management.Agent` 类当中，定义了 `LOCAL_CONNECTOR_ADDRESS_PROP` 静态字段：

```java
public class Agent {
    private static final String LOCAL_CONNECTOR_ADDRESS_PROP = "com.sun.management.jmxremote.localConnectorAddress";

    private static synchronized void startLocalManagementAgent() {
        Properties agentProps = VMSupport.getAgentProperties();

        // start local connector if not started
        if (agentProps.get(LOCAL_CONNECTOR_ADDRESS_PROP) == null) {
            JMXConnectorServer cs = ConnectorBootstrap.startLocalConnectorServer();
            String address = cs.getAddress().toString();
            // Add the local connector address to the agent properties
            agentProps.put(LOCAL_CONNECTOR_ADDRESS_PROP, address);

            try {
                // export the address to the instrumentation buffer
                ConnectorAddressLink.export(address);
            } catch (Exception x) {
                // Connector server started but unable to export address
                // to instrumentation buffer - non-fatal error.
                warning(EXPORT_ADDRESS_FAILED, x.getMessage());
            }
        }
    }
}
```

### Application

```java
package sample;

import java.lang.management.ManagementFactory;
import java.util.concurrent.TimeUnit;

public class Program {
    public static void main(String[] args) throws Exception {
        // 第一步，打印进程 ID
        String nameOfRunningVM = ManagementFactory.getRuntimeMXBean().getName();
        System.out.println(nameOfRunningVM);

        // 第二步，倒计时退出
        int count = 600;
        for (int i = 0; i < count; i++) {
            String info = String.format("|%03d| %s remains %03d seconds", i, nameOfRunningVM, (count - i));
            System.out.println(info);

            TimeUnit.SECONDS.sleep(1);
        }
    }
}
```

### Attach

```java
package run;

import com.sun.tools.attach.VirtualMachine;
import com.sun.tools.attach.VirtualMachineDescriptor;
import lsieun.utils.JarUtils;

import javax.management.MBeanServerConnection;
import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.util.List;

public class VMAttach {
    static final String LOCAL_CONNECTOR_ADDRESS_PROP = "com.sun.management.jmxremote.localConnectorAddress";

    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String displayName = "sample.Program";

        // 第二步，使用 Attach 机制，加载 management-agent.jar 文件，来启动 JMX
        String pid = findPID(displayName);
        VirtualMachine vm = VirtualMachine.attach(pid);
        String connectorAddress = vm.getAgentProperties().getProperty(LOCAL_CONNECTOR_ADDRESS_PROP);
        if (connectorAddress == null) {
            String javaHome = vm.getSystemProperties().getProperty("java.home");
            String agent = JarUtils.getJDKJarPath(javaHome, "management-agent.jar");
            vm.loadAgent(agent);
            connectorAddress = vm.getAgentProperties().getProperty(LOCAL_CONNECTOR_ADDRESS_PROP);
            if (connectorAddress == null) {
                throw new NullPointerException("connectorAddress is null");
            }
        }
        vm.detach();
        System.out.println(connectorAddress);

        // 第三步，借助于 JMX 进行沟通
        JMXServiceURL servURL = new JMXServiceURL(connectorAddress);
        JMXConnector con = JMXConnectorFactory.connect(servURL);
        MBeanServerConnection mbsc = con.getMBeanServerConnection();
        RuntimeMXBean proxy = ManagementFactory.getPlatformMXBean(mbsc, RuntimeMXBean.class);
        long uptime = proxy.getUptime();
        System.out.println(uptime);
    }

    public static String findPID(String name) {
        List<VirtualMachineDescriptor> list = VirtualMachine.list();
        for (VirtualMachineDescriptor vmd : list) {
            String displayName = vmd.displayName();
            if (displayName != null && displayName.equals(name)) {
                return vmd.id();
            }
        }
        throw new RuntimeException("Not Exist: " + name);
    }
}
```

## Since Java 9

在[JDK 9 Release Notes](https://www.oracle.com/java/technologies/javase/9-removed-features.html#JDK-8043939)中提到：**management-agent.jar is removed**。

`management-agent.jar` has been removed.
Tools that have been using the Attach API to load this agent into a running VM should be aware that the Attach API has been updated in JDK 9 to define two new methods for starting a management agent:

- `com.sun.tools.attach.VirtualMachine.startManagementAgent(Properties agentProperties)`
- `com.sun.tools.attach.VirtualMachine.startLocalManagementAgent()`

### startLocalManagementAgent

```java
package run;

import com.sun.tools.attach.VirtualMachine;
import com.sun.tools.attach.VirtualMachineDescriptor;

import javax.management.MBeanServerConnection;
import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.util.List;

public class VMAttach {
    static final String LOCAL_CONNECTOR_ADDRESS_PROP = "com.sun.management.jmxremote.localConnectorAddress";

    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        String displayName = "sample.Program";

        // 第二步，启动 JMX
        String pid = findPID(displayName);
        VirtualMachine vm = VirtualMachine.attach(pid);
        String connectorAddress = vm.getAgentProperties().getProperty(LOCAL_CONNECTOR_ADDRESS_PROP);
        if (connectorAddress == null) {
            vm.startLocalManagementAgent();
            connectorAddress = vm.getAgentProperties().getProperty(LOCAL_CONNECTOR_ADDRESS_PROP);
            if (connectorAddress == null) {
                throw new NullPointerException("connectorAddress is null");
            }
        }
        vm.detach();
        System.out.println(connectorAddress);

        // 第三步，借助于 JMX 进行沟通
        JMXServiceURL servURL = new JMXServiceURL(connectorAddress);
        JMXConnector con = JMXConnectorFactory.connect(servURL);
        MBeanServerConnection mbsc = con.getMBeanServerConnection();
        RuntimeMXBean proxy = ManagementFactory.getPlatformMXBean(mbsc, RuntimeMXBean.class);
        long uptime = proxy.getUptime();
        System.out.println(uptime);
    }

    public static String findPID(String name) {
        List<VirtualMachineDescriptor> list = VirtualMachine.list();
        for (VirtualMachineDescriptor vmd : list) {
            String displayName = vmd.displayName();
            if (displayName != null && displayName.equals(name)) {
                return vmd.id();
            }
        }
        throw new RuntimeException("Not Exist: " + name);
    }
}
```

### startManagementAgent

```java
package run;

import com.sun.tools.attach.VirtualMachine;
import com.sun.tools.attach.VirtualMachineDescriptor;

import javax.management.MBeanServerConnection;
import javax.management.remote.JMXConnector;
import javax.management.remote.JMXConnectorFactory;
import javax.management.remote.JMXServiceURL;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.util.List;
import java.util.Properties;

public class VMAttach {
    public static void main(String[] args) throws Exception {
        // 第一步，准备参数
        int port = 5000;
        String displayName = "sample.Program";

        // 第二步，启动 JMX
        String pid = findPID(displayName);
        VirtualMachine vm = VirtualMachine.attach(pid);
        Properties props = new Properties();
        props.put("com.sun.management.jmxremote.port", String.valueOf(port));
        props.put("com.sun.management.jmxremote.authenticate", "false");
        props.put("com.sun.management.jmxremote.ssl", "false");
        vm.startManagementAgent(props);
        vm.getAgentProperties().list(System.out);
        vm.detach();

        // 第三步，借助于 JMX 进行沟通
        String jmxUrlStr = String.format("service:jmx:rmi:///jndi/rmi://localhost:%d/jmxrmi", port);
        JMXServiceURL servURL = new JMXServiceURL(jmxUrlStr);
        JMXConnector con = JMXConnectorFactory.connect(servURL);
        MBeanServerConnection mbsc = con.getMBeanServerConnection();
        RuntimeMXBean proxy = ManagementFactory.getPlatformMXBean(mbsc, RuntimeMXBean.class);
        long uptime = proxy.getUptime();
        System.out.println(uptime);
    }

    public static String findPID(String name) {
        List<VirtualMachineDescriptor> list = VirtualMachine.list();
        for (VirtualMachineDescriptor vmd : list) {
            String displayName = vmd.displayName();
            if (displayName != null && displayName.equals(name)) {
                return vmd.id();
            }
        }
        throw new RuntimeException("Not Exist: " + name);
    }
}
```

## 总结

本文内容总结如下：

- 第一点，在 Java 8 版本当中，我们需要借助于 `VirtualMachine` 类的 `loadAgent()` 方法和 `management-agent.jar` 来开启 JMX 服务。
- 第二点，在 Java 9 之后的版本中，我们需要借助于 `VirtualMachine` 类的 `startLocalManagementAgent()` 和 `startManagementAgent()` 方法来开启 JMX 服务。
