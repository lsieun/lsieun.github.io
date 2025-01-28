---
title: "URLConnection: Writing Request Data to a Server"
sequence: "105"
---

Sometimes you need to write data to a `URLConnection`, for example,
when you submit a form to a web server using `POST` or upload a file using `PUT`.
The `getOutputStream()` method returns an `OutputStream` on which you can write data for transmission to a server:

```text
public OutputStream getOutputStream()
```

A `URLConnection` doesn't allow output by default,
so you have to call `setDoOutput(true)` before asking for an output stream.
When you set `doOutput` to `true` for an http URL, the request method is changed from `GET` to `POST`.

Once you have an `OutputStream`, buffer it by chaining it to a `BufferedOutputStream` or a `BufferedWriter`.
You may also chain it to a `DataOutputStream`, an `OutputStreamWriter`,
or some other class that's more convenient to use than a raw `OutputStream`.

```java
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;

public class URLRun {
    public static void main(String[] args) {
        try {
            URL u = new URL("http://www.somehost.com/cgi-bin/acgi");
            // open the connection and prepare it to POST
            URLConnection uc = u.openConnection();
            uc.setDoOutput(true);
            OutputStream raw = uc.getOutputStream();
            OutputStream buffered = new BufferedOutputStream(raw);
            OutputStreamWriter out = new OutputStreamWriter(buffered, StandardCharsets.ISO_8859_1);
            out.write("first=Julie&middle=&last=Harting&work=String+Quartet\r\n");
            out.flush();
            out.close();
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
```

Sending data with `POST` is almost as easy as with `GET`.
Invoke `setDoOutput(true)` and use the `URLConnection`'s `getOutputStream()` method
to write the query string rather than attaching it to the URL.
**Java buffers all the data written onto the output stream until the stream is closed**.
This enables it to calculate the value for the `Content-length` header.

The `getOutputStream()` method is also used for the `PUT` request method, a means of storing files on a web server.
The data to be stored is written onto the `OutputStream` that `getOutputStream()` returns.
However, this can be done only from within the `HttpURLConnection` subclass of `URLConnection`,
so discussion of `PUT` will have to wait a little while.

```bash
$ telnet www.cafeaulait.org 80
Trying 152.19.134.41...
Connected to www.cafeaulait.org.
Escape character is '^]'.
POST /books/jnp3/postquery.phtml HTTP/1.0
Accept: text/plain
Content-type: application/x-www-form-urlencoded
Content-length: 63
Connection: close
Host: www.cafeaulait.org

username=Elliotte+Rusty+Harold&email=elharo%40ibiblio%2eorg

HTTP/1.1 200 OK
Date: Wed, 12 Feb 2020 16:29:40 GMT
Server: Apache
Set-Cookie: TestCookie=test123
Set-Cookie: TestExpiresCookie=expiresinanhour; expires=Wed, 12-Feb-2020 17:30:05 GMT; Max-Age=3600
Set-Cookie: TestPathCookie=%2Fbooks; expires=Wed, 12-Feb-2020 17:30:05 GMT; Max-Age=3600; path=/books
Set-Cookie: TestDomainCookie=domaintest; domain=.cafeaulait.org
Content-Style-Type: text/css
Content-Length: 901
Connection: close
Content-Type: text/html; charset=UTF-8

```

