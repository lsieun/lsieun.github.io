---
title: "HotSpot Load-Time Agent"
sequence: "103"
---

在系统初始化阶段，`Arguments`模块会对传入的VM选项进行解析。

## 参数解析

### parse_each_vm_init_arg

- `parse_each_vm_init_arg(const JavaVMInitArgs *args, bool *patch_mod_javabase, JVMFlagOrigin origin)`
  - `add_init_agent(name, options, is_absolute_path)`
  - `add_instrument_agent("instrument", options, false)`

```text
// src/hotspot/share/runtime/arguments.cpp
jint Arguments::parse_each_vm_init_arg(const JavaVMInitArgs *args, bool *patch_mod_javabase, JVMFlagOrigin origin) {
    // For match_option to return remaining or value part of option string
    const char *tail;

    // iterate over arguments
    for (int index = 0; index < args->nOptions; index++) {
        bool is_absolute_path = false;  // for -agentpath vs -agentlib

        const JavaVMOption *option = args->options + index;

        // ...
        // -agentlib and -agentpath
        if (match_option(option, "-agentlib:", &tail) ||
            (is_absolute_path = match_option(option, "-agentpath:", &tail))) {
            if (tail != NULL) {
                // -agentlib:<libname>[=<options>]
                // -agentpath:<pathname>[=<options>]
                // pos是记录“=”的位置
                const char *pos = strchr(tail, '=');

                // name记录<libname>或<pathname>部分
                char *name;
                if (pos == NULL) {
                    name = os::strdup_check_oom(tail, mtArguments);
                } else {
                    size_t len = pos - tail;
                    name = NEW_C_HEAP_ARRAY(char, len + 1, mtArguments);
                    memcpy(name, tail, len);
                    name[len] = '\0';
                }

                // options记录[<options>]部分
                char *options = NULL;
                if (pos != NULL) {
                    options = os::strdup_check_oom(pos + 1, mtArguments);
                }

                // 第一个关注的方法
                add_init_agent(name, options, is_absolute_path);
            }
        }
        // -javaagent
        else if (match_option(option, "-javaagent:", &tail)) {
            if (tail != NULL) {
                // -javaagent:<jarpath>[=<options>]
                size_t length = strlen(tail) + 1;

                // 获取<jarpath>[=<options>]信息
                char *options = NEW_C_HEAP_ARRAY(char, length, mtArguments);
                jio_snprintf(options, length, "%s", tail);

                // 第二个关注的方法
                add_instrument_agent("instrument", options, false);
                // java agents need module java.instrument
                if (!create_numbered_module_property("jdk.module.addmods", "java.instrument", addmods_count++)) {
                    return JNI_ENOMEM;
                }
            }
        }
        // ...
    }
}
```

It should be noted here that there are some special points in parsing the `-javaagent` parameter.
This parameter is used to specify an Agent that we write through the Java Instrumentation API.
The Java Instrumentation API bottom layer depends on the JVMTI, and the handling of `-javaagent` also shows this point.
When calling the `add_instrument_agent` function, the first parameter is "instrument", about loading the Agent Expand in the next section.
At this point, we know that the Agent specified when starting the JVM has been parsed by the JVM and stored in a linked list structure.
Let's analyze how the JVM loads these agents.

### add_init_agent

```text
// src/hotspot/share/runtime/arguments.cpp
void Arguments::add_init_agent(const char* name, char* options, bool absolute_path) {
    _agentList.add(new AgentLibrary(name, options, absolute_path, NULL));
}
```

The `AgentLibraryList` is a simple chain list structure.
The `add_init_agent` function adds the resolved and loaded agents to the chain list and waits for subsequent processing.

### add_instrument_agent

```text
// src/hotspot/share/runtime/arguments.cpp
void Arguments::add_instrument_agent(const char* name, char* options, bool absolute_path) {
    _agentList.add(new AgentLibrary(name, options, absolute_path, NULL, true));
}
```

### _agentList

```text
// src/hotspot/share/runtime/arguments.hpp

// -agentlib and -agentpath arguments
static AgentLibraryList _agentList;

// -agentlib -agentpath
static AgentLibrary *agents() { 
    return _agentList.first();
}

static bool init_agents_at_startup() { 
    return !_agentList.is_empty();
}
```

