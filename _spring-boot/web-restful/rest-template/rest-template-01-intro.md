---
title: "RestTemplate 01"
sequence: "101"
---

## Use GET to Retrieve Resources

这里涉及到三个方法：

- `getForEntity`：有 header 和 body 两部分
- `getForObject`：只关注 body 部分
- `headForHeaders`： 只关注 header 部分

### Get Plain JSON

```java
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class Main {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/users";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        System.out.println(response.getBody());
    }
}
```

```text
08:43:13.833 [main] DEBUG org.springframework.web.client.RestTemplate - HTTP GET http://localhost:8080/users
08:43:13.842 [main] DEBUG org.springframework.web.client.RestTemplate - Accept=[text/plain, application/json, application/*+json, */*]
08:43:13.855 [main] DEBUG org.springframework.web.client.RestTemplate - Response 200 OK
08:43:13.856 [main] DEBUG org.springframework.web.client.RestTemplate - Reading to [java.lang.String] as "application/json"
[{"id":1,"name":"Tom"},{"id":2,"name":"Jerry"},{"id":3,"name":"张三"},{"id":4,"name":"Lily"}]
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class Main {
    public static void main(String[] args) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/hello/get";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        String body = response.getBody();
        System.out.println(body);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(body);
        JsonNode name = root.path("name");
        String text = name.asText();
        System.out.println(text);
    }
}
```

```text
思考：第二个示例，应该是一个过渡，将字符串转换成 JsonNode 对象，下一步，再转换成一个真正的 POJO 对象
```

### Retrieving POJO Instead of JSON

```java
import lsieun.springboot.rest.client.entity.Foo;
import org.springframework.web.client.RestTemplate;

public class Main {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/hello/get";
        Foo foo = restTemplate.getForObject(url, Foo.class);
        int id = foo.getId();
        String name = foo.getName();

        System.out.println(id);
        System.out.println(name);
    }
}
```

## Use HEAD to Retrieve Headers

这里使用 `HEAD` 方法：

```java
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;

public class Main {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/users";
        HttpHeaders headers = restTemplate.headForHeaders(url);
        System.out.println(headers);
    }
}
```

```text
20:42:17.256 [main] DEBUG org.springframework.web.client.RestTemplate - HTTP HEAD http://localhost:8080/users
20:42:17.365 [main] DEBUG org.springframework.web.client.RestTemplate - Response 200 OK
[Content-Type:"application/json", Content-Length:"27", Date:"Fri, 06 Jan 2023 12:42:17 GMT", Keep-Alive:"timeout=60", Connection:"keep-alive"]
```

## Use POST to Create a Resource

In order to create a new Resource in the API,
we can make good use of the `postForLocation()`, `postForObject()` or `postForEntity()` APIs.

- `postForLocation()` returns the URI of the newly created Resource
- `postForObject()` returns the Resource itself.

### The postForObject() API

```java
import lsieun.springboot.rest.client.entity.User;
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestTemplate;

public class Main {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/users";

        User user = new User();
        user.setName("李小明");
        HttpEntity<User> request = new HttpEntity<>(user);
        User user2 = restTemplate.postForObject(url, request, User.class);

        System.out.println(user2);
    }
}
```

```text
20:45:14.374 [main] DEBUG org.springframework.web.client.RestTemplate - HTTP POST http://localhost:8080/users
20:45:14.410 [main] DEBUG org.springframework.web.client.RestTemplate - Accept=[application/json, application/*+json]
20:45:14.425 [main] DEBUG org.springframework.web.client.RestTemplate - Writing [User{ id= null, name = '李小明' }] with org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
20:45:14.441 [main] DEBUG org.springframework.web.client.RestTemplate - Response 201 CREATED
20:45:14.443 [main] DEBUG org.springframework.web.client.RestTemplate - Reading to [lsieun.springboot.rest.client.entity.User]
User{ id= 6, name = '李小明' }
```

### The postForLocation() API

Similarly, let's have a look at the operation that instead of returning the full Resource,
just returns the Location of that newly created Resource:

