---
title: "@Import"
sequence: "105"
---

Spring 与 MyBatis 注解方式整合有个重要的技术点，就是 `@Import`，
第三方框架与 Spring 整合 XML 方式很多都是凭借自定义标签完成的，
而第三方框架与 Spring 整合注解方式很多是靠 `@Import` 注解完成的。

`@Import` 可以导入如下三种类：

- 普通的配置类
- 实现 `ImportSelector` 接口的类
- 实现 `ImportBeanDefinitionRegistrar` 接口的类

```java
class ConfigurationClassParser {
    private void processImports(ConfigurationClass configClass, SourceClass currentSourceClass,
                                Collection<SourceClass> importCandidates, Predicate<String> exclusionFilter,
                                boolean checkForCircularImports) {
        if (importCandidates.isEmpty()) {
            return;
        }

        if (checkForCircularImports && isChainedImportOnStack(configClass)) {
            // ...
        }
        else {
            this.importStack.push(configClass);
            try {
                for (SourceClass candidate : importCandidates) {
                    
                    
                    if (candidate.isAssignable(ImportSelector.class)) {
                        // 如果是 ImportSelector 类型
                        // Candidate class is an ImportSelector -> delegate to it to determine imports
                        
                        // ...


                        if (selector instanceof DeferredImportSelector) {
                            // 如果是 DeferredImportSelector 类型
                            // ...
                        }
                        else {
                            // 如果是 ImportSelector 类型
                            // ...
                        }
                    }
                    else if (candidate.isAssignable(ImportBeanDefinitionRegistrar.class)) {
                        // 如果是 ImportBeanDefinitionRegistrar 类型
                        // Candidate class is an ImportBeanDefinitionRegistrar ->
                        // delegate to it to register additional bean definitions
                        
                        // ...
                    }
                    else {
                        // 如果是 @Configuration 注解的类
                        // Candidate class not an ImportSelector or ImportBeanDefinitionRegistrar ->
                        // process it as a @Configuration class
                        // ...
                    }
                }
            }
            catch (Throwable ex) {
                throw new BeanDefinitionStoreException(
                        "Failed to process import candidates for configuration class [" +
                                configClass.getMetadata().getClassName() + "]", ex);
            }
            finally {
                this.importStack.pop();
            }
        }
    }
}
```

## 示例

### Common

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
package lsieun.run;

import lsieun.config.SpringConfig;
import lsieun.dao.UserDao;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class MainAnnoRun {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(SpringConfig.class);
        UserDao userDao = applicationContext.getBean(UserDao.class);
        System.out.println(userDao);
    }
}
```

### 普通的配置类

```java
package lsieun.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@ComponentScan(basePackages = "lsieun")
@Import(OtherConfig.class) // A. 这里使用了 @Import 注解
public class SpringConfig {
}
```

```java
package lsieun.config;

import lsieun.dao.UserDao;
import lsieun.dao.impl.UserDaoImpl;
import org.springframework.context.annotation.Bean;

public class OtherConfig {
    @Bean
    public UserDao userDao() {
        return new UserDaoImpl();
    }
}
```

### ImportSelector

```java
package lsieun.config;

import lsieun.imports.MyImportSelector;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@ComponentScan(basePackages = "lsieun")
@Import(MyImportSelector.class) // A. 注意这里使用 @Import
public class SpringConfig {
}
```

```java
package lsieun.imports;

import lsieun.dao.impl.UserDaoImpl;
import org.springframework.context.annotation.ImportSelector;
import org.springframework.core.type.AnnotationMetadata;

public class MyImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        // 返回的数组封装是需要被注册到 Spring 容器中的 Bean 的全限定名
        return new String[]{
                UserDaoImpl.class.getName()
        };
    }
}
```

```java
package lsieun.imports;

import lsieun.dao.impl.UserDaoImpl;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.ImportSelector;
import org.springframework.core.type.AnnotationMetadata;

import java.util.Arrays;
import java.util.Map;

public class MyImportSelector implements ImportSelector {
    @Override
    public String[] selectImports(AnnotationMetadata importingClassMetadata) {
        Map<String, Object> annotationAttributes = importingClassMetadata.getAnnotationAttributes(ComponentScan.class.getName());
        String[] basePackages = (String[])annotationAttributes.get("basePackages");
        System.out.println("basePackages = " + Arrays.toString(basePackages));

        // 返回的数组封装是需要被注册到 Spring 容器中的 Bean 的全限定名
        return new String[]{
                UserDaoImpl.class.getName()
        };
    }
}
```


### ImportBeanDefinitionRegistrar

```java
package lsieun.imports;

import lsieun.dao.impl.UserDaoImpl;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanNameGenerator;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.annotation.ImportBeanDefinitionRegistrar;
import org.springframework.core.type.AnnotationMetadata;

public class MyImportBeanDefinitionRegistrar implements ImportBeanDefinitionRegistrar {
    @Override
    public void registerBeanDefinitions(
            AnnotationMetadata importingClassMetadata,
            BeanDefinitionRegistry registry,
            BeanNameGenerator importBeanNameGenerator) {
        // 注册 BeanDefinition
        BeanDefinition beanDefinition = new RootBeanDefinition();
        beanDefinition.setBeanClassName(UserDaoImpl.class.getName());
        registry.registerBeanDefinition("userDao", beanDefinition);
    }
}
```

第一种方式，直接使用 `@Import(MyImportBeanDefinitionRegistrar.class)`：

```java
package lsieun.config;

import lsieun.imports.MyImportBeanDefinitionRegistrar;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@ComponentScan(basePackages = "lsieun")
@Import(MyImportBeanDefinitionRegistrar.class) // A. 注意这里
public class SpringConfig {
}
```

第二种方式，添加一个自定义注解 `@MyUserDaoScan`：

```java
package lsieun.config;

import lsieun.imports.MyUserDaoScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = "lsieun")
@MyUserDaoScan    // A. 注意这里
public class SpringConfig {
}
```

```java
package lsieun.imports;

import org.springframework.context.annotation.Import;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Import(MyImportBeanDefinitionRegistrar.class)
public @interface MyUserDaoScan {
}
```

