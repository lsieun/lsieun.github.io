---
title: "单元测试的顺序"
sequence: "101"
---

[UP](/junit.html)

在 JUnit 5 中，我们可以使用 `@TestMethodOrder` 注解来控制单元测试的执行顺序。

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface TestMethodOrder {
    Class<? extends MethodOrderer> value();
}
```

`MethodOrderer` 有几个实现的子类：

```java
public interface MethodOrderer {
    @Deprecated
    class Alphanumeric extends MethodName { }

    class MethodName implements MethodOrderer {}

    class DisplayName implements MethodOrderer {}

    class OrderAnnotation implements MethodOrderer {}

    class Random implements MethodOrderer {}
}
```

## 方法名排序

```java
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.assertEquals;

@TestMethodOrder(MethodOrderer.MethodName.class)
public class MethodNameOrderUnitTest {
    private static final StringBuilder output = new StringBuilder();
    
    @Test
    void myCTest() {
        output.append("C");
    }
    
    @Test
    void myBTest() {
        output.append("B");        
    }
    
    @Test
    void myATest() {
        output.append("A");
    }
 
    @AfterAll
    public static void assertOutput() {
        assertEquals("ABC", output.toString());
    }
}
```

## 显示名排序

```java
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

@TestMethodOrder(MethodOrderer.DisplayName.class)
public class DisplayNameOrderUnitTest {
    private static final StringBuilder output = new StringBuilder();
    
    @Test
    @DisplayName("m3")
    void myCTest() {
        output.append("C");
    }


    @Test
    @DisplayName("m1")
    void myBTest() {
        output.append("B");        
    }
    
    @Test
    @DisplayName("m2")
    void myATest() {
        output.append("A");
    }
 
    @AfterAll
    public static void assertOutput() {
        assertEquals("BAC", output.toString());
    }
}
```

## 使用 @Order 注解顺序

```java
import org.junit.jupiter.api.*;

import static org.junit.jupiter.api.Assertions.assertEquals;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class OrderAnnotationUnitTest {
    private static final StringBuilder output = new StringBuilder("");

    @Test
    @Order(3)
    void firstTest() {
        output.append("a");
    }

    @Test
    @Order(2)
    void secondTest() {
        output.append("b");
    }

    @Test
    @Order(1)
    void thirdTest() {
        output.append("c");
    }

    @AfterAll
    public static void assertOutput() {
        assertEquals("cba", output.toString());
    }
}
```

## 使用随机顺序

```java
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import static org.junit.jupiter.api.Assertions.assertNotEquals;

@TestMethodOrder(MethodOrderer.Random.class)
public class RandomOrderUnitTest {

    private static final StringBuilder output = new StringBuilder();

    @Test
    void myATest() {
        output.append("A");
    }

    @Test
    void myBTest() {
        output.append("B");
    }

    @Test
    void myCTest() {
        output.append("C");
    }

    @AfterAll
    public static void assertOutput() {
        assertNotEquals("ABC", output.toString());
    }

}
```

## Reference

- [The Order of Tests in JUnit](https://www.baeldung.com/junit-5-test-order)

