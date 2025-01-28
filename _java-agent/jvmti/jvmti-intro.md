---
title: "JVM TI: Intro"
sequence: "801"
---

## What is the JVM Tool Interface?

The **JVM Tool Interface (JVM TI)** is a programming interface used by development and monitoring tools.

**JVM TI** is intended to provide a VM interface for the full breadth of tools that need access to VM state,
including but not limited to: profiling, debugging, monitoring, thread analysis, and coverage analysis tools.

> 这里在讲用途

JVM TI may not be available in all implementations of the Java virtual machine.

> 并不是所有的 JVM 都支持 JVM TI

JVM TI is a **two-way interface**.
**A client of JVM TI**, hereafter called an **agent**, can be notified of interesting occurrences through **events**.
**JVM TI** can query and control the **application** through many **functions**, either in response to events or independent of them.

> 这里的 two-way interface 是什么意思呢？

**Agents** run in the same process with and communicate directly with the **virtual machine** executing the **application** being examined.
This communication is through a native interface (**JVM TI**).
The native in-process interface allows maximal control with minimal intrusion on the part of a tool.
Typically, agents are relatively compact.
They can be controlled by a separate process
which implements the bulk of a tool's function without interfering with the target application's normal execution.

> Agent 与 Application 沟通是通过 JVM TI 实现的

```text
  Agent            Application
-----------------------------------
         JVM TI
-----------------------------------
          JVM
```

## Architecture

Tools can be written directly to JVM TI or indirectly through higher level interfaces.
The Java Platform Debugger Architecture includes JVM TI,
but also contains higher-level, out-of-process debugger interfaces.
The higher-level interfaces are more appropriate than JVM TI for many tools.

## Deploying Agents

An agent is deployed in a platform specific manner but is typically the platform equivalent of a dynamic library.

- On the Windows operating system, for example, an agent library is a "Dynamic Linked Library" (DLL).
- On the Solaris Operating Environment, an agent library is a shared object (`.so` file).

An agent may be started at VM startup by specifying the agent library name using a command line option.
Some implementations may support a mechanism to start agents in the live phase.

## File

```text
// src/java.base/share/native/include/jni.h

typedef struct JavaVMOption {
    char *optionString;
    void *extraInfo;
} JavaVMOption;
```

```text
// src/java.base/share/native/include/jni.h

typedef struct JavaVMInitArgs {
    jint version;

    jint nOptions;
    JavaVMOption *options;
    jboolean ignoreUnrecognized;
} JavaVMInitArgs;
```

```text
// src/java.base/share/native/include/jni.h

typedef struct JavaVMAttachArgs {
    jint version;

    char *name;
    jobject group;
} JavaVMAttachArgs;
```

## Agent Start-Up

The VM starts each agent by invoking a start-up function.

- If the agent is started in the OnLoad phase the function `Agent_OnLoad` will be invoked.
- If the agent is started in the live phase the function `Agent_OnAttach` will be invoked.

Exactly one call to a start-up function is made per agent.

> 对于每一个 Agent，JVM 只调用 `Agent_OnLoad` 或 `Agent_OnAttach` 方法一次。

### Agent Start-Up (OnLoad phase)

If an agent is started during the OnLoad phase then its agent library must export a start-up function with the following prototype:

```text
JNIEXPORT jint JNICALL
Agent_OnLoad(JavaVM *vm, char *options, void *reserved)
```

The VM will call the `Agent_OnLoad` function with `<options>` as the second argument - that is,
"opt1,opt2" will be passed to the char `*options` argument of `Agent_OnLoad`.

```text
-agentlib:foo=opt1,opt2
-agentpath:c:\myLibs\foo.dll=opt1,opt2
```

The period between when `Agent_OnLoad` is called and when it returns is called **the OnLoad phase**.
Since the VM is not initialized during the OnLoad phase,
the set of allowed operations inside `Agent_OnLoad` is restricted.
The agent can safely process the `options` and set event callbacks with `SetEventCallbacks`.
Once the VM initialization event is received (that is, the `VMInit` callback is invoked), the agent can complete its initialization.

> 这里是讲 JVM 的初始化与 Agent 的初始化是互相合作的。

The return value from `Agent_OnLoad` is used to indicate an error.
Any value other than zero indicates an error and causes termination of the VM.

> 方法的返回值

### Agent Start-Up (Live phase)

