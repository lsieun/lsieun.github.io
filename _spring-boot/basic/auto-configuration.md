---
title: "Auto-Configuration"
sequence: "104"
---

**Auto-configuration** is one of the important features in Spring Boot
because it configures your Spring Boot application
according to your classpath, annotations, and any other configuration declarations, such as JavaConfig classes or XML.

```java
package org.springframework.boot.autoconfigure;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@AutoConfigurationPackage
@Import(AutoConfigurationImportSelector.class)
public @interface EnableAutoConfiguration {

	/**
	 * Environment property that can be used to override when auto-configuration is
	 * enabled.
	 */
	String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

	/**
	 * Exclude specific auto-configuration classes such that they will never be applied.
	 * @return the classes to exclude
	 */
	Class<?>[] exclude() default {};

	/**
	 * Exclude specific auto-configuration class names such that they will never be
	 * applied.
	 * @return the class names to exclude
	 * @since 1.3.0
	 */
	String[] excludeName() default {};

}
```

## disable a specific auto-configuration

The `@SpringBootApplication` annotation is one of the main components of a Spring Boot app.
This annotation is equivalent to declaring the `@Configuration`, `@ComponentScan`,
and `@EnableAutoConfiguration` annotations.

Why am I mentioning this? Because you can disable a specific auto-configuration by
adding the `exclude` parameter by using either the `@EnableAutoConfiguration` or the  
`@SpringBootApplication` annotations in your class.

```java
package org.springframework.boot.autoconfigure;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = { @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
		@Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {
    // ...
}
```

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class WebApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebApplication.class, args);
    }
}
```

Why is `@EnableAutoConfiguration` annotation not used?
Remember that the `@SpringBootApplication` annotation inherits `@EnableAutoConfiguration`, 
`@Configuration`, and `@ComponentScan`, so that's why you can use the `exclude` parameter
within the `@SpringBootApplication` annotation.
