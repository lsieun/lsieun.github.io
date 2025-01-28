---
title: "@DataJpaTest"
sequence: "annotation-data-jpa-test"
---

在 Spring Boot 应用程序中使用 `@DataJpaTest` 注释对测试类进行注释时，系统将自动配置一些必要的类以进行 JPA 相关的测试。
更具体地说，`@DataJpaTest` 注释会初始化以下类：

- `EntityManager`，用于创建、更新和删除实体。
- `TestEntityManager`，用于创建、更新和删除实体，但它更适合测试。
- `JdbcTemplate`，用于执行 SQL 查询与更新。
- Spring Data JPA 相关配置和组件。

另外，`@DataJpaTest` 还可以用于测试仅一部分代码，例如仅测试 Repository 层的代码。这是通过配置 `@DataJpaTest` 上的 `excludeFilters` 和/或 `includeFilters` 来实现的。例如，下面的代码将排除名为 `SomeService` 的组件：

```
@DataJpaTest(excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = SomeService.class))
```

请注意，与测试相关的其他组件，如测试应用程序上下文是如何配置的，取决于测试类和测试数据访问代码的具体需求。在某些情况下，您可能需要添加其他注释或模拟配置以使测试环境正确配置。

## 如何工作

在 Spring Boot 应用程序中使用 `@DataJpaTest` 注释时，系统会将测试应用程序上下文限制为与 JPA 相关的组件，从而提供了一种轻量级的测试数据访问方法。更具体地说，`@DataJpaTest` 注释会自动执行以下操作：

1. 配置并启动一个嵌入式的 H2 数据库（如果类路径上有 H2，否则使用其他可用的内存型数据库）。

2. 自动配置和调用 `DataSource`、`EntityManagerFactory` 和 `EntityManager`。

3. 扫描 `@Entity` 和 `@Embeddable` 注释注释的类，并将它们纳入 Hibernate 的映射元数据中。

4. 自动配置 Spring Data JPA 相关组件（例如，`JpaRepository`、`JpaSpecificationExecutor` 等）。

5. 通过使用 `@Autowired` 或 `@Inject`，在测试中注入 Spring Data JPA Repository。

上述操作仅适用于 JPA 测试，而不是整个应用程序。这使得 JPA 测试非常快速和轻量级，并且更容易集成到持续集成和开发流程中。

需要注意的是，`@DataJpaTest` 只适用于 JPA 相关的组件。如果您测试的是更广泛的组件，比如测试 Spring MVC 控制器，则可以使用 `@SpringBootTest` 注释来加载完整的应用程序上下文。

## 遇到问题

Failed to replace DataSource with an embedded database for tests
错误提示：

> Caused by: java.lang.IllegalStateException: Failed to replace DataSource with an embedded database for tests.
> If you want an embedded database please put a supported one on the classpath or
> tune the replace attribute of @AutoConfigureTestDatabase.

这个错误大意是说：当前测试需要一个内存数据库作为 DataSource 但是没找见，如果你真想使用内存数据库，请指定一个正确的路径或者修改下最后那个注解的属性。

原因：在我的测试代码中，用了 `@DataJpaTest` 注解，一旦使用这个注解，系统会默认配置内存数据库作为 DataSource，
而我实际配置的是 MySQL，所以测试一直报错说找不到内存数据库。使用注解 `@AutoConfigureTestDatabase(replace = NONE)` 就能取消这个默认。

解决：

```text
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
```

