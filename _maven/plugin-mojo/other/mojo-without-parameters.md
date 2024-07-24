---
title: "Mojo-Code"
sequence: "103"
---

[UP](/maven-index.html)


## pom.xml

### packaging

The `<packaging>` should be set to "maven-plugin".

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>org.example</groupId>
    <artifactId>greeting-maven-plugin</artifactId>
    <packaging>maven-plugin</packaging>
    <version>1.0-SNAPSHOT</version>
    <name>greeting-maven-plugin Maven Mojo</name>
    <url>http://maven.apache.org</url>
</project>
```

### dependency

```xml
<dependencies>
    <dependency>
        <groupId>org.apache.maven</groupId>
        <artifactId>maven-plugin-api</artifactId>
        <version>3.8.5</version>
    </dependency>
    <dependency>
        <groupId>org.apache.maven.plugin-tools</groupId>
        <artifactId>maven-plugin-annotations</artifactId>
        <version>3.6.4</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13.2</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### All

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>hello-maven-plugin</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>maven-plugin</packaging>

    <name>Sample Parameter-less Maven Plugin</name>

    <dependencies>
        <dependency>
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-plugin-api</artifactId>
            <version>3.8.5</version>
            <scope>provided</scope>
        </dependency>

        <!-- dependencies to annotations -->
        <dependency>
            <groupId>org.apache.maven.plugin-tools</groupId>
            <artifactId>maven-plugin-annotations</artifactId>
            <version>3.6.4</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

## Code

```java
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugins.annotations.Mojo;

@Mojo(name = "sayhi")
public class GreetingMojo extends AbstractMojo {
    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info("Hello, World.");
    }
}
```

The `getLog` method (defined in `AbstractMojo`) returns a log4j-like logger object
which allows plugins to create messages at levels of "debug", "info", "warn", and "error".

## Building a Plugin

There are few plugins goals bound to the standard build lifecycle defined with the `maven-plugin` packaging:

- `compile`: Compiles the Java code for the plugin
- `process-classes`: Extracts data to build the plugin descriptor
- `test`: Runs the plugin's unit tests
- `package`: Builds the plugin jar
- `install`: Installs the plugin jar in the local repository
- `deploy`: Deploys the plugin jar to the remote repository

## Executing Your First Mojo

The most direct means of executing your new plugin is to specify the plugin goal directly on the command line.
To do this, you need to configure the `hello-maven-plugin` plugin in you project:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.example</groupId>
            <artifactId>greeting-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
        </plugin>
    </plugins>
</build>
```

And, you need to specify a fully-qualified goal in the form of:

```text
mvn groupId:artifactId:version:goal
```

For example, to run the simple mojo in the sample plugin,
you would enter:

```text
mvn sample.plugin:hello-maven-plugin:1.0-SNAPSHOT:sayhi
```

Tips: `version` is not required to run a standalone goal.


```text
mvn org.example:greeting-maven-plugin:1.0-SNAPSHOT:sayhi
```

```text
mvn org.example:greeting-maven-plugin:sayhi
```

### Shortening the Command Line

There are several ways to reduce the amount of required typing:

If you need to run the latest version of a plugin installed in your local repository,
you can omit its `version` number:

```text
mvn sample.plugin:hello-maven-plugin:sayhi
```

You can assign a shortened prefix to your plugin, such as `mvn hello:sayhi`.
This is done automatically if you follow the convention of using `${prefix}-maven-plugin`
(or `maven-${prefix}-plugin` if the plugin is part of the Apache Maven project).
You may also assign one through additional configuration - for more information see **Introduction to Plugin Prefix Mapping**.

```text
mvn hello:sayhi
```

Finally, you can also add your plugin's `groupId` to the list of `groupIds` searched by default.
To do this, you need to add the following to your `${user.home}/.m2/settings.xml` file:

```xml
<pluginGroups>
    <pluginGroup>sample.plugin</pluginGroup>
</pluginGroups>
```

At this point, you can run the mojo with "`mvn hello:sayhi`".

### Attaching the Mojo to the Build Lifecycle

You can also configure your plugin to attach specific **goals** to a particular **phase** of the build **lifecycle**.
Here is an example:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>sample.plugin</groupId>
            <artifactId>hello-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
            <executions>
                <execution>
                    <phase>compile</phase>
                    <goals>
                        <goal>sayhi</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

This causes the simple mojo to be executed whenever Java code is compiled.
