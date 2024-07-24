---
title: "Log（输出）"
sequence: "102"
---

[UP](/maven-index.html)


## Logging

Maven takes care of connecting your Mojo to a logging provider
by calling `setLog()` prior to the execution of your Mojo.
It supplies an implementation of `org.apache.maven.monitor.logging.Log`.
This class exposes methods that you can use to communicate information back to the user.

### four logging levels

This `Log` class provides multiple levels of logging similar to that API provided by Log4J.
Those levels are captured by a series of methods available for each level: debug, info, error and warn.

```text
                                                      ┌─── isDebugEnabled()
                                                      │
                                                      ├─── debug(CharSequence content)
                                        ┌─── debug ───┤
                                        │             ├─── debug(CharSequence content, Throwable error)
                                        │             │
                                        │             └─── debug(Throwable error)
                                        │
                                        │             ┌─── isInfoEnabled()
                                        │             │
                                        │             ├─── info(CharSequence content)
                                        ├─── info ────┤
                                        │             ├─── info(CharSequence content, Throwable error)
                                        │             │
                                        │             └─── info(Throwable error)
org.apache.maven.monitor.logging.Log ───┤
                                        │             ┌─── isWarnEnabled()
                                        │             │
                                        │             ├─── warn(CharSequence content)
                                        ├─── warn ────┤
                                        │             ├─── warn(CharSequence content, Throwable error)
                                        │             │
                                        │             └─── warn(Throwable error)
                                        │
                                        │             ┌─── isErrorEnabled()
                                        │             │
                                        │             ├─── error(CharSequence content)
                                        └─── error ───┤
                                                      ├─── error(CharSequence content, Throwable error)
                                                      │
                                                      └─── error(Throwable error)
```

Each of the four levels exposes the same three methods.

### different purposes

The four logging levels serve different purposes.

The **debug level** exists for debugging purposes and for people
who want to see a very detailed picture of the execution of a Mojo.
You should use the debug logging level to provide as much detail on the execution of a Mojo,
but you should never assume that a user is going to see the debug level.

The **info level** is for general informational messages that should be printed as a normal course of operation.
If you were building a plugin that compiled code using a compiler,
you might want to print the output of the compiler to the screen.

The **warn level** is used for messages about unexpected events and errors that your Mojo can cope with.
If you were trying to run a plugin that compiled Ruby source code,
and there was no Ruby source code available,
you might want to just print a warning message and move on.

**Warnings are not fatal, but errors are usually build-stopping conditions**.

For the completely unexpected error condition, there is the **error logging level**.
You would use error if you couldn't continue executing a Mojo.
If you were writing a Mojo to compile some Java code and the compiler wasn't available,
you'd print a message to the error level and possibly pass along an `Exception` that Maven could print out for the user.

You should assume that a user is going to see most of the messages in info and all of the messages in error.

## 注入顺序

```java
package lsieun.mojo;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.logging.Log;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;

@Mojo(name = "sayhi")
public class GreetingMojo extends AbstractMojo {
    @Parameter(property = "my.message", defaultValue = "Hello ${user.name}")
    private String message;

    public GreetingMojo() {
        System.out.println("GreetingMojo Constructor");
    }

    @Override
    public void setLog(Log log) {
        System.out.println("GreetingMojo setLog Method");
        super.setLog(log);
    }

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        System.out.println("GreetingMojo execute Method");
        getLog().info(message);
    }
}
```

输出结果：

```text
GreetingMojo Constructor
GreetingMojo setLog Method
GreetingMojo execute Method
```

## 常见错误

- 原文出处：[Retrieving the Mojo Logger](https://maven.apache.org/plugin-developers/common-bugs.html)

Maven employs an IoC container named Plexus to setup a plugin's mojos before their execution.
In other words, components required by a mojo will be provided by means of dependency injection,
more precisely field injection.
The important point to keep in mind is that this field injection happens after the mojo's constructor has finished.
This means that references to injected components are invalid during the construction time of the mojo.

```java
@Mojo(name = "sayhi")
public class GreetingMojo extends AbstractMojo {
    private Log log = getLog();

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info(this.log.toString());
        getLog().info(getLog().toString());
    }
}
```

```text
$ javap -v -p lsieun.mojo.GreetingMojo
...
  public lsieun.mojo.GreetingMojo();
    descriptor: ()V
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method org/apache/maven/plugin/AbstractMojo."<init>":()V
         4: aload_0
         5: aload_0
         6: invokevirtual #2                  // Method getLog:()Lorg/apache/maven/plugin/logging/Log;
         9: putfield      #3                  // Field log:Lorg/apache/maven/plugin/logging/Log;
        12: return
...
```

与下面的写法是等价的：

```java
@Mojo(name = "sayhi")
public class GreetingMojo extends AbstractMojo {
    private Log log;

    public GreetingMojo() {
        this.log = getLog();
    }

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info(this.log.toString());
        getLog().info(getLog().toString());
    }
}
```

输出结果：

```text
[INFO] --- hello-maven-plugin:1.0-SNAPSHOT:sayhi (default-cli) @ hello-world ---
[INFO] org.apache.maven.plugin.logging.SystemStreamLog@757d6814
[INFO] org.apache.maven.monitor.logging.DefaultLog@649725e3
```

In case of the logger, the above mojo will simply use a default console logger,
i.e. the code defect is not immediately noticeable by a `NullPointerException`.
This default logger will however use a different message format for its output and
also outputs debug messages even if Maven's debug mode was not enabled.
**For this reason, developers must not try to cache the logger during construction time.**
**The method `getLog()` is fast enough and can simply be called whenever one needs it.**
