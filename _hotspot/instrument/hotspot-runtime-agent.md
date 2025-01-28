---
title: "HotSpot Runtime Agent"
sequence: "104"
---

## AttachListener::init

Attach机制通过Attach Listener线程来进行相关事务的处理，下面来看一下Attach Listener线程是如何初始化的。

```text
// Starts the Attach Listener thread
void AttachListener::init() {
    EXCEPTION_MARK;

    const char *name = "Attach Listener";
    Handle thread_oop = JavaThread::create_system_thread_object(name, true /* visible */, THREAD);

    // 关注点
    JavaThread *thread = new JavaThread(&attach_listener_thread_entry);
    JavaThread::vm_exit_on_osthread_failure(thread);

    JavaThread::start_internal_daemon(THREAD, thread, thread_oop, NoPriority);
}
```

我们知道，一个线程启动之后都需要指定一个入口来执行代码，Attach Listener线程的入口是`attach_listener_thread_entry`，下面看一下这个函数的具体实现：

```text
// The Attach Listener threads services a queue.
// It dequeues an operation from the queue, examines the operation name (command),
// and dispatches to the corresponding function to perform the operation.

static void attach_listener_thread_entry(JavaThread* thread, TRAPS) {
    AttachListener::set_initialized();

    for (;;) {
        AttachOperation* op = AttachListener::dequeue();

        bufferedStream st;
        jint res = JNI_OK;

        // find the function to dispatch too
        AttachOperationFunctionInfo* info = NULL;
        for (int i=0; funcs[i].name != NULL; i++) {
            const char* name = funcs[i].name;
            if (strcmp(op->name(), name) == 0) {
                info = &(funcs[i]);
                break;
            }
        }

        // dispatch to the function that implements this operation
        res = (info->func)(op, &st);

        // operation complete - send result and output to client
        op->complete(res, &st);
    }

    ShouldNotReachHere();
}
```

整个函数执行逻辑，大概是这样的：

- 拉取一个需要执行的任务：`AttachListener::dequeue`。
- 查询匹配的命令处理函数。
- 执行匹配到的命令执行函数。

### funcs

`src/hotspot/share/services/attachListener.cpp`

其中第二步里面存在一个命令函数表，整个表如下：

```text
// names must be of length <= AttachOperation::name_length_max
static AttachOperationFunctionInfo funcs[] = {
        { "agentProperties",  get_agent_properties },
        { "datadump",         data_dump },
        { "dumpheap",         dump_heap },
        { "load",             load_agent },
        { "properties",       get_system_properties },
        { "threaddump",       thread_dump },
        { "inspectheap",      heap_inspection },
        { "setflag",          set_flag },
        { "printflag",        print_flag },
        { "jcmd",             jcmd },
        { NULL,               NULL }
};

// Implementation of "agent_properties" command.
static jint get_agent_properties(AttachOperation* op, outputStream* out) {
    return get_properties(op, out, vmSymbols::serializeAgentPropertiesToByteArray_name());
}

// Implementation of "load" command.
static jint load_agent(AttachOperation* op, outputStream* out) {
    // get agent name and options
    const char* agent = op->arg(0);
    const char* absParam = op->arg(1);
    const char* options = op->arg(2);

    // If loading a java agent then need to ensure that the java.instrument module is loaded
    if (strcmp(agent, "instrument") == 0) {
        JavaThread* THREAD = JavaThread::current(); // For exception macros.
        ResourceMark rm(THREAD);
        HandleMark hm(THREAD);
        JavaValue result(T_OBJECT);
        Handle h_module_name = java_lang_String::create_from_str("java.instrument", THREAD);
        JavaCalls::call_static(&result,
                               vmClasses::module_Modules_klass(),
                               vmSymbols::loadModule_name(),
                               vmSymbols::loadModule_signature(),
                               h_module_name,
                               THREAD);
    }

    return JvmtiExport::load_agent_library(agent, absParam, options, out);
}
```

