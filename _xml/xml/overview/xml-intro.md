---
title: "XML Intro"
sequence: "101"
---

XML = eXtensible Markup Language

## 历史发展

XML 1.0 was made a W3C Recommendation in 1998.

- 1986, SGML
- 1995, HTML 2
- 1996, Java 1
- 1997, HTML 3
- 1997, HTML 4
- 1998, XML 1.0. It has undergone minor revisions since then, without being given a new version number, and is currently in its fifth edition, as published on November 26, 2008. It is widely implemented and still recommended for general use.
- 1999, XPath 1.0
- 2001-05-02, XML Schema 1.0 first edition
- 2004-10-28, XML Schema 1.0 second edition
- 2004, XML 1.1. XML 1.1 is not very widely implemented and is recommended for use only by those who need its particular features.
- 2007, XPath 2.0
- 2012-04-05, XML Schema 1.1
- 2014, HTML5

An XML document is textual in nature.
XML-wise, the document consists of **character data** and **markup**.
Both are represented by text.

- text
  - character data
  - markup

Ultimately, it's the **character data** we are interested in because that's the information.
However, the **markup** is important because it records **the structure of the document**.

There are a variery of markup constructs in XML but it is easy to recognize the markup
because it is always enclosed in angle brackets.

- Maven: `pom.xml`
- Servlet的配置文件：`web.xml`
- Spring的配置文件：`org.springframework.beans.factory.xml.XmlBeanDefinitionReader`
- Tomcat的配置文件：




## XML Language Features

XML provides several language features for use in defining custom markup languages:

- XML declaration
- elements and attributes
- character references and CDATA sections
- namespaces
- comments and processing instructions

### XML Declaration



### Elements and Attributes

Elements can contain child elements, content, or mixed content (a combination of child elements and content).

An XML element's start tag can contain one or more **attributes** .

Element and attribute names may contain any alphanumeric character from English or another language,
and may also include the **underscore** (`_`), **hyphen** (`-`), **period** (`.`), and **colon** (`:`) punctuation characters.
The **colon** should only be used with **namespaces**, and **names cannot contain whitespace**.

### Character References and CDATA Sections

Certain characters cannot appear literally in the content
that appears between a **start tag** and an **end tag** or within an **attribute** value.
For example, you cannot place a literal `<` character between a start tag and an end tag
because doing so would confuse an XML parser into thinking that it had encountered another tag.

One solution to this problem is to replace the **literal character** with a **character reference**,
which is a code that represents the character.
**Character references** are classified as **numeric character references** or **character entity references**:

- numeric character references
- character entity references

A **numeric character reference** refers to a character via its Unicode code point and adheres to the format `&#nnnn;`
(not restricted to four positions) or `&#xhhhh;` (not restricted to four positions),
where `nnnn` provides a decimal representation of the code point and `hhhh` provides a hexadecimal representation.
For example, `&#0931;` and `&#x03A3;` represent the Greek capital letter sigma.
Although XML mandates that the `x` in `&#xhhhh;` be lowercase,
it's flexible in that the leading zero is optional in either format and
in allowing you to specify an uppercase or lowercase letter for each `h`.
As a result, `&#931;`, `&#x3A3;`, and `&#x03a3;` are also valid representations of the Greek capital letter sigma.

A **character entity reference** refers to a character via the name of an entity (aliased data)
that specifies the desired character as its replacement text.
Character entity references are predefined by XML and have the format `&name;`,
in which `name` is the entity's name.
XML predefines five character entity references:
`&lt;` (`<`), `&gt;` (`>`), `&amp;` (`&`), `&apos;` (`'`), and `&quot;` (`"`).

Consider `<expression>6 < 4</expression>`.
You could replace the `<` with numeric reference `&#60;`,
yielding `<expression>6 &#60; 4</expression>`,
or better yet with `&lt;`, yielding `<expression>6 &lt; 4</expression>`.
The second choice is clearer and easier to remember.

Suppose you want to embed an HTML or XML document within an element.
To make the embedded document acceptable to an XML parser,
you would need to replace each literal `<` (start of tag) and `&` (start of entity) character
with its `&lt;` and `&amp;` predefined character entity reference,
a tedious and possibly error-prone undertaking—you might forget to replace one of these characters.
To save you from tedium and potential errors,
XML provides an alternative in the form of a **CDATA** (**character data**) section .

A CDATA section is a section of literal HTML or XML markup and content surrounded by
the `<![CDATA[` prefix and the `]]>` suffix.

