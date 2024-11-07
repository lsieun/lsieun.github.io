---
title: "Basic Annotations"
sequence: "102"
---

[UP](/junit.html)


- The method with the `@BeforeAll` annotation needs to be `static`, otherwise the code won't compile.
- The method with `@AfterAll` also needs to be a `static` method.

```java
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.*;

@Slf4j
public class BasicAnnotationJunitTest {
    @BeforeAll
    static void setup() {
        log.info("@BeforeAll - executes once before all test methods in this class");
    }

    @BeforeEach
    void init() {
        log.info("@BeforeEach - executes before each test method in this class");
    }

    @DisplayName("Single test successful")
    @Test
    void testSingleSuccessTest() {
        log.info("Success");
    }

    @Test
    void testHelloTest() {
        log.info("Hello");
    }

    @Test
    @Disabled("Not implemented yet")
    void testShowSomething() {
    }

    @AfterEach
    void tearDown() {
        log.info("@AfterEach - executed after each test method.");
    }

    @AfterAll
    static void done() {
        log.info("@AfterAll - executed after all test methods.");
    }
}
```
