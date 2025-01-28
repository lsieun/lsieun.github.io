---
title: "URL"
sequence: "102"
---

```text
       ┌─── static ───────┼─── handler ───┼─── setURLStreamHandlerFactory()
       │
       │                                      ┌─── getProtocol()
       │                                      │
       │                                      ├─── getUserInfo()
       │                                      │
       │                                      ├─── getAuthority()
       │                                      │
       │                                      ├─── getHost()
       │                                      │
URL ───┤                                      │                      ┌─── getPort()
       │                  ┌─── parts ─────────┼─── port ─────────────┤
       │                  │                   │                      └─── getDefaultPort()
       │                  │                   │
       │                  │                   ├─── getPath()
       │                  │                   │
       │                  │                   ├─── getFile()
       │                  │                   │
       │                  │                   ├─── getQuery()
       │                  │                   │
       │                  │                   └─── getRef()
       └─── non-static ───┤
                          │                   ┌─── openConnection()
                          │                   │
                          ├─── connection ────┼─── InputStream ────────┼─── openStream()
                          │                   │
                          │                   └─── Object ─────────────┼─── getContent()
                          │
                          ├─── compare.two ───┼─── sameFile()
                          │
                          │                   ┌─── str ───┼─── toExternalForm()
                          └─── convert ───────┤
                                              └─── uri ───┼─── toURI()
```

The `java.net.URL` class is an abstraction of a **Uniform Resource Locator**
such as `http://www.lolcats.com/` or `ftp://ftp.redhat.com/pub/`.
It extends `java.lang.Object`, and it is a `final` class that cannot be subclassed.

```java
public final class URL implements java.io.Serializable {
}
```

Rather than relying on inheritance to configure instances for different kinds of URLs,
it uses the **strategy design pattern**.
**Protocol handlers** are the strategies,
and the `URL` class itself forms the context through which the different strategies are selected.

Although storing a `URL` as a string would be trivial,
it is helpful to think of URLs as objects with fields
that include the **scheme** (a.k.a. the protocol), **hostname**, **port**, **path**, **query string**,
and **fragment identifier** (a.k.a. the ref), each of which may be set independently.
Indeed, this is almost exactly how the `java.net.URL` class is organized,
though the details vary a little between different versions of Java.

**URLs are immutable.**
After a URL object has been constructed, its fields do not change.
**This has the side effect of making them thread safe.**

## Creating New URLs

We can construct instances of `java.net.URL`. The constructors differ in the information they require:

```text
public URL(String url) throws MalformedURLException
public URL(String protocol, String hostname, String file) throws MalformedURLException
public URL(String protocol, String host, int port, String file) throws MalformedURLException
public URL(URL base, String relative) throws MalformedURLException
```

```java
import java.net.MalformedURLException;
import java.net.URL;

public class URLRun {
    public static void main(String[] args) {
        try {
            URL u1 = new URL("http://www.audubon.org/");

            /**
             * The constructor sets the port to -1 so the default port for the protocol will be used.
             *
             * The file argument should begin with a slash and include a path, a filename, and optionally
             * a fragment identifier. Forgetting the initial slash is a common mistake, and one that is
             * not easy to spot.
             */
            URL u2 = new URL("http", "www.eff.org", "/blueribbon.html#intro");

            URL u3 = new URL("http", "fourier.dur.ac.uk", 8000, "/~dma3mjh/jsci/");

            /**
             * The constructor computes the new URL as http://www.ibiblio.org/javafaq/mailinglists.html.
             */
            URL u4 = new URL("http://www.ibiblio.org/javafaq/index.html");
            URL u5 = new URL(u4, "mailinglists.html");
        } catch (MalformedURLException ex) {
            System.err.println(ex);
        }
    }

}
```

Which constructor you use depends on the information you have and the form it's in.
All these constructors throw a `MalformedURLException`
if you try to create a `URL` for **an unsupported protocol** or if the URL is **syntactically incorrect**.

Exactly which protocols are supported is implementation dependent.
The only protocols that have been available in all virtual machines are `http` and `file`,
and the latter is notoriously flaky.
Today, Java also supports the `https`, `jar`, and `ftp` protocols.
Some virtual machines support `mailto` and `gopher` as well as some custom protocols
like `doc`, `netdoc`, `systemresource`, and `verbatim` used internally by Java.

