---
title: "Spring 的后处理器"
sequence: "102"
---

Spring 的后处理器是 Spring 对外开发的重要扩展点，允许我们介入到 Bean 的整个实例化流程中来，
以达到**动态注册 BeanDefinition**，**动态修改 BeanDefinition**，以及**动态修改 Bean** 的作用。

Spring 主要有两种后处理器：

- BeanFactoryPostProcessor：Bean 工厂后处理器，在 BeanDefinitionMap 填充完毕，Bean 实例化之前执行。
- BeanPostProcessor：Bean 后处理器，一般在 Bean 实例化之后，填充到单例池 singletonObjects 之前执行。

## Bean 工厂后处理器

![](/assets/images/spring/bean/post-processor-of-factory-and-registry.png)


### BeanFactoryPostProcessor

`BeanFactoryPostProcessor` 是一个接口规范：

```java
@FunctionalInterface
public interface BeanFactoryPostProcessor {
    void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException;
}
```

那么，如何使用这个接口呢？我们可以编写一个实现了这个接口的类，然后交由 Spring 容器管理，
接着 Spring 就会回调该接口的方法，用于对 BeanDefinition 注册和修改的功能。

#### 修改 BeanDefinition

预期目标：将 `userService` 的实现从 `UserServiceImpl` 替换成 `UserDaoImpl`。

第 1 步，编写 `applicationContext.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userService" class="lsieun.service.impl.UserServiceImpl"/>

    <bean class="lsieun.processor.MyBeanFactoryPostProcessor"/>
</beans>
```

第 2 步，定义 `MyBeanFactoryPostProcessor` 类实现 `BeanFactoryPostProcessor` 接口：

```java
package lsieun.processor;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;

public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        System.out.println("执行 postProcessBeanFactory 方法");
        if (beanFactory instanceof BeanDefinitionRegistry) {
            BeanDefinitionRegistry registry = (BeanDefinitionRegistry) beanFactory;
            BeanDefinition beanDefinition = registry.getBeanDefinition("userService");
            beanDefinition.setBeanClassName("lsieun.dao.impl.UserDaoImpl");
        }
    }
}
```

第 3 步，定义 `UserService`：

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

第 4  步，定义 `UserDao`：

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

第 5 步，编写 `Main`：

```java
package lsieun.run;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        Object bean = applicationContext.getBean("userService");
        System.out.println(bean);
    }
}
```

#### 注册 BeanDefinition

### BeanDefinitionRegistryPostProcessor

Spring 提供了一个 `BeanFactoryPostProcessor` 的子接口 `BeanDefinitionRegistryPostProcessor` 专门用于注册 `BeanDefinition` 操作：

```java
public interface BeanDefinitionRegistryPostProcessor extends BeanFactoryPostProcessor {
    void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException;
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean class="lsieun.processor.MyBeanDefinitionRegistryPostProcessor"/>
</beans>
```

```java
package lsieun.processor;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.beans.factory.support.GenericBeanDefinition;

public class MyBeanDefinitionRegistryPostProcessor implements BeanDefinitionRegistryPostProcessor {
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        System.out.println("执行 postProcessBeanDefinitionRegistry 方法");

        BeanDefinition beanDefinition = new GenericBeanDefinition();
        beanDefinition.setBeanClassName("lsieun.dao.impl.UserDaoImpl");
        registry.registerBeanDefinition("userDao", beanDefinition);
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        System.out.println("执行 postProcessBeanFactory 方法");
    }
}
```

```java
package lsieun.run;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        Object bean = applicationContext.getBean("userDao");
        System.out.println(bean);
    }
}
```

```text
执行 postProcessBeanDefinitionRegistry 方法
执行 postProcessBeanFactory 方法
lsieun.dao.impl.UserDaoImpl@148080bb
```

### 编写 MyComponent 注解

- 自定义 `@MyComponent` 注解，使用在类上
- 使用 `BasicClassScanUtils` 完成指定包的类扫描
- 自定义 `BeanFactoryPostProcessor` 完成注解 `@MyComponent` 的解析，解析后最终被 Spring 管理

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean class="lsieun.processor.MyComponentBeanDefinitionRegistryPostProcessor"/>
</beans>
```

```java
package lsieun.processor;

import lsieun.utils.BaseClassScanUtils;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.beans.factory.support.GenericBeanDefinition;

import java.util.Map;

public class MyComponentBeanDefinitionRegistryPostProcessor implements BeanDefinitionRegistryPostProcessor {
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
        // 通过扫描工具去扫描指定包及其子包下的所有类，收集使用 @MyComponent 的注解的类
        Map<String, Class<?>> classMap = BaseClassScanUtils.scanMyComponentAnnotation("lsieun");
        // 遍历 Map，组装 BeanDefinition 进行注册
        classMap.forEach(
                (beanName, clazz) -> {
                    // 获得 beanClassName
                    String beanClassName = clazz.getName();
                    // 创建 BeanDefinition
                    BeanDefinition beanDefinition = new GenericBeanDefinition();
                    beanDefinition.setBeanClassName(beanClassName);
                    // 注册
                    registry.registerBeanDefinition(beanName, beanDefinition);
                }
        );
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {

    }
}
```

```java
package lsieun.utils;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyComponent {
    String value();
}
```

```java
package lsieun.utils;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.core.type.classreading.CachingMetadataReaderFactory;
import org.springframework.core.type.classreading.MetadataReader;
import org.springframework.core.type.classreading.MetadataReaderFactory;
import org.springframework.util.ClassUtils;

import java.util.HashMap;
import java.util.Map;

public class BaseClassScanUtils {
    // 设置资源规则
    private static final String RESOURCE_PATTERN = "/**/*.class";