### AgentLibrary

```text
// src/hotspot/share/runtime/arguments.hpp

// For use by -agentlib, -agentpath and -Xrun
class AgentLibrary : public CHeapObj<mtArguments> {
    friend class AgentLibraryList;
public:
    // Is this library valid or not. Don't rely on os_lib == NULL as statically
    // linked lib could have handle of RTLD_DEFAULT which == 0 on some platforms
    enum AgentState {
        agent_invalid = 0,
        agent_valid   = 1
    };

private:
    char*           _name;
    char*           _options;
    void*           _os_lib;
    bool            _is_absolute_path;
    bool            _is_static_lib;
    bool            _is_instrument_lib;
    AgentState      _state;
    AgentLibrary*   _next;

public:
    // Accessors
    const char* name() const                  { return _name; }
    char* options() const                     { return _options; }
    bool is_absolute_path() const             { return _is_absolute_path; }
    void* os_lib() const                      { return _os_lib; }
    void set_os_lib(void* os_lib)             { _os_lib = os_lib; }
    AgentLibrary* next() const                { return _next; }
    bool is_static_lib() const                { return _is_static_lib; }
    bool is_instrument_lib() const            { return _is_instrument_lib; }
    void set_static_lib(bool is_static_lib)   { _is_static_lib = is_static_lib; }
    bool valid()                              { return (_state == agent_valid); }
    void set_valid()                          { _state = agent_valid; }
    void set_invalid()                        { _state = agent_invalid; }

    // Constructor
    AgentLibrary(const char* name, const char* options, bool is_absolute_path,
                 void* os_lib, bool instrument_lib=false);
};
```

### AgentLibraryList

```text
// src/hotspot/share/runtime/arguments.hpp

// maintain an order of entry list of AgentLibrary
class AgentLibraryList {
private:
    AgentLibrary*   _first;
    AgentLibrary*   _last;
public:
    bool is_empty() const                     { return _first == NULL; }
    AgentLibrary* first() const               { return _first; }

    // add to the end of the list
    void add(AgentLibrary* lib) {
        if (is_empty()) {
            _first = _last = lib;
        } else {
            _last->_next = lib;
            _last = lib;
        }
        lib->_next = NULL;
    }

    // search for and remove a library known to be in the list
    void remove(AgentLibrary* lib) {
        AgentLibrary* curr;
        AgentLibrary* prev = NULL;
        for (curr = first(); curr != NULL; prev = curr, curr = curr->next()) {
            if (curr == lib) {
                break;
            }
        }
        assert(curr != NULL, "always should be found");

        if (curr != NULL) {
            // it was found, by-pass this library
            if (prev == NULL) {
                _first = curr->_next;
            } else {
                prev->_next = curr->_next;
            }
            if (curr == _last) {
                _last = prev;
            }
            curr->_next = NULL;
        }
    }

    AgentLibraryList() {
        _first = NULL;
        _last = NULL;
    }
};
```


## 执行加载操作

### create_vm

在`Threads::create_vm(JavaVMInitArgs* args, bool* canTryAgain)`当中，注意两点：

- `Arguments::init_agents_at_startup()`方法：参考上面介绍的`_agentList`字段相关。
- `create_vm_init_agents()`：

```text
// src/hotspot/share/runtime/thread.cpp

jint Threads::create_vm(JavaVMInitArgs* args, bool* canTryAgain) {
    //...

    // Launch -agentlib/-agentpath and converted -Xrun agents
    if (Arguments::init_agents_at_startup()) {
        create_vm_init_agents();
    }

    //...

    return JNI_OK;
}
```

When the JVM determines that the Agent parsed in the previous section is not empty,
it will call the function `create_vm_init_agents()` to load the Agent.
Next, it will analyze how the `create_vm_init_agents()` function loads the Agent.

### create_vm_init_agents

当JVM判断出上一小节中解析出来的Agent不为空的时候，就要去调用函数`create_vm_init_agents`来加载Agent，
下面来分析一下`create_vm_init_agents`函数是如何加载Agent的。