```java
import java.net.MalformedURLException;
import java.net.URL;

public class URLRun {
    public static void main(String[] args) {
        // hypertext transfer protocol
        testProtocol("http://www.adc.org");

        // secure http
        testProtocol("https://www.amazon.com/exec/obidos/order2/");
        // file transfer protocol
        testProtocol("ftp://ibiblio.org/pub/languages/java/javafaq/");
        // Simple Mail Transfer Protocol
        testProtocol("mailto:elharo@ibiblio.org");
        // telnet
        testProtocol("telnet://dibner.poly.edu/");
        // local file access
        testProtocol("file:///etc/passwd");
        // gopher
        testProtocol("gopher://gopher.anc.org.za/");
        // Lightweight Directory Access Protocol
        testProtocol("ldap://ldap.itd.umich.edu/o=University%20of%20Michigan,c=US?postalAddress");
        // JAR
        testProtocol(
                "jar:http://cafeaulait.org/books/javaio/ioexamples/javaio.jar!"
                        + "/com/macfaq/io/StreamCopier.class");
        // NFS, Network File System
        testProtocol("nfs://utopia.poly.edu/usr/tmp/");
        // a custom protocol for JDBC
        testProtocol("jdbc:mysql://luna.ibiblio.org:3306/NEWS");
        // rmi, a custom protocol for remote method invocation
        testProtocol("rmi://ibiblio.org/RenderEngine");
        // custom protocols for HotJava
        testProtocol("doc:/UsersGuide/release.html");
        testProtocol("netdoc:/UsersGuide/release.html");
        testProtocol("systemresource://www.adc.org/+/index.html");
        testProtocol("verbatim:http://www.adc.org/");
    }

    private static void testProtocol(String url) {
        try {
            URL u = new URL(url);
            System.out.println(u.getProtocol() + " is supported");
        } catch (MalformedURLException ex) {
            String protocol = url.substring(0, url.indexOf(':'));
            System.out.println(protocol + " is not supported");
        }
    }
}
```

```text
http is supported
https is supported
ftp is supported
mailto is supported
telnet is not supported
file is supported
gopher is not supported
ldap is not supported
jar is supported
nfs is not supported
jdbc is not supported
rmi is not supported
doc is not supported
netdoc is not supported
systemresource is not supported
verbatim is not supported
```

If the protocol you need isn't supported by a particular VM,
you may be able to install a **protocol handler** for that scheme to enable the URL class to speak that protocol.
In practice, this is way more trouble than it's worth.
You're better off using a library that exposes a custom API just for that protocol.

Other than verifying that it recognizes the URL scheme, Java does not check the correctness of the URLs it constructs.
The programmer is responsible for making sure that URLs created are valid.
For instance, Java does not check that
the hostname in an HTTP URL does not contain spaces or that the query string is x-www-form-URL-encoded.
It does not check that a `mailto` URL actually contains an email address.
You can create URLs for hosts that don't exist and for hosts that do exist but that you won't be allowed to connect to.

## Splitting a URL into Pieces

URLs are composed of five pieces:

- The **scheme**, also known as the protocol
- The **authority**
- The **path**
- The **fragment identifier**, also known as the section or ref
- The **query string**

For example, in the URL `http://www.ibiblio.org/javafaq/books/jnp/index.html?isbn=1565922069#toc`, the **scheme** is `http`, the **authority** is `www.ibiblio.org`, the **path** is `/javafaq/books/jnp/index.html`, the **fragment identifier** is `toc`, and the **query string** is `isbn=1565922069`. However, not all URLs have all these pieces. For instance, the URL `http://www.faqs.org/rfcs/rfc3986.html` has a **scheme**, an **authority**, and a **path**, but no **fragment identifier** or **query string**.

The authority may further be divided into the **user info**, the **host**, and the **port**. For example, in the URL `http://admin@www.blackstar.com:8080/`, the authority is `admin@www.blackstar.com:8080`. This has the user info `admin`, the host `www.blackstar.com`, and the port `8080`.

Read-only access to these parts of a URL is provided by nine public methods: `getFile()`, `getHost()`, `getPort()`, `getProtocol()`, `getRef()`, `getQuery()`, `getPath()`, `getUserInfo()`, and `getAuthority()`.

## Equality and Comparison

The `URL` class contains the usual `equals()` and `hashCode()` methods. These behave almost as you'd expect.
Two URLs are considered equal if and only if both URL s point to the same resource
on the same **host**, **port**, and **path**, with the same **fragment identifier** and **query string**.

However there is one surprise here.
The `equals()` method actually tries to resolve the **host** with DNS so that,
for example, it can tell that `http://www.ibiblio.org/` and `http://ibiblio.org/` are the same.

```java
import java.net.MalformedURLException;
import java.net.URL;

public class URLRun {
    public static void main(String[] args) {
        try {
            URL www = new URL ("http://www.ibiblio.org/");
            URL ibiblio = new URL("http://ibiblio.org/");
            if (ibiblio.equals(www)) {
                System.out.println(ibiblio + " is the same as " + www);
            } else {
                System.out.println(ibiblio + " is not the same as " + www);
            }
        } catch (MalformedURLException ex) {
            System.err.println(ex);
        }
    }
}
```

```text
http://ibiblio.org/ is the same as http://www.ibiblio.org/
```

