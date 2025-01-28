---
title: "OS Environment Variable"
sequence: "106"
---

You can specify the configurations as an environment variable and use the variable name in the config data file.

File: `application.properties`

```properties
app.timeout=${APP_TIMEOUT}
```

在 Windows 上，设置环境变量：

```text
set <VAR>=<VALUE>
```

```text
set APP_TIMEOUT=30
```

在 Linux 系统，设置环境变量：

```text
export <VAR>=<VALUE>
```

## common practice

Additionally, note that it is a common practice to define the properties
with the default values in the `application.properties` file.
You can then override these property values using the environment variables if needed.
For instance, you can define the `server.port` property in the `application.properties` file.
You can override this value to a different port number using the environment variable.

### 默认值

File: `application.properties`

```text
app.timeout=${APP_TIMEOUT:30}
```

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(DemoApplication.class);
        Environment bean = context.getBean(Environment.class);
        String timeOut = bean.getProperty("app.timeout");
        System.out.println("app.timeout = " + timeOut);
    }
}
```

输出：

```text
app.timeout = 30
```

### 环境变量

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <executions>
                <execution>
                    <id>repackage</id>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
            <configuration>
                <mainClass>${start-class}</mainClass>
            </configuration>
        </plugin>
    </plugins>
</build>
```

```text
mvn clean package
```

```text
> set APP_TIMEOUT=50
> java -jar lsieun-spring-boot-config-1.0-SNAPSHOT.jar
app.timeout = 50
```