在`Threads::create_vm_init_agents()`当中，注意两点：

- `Arguments::agents()`方法：拿到`_agentList`当中的第一个元素。
- `lookup_agent_on_load(agent)`：
  - `lookup_on_load()`

```text
// src/hotspot/share/runtime/thread.cpp

// Create agents for -agentlib:  -agentpath:  and converted -Xrun
// Invokes Agent_OnLoad
// Called very early -- before JavaThreads exist
void Threads::create_vm_init_agents() {
    extern struct JavaVM_ main_vm;
    AgentLibrary* agent;

    JvmtiExport::enter_onload_phase();

    for (agent = Arguments::agents(); agent != NULL; agent = agent->next()) {
        // ...

        OnLoadEntry_t  on_load_entry = lookup_agent_on_load(agent);

        if (on_load_entry != NULL) {
            // Invoke the Agent_OnLoad function
            jint err = (*on_load_entry)(&main_vm, agent->options(), NULL);
        }
    }

    JvmtiExport::enter_primordial_phase();
}
```

`create_vm_init_agents`这个函数通过遍历Agent链表来逐个加载Agent。
通过这段代码可以看出，首先通过`lookup_agent_on_load`来加载Agent并且找到`Agent_OnLoad`函数，这个函数是Agent的入口函数。
如果没找到这个函数，则认为是加载了一个不合法的Agent，则什么也不做，否则调用这个函数，这样Agent的代码就开始执行起来了。
对于使用Java Instrumentation API来编写Agent的方式来说，
在解析阶段观察到在`add_init_agent`函数里面传递进去的是一个叫做"instrument"的字符串，其实这是一个动态链接库。
在Linux里面，这个库叫做`libinstrument.so`，在BSD系统中叫做`libinstrument.dylib`，该动态链接库在`{JAVA_HOME}/jre/lib/`目录下。


### lookup_agent_on_load

```text
// src/hotspot/share/runtime/thread.cpp

// Find the Agent_OnLoad entry point
static OnLoadEntry_t lookup_agent_on_load(AgentLibrary* agent) {
    const char *on_load_symbols[] = AGENT_ONLOAD_SYMBOLS;
    return lookup_on_load(agent, on_load_symbols, sizeof(on_load_symbols) / sizeof(char*));
}
```

The `create_vm_init_agents()` function loads agents one by one by traversing the list of `agents()`.
From this code, we can see that, first of all, we load the Agent by `lookup_agent_on_load()` and
find the `lookup_on_load()` function, which is the entry function of the Agent.

```text
// src/hotspot/os/posix/include/jvm_md.h
#define AGENT_ONLOAD_SYMBOLS    {"Agent_OnLoad"}

// src/hotspot/os/windows/include/jvm_md.h
#define AGENT_ONLOAD_SYMBOLS    {"_Agent_OnLoad@12", "Agent_OnLoad"}
```

### lookup_on_load

From this code, we can see that, first of all, we load the Agent by `lookup_agent_on_load()` and
find the `lookup_on_load()` function, which is the entry function of the Agent.
If this function is not found, it is considered that an illegal Agent has been loaded, and nothing will be done.
Otherwise, call this function, and the Agent code will start to execute.

For the way of using Java Instrumentation API to write Agent, it is observed in the parsing phase
that a string called "instrument" is passed in the `add_instrument_agent()` function, which is actually a dynamic link library.
In Linux, this library is called `libinstrument.so`.
In BSD system, it is called `libinstrument.dylib`.
The dynamic link library is under the `{JAVA_HOME}/jre/lib/` directory.

- Windows: `JDK_HOME/jre/bin/instrument.dll`

```text
// Find a command line agent library and return its entry point for
//         -agentlib:  -agentpath:   -Xrun
// num_symbol_entries must be passed-in since only the caller knows the number of symbols in the array.
static OnLoadEntry_t lookup_on_load(AgentLibrary* agent,
                                    const char *on_load_symbols[],
                                    size_t num_symbol_entries) {
    OnLoadEntry_t on_load_entry = NULL;
    void *library = NULL;

    // Find the OnLoad function.
    on_load_entry = CAST_TO_FN_PTR(OnLoadEntry_t, os::find_agent_function(agent,
                                                                          false,
                                                                          on_load_symbols,
                                                                          num_symbol_entries));
    return on_load_entry;
}
```

