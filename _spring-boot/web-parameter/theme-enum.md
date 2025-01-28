---
title: "Request Parameter As Enum"
sequence: "131"
---

## 示例

### pom.xml

```xml
<dependencies>
    <!-- starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <!-- web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- devtools -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
    </dependency>

    <!-- test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

</dependencies>
```

### Application

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class WebParameterApplication {
    public static void main(String[] args) {
        SpringApplication.run(WebParameterApplication.class, args);
    }
}
```

### Enumeration

```java
import java.text.MessageFormat;
import java.util.Arrays;

public enum TemporalGranularity {
    DAILY("daily"),
    MONTHLY("monthly"),
    QUARTERLY("quarterly"),
    YEARLY("yearly");

    public final String value;

    TemporalGranularity(String value) {
        this.value = value;
    }

    public static TemporalGranularity fromValue(String value) {
        for (TemporalGranularity category : values()) {
            if (category.value.equalsIgnoreCase(value)) {
                return category;
            }
        }

        String message = MessageFormat.format(
                "Unknown enum type {0}, Allowed values are {1}",
                value,
                Arrays.toString(values())
        );
        throw new IllegalArgumentException(message);
    }
}
```

### Controller

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping("/{granularity}")
    public String get(@PathVariable(value = "granularity") TemporalGranularity granularity) {
        return "时间粒度: " + granularity.value;
    }

}
```

## 第一种方式

- StringToEnumConverterFactory

Spring can try to convert a `String` object to an `Enum` object by using the `StringToEnumConverterFactory` class.

The back-end conversion uses the `Enum.valueOf` method.
**Therefore, the input name string must exactly match one of the declared enum values.**

### Test

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class HelloControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    void testGet() throws Exception {
        String[] pathArray = {
                "/hello/DAILY",
                "/hello/MONTHLY",
                "/hello/QUARTERLY",
                "/hello/YEARLY"
        };

        for (String path : pathArray) {
            System.out.println(path);
            MvcResult mvcResult = mvc.perform(get(path)).andReturn();
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);
            System.out.println(content);
        }
    }
}
```

When we make a web request with a string value that doesn't match one of our enum values,
Spring will fail to convert it to the specified enum type.
In this case, we'll get a `ConversionFailedException`.

```text
String[] pathArray = {
    "/hello/abc"
};
```

```text
2022-11-27 14:16:20.186  WARN 14308 --- [           main] .w.s.m.s.DefaultHandlerExceptionResolver :
 Resolved [org.springframework.web.method.annotation.MethodArgumentTypeMismatchException:
  Failed to convert value of type 'java.lang.String' to required type 'lsieun.springboot.common.TemporalGranularity';
   nested exception is org.springframework.core.convert.ConversionFailedException: // 这里是ConversionFailedException
    Failed to convert from type [java.lang.String] to type
     [@org.springframework.web.bind.annotation.PathVariable lsieun.springboot.common.TemporalGranularity] for value 'abc';
      nested exception is java.lang.IllegalArgumentException: No enum constant lsieun.springboot.common.TemporalGranularity.abc]
```

## 第二种方式

In Java, it's considered good practice to define enum values with uppercase letters, as they are constants.
However, we may want to support **lowercase letters** in the request URL.

### Converter

```java
import org.springframework.core.convert.converter.Converter;

public class StringToEnumConverter implements Converter<String, TemporalGranularity> {
    @Override
    public TemporalGranularity convert(String source) {
        return TemporalGranularity.valueOf(source.toUpperCase());
    }
}
```

### Config

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(new StringToEnumConverter());
    }

}
```

### Test

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class HelloControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    void testGet() throws Exception {
        String[] pathArray = {
                "/hello/daily",
                "/hello/monthly",
                "/hello/quarterly",
                "/hello/yearly"
        };

        for (String path : pathArray) {
            System.out.println(path);
            MvcResult mvcResult = mvc.perform(get(path)).andReturn();
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);
            System.out.println(content);
        }
    }
}
```

### Exception Handling

The `Enum.valueOf` method in the `StringToEnumConverter` will throw an `IllegalArgumentException`
if our `TemporalGranularity` enum doesn't have a matched constant.
We can handle this exception in our custom converter in different ways, depending on our requirements.

For example, we can simply have our converter return `null` for non-matching `Strings`:

```java
import org.springframework.core.convert.converter.Converter;

public class StringToEnumConverter implements Converter<String, TemporalGranularity> {
    @Override
    public TemporalGranularity convert(String source) {
        try {
            return TemporalGranularity.valueOf(source.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }
}
```

However, if we don't handle the exception locally in the custom converter,
Spring will throw a `ConversionFailedException` exception to the calling controller method.
There are [several ways to handle this exception](https://www.baeldung.com/exception-handling-for-rest-with-spring).

For example, we can use a global exception handler class:

```java
@ControllerAdvice
public class GlobalControllerExceptionHandler {
    @ExceptionHandler(ConversionFailedException.class)
    public ResponseEntity<String> handleConflict(RuntimeException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
```

## 第三种方式

### PropertyEditorSupport

```java
import lsieun.springboot.common.TemporalGranularity;

import java.beans.PropertyEditorSupport;

public class TemporalGranularityConverter extends PropertyEditorSupport {
    @Override
    public void setAsText(String text) throws IllegalArgumentException {
        setValue(TemporalGranularity.fromValue(text));
    }
}
```

### Controller

```java
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping("/{granularity}")
    public String get(@PathVariable(value = "granularity") TemporalGranularity granularity) {
        return "时间粒度: " + granularity.value;
    }

    @InitBinder
    public void initBinder(final WebDataBinder webdataBinder) {
        webdataBinder.registerCustomEditor(TemporalGranularity.class, new TemporalGranularityConverter());
    }

}
```

### Test

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class HelloControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    void testGet() throws Exception {
        String[] pathArray = {
                "/hello/daily",
                "/hello/monthly",
                "/hello/quarterly",
                "/hello/yearly"
        };

        for (String path : pathArray) {
            System.out.println(path);
            MvcResult mvcResult = mvc.perform(get(path)).andReturn();
            String content = mvcResult.getResponse().getContentAsString(StandardCharsets.UTF_8);
            System.out.println(content);
        }
    }
}
```

## 如何将String转换成Enum

### @InitBinder

Spring provides `@InitBinder` annotation that identifies methods
which initializes the `WebDataBinder` and this `WebDataBinder` populates the arguments to the annotated methods.

## 参考

- [Enums as Request Parameters in Spring Boot Rest](https://www.devglan.com/spring-boot/enums-as-request-parameters-in-spring-boot-rest)
- [Using Enums as Request Parameters in Spring](https://www.baeldung.com/spring-enum-request-param)
- [Spring Boot: How to ignore case when using an Enum as a Request parameter](https://vianneyfaivre.com/tech/spring-boot-enum-as-parameter-ignore-case)
