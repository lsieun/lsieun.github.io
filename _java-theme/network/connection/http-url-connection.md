---
title: "HttpURLConnection"
sequence: "109"
---

## Intro

The `java.net.HttpURLConnection` class is an abstract subclass of `URLConnection`; it provides some additional methods that are helpful when working specifically with http URLs. In particular, it contains methods to **get and set the request method**, decide **whether to follow redirects**, **get the response code and message**, and figure out **whether a proxy server is being used**. It also includes several dozen **mnemonic constants** matching the various HTTP response codes. Finally, it overrides the `getPermission()` method from the `URLConnection` superclass, although it doesn't change the semantics of this method at all.

## Create Instance

Because this class is abstract and its only constructor is protected, you can't directly create instances of `HttpURLConnection`. However, if you construct a `URL` object using an http URL and invoke its `openConnection()` method, the `URLConnection` object returned will be an instance of `HttpURLConnection`. Cast that `URLConnection` to `HttpURLConnection` like this:

```text
URL u = new URL("http://lesswrong.com/");
URLConnection uc = u.openConnection();
HttpURLConnection http = (HttpURLConnection) uc;
```

```java
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

public class URLRun {
    public static void main(String[] args) {
        try {
            URL u = new URL("http://lesswrong.com/");
            URLConnection uc = u.openConnection();
            HttpURLConnection http = (HttpURLConnection) uc;
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
```

Or, skipping a step, like this:

```text
URL u = new URL("http://lesswrong.com/");
HttpURLConnection http = (HttpURLConnection) u.openConnection();
```

## Disconnecting from the Server

HTTP 1.1 supports persistent connections that allow multiple requests and responses to be sent over a single TCP socket. However, when `Keep-Alive` is used, the server won't immediately close a connection simply because it has sent the last byte of data to the client. The client may, after all, send another request. Servers will time out and close the connection in as little as 5 seconds of inactivity. However, it's still preferred for the client to close the connection as soon as it knows it's done.

The `HttpURLConnection` class transparently supports HTTP `Keep-Alive` unless you explicitly turn it off. That is, it will reuse sockets if you connect to the same server again before the server has closed the connection. Once you know you're done talking to a particular host, the `disconnect()` method enables a client to break the connection:

```text
public abstract void disconnect()
```

If any streams are still open on this connection, `disconnect()` closes them. However, the reverse is not true. Closing a stream on a persistent connection does not close the socket and disconnect.

## Proxies

Many users behind firewalls access the Web through proxy servers. The `usingProxy()` method tells you whether the particular `HttpURLConnection` is going through a proxy server:

```text
public abstract boolean usingProxy()
```

It returns `true` if a proxy is being used, `false` if not. In some contexts, the use of a proxy server may have security implications.

