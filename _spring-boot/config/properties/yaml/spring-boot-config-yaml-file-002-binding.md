---
title: "YAML 配置"
sequence: "202"
---

## YAML 可以直接给实体类赋值

```text
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
</dependency>
```

```java
import org.springframework.stereotype.Component;

@Component
public class Pet {

    private String name;
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

第一点，需要注意：如果没有相应的 Setter 方法，就不会注入成功；有带参数的构造方法也不行。

第二点，注意使用了 `@ConfigurationProperties` 注解。

```java
package lsieun.boot.controller.pojo;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Component
@ConfigurationProperties(prefix = "child")
public class Child {
    private String name;
    private int age;
    private boolean gender;
    private Date birth;
    private Map<String, Object> passwords;
    private List<String> hobbies;
    private Pet pet;

    public Child() {
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

    public boolean isGender() {
        return gender;
    }

    public void setGender(boolean gender) {
        this.gender = gender;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }

    public Map<String, Object> getPasswords() {
        return passwords;
    }

    public void setPasswords(Map<String, Object> passwords) {
        this.passwords = passwords;
    }

    public List<String> getHobbies() {
        return hobbies;
    }

    public void setHobbies(List<String> hobbies) {
        this.hobbies = hobbies;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    @Override
    public String toString() {
        return "Child{" +
                "name='" + name + '\'' +
                ", age=" + age +
                ", gender=" + gender +
                ", birth=" + birth +
                ", passwords=" + passwords +
                ", hobbies=" + hobbies +
                ", pet=" + pet +
                '}';
    }
}
```

- `application.yaml`:

```yaml
child:
  name: xiaoming
  age: 10
  gender: true
  birth: 2022/01/01
  passwords: {baidu: 123, google: 456}
  hobbies:
    - TV
    - Games
  pet:
    name: Tom
    age: 3
```

```java
package lsieun.boot;

import lsieun.boot.controller.pojo.Child;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class LearnSpringBootApplicationTests {

    @Autowired
    private Child child;

    @Test
    void contextLoads() {
        System.out.println(child);
    }

}
```

## 使用properties

```text
name=Jerry
age=4
```

```java
@PropertySource(value = "classpath:abc.properties")
public class Child {

    @Value("${name}")
    private String name;
    @Value("${age}")
    private int age;
}
```

## 特殊支持

```text
child:
  name: xiaoming${random.uuid}
  age: ${random.int}
  gender: true
  birth: 2022/01/01
  passwords: {baidu: 123, google: 456}
  hello: happy
  hobbies:
    - TV
    - Games
  pet:
    name: ${child.hello:sad}_Tom
    age: 3
```

## JSR 303校验

## Encoding

Settings -> File Encodings

- Global Encoding
- Project Encoding
- Default encoding for properties files

## 来源

在 `spring-boot-starter-parent` 当中有如下内容：

```xml
<build>
    <resources>
        <resource>
            <directory>${basedir}/src/main/resources</directory>
            <filtering>true</filtering>
            <includes>
                <include>**/application*.yml</include>
                <include>**/application*.yaml</include>
                <include>**/application*.properties</include>
            </includes>
        </resource>
        <resource>
            <directory>${basedir}/src/main/resources</directory>
            <excludes>
                <exclude>**/application*.yml</exclude>
                <exclude>**/application*.yaml</exclude>
                <exclude>**/application*.properties</exclude>
            </excludes>
        </resource>
    </resources>
</build>
```
