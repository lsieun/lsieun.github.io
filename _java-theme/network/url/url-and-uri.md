---
title: "URL And URI"
sequence: "103"
---

A **URL** unambiguously identifies the location of a resource on the Internet.

A **URL** is the most common type of **URI**, or **Uniform Resource Identifier**.

> URL是一种常用的URI

A URI can identify a resource by its network location, as in a URL, or by its name, number, or other characteristics.

> URI唯一的标识resource


The `URL` class is the simplest way for a Java program to locate and retrieve data from the network.
You do not need to worry about the details of the protocol being used,
or how to communicate with the server;
you simply tell Java the URL and it gets the data for you.

## URI

A **Uniform Resource Identifier** (**URI**) is a string of characters in a particular syntax that identifies a resource.

> URI是唯一标识resource的特殊语法

A resource is a thing that is identified by a URI.
A URI is a string that identifies a resource.
Yes, it is exactly that circular.
Don't spend too much time worrying about what a resource is or isn't,
because you'll never see one anyway.
All you ever receive from a server is a **representation** of a resource which comes in the form of bytes.

> 不要过份纠结URI和resource两个概念

However **a single resource may have different representations**.
For instance, `https://www.un.org/en/about-us/universal-declaration-of-human-rights` identifies
the Universal Declaration of Human Rights;
but there are representations of the declaration in plain text, XML, PDF, and other formats.
There are also representations of this resource in English, French, Arabic, and many other languages.

> 一个资源有不同的表现形式

The syntax of a URI is composed of a `scheme` and a `scheme-specific-part`, separated by a colon, like this:

```text
scheme:scheme-specific-part
```

The syntax of the `scheme-specific-part` depends on the `scheme` being used.

Current schemes include:

- `data`: Base64-encoded data included directly in a link; see RFC 2397
- `file`: A file on a local disk
- `ftp`: An FTP server
- `http`: A World Wide Web server using the Hypertext Transfer Protocol
- `mailto`: An email address
- `magnet`: A resource available for download via peer-to-peer networks such as BitTorrent
- `telnet`: A connection to a Telnet-based service
- `urn`: A Uniform Resource Name

In addition, Java makes heavy use of **nonstandard custom schemes**
such as `rmi`, `jar`, `jndi`, and `doc` for various purposes.

There is no specific syntax that applies to the `scheme-specific-part`s of all URIs.
However, many have a hierarchical form, like this:

```text
//authority/path?query
```

The **authority** part of the URI names the authority responsible for resolving the rest of the URI.
For instance, the URI `http://www.ietf.org/rfc/rfc3986.txt` has the **scheme** `http`,
the **authority** `www.ietf.org`, and the **path** `/rfc/rfc3986.txt` (initial slash included).
This means the server at `www.ietf.org` is responsible for
mapping the path `/rfc/rfc3986.txt` to a resource.
This URI does not have a **query** part.
The URI `http://www.powells.com/cgi-bin/biblio?inkey=62-1565928709-0` has the **scheme** `http`,
the **authority** `www.powells.com`, the **path** `/cgi-bin/biblio`, and the **query** `inkey=62-1565928709-0`.
The URI `urn:isbn:156592870` has the **scheme** `urn` but doesn't follow the hierarchical `//authority/path?query` form for scheme-specific parts.

The **path** is a string that the **authority** can use to determine which resource is identified.
Different authorities may interpret the same path to refer to different resources.
For instance, the path `/index.html` means one thing when the authority is `www.landoverbaptist.org` and
something very different when the authority is `www.churchofsatan.com`.
**The path may be hierarchical**,
in which case the individual parts are separated by **forward slashes**,
and the `.` and `..` operators are used to navigate the hierarchy.
These are derived from the pathname syntax on the Unix operating systems where the Web and URLs were invented.
They conveniently map to a filesystem stored on a Unix web server.
However, there is no guarantee that the components of any particular path actually correspond to files or directories
on any particular filesystem.

### characters

The **scheme** part is composed of **lowercase letters**, **digits**, and the **plus sign**, **period**, and **hyphen**.
The other three parts of a typical URI (**authority**, **path**, and **query**)
should each be composed of the ASCII alphanumeric characters
(i.e., the letters `A-Z`, `a-z`, and the digits `0-9`).
In addition, the punctuation characters `-` `_` `.` `!` and `~` may also be used.
Delimiters such as `/` `?` `&` and `=` may be used for their predefined purposes.
All other characters, including non-ASCII alphanumerics such as á and ζ as well as delimiters not being used as delimiters
should be escaped by a percent sign (`%`) followed by the hexadecimal codes for the character as encoded in **UTF-8**.
For instance, in UTF-8, á is the two bytes `0xC3 0xA1` so it would be encoded as `%c3%a1`.
The Chinese character `木` is Unicode code point `0x6728`.
In UTF-8, this is encoded as the three bytes `E6`, `9C`, and `A8`.
Thus, in a URI it would be encoded as `%E6%9C%A8`.

If you don't hexadecimally encode non-ASCII characters like this,
but just include them directly,
then instead of a URI you have an **IRI** (an **Internationalized Resource Identifier**).
**IRIs are easier to type and much easier to read,
but a lot of software and protocols expect and support only ASCII URIs.**

