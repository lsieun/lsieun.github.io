---
title: "Setting a Proxy"
sequence: "101"
---

We can define a proxy for the connection by just calling `proxy()` method on a `HttpClient.Builder` instance:

```java
import java.io.IOException;
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class SettingProxy {
    public static void main(String[] args) throws IOException, InterruptedException {
        String url = "https://www.baidu.com";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newBuilder()
                .proxy(ProxySelector.getDefault())
                .build()
                .send(request, HttpResponse.BodyHandlers.ofString());

        String body = response.body();
        System.out.println(body);
    }
}
```
