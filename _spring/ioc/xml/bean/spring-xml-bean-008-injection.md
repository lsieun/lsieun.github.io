---
title: "Bean 的依赖注入：List、Set、Map、Properties"
sequence: "108"
---

## 注入方式

Bean 的依赖注入有两种方式：

- 通过 Bean 的 set 方法注入
  - `<property name="userDao" ref="userDao"/>`
  - `<property name="username" value="tomcat"/>`
- 通过构造 Bean 的方法进行注入
  - `<constructor-arg name="userDao" ref="userDao"/>`
  - `<constructor-arg name="username" value="tomcat"/>`

其中，`ref` 是 reference 的缩写形式，用于引用其它 Bean 的 `id`；
`value` 用于注入普通属性值。

## 注入的数据类型

依赖注入的数据类型有以下三种：

- 普通数据类型，例如：`String`、`int`、`boolean` 等，通过 `<bean>` 的 `value` 属性指定。
- 引用数据类型，例如：`UserDaoImpl`、`DataSource` 等，通过 `<bean>` 的 `ref` 属性指定。
- 集合数据类型，例如：`List`、`Map`、`Properties` 等。

## 注入集合类型

### List

#### 字符串

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl">
        <property name="usernameList">
            <list>
                <value>tomcat</value>
                <value>jerry</value>
            </list>
        </property>
    </bean>
</beans>
```

```java
package lsieun.dao;

public interface UserDao {
}
```

```java
package lsieun.dao.impl;

import lsieun.dao.UserDao;

import java.util.List;

public class UserDaoImpl implements UserDao {
    private List<String> usernameList;

    public void setUsernameList(List<String> usernameList) {
        System.out.println("usernameList = " + usernameList);
        this.usernameList = usernameList;
    }
}
```

```java
package lsieun.run;

import lsieun.dao.UserDao;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserDao userDao = (UserDao) applicationContext.getBean("userDao");
        System.out.println(userDao);
    }
}
```

#### 对象

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl">
        <property name="userList">
            <list>
                <bean class="lsieun.entity.User">
                    <property name="username" value="tomcat"/>
                    <property name="age" value="10"/>
                </bean>
                <bean class="lsieun.entity.User">
                    <property name="username" value="jerry"/>
                    <property name="age" value="9"/>
                </bean>
            </list>
        </property>
    </bean>
</beans>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl">
        <property name="userList">
            <list>
                <ref bean="jerry"/>
                <ref bean="tom"/>
            </list>
        </property>
    </bean>

    <bean id="tom" class="lsieun.entity.User">
        <property name="username" value="tomcat"/>
        <property name="age" value="10"/>
    </bean>
    <bean id="jerry" class="lsieun.entity.User">
        <property name="username" value="jerry"/>
        <property name="age" value="9"/>
    </bean>
</beans>
```

```java
package lsieun.entity;

public class User {
    private String username;
    private int age;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return String.format("User {username='%s', age=%d}", username, age);
    }
}
```

```java
package lsieun.dao;

public interface UserDao {
}
```

```java
package lsieun.dao.impl;

import lsieun.dao.UserDao;
import lsieun.entity.User;

import java.util.List;

public class UserDaoImpl implements UserDao {
    private List<User> userList;

    public void setUserList(List<User> userList) {
        System.out.println("userList = " + userList);
        this.userList = userList;
    }
}
```

### Set

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl">
        <property name="usernameSet">
            <set>
                <value>zhangsan</value>
                <value>lisi</value>
            </set>
        </property>
        <property name="userSet">
            <set>
                <ref bean="jerry"/>
                <ref bean="tom"/>
            </set>
        </property>
    </bean>

    <bean id="tom" class="lsieun.entity.User">
        <property name="username" value="tomcat"/>
        <property name="age" value="10"/>
    </bean>
    <bean id="jerry" class="lsieun.entity.User">
        <property name="username" value="jerry"/>
        <property name="age" value="9"/>
    </bean>
</beans>
```

```java
package lsieun.dao.impl;

import lsieun.dao.UserDao;
import lsieun.entity.User;

import java.util.Set;

public class UserDaoImpl implements UserDao {
  private Set<String> usernameSet;
  private Set<User> userSet;

  public void setUsernameSet(Set<String> usernameSet) {
    System.out.println("usernameSet = " + usernameSet);
    this.usernameSet = usernameSet;
  }

  public void setUserSet(Set<User> userSet) {
    System.out.println("userSet = " + userSet);
    this.userSet = userSet;
  }
}
```

### Map

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl">
        <property name="userMap">
            <map>
                <entry key="cat" value-ref="tom"/>
                <entry key="mouse" value-ref="jerry"/>
            </map>
        </property>
    </bean>

    <bean id="tom" class="lsieun.entity.User">
        <property name="username" value="tomcat"/>
        <property name="age" value="10"/>
    </bean>
    <bean id="jerry" class="lsieun.entity.User">
        <property name="username" value="jerry"/>
        <property name="age" value="9"/>
    </bean>
</beans>
```

```java
package lsieun.dao.impl;

import lsieun.dao.UserDao;
import lsieun.entity.User;

import java.util.Map;

public class UserDaoImpl implements UserDao {
    private Map<String, User> userMap;

    public void setUserMap(Map<String, User> userMap) {
        System.out.println("userMap = " + userMap);
        this.userMap = userMap;
    }
}
```

### Properties

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl">
        <property name="animals">
            <props>
                <prop key="cat">tom</prop>
                <prop key="mouse">jerry</prop>
            </props>
        </property>
    </bean>
</beans>
```

```java
package lsieun.dao.impl;

import lsieun.dao.UserDao;

import java.util.Properties;

public class UserDaoImpl implements UserDao {
    private Properties animals;

    public void setAnimals(Properties animals) {
        System.out.println("animals = " + animals);
        this.animals = animals;
    }
}
```
