---
title: "Java HttpClient: Simple"
sequence: "102"
---

## Simple GET

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class SimpleGet {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://192.168.80.130/get"))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println(body);
    }
}
```

```text
{
  "args": {}, 
  "headers": {
    "Connection": "Upgrade, HTTP2-Settings", 
    "Content-Length": "0", 
    "Host": "192.168.80.130", 
    "Http2-Settings": "AAEAAEAAAAIAAAABAAMAAABkAAQBAAAAAAUAAEAA", 
    "Upgrade": "h2c", 
    "User-Agent": "Java-http-client/17.0.3.1"
  }, 
  "origin": "192.168.80.1", 
  "url": "http://192.168.80.130/get"
}
```

## Setting HTTP Protocol Version

The API fully leverages the HTTP/2 protocol and uses it by default,
but we can define which version of the protocol we want to use:

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class SimpleGet {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://192.168.80.130/get"))
                .version(HttpClient.Version.HTTP_1_1)
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println(body);
    }
}
```

**Important to mention here is that the client will fall back to, e.g., HTTP/1.1 if HTTP/2 isn't supported.**

```text
{
  "args": {}, 
  "headers": {
    "Content-Length": "0", 
    "Host": "192.168.80.130", 
    "User-Agent": "Java-http-client/17.0.3.1"
  }, 
  "origin": "192.168.80.1", 
  "url": "http://192.168.80.130/get"
}
```

## Setting Headers

In case we want to add additional headers to our request, we can use the provided builder methods.

We can do that by either passing all headers as key-value pairs to the `headers()` method or
by using `header()` method for the single key-value header:

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class SimpleGet {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://192.168.80.130/get"))
                .version(HttpClient.Version.HTTP_1_1)
                .headers("key1", "value1", "key2", "value2")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println(body);
    }
}
```

```text
{
  "args": {}, 
  "headers": {
    "Content-Length": "0", 
    "Host": "192.168.80.130", 
    "Key1": "value1", 
    "Key2": "value2", 
    "User-Agent": "Java-http-client/17.0.3.1"
  }, 
  "origin": "192.168.80.1", 
  "url": "http://192.168.80.130/get"
}
```

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class SimpleGet {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://192.168.80.130/get"))
                .version(HttpClient.Version.HTTP_1_1)
                .header("key1", "value1")
                .header("key2", "value2")
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println(body);
    }
}
```

```text
{
  "args": {}, 
  "headers": {
    "Content-Length": "0", 
    "Host": "192.168.80.130", 
    "Key1": "value1", 
    "Key2": "value2", 
    "User-Agent": "Java-http-client/17.0.3.1"
  }, 
  "origin": "192.168.80.1", 
  "url": "http://192.168.80.130/get"
}
```

## Setting a Timeout

Let's now define the amount of time we want to wait for a response.

If the set time expires, a `HttpTimeoutException` will be thrown. **The default timeout is set to infinity.**

The timeout can be set with the `Duration` object by calling method `timeout()` on the builder instance:

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import static java.time.temporal.ChronoUnit.SECONDS;

public class SimpleGet {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://192.168.80.130/get"))
                .version(HttpClient.Version.HTTP_1_1)
                .timeout(Duration.of(10, SECONDS))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println(body);
    }
}
```

```text
{
  "args": {}, 
  "headers": {
    "Content-Length": "0", 
    "Host": "192.168.80.130", 
    "User-Agent": "Java-http-client/17.0.3.1"
  }, 
  "origin": "192.168.80.1", 
  "url": "http://192.168.80.130/get"
}
```

## Setting a Request Body

We can add a body to a request by using the request builder methods:
`POST(BodyPublisher body)`, `PUT(BodyPublisher body)` and `DELETE()`.

The new API provides a number of `BodyPublisher` implementations out-of-the-box that simplify passing the request body:

- `StringProcessor` - reads body from a `String`, created with `HttpRequest.BodyPublishers.ofString()`
- `InputStreamProcessor` - reads body from an `InputStream`, created with `HttpRequest.BodyPublishers.ofInputStream()`
- `ByteArrayProcessor` - reads body from a byte array, created with `HttpRequest.BodyPublishers.ofByteArray()`
- `FileProcessor` - reads body from a file at the given path, created with `HttpRequest.BodyPublishers.ofFile()`

In case we don't need a body, we can simply pass in an `HttpRequest.BodyPublishers.noBody()`:

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class SimplePost {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://192.168.80.130/post"))
                .version(HttpClient.Version.HTTP_1_1)
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println(body);
    }
}
```

```java
public abstract class HttpRequest {
    public static class BodyPublishers {
        public static BodyPublisher ofString(String body) {
            return ofString(body, UTF_8);
        }

        public static BodyPublisher ofString(String s, Charset charset) {
            return new RequestPublishers.StringPublisher(s, charset);
        }

        public static BodyPublisher ofInputStream(Supplier<? extends InputStream> streamSupplier) {
            return new RequestPublishers.InputStreamPublisher(streamSupplier);
        }

        public static BodyPublisher ofByteArray(byte[] buf) {
            return new RequestPublishers.ByteArrayPublisher(buf);
        }

        public static BodyPublisher ofByteArray(byte[] buf, int offset, int length) {
            Objects.checkFromIndexSize(offset, length, buf.length);
            return new RequestPublishers.ByteArrayPublisher(buf, offset, length);
        }

        public static BodyPublisher ofFile(Path path) throws FileNotFoundException {
            Objects.requireNonNull(path);
            return RequestPublishers.FilePublisher.create(path);
        }

        public static BodyPublisher noBody() {
            return new RequestPublishers.EmptyPublisher();
        }
    }
}
```
