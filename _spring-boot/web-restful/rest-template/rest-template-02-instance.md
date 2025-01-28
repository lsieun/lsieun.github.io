---
title: "RestTemplate Instance"
sequence: "102"
---

## 直接注入 RestTemplate

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @Autowired
    private RestTemplate restTemplate;    // 这里有问题 

    @GetMapping("/world")
    public String world() {
        System.out.println(restTemplate);
        return "Hello World";
    }
}
```

错误信息如下：

```text
***************************
APPLICATION FAILED TO START
***************************

Description:

Field restTemplate in lsieun.boot.controller.HelloController required a bean of type 'org.springframework.web.client.RestTemplate' that could not be found.

The injection point has the following annotations:
	- @org.springframework.beans.factory.annotation.Autowired(required=true)


Action:

Consider defining a bean of type 'org.springframework.web.client.RestTemplate' in your configuration.
```

## Configuration Using the Default RestTemplateBuilder

To configure a `RestTemplate` this way,
we need to inject the default `RestTemplateBuilder` bean provided by Spring Boot into our classes:

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/hello")
public class HelloController {

    private final RestTemplate restTemplate;

    @Autowired
    public HelloController(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    @GetMapping("/world")
    public String world() {
        System.out.println(restTemplate);
        return "Hello World";
    }
}
```

The `RestTemplate` bean created with this method has its scope limited to the class in which we build it.


## Configuration Using a RestTemplateCustomizer

With this approach, we can create **an application-wide, additive customization**.

This is a slightly more complicated approach.
For this we need to create a class that implements `RestTemplateCustomizer`, and define it as a bean:

```java
import org.springframework.boot.web.client.RestTemplateCustomizer;
import org.springframework.web.client.RestTemplate;

public class CustomRestTemplateCustomizer implements RestTemplateCustomizer {
    @Override
    public void customize(RestTemplate restTemplate) {
        restTemplate.getInterceptors().add(new CustomClientHttpRequestInterceptor());
    }
}
```

The `CustomClientHttpRequestInterceptor` interceptor is doing basic logging of the request:

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;

import java.io.IOException;

public class CustomClientHttpRequestInterceptor implements ClientHttpRequestInterceptor {
    private static final Logger LOGGER = LoggerFactory.getLogger(CustomClientHttpRequestInterceptor.class);

    @Override
    public ClientHttpResponse intercept(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution
    ) throws IOException {
        logRequestDetails(request);
        return execution.execute(request, body);
    }

    private void logRequestDetails(HttpRequest request) {
        LOGGER.info("Headers: {}", request.getHeaders());
        LOGGER.info("Request Method: {}", request.getMethod());
        LOGGER.info("Request URI: {}", request.getURI());
    }
}
```

Now, we define `CustomRestTemplateCustomizer` as a bean in a configuration class or
in our Spring Boot application class:

```java
import lsieun.springboot.rest.customizer.CustomRestTemplateCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RestTemplateConfig {
    @Bean
    public CustomRestTemplateCustomizer customRestTemplateCustomizer() {
        return new CustomRestTemplateCustomizer();
    }
}
```

**With this configuration,
every `RestTemplate` that we'll use in our application will have the custom interceptor set on it.**

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/hello")
public class HelloController {

    private final RestTemplate restTemplate;

    @Autowired
    public HelloController(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    @GetMapping("/world")
    public String world() {
        ResponseEntity<String> entity = restTemplate.getForEntity("http://192.168.80.130/get", String.class);
        return entity.getBody();
    }
}
```

```text
Headers: [Accept:"text/plain, application/json, application/*+json, */*", Content-Length:"0"]
Request Method: GET
Request URI: http://192.168.80.130/get
```

## Configuration by Creating Our Own RestTemplateBuilder

This is the most extreme approach to customizing a `RestTemplate`.
**It disables the default auto-configuration of `RestTemplateBuilder`, so we need to define it ourselves:**

```java
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;

@Configuration
public class RestTemplateConfig {
    @Bean
    @Qualifier("customRestTemplateCustomizer")
    public CustomRestTemplateCustomizer customRestTemplateCustomizer() {
        return new CustomRestTemplateCustomizer();
    }

    @Bean
    @DependsOn(value = {"customRestTemplateCustomizer"})
    public RestTemplateBuilder restTemplateBuilder() {
        return new RestTemplateBuilder(customRestTemplateCustomizer());
    }
}
```

After this, we can inject the custom builder into our classes like we'd do
with a default `RestTemplateBuilder` and create a `RestTemplate` as usual:

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/hello")
public class HelloController {

    private final RestTemplate restTemplate;

    @Autowired
    public HelloController(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    @GetMapping("/world")
    public String world() {
        ResponseEntity<String> entity = restTemplate.getForEntity("http://192.168.80.130/get", String.class);
        return entity.getBody();
    }
}
```

## 04

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
```

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/world")
    public String world() {
        ResponseEntity<String> entity = restTemplate.getForEntity("http://192.168.80.130/get", String.class);
        return entity.getBody();
    }
}
```
