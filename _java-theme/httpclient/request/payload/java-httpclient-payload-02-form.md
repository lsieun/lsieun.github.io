---
title: "Java HttpClient Payload: Form"
sequence: "102"
---

```java
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class SubmittingForm {
    public static void main(String[] args) throws IOException, InterruptedException {
        Map<String, String> formData = new HashMap<>();
        formData.put("username", "tomcat");
        formData.put("password", "123456");

        String serviceUrl = "https://httpbin.org/post";

        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(serviceUrl))
                .POST(HttpRequest.BodyPublishers.ofString(getFormDataAsString(formData)))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println(body);
    }

    private static String getFormDataAsString(Map<String, String> formData) {
        StringBuilder formBodyBuilder = new StringBuilder();
        for (Map.Entry<String, String> singleEntry : formData.entrySet()) {
            if (formBodyBuilder.length() > 0) {
                formBodyBuilder.append("&");
            }
            formBodyBuilder.append(URLEncoder.encode(singleEntry.getKey(), StandardCharsets.UTF_8));
            formBodyBuilder.append("=");
            formBodyBuilder.append(URLEncoder.encode(singleEntry.getValue(), StandardCharsets.UTF_8));
        }
        return formBodyBuilder.toString();
    }
}
```

```json
{
  "args": {},
  "data": "password=123456&username=tomcat",
  "files": {},
  "form": {},
  "headers": {
    "Content-Length": "31",
    "Host": "httpbin.org",
    "User-Agent": "Java-http-client/17.0.3.1",
    "X-Amzn-Trace-Id": "Root=1-6461f19b-5dbaf65a70de48dd39e321d9"
  },
  "json": null,
  "origin": "104.28.223.203",
  "url": "https://httpbin.org/post"
}
```