```text
// src/hotspot/share/utilities/globalDefinitions.hpp
#define CAST_TO_FN_PTR(func_type, value) (reinterpret_cast<func_type>(value))
```

## Instrument动态链接库

Libinstrument is used to support the use of Java Instrumentation API to write agents.
In libinstrument, there is a very important class called `JPLISAgent` (**Java Programming Language Instrumentation Services Agent**).
Its function is to initialize all agents written through Java Instrumentation API,
and also to implement the exposed API in Java Instrumentation through JVMTI Responsibility.
We already know that when the JVM starts, the JVM will load the Agent through the `-javaagent` parameter.

The first thing to load is the `libinstrument` dynamic link library,
and then find the entry method of JVMTI in the dynamic link library: `Agent_OnLoad`.
Next, we will analyze how to implement the `Agent_OnLoad` function in the `libinstrument` dynamic link library.

```text
// src/java.base/share/native/libjava/jni_util.h
#define DEF_Agent_OnLoad Agent_OnLoad
#define DEF_Agent_OnAttach Agent_OnAttach
#define DEF_Agent_OnUnload Agent_OnUnload
```

### DEF_Agent_OnLoad

下面`DEF_Agent_OnLoad(JavaVM *vm, char *tail, void * reserved)`方法接收的参数来自于`Threads::create_vm_init_agents()`方法中：

```text
OnLoadEntry_t  on_load_entry = lookup_agent_on_load(agent);

if (on_load_entry != NULL) {
    // Invoke the Agent_OnLoad function
    jint err = (*on_load_entry)(&main_vm, agent->options(), NULL);
}
```

－ `DEF_Agent_OnLoad(JavaVM *vm, char *tail, void * reserved)`
  - `createNewJPLISAgent(vm, &agent)`
    - `initializeJPLISAgent(agent, vm, jvmtienv)`
      - `callbacks.VMInit = &eventHandlerVMInit`
  - `parseArgumentTail(tail, &jarfile, &options)`
  - `attributes = readAttributes(jarfile)`
  - `premainClass = getAttribute(attributes, "Premain-Class")`
  - `bootClassPath = getAttribute(attributes, "Boot-Class-Path")`
  - `convertCapabilityAttributes(attributes, agent)`

```text
// src/java.instrument/share/native/libinstrument/InvocationAdapter.c

/*
 *  This will be called once for every -javaagent on the command line.
 *  Each call to Agent_OnLoad will create its own agent and agent data.
 *
 *  The argument tail string provided to Agent_OnLoad will be of form <jarfile>[=<options>].
 *  The tail string is split into the jarfile and options components.
 *  The jarfile manifest is parsed and the value of the Premain-Class attribute will become the agent's premain class.
 *  The jar file is then added to the system class path,
 *  and if the Boot-Class-Path attribute is present
 *  then all relative URLs in the value are processed
 *  to create boot class path segments to append to the boot class path.
 */
JNIEXPORT jint JNICALL
DEF_Agent_OnLoad(JavaVM *vm, char *tail, void * reserved) {
    JPLISInitializationError initerror  = JPLIS_INIT_ERROR_NONE;
    jint                     result     = JNI_OK;
    JPLISAgent *             agent      = NULL;

    // 需要进入方法有重要内容，主要是给agent变量赋值
    initerror = createNewJPLISAgent(vm, &agent);
    if (initerror == JPLIS_INIT_ERROR_NONE) {
        int             oldLen, newLen;
        char *          jarfile;
        char *          options;
        jarAttribute*   attributes;
        char *          premainClass;
        char *          bootClassPath;

        /*
         * Parse <jarfile>[=options] into jarfile and options
         */
        parseArgumentTail(tail, &jarfile, &options);

        /*
         * Agent_OnLoad is specified to provide the agent options argument tail in modified UTF8.
         */
        attributes = readAttributes(jarfile);

        premainClass = getAttribute(attributes, "Premain-Class");

        /* Save the jarfile name */
        agent->mJarfile = jarfile;


        /*
         * If the Boot-Class-Path attribute is specified
         * then we process each relative URL and add it to the bootclasspath.
         */
        bootClassPath = getAttribute(attributes, "Boot-Class-Path");
        if (bootClassPath != NULL) {
            appendBootClassPath(agent, jarfile, bootClassPath);
        }

        /*
         * Convert JAR attributes into agent capabilities
         */
        convertCapabilityAttributes(attributes, agent);

        /*
         * Track (record) the agent class name and options data
         */
        initerror = recordCommandLineData(agent, premainClass, options);

    }

    return result;
}
```