对于加载Agent来说，命令就是“load”。现在，我们知道了Attach Listener大概的工作模式，但是还是不太清楚任务从哪来，这个秘密就藏在AttachListener::dequeue这行代码里面，接下来我们来分析一下dequeue这个函数：

### LinuxAttachListener::dequeue()

`src/hotspot/os/linux/attachListener_linux.cpp`

```text
// Dequeue an operation
//
// In the Linux implementation there is only a single operation and
// clients cannot queue commands (except at the socket level).
//
LinuxAttachOperation* LinuxAttachListener::dequeue() {
    for (;;) {
        int s;

        // wait for client to connect
        struct sockaddr addr;
        socklen_t len = sizeof(addr);
        
        // 调用accept方法
        RESTARTABLE(::accept(listener(), &addr, &len), s);

        // get the credentials of the peer and check the effective uid/guid
        struct ucred cred_info;
        socklen_t optlen = sizeof(cred_info);
        if (::getsockopt(s, SOL_SOCKET, SO_PEERCRED, (void*)&cred_info, &optlen) == -1) {
            log_debug(attach)("Failed to get socket option SO_PEERCRED");
            ::close(s);
            continue;
        }
        

        // peer credential look okay so we read the request
        LinuxAttachOperation* op = read_request(s);
        return op;
    }
}
```

这是Linux上的实现，不同的操作系统实现方式不太一样。上面的代码表面，Attach Listener在某个端口监听着，通过accept来接收一个连接，
然后从这个连接里面将请求读取出来，然后将请求包装成一个AttachOperation类型的对象，之后就会从表里查询对应的处理函数，然后进行处理。



### thread.cpp- Threads::create_vm

`src/hotspot/share/runtime/thread.cpp`

Attach Listener使用一种被称为“懒加载”的策略进行初始化，也就是说，JVM启动的时候Attach Listener并不一定会启动起来。下面我们来分析一下这种“懒加载”策略的具体实现方案。

```text
jint Threads::create_vm(JavaVMInitArgs *args, bool *canTryAgain) {
    extern void JDK_Version_init();

    // ...
    
    // Signal Dispatcher needs to be started before VMInit event is posted
    os::initialize_jdk_signal_support(CHECK_JNI_ERR);

    // Start Attach Listener if +StartAttachListener or it can't be started lazily
    if (!DisableAttachMechanism) {
        AttachListener::vm_start();
        if (StartAttachListener || AttachListener::init_at_startup()) {
            AttachListener::init();
        }
    }

    // ...

    return JNI_OK;
}
```

上面的代码截取自create_vm函数，`DisableAttachMechanism`、`StartAttachListener`和`ReduceSignalUsage`这三个变量默认都是`false`，
所以`AttachListener::init()`;这行代码不会在`create_vm`的时候执行，而是`vm_start`会执行。下面来看一下这个函数的实现细节：


### AttachListener::init_at_startup

`src/hotspot/os/linux/attachListener_linux.cpp`

```text
// Attach Listener is started lazily
// except in the case when +ReduseSignalUsage is used
bool AttachListener::init_at_startup() {
    if (ReduceSignalUsage) {
        return true;
    } else {
        return false;
    }
}
```

### AttachListener::vm_start

```text
// Performs initialization at vm startup
// For Linux we remove any stale .java_pid file
// which could cause an attaching process to think
// we are ready to receive on the domain socket before we are properly initialized

void AttachListener::vm_start() {
    char fn[UNIX_PATH_MAX];
    struct stat64 st;
    int ret;

    int n = snprintf(fn, UNIX_PATH_MAX, "%s/.java_pid%d",
                     os::get_temp_directory(), os::current_process_id());
    assert(n < (int)UNIX_PATH_MAX, "java_pid file name buffer overflow");

    RESTARTABLE(::stat64(fn, &st), ret);
    if (ret == 0) {
        ret = ::unlink(fn);
        if (ret == -1) {
            log_debug(attach)("Failed to remove stale attach pid file at %s", fn);
        }
    }
}
```