```java
import org.springframework.http.HttpEntity;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

public class Main {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/users";

        User user = new User();
        user.setName("李小明");
        HttpEntity<User> request = new HttpEntity<>(user);
        URI location = restTemplate.postForLocation(url, request, User.class);
        System.out.println(location);
    }
}
```

```text
20:46:35.927 [main] DEBUG org.springframework.web.client.RestTemplate - HTTP POST http://localhost:8080/users
20:46:35.956 [main] DEBUG org.springframework.web.client.RestTemplate - Writing [User{ id= null, name = '李小明' }] with org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
20:46:35.975 [main] DEBUG org.springframework.web.client.RestTemplate - Response 201 CREATED
http://localhost:8080/users/7
```

### The exchange() API

Let's have a look at how to do a POST with the more generic exchange API:

```java
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class Main {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/users";

        User user = new User();
        user.setName("李小明");
        HttpEntity<User> request = new HttpEntity<>(user);
        ResponseEntity<User> response = restTemplate.exchange(url, HttpMethod.POST, request, User.class);

        HttpStatus statusCode = response.getStatusCode();
        User body = response.getBody();
        System.out.println(statusCode);
        System.out.println(body);
    }
}
```

```text
20:48:32.021 [main] DEBUG org.springframework.web.client.RestTemplate - HTTP POST http://localhost:8080/users
20:48:32.061 [main] DEBUG org.springframework.web.client.RestTemplate - Accept=[application/json, application/*+json]
20:48:32.076 [main] DEBUG org.springframework.web.client.RestTemplate - Writing [User{ id= null, name = '李小明' }] with org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
20:48:32.091 [main] DEBUG org.springframework.web.client.RestTemplate - Response 201 CREATED
20:48:32.093 [main] DEBUG org.springframework.web.client.RestTemplate - Reading to [lsieun.springboot.rest.client.entity.User]
201 CREATED
User{ id= 8, name = '李小明' }
```

### Submit Form Data

Next, let's look at how to submit a form using the POST method.

First, we need to set the `Content-Type` header to `application/x-www-form-urlencoded`.

This makes sure that a large query string can be sent to the server, containing name/value pairs separated by `&`:

Next, we build the Request using an `HttpEntity` instance:

```java
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

public class Main {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/users";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("id", "1");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url + "/form", request, String.class);
        String body = response.getBody();
        HttpStatus statusCode = response.getStatusCode();
        System.out.println(body);
        System.out.println(statusCode);
    }
}
```

```text
21:00:01.886 [main] DEBUG org.springframework.web.client.RestTemplate - HTTP POST http://localhost:8080/users/form
21:00:01.894 [main] DEBUG org.springframework.web.client.RestTemplate - Accept=[text/plain, application/json, application/*+json, */*]
21:00:01.899 [main] DEBUG org.springframework.web.client.RestTemplate - Writing [{id=[1]}] as "application/x-www-form-urlencoded"
21:00:01.909 [main] DEBUG org.springframework.web.client.RestTemplate - Response 201 CREATED
21:00:01.910 [main] DEBUG org.springframework.web.client.RestTemplate - Reading to [java.lang.String] as "text/plain;charset=UTF-8"
1
201 CREATED
```

## Use OPTIONS to Get Allowed Operations

Next, we're going to have a quick look at using an `OPTIONS` request and
exploring the allowed operations on a specific URI using this kind of request;
the API is `optionsForAllow`:

```java
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/users";

        Set<HttpMethod> optionsForAllow = restTemplate.optionsForAllow(url);

        System.out.println(optionsForAllow);

        HttpMethod[] supportedMethods = {HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT, HttpMethod.DELETE};
        boolean flag = optionsForAllow.containsAll(Arrays.asList(supportedMethods));

        System.out.println(flag);
    }
}
```

```text
21:03:37.393 [main] DEBUG org.springframework.web.client.RestTemplate - HTTP OPTIONS http://localhost:8080/users
21:03:37.406 [main] DEBUG org.springframework.web.client.RestTemplate - Response 200 OK
[GET, HEAD, POST, OPTIONS]
false
```

## Use PUT to Update a Resource

