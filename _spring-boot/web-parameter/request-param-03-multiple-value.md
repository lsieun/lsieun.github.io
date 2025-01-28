---
title: "@RequestParam：多个值"
sequence: "113"
---

## Mapping All Parameters

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping("/map")
    public String map(@RequestParam Map<String, String> allParams) {
        return allParams.toString();
    }
}
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class HelloControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    public void testGet() throws Exception {
        String path = "/hello/map?username=tomcat&password=123456&age=10";
        MvcResult mvcResult = mvc.perform(get(path)).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        System.out.println(content);
    }
}
```

## Mapping Multi-Value Parameter

### Array-String

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping("/array")
    public String array(@RequestParam String[] nameArray) {
        return Arrays.toString(nameArray);
    }
}
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class HelloControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    public void testGet() throws Exception {
        String path = "/hello/array?nameArray=tomcat,jerry,lucy,lily";
        MvcResult mvcResult = mvc.perform(get(path)).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        System.out.println(content);
    }
}
```

### Array-Long

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping("/array")
    public String array(@RequestParam Long[] idArray) {
        return Arrays.toString(idArray);
    }
}
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class HelloControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    public void testGet() throws Exception {
        String path = "/hello/array?idArray=123,456,789";
        MvcResult mvcResult = mvc.perform(get(path)).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        System.out.println(content);
    }
}
```

### List-String

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping("/array")
    public String array(@RequestParam List<String> nameList) {
        return nameList.toString();
    }
}
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class HelloControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    public void testGet() throws Exception {
        String path = "/hello/array?nameList=tomcat,jerry,lucy,lily";
        MvcResult mvcResult = mvc.perform(get(path)).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        System.out.println(content);
    }
}
```

### List-Long

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping("/array")
    public String array(@RequestParam List<String> idList) {
        return idList.toString();
    }
}
```

```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

@SpringBootTest
@AutoConfigureMockMvc
class HelloControllerTest {
    @Autowired
    private MockMvc mvc;

    @Test
    public void testGet() throws Exception {
        String path = "/hello/array?idList=123,456,789";
        MvcResult mvcResult = mvc.perform(get(path)).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        System.out.println(content);
    }
}
```

## Reference

- [Spring @RequestParam Annotation](https://www.baeldung.com/spring-request-param)
