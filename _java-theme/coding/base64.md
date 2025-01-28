---
title: "Base64"
sequence: "102"
---

URL:[http://www.baeldung.com/java-base64-encode-and-decode](http://www.baeldung.com/java-base64-encode-and-decode)

## Overview

We're mainly going to illustrate **the new Java 8 APIs** as well as **the utility APIs coming out of Apache Commons**.

> 从两个角度讲：the new Java 8 APIs 和 the utility APIs coming out of Apache Commons


## Java 8 for Base 64

**Java 8** has finally added **Base64 capabilities** to **the standard API**, via the `java.util.Base64` utility class.

Let's start by looking a basic encoder process.

### Java 8 Basic Base64

The basic encoder keeps things simple and encodes the input as is –– without any line separation.

> 经过basic encoder生成的“结果字符串”中不包含换行（without any line separation）

The output is mapped to a set of characters in A-Za-z0-9+/ character set and the decoder rejects any character outside of this set.

> “结果字符串”是由“A-Za-z0-9+/”组成的，在进行decode时，会抛弃“A-Za-z0-9+/”范围之外的字符

Let's first encode a simple String:

```text
String originalInput = "test input";
String encodedString = Base64.getEncoder().encodeToString(originalInput.getBytes());
```

Note how we retrieve the full Encoder API via the simple `getEncoder()` utility method.

> 通过Base64.getEncoder()方法来获取Encoder API

Let's now decode that String back to the original form:

```text
byte[] decodedBytes = Base64.getDecoder().decode(encodedString);
String decodedString = new String(decodedBytes);
```

> 通过Base64.getDecoder()方法来获取Decoder API


### Java 8 Base64 Encoding without Padding

In Base64 encoding, the length of output encoded String must be a multiple of 3. If it's not, the output will be padded with additional pad characters (`=`).

On decoding, these extra padding characters will be discarded. To dig deeper into padding in Base64, check out [this detailed answer over on StackOverflow](http://stackoverflow.com/a/18518605/370481).

If you need to skip **the padding of the output** – perhaps, because the resulting String will never be decoded back – you can simply chose to encode without padding:

```text
String encodedString = Base64.getEncoder().withoutPadding().encodeToString(originalInput.getBytes());
```

### Java 8 URL Encoding

URL encoding is very similar to the basic encoder we looked at above. It uses the URL and Filename safe Base64 alphabet and does not add any line separation:

```text
String originalUrl = "https://www.google.co.nz/?gfe_rd=cr&ei=dzbFV&gws_rd=ssl#q=java";
String encodedUrl = Base64.getUrlEncoder().encodeToString(originalUrl.getBytes());
```

> 注意上面用到的是Base64.getUrlEncoder()方法，而不是之前的Base64.getEncoder()方法

Decoding happens in much the same way – the `getUrlDecoder()` utility method returns `a java.util.Base64.Decoder` that is then used to decode the URL:

```text
byte[] decodedBytes = Base64.getUrlDecoder().decode(encodedUrl);
String decodedUrl = new String(decodedBytes);
```

> 注意上面用到的是Base64.getUrlDecoder()方法，而不是之前的Base64.getDecoder()方法

### Java 8 MIME Encoding

Let's start with by generating some basic MIME input to encode:

```text
private static StringBuilder getMimeBuffer() {
    StringBuilder buffer = new StringBuilder();
    for (int count = 0; count < 10; ++count) {
        buffer.append(UUID.randomUUID().toString());
    }
    return buffer;
}
```

The MIME encoder generates a Base64 encoded output using the basic alphabet but in a MIME friendly format: each line of the output is no longer than 76 characters and ends with a carriage return followed by a linefeed (\r\n):

> MIME encoder输出的结果支持换行

```text
StringBuilder buffer = getMimeBuffer();
byte[] encodedAsBytes = buffer.toString().getBytes();
String encodedMime = Base64.getMimeEncoder().encodeToString(encodedAsBytes);
```

> 注意上面用到的是Base64.getMimeEncoder()方法，可与上面的示例进行对比

The `getMimeDecoder()` utility method returns a `java.util.Base64.Decoder` that is then used in the decoding process:

```text
byte[] decodedBytes = Base64.getMimeDecoder().decode(encodedMime);
String decodedMime = new String(decodedBytes);
```

> 注意上面用到的是Base64.getMimeDecoder()方法，可与上面的示例进行对比

## Encoding/Decoding Using Apache Commons Code

First, we need to define the commons-codec dependency in the `pom.xml`:

```xml
<dependency>
    <groupId>commons-codec</groupId>
    <artifactId>commons-codec</artifactId>
    <version>1.10</version>
</dependency>
```

Note that you can check is newer versions of the library have been released over on Maven central.

The main API is `the org.apache.commons.codec.binary.Base64` class – which can be parameterized with various constructors:

- Base64(boolean urlSafe) – creates the Base64 API by controlling the URL-safe mode – on or off
- Base64(int lineLength) – creates the Base64 API in an URL unsafe mode and controlling the length of the line (default is 76)
- Base64(int lineLength, byte[] lineSeparator) – creates the Base64 API by accepting an extra line separator, which, by default is CRLF (“\r\n”)

On the Base64 API is created, both encoding and decoding are quite simple:

```text
String originalInput = "test input";
Base64 base64 = new Base64();
String encodedString = new String(base64.encode(originalInput.getBytes()));
```

The `decode()` method of Base64 class returns the decoded string:

```text
String decodedString = new String(base64.decode(encodedString.getBytes()));
```

Another simple option is **using the static API of Base64** instead of creating an instance:

```text
String originalInput = "test input";
String encodedString = new String(Base64.encodeBase64(originalInput.getBytes()));
String decodedString = new String(Base64.decodeBase64(encodedString.getBytes()));
```

## Conclusion

This article explains the basics of how to do Base64 encoding and decoding in Java, using the new APIs introduced in Java 8 as well as Apache Commons.

Finally, there are a few other APIs that are worth mentioning for providing similar functionality – for example `java.xml.bind.DataTypeConverter` with `printHexBinary` and `parseBase64Binary`.

Code snippets can be found [over on GitHub](https://github.com/eugenp/tutorials/tree/master/core-java-8).
