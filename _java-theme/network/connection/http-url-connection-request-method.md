---
title: "HttpURLConnection: The Request Method"
sequence: "110"
---

There are four main HTTP methods, four verbs if you will, that identify the operations that can be performed:

- GET
- POST
- PUT
- DELETE

The `URL` class uses `GET` to communicate with HTTP servers. The `URLConnection` class can use all four of these methods.

By default, `HttpURLConnection` uses the `GET` method. However, you can change this with the `setRequestMethod()` method:

```text
public void setRequestMethod(String method) throws ProtocolException
```

The method argument should be one of these seven case-sensitive strings:

- GET
- POST
- HEAD
- PUT
- DELETE
- OPTIONS
- TRACE

If it's some other method, then a `java.net.ProtocolException`, a subclass of `IOException`, is thrown. However, it's generally not enough to simply set the request method. Depending on what you're trying to do, you may need to adjust the HTTP header and provide a message body as well. For instance, POSTing a form requires you to provide a `Content-length` header.

## HEAD

The `HEAD` function is possibly the simplest of all the request methods. It behaves much like `GET`. However, it tells the server only to return the HTTP header, not to actually send the file. **The most common use of this method** is to **check whether a file has been modified since the last time it was cached**.

## DELETE

The `DELETE` method removes a file at a specified `URL` from a web server. Because this request is an obvious security risk, not all servers will be configured to support it, and those that are will generally demand some sort of authentication.

Even if the server accepts this request, its response is implementation dependent. Some servers may delete the file; others simply move it to a trash directory. Others simply mark it as not readable. Details are left up to the server vendor.

## PUT

Many HTML editors and other programs that want to store files on a web server use the `PUT` method. It allows clients to place documents in the abstract hierarchy of the site without necessarily knowing how the site maps to the actual local filesystem. This contrasts with FTP, where the user has to know the actual directory structure as opposed to the server's virtual directory structure.

As with deleting files, some sort of authentication is usually required and the server must be specially configured to support `PUT`. The details vary from server to server. Most web servers do not support `PUT` out of the box.

## OPTIONS

The `OPTIONS` request method asks what options are supported for a particular URL. If the request URL is an asterisk (`*`), the request applies to the server as a whole rather than to one particular URL on the server.

```txt
OPTIONS /xml/ HTTP/1.1
Host: www.ibiblio.org
Accept: text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2
Connection: close
```

The server responds to an `OPTIONS` request by sending an HTTP header with a list of the commands allowed on that URL. For example, when the previous command was sent, here's what Apache responded with:

```txt
HTTP/1.1 200 OK
Date: Sat, 04 May 2013 13:52:53 GMT
Server: Apache
Allow: GET,HEAD,POST,OPTIONS,TRACE
Content-Style-Type: text/css
Content-Length: 0
Connection: close
Content-Type: text/html; charset=utf-8
```

The list of legal commands is found in the `Allow` field. However, in practice these are just the commands the server understands, not necessarily the ones it will actually perform on that URL.

## TRACE

The `TRACE` request method sends the HTTP header that the server received from the client. The main reason for this information is to see what any proxy servers between the server and client might be changing.

For example, suppose this TRACE request is sent:

```txt
TRACE /xml/ HTTP/1.1
Hello: Push me
Host: www.ibiblio.org
Accept: text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2
Connection: close
```

The server should respond like this:

```txt
HTTP/1.1 200 OK
Date: Sat, 04 May 2013 14:41:40 GMT
Server: Apache
Connection: close
Content-Type: message/http

TRACE /xml/ HTTP/1.1
Hello: Push me
Host: www.ibiblio.org
Accept: text/html, image/gif, image/jpeg, *; q=.2, */*; q=.2
Connection: close
```

The first five lines are the server's normal response HTTP header. The lines from `TRACE /xml/ HTTP/1.1` on are the echo of the original client request. In this case, the echo is faithful. However, if there were a proxy server between the client and server, it might not be.