A VM may support a mechanism that allows agents to be started in the VM during the live phase.
The details of how this is supported, are implementation specific.

If an agent is started during the live phase then its agent library must export a start-up function with the following prototype:

```text
JNIEXPORT jint JNICALL
Agent_OnAttach(JavaVM* vm, char *options, void *reserved)
```

The VM will start the agent by calling this function.
It will be called in the context of a thread that is attached to the VM.
The first argument `<vm>` is the Java VM.
The `<options>` argument is the startup `options` provided to the agent.

The lifespan of the `options` string is the `Agent_OnAttach` call.
If needed beyond this time the string or parts of the string must be copied.

Note that some capabilities may not be available in the live phase.

The `Agent_OnAttach` function initializes the agent and returns a value to the VM to indicate if an error occurred.
Any value other than zero indicates an error.
An error does not cause the VM to terminate.
Instead the VM ignores the error, or takes some implementation specific action --
for example it might print an error to standard error, or record the error in a system log.

## Agent Shutdown

The library may optionally export a shutdown function with the following prototype:

```text
JNIEXPORT void JNICALL
Agent_OnUnload(JavaVM *vm)
```

This function will be called by the VM when the library is about to be unloaded.
The library will be unloaded (unless it is statically linked into the executable) and this function will be called
if some platform specific mechanism causes the unload (an unload mechanism is not specified in this document) or
the library is (in effect) unloaded by the termination of the VM whether through normal termination or VM failure, including start-up failure.
Uncontrolled shutdown is, of course, an exception to this rule.

Note the distinction between this function and the VM Death event:
for the VM Death event to be sent, the VM must have run at least to the point of initialization and
a valid JVM TI environment must exist which has set a callback for VMDeath and enabled the event.
None of these are required for `Agent_OnUnload` and
this function is also called if the library is unloaded for other reasons.
In the case that a VM Death event is sent, it will be sent before this function is called (assuming this function is called due to VM termination).
This function can be used to clean-up resources allocated by the agent.

## Environments

The JVM TI specification supports the use of **multiple simultaneous JVM TI agents**.
Each agent has its own JVM TI environment.
That is, the JVM TI state is separate for each agent - changes to one environment do not affect the others.
The state of a JVM TI environment includes:

- the event callbacks
- the set of events which are enabled
- the capabilities
- the memory allocation/deallocation hooks

Although their JVM TI state is separate,
**agents inspect and modify the shared state of the VM,**
**they also share the native environment in which they execute.**
As such, an agent can perturb the results of other agents or cause them to fail.
It is the responsibility of the agent writer to specify the level of compatibility with other agents.
JVM TI implementations are not capable of preventing destructive interactions between agents.
Techniques to reduce the likelihood of these occurrences are beyond the scope of this document.

An agent creates a JVM TI environment by passing a JVM TI version as the interface ID to the JNI Invocation API function `GetEnv`.
See Accessing JVM TI Functions for more details on the creation and use of JVM TI environments.
**Typically, JVM TI environments are created by calling `GetEnv` from `Agent_OnLoad`.**

## Bytecode Instrumentation

This interface does not include some events that one might expect in an interface with profiling support.
Some examples include full speed method enter and exit events.
The interface instead **provides support for bytecode instrumentation**,
the ability to alter the Java virtual machine bytecode instructions which comprise the target program.
Typically, these alterations are to add "events" to the code of a method - for example,
to add, at the beginning of a method, a call to `MyProfiler.methodEntered()`.

**Since the changes are purely additive, they do not modify application state or behavior.**
Because the inserted agent code is standard bytecodes, the VM can run at full speed,
optimizing not only the target program but also the instrumentation.
If the instrumentation does not involve switching from bytecode execution, no expensive state transitions are needed.
The result is **high performance events**.

