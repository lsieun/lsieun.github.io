---
title: "Spring Bean的生命周期"
sequence: "103"
---

Spring Bean 的生命周期是从 Bean 实例化之后，即通过反射创建出对象之后，到 Bean 成为一个完整对象，
最终存储到单例池中，这个过程称为 Spring Bean 的生命周期。

Spring Bean 的生命周期大体上分为三个阶段：

- Bean 的实例化阶段：Spring 框架会取出 BeanDefinition 的信息进行判断当前 Bean 的范围，
  是否是 singleton 的，是否不是延迟加载，是否不是 FactoryBean 等，最终将一个普通的 singleton 的 Bean 通过反射进行实例化。
- Bean 的初始化阶段：Bean 创建之后，还仅仅是个“半成品”，还需要对 Bean 实例的属性进行填充、执行一些 Aware 接口方法、
  执行 `BeanPostProcessor`、执行 `InitializingBean` 接口的初始化方法、执行自定义初始化 init 方法等。
  该阶段是 Spring 最具技术含量和复杂度的阶段，AOP 增强功能，后面要学习的 Spring 的注解功能、Bean 的循环引用问题都是在这个阶段体现的。
- Bean 的完成阶段：经过初始化阶段，Bean 就成为了一个完整的 Spring Bean，被存储到单例池 singletonObjects 中去了，
  即完成了 Spring Bean 的整个生命周期。

![](/assets/images/spring/bean/spring-ioc-bean-lifecycle.png)

## 实例化阶段

判断条件：

- 是否是 singleton 的
- 是否不是延迟加载
- 是否不是 FactoryBean

## 初始化阶段

Spring Bean 的初始化过程涉及如下几个过程：

- 属性
    - Bean 实例的属性填充
    - Aware 接口属性注入
- `BeanPostProcessor` 的 `before()` 方法回调：`postProcessBeforeInitialization`
- init
    - `InitializingBean` 接口的初始化方法回调
    - 自定义初始化 init 方法回调
- `BeanPostProcessor` 的 `after()` 方法回调：`postProcessAfterInitialization`

### Bean 实例属性填充

BeanDefinition 中有对当前 Bean 实例的注入信息通过 `propertyValues` 属性进行了存储，
例如 `UserService` 的属性信息如下：

![](/assets/images/spring/bean/bean-definition-map-property-values.png)

Spring 在进行属性注入时，会分为如下几种情况：

- 注入普通属性，String、int 或存储基本类型的集合时，直接通过 set 方法的反射设置进去；
- 注入单向对象引用属性时，从容器中 getBean 获取后通过 set 方法反射设置进去；
  如果容器中没有，则先创建被注入对象 Bean 实例（完成整个生命周期）后，再进行注入操作。
- 注入双向对象引用属性时，就比较复杂了，涉及了循环引用（循环依赖）问题。

### 三级缓存

Spring 提供了**三级缓存**存储完整 Bean 实例 和 半成品 Bean 实例，用于解决循环引用问题。

在 `DefaultListableBeanFactory` 的上四级父类 `DefaultSingletonBeanRegistry` 中提供了如下三个 Map：

```java
public class DefaultSingletonBeanRegistry extends SimpleAliasRegistry implements SingletonBeanRegistry {
    // 1、最终存储单例 Bean 成品的容器，即实例化和初始化完成的 Bean，称之为“一级缓存”
    private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

    // 2、早期 Bean 单例池，缓存半成品对象，且当前对象已经被其它对象引用了，称之为“二级缓存”
    private final Map<String, Object> earlySingletonObjects = new ConcurrentHashMap<>(16);

    // 3、单例 Bean 的工厂池，缓存半成品对象，对象未被引用，使用时在通过工厂创建 Bean，称之为“三级缓存”
    private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);
}
```

### 循环依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="lsieun.service.impl.UserServiceImpl">
        <property name="userDao" ref="userDao"/>
    </bean>

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl">
        <property name="userService" ref="userService"/>
    </bean>
</beans>
```

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
    private UserDao userDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
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
import lsieun.service.UserService;

public class UserDaoImpl implements UserDao {
    private UserService userService;

    public void setUserService(UserService userService) {
        this.userService = userService;
    }
}
```

```java
package lsieun.run;

import lsieun.dao.UserDao;
import lsieun.service.UserService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserService userService = (UserService) applicationContext.getBean("userService");
        System.out.println(userService);
        UserDao userDao = (UserDao) applicationContext.getBean("userDao");
        System.out.println(userDao);
    }
}
```

- ClassPathXmlApplicationContext
    - refresh()
