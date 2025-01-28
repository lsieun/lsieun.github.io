---
title: "HttpURLConnection: Request"
sequence: "111"
---

## Streaming Mode

Every request sent to an HTTP server has an HTTP header. One field in this header is the `Content-length` (i.e., the number of bytes in the body of the request). The header comes before the body. However, to write the header you need to know the length of the body, which you may not have yet. Normally, the way Java solves this catch-22 is by caching everything you write onto the `OutputStream` retrieved from the `HttpURLConnection` until the stream is closed. At that point, it knows how many bytes are in the body so it has enough information to write the `Content-length` header.

> “Catch-22”，已经成为英语中“难以逾越的障碍”或“无法摆脱的困境”、 自相矛盾的、荒谬的、带有欺骗忽悠性质的暗黑规则的代名词。来源于美国作家约瑟夫·海勒创作的长篇小说《第二十二条军规》。在该小说中，根据“第二十二条军规”理论，只有疯子才能获准免于飞行，但必须由本人提出申请。但你一旦提出申请，恰好证明你是一个正常人，还是在劫难逃。第二十二条军规还规定，飞行员飞满25架次就能回国。但规定又强调，你必须绝对服从命令，要不就不能回国。因此上级可以不断给飞行员增加飞行次数，而你不得违抗。如此反复，永无休止。

This scheme is fine for small requests sent in response to typical web forms. However, it's burdensome for responses to very long forms or some SOAP messages. It's very wasteful and slow for medium or large documents sent with HTTP PUT. It's much more efficient if Java doesn't have to wait for the last byte of data to be written before sending the first byte of data over the network. Java offers **two solutions** to this problem. **If you know the size of your data**—for instance, you're uploading a file of known size using HTTP PUT —you can tell the `HttpURLConnection` object the size of that data. **If you don't know the size of the data in advance**, you can use **chunked transfer encoding** instead.

### chunked transfer encoding

In chunked transfer encoding, the body of the request is sent in multiple pieces, each with its own separate content length. To turn on chunked transfer encoding, just pass **the size of the chunks** you want to the `setChunkedStreamingMode()` method before you connect the URL:

```text
public void setChunkedStreamingMode(int chunkLength)
```

Java will then use a slightly different form of HTTP than the examples in this book. However, to the Java programmer, the difference is irrelevant. As long as you're using the `URLConnection` class instead of raw sockets and as long as the server supports chunked transfer encoding, it should all just work without any further changes to your code.

However, **chunked transfer encoding** does get in the way of **authentication** and **redirection**. If you're trying to send chunked files to a redirected URL or one that requires password authentication, an `HttpRetryException` will be thrown. You'll then need to retry the request at the new URL or at the old URL with the appropriate credentials; and this all needs to be done manually without the full support of the HTTP protocol handler you normally have. Therefore, **don't use chunked transfer encoding unless you really need it**. As with most performance advice, this means you shouldn't implement this optimization until measurements prove the nonstreaming default is a bottleneck.

### fixed-length streaming mode

**If you do happen to know the size of the request data in advance**, you can optimize the connection by providing this information to the `HttpURLConnection` object. If you do this, Java can start streaming the data over the network immediately. Otherwise, it has to cache everything you write in order to determine the content length, and only send it over the network after you've closed the stream. If you know exactly how big your data is, pass that number to the `setFixedLengthStreamingMode()` method:

```text
public void setFixedLengthStreamingMode(int contentLength)
public void setFixedLengthStreamingMode(long contentLength) // Java 7
```

Because this number can actually be larger than the maximum size of an `int`, in Java 7 and later you can use a `long` instead.

Java will use this number in the `Content-length` HTTP header field. However, if you then try to write more or less than the number of bytes given here, Java will throw an `IOException`. Of course, that happens later, when you're writing data, not when you first call this method. The `setFixedLengthStreamingMode()` method itself will throw an `IllegalArgumentException` if you pass in **a negative number**, or an `IllegalStateException` if the connection is connected or has already been set to chunked transfer encoding. (You can't use both chunked transfer encoding and fixed-length streaming mode on the same request.)”

Fixed-length streaming mode is transparent on the server side. Servers neither know nor care how the `Content-length` was set, as long as it's correct. However, like chunked transfer encoding, streaming mode does interfere with authentication and redirection. If either of these is required for a given URL, an `HttpRetryException` will be thrown; you have to manually retry. Therefore, don't use this mode unless you really need it.

