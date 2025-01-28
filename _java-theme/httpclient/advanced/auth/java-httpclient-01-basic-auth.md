---
title: "Basic Authorization"
sequence: "101"
---

An `Authenticator` is an object that negotiates credentials (HTTP authentication) for a connection.

It provides different **authentication schemes** (such as **basic** or **digest** authentication).

In most cases, authentication requires username and password to connect to a server.

We can use `PasswordAuthentication` class, which is just a holder of these values:

```java
import java.io.IOException;
import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class PassAuth {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newBuilder()
                .authenticator(new Authenticator() {
                    @Override
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(
                                "tomcat",
                                "123456".toCharArray()
                        );
                    }
                })
                .build();

        String url = "http://192.168.80.130/basic-auth/tomcat/123456";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println(body);
    }
}
```

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Base64;

public class BasicAuth {
    public static void main(String[] args) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://192.168.80.130/basic-auth/tomcat/123456"))
                .GET()
                .header("Authorization", "Basic " +
                        Base64.getEncoder().encodeToString(("tomcat:123456").getBytes()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String body = response.body();
        System.out.println(body);
    }
}
```

```text
{
  "authenticated": true, 
  "user": "tomcat"
}
```