- AbstractApplicationContext#finishBeanFactoryInitialization;
    - beanFactory.preInstantiateSingletons();
- DefaultListableBeanFactory#preInstantiateSingletons
    - getBean(beanName)
      - doGetBean
        - if (mbd.isSingleton())
          - createBean(beanName, mbd, args) --> AbstractAutowireCapableBeanFactory#createBean()
            - Object beanInstance = doCreateBean(beanName, mbdToUse, args);
              - instanceWrapper = createBeanInstance(beanName, mbd, args);
    - Object singletonInstance = getSingleton(beanName);
    - getSingleton(String beanName, boolean allowEarlyReference)
    -

```text

```

### 常用的 Aware 接口

AWare 接口是一种框架辅助属性注入的一种思想，其它框架中也可以看到类似的接口。
框架具备高度封装性，我们接触的一般都是业务代码，一个底层功能 API 不能轻易的获取到，
但是这不意味着永远用不到这些对象；
如果用到了，就可以使用框架提供的类似AWare 的接口，让框架给我们注入该对象。

AWare 接口：

- ServletContextAware：`setServletContext(ServletContext context)`，Spring 框架回调方法注入 ServletContext 对象，Web 环境下才生效。
- `BeanFactoryAware`：`setBeanFactory(BeanFactory factory)`，Spring 框架回调方法注入 beanFactory 对象
- `BeanNameAware`：`setBeanName(String beanName)`，Spring 框架回调方法注入当前 Bean 在容器中的 beanName
- `ApplicationContextAware`：`setApplicationContext(ApplicationContext applicationContext)`，Spring 框架回调方法注入 applicationContext 对象

## 完成阶段


## 完整示例

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="lsieun.service.impl.UserServiceImpl" init-method="init" destroy-method="destroy">
        <property name="userDao" ref="userDao"/>
    </bean>

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl"/>

    <bean class="lsieun.processor.MyBeanFactoryPostProcessor"/>
    <bean class="lsieun.processor.MyBeanPostProcessor"/>

</beans>
```

```java
package lsieun.processor;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;

public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        System.out.println("BeanFactoryPostProcessor.postProcessBeanFactory");
    }
}
```

```java
package lsieun.processor;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;

public class MyBeanPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("BeanPostProcessor.before: " + beanName);
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("BeanPostProcessor.after: " + beanName);
        return bean;
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

public class UserDaoImpl implements UserDao {
}
```

```java
package lsieun.service;

public interface UserService {
}
```

```java
package lsieun.service.impl;

import lsieun.dao.UserDao;
import lsieun.service.UserService;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.*;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

public class UserServiceImpl implements UserService,
        BeanNameAware, BeanFactoryAware, ApplicationContextAware,
        InitializingBean, DisposableBean {
    private UserDao userDao;

    public void setUserDao(UserDao userDao) {
        System.out.println("setUserDao");
        this.userDao = userDao;
    }

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        System.out.println("BeanFactoryAware: " + beanFactory.getClass());
    }

    @Override
    public void setBeanName(String name) {
        System.out.println("BeanNameAware: " + name);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        System.out.println("ApplicationContextAware: " + applicationContext.getClass());
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("InitializingBean.afterPropertiesSet()");
    }

    public void initMethod() {
        System.out.println("init-method");
    }

    @Override
    public void destroy() {
        System.out.println("DisposableBean.destroy()");
    }

    public void destroyMethod() {
        System.out.println("destroy-method");
    }
}
```

```java
package lsieun.run;

import lsieun.service.UserService;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ConfigurableApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        UserService userService = (UserService) applicationContext.getBean("userService");
        System.out.println(userService);

        // 第 3 步，关闭 ApplicationContext
        applicationContext.close();
    }
}
```

```text
BeanFactoryPostProcessor.postProcessBeanFactory
----------------------------------------------------------------
BeanPostProcessor.before: userDao
BeanPostProcessor.after: userDao
----------------------------------------------------------------
setUserDao                                                 # 属性注入
BeanNameAware: userService                                 # Aware
BeanFactoryAware: DefaultListableBeanFactory               # Aware
ApplicationContextAware: ClassPathXmlApplicationContext    # Aware
BeanPostProcessor.before: userService                      # BeanPostProcessor.before
InitializingBean.afterPropertiesSet()                      # InitializingBean
init-method                                                # init-method
BeanPostProcessor.after: userService                       # BeanPostProcessor.after
----------------------------------------------------------------
lsieun.service.impl.UserServiceImpl@1f28c152
----------------------------------------------------------------
DisposableBean.destroy()                                   # DisposableBean
destroy-method                                             # destroy-method
```
