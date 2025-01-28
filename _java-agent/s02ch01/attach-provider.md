---
title: "AttachProvider"
sequence: "202"
---

`AttachProvider` implementations are loaded and instantiated at the first invocation of the `providers` method.
This method attempts to load all provider implementations that are installed on the platform.

```java
public abstract class AttachProvider {
    private static final Object lock = new Object();
    private static List<AttachProvider> providers = null;
    
    public static List<AttachProvider> providers() {
        synchronized (lock) {
            if (providers == null) {
                providers = new ArrayList<AttachProvider>();

                ServiceLoader<AttachProvider> providerLoader =
                        ServiceLoader.load(AttachProvider.class, AttachProvider.class.getClassLoader());

                Iterator<AttachProvider> i = providerLoader.iterator();

                while (i.hasNext()) {
                    try {
                        providers.add(i.next());
                    } catch (Throwable t) {
                        // Ignore errors and exceptions
                        System.err.println(t);
                    }
                }
            }
            return Collections.unmodifiableList(providers);
        }
    }
}
```

All of the methods in this class are safe for use by multiple concurrent threads.

### 示例三

```java
import com.sun.tools.attach.*;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Properties;

public class VMAttachRun {
    private static final String LOCAL_CONNECTOR_ADDRESS_PROP = "com.sun.management.jmxremote.localConnectorAddress";

    public static void main(String[] args) {
        try {
            List<VirtualMachineDescriptor> list = VirtualMachine.list();

            String className = "sample.Program";
            String pid = null;
            for (VirtualMachineDescriptor item : list) {
                String displayName = item.displayName();
                if (displayName != null && displayName.equals(className)) {
                    pid = item.id();
                    break;
                }
            }

            if (pid != null) {
                String address = loadManagementAgentAndGetAddress(pid);
                System.out.println(address);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private static String loadManagementAgentAndGetAddress(String pid) throws IOException {
        VirtualMachine vm = null;
        try {
            vm = VirtualMachine.attach(pid);
        } catch (AttachNotSupportedException x) {
            throw new IOException(x.getMessage(), x);
        }

        String home = vm.getSystemProperties().getProperty("java.home");

        // Normally in ${java.home}/jre/lib/management-agent.jar but might
        // be in ${java.home}/lib in build environments.

        String agent = home + File.separator + "jre" + File.separator + "lib" + File.separator + "management-agent.jar";
        File f = new File(agent);
        if (!f.exists()) {
            agent = home + File.separator + "lib" + File.separator + "management-agent.jar";
            f = new File(agent);
            if (!f.exists()) {
                throw new IOException("Management agent not found");
            }
        }

        agent = f.getCanonicalPath();

        try {
            vm.loadAgent(agent, "com.sun.management.jmxremote");
        } catch (AgentLoadException | AgentInitializationException x) {
            throw new IOException(x.getMessage(), x);
        }

        // get the connector address
        Properties agentProps = vm.getAgentProperties();
        String address = (String) agentProps.get(LOCAL_CONNECTOR_ADDRESS_PROP);
        vm.detach();

        return address;
    }
}
```
