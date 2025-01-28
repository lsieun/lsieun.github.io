---
title: "URLConnection"
sequence: "102"
---

## Intro

### abstract URLConnection Class

`URLConnection` is an abstract class that represents an active connection to a resource specified by a `URL`.

```java
public abstract class URLConnection {
    abstract public void connect() throws IOException;
}
```

The `URLConnection` class is declared `abstract`.
However, all but one of its methods are implemented.
You may find it convenient or necessary to override other methods in the class;
but the single method that subclasses must implement is `connect()`,
which makes a connection to a server and thus depends on the type of service (HTTP, FTP, and so on).
For example, a `sun.net.www.protocol.file.FileURLConnection`'s `connect()` method
converts the `URL` to a filename in the appropriate directory,
creates MIME information for the file, and then opens a buffered `FileInputStream` to the file.
The `connect()` method of `sun.net.www.protocol.http.HttpURLConnection` creates a `sun.net.www.http.HttpClient` object,
which is responsible for connecting to the server:

```java
package sun.net.www.protocol.file;

public class FileURLConnection extends URLConnection {
    public void connect() throws IOException {
        this.is = new BufferedInputStream(new FileInputStream(this.filename));
        this.connected = true;
    }
}
```

```java
package sun.net.www.protocol.http;

public class HttpURLConnection extends java.net.HttpURLConnection {
    public void connect() throws IOException {
        this.plainConnect();
    }

    protected void plainConnect() throws IOException {
        this.plainConnect0();
    }

    protected void plainConnect0() throws IOException {
        this.http = this.getNewHttpClient(this.url, var4, this.connectTimeout, false);
        this.http.setReadTimeout(this.readTimeout);
        this.ps = (PrintStream)this.http.getOutputStream();
        this.connected = true;
    }
}
```

### connect

When a `URLConnection` is first constructed, it is unconnected;
that is, the local and remote host cannot send and receive data.
There is no socket connecting the two hosts.

> 默认情况下，没有建立连接

The `connect()` method establishes a connection—normally using TCP sockets
but possibly through some other mechanism—between the local and remote host so they can send and receive data.

> connect() 方法，可以建立连接

However, `getInputStream()`, `getContent()`, `getHeaderField()`,
and other methods that require an open connection will call `connect()` if the connection isn't yet open.
Therefore, you rarely need to call `connect()` directly.

> 有些方法，会主动调用 connect() 方法

### two purposes

The `URLConnection` class has two different but related purposes.

First, it provides **more control** over the interaction with a server (especially an HTTP server) than the `URL` class.
A `URLConnection` can inspect the header sent by the server and respond accordingly.
<sub>获取response的header信息</sub>
It can set the header fields used in the client request<sub>设置request的header信息</sub>.
Finally, a `URLConnection` can send data back to a web server with `POST`, `PUT`, and other HTTP request methods.
<sub>使用不同的Method发送数据</sub>

Second, the `URLConnection` class is part of **Java's protocol handler mechanism**,
which also includes the `URLStreamHandler` class.
The idea behind protocol handlers is simple:
they separate **the details of processing a protocol** from **processing particular data types**,
providing user interfaces, and doing the other work that a monolithic web browser performs.
The base `java.net.URLConnection` class is abstract; to implement a specific protocol, you write a subclass.
These subclasses can be loaded at runtime by applications.
For example, if the browser runs across a `URL` with a strange scheme, such as `compress`,
rather than throwing up its hands and issuing an error message,
it can download a protocol handler for this unknown protocol and use it to communicate with the server.

Only abstract `URLConnection` classes are present in the `java.net` package.
The concrete subclasses are hidden inside the `sun.net` package hierarchy.
Many of the methods and fields as well as the single constructor in the `URLConnection` class are protected.
In other words, they can only be accessed by instances of the `URLConnection` class or its subclasses.
It is rare to instantiate `URLConnection` objects directly in your source code;
instead, the runtime environment creates these objects as needed, depending on the protocol in use.
The class (which is unknown at compile time) is then instantiated
using the `forName()` and `newInstance()` methods of the `java.lang.Class` class.

### API drawback

`URLConnection` does not have the best-designed API in the Java class library.
One of several problems is that the `URLConnection` class is too closely tied to the HTTP protocol.
For instance, it assumes that each file transferred is preceded by a MIME header or something very much like one.
However, most classic protocols such as FTP and SMTP don't use MIME headers.

## How to use

A program that uses the `URLConnection` class directly follows this basic sequence of steps:

1. Construct a `URL` object.
2. Invoke the `URL` object's `openConnection()` method to retrieve a `URLConnection` object for that `URL`.
3. Configure the `URLConnection`.
4. Read the header fields.
5. Get an input stream and read data.
6. Get an output stream and write data.
7. Close the connection.

You don't always perform all these steps.
For instance, if the default setup for a particular kind of `URL` is acceptable, you can skip step 3.
If you only want the data from the server and don't care about any meta-information,
or if the protocol doesn't provide any meta-information, you can skip step 4.
If you only want to receive data from the server but not send data to the server, you'll skip step 6.
Depending on the protocol, steps 5 and 6 may be reversed or interlaced.

## Opening URLConnections

The single constructor for the `URLConnection` class is protected:

> 这里隐含的解释：为什么不用 `new` 来创建对象

```text
protected URLConnection(URL url)
```

Consequently, unless you're subclassing `URLConnection` to handle a new kind of URL (i.e., writing a protocol handler),
you create one of these objects by invoking the `openConnection()` method of the `URL` class. For example:

