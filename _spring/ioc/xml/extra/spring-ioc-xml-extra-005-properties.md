---
title: "context:property-placeholder"
sequence: "105"
---

## 读取外部属性文件

将外部properties属性文件引入到Spring配置文件中：

### Bean

```java
package lsieun.spring.bean;

public class User {
    private String name;
    private int age;

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return String.format("User {name='%s', age=%d}", name, age);
    }
}
```

`my.properties`文件如下：

```text
good.child.name=jerry
good.child.age=9
```

### XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">
    <context:property-placeholder location="classpath:my.properties"/>
    <bean id="user" class="lsieun.spring.bean.User">
        <property name="name" value="${good.child.name}"/>
        <property name="age" value="${good.child.age}"/>
    </bean>
</beans>
```

`Ctrl+Alt+Space`

![](/assets/images/spring/intellij/auto-import-xml-namespace.png)

### Main

```java
package lsieun;

import lsieun.spring.bean.User;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 1. 加载spring配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

        // 2. 获取配置创建的对象
        User user = context.getBean("user", User.class);
        System.out.println(user);
    }
}
```

