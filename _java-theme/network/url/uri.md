---
title: "URI"
sequence: "101"
---

```text
       ┌─── static ───────┼─── instance ───┼─── create()
       │
       │                                                      ┌─── getScheme()
       │                                                      │
       │                                    ┌─── scheme ──────┼─── getRawSchemeSpecificPart()
       │                                    │                 │
       │                                    │                 └─── getSchemeSpecificPart()
       │                                    │
       │                                    │                 ┌─── getRawAuthority()
       │                                    │                 │
       │                                    ├─── authority ───┼─── getAuthority()
       │                                    │                 │
       │                                    │                 └─── parseServerAuthority()
       │                                    │
       │                                    │                 ┌─── getRawUserInfo()
URI ───┤                                    ├─── user-info ───┤
       │                                    │                 └─── getUserInfo()
       │                  ┌─── component ───┤
       │                  │                 ├─── host ────────┼─── getHost()
       │                  │                 │
       │                  │                 ├─── port ────────┼─── getPort()
       │                  │                 │
       │                  │                 │                 ┌─── getRawPath()
       │                  │                 ├─── path ────────┤
       │                  │                 │                 └─── getPath()
       │                  │                 │
       │                  │                 │                 ┌─── getRawQuery()
       │                  │                 ├─── query ───────┤
       │                  │                 │                 └─── getQuery()
       │                  │                 │
       │                  │                 │                 ┌─── getRawFragment()
       └─── non-static ───┤                 └─── fragment ────┤
                          │                                   └─── getFragment()
                          │
                          │                 ┌─── normal ─────┼─── normalize()
                          ├─── scenario ────┤
                          │                 │                ┌─── resolve()
                          │                 └─── relative ───┤
                          │                                  └─── relativize()
                          │
                          │                 ┌─── isAbsolute()
                          ├─── check ───────┤
                          │                 └─── isOpaque()
                          │
                          │                 ┌─── url ───┼─── toURL()
                          └─── convert ─────┤
                                            └─── str ───┼─── toASCIIString()
```

The `URI` class is an immutable representation of a **Uniform Resource Identifier (URI)**.

A **Uniform Resource Identifier (URI)** is a string of characters in a particular syntax that identifies a resource.
The resource identified may be a file on a server;
but it may also be an email address, a news message, a book, a person's name,
an Internet host, the current stock price of Oracle, or something else.

A resource is a thing that is identified by a URI.
A URI is a string that identifies a resource.
Yes, it is exactly that circular.
**Don't spend too much time worrying about what a resource is or isn't**, because you'll never see one anyway.
**All you ever receive from a server is a representation of a resource which comes in the form of bytes**.
However **a single resource may have different representations**.
For instance, `https://www.un.org/en/documents/udhr/` identifies the Universal Declaration of Human Rights;
but there are representations of the declaration in plain text, XML, PDF, and other formats.
There are also representations of this resource in English, French, Arabic, and many other languages.

**Some of these representations may themselves be resources**.
For instance, `https://www.un.org/en/documents/udhr/` identifies specifically
the English version of the Universal Declaration of Human Rights.

## syntax

The syntax of a URI is composed of a scheme and a scheme-specific part, separated by a colon, like this:

```txt
scheme:scheme-specific-part
```

### schemes

The syntax of the scheme-specific part depends on the scheme being used. Current schemes include:

- `data`: Base64-encoded data included directly in a link; see RFC 2397
- `file`: A file on a local disk
- `ftp`: An FTP server
- `http`: A World Wide Web server using the Hypertext Transfer Protocol
- `mailto`: An email address
- `magnet`: A resource available for download via peer-to-peer networks such as BitTorrent
- `telnet`: A connection to a Telnet-based service
- `urn`: A Uniform Resource Name

In addition, Java makes heavy use of nonstandard custom schemes such as `rmi`, `jar`, `jndi`, and `doc` for various purposes.

### scheme-specific parts

There is no specific syntax that applies to the **scheme-specific parts** of all URIs. However, many have a hierarchical form, like this:

```txt
//authority/path?query
```

The `authority` part of the URI names the authority responsible for resolving the rest of the URI.
For instance, the URI `http://www.ietf.org/rfc/rfc3986.txt` has the scheme `http`,
the authority `www.ietf.org`, and the path `/rfc/rfc3986.txt` (initial slash included).
This means the server at `www.ietf.org` is responsible for mapping the path `/rfc/rfc3986.txt` to a resource.
This URI does not have a query part.

The URI `http://www.powells.com/cgi-bin/biblio?inkey=62-1565928709-0` has the scheme `http`,
the authority `www.powells.com`, the path `/cgi-bin/biblio`, and the query `inkey=62-1565928709-0`.

The URI `urn:isbn:156592870` has the scheme `urn`
but doesn't follow the hierarchical `//authority/path?query` form for scheme-specific parts.

### charset

```txt
scheme://authority/path?query
```

