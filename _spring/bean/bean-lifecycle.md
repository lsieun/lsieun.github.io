---
title: "Bean的生命周期"
sequence: "103"
---

In a normal Java process, a bean is usually instantiated using a new operator.
The Framework does a few more things in addition to simply creating the beans.
Once they are created, they are loaded into the appropriate container.
They are listed below:

- The framework factory loads the bean definitions and creates the bean.
- The bean is then populated with the properties as declared in the bean definitions.
  If the property is a reference to another bean, that other bean will be created and populated,
  and the reference is injected prior to injecting it into this bean.
- If your bean implements any of Spring's interfaces, such as `BeanNameAware` or `BeanFactoryAware`, appropriate methods will be called.
- The framework also invokes any `BeanPostProcessor`'s associated with your bean for **pre-initialzation**.
- The `init-method`, if specified, is invoked on the bean.
- The **post-initialization** will be performed if specified on the bean.


## Method Hooks

Spring Framework provides a couple of hooks in the form of callback methods.
These methods provide opportunity for the bean to **initialize properties** or **clean up resources**.
There are two such method hooks: `init-method` and `destroy-method`.

### init-method

When the bean is created, you can ask Spring to invoke a specific method on your bean to initialize.
This method provides a chance for your bean to do housekeeping stuff and to do some initialization,
such as creating data structures, creating thread pools, etc.

### destroy-method

Similar to the initialization, framework also invokes a destroy method to clean up before destroying the bean.
Framework provides a hook with the name `destroy-method`.

When the program quits, the framework destroys the beans.
During the process of destroying, the `destroy-method` method is invoked.
This gives the bean a chance to do some housekeeping activities.

## Bean Post Processors

Spring provides a couple of interfaces that your class can implement
in order to achieve the bean initialization and housekeeping.
Those interfaces are `InitializingBean` or `DisposableBean`, which has just one method in each of them.
The `InitializingBean`'s `afterPropertiesSet` method is called so the bean gets an opportunity to initialize.
Similarly, the `DisposableBean`'s `destroy` method is called
so the bean can do housekeeping when the bean is removed by the Spring.

## Bean Scopes

However, the default scope is always `singleton`.

Note that there is a subtle difference between the instance obtained
using the **Java Singleton pattern** and **Spring Singleton**.
**Spring Singleton** is a singleton per context or container,
whereas the **Java Singleton** is per process and per class loader.

## 生命周期

bean生命周期：

- 第一步，通过构造器创建Bean实例（无参构造方法）
- 第二步，为Bean的属性设置值和对其他bean引用（调用setter方法）
- 第三步，调用bean的初始化的方法（需要进行配置初始化的方法）
- 第四步，使用bean对象
- 第五步，当容器关闭时，调用bean的销毁的方法（需要进行配置销毁的方法）

### Bean

```java
package lsieun.spring.bean;

public class User {
    private String name;
    private int age;

    public User() {
        System.out.println("第一步，调用构造方法");
    }

    public void setName(String name) {
        System.out.println("第二步，设置name属性");
        this.name = name;
    }

    public void setAge(int age) {
        System.out.println("第二步，设置age属性");
        this.age = age;
    }

    public void initMethod() {
        System.out.println("第三步，调用init方法");
    }

    public void destroyMethod() {
        System.out.println("第五步，调用销毁方法");
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
    <bean id="user" class="lsieun.spring.bean.User" init-method="initMethod" destroy-method="destroyMethod">
        <property name="name" value="tom"/>
        <property name="age" value="10"/>
    </bean>
</beans>
```

### Main

```java
package lsieun;

import lsieun.spring.bean.User;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 1. 加载spring配置文件
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

        // 2. 获取配置创建的对象
        User user = context.getBean("user", User.class);
        System.out.println("第四步，使用bean对象");
        System.out.println(user);

        context.close();
    }
}
```

Output:

```text
第一步，调用构造方法
第二步，设置name属性
第二步，设置age属性
第三步，调用init方法
第四步，使用bean对象
User {name='tom', age=10}
第五步，调用销毁方法
```

## 后置处理器

加上bean的后置处理器，一共有七步：

- 第一步，通过构造器创建Bean实例（无参构造方法）
- 第二步，为Bean的属性设置值和对其他bean引用（调用setter方法）
- 第三步，**把bean实例传递bean后置处理器的方法**
- 第四步，调用bean的初始化的方法（需要进行配置初始化的方法）
- 第五步，**把bean实例传递bean后置处理器的方法**
- 第六步，使用bean对象
- 第七步，当容器关闭时，调用bean的销毁的方法（需要进行配置销毁的方法）

### Bean

```java
package lsieun.spring.bean;

public class User {
    private String name;
    private int age;

    public User() {
        System.out.println("第一步，调用构造方法");
    }

    public void setName(String name) {
        System.out.println("第二步，设置name属性");
        this.name = name;
    }

    public void setAge(int age) {
        System.out.println("第二步，设置age属性");
        this.age = age;
    }

    public void initMethod() {
        System.out.println("第三步，调用init方法");
    }

    public void destroyMethod() {
        System.out.println("第五步，调用销毁方法");
    }

    @Override
    public String toString() {
        return String.format("User {name='%s', age=%d}", name, age);
    }
}
```

```java
package lsieun.spring.bean;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;

public class MyBeanPost implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("Post Before");
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("Post After");
        return bean;
    }
}
```

### XML

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="user" class="lsieun.spring.bean.User" init-method="initMethod" destroy-method="destroyMethod" >
        <property name="name" value="tom"/>
        <property name="age" value="10"/>
    </bean>

    <bean id="myBeanPost" class="lsieun.spring.bean.MyBeanPost"/>
</beans>
```

### Main

```java
package lsieun;

import lsieun.spring.bean.User;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 1. 加载spring配置文件
        ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");

        // 2. 获取配置创建的对象
        User user = context.getBean("user", User.class);
        System.out.println("第四步，使用bean对象");
        System.out.println(user);

        context.close();
    }
}
```

Output:

```text
第一步，调用构造方法
第二步，设置name属性
第二步，设置age属性
Post Before
第三步，调用init方法
Post After
第四步，使用bean对象
User {name='tom', age=10}
第五步，调用销毁方法
```
