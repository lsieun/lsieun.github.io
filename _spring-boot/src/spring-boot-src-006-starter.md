---
title: "自定义 Starter"
sequence: "106"
---

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

## 为什么要自定义 Starter

在我们日常开发工作中，经常会有一些独立于业务之外的配置模块，我们经常将其放到一个特定的包下；
如果另一个工程需要复用这块功能时，需要将代码硬拷贝到另一个工程，重新集成一遍，非常麻烦。
如果我们将这些可独立于业务代码之外的功能配置模块封装成一个 Starter，
复用的时候只需要将其在 pom.xml 中引用依赖即可，再由 Spring Boot 为我们完成自动装配，就非常轻松。

## 自定义 Starter 的案例

以下案例是开发中遇到的部分场景：

- 动态数据源
- 登录模块
- 基于 AOP 技术实现日志切面

## 自定义 Starter 的命名规则

Spring Boot 提供的 Starter 以 `spring-boot-starter-xxx` 的方式命名

官方建议自定义的 Starter 使用 `xxx-spring-boot-starter` 命名规则，以区分 Spring Boot 生态提供的 Starter。

## 自定义 Starter 代码实现

整个过程分为两部分：

- 自定义 Starter
- 使用 Starter

### 自定义 Starter

第 1 步，新建 Maven Jar 工程，工程名为 `my-spring-boot-starter` 导入依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-autoconfigure</artifactId>
    <version>2.2.9.RELEASE</version>
</dependency>
```

第 2 步，Java Bean：

```java
package lsieun.bean;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@EnableConfigurationProperties(SimpleBean.class)
@ConfigurationProperties(prefix = "simplebean")
public class SimpleBean {
    private int id;
    private String name;

    public SimpleBean() {
        System.out.println("SimpleBean constructor...");
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        System.out.println("SimpleBean setId...");
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        System.out.println("SimpleBean setName...");
        this.name = name;
    }

    @Override
    public String toString() {
        return String.format("{id = %d, name='%s'}", id, name);
    }
}
```

第 3 步，编写配置类 MyAutoConfiguration

```java
package lsieun.config;

import lsieun.bean.SimpleBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MyAutoConfiguration {
    static {
        System.out.println("MyAutoConfiguration init...");
    }
    
    @Bean
    public SimpleBean simpleBean() {
        return new SimpleBean();
    }
}
```

第 4 步，在 `resources` 目录下创建 `META-INF/spring.factories` 文件：

```text
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
lsieun.config.MyAutoConfiguration
```

第 5 步，执行命令：

```text
mvn clean install
```

### 使用自定义 Starter

第 1 步，导入自定义 Starter 的依赖：

```xml
<dependency>
    <groupId>lsieun</groupId>
    <artifactId>my-spring-boot-starter</artifactId>
    <version>1.0-SNAPSHOT</version>
</dependency>
```

第 2 步，在全局配置文件中，配置属性值：

File: `application.properties`

```text
simplebean.id=10
simplebean.name=tomcat
```

```text
SimpleBean bean = applicationContext.getBean(SimpleBean.class);
System.out.println(bean);
```

```text
{id = 10, name='tomcat'}
```

## 热插拔技术

我们经常在启动 Application 上面加 `@EnableXxx` 注解：

```java
@EnableAspectJAutoProxy
@EnableDiscoveryClient
@EnableFeignClients
@SpringBootApplication
public class DemoApplication {
}
```

其实，这个 `@EnableXxx` 注解就是一种热插拔技术，加了这个注解，就可以启动对应的 Starter，
当不需要对应的 Starter 的时候，只需要把这个注解注释掉就行。

第 1 步，新增标记类 ConfigMarker

```java
package lsieun.config;

public class ConfigMarker {
}
```

第 2 步，新增 `EnableMySimple`：

```java
package lsieun.config;

import org.springframework.context.annotation.Import;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Import({ConfigMarker.class})
public @interface EnableMySimple {
}
```

第 3 步，修改 `MyAutoConfiguration`，新增 `@ConditionalOnBean(ConfigMarker.class)`：

```java
package lsieun.config;

import lsieun.bean.SimpleBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnBean(ConfigMarker.class)
public class MyAutoConfiguration {
    static {
        System.out.println("MyAutoConfiguration init...");
    }

    @Bean
    public SimpleBean simpleBean() {
        return new SimpleBean();
    }
}
```