The scheme part is composed of **lowercase letters**, **digits**, and **the plus sign**, **period**, and **hyphen**.
The other three parts of a typical URI (`authority`, `path`, and `query`)
should each be composed of **the ASCII alphanumeric characters** (i.e., the letters `A-Z`, `a-z`, and the digits `0-9`).
In addition, the punctuation characters - _ . ! and ~ may also be used.
Delimiters such as / ? & and = may be used for their predefined purposes.
All other characters, including non-ASCII alphanumerics such as `á` and `ζ` as well as delimiters not being used as delimiters should be escaped by a percent sign (`%`) followed by the hexadecimal codes for the character as encoded in UTF-8. For instance, in UTF-8, `á` is the two bytes `0xC3 0xA1` so it would be encoded as `%c3%a1`. The Chinese character `木` is Unicode code point `0x6728`. In UTF-8, this is encoded as the three bytes `E6`, `9C`, and `A8`. Thus, in a URI it would be encoded as `%E6%9C%A8`.

If you don't hexadecimally encode non-ASCII characters like this, but just include them directly, then instead of a URI you have an IRI (an Internationalized Resource Identifier). IRIs are easier to type and much easier to read, but a lot of software and protocols expect and support only ASCII URIs.

Punctuation characters such as `/` and `@` must also be encoded with **percent escapes** if they are used in any role other than what's specified for them in the scheme-specific part of a particular URL. For example, the forward slashes in the URI `http://www.cafeaulait.org/books/javaio2/` do not need to be encoded as `%2F` because they serve to delimit the hierarchy as specified for the http URI scheme. However, if a filename includes a `/` character—for instance, if the last directory were named **Java I/O** instead of javaio2 to more closely match the name of the book—the URI would have to be written as `http://www.cafeaulait.org/books/Java%20I%2FO/`. This is not as far-fetched as it might sound to Unix or Windows users. Mac filenames frequently include a forward slash. Filenames on many platforms often contain characters that need to be encoded, including @, $, +, =, and many more. And of course URLs are, more often than not, not derived from filenames at all.

```java
import java.net.URI;

public class URIRun {
    public static void main(String[] args) {
        // url: ftp://ftp.oreilly.com
        // username: anonymous
        // password: elharo@ibiblio.org
        URI uri = URI.create("ftp://anonymous:elharo%40ibiblio.org@ftp.oreilly.com:21/pub/stylesheet");
        System.out.println(uri.toString());
    }
}
```

## URI vs. URL


The `URI` supports parsing and textual manipulation of URI strings
but does **not** have any direct **networking capabilities** the way that the `URL` class does.

The advantages of the `URI` class over the `URL` class are that
the `URI` class provides **more general facilities** for parsing and manipulating URLs than the `URL` class;

- it can represent **relative URIs**, which do **not** include **a scheme (or protocol)**; and
- it can manipulate URIs that include **unsupported or even unknown schemes**.

A `URI` identifies **the name of a resource**, such as a website, or a file on the Internet.
It **may** contain **the name of a resource** and **its location**.

A `URL` specifies **where a resource is located**, and **how to retrieve it**(这里应该是指protocol).
**A protocol** forms the first part of the URL, and specifies **how data is retrieved**.
URLs always contain protocol, such as `HTTP`, or `FTP`.
For example, the following two URLs use different protocols.
The first one uses the `HTTPS` protocol, and the second one uses the `FTP` protocol:

- `https://www.packtpub.com/`
- `ftp://speedtest.tele2.net/`

## The general syntax

The general syntax of a URI consists of a scheme and a scheme-specific-part:

```txt
[scheme:] scheme-specific-part
```

There are many schemes that are used with a `URI`, including:

- `file`: This is used for files systems
- `FTP`: This is File Transfer Protocol
- `HTTP`: This is commonly used for websites
- `mailto`: This is used as part of a mail service
- `urn`: This is used to identify a resource by name

The **scheme-specific-part** varies by the scheme that is used.
URIs can be categorized as **absolute** or **relative**, or as opaque or hierarchical.
These distinctions are not of immediate interest to us here,
though Java provides methods to determine whether a URI falls into one of these categories.

## Construct URI

Obtain a URI with one of the constructors,
which allow a URI to be parsed from a single string,
or allow the specification of the individual components of a URI.
These constructors can throw URISyntaxException, which is a checked exception.

When using hard-coded URIs (rather than URIs based on user input),
you may prefer to use the static `create()` method, which does not throw any checked exceptions.

## URI Info

Once you have created a `URI` object, you can use the **various get methods** to query the various portions of the URI.

The `getRaw()` methods are like the `get()` methods, except that they do not decode hexadecimal escape sequences of the form `%xx` that appear in the URI.

`normalize()` returns a new URI object that has `.` and unnecessary `..` sequences removed from its path component.

`resolve()` interprets its URI (or string) argument relative to this URI and returns the result.

`relativize()` performs the reverse operation. It returns a new URI that represents the same resource as the specified URI argument but is relative to this URI.

Finally, the `toURL()` method converts an absolute URI object to the equivalent `URL`.
Since the `URI` class provides superior textual manipulation capabilities for URLs,
it can be useful to use the `URI` class to resolve relative URLs (for example) and
then convert those `URI` objects to `URL` objects when they are ready for networking.

