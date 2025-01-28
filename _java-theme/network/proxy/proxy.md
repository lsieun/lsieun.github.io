---
title: "Proxy"
sequence: "102"
---

Many systems access the Web and sometimes other non-HTTP parts of the Internet through proxy servers.
**A proxy server receives a request for a remote server from a local client.
The proxy server makes the request to the remote server and forwards the result back to the local client**.
Sometimes this is done for **security reasons**,
such as to prevent remote hosts from learning private details about the local network configuration.
Other times it's done to **prevent users from accessing forbidden sites**
by filtering outgoing requests and limiting which sites can be viewed.
For instance, an elementary school might want to block access to http://www.playboy.com.
And still other times it's done purely for **performance**,
to allow multiple users to retrieve the same popular documents from a local cache
rather than making repeated downloads from the remote server.

Java programs based on the `URL` class can work through most common proxy servers and protocols.
Indeed, this is one reason you might want to choose to use the `URL` class
rather than rolling your own HTTP or other client on top of raw sockets.

## System Properties

For basic operations,
all you have to do is set **a few system properties** to point to the addresses of your local proxy servers.
If you are using **a pure HTTP proxy**, set `http.proxyHost` to the domain name or the IP address of your proxy server
and `http.proxyPort` to the port of the proxy server (the default is `80`).

There are several ways to do this, including calling `System.setProperty()` from within your Java code or
**using the `-D` options when launching the program**.

```java
public class ProxyRun {
    public static void main(String[] args) {
        printSystemProperty("http.proxyHost");
        printSystemProperty("http.proxyPort");
        printSystemProperty("http.nonProxyHosts");
    }

    public static void printSystemProperty(String str) {
        String message = String.format("%s: %s", str, System.getProperty(str));
        System.out.println(message);
    }
}
```

### http Proxy host and port

This example sets the proxy server to `192.168.254.254` and the port to `9000`:

```bash
java -Dhttp.proxyHost=192.168.254.254 -Dhttp.proxyPort=9000 com.domain.Program
```

### http Proxy exclude

If you want to exclude a host from being proxied and connect directly instead,
set the `http.nonProxyHosts` system property to its hostname or IP address.
To exclude **multiple hosts**, separate their names by **vertical bars**.
For example, this code fragment proxies everything except `java.oreilly.com` and `xml.oreilly.com`:

```text
System.setProperty("http.proxyHost", "192.168.254.254");
System.setProperty("http.proxyPort", "9000");
System.setProperty("http.nonProxyHosts", "java.oreilly.com|xml.oreilly.com");
```

### http Proxy asterisk

You can also use an **asterisk** as a wildcard to indicate
that all the hosts within a particular domain or subdomain should not be proxied.
For example, to proxy everything except hosts in the `oreilly.com` domain:

```bash
java -Dhttp.proxyHost=192.168.254.254 -Dhttp.nonProxyHosts=*.oreilly.com com.domain.Program
```

### ftp Proxy

If you are using an FTP proxy server,
set the `ftp.proxyHost`, `ftp.proxyPort`, and `ftp.nonProxyHosts` properties in the same way.

### socket Proxy

Java does not support any **other application layer proxies**,
but if you're using a transport layer SOCKS proxy for all TCP connections,
you can identify it with the `socksProxyHost` and `socksProxyPort` system properties.
Java does not provide an option for non‐proxying with SOCKS.
It's an all-or-nothing decision.

```java
public class SocketProxyProperty {
    public static void main(String[] args) {
        System.setProperty("socksProxyHost", "127.0.0.1");
        System.setProperty("socksProxyPort", "1080");
        System.setProperty("https.protocols", "TLSv1,TLSv1.1,TLSv1.2");
        System.setProperty("jdk.tls.trustNameService", "true");
//        System.setProperty("javax.net.debug", "all");

//        String url = "https://httpbin.org/ip"; // error
//        String url = "https://httpbin.org"; // ok
//        String url = "https://www.bing.com"; // ok
        String url = "https://www.google.com"; // error
        HttpUtils.connect(url);
    }
}
```

### Limitations of Global Configuration

Although using a global configuration with system properties is easy to implement,
this approach **limits what we can do because the settings apply across the entire JVM**.
For this reason, settings defined for a particular protocol are active for the life of the JVM or until they are un-set.

To get around this limitation, it might be tempting to flip the settings on and off as needed.
To do this safely in a multi-threaded program,
it would be necessary to introduce measures to protect against concurrency issues.

As an alternative, **the `Proxy` API provides more granular control over proxy configuration**.

## The Proxy Class

The `Proxy` class allows more fine-grained control of proxy servers from within a Java program.
Specifically, it allows you to choose different proxy servers for different remote hosts.
The proxies themselves are represented by instances of the `java.net.Proxy` class.

There are still only three kinds of proxies, `HTTP`, `SOCKS`, and direct connections (no proxy at all),
represented by three constants in the `Proxy.Type` enum:

- Proxy.Type.DIRECT
- Proxy.Type.HTTP
- Proxy.Type.SOCKS

Besides its type, the other important piece of information about a proxy is its address and port,
given as a `SocketAddress` object.
For example, this code fragment creates a `Proxy` object
representing an HTTP proxy server on port `80` of `proxy.example.com`:

```text
SocketAddress address = new InetSocketAddress("proxy.example.com", 80);
Proxy proxy = new Proxy(Proxy.Type.HTTP, address);
```

Although there are only three kinds of proxy objects,
there can be many proxies of the same type for different proxy servers on different hosts.

### Using an HTTP Proxy

