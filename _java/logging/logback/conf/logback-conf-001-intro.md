---
title: "Logback 配置"
sequence: "101"
---

[UP](/java/java-logging-index.html)


## 没有配置的情况

The Logback's default behavior:
if it can't find a configuration file, it creates a `ConsoleAppender` and associates it with the `root` logger.

## 如何配置

A configuration file can be placed in the **classpath** and named either `logback.xml` or `logback-test.xml`.

Here's how Logback will attempt to find configuration data:

- Search for files named `logback-test.xml`, `logback.groovy`, or `logback.xml` in the classpath, in that order
- If the library doesn't find those files,
  it will attempt to use Java's `ServiceLoader` to locate
  an implementor of the `com.qos.logback.classic.spi.Configurator`.
- Configure itself to log output directly to the console

**Important Note**: Due to the official documentation of Logback, they have stopped supporting `logback.groovy`.
So if you want to configure Logback in your application, it's better to use the XML version.

## 基本配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <root level="debug">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```

The entire file is in `<configuration>` tags.

We see a tag that declares an `Appender` of type `ConsoleAppender`, and names it `STDOUT`.
Nested within that tag is an `encoder`.
It has a pattern with what looks like sprintf-style escape codes:

```xml
<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
    </encoder>
</appender>
```

Finally, we see a root tag.
This tag sets the `root` logger to `DEBUG` mode,
and associates its output with the `Appender` named `STDOUT`:

```xml
<root level="debug">
    <appender-ref ref="STDOUT" />
</root>
```

## 源码参考

### ClassicConstants

在源码中，`ClassicConstants.AUTOCONFIG_FILE` 的值为 `logback.xml`：

```java
public class ClassicConstants {
    public static final String AUTOCONFIG_FILE = "logback.xml";
    public static final String TEST_AUTOCONFIG_FILE = "logback-test.xml";
}
```

### DefaultJoranConfigurator

```java
@ConfiguratorRank(value = ConfiguratorRank.NOMINAL)
public class DefaultJoranConfigurator extends ContextAwareBase implements Configurator {
    
    // 第 1 步
    @Override
    public ExecutionStatus configure(LoggerContext context) {
        // 第 2 步
        URL url = performMultiStepConfigurationFileSearch(true);
        if (url != null) {
            try {
                // 第 4 步，读取配置
                configureByResource(url);
            } catch (JoranException e) {
                e.printStackTrace();
            }
            // You tried and that counts Mary.
            return ExecutionStatus.DO_NOT_INVOKE_NEXT_IF_ANY;
        } else {
            return ExecutionStatus.INVOKE_NEXT_IF_ANY;
        }
    }
    
    // 第 2 步
    private URL performMultiStepConfigurationFileSearch(boolean updateStatus) {
        ClassLoader myClassLoader = Loader.getClassLoaderOfObject(this);
        URL url = findConfigFileURLFromSystemProperties(myClassLoader, updateStatus);
        if (url != null) {
            return url;
        }

        url = getResource(ClassicConstants.TEST_AUTOCONFIG_FILE, myClassLoader, updateStatus);
        if (url != null) {
            return url;
        }

        // 第 3 步，使用 ClassicConstants.AUTOCONFIG_FILE 字段
        return getResource(ClassicConstants.AUTOCONFIG_FILE, myClassLoader, updateStatus);
    }

    // 第 4 步，读取配置
    public void configureByResource(URL url) throws JoranException {
        if (url == null) {
            throw new IllegalArgumentException("URL argument cannot be null");
        }
        final String urlString = url.toString();
        if (urlString.endsWith("xml")) {
            JoranConfigurator configurator = new JoranConfigurator();
            configurator.setContext(context);
            
            // 第 5 步
            configurator.doConfigure(url);
        } else {
            throw new LogbackException(
                    "Unexpected filename extension of file [" + url.toString() + "]. Should be .xml");
        }
    }
}
```

### GenericXMLConfigurator

```java
public abstract class GenericXMLConfigurator extends ContextAwareBase {
    // 第 1 步
    public final void doConfigure(URL url) throws JoranException {
        URLConnection urlConnection = url.openConnection();
        urlConnection.setUseCaches(false);

        InputStream in = urlConnection.getInputStream();
      
        // 第 2 步
        doConfigure(in, url.toExternalForm());
    }
    
    // 第 2 步
    public final void doConfigure(InputStream inputStream, String systemId) throws JoranException {
        InputSource inputSource = new InputSource(inputStream);
        inputSource.setSystemId(systemId);
      
        // 第 3 步
        doConfigure(inputSource);
    }

    // 第 3 步
    public final void doConfigure(final InputSource inputSource) throws JoranException {
        // ...

        SaxEventRecorder recorder = populateSaxEventRecorder(inputSource);
        
        // ...
      
        Model top = buildModelFromSaxEventList(recorder.getSaxEventList());
        
        // ...
    }
}
```
