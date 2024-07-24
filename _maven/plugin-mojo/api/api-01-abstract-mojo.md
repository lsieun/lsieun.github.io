---
title: "AbstractMojo"
sequence: "101"
---

[UP](/maven-index.html)


在编写示例的时候，我们引入了 `maven-plugin-api` 依赖：

```xml
<dependency>
    <groupId>org.apache.maven</groupId>
    <artifactId>maven-plugin-api</artifactId>
    <version>3.8.5</version>
    <scope>provided</scope>
</dependency>
```

## Mojo

Each Mojo is going to implement the `org.apache.maven.plugin.Mojo` interface.

```java
public interface Mojo {
    String ROLE = Mojo.class.getName();

    void execute() throws MojoExecutionException, MojoFailureException;

    void setLog(Log log);

    Log getLog();
}
```

```text
void setLog(Log log);
```

Every Mojo implementation has to provide a way for the plugin to communicate the progress of a particular goal.
Did the goal succeed?
Or, was there a problem during goal execution?

When Maven loads and executes a Mojo, it is going to call the `setLog()` method and
supply the Mojo instance with a suitable logging destination to be used in your custom plugin.

```text
Log getLog();
```

Maven is going to call `setLog()` before your Mojo is executed,
and your Mojo can retrieve the logging object by calling `getLog()`.
Instead of printing out status to Standard Output or the console,
your Mojo is going to invoke methods on the `Log` object.

```text
void execute() throws MojoExecutionException, MojoFailureException;
```

This method is called by Maven when it is time to execute your goal.

The `Mojo` interface is concerned with two things:

- logging the results of goal execution
- executing a goal

```java
package lsieun.mojo;

import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugin.logging.Log;
import org.apache.maven.plugins.annotations.Mojo; // 第一个 Mojo 类

@Mojo(name = "simple")
public class SimpleMojo implements org.apache.maven.plugin.Mojo /* 第二个 Mojo 类 */ {
    private Log log;

    @Override
    public void setLog(Log log) {
        this.log = log;
    }

    @Override
    public Log getLog() {
        return log;
    }

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info("Hello Simple Mojo");
    }
}
```



## AbstractMojo

When you are writing a custom plugin, you'll be extending `AbstractMojo`.
`AbstractMojo` takes care of handling the `setLog()` and `getLog()` implementations and
contains an abstract `execute()` method.
When you extend `AbstractMojo`, all you need to do is implement the `execute()` method.

the Mojo implementation shown in the following example implements
the Mojo interface by extending the `org.apache.maven.plugin.AbstractMojo` class.

```java
public abstract class AbstractMojo implements Mojo, ContextEnabled {
    /** Instance logger */
    private Log log;

    /** Plugin container context */
    private Map pluginContext;

    @Override
    public void setLog(Log log) {
        this.log = log;
    }

    @Override
    public Log getLog() {
        if (log == null) {
            log = new SystemStreamLog();
        }

        return log;
    }

    @Override
    public Map getPluginContext() {
        return pluginContext;
    }

    @Override
    public void setPluginContext(Map pluginContext) {
        this.pluginContext = pluginContext;
    }
}
```





## When a Mojo Fails

The `execute()` method in Mojo throws two exceptions `MojoExecutionException` and `MojoFailureException`.

The difference between these two exception is both subtle and important,
and it relates to what happens when a goal execution "fails".

### MojoExecutionException

A `MojoExecutionException` is a fatal exception, something unrecoverable happened.
You would throw a `MojoExecutionException` if something happens that warrants a complete stop in a build;
you re trying to write to disk, but there is no space left,
or you were trying to publish to a remote repository,
but you can't connect to it.

Throw a `MojoExecutionException` if there is no chance of a build continuing;
something terrible has happened and you want the build to stop and the user to see a "BUILD ERROR" message.

### MojoFailureException

A `MojoFailureException` is something less catastrophic, a goal can fail,
but it might not be the end of the world for your Maven build.

A unit test can fail, or a MD5 checksum can fail;
both of these are potential problems,
but you don't want to return an exception that is going to kill the entire build.
In this situation you would throw a `MojoFailureException`.

### failure modes

Maven provides for different "resiliency" settings when it comes to project failure.

When you run a Maven build, it could involve a series of projects each of which can succeed or fail.
You have the option of running Maven in three failure modes:

```text
mvn -ff
```

Fail-fast mode: Maven will fail (stop) at the first build failure.

```text
mvn -fae
```

Fail-at-end: Maven will fail at the end of the build.
If a project in the Maven reactor fails,
Maven will continue to build the rest of the builds and report a failure at the end of the build.

```text
mvn -fn
```

Fail never: Maven won't stop for a failure and it won't report a failure.
You might want to ignore failure if you are running a continuous integration build
and you want to attempt a build regardless of the success of failure of an individual project build.

As a plugin developer, you'll have to make a call as to
whether a particular failure condition is a `MojoExecutionException` or a `MojoFailureExeception`.
