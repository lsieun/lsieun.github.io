---
title: "Dynamic: Attach API 示例"
sequence: "116"
---

## VirtualMachine

### attach and detach

```java
package sample;

import com.sun.tools.attach.AttachNotSupportedException;
import com.sun.tools.attach.VirtualMachine;

import java.io.IOException;

public class VMAttach {
    public static void main(String[] args) throws IOException, AttachNotSupportedException {
        // 注意：需要修改 pid 的值
        String pid = "1234";
        VirtualMachine vm = VirtualMachine.attach(pid);
        vm.detach();
    }
}
```

### loadAgent

```java
import java.lang.instrument.Instrumentation;

public class DynamicAgent {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        Class<?> agentClass = DynamicAgent.class;
        System.out.println("Agent-Class: " + agentClass.getName());
        System.out.println("agentArgs: " + agentArgs);
        System.out.println("Instrumentation: " + inst.getClass().getName());
        System.out.println("ClassLoader: " + agentClass.getClassLoader());
        System.out.println("Thread Id: " + Thread.currentThread().getName() + "@" +
                Thread.currentThread().getId() + "(" + Thread.currentThread().isDaemon() + ")"
        );
        System.out.println("Can-Redefine-Classes: " + inst.isRedefineClassesSupported());
        System.out.println("Can-Retransform-Classes: " + inst.isRetransformClassesSupported());
        System.out.println("Can-Set-Native-Method-Prefix: " + inst.isNativeMethodPrefixSupported());
        System.out.println("========= ========= =========");
    }
}
```

```text
package sample;

import com.sun.tools.attach.AgentInitializationException;
import com.sun.tools.attach.AgentLoadException;
import com.sun.tools.attach.AttachNotSupportedException;
import com.sun.tools.attach.VirtualMachine;

import java.io.IOException;

public class VMAttach {
    public static void main(String[] args) throws IOException, AttachNotSupportedException,
            AgentLoadException, AgentInitializationException {
        // 注意：需要修改 pid 的值
        String pid = "1234";
        String agentPath = "D:\\git-repo\\learn-java-agent\\target\\TheAgent.jar";
        VirtualMachine vm = VirtualMachine.attach(pid);
        vm.loadAgent(agentPath, "Hello JVM Attach");
        vm.detach();
    }
}
```



### getSystemProperties

```java
package sample;

import com.sun.tools.attach.AttachNotSupportedException;
import com.sun.tools.attach.VirtualMachine;

import java.io.IOException;
import java.util.Properties;

public class VMAttach {
    public static void main(String[] args) throws IOException, AttachNotSupportedException {
        // 注意：需要修改 pid 的值
        String pid = "1234";
        VirtualMachine vm = VirtualMachine.attach(pid);
        Properties properties = vm.getSystemProperties();
        properties.list(System.out);
        vm.detach();
    }
}
```

Output:

```text
-- listing properties --
java.runtime.name=Java(TM) SE Runtime Environment
sun.boot.library.path=C:\Program Files\Java\jdk1.8.0_301\jr...
java.vm.version=25.301-b09
java.vm.vendor=Oracle Corporation
java.vendor.url=http://java.oracle.com/
path.separator=;
java.vm.name=Java HotSpot(TM) 64-Bit Server VM
...
```

### getAgentProperties

```java
package sample;

import com.sun.tools.attach.AttachNotSupportedException;
import com.sun.tools.attach.VirtualMachine;

import java.io.IOException;
import java.util.Properties;

public class VMAttach {
    public static void main(String[] args) throws IOException, AttachNotSupportedException {
        // 注意：需要修改 pid 的值
        String pid = "1234";
        VirtualMachine vm = VirtualMachine.attach(pid);
        Properties properties = vm.getAgentProperties();
        properties.list(System.out);
        vm.detach();
    }
}
```

Output:

```text
-- listing properties --
sun.jvm.args=-javaagent:C:\Program Files\JetBrains...
sun.jvm.flags=
sun.java.command=sample.Program
```

### list

```java
import com.sun.tools.attach.AttachNotSupportedException;
import com.sun.tools.attach.VirtualMachine;
import com.sun.tools.attach.VirtualMachineDescriptor;
import com.sun.tools.attach.spi.AttachProvider;

import java.io.IOException;
import java.util.List;

public class VMAttach {
    public static void main(String[] args) throws IOException, AttachNotSupportedException {
        List<VirtualMachineDescriptor> list = VirtualMachine.list();

        for (VirtualMachineDescriptor vmd : list) {
            String id = vmd.id();
            String displayName = vmd.displayName();
            AttachProvider provider = vmd.provider();
            System.out.println("Id: " + id);
            System.out.println("Name: " + displayName);
            System.out.println("Provider: " + provider);
            System.out.println("=====================");
        }
    }
}
```

```java
package sample;

import com.sun.tools.attach.AttachNotSupportedException;
import com.sun.tools.attach.VirtualMachine;
import com.sun.tools.attach.VirtualMachineDescriptor;

import java.io.IOException;
import java.util.List;
import java.util.Properties;

public class VMAttach {
    public static void main(String[] args) throws IOException, AttachNotSupportedException {
        List<VirtualMachineDescriptor> list = VirtualMachine.list();

        String className = "sample.Program";
        VirtualMachine vm = null;
        for (VirtualMachineDescriptor item : list) {
            String displayName = item.displayName();
            if (displayName != null && displayName.equals(className)) {
                vm = VirtualMachine.attach(item);
                break;
            }
        }

        if (vm != null) {
            Properties properties = vm.getSystemProperties();
            properties.list(System.out);
            vm.detach();
        }
    }
}
```



## AttachProvider

```java
import com.sun.tools.attach.VirtualMachine;
import com.sun.tools.attach.spi.AttachProvider;

public class VMAttach {
    public static void main(String[] args) throws Exception {
        // 注意：需要修改 pid 的值
        String pid = "1234";
        VirtualMachine vm = VirtualMachine.attach(pid);
        AttachProvider provider = vm.provider();
        String name = provider.name();
        String type = provider.type();
        System.out.println("Provider Name: " + name);
        System.out.println("Provider Type: " + type);
        System.out.println("Provider Impl: " + provider.getClass());
    }
}
```

Windows 7 环境下输出：

```text
Provider Name: sun
Provider Type: windows
Provider Impl: class sun.tools.attach.WindowsAttachProvider
```

Ubuntu 20 环境下输出：

```text
Provider Name: sun
Provider Type: socket
Provider Impl: class sun.tools.attach.LinuxAttachProvider
```

## 总结

本文主要是对 Attach API 的内容进行举例。
