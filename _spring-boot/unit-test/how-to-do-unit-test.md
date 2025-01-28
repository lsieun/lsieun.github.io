---
title: "Unit Test"
sequence: "103"
---

## Pet

```java
package lsieun.boot.controller.pojo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class Pet {

    @Value("Tom")
    private String name;
    @Value("3")
    private int age;

    public Pet() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "Pet{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

## Test

```java
package lsieun.boot;

import lsieun.boot.controller.pojo.Pet;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class LearnSpringBootApplicationTests {

    @Autowired
    private Pet pet;

    @Test
    void contextLoads() {
        System.out.println(pet);
    }

}
```
