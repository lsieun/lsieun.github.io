---
title: "XML Syntax - Basic"
sequence: "101"
---

## XML Declaration

```text
<?xml version="1.0" encoding="UTF-8"?>
```

A well-formed XML document can begin with an XML declaration,
which is special markup telling an XML parser that the document is XML.

> 作用

An XML declaration can be omitted, but if it appears, it should be the first thing within a document.

> 可以省略，位置：第一个

### version

The `version` attribute specifies the XML version, and it is a **required** attribute.

```text
<?xml version="1.0"?>
```

The initial version of this specification (1.0) was introduced in 1998 and is widely implemented.

> XML 1.0是1998年发布

The W3C, which maintains XML, released version 1.1 in 2004.

> XML 1.1是2004年发布

Unlike XML 1.0, XML 1.1 isn't widely implemented and should be used only by those needing its unique features.

> 版本：流行1.0版本

### encoding

The `encoding` attribute specifies the character set used to encode data in an XML document.

> 作用

**XML supports Unicode**,
which means that XML documents consist entirely of characters taken from the Unicode character set.

> 支持的字符集

One common encoding is `UTF-8`, which is a variable-length encoding of the Unicode character set.

> 常用字符集：UTF-8

```text
<?xml version="1.0" encoding="UTF-8"?>
```

In the absence of the XML declaration or when the XML declaration's `encoding` attribute isn't present,
an XML parser typically looks for a special character sequence at the start of a document
to determine the document's encoding.
This character sequence is known as the **byte-order-mark (BOM)**
and is created by an editor program (such as Microsoft Windows Notepad)
when it saves the document according to `UTF-8` or some other encoding.
For example, the hexadecimal sequence `EF BB BF` signifies `UTF-8` as the encoding.
Similarly, `FE FF` signifies `UTF-16` big endian,
`FF FE` signifies UTF-16 little endian,
`00 00 FE FF` signifies UTF-32 big endian,
and `FF FE 00 00` signifies UTF-32 little endian.

> 如果有BOM，则依据BOM来判断encoding

UTF-8 is assumed when no BOM is present.

> 如果没有BOM，则使用UTF-8作为encoding

### standalone

The `standalone` attribute specifies whether the XML document references external entities.
If no external entities are referenced, specify the `standalone` attribute as `yes`.

```text
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
```

This **optional attribute**, which is only relevant with DTDs,
determines if there are external markup declarations
that affect the information passed from an XML processor (a parser) to the application.

> standalone属性与DTD相关

Its value defaults to `no`, implying that there are, or may be, such declarations.
A `yes` value indicates that there are no such declarations.

> 默认值：no

可选择的值：

- yes
- no


## Elements vs. Attributes

In XML, there are no rules about when to use attributes, and when to use child elements.

### Avoid using attributes

Some of the problems with attributes are:

- attributes cannot contain multiple values (child elements can)
- attributes are not easily expandable (for future changes)
- attributes cannot describe structures (child elements can)
- attributes are more difficult to manipulate by program code
- attribute values are not easy to test against a DTD

If you use attributes as containers for data, you end up with documents that are difficult to read and maintain.
Try to use elements to describe data.
Use attributes only to provide information that is not relevant to the data.

Metadata (data about data) should be stored as attributes, and that data itself should be stored as elements.

## Comments

You can define comments in an XML document within a comment declaration:

```text
<!-- This is a comment -->
```

Comments can appear anywhere outside **markup**,
which consists of start tags, end tags, empty element tags, comments, CDATA sections, escape character references, and entity references.