The above code snippet is implemented by `DEF_Agent_OnLoad` in the simplified libinstrument.
The general process is: first create a `JPLISAgent`, and then parse some parameters set in ManiFest, such as `Premain-Class`.
After the `JPLISAgent` is created, call the initialize JPLISAgent to initialize the Agent.
Follow up the initializejlisagent to see how it is initialized:

### convertCapabilityAttributes

```text
// src/java.instrument/share/native/libinstrument/InvocationAdapter.c

/*
 * Parse any capability settings in the JAR manifest and
 * convert them to JVM TI capabilities.
 */
void convertCapabilityAttributes(const jarAttribute* attributes, JPLISAgent* agent) {
    /* set redefineClasses capability */
    if (getBooleanAttribute(attributes, "Can-Redefine-Classes")) {
        addRedefineClassesCapability(agent);
    }

    /* create an environment which has the retransformClasses capability */
    if (getBooleanAttribute(attributes, "Can-Retransform-Classes")) {
        retransformableEnvironment(agent);
    }

    /* set setNativeMethodPrefix capability */
    if (getBooleanAttribute(attributes, "Can-Set-Native-Method-Prefix")) {
        addNativeMethodPrefixCapability(agent);
    }

    /* for retransformClasses testing, set capability to use original method order */
    if (getBooleanAttribute(attributes, "Can-Maintain-Original-Method-Order")) {
        addOriginalMethodOrderCapability(agent);
    }
}
```

### createNewJPLISAgent

```text
// src/java.instrument/share/native/libinstrument/JPLISAgent.c

/*
 *  Creates a new JPLISAgent.
 */
JPLISInitializationError createNewJPLISAgent(JavaVM *vm, JPLISAgent **agent_ptr) {
    JPLISInitializationError initerror = JPLIS_INIT_ERROR_NONE;
    jvmtiEnv *jvmtienv = NULL;
    jint jnierror = JNI_OK;

    *agent_ptr = NULL;
    jnierror = (*vm)->GetEnv(vm, (void **) &jvmtienv, JVMTI_VERSION_1_1);
    
    // 分配空间
    JPLISAgent *agent = allocateJPLISAgent(jvmtienv);
    
    // 关注点：初始化
    initerror = initializeJPLISAgent(agent, vm, jvmtienv);
    if (initerror == JPLIS_INIT_ERROR_NONE) {
        *agent_ptr = agent;
    } else {
        deallocateJPLISAgent(jvmtienv, agent);
    }

    return initerror;
}
```

### initializeJPLISAgent

