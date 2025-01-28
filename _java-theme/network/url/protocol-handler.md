---
title: "Protocol Handler Mechanism"
sequence: "114"
---

Rather than relying on inheritance to configure instances for different kinds of URLs,
the `URL` class uses the **strategy design pattern**.
**Protocol handlers** are the strategies,
and the `URL` class itself forms the context through which the different strategies are selected.

```txt
URL ---> URLStreamHandler ---> URLConnection
```

```java
package java.net;

import java.net.URLConnection;
import java.net.URLStreamHandler;

public class URL {
    private String protocol;
    private String host;
    private int port = -1;
    private String file;

    private URLStreamHandler handler;

    public URL(String protocol, String host, int port, String file) {
        this(protocol, host, port, file, null);
    }

    public URL(String protocol, String host, int port, String file, URLStreamHandler handler) {
        this.protocol = protocol;
        this.host = host;
        this.port = port;
        this.file = file;
        if (handler != null) {
            this.handler = handler;
        } else {
            this.handler = getURLStreamHandler(protocol);
        }
    }

    public URLConnection openConnection() throws java.io.IOException {
        return handler.openConnection(this);
    }

    static URLStreamHandler getURLStreamHandler(String protocol) {
        try {
            String packagePrefix = "sun.net.www.protocol";
            String clsName = packagePrefix + "." + protocol + ".Handler";
            Class<?> cls = Class.forName(clsName);
            URLStreamHandler handler = (URLStreamHandler) cls.newInstance();
            return handler;
        } catch (Exception ex) {
            ex.printStackTrace();
        }
        return null;
    }
}
```

```java
package java.net;

public abstract class URLStreamHandler {
    abstract protected URLConnection openConnection(URL u) throws IOException;
}
```

```java
package sun.net.www.protocol.http;

import java.net.URL;
import java.net.URLConnection;
import java.net.URLStreamHandler;

public class Handler extends URLStreamHandler {
    protected URLConnection openConnection(URL u) throws IOException {
        return this.openConnection(u, (Proxy)null);
    }

    protected URLConnection openConnection(URL u, Proxy p) throws IOException {
        return new HttpURLConnection(u, p, this);
    }
}
```

```java
package sun.net.www.protocol.http;

public class HttpURLConnection extends java.net.HttpURLConnection {
    protected HttpURLConnection(URL u, Proxy p, Handler h) throws IOException {
    }

    protected void setNewClient(URL var1, boolean var2) throws IOException {
        this.http = HttpClient.New(var1, (String)null, -1, var2, this.connectTimeout, this);
        this.http.setReadTimeout(this.readTimeout);
    }
}
```

```java
package sun.net.www.http;

public class HttpClient extends NetworkClient {

}
```

```java
package sun.net;

public class NetworkClient {
}
```

