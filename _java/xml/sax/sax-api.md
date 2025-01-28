---
title: "SAX API"
sequence: "151"
---

| SAX 1.0         | SAX 2.0        |
|-----------------|----------------|
| DocumentHandler | ContentHandler |
| Parser          | XMLReader      |

- In SAX2, `DocumentHandler` has been replaced by `ContentHandler`, which provides **Namespace support** and **reporting of skipped entities**.
- In SAX2, `Parser` has been replaced in SAX2 by `XMLReader`, which includes **Namespace support** and **sophisticated configurability and extensibility**.

`SAXParser`是幸存下来的类，它就像一个两朝元老。

## What Is SAX?

Simple API for XML (SAX) is an event-based Java API for parsing an XML document sequentially from start to finish.
When a SAX-oriented parser encounters **an item** from the document's infoset
(an abstract data model describing an XML document's information; see http://en.wikipedia.org/wiki/XML_Information_Set),
it makes this **item** available to an application as **an event** by calling one of the methods
in one of the application's handlers  
(objects whose methods are called by the parser to make event information available),
which the application has previously registered with the parser.
The application can then consume **this event** by processing the infoset item in some manner.

A SAX parser is more memory efficient than a DOM parser in that it doesn't require the entire document to fit into memory.
This benefit becomes a drawback for using XPath and XSLT, which require that the entire document be stored in memory.

According to its [official web site](http://www.saxproject.org/), SAX originated as an XML-parsing API for Java.
However, SAX isn't exclusive to Java.
Microsoft also supports [SAX for its .NET framework](http://saxdotnet.sourceforge.net/).

## Exploring the SAX API

SAX exists in two major versions.
Java implements **SAX 1** through the `javax.xml.parsers` package's abstract `SAXParser` and `SAXParserFactory` classes,
and implements **SAX 2** through the `org.xml.sax` package's `XMLReader` interface
and through the `org.xml.sax.helpers` package's `XMLReaderFactory` class.
The `org.xml.sax`, `org.xml.sax.ext`, and `org.xml.sax.helpers` packages provide various types that augment both Java implementations.

- SAX1
  - javax.xml.parsers
- SAX2
  - org.xml.sax
  - org.xml.sax.ext
  - org.xml.sax.helpers

I explore only the **SAX 2 implementation** because SAX 2 makes available additional infoset items about an XML document
(such as **comments** and **CDATA** section notifications).

### Obtaining a SAX 2 Parser

Classes that implement the `XMLReader` interface describe SAX 2-based parsers.
Instances of these classes are obtained by calling the `XMLReaderFactory` class's `createXMLReader()` class methods.
For example, the following code fragment invokes this class's `XMLReader createXMLReader()` class method
to create and return an `XMLReader` object:

```text
XMLReader xmlr = XMLReaderFactory.createXMLReader();
```

Behind the scenes, `createXMLReader()` attempts to create an `XMLReader` object
from system defaults according to a lookup procedure
that first examines the `org.xml.sax.driver` system property to see if it has a value.
If so, this property's value is used as the name of the class that implements `XMLReader`.
Furthermore, an attempt to instantiate this class and return the instance is made.
An instance of the `org.xml.sax.SAXException` class is thrown
when `createXMLReader()` cannot obtain an appropriate class or instantiate the class.

You typically install a new content handler, DTD handler, entity resolver, or error handler before a document is parsed,
but you can also do so while parsing the document.
The parser starts using the handler when the next event occurs.






DOM解析的缺点：不适合读取大容量的文件，容易导致内存溢出。

SAX解析原理：加载一点，读取一点，处理一点。对内存要求比较低。

SAX解析工具：Oracle公司提供的，内置在JDK中`org.xml.sax`包。

核心的API：

- `javax.xml.parsers.SAXParser`类的`parse(File f, DefaultHandler dh)`方法

`javax.xml.stream.XMLStreamConstants`

| 方面   | DOM解析                                        | SAX解析                     |
|------|----------------------------------------------|---------------------------|
| 原理   | 一次加载XML文档，不适合大容量的文件读取                        | 加载一点，读取一点，处理一点，适合大容量的文件读取 |
| 操作   | DOM解析可以进行任意的增删改查                             | SAX解析只能读取                 |
| 顺序   | DOM解析任意读取任何位置，甚至往回读                          | SAX解析只能从上往下，按顺序读取，不能往回读   |
| 编程方式 | DOM解析是面向对象编程的方法（Node、Element、Attribute），比如简单 | SAX解析基于事件的编程方法，开发编码相对复杂   |