```java
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;

public class URLRun {
    public static void main(String[] args) {
        try {
            URL u = new URL("http://www.overcomingbias.com/");
            URLConnection uc = u.openConnection();
            // read from the URL...
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
```

## Configuring the Connection

The `URLConnection` class has **seven protected instance fields**
that define exactly how the client makes the request to the server. These are:

```text
protected URL url;
protected boolean doInput = true;
protected boolean doOutput = false;
protected boolean allowUserInteraction = defaultAllowUserInteraction;
protected boolean useCaches = defaultUseCaches;
protected long ifModifiedSince = 0;
protected boolean connected = false;
```

For instance, if `doOutput` is `true`,
you'll be able to write data to the server over this `URLConnection` as well as read data from it.
If `useCaches` is `false`, the connection bypasses any local caching and downloads the file from the server afresh.

Because these fields are all `protected`,
their values are accessed and modified via obviously named setter and getter methods:

```text
public URL getURL()
public void setDoInput(boolean doinput)
public boolean getDoInput()
public void setDoOutput(boolean dooutput)
public boolean getDoOutput()
public void setAllowUserInteraction(boolean allowuserinteraction)
public boolean getAllowUserInteraction()
public void setUseCaches(boolean usecaches)
public boolean getUseCaches()
public void setIfModifiedSince(long ifmodifiedsince)
public long getIfModifiedSince()
```

**You can modify these fields only before the `URLConnection` is connected**
(before you try to read content or headers from the connection).
Most of the methods that set fields throw an `IllegalStateException` if they are called while the connection is open.
**In general, you can set the properties of a `URLConnection` object only before the connection is opened**.

There are also some getter and setter methods
that define the default behavior for all instances of `URLConnection`. These are:

```text
public boolean getDefaultUseCaches()
public void setDefaultUseCaches(boolean defaultusecaches)
public static boolean getDefaultAllowUserInteraction()
public static void setDefaultAllowUserInteraction(boolean defaultallowuserinteraction)
public static synchronized FileNameMap getFileNameMap()
public static void setFileNameMap(FileNameMap map)
```

Unlike the instance methods, these methods can be invoked at any time.
The new defaults will apply only to `URLConnection` objects constructed after the new default values are set.

### doInput

A `URLConnection` can be used for reading from a server, writing to a server, or both.
The protected `boolean` field `doInput` is `true` if the `URLConnection` can be used for reading, `false` if it cannot be.
The default is `true`.
To access this protected variable, use the public `getDoInput()` and `setDoInput()` methods:

```text
public void setDoInput(boolean doInput)
public boolean getDoInput()
```

For example:

```java
import java.io.IOException;
import java.net.URL;
import java.net.URLConnection;

public class URLRun {
    public static void main(String[] args) {
        try {
            URL u = new URL("http://www.oreilly.com");
            URLConnection uc = u.openConnection();
            if (!uc.getDoInput()) {
                uc.setDoInput(true);
            }
            // write to the connection...
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
```

### doOutput

Programs can use a `URLConnection` to send output back to the server.
For example, a program that needs to send data to the server using the `POST` method could do so
by getting an output stream from a `URLConnection`.
The protected boolean field `doOutput` is `true` if the `URLConnection` can be used for writing,
`false` if it cannot be;
it is `false` **by default**.
To access this protected variable, use the `getDoOutput()` and `setDoOutput()` methods:

```text
public void setDoOutput(boolean dooutput)
public boolean getDoOutput()
```

For example:

```text
try {
    URL u = new URL("http://www.oreilly.com");
    URLConnection uc = u.openConnection();
    if (!uc.getDoOutput()) {
        uc.setDoOutput(true);
    }
    // write to the connection...
} catch (IOException ex) {
    System.err.println(ex);
}
```

When you set `doOutput` to `true` for an http URL, the request method is changed from `GET` to `POST`.

### Timeouts

Four methods query and modify the timeout values for connections;
that is, how long the underlying socket will wait for a response from the remote end
before throwing a `SocketTimeoutException`. These are:

```text
public void setConnectTimeout(int timeout)
public int getConnectTimeout()
public void setReadTimeout(int timeout)
public int getReadTimeout()
```

The `setConnectTimeout()`/`getConnectTimeout()` methods control how long the socket waits for the initial connection.
The `setReadTimeout()`/ `getReadTimeout()` methods control how long the input stream waits for data to arrive.
All four methods measure timeouts in milliseconds.
All four interpret **zero** as meaning **never time out**.
Both setter methods throw an `IllegalArgumentException` if the timeout is negative.

For example, this code fragment requests a 30-second connect timeout and a 45-second read timeout:

```text
URL u = new URL("http://www.example.org");
URLConnuction uc = u.openConnection();
uc.setConnectTimeout(30000);
uc.setReadTimeout(45000);
```

```java
import java.net.URLConnection;

public class URLRun {
    public static void main(String[] args) {
        printContentType("index.html");
        printContentType("main.js");
        printContentType("main.css");
        printContentType("good_child.mp4");
        printContentType("good_child.pdf");
        printContentType("foo.c");
    }

    public static void printContentType(String filename) {
        String contentType = URLConnection.getFileNameMap().getContentTypeFor(filename);
        System.out.println(String.format("%s: %s", filename, contentType));
    }
}
```

```text
index.html: text/html
main.js: null
main.css: null
good_child.mp4: video/mp4
good_child.pdf: application/pdf
foo.c: text/plain
```