这是在Linux上的实现，是将`/tmp/`目录下的`.java_pid{pid}`文件删除，后面在创建Attach Listener线程的时候会创建出来这个文件。
上面说到，`AttachListener::init()`这行代码不会在`create_vm`的时候执行，这行代码的实现已经在上文中分析了，就是创建Attach Listener线程，并监听其他JVM的命令请求。
现在来分析一下这行代码是什么时候被调用的，也就是“懒加载”到底是怎么加载起来的。

```text
// Signal Dispatcher needs to be started before VMInit event is posted
os::initialize_jdk_signal_support(CHECK_JNI_ERR);
```

这是`create_vm`中的一段代码，看起来跟信号相关，其实Attach机制就是使用信号来实现“懒加载“的。下面我们来仔细地分析一下这个过程。

### os::initialize_jdk_signal_support

`src/hotspot/share/runtime/os.cpp`

```text
void os::initialize_jdk_signal_support(TRAPS) {
    if (!ReduceSignalUsage) {
        // Setup JavaThread for processing signals
        const char* name = "Signal Dispatcher";
        Handle thread_oop = JavaThread::create_system_thread_object(name, true /* visible */, CHECK);

        JavaThread* thread = new JavaThread(&signal_thread_entry);
        JavaThread::vm_exit_on_osthread_failure(thread);

        JavaThread::start_internal_daemon(THREAD, thread, thread_oop, NearMaxPriority);

        // Handle ^BREAK
        os::signal(SIGBREAK, os::user_handler());
    }
}
```

JVM创建了一个新的进程来实现信号处理，这个线程叫“Signal Dispatcher”，一个线程创建之后需要有一个入口，“Signal Dispatcher”的入口是signal_thread_entry：

```text
// sigexitnum_pd is a platform-specific special signal used for terminating the Signal thread.
static void signal_thread_entry(JavaThread *thread, TRAPS) {
    os::set_priority(thread, NearMaxPriority);
    while (true) {
        int sig;
        {
            // FIXME : Currently we have not decided what should be the status
            //         for this java thread blocked here. Once we decide about
            //         that we should fix this.
            sig = os::signal_wait();
        }
        if (sig == os::sigexitnum_pd()) {
            // Terminate the signal thread
            return;
        }

        switch (sig) {
            case SIGBREAK: {

                // Check if the signal is a trigger to start the Attach Listener - in that
                // case don't print stack traces.
                if (!DisableAttachMechanism) {
                    // Attempt to transit state to AL_INITIALIZING.
                    AttachListenerState cur_state = AttachListener::transit_state(AL_INITIALIZING, AL_NOT_INITIALIZED);
                    if (cur_state == AL_INITIALIZING) {
                        // Attach Listener has been started to initialize. Ignore this signal.
                        continue;
                    } else if (cur_state == AL_NOT_INITIALIZED) {
                        // Start to initialize.
                        if (AttachListener::is_init_trigger()) {
                            // Attach Listener has been initialized.
                            // Accept subsequent request.
                            continue;
                        } else {
                            // Attach Listener could not be started.
                            // So we need to transit the state to AL_NOT_INITIALIZED.
                            AttachListener::set_state(AL_NOT_INITIALIZED);
                        }
                    } else if (AttachListener::check_socket_file()) {
                        // Attach Listener has been started, but unix domain socket file
                        // does not exist. So restart Attach Listener.
                        continue;
                    }
                }
                // Print stack traces
                // Any SIGBREAK operations added here should make sure to flush
                // the output stream (e.g. tty->flush()) after output.  See 4803766.
                // Each module also prints an extra carriage return after its output.
                VM_PrintThreads op(tty, PrintConcurrentLocks, false /* no extended info */,
                                   true /* print JNI handle info */);
                VMThread::execute(&op);
                VM_FindDeadlocks op1(tty);
                VMThread::execute(&op1);
                Universe::print_heap_at_SIGBREAK();
                if (PrintClassHistogram) {
                    VM_GC_HeapInspection op1(tty, true /* force full GC before heap inspection */);
                    VMThread::execute(&op1);
                }
                if (JvmtiExport::should_post_data_dump()) {
                    JvmtiExport::post_data_dump();
                }
                break;
            }
            default: {
                // Dispatch the signal to java
                HandleMark hm(THREAD);
                Klass *klass = SystemDictionary::resolve_or_null(vmSymbols::jdk_internal_misc_Signal(), THREAD);
                if (klass != NULL) {
                    JavaValue result(T_VOID);
                    JavaCallArguments args;
                    args.push_int(sig);
                    JavaCalls::call_static(
                            &result,
                            klass,
                            vmSymbols::dispatch_name(),
                            vmSymbols::int_void_signature(),
                            &args,
                            THREAD
                    );
                }
                if (HAS_PENDING_EXCEPTION) {
                    // tty is initialized early so we don't expect it to be null, but
                    // if it is we can't risk doing an initialization that might
                    // trigger additional out-of-memory conditions
                    if (tty != NULL) {
                        char klass_name[256];
                        char tmp_sig_name[16];
                        const char *sig_name = "UNKNOWN";
                        InstanceKlass::cast(PENDING_EXCEPTION->klass())->
                                name()->as_klass_external_name(klass_name, 256);
                        if (os::exception_name(sig, tmp_sig_name, 16) != NULL)
                            sig_name = tmp_sig_name;
                        warning("Exception %s occurred dispatching signal %s to handler"
                                "- the VM may need to be forcibly terminated",
                                klass_name, sig_name);
                    }
                    CLEAR_PENDING_EXCEPTION;
                }
            }
        }
    }
}
```

