---
title: "Channels"
sequence: "102"
---

[UP](/java-nio.html)


## The Channels Class

`Channels` is a simple utility class for
wrapping **channels** around traditional I/O-based **streams**, **readers**, and **writers**, and vice versa.
It's useful when you want to use the new I/O model in one part of a program for performance,
but still interoperate with legacy APIs that expect streams.
It has methods that convert from **streams** to **channels** and methods
that convert from **channels** to **streams**, **readers**, and **writers**:

```text
public static InputStream newInputStream(ReadableByteChannel ch)
public static OutputStream newOutputStream(WritableByteChannel ch)
public static ReadableByteChannel newChannel(InputStream in)
public static WritableByteChannel newChannel(OutputStream out)
public static Reader newReader (ReadableByteChannel channel, CharsetDecoder decoder, int minimumBufferCapacity)
public static Reader newReader (ReadableByteChannel ch, String encoding)
public static Writer newWriter (WritableByteChannel ch, String encoding)
```

The `SocketChannel` class implements both the `ReadableByteChannel` and `WritableByteChannel` interfaces.
`ServerSocketChannel` implements neither of these because you can't read from or write to it.

For example, all current XML APIs use **streams**, **files**, **readers**,
and other traditional I/O APIs to read the XML document.
If you're writing an HTTP server designed to process SOAP requests,
you may want to read the HTTP request bodies using **channels** and parse the XML using SAX for performance.
In this case, you'd need to convert these **channels** into **streams**
before passing them to `XMLReader`'s `parse()` method:

```text
SocketChannel channel = server.accept();
processHTTPHeader(channel);
XMLReader parser = XMLReaderFactory.createXMLReader();
parser.setContentHandler(someContentHandlerObject);
InputStream in = Channels.newInputStream(channel);
parser.parse(in);
```
