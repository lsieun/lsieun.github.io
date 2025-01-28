---
title: "@Component 和 @Bean 的区别"
sequence: "101"
---

第一，应用目标不同：

- `@Component`，应用在类（Class）上，是一个通用注解，应用任何类上。Spring 会自动创建该类的实例，并注入到 Spring IOC 容器中。
- `@Bean`，应用在对象（Instance）上，在配置类中声明一个 Bean 的，它通常用在一个方法上，表示把这个方法的返回对象注册的 Spring IOC 容器中。

通过 `@Bean` 注解，我们可以自定义 Bean 的创建和初始化过程，包括指定 Bean 的名称、作用域、依赖关系等。

第一，用途不同：

- `@Component` 用于标识一个普通类
- `@Bean` 是在配置类中声明和配置 Bean 对象

第二，使用方式不同：

- `@Component` 是一个类级别的注解，Spring 通过 `@ComponentScan` 注解扫描并注册为 Bean
- `@Bean` 通过方法级别的注解使用，在配置类中手动声明和配置 Bean

```java
package org.springframework.stereotype;

@Target(ElementType.TYPE)    // 注意：应用于 TYPE
@Retention(RetentionPolicy.RUNTIME)
public @interface Component {
	String value() default "";

}
```

```java
package org.springframework.context.annotation;

@Target({ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Bean {
    //
}
```

第三，控制权不同：

- `@Component` 注解修饰的类是由 Spring 框架来创建和初始化的
- `@Bean` 注解允许开发人员手动控制 Bean 的创建和配置过程