    public static Map<String, Class<?>> scanMyComponentAnnotation(String basePackage) {
        // 创建容器存储使用了指定注解 Bean 字节码对象
        Map<String, Class<?>> annotationClassMap = new HashMap<>();

        // Spring 工具类，可以获取指定路径下的全部类
        ResourcePatternResolver resourcePatternResolver = new PathMatchingResourcePatternResolver();
        try {
            String pattern = ResourcePatternResolver.CLASSPATH_ALL_URL_PREFIX +
                    ClassUtils.convertClassNameToResourcePath(basePackage) + RESOURCE_PATTERN;
            Resource[] resources = resourcePatternResolver.getResources(pattern);

            // MetadataReader 的工厂类
            MetadataReaderFactory readerFactory = new CachingMetadataReaderFactory(resourcePatternResolver);
            for (Resource resource : resources) {
                // 用于读取类信息
                MetadataReader reader = readerFactory.getMetadataReader(resource);
                // 扫描到的 class
                String classname = reader.getClassMetadata().getClassName();
                Class<?> clazz = Class.forName(classname);

                // 判断是否属于指定的
                if (clazz.isAnnotationPresent(MyComponent.class)) {
                    // 获得注解对象
                    MyComponent annotation = clazz.getAnnotation(MyComponent.class);
                    // 获得 value 属性值
                    String beanName = annotation.value();
                    // 判断是否为 ""
                    if (beanName != null && !"".equals(beanName)) {
                        // 存储到 Map 中去
                        annotationClassMap.put(beanName, clazz);
                    } else {
                        // 如果没有为 ""，那就把当前类的类名作为 beanName
                        annotationClassMap.put(clazz.getSimpleName(), clazz);
                    }
                }
            }
        } catch (Exception ignored) {
        }

        return annotationClassMap;
    }

    public static void main(String[] args) {
        Map<String, Class<?>> classMap = scanMyComponentAnnotation("lsieun");
        System.out.println(classMap);
    }
}

```

```java
package lsieun.entity;

import lsieun.utils.MyComponent;

@MyComponent("user")
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
package lsieun.run;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        Object bean = applicationContext.getBean("user");
        System.out.println(bean);
    }
}
```

## Bean 后处理器

Bean 被实例化后，到最终缓存到名为 singletonObjects 单例池之前，中间会经过 Bean 的初始化过程，
例如：属性的填充、初始方法 init 的执行等，其中有一个对外进行扩展的点 `BeanPostProcessor`，我们称为 Bean 后处理器。

跟上面的 Bean 工厂后处理器相似，它也是一个接口，实现了该接口并被容器管理的 BeanPostProcessor，会在流程节点上被 Spring 自动调用。

![](/assets/images/spring/bean/post-processor-of-factory-and-bean.png)

```java
public interface BeanPostProcessor {
    // 在属性注入完毕，init 初始化方法执行之前被调用
    @Nullable
    default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }

    // 在初始化方法执行之后，被添加到单例池 singletonObjects 之前被调用
    @Nullable
    default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }
}
```

### 简单示例

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl" init-method="init" destroy-method="destroy"/>

    <bean class="lsieun.processor.MyBeanPostProcessor"/>
</beans>
```

```java
package lsieun.processor;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;

public class MyBeanPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessBeforeInitialization");
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessAfterInitialization");
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
import org.springframework.beans.factory.InitializingBean;

public class UserDaoImpl implements UserDao, InitializingBean {
    public UserDaoImpl() {
        System.out.println("constructor");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("InitializingBean.afterPropertiesSet");
    }
    
    public void init() {
        System.out.println("init-method");
    }

    public void destroy() {
        System.out.println("destroy-method");
    }
}
```

```java
package lsieun.run;

import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 第 1 步，创建 ApplicationContext，加载配置文件，实例化容器
        ConfigurableApplicationContext applicationContext = new ClassPathXmlApplicationContext("applicationContext.xml");

        // 第 2 步，根据 beanName 获取容器中的 Bean 实例
        Object bean = applicationContext.getBean("userDao");
        System.out.println(bean);

        // 第 3 步，关闭 ApplicationContext
        applicationContext.close();
    }
}
```

```text
constructor
postProcessBeforeInitialization
InitializingBean.afterPropertiesSet
init-method
postProcessAfterInitialization
lsieun.dao.impl.UserDaoImpl@148080bb
destroy-method
```

### 案例-时间日志增强

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="userDao" class="lsieun.dao.impl.UserDaoImpl"/>

    <bean class="lsieun.processor.TimeLogBeanPostProcessor"/>
</beans>
```

```java
package lsieun.processor;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;

import java.lang.reflect.Proxy;

public class TimeLogBeanPostProcessor implements BeanPostProcessor {
    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        // 使用动态代理对目标 bean 进行增强，返回 proxy 对象，进而存储到单例池 singletonObjects 中
        Object beanProxy = Proxy.newProxyInstance(
                bean.getClass().getClassLoader(),
                bean.getClass().getInterfaces(),
                (proxy, method, args) -> {
                    // 输出开始时间
                    System.out.println("方法：" + method.getName() + "-开始时间：" + System.currentTimeMillis());
                    // 执行目标方法
                    Object result = method.invoke(bean, args);
                    // 输出结束时间
                    System.out.println("方法：" + method.getName() + "-结束时间：" + System.currentTimeMillis());
                    return result;
                }
        );

        return beanProxy;
    }
}
```

```java
package lsieun.dao;

public interface UserDao {
    void show();
}
```

```java
package lsieun.dao.impl;

import lsieun.dao.UserDao;

public class UserDaoImpl implements UserDao {
    @Override
    public void show() {
        System.out.println("show...");
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
        userDao.show();
    }
}
```

```text
方法：show-开始时间：1700575970793
show...
方法：show-结束时间：1700575970793
```
