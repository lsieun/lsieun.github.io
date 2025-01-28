---
title: "Java HttpClient Payload: File"
sequence: "104"
---

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

public class UploadingFile {
    public static void main(String[] args) throws IOException, InterruptedException {

        Path file = Files.createTempFile("tmp-", ".txt");
        System.out.println(file);
        List<String> lines = Arrays.asList("1", "2", "3");
        Files.write(file, lines);

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://httpbin.org/post"))
                .POST(HttpRequest.BodyPublishers.ofFile(file))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println(body);
    }
}
```

```text
C:\Users\1\AppData\Local\Temp\tmp-13834592542367562289.txt
{
  "args": {}, 
  "data": "1\r\n2\r\n3\r\n", 
  "files": {}, 
  "form": {}, 
  "headers": {
    "Content-Length": "9", 
    "Host": "httpbin.org", 
    "User-Agent": "Java-http-client/17.0.3.1", 
    "X-Amzn-Trace-Id": "Root=1-6461eaf4-33fff371108f91fe12f29e35"
  }, 
  "json": null, 
  "origin": "104.28.223.203", 
  "url": "https://httpbin.org/post"
}
```
