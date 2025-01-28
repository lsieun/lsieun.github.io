---
title: "Synchronously - Asynchronously - Concurrently"
sequence: "101"
---

## Synchronously

We can send the prepared request using this default `send` method.
**This method will block our code until the response has been received**:

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class HelloWorld {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://httpbin.org/post"))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        int statusCode = response.statusCode();
        String body = response.body();

        System.out.println("statusCode: " + statusCode);
        System.out.println("Body:");
        System.out.println(body);
    }
}
```

```text
statusCode: 200
Body:
{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Host": "httpbin.org", 
    "User-Agent": "Java-http-client/17.0.3.1", 
    "X-Amzn-Trace-Id": "Root=1-6461e279-2c51191e1086e09859649571"
  }, 
  "json": null, 
  "origin": "104.28.223.203", 
  "url": "https://httpbin.org/post"
}
```

## Asynchronously

We could send the same request from the previous example asynchronously using the `sendAsync` method.
Instead of blocking our code, this method will immediately return a `CompletableFuture` instance:

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class HelloWorld {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://httpbin.org/post"))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();

        CompletableFuture<HttpResponse<String>> futureResponse = client.sendAsync(request, HttpResponse.BodyHandlers.ofString());
        HttpResponse<String> response = futureResponse.get();

        int statusCode = response.statusCode();
        String body = response.body();

        System.out.println("statusCode: " + statusCode);
        System.out.println("Body:");
        System.out.println(body);
    }
}
```

```text
statusCode: 200
Body:
{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Host": "httpbin.org", 
    "User-Agent": "Java-http-client/17.0.3.1", 
    "X-Amzn-Trace-Id": "Root=1-6461e41d-1c3f3cd30e033d6238fde365"
  }, 
  "json": null, 
  "origin": "104.28.223.203", 
  "url": "https://httpbin.org/post"
}
```

## Concurrently

We can combine Streams with `CompletableFuture`s in order to issue several requests concurrently and await their responses:



