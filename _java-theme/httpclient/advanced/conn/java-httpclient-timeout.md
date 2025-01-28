---
title: "Java HttpClient Timeout"
sequence: "101"
---

## Configuring a Timeout

First of all, we need to set up an `HttpClient` to be able to make an HTTP request:

```text
private static HttpClient getHttpClientWithTimeout(int seconds) {
    return HttpClient.newBuilder()
      .connectTimeout(Duration.ofSeconds(seconds))
      .build();
}
```

Above, we created a method that returns a `HttpClient` configured with a timeout defined as a parameter.
Shortly, we use the Builder design pattern to instantiate an `HttpClient` and
configure the timeout using the `connectTimeout` method.
Additionally, using the static method `ofSeconds`,
we created an instance of the `Duration` object that defines our timeout in **seconds**.

After that, we check if the `HttpClient` timeout is configured correctly:

```text
httpClient.connectTimeout().map(Duration::toSeconds)
  .ifPresent(sec -> System.out.println("Timeout in seconds: " + sec));
```

So, we use the connectTimeout method to get the timeout.
As a result, it returns an `Optional` of `Duration`, which we mapped to seconds.

## Handling Timeouts

Further, we need to create an `HttpRequest` object that our client will use to make an HTTP request:

```text
HttpRequest httpRequest = HttpRequest.newBuilder()
  .uri(URI.create("http://10.255.255.1")).GET().build();
```

To simulate a timeout, we make a call to a non-routable IP address.
In other words, all the TCP packets drop and force a timeout after the predefined duration as configured earlier.

Now, let's take a deeper look at how to handle a timeout.

### Handling Synchronous Call Timeout

For example, to make the synchronous call use the `send` method:

```text
HttpConnectTimeoutException thrown = assertThrows(
  HttpConnectTimeoutException.class,
  () -> httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString()),
  "Expected send() to throw HttpConnectTimeoutException, but it didn't");
assertTrue(thrown.getMessage().contains("timed out"));
```

The synchronous call forces to catch the `IOException`, which the `HttpConnectTimeoutException` extends.
Consequently, in the test above, we expect the `HttpConnectTimeoutException` with an error message.

### Handling Asynchronous Call Timeout

Similarly, to make the asynchronous call use the `sendAsync` method:

```text
CompletableFuture<String> completableFuture = httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.ofString())
  .thenApply(HttpResponse::body)
  .exceptionally(Throwable::getMessage);
String response = completableFuture.get(5, TimeUnit.SECONDS);
assertTrue(response.contains("timed out"));
```

The above call to `sendAsync` returns a `CompletableFuture<HttpResponse>`.
Consequently, we need to define how to handle the response functionally.
In detail, we get the body from the response when no error occurs.
Otherwise, we get the error message from the throwable.
Finally, we get the result from the `CompletableFuture` by waiting a maximum of 5 seconds.
Again, this request throws an `HttpConnectTimeoutException` as we expect just after 3 seconds.

## Configure Timeout at the Request Level

Above, we reused the same client instance for both the sync and async call.
However, we might want to handle the timeout differently for each request.
Likewise, we can set up the timeout for a single request:

```text
HttpRequest httpRequest = HttpRequest.newBuilder()
  .uri(URI.create("http://10.255.255.1"))
  .timeout(Duration.ofSeconds(1))
  .GET()
  .build();
```

Similarly, we are using the timeout method to set up the timeout for this request.
Here, we configured the timeout of 1 second for this request.

**The minimum duration between the client and the request sets the timeout for the request.**
