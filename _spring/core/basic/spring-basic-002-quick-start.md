---
title: "快速开始：BeanFactory和ApplicationContext"
sequence: "102"
---

## BeanFactory 版

### pom.xml

```xml
<properties>
    <!-- resource -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>

    <!-- JDK -->
    <java.version>8</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>

    <!-- spring -->
    <spring.version>5.3.31</spring.version>
</properties>
```

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>${spring.version}</version>
    </dependency>
</dependencies>
```

查看 Jar 包之间的依赖关系：

```text
mvn dependency:tree
```

输出结果：

```text
[INFO] lsieun:learn-spring-xml:jar:1.0-SNAPSHOT
[INFO] \- org.springframework:spring-context:jar:5.3.31:compile
[INFO]    +- org.springframework:spring-aop:jar:5.3.31:compile
[INFO]    +- org.springframework:spring-beans:jar:5.3.31:compile
[INFO]    +- org.springframework:spring-core:jar:5.3.31:compile
[INFO]    |  \- org.springframework:spring-jcl:jar:5.3.31:compile
[INFO]    \- org.springframework:spring-expression:jar:5.3.31:compile
```

### IoC

使用 BeanFactory 完成 IoC 思想：

- 第 1 步，导入 Spring 的 Jar 包或 Maven 坐标；
- 第 2 步，定义 `UserService` 接口及其 `UserServiceImpl` 实现类；
- 第 3 步，创建 `beans.xml` 配置文件，将 `UserServiceImpl` 的信息配置到 `beans.xml` 中；
- 第 4 步，编写测试代码，创建 `BeanFactory`，加载配置文件，获取 `UserService` 实例对象。

#### UserService.java

```java
package lsieun.service;

public interface UserService {
}
```

```java
package lsieun.service.impl;

import lsieun.service.UserService;

public class UserServiceImpl implements UserService {
}
```

#### beans.xml

添加 `src/main/resources/beans.xml` 文件：

![](/assets/images/spring/intellij/maven-resource-new-xml-spring-config.png)

内容如下：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="lsieun.service.impl.UserServiceImpl"/>
</beans>
```

#### Main.java

```java
package lsieun.quick;

import lsieun.service.UserService;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;

public class QuickStart_A_BeanFactory {
    public static void main(String[] args) {
        // 第 1 步，创建工厂对象
        DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();

        // 第 2 步，创建一个读取器，与工厂绑定
        XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(beanFactory);

        // 第 3 步，读取 XML 文件
        reader.loadBeanDefinitions("beans.xml");

        // 第 4 步，根据 id 获取 Bean 实例对象
        UserService userService = (UserService) beanFactory.getBean("userService");
        System.out.println(userService);
    }
}
```

### DI

使用 BeanFactory 完成 DI 依赖注入：

- 第 1 步，定义 `UserDao` 接口及其 `UserDaoImpl` 实现类；
- 第 2 步，修改 `UserServiceImpl` 代码，添加一个 `setUserDao(UserDao userDao)` 用于接收注入对象；
- 第 3 步，修改 `beans.xml` 配置文件，在 `UserDaoImpl` 的 `<bean>` 中嵌入 `<property>` 配置注入；
- 第 4 步，测试代码，获取 `UserService` 时，`setUserDao` 方法执行注入操作。

#### UserDao.java

```java
package lsieun.dao;

public interface UserDao {
}
```

```java
package lsieun.dao.impl;

import lsieun.dao.UserDao;

public class UserDaoImpl implements UserDao {
}
```

#### UserService.java

```java
package lsieun.service;

public interface UserService {
}
```

```java
package lsieun.service.impl;

import lsieun.dao.UserDao;
import lsieun.service.UserService;

public class UserServiceImpl implements UserService {
    public void setUserDao(UserDao userDao) {
        System.out.println("Spring 容器进行 DI 注入：" + userDao);
    }
}
```

#### beans.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="lsieun.service.impl.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
    </bean>

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl"/>
</beans>
```

#### Main.java

```java
package lsieun.quick;

import lsieun.service.UserService;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;

public class QuickStart_A_BeanFactory {
    public static void main(String[] args) {
        // 第 1 步，创建工厂对象
        DefaultListableBeanFactory beanFactory = new DefaultListableBeanFactory();

        // 第 2 步，创建一个读取器，与工厂绑定
        XmlBeanDefinitionReader reader = new XmlBeanDefinitionReader(beanFactory);

        // 第 3 步，读取 XML 文件
        reader.loadBeanDefinitions("beans.xml");

        // 第 4 步，根据 id 获取 Bean 实例对象
        UserService userService = (UserService) beanFactory.getBean("userService");
        System.out.println(userService);
    }
}
```

## ApplicationContext 版

`ApplicationContext` 称为 Spring 容器，内部封装了 BeanFactory，比 BeanFactory 功能更丰富更强大。

使用 `ApplicationContext` 进行开发时，XML 配置文件 的名称习惯写成 `applicationContext.xml`。

### applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="lsieun.service.impl.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
    </bean>

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl"/>
</beans>
```

### Main.java

```java
package lsieun.quick;

import lsieun.service.UserService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class QuickStart_B_ApplicationContext {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");
        
        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserService userService = (UserService) applicationContext.getBean("userService");
        System.out.println(userService);
    }
}
```
