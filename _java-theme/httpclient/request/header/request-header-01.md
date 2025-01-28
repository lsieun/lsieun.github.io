---
title: "Customize HTTP Headers"
sequence: "101"
---

We can easily add custom headers using one of three methods from the `HttpRequest.Builder` object:

- header
- headers
- setHeader

## Use header() Method

The `header()` method allows us to add one header at a time.

We can add the same header name as many times, and they will all be sent:

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Header1 {
    public static void main(String[] args) throws IOException, InterruptedException {
        String url = "http://192.168.80.130/get";
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .header("X-Our-Header-1", "value1")    // 注意：这里 Header 是 X-Our-Header-1
                .header("X-Our-Header-1", "value2")    // 注意：这里与上面相同
                .header("X-Our-Header-2", "value2")
                .uri(URI.create(url)).build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String payload = response.body();
        System.out.println(payload);
    }
}
```

```text
GET /get HTTP/1.1
Content-Length: 0
Host: 192.168.80.130
User-Agent: Java-http-client/17.0.3.1
X-Our-Header-1: value1
X-Our-Header-1: value2
X-Our-Header-2: value2
```

```text
{
  "args": {}, 
  "headers": {
    "Content-Length": "0", 
    "Host": "192.168.80.130", 
    "User-Agent": "Java-http-client/17.0.3.1", 
    "X-Our-Header-1": "value1,value2", 
    "X-Our-Header-2": "value2"
  }, 
  "origin": "192.168.80.1", 
  "url": "http://192.168.80.130/get"
}
```

## Use headers() Method

If we want to add multiple headers at the same time, we can use the `headers()` method:

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Header2 {
    public static void main(String[] args) throws IOException, InterruptedException {
        String url = "http://192.168.80.130/get";
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .headers("X-Our-Header-1", "value1", "X-Our-Header-1", "value2", "X-Our-Header-2", "value2")
                .uri(URI.create(url)).build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String payload = response.body();
        System.out.println(payload);
    }
}
```

## Use setHeader() Method

Finally, we can use the `setHeader()` method to add a header.
**But, unlike the `header()` method, if we use the same header name more than once,
it will overwrite any previous header(s) that we had set with that name**:

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Header3 {
    public static void main(String[] args) throws IOException, InterruptedException {
        String url = "http://192.168.80.130/get";
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .setHeader("X-Our-Header-1", "value1")    // 注意：这里 Header 是 X-Our-Header-1
                .setHeader("X-Our-Header-1", "value2")    // 注意：这里与上面相同
                .setHeader("X-Our-Header-2", "value2")
                .uri(URI.create(url)).build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String payload = response.body();
        System.out.println(payload);
    }
}
```
