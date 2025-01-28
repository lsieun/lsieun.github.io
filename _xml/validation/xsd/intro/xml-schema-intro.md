---
title: "XML Schema Intro"
sequence: "101"
---

What is a schema?

The word schema means a diagram, plan, or framework.
In XML, it refers to a document that describes an XML document.

An XML Schema describes the structure of an XML document.

The XML Schema language is also referred to as **XML Schema Definition** (**XSD**).


XML Schema也是一种用于定义和描述XML文档结构与内容的模式语言，其出现是为了克服DTD的局限性。

XML Schema出现的时间，应该比DTD要晚：查一下时间线。

XML Schema对**名称空间**支持得非常好

名称空间：告诉XML文档的元素被哪个schema文档约束

The XML Schema 1.0 definition language specifies **the structure of an XML document** and **constrains its content**.
The key concept to understand is that **a schema** based on the **XML Schema language** defines a class of **valid** XML documents.
A document is considered **valid** with respect to a schema if it conforms to the structure defined by the schema.

```text
XML Schema language --> a schema --> a class of valid XML documents
```

A **valid** XML document is formally referred to as an **instance** of the schema document.

```text
a valid XML document = an instance of the schema document
```

One more important point to keep in mind is that **a schema is also an XML document**.
In fact, this was one of the key motivations for the XML Schema language;
the alternative structure standard, which is a **DTD**, is not an XML document.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<catalog>
    <journal data="2004-05-05">
        <article>
            <title>Java and XML</title>
            <author>Liu Sen</author>
        </article>
    </journal>
</catalog>
```

A schema can be used to validate:

- The **structure** of elements and attributes.
- The **order** of elements.
- The **data values** of elements and attributes, based on ranges, enumerations, and pattern matching.
- The **uniqueness** of values in an instance.
- A schema can insert **default** and **fixed values** for elements and attributes and normalize **whitespace** according to the type.



