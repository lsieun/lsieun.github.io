---
title: "Mojo Parameters：不同的输入方式（输入）"
sequence: "103"
---

[UP](/maven-index.html)


Each Mojo specifies the parameters that it expects in order to work.
These parameters are the Mojo's link to the outside world,
and will be satisfied through a combination of **POM/project values**,
**plugin configurations** (from the POM and configuration defaults), and **System properties**.

```text
parameters(输入) ---> Mojo::execute（执行） --> Log（输出）
```

If the value of the `my.message` property is `null`,
the `defaultValue` attribute of the @parameter annotation will be used instead.
Instead of using the `echo.message` property,
we can configure a value for the message parameter of the `EchoMojo` directly in a project's POM.

```java
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;

import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;

@Mojo(name = "sayhi")
public class GreetingMojo extends AbstractMojo {
    @Parameter(property = "my.message", defaultValue = "Hello ${user.name}")
    private String message;

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info(message);
    }
}
```



## 三/四种方式

```text
                  ┌─── plugin configuration ───┼─── <plugin>/<configuration>
                  │
                  │                            ┌─── command line
mojo parameter ───┼─── property ───────────────┤
                  │                            └─── <properties>
                  │
                  └─── default value
```

四者的优先级：

```text
plugin configuration > command line > properties > default value
```

### plugin configuration

```xml
<build>
    <plugins>
        <plugin>
            <groupId>lsieun</groupId>
            <artifactId>hello-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
            <configuration>
                <message>Message From Plugin Configuration</message>
            </configuration>
        </plugin>
    </plugins>
</build>
```

```text
mvn hello:sayhi
```

### Command Line

```text
mvn hello:sayhi -Dmy.message="Message From Command Line"
```

### properties

```text
<properties>
    <my.message>Message From Properties</my.message>
</properties>
```

```text
mvn hello:sayhi
```

### default value

```text
mvn hello:sayhi
```

### execution

If we wanted to run the `GreetingMojo` twice at difference phases in a lifecycle,
and we wanted to customize the `message` parameter for each execution separately,
we could configure the parameter value at the `execution` level in a POM like this:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>lsieun</groupId>
            <artifactId>hello-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
            <executions>
                <execution>
                    <id>first-execution</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>sayhi</goal>
                    </goals>
                    <configuration>
                        <message>
                            Message From compile Phase
                        </message>
                    </configuration>
                </execution>
                <execution>
                    <id>second-execution</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>sayhi</goal>
                    </goals>
                    <configuration>
                        <message>
                            Message From test-compile Phase
                        </message>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

```text
mvn test
```

```text
[INFO] --- hello-maven-plugin:1.0-SNAPSHOT:sayhi (first-execution) @ hello-world ---
[INFO] Message From compile Phase
[INFO] 
[INFO] --- maven-resources-plugin:2.6:testResources (default-testResources) @ hello-world ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] skip non existing resourceDirectory D:\git-repo\hello-world\src\test\resources
[INFO] 
[INFO] --- maven-compiler-plugin:3.1:testCompile (default-testCompile) @ hello-world ---
[INFO] Nothing to compile - all classes are up to date
[INFO] 
[INFO] --- hello-maven-plugin:1.0-SNAPSHOT:sayhi (second-execution) @ hello-world ---
[INFO] Message From test-compile Phase
[INFO] 
[INFO] --- maven-surefire-plugin:2.12.4:test (default-test) @ hello-world ---
[INFO] No tests to run.
```

## Reference

- [Parameters](https://maven.apache.org/guides/plugin/guide-java-plugin-development.html#parameters)
