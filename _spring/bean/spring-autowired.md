---
title: "Spring @Autowired"
sequence: "104"
---

## 示例

### pom.xml

```xml
<dependencies>
    <!-- starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
</dependencies>
```

### Cat and Dog

```java
package lsieun.springboot.component;

public interface ISpeak {
    void speak();
}
```

```java
package lsieun.springboot.component;

import org.springframework.stereotype.Component;

@Component
public class Cat implements ISpeak {
    @Override
    public void speak() {
        System.out.println("meow meow meow");
    }
}
```

```java
package lsieun.springboot.component;

import org.springframework.stereotype.Component;

@Component
public class Dog implements ISpeak {
    public void speak() {
        System.out.println("bark bark bark");
    }
}
```

```java
package lsieun.springboot.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class Person01 implements ISpeak {
    // Field injection is not recommended 
    @Autowired
    private Cat cat;

    // Field injection is not recommended 
    @Autowired
    private Dog dog;

    public void speak() {
        System.out.println("blah blah blah");
        cat.speak();
        dog.speak();
    }
}
```

```java
package lsieun.springboot.component;

import org.springframework.stereotype.Component;

@Component
public class Person02 implements ISpeak {

    private final Cat cat;

    private final Dog dog;

    public Person02(Cat cat, Dog dog) {
        this.cat = cat;
        this.dog = dog;
    }

    public void speak() {
        System.out.println("blah blah blah");
        cat.speak();
        dog.speak();
    }
}
```

```java
package lsieun.springboot.component;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Person03 implements ISpeak {

    private final Cat cat;

    private final Dog dog;

    public void speak() {
        System.out.println("blah blah blah");
        cat.speak();
        dog.speak();
    }
}
```

```java
package lsieun.springboot;

import lsieun.springboot.component.ISpeak;
import lsieun.springboot.component.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class AutowiredApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(AutowiredApplication.class);
        ISpeak bean = context.getBean(Person03.class);
        bean.speak();
    }
}
```

## Reference

- [为什么Spring官方不推荐使用@Autowired属性注入](https://www.bilibili.com/video/BV1FD4y1N7dQ/)
- [用了这么久的Autowired，原来一直都是用错的！](https://www.bilibili.com/video/BV1CA4y1S7mw/)
