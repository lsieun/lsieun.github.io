---
title: "Java HttpClient: Log"
sequence: "103"
---

If we look at `jdk.internal.net.http.common.DebugLogger` source code, we can see a few loggers using `System.Logger`,
which in turn will use `System.LoggerFinder` to select the logger framework.
`JUL` is the default choice. The logger names are:

- jdk.internal.httpclient.debug
- jdk.internal.httpclient.websocket.debug
- jdk.internal.httpclient.hpack.debug


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

They can be enabled by setting them as a system property.
For example running with `-Djdk.internal.httpclient.debug=true` will produce:


```text
DEBUG: [main] [113ms] HttpClientImpl(1) proxySelector is sun.net.spi.DefaultProxySelector@2d3fcdbd (user-supplied=false)
DEBUG: [main] [150ms] HttpClientImpl(1) ClientImpl (async) send http://192.168.80.130/post POST
DEBUG: [main] [155ms] Exchange establishing exchange for http://192.168.80.130/post POST,
	 proxy=null
DEBUG: [main] [156ms] ExchangeImpl get: HTTP/1.1: new Http1Exchange
DEBUG: [main] [168ms] PlainHttpConnection(?) Initial receive buffer size is: 65536
DEBUG: [main] [168ms] PlainHttpConnection(?) Initial send buffer size is: 65536
DEBUG: [main] [174ms] Exchange checkFor407: all clear
DEBUG: [main] [174ms] Http1Exchange Sending headers only
```


You can log request and responses by specifying `-Djdk.httpclient.HttpClient.log=requests` on the Java command line.

Additional note:

The `jdk.httpclient.HttpClient.log` property is an implementation specific property
whose value is a comma separated list
which can be configured on the Java command line for diagnosis/debugging purposes with the following values:

```text
-Djdk.httpclient.HttpClient.log=
       errors,requests,headers,
       frames[:control:data:window:all],content,ssl,trace,channel,all

```
