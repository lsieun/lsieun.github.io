---
title: "Elements"
sequence: "102"
---

## Document

### Root Element

A document must have **a single root element**, which is also known as the **document element**.

> 在一个XML文档中，有且仅有一个根元素（Root Element）

```text
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<company></company>
```

## Elements

### Start and End Tags

The building block of XML is the **element**, as that's what comprises XML documents.

> XML文档中，最基本的成员就是element。

An **element** in an XML document is delimited by a **start tag** and an **end tag**.

> element由start tag和end tag分隔。

A **start tag** within an element is delimited by the `<` and `>` characters and has a tag name.

> 开始标签

An **end tag** is delimited by the `</` and `>` character sequences and also contains a tag name.

> 结束标签

```text
                                                      ┌─── name: <company>
                                    ┌─── start tag ───┤
                  ┌─── tag ─────────┤                 └─── attribute: <company name="ABC">
                  │                 │
                  │                 └─── end tag ─────┼─── </company>
                  │
                  │                 ┌─── name
   XML Element ───┼─── attribute ───┤
                  │                 └─── value
                  │
                  │                 ┌─── empty
                  │                 │
                  └─── content ─────┼─── text content ──────┼─── CDATA
                                    │
                                    └─── nested elements
```

### Tag Name

Names in XML must start with either a letter or the underscore character (`_`).  
The rest of the name consists of letters, digits, the underscore character, the dot (`.`), or a hyphen (`-`).  
Spaces are not allowed in names.

- 开头字符：`a-z`, `A-Z`, `_`
- 后续字符：`a-z`, `A-Z`, `_`, `0-9`, `.`, `-`
- 禁用字符：`space`, `&`

合法：（包含`-`）

```text
<copy-right>
```

合法：（包含`.`），在Maven的配置文件中设置的属性信息

```text
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <java.version>1.8</java.version>
</properties>
```

不合法：(数字开头)

```text
<123>
```

不合法：(包含有空格)

```text
<first name>
```

不合法：(包括`&`符号)

```text
<tom&jerry>
```

#### 区分大小写

在XML文件中，标签名字的区分大小写。Unlike HTML, **names are case sensitive in XML**.

以下是不同的不个元素：

```text
<company>
<COMPANY>
<Company>
```

By convention, XML elements are frequently written in lowercase.

#### 命名习惯

When a name consists of several words, the words are usually separated by a hyphen, as in `first-name`.

```xml

<first-name></first-name>
```

Another popular convention is to capitalize the first letter of each word and
use no separation character as in `FirstName`.

```xml

<FirstName></FirstName>
```

## 内容

### Nested Elements

An element can contain other nested elements.

```text
<?xml version="1.0" encoding="UTF-8"?>
<company>
    <department>
    </department>
</company>
```

### Text Content

Elements may contain text content.

```text
<?xml version="1.0" encoding="UTF-8"?>
<company>
    <department>
        <employee>Tom Cat</employee>
    </department>
</company>
```

#### CDATA construct

Of course, element text content cannot contain any delimiter character sequences such as `</`.
One way to get around that is to enclose element content within a `CDATA` construct:

```text
<?xml version="1.0" encoding="UTF-8"?>
<company>
    <department>
        <employee>
            <![CDATA[This is some arbitrary text <within> a character data]]>
        </employee>
    </department>
</company>
```

Character Data and Markup [Link](https://www.w3.org/TR/REC-xml/#syntax)

**Text** consists of intermingled **character data** and **markup**.

**Markup** takes the form of start-tags, end-tags, empty-element tags, entity references, character references,
comments,
CDATA section delimiters, document type declarations, processing instructions, XML declarations, text declarations,
and any white space that is at the top level of the document entity
(that is, outside the document element and not inside any other markup).

**All text** that is not **markup** constitutes the **character data** of the document.

### Empty Element

An element may of course have no nested elements or content.
Such an element is termed an **empty element**, and it can be written with a special start tag that has no end tag.

```text
<?xml version="1.0" encoding="UTF-8"?>
<company>
    <department>
        <employee/>
    </department>
</company>
```
