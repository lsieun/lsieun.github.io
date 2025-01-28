---
title: "Java HttpClient Payload: Json"
sequence: "103"
---


```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class JsonBody {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://httpbin.org/post"))
                .POST(HttpRequest.BodyPublishers.ofString("{\"action\":\"hello\"}"))
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
  "data": "{\"action\":\"hello\"}", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Content-Length": "18", 
    "Host": "httpbin.org", 
    "User-Agent": "Java-http-client/17.0.3.1", 
    "X-Amzn-Trace-Id": "Root=1-6461ead6-7a62c59153bbdb491b8551e2"
  }, 
  "json": {
    "action": "hello"
  }, 
  "origin": "104.28.223.203", 
  "url": "https://httpbin.org/post"
}
```

