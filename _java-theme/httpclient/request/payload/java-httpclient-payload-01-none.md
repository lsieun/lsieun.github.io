---
title: "Java HttpClient Payload: None"
sequence: "101"
---

```text
HttpRequest.BodyPublishers.noBody()
```

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class Payload1None {
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

```text
{
  "args": {}, 
  "data": "", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Content-Length": "0", 
    "Host": "192.168.80.130", 
    "User-Agent": "Java-http-client/17.0.3.1"
  }, 
  "json": null, 
  "origin": "192.168.80.1", 
  "url": "http://192.168.80.130/post"
}
```