Next, we'll start looking at PUT and more specifically the `exchange()` API for this operation,
since the `template.put` API is pretty straightforward.

### Simple PUT With exchange()

We'll start with a simple PUT operation against the API — and keep in mind that
**the operation isn't returning a body back to the client**:

```java
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.client.RestTemplate;

public class Main {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/users";

        Integer id = 3;
        User user = new User(id, "张三");

        HttpHeaders headers = new HttpHeaders();
        HttpEntity<User> request = new HttpEntity<>(user, headers);
        restTemplate.exchange(url + "/" + id, HttpMethod.PUT, request, Void.class);
    }
}
```

```text
08:39:21.003 [main] DEBUG org.springframework.web.client.RestTemplate - HTTP PUT http://localhost:8080/users/3
08:39:21.021 [main] DEBUG org.springframework.web.client.RestTemplate - Accept=[application/json, application/*+json]
08:39:21.045 [main] DEBUG org.springframework.web.client.RestTemplate - Writing [User{ id= 3, name = '张三' }] with org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
08:39:21.091 [main] DEBUG org.springframework.web.client.RestTemplate - Response 200 OK
```

### PUT With exchange() and a Request Callback

Next, we're going to be using a request callback to issue a PUT.

Let's make sure we prepare the callback,
where we can set all the headers we need as well as a request body:

这个部分，我没有理解

## Use DELETE to Remove a Resource

```java
import org.springframework.web.client.RestTemplate;

public class RestDelete {
    public static void main(String[] args) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8080/users/{id}";

        restTemplate.delete(url, "1");
    }
}
```

```text
09:33:56.814 [main] DEBUG org.springframework.web.client.RestTemplate - HTTP GET http://localhost:8080/users
09:33:56.832 [main] DEBUG org.springframework.web.client.RestTemplate - Accept=[application/json, application/*+json]
09:33:56.842 [main] DEBUG org.springframework.web.client.RestTemplate - Response 200 OK
09:33:56.847 [main] DEBUG org.springframework.web.client.RestTemplate - Reading to [java.util.List<?>]
{id=2, name=Jerry}
{id=4, name=Lily}
```

## Configure Timeout

```xml
<dependency>
    <groupId>org.apache.httpcomponents</groupId>
    <artifactId>httpclient</artifactId>
    <version>4.5.14</version>
</dependency>
```

```java
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

public class RestConfigTimeout {
    public static void main(String[] args) {
        ClientHttpRequestFactory clientHttpRequestFactory = getClientHttpRequestFactory();
        RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory);

        String url = "http://localhost:8080/users";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        System.out.println(response.getBody());
    }

    public static ClientHttpRequestFactory getClientHttpRequestFactory() {
        int timeout = 5000;
        HttpComponentsClientHttpRequestFactory clientHttpRequestFactory =
                new HttpComponentsClientHttpRequestFactory();
        clientHttpRequestFactory.setConnectTimeout(timeout);
        return clientHttpRequestFactory;
    }
}
```

And we can use HttpClient for further configuration options:

```java
import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

public class RestConfigTimeout {
    public static void main(String[] args) {
        ClientHttpRequestFactory clientHttpRequestFactory = getClientHttpRequestFactory();
        RestTemplate restTemplate = new RestTemplate(clientHttpRequestFactory);

        String url = "http://localhost:8080/users";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        System.out.println(response.getBody());
    }

    public static ClientHttpRequestFactory getClientHttpRequestFactory() {
        int timeout = 5000;
        RequestConfig config = RequestConfig.custom()
                .setConnectTimeout(timeout)
                .setConnectionRequestTimeout(timeout)
                .setSocketTimeout(timeout)
                .build();
        CloseableHttpClient client = HttpClientBuilder.create()
                .setDefaultRequestConfig(config)
                .build();
        return new HttpComponentsClientHttpRequestFactory(client);
    }
}
```

## Reference

- [Baeldung Tag: RestTemplate](https://www.baeldung.com/tag/resttemplate)
  - [The Guide to RestTemplate](https://www.baeldung.com/rest-template)
