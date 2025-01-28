---
title: "Spring Boot Starter Intro"
sequence: "102"
---


项目名称：`digest-spring-boot-starter`

## pom.xml

```xml
<dependency>
    <groupId>commons-codec</groupId>
    <artifactId>commons-codec</artifactId>
    <version>1.16.0</version>
</dependency>
```

```text
<version>2.7.17</version>
```

```xml

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-autoconfigure</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>commons-codec</groupId>
        <artifactId>commons-codec</artifactId>
        <version>1.16.0</version>
    </dependency>
</dependencies>
```

### Digest

```java
package lsieun.digest;

public interface Digest {
    String digest(String content);
}
```

```java
package lsieun.digest.impl;

import lsieun.digest.Digest;
import org.apache.commons.codec.digest.DigestUtils;

public class Md5Digest implements Digest {
    @Override
    public String digest(String content) {
        System.out.println("使用MD5算法生成摘要");
        return DigestUtils.md5Hex(content);
    }
}
```

```java
package lsieun.digest.impl;

import lsieun.digest.Digest;
import org.apache.commons.codec.digest.DigestUtils;

public class ShaDigest implements Digest {
    @Override
    public String digest(String content) {
        System.out.println("使用SHA算法生成摘要");
        return DigestUtils.sha256Hex(content);
    }
}
```

### application.properties

```text
spring.application.name=digest-spring-boot-starter
digest.type=md5
```

### Settings

```java
package lsieun.digest.conf;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "digest")
public class Settings {
    private String type;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
```

### Config

```java
package lsieun.digest.conf;

import lsieun.digest.Digest;
import lsieun.digest.impl.Md5Digest;
import lsieun.digest.impl.ShaDigest;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(Settings.class)
public class Config {
    @Bean
    @ConditionalOnProperty(prefix = "digest", name = "type", havingValue = "md5")
    public Digest md5Digest() {
        System.out.println("创建MD5Digest对象");
        return new Md5Digest();
    }

    @Bean
    @ConditionalOnProperty(prefix = "digest", name = "type", havingValue = "sha")
    public Digest shaDigest() {
        System.out.println("创建ShaDigest对象");
        return new ShaDigest();
    }
}
```

### ConfigTest

```java
package lsieun.digest.conf;

import lsieun.digest.Digest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

@SpringBootTest
class ConfigTest {
    @Resource
    private Digest digest;

    @Test
    public void testDigest() {
        String result = digest.digest("Hello World");
        System.out.println(result);
    }
}
```

当 `digest.type` 为 `md5` 时，输出：

```text
创建MD5Digest对象
使用MD5算法生成摘要
b10a8db164e0754105b7a99be72e3fe5
```

当 `digest.type` 为 `sha` 时，输出：

```text
创建ShaDigest对象
使用SHA算法生成摘要
a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e
```

### spring.factories

File: `src/main/resources/META-INF/spring.factories`

```text
org.springframework.boot.autoconfigure.EnableAutoConfiguration=lsieun.digest.conf.Config
```

## 打包

第 1 步，在 `pom.xml` 中，注释或移除 `spring-boot-maven-plugin` 插件。

```text

```

## 测试

第 1 步，引用 `digest-spring-boot-starter`

```xml
<dependency>
    <groupId>lsieun</groupId>
    <artifactId>digest-spring-boot-starter</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```

### application.properties

```text
digest.type=md5
```

### DigestTest

```java
package lsieun.fun;

import lsieun.digest.Digest;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

@SpringBootTest
class DigestTest {
    @Resource
    private Digest digest;

    @Test
    public void testDigest() {
        String result = digest.digest("你好");
        System.out.println(result);
    }
}
```