**This means that `equals()` on a `URL` is potentially a blocking I/O operation!**
For this reason, you should avoid storing `URL`s in data structure
that depend on `equals()` such as `java.util.HashMap`.
Prefer `java.net.URI` for this, and convert back and forth from `URI`s to `URL`s when necessary.

On the other hand, `equals()` does not go so far as to actually compare the resources identified by two URLs.
For example, `http://www.oreilly.com/` is not equal to `http://www.oreilly.com/index.html`;
and `http://www.oreilly.com:80` is not equal to `http://www.oreilly.com/`.



## Conversion

### toURI

The `toURI()` method converts a `URL` object to an equivalent `URI` object:

```text
public URI toURI() throws URISyntaxException
```

This class represents a **Uniform Resource Locator(URL)** and allows the data referred to by the URL to be downloaded. 

One of the easiest ways to connect to a site and retrieve data is through the `URL` class.
All that you need to provide is **the URL** for the site and the details of **the protocol**.

## Construct URL

A URL can be specified as a single string or with separate protocol, host, port, and file specifications.

Relative URLs can also be specified with a `String` and the `URL` object to which it is relative.

## URL Info

`getFile()`, `getHost()`, `getProtocol()` and related methods return the various portions of the URL specified by a `URL` object.

`sameFile()` determines whether a `URL` object refers to the same file as this one.

`getDefaultPort()` returns the default port number for the protocol of the `URL` object; it may differ from the number returned by `getPort()`.

```java
import java.net.MalformedURLException;
import java.net.URL;

public class URLRun {
    public static void main(String[] args) {
        String[] array = new String[]{
                "ftp://mp3:mp3@138.247.121.61:21000/c%3a/",
                "http://www.oreilly.com",
                "http://www.ibiblio.org/nywc/compositions.phtml?category=Piano&name=swan#first_part",
                "http://admin@www.blackstar.com:8080/",
        };
        for (int i = 0; i < array.length; i++) {
            try {
                URL u = new URL(array[i]);
                System.out.println("The URL is " + u);
                System.out.println("The scheme is " + u.getProtocol());
                System.out.println("The authority is " + u.getAuthority());
                System.out.println("The user info is " + u.getUserInfo());

                String host = u.getHost();
                if (host != null) {
                    int atSign = host.indexOf('@');
                    if (atSign != -1) host = host.substring(atSign + 1);
                    System.out.println("The host is " + host);
                } else {
                    System.out.println("The host is null.");
                }

                System.out.println("The port is " + u.getPort());
                System.out.println("The default port is " + u.getDefaultPort());
                System.out.println("The path is " + u.getPath());
                System.out.println("The file is " + u.getFile());
                System.out.println("The ref is " + u.getRef());
                System.out.println("The query string is " + u.getQuery());
            } catch (MalformedURLException ex) {
                System.err.println(args[i] + " is not a URL I understand.");
            }
            System.out.println();
        }
    }
}
```

```text
The URL is ftp://mp3:mp3@138.247.121.61:21000/c%3a/
The scheme is ftp
The authority is mp3:mp3@138.247.121.61:21000
The user info is mp3:mp3
The host is 138.247.121.61
The port is 21000
The default port is 21
The path is /c%3a/
The file is /c%3a/
The ref is null
The query string is null

The URL is http://www.oreilly.com
The scheme is http
The authority is www.oreilly.com
The user info is null
The host is www.oreilly.com
The port is -1
The default port is 80
The path is 
The file is 
The ref is null
The query string is null

The URL is http://www.ibiblio.org/nywc/compositions.phtml?category=Piano&name=swan#first_part
The scheme is http
The authority is www.ibiblio.org
The user info is null
The host is www.ibiblio.org
The port is -1
The default port is 80
The path is /nywc/compositions.phtml
The file is /nywc/compositions.phtml?category=Piano&name=swan
The ref is first_part
The query string is category=Piano&name=swan

The URL is http://admin@www.blackstar.com:8080/
The scheme is http
The authority is admin@www.blackstar.com:8080
The user info is admin
The host is www.blackstar.com
The port is 8080
The default port is 80
The path is /
The file is /
The ref is null
The query string is null
```

## Open Connection

Use `openConnection()` to obtain a `URLConnection` object with which you can download the content of the URL.

For simple cases, however, the `URL` class defines shortcut methods
that create and invoke methods on a `URLConnection` internally.
`getContent()` downloads the URL data and parses it into an appropriate Java object (such as a string or image)
if an appropriate `ContentHandler` can be found.

```java
public final class URL implements java.io.Serializable {
    public Object getContent() {
        return openConnection().getContent();
    }

    /**
     * @since 1.3
     */
    public Object getContent(Class<?>[] classes) {
        return openConnection().getContent(classes);
    }
}
```

In Java 1.3 and later, you can pass **an array of `Class`
objects** that specify the type of objects that you are willing to accept as the return value of this method.

If you wish to parse the URL content yourself,
call `openStream()` to obtain an InputStream from which you can read the data.


