---
title: "Using Interceptors With RestTemplate"
sequence: "111"
---

We can use an interceptor to encode the URI variables.

Let's create a class that implements the `ClientHttpRequestInterceptor` interface:

```java
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.support.HttpRequestWrapper;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;

public class UriEncodingInterceptor implements ClientHttpRequestInterceptor {
    @Override
    public ClientHttpResponse intercept(
            HttpRequest request,
            byte[] body,
            ClientHttpRequestExecution execution
    ) throws IOException {
        HttpRequest encodedRequest = new HttpRequestWrapper(request) {
            @Override
            public URI getURI() {
                URI uri = super.getURI();
                String escapedQuery = uri.getRawQuery().replace("+", "%2B");
                return UriComponentsBuilder.fromUri(uri)
                        .replaceQuery(escapedQuery)
                        .build(true).toUri();
            }
        };
        return execution.execute(encodedRequest, body);
    }
}
```

We've implemented the `intercept()` method.
This method will be executed before the `RestTemplate` makes each request.

Let's break down the code:

- We created a new `HttpRequest` object that wraps the original request.
- For this wrapper, we override the `getURI()` method to encode the URI variables.
  In this case, we replace **the plus sign** with `%2B` in the query string.
- Using the `UriComponentsBuilder`, we create a new URI and replace the query string with the encoded query string.
- We return the encoded request from the `intercept()` method that will replace the original request.

## Adding the Interceptor

Next, we need to add the interceptor to the `RestTemplate` bean:

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setInterceptors(Collections.singletonList(new UriEncodingInterceptor()));
        return restTemplate;
    }
}
```

**[Interceptors](https://www.baeldung.com/spring-rest-template-interceptor)
provide the flexibility to change any parts of the requests we want.**
They can be beneficial for complex scenarios like adding extra headers or performing changes to the fields in the request.

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
        String url = "http://192.168.80.130/get?parameter=spring+boot";
        ResponseEntity<String> entity = restTemplate.getForEntity(url, String.class);
        return entity.getBody();
    }
}
```

## Reference

- [Encoding of URI Variables on RestTemplate](https://www.baeldung.com/spring-resttemplate-uri-variables-encode)
- [Using the Spring RestTemplate Interceptor](https://www.baeldung.com/spring-rest-template-interceptor)