```text
// src/java.instrument/share/native/libinstrument/JPLISAgent.c

JPLISInitializationError
initializeJPLISAgent(JPLISAgent *agent,
                     JavaVM *vm,
                     jvmtiEnv *jvmtienv) {
    jvmtiError jvmtierror = JVMTI_ERROR_NONE;
    jvmtiPhase phase;

    agent->mJVM = vm;
    agent->mNormalEnvironment.mJVMTIEnv = jvmtienv;
    agent->mNormalEnvironment.mAgent = agent;
    agent->mNormalEnvironment.mIsRetransformer = JNI_FALSE;
    agent->mRetransformEnvironment.mJVMTIEnv = NULL;        /* NULL until needed */
    agent->mRetransformEnvironment.mAgent = agent;
    agent->mRetransformEnvironment.mIsRetransformer = JNI_FALSE;   /* JNI_FALSE until mJVMTIEnv is set */
    agent->mAgentmainCaller = NULL;
    agent->mInstrumentationImpl = NULL;
    agent->mPremainCaller = NULL;
    agent->mTransform = NULL;
    agent->mRedefineAvailable = JNI_FALSE;   /* assume no for now */
    agent->mRedefineAdded = JNI_FALSE;
    agent->mNativeMethodPrefixAvailable = JNI_FALSE;   /* assume no for now */
    agent->mNativeMethodPrefixAdded = JNI_FALSE;
    agent->mAgentClassName = NULL;
    agent->mOptionsString = NULL;
    agent->mJarfile = NULL;

    /* make sure we can recover either handle in either direction.
     * the agent has a ref to the jvmti; make it mutual
     */
    jvmtierror = (*jvmtienv)->SetEnvironmentLocalStorage(
            jvmtienv,
            &(agent->mNormalEnvironment));

    /* check what capabilities are available */
    checkCapabilities(agent);

    /* check phase - if live phase then we don't need the VMInit event */
    jvmtierror = (*jvmtienv)->GetPhase(jvmtienv, &phase);
    /* can be called from any phase */
    jplis_assert(jvmtierror == JVMTI_ERROR_NONE);
    if (phase == JVMTI_PHASE_LIVE) {
        return JPLIS_INIT_ERROR_NONE;
    }

    if (phase != JVMTI_PHASE_ONLOAD) {
        /* called too early or called too late; either way bail out */
        return JPLIS_INIT_ERROR_FAILURE;
    }

    /* now turn on the VMInit event */
    if (jvmtierror == JVMTI_ERROR_NONE) {
        jvmtiEventCallbacks callbacks;
        memset(&callbacks, 0, sizeof(callbacks));
        callbacks.VMInit = &eventHandlerVMInit;

        jvmtierror = (*jvmtienv)->SetEventCallbacks(jvmtienv,
                                                    &callbacks,
                                                    sizeof(callbacks));
        check_phase_ret_blob(jvmtierror, JPLIS_INIT_ERROR_FAILURE);
        jplis_assert(jvmtierror == JVMTI_ERROR_NONE);
    }

    if (jvmtierror == JVMTI_ERROR_NONE) {
        jvmtierror = (*jvmtienv)->SetEventNotificationMode(
                jvmtienv,
                JVMTI_ENABLE,
                JVMTI_EVENT_VM_INIT,
                NULL /* all threads */);
        check_phase_ret_blob(jvmtierror, JPLIS_INIT_ERROR_FAILURE);
        jplis_assert(jvmtierror == JVMTI_ERROR_NONE);
    }

    return (jvmtierror == JVMTI_ERROR_NONE) ? JPLIS_INIT_ERROR_NONE : JPLIS_INIT_ERROR_FAILURE;
}
```

Here, we focus on the line of `callbacks.VMInit = &eventHandlerVMInit;`.
Here we set a callback function for `VMInit` events, which means that the `eventHandlerVMInit` function will be called back when the JVM is initialized.
Let's take a look at the implementation details of this function. It is speculated that the Premain method is called here:

这里，我们关注`callbacks.VMInit = &eventHandlerVMInit;`这行代码，这里设置了一个`VMInit`事件的回调函数，
表示在JVM初始化的时候会回调eventHandlerVMInit函数。
下面来看一下这个函数的实现细节，猜测就是在这里调用了Premain方法：


### eventHandlerVMInit

```text
// src/java.instrument/share/native/libinstrument/InvocationAdapter.c

/*
 *  JVMTI callback support
 *
 *  We have two "stages" of callback support.
 *  At OnLoad time, we install a VMInit handler.
 *  When the VMInit handler runs,
 *  we remove the VMInit handler and install a ClassFileLoadHook handler.
 */

void eventHandlerVMInit(jvmtiEnv *jvmtienv,
                        JNIEnv *jnienv,
                        jthread thread) {
    JPLISEnvironment *environment = NULL;
    jboolean success = JNI_FALSE;

    environment = getJPLISEnvironment(jvmtienv);

    /* process the premain calls on the all the JPL agents */

    /*
     * Add the jarfile to the system class path
     */
    JPLISAgent *agent = environment->mAgent;
    appendClassPath(agent, agent->mJarfile);
    
    free((void *) agent->mJarfile);
    agent->mJarfile = NULL;

    // 关注点
    success = processJavaStart(environment->mAgent, jnienv);
}
```