To use an HTTP proxy, we first wrap a `SocketAddress` instance with a `Proxy` and type of `Proxy.Type.HTTP`.
Next, we simply pass the `Proxy` instance to `URLConnection.openConnection()`:

```text
Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("127.0.0.1", 3128));

URL u = new URL(URL_STRING);
HttpURLConnection http = (HttpURLConnection) u.openConnection(webProxy);
```

```java
import java.net.InetSocketAddress;
import java.net.Proxy;

public class ProxyRun {
    public static void main(String[] args) {
        Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress("http://proxy.memorynotfound.com", 80));

        String url = "https://httpbin.org/ip";
        HttpUtils.connect(url, proxy);
    }
}
```

```java
public class HttpProxySquid {
    public static void main(String[] args) {
        System.setProperty("http.proxyHost", "127.0.0.1");
        System.setProperty("http.proxyPort", "3128");

        String url = "https://httpbin.org/ip";
        HttpUtils.connect(url);
    }
}
```

### Using a DIRECT Proxy

We may have a requirement to connect directly to a host.
In this case, we can explicitly bypass a proxy
that may be configured globally by using the static `Proxy.NO_PROXY` instance.
Under the covers, the API constructs a new instance of Proxy for us, using `Proxy.Type.DIRECT` as the type:

```text
HttpURLConnection http = (HttpURLConnection) u.openConnection(Proxy.NO_PROXY);
```

Basically, if there is no globally configured proxy,
then this is the same as calling `openConnection()` with no arguments.

### Using a SOCKS Proxy

It's also possible to use a SOCKS proxy when connecting to a TCP socket.
First, we use the `Proxy` instance to construct a `Socket`.
Afterward, we pass the destination `SocketAddress` instance to `Socket.connect()`:

```text
Proxy socksProxy = new Proxy(Proxy.Type.SOCKS, new InetSocketAddress("127.0.0.1", 3128));

Socket s = new Socket(socksProxy);
InetSocketAddress serverHost = new InetSocketAddress(SOCKET_SERVER_HOST, SOCKET_SERVER_PORT);
s.connect(serverHost);
```

```java
import java.net.InetSocketAddress;
import java.net.Proxy;

public class SocketProxyRun {
    public static void main(String[] args) {
        Proxy socksProxy = new Proxy(Proxy.Type.SOCKS, new InetSocketAddress("127.0.0.1", 1080));

        String url = "https://httpbin.org/ip";
        HttpUtils.connect(url, socksProxy);
    }
}
```

## The ProxySelector Class

Each running virtual machine has a single `java.net.ProxySelector` object
it uses to locate the proxy server for different connections.

The default `ProxySelector` merely inspects the various system properties and the URL's protocol
to decide how to connect to different hosts.

However, you can install your own subclass of `ProxySelector` in place of the default selector and
use it to choose different proxies based on protocol, host, path, time of day, or other criteria.

### select() method

The key to this class is the abstract `select()` method:

```java
public abstract class ProxySelector {
    public abstract List<Proxy> select(URI uri);
}
```

Java passes this method a `URI` object (not a URL object) representing the host to which a connection is needed.

For a connection made with the `URL` class,
this object typically has the form `http://www.example.com/` or `ftp://ftp.example.com/pub/files/`, for example.

For a pure TCP connection made with the `Socket` class, this `URI` will have the form `socket://host:port:`,
for instance, `socket://www.example.com:80`.

The `ProxySelector` object then chooses the right proxies for this type of object and returns them in a `List<Proxy>`.

### connectFailed() method

The second abstract method in this class you must implement is `connectFailed()`:

```text
public void connectFailed(URI uri, SocketAddress address, IOException ex)
```

This is a callback method used to warn a program that the proxy server isn't actually making the connection.

The following example demonstrates with a `ProxySelector`
that attempts to use the proxy server at `proxy.example.com` for all HTTP connections
unless the proxy server has previously failed to resolve a connection to a particular URL.
In that case, it suggests a direct connection instead.

```java
import java.io.IOException;
import java.net.*;
import java.util.ArrayList;
import java.util.List;

public class LocalProxySelector extends ProxySelector {
    private List<URI> failed = new ArrayList<>();

    public List<Proxy> select(URI uri) {
        List<Proxy> result = new ArrayList<>();
        if (failed.contains(uri) || !"http".equalsIgnoreCase(uri.getScheme())) {
            result.add(Proxy.NO_PROXY);
        } else {
            SocketAddress proxyAddress = new InetSocketAddress("proxy.example.com", 8000);
            Proxy proxy = new Proxy(Proxy.Type.HTTP, proxyAddress);
            result.add(proxy);
        }
        return result;
    }

    public void connectFailed(URI uri, SocketAddress address, IOException ex) {
        failed.add(uri);
    }
}
```

As I said, each virtual machine has exactly one `ProxySelector`.
To change the `ProxySelector`, pass the new selector to the static `ProxySelector.setDefault()` method, like so:

```text
ProxySelector selector = new LocalProxySelector():
ProxySelector.setDefault(selector);
```

From this point forward,
all connections opened by that virtual machine will ask the `ProxySelector` for the right proxy to use.
You normally shouldn't use this in code running in a shared environment.
For instance, you wouldn't change the `ProxySelector` in a servlet
because that would change the `ProxySelector` for all servlets running in the same container.

## Reference

- [Configure HTTP/HTTPS Proxy Settings Java](https://memorynotfound.com/configure-http-proxy-settings-java/)
- [Squid Proxy List](https://squidproxyserver.com/)
