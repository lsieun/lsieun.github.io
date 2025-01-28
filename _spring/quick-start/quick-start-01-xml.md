---
title: "Spring Quick Start 001"
sequence: "101"
---

## pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>learn-java-spring</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <spring.version>5.3.15</spring.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-beans</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-expression</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>${spring.version}</version>
        </dependency>
<!--        <dependency>-->
<!--            <groupId>commons-logging</groupId>-->
<!--            <artifactId>commons-logging</artifactId>-->
<!--            <version>1.2</version>-->
<!--        </dependency>-->
    </dependencies>

</project>
```

## 创建对象-普通Bean

### Bean

```java
package lsieun.spring.bean;

public class User {
    public void test() {
        System.out.println("test method");
    }
}
```

### XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="user" class="lsieun.spring.bean.User"/>
</beans>
```

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
        user.test();
    }
}
```

## 创建对象-FactoryBean

### Bean

```java
package lsieun.spring.bean;

public class User {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return String.format("User {name='%s', age=%d}", name, age);
    }
}
```

```java
package lsieun.spring.bean;

import org.springframework.beans.factory.FactoryBean;

public class MyBean implements FactoryBean<User> {
    @Override
    public User getObject() throws Exception {
        return new User("tom", 10);
    }

    @Override
    public Class<?> getObjectType() {
        return User.class;
    }
}
```

### XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="myBean" class="lsieun.spring.bean.MyBean"/>
</beans>
```

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
        User user = context.getBean("myBean", User.class);
        System.out.println(user);
    }
}
```

## XML注入属性-setter

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

### XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="user" class="lsieun.spring.bean.User">
        <property name="name" value="Tom"/>
        <property name="age" value="10"/>
    </bean>
</beans>
```

如果我们想将`name`设置为`null`值：

```text
<property name="name">
    <null></null>
</property>
```

如果我们想将`name`设置为`<<Tom>>`值：

```text
第一种方式：进行转义
<property name="name" value="&lt;&lt;Tom&gt;&gt;"/>

第二种方式：将特殊符号写到CDATA
<property name="name">
    <value><![CDATA[<<Tom>>]]></value>
</property>
```

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

## 注入属性-constructor

### Bean

```java
package lsieun.spring.bean;

public class User {
    private String name;
    private int age;

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return String.format("User {name='%s', age=%d}", name, age);
    }
}
```

### XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="user" class="lsieun.spring.bean.User">
        <constructor-arg name="name" value="jerry"/>
        <constructor-arg name="age" value="9"/>
    </bean>
</beans>
```

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

## 注入属性-对象

### Bean

```java
package lsieun.spring.dao;

public interface UserDao {
    void update();
}
```

```java
package lsieun.spring.dao;

public class UserDaoImpl implements UserDao {
    @Override
    public void update() {
        System.out.println("UserDaoImpl update");
    }
}
```

```java
package lsieun.spring.service;

import lsieun.spring.dao.UserDao;

public class UserService {

    private UserDao userDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    public void add() {
        System.out.println("UserService add...");
        userDao.update();
    }
}
```

### XML

方式一：使用外部Bean

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="userService" class="lsieun.spring.service.UserService">
        <property name="userDao" ref="userDaoImpl"/>
    </bean>
    <bean id="userDaoImpl" class="lsieun.spring.dao.UserDaoImpl"/>
</beans>
```

方式二：使用内部Bean

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="userService" class="lsieun.spring.service.UserService">
        <property name="userDao">
            <bean id="userDaoImpl" class="lsieun.spring.dao.UserDaoImpl"/>
        </property>
    </bean>
</beans>
```

### Main

```java
package lsieun;

import lsieun.spring.service.UserService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 1. 加载spring配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

        // 2. 获取配置创建的对象
        UserService userService = context.getBean("userService", UserService.class);
        userService.add();
    }
}
```

## 注入属性-集合

- 注入数组
- 注入List集合
- 注入Map集合

### Bean

```java
package lsieun.spring.bean;

import java.util.List;
import java.util.Map;
import java.util.Set;

public class MyBean {
    private String[] myArray;

    private List<String> myList;

    private Map<String, String> myMap;

    private Set<String> mySet;

    public void setMyArray(String[] myArray) {
        this.myArray = myArray;
    }

    public void setMyList(List<String> myList) {
        this.myList = myList;
    }

    public void setMyMap(Map<String, String> myMap) {
        this.myMap = myMap;
    }

    public void setMySet(Set<String> mySet) {
        this.mySet = mySet;
    }

    public void print() {
        System.out.println("Array");
        for (String item : myArray) {
            System.out.println("    " + item);
        }
        System.out.println("List");
        for (String item : myList) {
            System.out.println("    " + item);
        }
        System.out.println("Map");
        Set<Map.Entry<String, String>> entries = myMap.entrySet();
        for (Map.Entry<String, String> item : entries) {
            System.out.println("    " + item.getKey() + ":" + item.getValue());
        }
        System.out.println("Set");
        for (String item : mySet) {
            System.out.println("    " + item);
        }
    }
}
```

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

### XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="myBean" class="lsieun.spring.bean.MyBean">
        <property name="myArray">
            <array>
                <value>Tom</value>
                <value>Jerry</value>
            </array>
        </property>
        <property name="myList">
            <list>
                <value>Lucy</value>
                <value>Lily</value>
            </list>
        </property>
        <property name="myMap">
            <map>
                <entry key="username" value="tomcat"/>
                <entry key="password" value="123456"/>
            </map>
        </property>
        <property name="mySet">
            <set>
                <value>ASM</value>
                <value>Agent</value>
            </set>
        </property>
        <property name="userList">
            <list>
                <ref bean="tom"/>
                <ref bean="jerry"/>
            </list>
        </property>
    </bean>

    <bean id="tom" class="lsieun.spring.bean.User">
        <property name="name" value="tom"/>
        <property name="age" value="10"/>
    </bean>
    <bean id="jerry" class="lsieun.spring.bean.User">
        <property name="name" value="Jerry"/>
        <property name="age" value="9"/>
    </bean>
</beans>
```

### Main

```java
package lsieun;

import lsieun.spring.bean.MyBean;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 1. 加载spring配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

        // 2. 获取配置创建的对象
        MyBean myBean = context.getBean("myBean", MyBean.class);
        myBean.print();
    }
}
```