### processJavaStart

- `processJavaStart(JPLISAgent *agent, JNIEnv *jnienv)`
  - `createInstrumentationImpl(jnienv, agent)`：创建`InstrumentationImpl`类的实例
  - `startJavaAgent()`：调用`premain`方法

```text
// src/java.instrument/share/native/libinstrument/JPLISAgent.c

/*
 * If this call fails, the JVM launch will ultimately be aborted,
 * so we don't have to be super-careful to clean up in partial failure cases.
 */
jboolean processJavaStart(JPLISAgent *agent, JNIEnv *jnienv) {
    jboolean result;

    /*
     *  OK, Java is up now. We can start everything that needs Java.
     */

    /*
     *  Now make the InstrumentationImpl instance.
     */
    result = createInstrumentationImpl(jnienv, agent);


    /*
     *  Register a handler for ClassFileLoadHook (without enabling this event).
     *  Turn off the VMInit handler.
     */
    result = setLivePhaseEventHandlers(agent);

    /*
     *  Load the Java agent, and call the premain.
     */
    result = startJavaAgent(agent, jnienv,
                            agent->mAgentClassName, agent->mOptionsString,
                            agent->mPremainCaller);


    return result;
}
```

### createInstrumentationImpl

```text
// src/java.instrument/share/native/libinstrument/JPLISAgent.h

#define JPLIS_INSTRUMENTIMPL_CLASSNAME                      "sun/instrument/InstrumentationImpl"
#define JPLIS_INSTRUMENTIMPL_CONSTRUCTOR_METHODNAME         "<init>"
#define JPLIS_INSTRUMENTIMPL_CONSTRUCTOR_METHODSIGNATURE    "(JZZ)V"
#define JPLIS_INSTRUMENTIMPL_PREMAININVOKER_METHODNAME      "loadClassAndCallPremain"
#define JPLIS_INSTRUMENTIMPL_PREMAININVOKER_METHODSIGNATURE "(Ljava/lang/String;Ljava/lang/String;)V"
#define JPLIS_INSTRUMENTIMPL_AGENTMAININVOKER_METHODNAME      "loadClassAndCallAgentmain"
#define JPLIS_INSTRUMENTIMPL_AGENTMAININVOKER_METHODSIGNATURE "(Ljava/lang/String;Ljava/lang/String;)V"
#define JPLIS_INSTRUMENTIMPL_TRANSFORM_METHODNAME           "transform"
#define JPLIS_INSTRUMENTIMPL_TRANSFORM_METHODSIGNATURE      \
    "(Ljava/lang/Module;Ljava/lang/ClassLoader;Ljava/lang/String;Ljava/lang/Class;Ljava/security/ProtectionDomain;[BZ)[B"
```

