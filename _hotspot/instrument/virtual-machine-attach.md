---
title: "VirtualMachine.attach()"
sequence: "108"
---

## VirtualMachine

我们继续分析，到底是如何将一个Agent挂载到运行着的目标JVM上，在上文中提到了一段代码，用来进行运行时挂载Agent，
可以参考上文中展示的关于“attachAgentToTargetJvm”方法的代码。
这个方法里面的关键是调用VirtualMachine的attach方法进行Agent挂载的功能。
下面我们就来分析一下VirtualMachine的attach方法具体是怎么实现的。

## VirtualMachine

```java
public abstract class VirtualMachine {
    public static VirtualMachine attach(String id) throws AttachNotSupportedException, IOException
    {
        if (id == null) {
            throw new NullPointerException("id cannot be null");
        }

        List<AttachProvider> providers = AttachProvider.providers();
        if (providers.size() == 0) {
            throw new AttachNotSupportedException("no providers installed");
        }

        AttachNotSupportedException lastExc = null;
        for (AttachProvider provider: providers) {
            try {
                return provider.attachVirtualMachine(id);
            } catch (AttachNotSupportedException x) {
                lastExc = x;
            }
        }
        throw lastExc;
    }
}
```

这个方法通过attachVirtualMachine方法进行attach操作，在MacOS系统中，AttachProvider的实现类是BsdAttachProvider。
我们来看一下BsdAttachProvider的attachVirtualMachine方法是如何实现的：

### HotSpotVirtualMachine

`src/jdk.attach/share/classes/sun/tools/attach/HotSpotVirtualMachine.java`

```java
public abstract class HotSpotVirtualMachine extends VirtualMachine {
}
```

### VirtualMachineImpl (Linux)

`src/jdk.attach/linux/classes/sun/tools/attach/VirtualMachineImpl.java`

```java
public class VirtualMachineImpl extends HotSpotVirtualMachine {
    // "/tmp" is used as a global well-known location for the files
    // .java_pid<pid>. and .attach_pid<pid>. It is important that this
    // location is the same for all processes, otherwise the tools
    // will not be able to find all Hotspot processes.
    // Any changes to this needs to be synchronized with HotSpot.
    private static final String tmpdir = "/tmp";
    String socket_path;
    /**
     * Attaches to the target VM
     */
    VirtualMachineImpl(AttachProvider provider, String vmid)
        throws AttachNotSupportedException, IOException
    {
        super(provider, vmid);

        // This provider only understands pids
        int pid;
        try {
            pid = Integer.parseInt(vmid);
            if (pid < 1) {
                throw new NumberFormatException();
            }
        } catch (NumberFormatException x) {
            throw new AttachNotSupportedException("Invalid process identifier: " + vmid);
        }

        // Try to resolve to the "inner most" pid namespace
        int ns_pid = getNamespacePid(pid);

        // Find the socket file. If not found then we attempt to start the
        // attach mechanism in the target VM by sending it a QUIT signal.
        // Then we attempt to find the socket file again.
        File socket_file = findSocketFile(pid, ns_pid);
        socket_path = socket_file.getPath();
        if (!socket_file.exists()) {
            // Keep canonical version of File, to delete, in case target process ends and /proc link has gone:
            File f = createAttachFile(pid, ns_pid).getCanonicalFile();
            try {
                sendQuitTo(pid);

                // give the target VM time to start the attach mechanism
                final int delay_step = 100;
                final long timeout = attachTimeout();
                long time_spend = 0;
                long delay = 0;
                do {
                    // Increase timeout on each attempt to reduce polling
                    delay += delay_step;
                    try {
                        Thread.sleep(delay);
                    } catch (InterruptedException x) { }

                    time_spend += delay;
                    if (time_spend > timeout/2 && !socket_file.exists()) {
                        // Send QUIT again to give target VM the last chance to react
                        sendQuitTo(pid);
                    }
                } while (time_spend <= timeout && !socket_file.exists());
                if (!socket_file.exists()) {
                    throw new AttachNotSupportedException(
                        String.format("Unable to open socket file %s: " +
                          "target process %d doesn't respond within %dms " +
                          "or HotSpot VM not loaded", socket_path, pid,
                                      time_spend));
                }
            } finally {
                f.delete();
            }
        }

        // Check that the file owner/permission to avoid attaching to
        // bogus process
        checkPermissions(socket_path);

        // Check that we can connect to the process
        // - this ensures we throw the permission denied error now rather than
        // later when we attempt to enqueue a command.
        int s = socket();
        try {
            connect(s, socket_path);
        } finally {
            close(s);
        }
    }
    
    // Return the socket file for the given process.
    private File findSocketFile(int pid, int ns_pid) {
        // A process may not exist in the same mount namespace as the caller.
        // Instead, attach relative to the target root filesystem as exposed by
        // procfs regardless of namespaces.
        String root = "/proc/" + pid + "/root/" + tmpdir;
        return new File(root, ".java_pid" + ns_pid);
    }
}
```

