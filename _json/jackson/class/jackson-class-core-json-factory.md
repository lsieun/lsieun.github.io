---
title: "JsonFactory"
sequence: "JsonFactory"
---

The `JsonFactory` class is the main factory class of Jackson package,
used to configure and construct reader (aka parser, `JsonParser`) and writer (aka generator, `JsonGenerator`) instances.

```text
               ┌─── reader ───┼─── JsonParser
JsonFactory ───┤
               └─── writer ───┼─── JsonGenerator
```

Factory instances are thread-safe and reusable after configuration (if any).
Typically applications and services use only a single globally shared factory instance,
unless they need differently configured factories.
Factory reuse is important if efficiency matters;
most recycling of expensive construct is done on per-factory basis.

```text
笔记：JsonFactory 是线程安全的；为了提高效率，应该尽量重复利用
```

Creation of a factory instance is a light-weight operation,
and since there is no need for pluggable alternative implementations
(as there is no "standard" JSON processor API to implement),
the default constructor is used for constructing factory instances.


```java
public class JsonFactory
    extends TokenStreamFactory
    implements Versioned,
        java.io.Serializable // since 2.1 (for Android, mostly)
{}
```

```text
                                                      ┌─── createParser(File f)
                                                      │
                                                      ├─── createParser(URL url)
                                                      │
                                                      ├─── createParser(InputStream in)
                                                      │
                                                      ├─── createParser(Reader r)
                                                      │
                                                      ├─── createParser(byte[] data)
                                 ┌─── blocking ───────┤
                                 │                    ├─── createParser(byte[] data, int offset, int len)
                                 │                    │
                                 │                    ├─── createParser(String content)
                                 │                    │
                                 │                    ├─── createParser(char[] content)
               ┌─── Parser ──────┤                    │
               │                 │                    ├─── createParser(char[] content, int offset, int len)
               │                 │                    │
               │                 │                    └─── createParser(DataInput in)
               │                 │
               │                 │                    ┌─── createNonBlockingByteArrayParser()
               │                 └─── non-blocking ───┤
JsonFactory ───┤                                      └─── createNonBlockingByteBufferParser()
               │
               │                 ┌─── createGenerator(OutputStream out, JsonEncoding enc)
               │                 │
               │                 ├─── createGenerator(OutputStream out)
               │                 │
               │                 ├─── createGenerator(Writer w)
               └─── Generator ───┤
                                 ├─── createGenerator(File f, JsonEncoding enc)
                                 │
                                 ├─── createGenerator(DataOutput out, JsonEncoding enc)
                                 │
                                 └─── createGenerator(DataOutput out)
```