**Punctuation characters** such as `/` and `@` must also be encoded with percent escapes
if they are used in any role other than what's specified for them in the `scheme-specific-part` of a particular URL.
For example, the forward slashes in the URI `http://www.cafeaulait.org/books/javaio2/` do not need to be encoded as `%2F`
because they serve to delimit the hierarchy as specified for the `http` URI scheme.
However, if a filename includes a `/` character - for instance,
if the last directory were named `Java I/O` instead of javaio2 to more closely match the name of the book—
the URI would have to be written as `http://www.cafeaulait.org/books/Java%20I%2FO/`.
This is not as far-fetched as it might sound to Unix or Windows users.
Mac filenames frequently include a forward slash.
Filenames on many platforms often contain characters that need to be encoded, including `@`, `$`, `+`, `=`, and many more.
And of course URLs are, more often than not, not derived from filenames at all.

## URL

A URL is a URI that, as well as identifying a resource, provides a specific network location for the resource
that a client can use to retrieve a representation of that resource.

> URL = identifying a resource + specific network location for the resource

By contrast, a generic URI may tell you what a resource is,
but not actually tell you where or how to get that resource.

> URI = what a resource is

In the physical world, it's the difference between the title
“Harry Potter and The Deathly Hallows” and the library location “Room 312, Row 28, Shelf 7”.

In Java, it's the difference between the `java.net.URI` class that only identifies resources and
the `java.net.URL` class that can both identify and retrieve resources.

> java.net.URI = identify resources  
> java.net.URL = identify and retrieve resources

The network location in a URL usually includes the **protocol** used to access a server (e.g., FTP, HTTP),
the **hostname or IP address of the server**,
and **the path to the resource** on that server.
A typical URL looks like `http://www.ibiblio.org/javafaq/javatutorial.html`.
This specifies that there is a file called `javatutorial.html` in a directory called `javafaq`
on the server `www.ibiblio.org`, and that this file can be accessed via the HTTP protocol.

The syntax of a URL is:

```text
protocol://userInfo@host:port/path?query#fragment
```

Here the **protocol** is another word for what was called the **scheme** of the **URI**.
(**Scheme** is the word used in the URI RFC. **Protocol** is the word used in the Java documentation.)
In a URL, the `protocol` part can be `file`, `ftp`, `http`, `https`, `magnet`, `telnet`, or various other strings (though not `urn`).

The `host` part of a URL is the name of the server that provides the resource you want.
It can be a **hostname** such as `www.oreilly.com` or `utopia.poly.edu` or an **IP address**,
such as `204.148.40.9` or `128.238.3.21`.

The `userInfo` is optional login information for the server.
If present, it contains a username and, rarely, a password.

The `port` number is also optional.
It's not necessary if the service is running on its default port (port `80` for HTTP servers).

Together, the `userInfo`, `host`, and `port` constitute the `authority`.

The **path** points to a particular resource on the specified server.
It often looks like a filesystem path such as `/forum/index.php`.
However, it may or may not actually map to a filesystem on the server.
If it does map to a filesystem, the path is relative to the document root of the server,
not necessarily to the root of the filesystem on the server.
As a rule, servers that are open to the public do not show their entire filesystem to clients.
Rather, they show only the contents of a specified directory.
This directory is called the document root, and all paths and filenames are relative to it.
Thus, on a Unix server, all files that are available to the public might be in `/var/public/html`,
but to somebody connecting from a remote machine, this directory looks like the root of the filesystem.

The **query** string provides additional arguments for the server.
It's commonly used only in `http` URLs, where it contains form data for input to programs running on the server.

Finally, the **fragment** references a particular part of the remote resource.
If the remote resource is HTML, the fragment identifier names an anchor in the HTML document.

Technically, a string that contains a **fragment** identifier is a **URL reference**, not a **URL**.
Java, however, does not distinguish between **URL**s and **URL references**.

## Relative URLs

A URL tells a web browser a lot about a document:
the protocol used to retrieve the document,
the host where the document lives,
and the path to the document on that host.

Most of this information is likely to be the same for other URLs that are referenced in the document.
Therefore, rather than requiring each URL to be specified in its entirety,
a URL may inherit the protocol, hostname, and path of its parent document (i.e., the document in which it appears).
URLs that aren't complete but inherit pieces from their parent are called **relative URLs**.
In contrast, a completely specified URL is called an **absolute URL**.

In a relative URL, any pieces that are missing are assumed to be the
same as the corresponding pieces from the URL of the document in which the URL is found.
For example, suppose that while browsing `http://www.ibiblio.org/javafaq/javatutorial.html` you click on this hyperlink:

```text
<a href="javafaq.html">
```

The browser cuts `javatutorial.html` off the end of `http://www.ibiblio.org/javafaq/javatutorial.html`
to get `http://www.ibiblio.org/javafaq/`.
Then it attaches `javafaq.html` onto the end of `http://www.ibiblio.org/javafaq/`
to get `http://www.ibiblio.org/javafaq/javafaq.html`. Finally, it loads that document.

**If the relative link begins with a `/`**,
then it is relative to the document root instead of relative to the current file.
Thus, if you click on the following link while browsing `http://www.ibiblio.org/javafaq/javatutorial.html`:

```text
<a href="/projects/ipv6/">
```

the browser would throw away `/javafaq/javatutorial.html` and attach `/projects/ipv6/` to
the end of `http://www.ibiblio.org` to get `http://www.ibiblio.org/projects/ipv6/`.

Relative URLs have a number of advantages.
First-and least important-they save a little typing.
**More importantly, relative URLs allow a single document tree to be served by multiple protocols**:
for instance, both HTTP and FTP.
HTTP might be used for direct surfing, while FTP could be used for mirroring the site.
**Most importantly of all,
relative URLs allow entire trees of documents to be moved or copied from one site to another
without breaking all the internal links.**

## Reference

- [Converting between URLs and Filesystem Paths](https://maven.apache.org/plugin-developers/common-bugs.html#converting-between-urls-and-filesystem-paths)