findSocketFile方法用来查询目标JVM上是否已经启动了Attach Listener，它通过检查"tmp/"目录下是否存在java_pid{pid}来进行实现。如果已经存在了，则说明Attach机制已经准备就绪，可以接受客户端的命令了，这个时候客户端就可以通过connect连接到目标JVM进行命令的发送，比如可以发送“load”命令来加载Agent。如果java_pid{pid}文件还不存在，则需要通过sendQuitTo方法向目标JVM发送一个“SIGBREAK”信号，让它初始化Attach Listener线程并准备接受客户端连接。可以看到，发送了信号之后客户端会循环等待java_pid{pid}这个文件，之后再通过connect连接到目标JVM上。


### VirtualMachineImpl (Windows)

`src/jdk.attach/windows/classes/sun/tools/attach/VirtualMachineImpl.java`

```java
public class VirtualMachineImpl extends HotSpotVirtualMachine {
}
```

## AttachProvider

```java
public abstract class AttachProvider {
    public abstract VirtualMachine attachVirtualMachine(String id)
        throws AttachNotSupportedException, IOException;
}
```

### HotSpotAttachProvider

```java
public abstract class HotSpotAttachProvider extends AttachProvider {
     void testAttachable(String id) throws AttachNotSupportedException {
         MonitoredVm mvm = null;
         try {
             VmIdentifier vmid = new VmIdentifier(id);
             MonitoredHost host = MonitoredHost.getMonitoredHost(vmid);
             mvm = host.getMonitoredVm(vmid);
 
             if (MonitoredVmUtil.isAttachable(mvm)) {
                 // it's attachable; so return false
                 return;
             }
         } catch (Throwable t) {
             if (t instanceof ThreadDeath) {
                 ThreadDeath td = (ThreadDeath)t;
                 throw td;
             }
             // we do not know what this id is
             return;
         } finally {
             if (mvm != null) {
                 mvm.detach();
             }
         }
 
         // we're sure it's not attachable; throw exception
         throw new AttachNotSupportedException(
                   "The VM does not support the attach mechanism");
    }   
}
```

### AttachProviderImpl (Linux)

```java
public class AttachProviderImpl extends HotSpotAttachProvider {
    public VirtualMachine attachVirtualMachine(String vmid)
        throws AttachNotSupportedException, IOException
    {
        checkAttachPermission();

        // AttachNotSupportedException will be thrown if the target VM can be determined
        // to be not attachable.
        testAttachable(vmid);

        return new VirtualMachineImpl(this, vmid);
    }
}
```

### AttachProviderImpl (MacOSX)

```java
public class AttachProviderImpl extends HotSpotAttachProvider {
      public VirtualMachine attachVirtualMachine(String vmid)
        throws AttachNotSupportedException, IOException
    {
        checkAttachPermission();

        // AttachNotSupportedException will be thrown if the target VM can be determined
        // to be not attachable.
        testAttachable(vmid);

        return new VirtualMachineImpl(this, vmid);
    }  
}
```

### AttachProviderImpl (Windows)

```java
public class AttachProviderImpl extends HotSpotAttachProvider {
    public VirtualMachine attachVirtualMachine(String vmid)
        throws AttachNotSupportedException, IOException
    {
        checkAttachPermission();

        // AttachNotSupportedException will be thrown if the target VM can be determined
        // to be not attachable.
        testAttachable(vmid);

        return new VirtualMachineImpl(this, vmid);
    }    
}
```

