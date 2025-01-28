---
title: "DTD - Introduction"
sequence: "104"
---

两个概念：Well Formed和Valid

- An XML document with correct syntax is called "Well Formed".
- An XML document validated against a DTD is both "Well Formed" and "Valid".

A "Valid" XML document is "Well Formed", as well as it conforms to the rules of a DTD.

> 两个概念的关系：递进

DTD stands for Document Type Definition.

> 缩写

A DTD defines the structure and the legal elements and attributes of an XML document.

> 作用：定义XML文档的结构；也就是，可以有哪些element，可以有哪些attributes

- XML语法：规范XML文件的基本编写规则，由W3C组织制定的。
- XML约束：规范XML文件数据内容格式的编写规则，由开发者自行定义。

XML约束

- DTD约束：语法简单，功能也相对简单
- Schema约束：语法相对复杂，功能也相对强大

DTD = Document Type Definition

A DTD defines the structure and the legal elements and attributes of an XML document.

DTD is a mechanism to describe every object (element, attribute, and so on) that can appear in the document.

## An Internal DTD Declaration

If the DTD is declared inside the XML file, it must be wrapped inside the `<!DOCTYPE>` definition:

```text
<?xml version="1.0"?>
<!DOCTYPE note [
<!ELEMENT note (to,from,heading,body)>
<!ELEMENT to (#PCDATA)>
<!ELEMENT from (#PCDATA)>
<!ELEMENT heading (#PCDATA)>
<!ELEMENT body (#PCDATA)>
]>
<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body>Don't forget me this weekend</body>
</note>
```

The DTD above is interpreted like this:

- `!DOCTYPE note` defines that the root element of this document is `note`
- `!ELEMENT note` defines that the `note` element must contain four elements: "`to,from,heading,body`"
- `!ELEMENT to` defines the `to` element to be of type "`#PCDATA`"
- `!ELEMENT from` defines the `from` element to be of type "`#PCDATA`"
- `!ELEMENT heading` defines the `heading` element to be of type "`#PCDATA`"
- `!ELEMENT body` defines the body element to be of type "`#PCDATA`"

## An External DTD Declaration

```text
<?xml version="1.0"?>
<!DOCTYPE note SYSTEM "note.dtd">
<note>
  <to>Tove</to>
  <from>Jani</from>
  <heading>Reminder</heading>
  <body>Don't forget me this weekend!</body>
</note>
```

```text
<!ELEMENT note (to,from,heading,body)>
<!ELEMENT to (#PCDATA)>
<!ELEMENT from (#PCDATA)>
<!ELEMENT heading (#PCDATA)>
<!ELEMENT body (#PCDATA)>
```

本地文件系统：

```text
<!DOCTYPE note SYSTEM "note.dtd">
```

公共的外部导入：

```text
<!DOCTYPE note PUBLIC "http://www.example.com/xxx.dtd">
```

## The Building Blocks of XML Documents

Seen from a DTD point of view, all XML documents are made up by the following building blocks:

- Elements
- Attributes
- Entities
- PCDATA
- CDATA

### PCDATA

PCDATA means **parsed character data**.

Think of character data as the **text** found between the start tag and the end tag of an XML element.

**PCDATA is text that WILL be parsed by a parser. The text will be examined by the parser for entities and markup.**

Tags inside the text will be treated as markup and entities will be expanded.

However, parsed character data should not contain any `&`, `<`, or `>` characters; these need to be represented by the `&amp;` `&lt;` and `&gt;` entities, respectively.

### CDATA

CDATA means character data.

**CDATA is text that will NOT be parsed by a parser.** Tags inside the text will NOT be treated as markup and entities will not be expanded.

## Element

- category
  - EMPTY
  - PCDATA
  - ANY
- children
  - order 顺序
  - count 数量

## Attributes

```text
<!ATTLIST element-name attribute-name attribute-type attribute-value>
```

## Why Schemas?

Why do we need DTDs or schemas in XML?
There is a potential conflict between flexibility and ease of use.
As a rule, more flexible solutions are more difficult,
if only because you have to work your way through the options.
Specific solutions might also be optimized for certain tasks.

Let's compare a closed solution, HTML, with an open one such as XML.
Both can be used to publish documents on the Web (XML serves many other purposes as well).
HTML has a fixed set of elements and software can be highly optimized for it.
For example, HTML editors offer templates, powerful visual editing, image editing, document preview, and more.

XML, on the other hand, is a flexible solution.
It does not define elements but lets you, the developer, define the structure you need.
Therefore, XML editors must accept any document structure.
There are very little opportunities to optimize the XML editors
because, by definition, they must be as generic as XML is.
HTML, the close solution, has an edge here.

**The DTD is an attempt to bridge that gap.**
DTD is a formal description of the document.
Software tools can read it and learn about the document structure.
Consequently, the tools can adapt themselves to better support the document structure.

For example, some XML editors use DTDs to populate their element lists based on the DTD.
Finally, these XML editors will guide the author by making certain the structure is followed.

In other words, the editor is a generic tool that accepts any XML document,
but it is configured for a specific application (read specific structure) through the DTD.

## Well-Formed and Valid Documents

XML recognizes two classes of documents: **well-formed** and **valid**.
The documents in Chapter 2 were well-formed, which in XML jargon means they follow the XML syntax.
Well-formed documents have the right mix of start and end tags, attributes are properly quoted,
entities are acceptable, character sets are properly used, and so on.

Well-formed documents have no DTD, so the XML processor cannot check their structure.
It only checks that they follow the syntax rules.

Valid documents are stricter.
They not only follow the syntax rules,
they also comply with a specific structure, as described in a DTD.

Valid documents have a DTD.
The XML processor will check that the documents are syntactically correct
but it also ensures they follow the structure described in the DTD.

Why two classes of documents? Why not have only valid documents?
In practice, some applications don't need a DTD.
Also, among those applications that do, they need the DTD only at specific steps in the process.

**The DTD is useful during document creation**, when it makes sense to enforce the document structure.
However, it is less useful after the creation.
For example, in most cases, it is useless to distribute the DTD with the document.
Indeed, a reader cannot fix errors in the structure of a document
(that's the role of the author and editor),
so what is a reader to do with the DTD?

## Relationship Between the DTD and the Document

The role of the DTD is to specify which elements are allowed where in the document.

Another way to look at the relationship between DTD and document is to
say that the DTD describes the tree that is acceptable for the document.

## Benefits of the DTD

The main benefits of using a DTD are

- The XML processor **enforces the structure**, as defined in the DTD.
- The application accesses the document structure, such as to populate an element list.
- The DTD gives hints to the XML processor—that is, it helps separate **indenting** from **content**.
- The DTD can declare **default** or **fixed values** for attributes. This might result in a smaller document.

## Reference

- [DTD Tutorial](https://www.w3schools.com/xml/xml_dtd_intro.asp)