这段代码截取自`signal_thread_entry`函数，截取中的内容是和Attach机制信号处理相关的代码。
这段代码的意思是，当接收到“SIGBREAK”信号，就执行接下来的代码，这个信号是需要Attach到JVM上的信号发出来，这个后面会再分析。
我们先来看一句关键的代码：`AttachListener::is_init_trigger()`：

### AttachListener::is_init_trigger

```text
// If the file .attach_pid<pid> exists in the working directory
// or /tmp then this is the trigger to start the attach mechanism
bool AttachListener::is_init_trigger() {
    if (init_at_startup() || is_initialized()) {
        return false;               // initialized at startup or already initialized
    }
    char fn[PATH_MAX + 1];
    int ret;
    struct stat64 st;
    sprintf(fn, ".attach_pid%d", os::current_process_id());
    RESTARTABLE(::stat64(fn, &st), ret);
    if (ret == -1) {
        log_trace(attach)("Failed to find attach file: %s, trying alternate", fn);
        
        // 获取临时目录，获取进程ID
        snprintf(fn, sizeof(fn), "%s/.attach_pid%d", os::get_temp_directory(), os::current_process_id());
        
        RESTARTABLE(::stat64(fn, &st), ret);
        if (ret == -1) {
            log_debug(attach)("Failed to find attach file: %s", fn);
        }
    }
    if (ret == 0) {
        // simple check to avoid starting the attach mechanism
        // when a bogus non-root user creates the file
        if (os::Posix::matches_effective_uid_or_root(st.st_uid)) {
            // 执行init()方法
            init();
            log_trace(attach)("Attach triggered by %s", fn);
            return true;
        } else {
            log_debug(attach)("File %s has wrong user id %d (vs %d). Attach is not triggered", fn, st.st_uid, geteuid());
        }
    }
    return false;
}
```

首先检查了一下是否在JVM启动时启动了Attach Listener，或者是否已经启动过。
如果没有，才继续执行，在`/tmp`目录下创建一个叫做`.attach_pid%d`的文件，然后执行AttachListener的init函数，
这个函数就是用来创建Attach Listener线程的函数，上面已经提到多次并进行了分析。
到此，我们知道Attach机制的奥秘所在，也就是Attach Listener线程的创建依靠Signal Dispatcher线程，Signal Dispatcher是用来处理信号的线程，
当Signal Dispatcher线程接收到“SIGBREAK”信号之后，就会执行初始化Attach Listener的工作。


## Reference

- [美团技术团队：Java动态调试技术原理及实践](https://blog.csdn.net/MeituanTech/article/details/102965857)


