```text
// src/java.instrument/share/native/libinstrument/JPLISAgent.c

/*
 * Create the java.lang.instrument.Instrumentation instance
 * and access information for it (method IDs, etc)
 */
jboolean
createInstrumentationImpl(JNIEnv *jnienv,
                          JPLISAgent *agent) {
    jclass      implClass               = NULL;
    jboolean    errorOutstanding        = JNI_FALSE;
    jobject     resultImpl              = NULL;
    jmethodID   premainCallerMethodID   = NULL;
    jmethodID   agentmainCallerMethodID = NULL;
    jmethodID   transformMethodID       = NULL;
    jmethodID   constructorID           = NULL;
    jobject     localReference          = NULL;

    /* First find the class of our implementation */
    // 找到InstrumentationImpl类
    implClass = (*jnienv)->FindClass(jnienv, JPLIS_INSTRUMENTIMPL_CLASSNAME);

    // 找到InstrumentationImpl类的构造方法
    constructorID = (*jnienv)->GetMethodID(jnienv,
                                           implClass,
                                           JPLIS_INSTRUMENTIMPL_CONSTRUCTOR_METHODNAME,
                                           JPLIS_INSTRUMENTIMPL_CONSTRUCTOR_METHODSIGNATURE);

    // 创建InstrumentationImpl类的实例
    jlong peerReferenceAsScalar = (jlong)(intptr_t) agent;
    localReference = (*jnienv)->NewObject(jnienv,
                                          implClass,
                                          constructorID,
                                          peerReferenceAsScalar,
                                          agent->mRedefineAdded,
                                          agent->mNativeMethodPrefixAdded);

    resultImpl = (*jnienv)->NewGlobalRef(jnienv, localReference);

    /* Now look up the method ID for the pre-main caller (we will need this more than once) */
    // 找到InstrumentationImpl.loadClassAndCallPremain()方法
    premainCallerMethodID = (*jnienv)->GetMethodID(jnienv,
                                                   implClass,
                                                   JPLIS_INSTRUMENTIMPL_PREMAININVOKER_METHODNAME,
                                                   JPLIS_INSTRUMENTIMPL_PREMAININVOKER_METHODSIGNATURE);

    /* Now look up the method ID for the agent-main caller */
    // 找到InstrumentationImpl.loadClassAndCallAgentmain()方法
    agentmainCallerMethodID = (*jnienv)->GetMethodID(jnienv,
                                                     implClass,
                                                     JPLIS_INSTRUMENTIMPL_AGENTMAININVOKER_METHODNAME,
                                                     JPLIS_INSTRUMENTIMPL_AGENTMAININVOKER_METHODSIGNATURE);

    /* Now look up the method ID for the transform method (we will need this constantly) */
    // 找到InstrumentationImpl.transform()方法
    transformMethodID = (*jnienv)->GetMethodID(jnienv,
                                               implClass,
                                               JPLIS_INSTRUMENTIMPL_TRANSFORM_METHODNAME,
                                               JPLIS_INSTRUMENTIMPL_TRANSFORM_METHODSIGNATURE);

    if (!errorOutstanding) {
        agent->mInstrumentationImpl = resultImpl;
        agent->mPremainCaller       = premainCallerMethodID;
        agent->mAgentmainCaller     = agentmainCallerMethodID;
        agent->mTransform           = transformMethodID;
    }

    return !errorOutstanding;
}
```

### startJavaAgent


```text
// src/java.instrument/share/native/libinstrument/JPLISAgent.c

jboolean startJavaAgent(JPLISAgent *agent,
                        JNIEnv *jnienv,
                        const char *classname,
                        const char *optionsString,
                        jmethodID agentMainMethod) {
    jboolean success = JNI_FALSE;
    jstring classNameObject = NULL;
    jstring optionsStringObject = NULL;

    success = commandStringIntoJavaStrings(jnienv,
                                           classname,
                                           optionsString,
                                           &classNameObject,
                                           &optionsStringObject);

    if (success) {
        success = invokeJavaAgentMainMethod(jnienv,
                                            agent->mInstrumentationImpl,
                                            agentMainMethod,
                                            classNameObject,
                                            optionsStringObject);
    }

    return success;
}
```

As you can see here, the Instrument has been instantiated, and `invokeJavaAgentMainMethod` is used to execute our Premain method.
Then, we can do what we want to do according to the Instrument instance.

### invokeJavaAgentMainMethod

```text
// src/java.instrument/share/native/libinstrument/JPLISAgent.c

jboolean invokeJavaAgentMainMethod(JNIEnv *jnienv,
                                   jobject instrumentationImpl,
                                   jmethodID mainCallingMethod,
                                   jstring className,
                                   jstring optionsString) {
    jboolean errorOutstanding = JNI_FALSE;

    jplis_assert(mainCallingMethod != NULL);
    if (mainCallingMethod != NULL) {
        (*jnienv)->CallVoidMethod(jnienv,
                                  instrumentationImpl,
                                  mainCallingMethod,
                                  className,
                                  optionsString);
        errorOutstanding = checkForThrowable(jnienv);
        if (errorOutstanding) {
            logThrowable(jnienv);
        }
        checkForAndClearThrowable(jnienv);
    }
    return !errorOutstanding;
}
```


