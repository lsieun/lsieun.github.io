---
title: "Bypassing SSL Certificate Verification"
sequence: "101"
---

## Calling an Invalid HTTPS URL

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class BypassSSLCertificateVerification {
    public static void main(String[] args) throws IOException, InterruptedException {
        String url = "https://www.testingmcafeesites.com/";
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        int statusCode = response.statusCode();
        HttpClient.Version version = response.version();
        URI uri = response.uri();

        System.out.println("status code: " + statusCode);
        System.out.println("version    : " + version);
        System.out.println("uri        : " + uri);

        HttpHeaders headers = response.headers();
        Map<String, List<String>> map = headers.map();
        System.out.println("headers    : ");
        Set<String> keySet = map.keySet();
        for (String key : keySet) {
            List<String> list = map.get(key);
            String kv = String.format("    %s: %s", key, list);
            System.out.println(kv);
        }
    }
}
```

This is because the URL doesn't have a valid SSL certificate.

```text
Caused by: java.security.cert.CertificateException: No subject alternative DNS name matching www.testingmcafeesites.com found.
	at java.base/sun.security.util.HostnameChecker.matchDNS(HostnameChecker.java:212)
	at java.base/sun.security.util.HostnameChecker.match(HostnameChecker.java:103)
```

## Bypassing SSL Certificate Verification

To resolve the error we got above, let's look at a solution to bypass SSL certificate verification.

In Apache HttpClient, we could modify the client to bypass certificate verification.
However, we can't do that with the Java HttpClient.
**We'll have to rely on making changes to the JVM to disable hostname verification.**

One way to do this is to import the website's certificate into the Java KeyStore.
This is a common practice and is a good option if there are a small number of internal, trusted websites.

However, this can become tiresome if there are a large number of websites or too many environments to manage.
In this case, we can use the property `jdk.internal.httpclient.disableHostnameVerification` to disable hostname verification.

```text
-Djdk.internal.httpclient.disableHostnameVerification=true
```

We can set this property when running the application as a command-line argument:

```text
java -Djdk.internal.httpclient.disableHostnameVerification=true -jar target/java-httpclient-ssl-0.0.1-SNAPSHOT.jar
```

**Alternatively, we can programmatically set this property before creating our client:**

```text
Properties props = System.getProperties();
props.setProperty("jdk.internal.httpclient.disableHostnameVerification", Boolean.TRUE.toString());
```

```java
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpHeaders;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

public class BypassSSLCertificateVerification {
    public static void main(String[] args) throws IOException, InterruptedException {
        Properties props = System.getProperties();
        props.setProperty("jdk.internal.httpclient.disableHostnameVerification", Boolean.TRUE.toString());

        String url = "https://www.testingmcafeesites.com/";
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        int statusCode = response.statusCode();
        HttpClient.Version version = response.version();
        URI uri = response.uri();

        System.out.println("status code: " + statusCode);
        System.out.println("version    : " + version);
        System.out.println("uri        : " + uri);

        HttpHeaders headers = response.headers();
        Map<String, List<String>> map = headers.map();
        System.out.println("headers    : ");
        Set<String> keySet = map.keySet();
        for (String key : keySet) {
            List<String> list = map.get(key);
            String kv = String.format("    %s: %s", key, list);
            System.out.println(kv);
        }
    }
}
```

**We should note that changing the property would mean that certificate verification is disabled for all requests.
This may not be desirable, especially in production.**
However, it's common to introduce this property in **non-production environments**.