This approach also provides **complete control** to the agent:
instrumentation can be restricted to "interesting" portions of the code (e.g., the end user's code) and can be conditional.
Instrumentation can run entirely in **Java programming language code** or can call into the **native agent**.
Instrumentation can simply maintain counters or can statistically sample events.

Instrumentation can be inserted in one of three ways:

- **Static Instrumentation**: The class file is instrumented before it is loaded into the VM -
  for example, by creating a duplicate directory of `*.class` files which have been modified to add the instrumentation.
  This method is extremely awkward and, in general, an agent cannot know the origin of the class files which will be loaded.
- **Load-Time Instrumentation**: When a class file is loaded by the VM, the raw bytes of the class file are sent for instrumentation to the agent.
  The `ClassFileLoadHook` event, triggered by the **class load**, provides this functionality.
  This mechanism provides efficient and complete access to one-time instrumentation.
- **Dynamic Instrumentation**: A class which is already loaded (and possibly even running) is modified.
  This optional feature is provided by the `ClassFileLoadHook` event, triggered by calling the `RetransformClasses` function.
  **Classes can be modified multiple times and can be returned to their original state.**
  The mechanism allows instrumentation which changes during the course of execution.

The class modification functionality provided in this interface is intended to provide a mechanism for instrumentation
(the `ClassFileLoadHook` event and the `RetransformClasses` function) and, during development,
for **fix-and-continue debugging** (the `RedefineClasses` function).

Care must be taken to avoid perturbing dependencies, especially when instrumenting **core classes**.
For example, an approach to getting **notification of every object allocation** is to instrument the constructor on `Object`.
Assuming that the constructor is initially empty, the constructor could be changed to:

```text
public Object() {
    MyProfiler.allocationTracker(this);
}
```

However, if this change was made using the `ClassFileLoadHook` event then this might impact a typical VM as follows:
the first created object will call the constructor causing a class load of `MyProfiler`;
which will then cause object creation, and since `MyProfiler` isn't loaded yet, **infinite recursion**;
resulting in a stack overflow.

A refinement of this would be to delay invoking the tracking method until a safe time.
For example, `trackAllocations` could be set in the handler for the `VMInit` event.

```text
static boolean trackAllocations = false;

public Object() {
  if (trackAllocations) {
    MyProfiler.allocationTracker(this);
  }
}
```

The `SetNativeMethodPrefix` allows native methods to be instrumented by the use of wrapper methods.

## Functions

### Accessing Functions

A JVM TI environment can be obtained through the JNI Invocation API `GetEnv` function:

```text
jvmtiEnv *jvmti;
...
(*jvm)->GetEnv(jvm, &jvmti, JVMTI_VERSION_1_0);
```

```text
jint GetEnv(void **penv, jint version);
```

Each call to `GetEnv` creates a new JVM TI connection and thus a new JVM TI environment.
The `version` argument of `GetEnv` must be a JVM TI version.
The returned environment may have a different version than the requested version but the returned environment must be compatible.
`GetEnv` will return `JNI_EVERSION` if a compatible version is not available,
if JVM TI is not supported or JVM TI is not supported in the current VM configuration.
Other interfaces may be added for creating JVM TI environments in specific contexts.
**Each environment has its own state** (for example, desired events, event handling functions, and capabilities).
An environment is released with `DisposeEnvironment`.
Thus, unlike JNI which has one environment per thread,
**JVM TI environments work across threads and are created dynamically.**

## Retransform Classes

The **initial class file bytes** represent the bytes passed to ClassLoader.defineClass or RedefineClasses (before any transformations were applied).

## Class File Load Hook

```text
void JNICALL
ClassFileLoadHook(jvmtiEnv *jvmti_env,
            JNIEnv* jni_env,
            jclass class_being_redefined,
            jobject loader,
            const char* name,
            jobject protection_domain,
            jint class_data_len,
            const unsigned char* class_data,
            jint* new_class_data_len,
            unsigned char** new_class_data)
```

This event is sent when the VM obtains class file data, but before it constructs the in-memory representation for that class.

> 第一种情况，加载的时候

This event is also sent when the class is being modified by the `RetransformClasses` function or the `RedefineClasses` function, called in any JVM TI environment. 

> 第二种情况，调用 `RetransformClasses` 或 `RedefineClasses`

The agent must allocate the space for the modified class file data buffer using the memory allocation function `Allocate`
because the VM is responsible for freeing the new class file data buffer using `Deallocate`.

If the agent wishes to modify the class file,
it must set `new_class_data` to point to the newly instrumented class file data buffer and
set `new_class_data_len` to the length of that buffer before returning from this call.
If no modification is desired, the agent simply does not set `new_class_data`.

> 要给 new_class_data 赋值

If multiple agents have enabled this event the results are chained.
That is, if `new_class_data` has been set, it becomes the `class_data` for the next agent.

> 这里讲多个 agent 的情况