## Namespaces

It's common to create XML documents that combine features from different XML languages.
**Namespaces are used to prevent name conflicts** when elements and other XML language features appear.
Without namespaces, an XML parser couldn't distinguish between same-named elements
or other language features that mean different things,
such as two same-named title elements from two different languages.

Namespaces aren't part of XML 1.0.
They arrived about a year after this specification was released.
To ensure backward compatibility with XML 1.0, namespaces take advantage of colon characters, which are legal characters in XML names.
Parsers that don't recognize namespaces return names that include colons.

A **namespace** is a **Uniform Resource Identifier** (**URI**) -based container
that helps differentiate XML vocabularies by providing a unique context for its contained identifiers.
The namespace URI is associated with a namespace prefix (an alias for the URI) by specifying,
typically in an XML document's root element,
either the `xmlns` attribute by itself (which signifies the **default namespace**)
or the `xmlns:prefix` attribute (which signifies the namespace identified as `prefix`),
and assigning the URI to this attribute.

A namespace's scope starts at the element where it's declared and applies to all of the element's content
unless overridden by another namespace declaration with the same prefix name.

> namespace的有效范围

When `prefix` is specified, the `prefix` and a `colon` character are prepended to the name of each element tag
that belongs to that namespace.

**XML doesn't mandate that URIs point to document files.**
It only requires that they be unique to guarantee unique namespaces.

When multiple namespaces are involved,
it can be convenient to specify one of these namespaces as the **default namespace**
to reduce the tedium in entering namespace prefixes.

### Comments and Processing Instructions

XML documents can contain comments,
which are character sequences beginning with `<!--` and ending with `-->`.

XML also permits processing instructions to be present.
A processing instruction is an instruction
that's made available to the application parsing the document.
The instruction begins with `<?` and ends with `?>`.
The `<?` prefix is followed by a `name` known as the target.
This `name` typically identifies the application to which the processing instruction is intended.
The rest of the processing instruction contains text in a format appropriate to the application.
The following are two examples of processing instructions:

```text
<?xml-stylesheet href="modern.xsl" type="text/xml"?>
```

to associate an eXtensible Stylesheet Language (XSL) style sheet with an XML document

**The XML declaration isn't a processing instruction.**

XML是由W3C组织规定的。

- 书籍：《XML by Example》

SAX 可能是 Simple API for XML

XML文件的作用：

- 作为软件的“配置文件”
- 作为小型的“数据库”

## XML语法

- 标签
- 属性
- 注释
- 文档声明
- 转义字符
- CDATA块
- 处理指令

### 标签

XML标签名称区分大小写

```xml
<student>tom</student>
```

```xml
<Student>tom</Student>
```

标签名不能以数字开头，标签名中不能有空格

可以以下划线`_`开头。

在一个`.xml`文件中，有且只有一个根标签。

```xml
<stdudents>
    <student>tom</student>
    <student>jerry</student>
</stdudents>
```

### 属性

```xml
<student name="tom"></student>
```

### 注释

```xml
<!-- XML注释 -->
<stdudents>
    <student id="001" name="tom">Tom Cat</student>
    <student id="002" name="jerry">Jerry Mouse</student>
</stdudents>
```

### 文档声明

```text
<?xml version="1.0" encoding="UTF-8"?>
```

### 转义字符

<,&lt;
>,&gt;
",&quot;
&,&amp;
space,&nbsp;

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<codes>
    <code>
        <p>内容</p>
    </code>
</codes>
```

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<codes>
    <code>
        &lt;p&gt;内容&lt;/p&gt;
    </code>
</codes>
```

### CDATA块

```text
<![CDATA[
    <p>内容</p>
]]>
```

### 处理指令

处理指令，简称PI（Processing Instruction）。

作用：处理指令用来告诉解析引擎如何解析XML文档内容。

格式：处理指令必须以`<?`开头，以`?>`结尾。XML声明语句就是最常见的一种处理指令。

```text
<?xml version="1.0" encoding="UTF-8" ?>
```

```text
<?xml-stylesheet type="text/css" href="my.css"?>
```

```text
contact {
    color:red;
    font-size:20px;
    width:100px;
    height:100px;
    display:block;
    margin-top:40px;
    background-color:green;
}
```

## XML的验证模式

比较常用的验证模式有两种：DTD和XSD。

DTD = Document Type Definition

XSD = XML Schemas Definition





