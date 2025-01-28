---
title: "Setting the Redirect Policy"
sequence: "101"
---

Sometimes the page we want to access has moved to a different address.

In that case, we'll receive HTTP status code `3xx`, usually with the information about new URI.
**HttpClient can redirect the request to the new URI automatically if we set the appropriate redirect policy.**

We can do it with the `followRedirects()` method on Builder:

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class SettingRedirectPolicy {
    public static void main(String[] args) throws IOException, InterruptedException {
        String url = "https://www.baidu.com";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        HttpResponse<String> response = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.ALWAYS)
                .build()
                .send(request, HttpResponse.BodyHandlers.ofString());

        String body = response.body();
        System.out.println(body);
    }
}
```

