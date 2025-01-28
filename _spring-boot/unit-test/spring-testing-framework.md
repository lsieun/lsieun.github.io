---
title: "Spring Testing Framework"
sequence: "101"
---

The Spring Framework has several testing packages
that help create **unit** and **integration testing** for applications.
It offers unit testing by providing several mock objects
(`Environment`, `PropertySource`, `JNDI`, `Servlet`; Reactive: `ServerHttpRequest` and `ServerHttpResponse` test utilities)
that help test your code in isolation.

## integration testing

One of the most commonly used testing features of the Spring Framework is **integration testing**.
Its primary's goals are

- managing the Spring IoC container caching between test execution
- transaction management
- dependency injection of test fixture instances
- Spring-specific base classes

## ApplicationContext

The Spring Framework provides an easy way to do testing by integrating the `ApplicationContext` in the tests.
The Spring testing module offers several ways to use the `ApplicationContext`, programmatically and through annotations:

- `@BootstrapWith`. A class-level annotation to configure how the Spring `TestContext` Framework is bootstrapped.

```java
package org.springframework.test.context;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface BootstrapWith {
	Class<? extends TestContextBootstrapper> value() default TestContextBootstrapper.class;
}
```

```text
package org.springframework.test.context;

public interface TestContext extends AttributeAccessor, Serializable {
}
```

- `@ContextConfiguration`. Defines class-level metadata to determine
  how to load and configure an `ApplicationContext` for integration tests.
  This is a must-have annotation for your classes,
  because that's where the `ApplicationContext` loads all your bean definitions.

```java
package org.springframework.test.context;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface ContextConfiguration {
    // ...
}
```

- `@WebAppConfiguration`. A class-level annotation to declare that
  the `ApplicationContext` loads for an integration test should be a `WebApplicationContext`.

```java
package org.springframework.web.context;

public interface WebApplicationContext extends ApplicationContext {
    //
}
```

- `@ActiveProfile`. A class-level annotation to declare which bean definition profile(s) should be active
  when loading an `ApplicationContext` for an integration test.

- `@TestPropertySource`. A class-level annotation to configure
  the locations of properties files and inline properties to be
  added to the set of `PropertySources` in the `Environment` for an
  `ApplicationContext` loaded for an integration test.

- `@DirtiesContext`. Indicates that the underlying Spring
  `ApplicationContext` has been dirtied during the execution of a
  test (modified or corrupted for example, by changing the state of a
  singleton bean) and should be closed.

There a lot more (`@TestExecutionListeners`, `@Commit`, `@Rollback`, `@BeforeTransaction`, `@AfterTransaction`,
`@Sql`, `@SqlGroup`, `@SqlConfig`, `@Timed`, `@Repeat`, `@IfProfileValue`, and so forth).

As you can see, there are a lot of choices when you test with the Spring Framework.
Normally, you always use the `@RunWith` annotation that wires up all the test framework goodies.

```java
@RunWith(SpringRunner.class)
@ContextConfiguration({"/app-config.xml", "/test-data-access-config.xml"})
@ActiveProfiles("dev")
@Transactional
public class ToDoRepositoryTests {
    @Test
    public void ToDoPersistenceTest(){
        // ...
    }
}
```

