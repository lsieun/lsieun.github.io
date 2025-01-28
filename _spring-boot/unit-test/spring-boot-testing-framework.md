---
title: "Spring Boot Testing Framework"
sequence: "102"
---

If you want to start using all the testing features by Spring Boot,
you only need to add the `spring-boot-starter-test` dependency with `scope test` to your application.

```text
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```

The `spring-boot-starter-test` dependency provides several test frameworks that
play along very well with all the Spring Boot testing features:
**JUnit**, **AssertJ**, **Hamcrest**, **Mockito**, **JSONassert**, and **JsonPath**.
Of course, there are other test frameworks that play very nicely with the Spring Boot Test module;
**you only need to include those dependencies manually**.

```text
                            ┌─── spring-test ──────────────────────┼─── spring-core
                            │
                            ├─── spring-boot-test ─────────────────┼─── spring-boot
                            │
                            ├─── spring-boot-test-autoconfigure
                            │
                            ├─── json-path
                            │
                            ├─── assertj-core
                            │
spring-boot-starter-test ───┼─── hamcrest
                            │
                            ├─── junit-jupiter
                            │
                            ├─── mockito-core
                            │
                            ├─── mockito-junit-jupiter
                            │
                            ├─── jsonassert
                            │
                            └─── xmlunit-core
```

Spring Boot provides the `@SpringBootTest` annotation that simplifies the way you can test Spring apps.
Normally, with Spring testing, you are required to add
several annotations to test a particular feature or functionality of your app,
but not in Spring Boot - although you are still required to use the `@RunWith(SpringRunner.class)` annotation to do your testing;
if you do not, any new Spring Boot test annotation will be ignored.
The `@SpringBootTest` has parameters that are useful when testing a web app,
such as defining a `RANDOM_PORT` or `DEFINED_PORT`.

## @SpringBootTest vs. @DataJpaTest

In the previous technique, we've used the `@DataJpaTest` annotation instead of the `@SpringBootTest`.
The `@SpringBootTest` annotation is useful when you need to bootstrap the entire Spring IoC container.
Thus, this annotation creates the `ApplicationContext` that is used in the tests.

However, at times loading the complete container is overkill.
For instance, when you test the DAO layer,
you are only interested to load the related beans - not the entire ApplicationContext.
To achieve this, Spring Boot provides several annotations to slice the testing into different layers and
tests only the layer you are interested in.
For instance, the `@DataJpaTest` annotation is provided to test only the JPA components.
Similarly, the `@WebMvcTest` focuses only on the Spring MVC components.
It is recommended that you use these feature-specific annotations wherever applicable.
You can find more information about feature-specific testing at http://mng.bz/laK8. 
