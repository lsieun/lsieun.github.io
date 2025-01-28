---
title: "配置文件：lombok.config"
sequence: "101"
---

[UP](/lombok.html)

## lombok.config

Lombok 的配置文件是 `lombok.config`，

### 存放位置

`lombok.config` 的存放位置：

- project root
- source code, or any package

### 影响范围

Once created, all the source files in the child directories will inherit the configs defined in such a file.

### 多文件配置

It's possible to have multiple config files.

For example, we can define a config file in our root directory with general properties and
create another one in a given package defining other properties.

### 优先级（先后）

The new configs will influence all classes of the given package and all children packages.
Also, in the case of multiple definitions of the same property,
the one closer to the class or member takes precedence.

```text
config.stopBubbling = true
lombok.anyconstructor.addconstructorproperties = false
lombok.addLombokGeneratedAnnotation = true
lombok.experimental.flagUsage = WARNING
```

## 全部配置

```text
java -jar lombok.jar config -g --verbose
```

```java
import java.lang.reflect.Method;

public class LombokConfigRun {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("lombok.launch.Main");
        Method method = clazz.getDeclaredMethod("main", String[].class);
        method.setAccessible(true);
        method.invoke(null, (Object) new String[]{"config", "-g", "--verbose"});
    }
}
```

## Reference

- [Lombok Configuration System](https://www.baeldung.com/lombok-configuration-system)
- [Configuration system](https://projectlombok.org/features/configuration)

