---
title: "DTD - Entities"
sequence: "108"
---

## Entity是什么

An **entity** in an XML document is **a storage unit** that can be referenced with an **entity reference**.

> 先有entity，再有entity reference

![entity and entity reference](/assets/images/xml/xml-dtd-entity-and-entity-reference.png)

文件：`company.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company [
    <!ELEMENT company (website)>
    <!ELEMENT website (#PCDATA)>
    
    <!ENTITY lsieun "https://lsieun.github.io">
]>
<company>
    <website>&lsieun;</website>
</company>
```

显示结果：

```text
<company>
    <website>https://lsieun.github.io</website>
</company>
```

## Entity的使用

一般来说，Entity的使用经过三个步骤：

- 第一步，Entity Declaration
- 第二步，Entity Reference
- 第三步，Entity Expansion

第一步，对entity进行定义。

```text
<!ENTITY lsieun "https://lsieun.github.io">
```

第二步，对entity进行使用，即entity reference。

```text
<website>&lsieun;</website>
```

第三步，对entity reference进行解析。

```text
<company>
    <website>https://lsieun.github.io</website>
</company>
```

### Entity Declaration

**An entity must be declared before it can be used.**

> 先定义，再使用

All entity declarations must be within **an internal DTD subset**(`DOCTYPE`) or **an external DTD subset**(`.dtd`).

> 定义的位置：DTD

![](/assets/images/xml/xml-dtd-subset-internal-and-external.png)

All entities are declared with the `ENTITY` declaration.

> 使用的符号：ENTITY

The exact format of the declaration distinguishes between internal, external, and parameter entities.

- internal entity

```text
<!ENTITY entity-name "replacement text">
```

- external entity

```text
<!ENTITY entity-name SYSTEM "system-identifier">
```

- parameter entity

```text
<!ENTITY % parameter-entity-name "replacement text">
```

### Entity Reference

A **general entity reference** is an ampersand (`&`), followed by the **name of the entity**, followed by a semicolon (`;`).

```text
&entity-name;
```

A **parameter entity reference** is an ampersand (`%`), followed by the **name of the entity**, followed by a semicolon (`;`).

```text
%entity-name;
```

### Entity Expansion

XML does not dictate how to store and access entities.
This is the task of the **XML processor** and it is system specific.
The XML processor might have to download entities or
it might use a local catalog file to retrieve the entities.

> XML proceesor负责对entity进行store和access

The text that is inserted by an entity reference is called the "replacement text".
The replacement text of an internal entity can contain markup
(elements, attributes, processing instructions, other entity references, etc.),
but the content must be balanced
(any element that you start in an entity must end in the same entity)
and circular entity references are not allowed.

## Entity分类

XML has many types of entities, classified according to three criteria:

- **general or parameter entities**
- **internal or external entities**
- **parsed or unparsed entities**.

> 分成不同的类型

```text
                              ┌─── general   (XML)
              ┌─── target ────┤
              │               └─── parameter (DTD)
              │
              │               ┌─── internal (DTD)
DTD Entity ───┼─── source ────┤
              │               └─── external (file)
              │
              │               ┌─── parsed   (text/xml)
              └─── content ───┤
                              └─── unparsed (binary)
```

General和Parameter的区别：

- **General Entity** is expanded in XML.
- **Parameter Entity** is expanded in DTD.

Internal和External的区别：

- **Internal entity** is stored in the document.
- **External entity** points to a system or public identifier.

Parsed和Unparsed的区别：

- **Parsed entity** must contain valid XML text and markup.
- **Unparsed entity** may or may not be text, and if text, they may not be XML text.

A general entity is one of the following types:

- internal, parsed general entity
- external, parsed general entity
- external, unparsed general entity

```text
                                       ┌─── internal ───┼─── parsed
              ┌─── general entity ─────┤
              │                        │                ┌─── parsed
              │                        └─── external ───┤
DTD Entity ───┤                                         └─── unparsed
              │
              │                        ┌─── internal ───┼─── parsed
              └─── parameter entity ───┤
                                       └─── external ───┼─── parsed
```

XML doesn't allow references to **external general entities** to appear in **attribute values**.
For example, you cannot specify `&chapter-header;` in an attribute's value.

> 这是一个重要的知识点

### 示例

文件：`company.xml`

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company SYSTEM "../dtd/company.dtd">
<company>
    <website>&lsieun;</website>
    &company-contact;
    <logo image="company-logo" alt="This is company logo"/>
</company>
```

文件：`company.dtd`

```text
<!ELEMENT company (website, contact?, logo)>
<!ELEMENT website (#PCDATA)>
<!ELEMENT contact (email | tel)+>
<!ELEMENT email EMPTY>

<!-- parameter internal parsed -->
<!ENTITY % boolean "(true|false) 'false'">
<!ATTLIST email      
        href        CDATA           #REQUIRED
        prefered    %boolean;
    >

<!ELEMENT tel (#PCDATA)>
<!ELEMENT logo EMPTY>
<!ATTLIST logo      
    image   ENTITY  #REQUIRED
    alt     CDATA   #IMPLIED
>

<!-- general internal parsed -->
<!ENTITY lsieun "https://lsieun.github.io">

<!-- general external parsed -->
<!ENTITY company-contact SYSTEM "../xml/contact.xml">

<!-- general external unparsed -->
<!NOTATION JPEG SYSTEM "image/jpeg">
<!ENTITY company-logo SYSTEM "../images/week-cycle.jpg" NDATA JPEG>
```

文件：`contact.xml`

```text
<contact>
    <email href="mailto:service@example.com"/>
    <tel>123-456-7890</tel>
</contact>
```

Unparsed entities are never parsed into the XML document,
and they are essentially passed through to the processing application.
It is up to the processing application to attach any meaning to these unparsed entities.

## Entity的用途

XML doesn't work with **files** but with **entities**.
Entities are the physical representation of XML documents.
Although entities usually are stored as files, they need not be.

> entity 与file的概念类似


## General: Internal Parsed Entity

### Entity Declaration

An internal entity declaration has the following form:

```text
<!ENTITY entity-name "replacement text">
```

You can use either **double** or **single quotes** to delimit the **replacement text**.

```text
<!ENTITY lsieun "https://lsieun.github.io">
```

### 示例

一般情况：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company [
    <!ELEMENT company (contact)>
    <!ELEMENT contact (email, tel)>
    <!ELEMENT email EMPTY>
    <!ATTLIST email href CDATA #REQUIRED>
    <!ELEMENT tel (#PCDATA)>
]>
<company>
    <contact>
        <email href="mailto:service@example.com"/>
        <tel>123-456-7890</tel>
    </contact>
</company>
```

使用Entity的第一种方式：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company [
    <!ELEMENT company (contact)>
    <!ELEMENT contact (email, tel)>
    <!ELEMENT email EMPTY>
    <!ATTLIST email href CDATA #REQUIRED>
    <!ELEMENT tel (#PCDATA)>

    <!ENTITY contact-email "mailto:service@example.com">
    <!ENTITY contact-tel "123-456-7890">
]>
<company>
    <contact>
        <!-- Element Attribute -->
        <email href="&contact-email;"/>
        <!-- Element Text Content -->
        <tel>&contact-tel;</tel>
    </contact>
</company>
```

使用Entity的第二种方式：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company [
    <!ELEMENT company (contact)>
    <!ELEMENT contact (email, tel)>
    <!ELEMENT email EMPTY>
    <!ATTLIST email href CDATA #REQUIRED>
    <!ELEMENT tel (#PCDATA)>

    <!ENTITY company-contact
            '<contact>
                <email href="mailto:service@example.com"/>
                <tel>123-456-7890</tel>
            </contact>'>
]>
<company>
    <!-- Element -->
    &company-contact;
</company>
```

## General: External Parsed Entity

An **external parsed general entity** references an external file
that stores the entity's textual data,
which is subject to being inserted into a document and parsed by a validating parser
when a general entity reference is specified in the document.

**External parsed entities** are used to share text across several documents.

### Entity Declaration

The syntax of a **private, external parsed general entity**:

```text
<!ENTITY entity-name SYSTEM "system-identifier">
```

The syntax of a **public, external, parsed general entity**:

```text
<!ENTITY entity_name PUBLIC "public-identifier" "system-identifier">
```

- **system identifier** must point to an instance of a resource via a URI, most commonly a simple filename.
- **public identifier** may be used by an XML system to generate an alternate URI

### Entity Expansion

The parser inserts the **replacement text** of a **parsed entity** into the document wherever a reference to that entity occurs.

### 示例一

An external entity that incorporates `contact.xml` into your document might be declared like this:

```text
<!ENTITY company-contact SYSTEM "contact.xml">
```

文件：`company.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company [
    <!ELEMENT company (contact)>
    <!ELEMENT contact (email, tel)>
    <!ELEMENT email EMPTY>
    <!ATTLIST email href CDATA #REQUIRED>
    <!ELEMENT tel (#PCDATA)>

    <!ENTITY company-contact SYSTEM "contact.xml">
]>
<company>
    &company-contact;
</company>
```

文件：`contact.xml`

```xml
<contact>
    <email href="mailto:service@example.com"/>
    <tel>123-456-7890</tel>
</contact>
```

### 示例二：多个文件

The various entries are stored in separate entities (separate files).
The `company.xml` combines them in a document.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company [
    <!ELEMENT company (department)+>
    <!ELEMENT department (employee)+>
    <!ELEMENT employee (name, salary)>
    <!ELEMENT name (#PCDATA)>
    <!ELEMENT salary (#PCDATA)>
]>
<company>
    <department>
        <employee>
            <name>Tom Cat</name>
            <salary>1000</salary>
        </employee>
        <employee>
            <name>Jerry Mouse</name>
            <salary>1200</salary>
        </employee>
    </department>
</company>
```

文件：`company.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company [
    <!ELEMENT company (department)+>
    <!ELEMENT department (employee)+>
    <!ELEMENT employee (name, salary)>
    <!ELEMENT name (#PCDATA)>
    <!ELEMENT salary (#PCDATA)>

    <!ENTITY tom SYSTEM "../entity/tom.ent">
    <!ENTITY jerry SYSTEM "../entity/jerry.ent">
]>
<company>
    <department>
        &tom;
        &jerry;
    </department>
</company>
```

文件：`tom.ent`

```text
<employee>
    <name>Tom Cat</name>
    <salary>1000</salary>
</employee>
```

文件：`jerry.ent`

```text
<employee>
    <name>Jerry Mouse</name>
    <salary>1200</salary>
</employee>
```

## General: External Unparsed Entity

An **external unparsed general entity** references an external file that stores the entity's binary data.

Unparsed entities are used for non-XML content, such as images, sound, movies, and so on.

### Entity Declaration

The syntax of an **external, unparsed general entity**:

```text
<!ENTITY entity-name SYSTEM "system-identifier" NDATA notation-name>
```

```text
<!ENTITY entity-name PUBLIC "public-identifier" "system-identifier" NDATA notation-name>
```

- `entity-name` identifies the entity
- `system-identifier` locates the external file
- `NDATA` identifies the notation declaration named `notation-name`.

### Use Entity

It is an error to insert an **entity reference** to an **unparsed entity** directly into the flow of an XML document.

**Unparsed entities** can only be used as **attribute** values on elements with `ENTITY` attributes.

There is a somewhat subtle distinction between **entity attributes** and **entity references** in **attribute** values.

An "ordinary" (CDATA) attribute contains text. You can put **internal entity references** in that text,
just as you can in any other content.

An `ENTITY` attribute can only contain the **name** of an external, unparsed entity.
In particular, note that it contains the name of the entity, not a reference to the entity.

A **notation** must be associated with **unparsed entities**.
Notations identify the type of a document, such as GIF, JPEG, or Windows bitmap for images.
The **notation** is introduced by the `NDATA` keyword:

> unparsed entities --> notation

### Entity Expansion

The **XML processor** treats the unparsed entity as an opaque block, of course.
By definition, it does not attempt to recognize markup in unparsed entities.

> 在默认情况下，XML processor不处理unparsed entity

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company [
    <!ELEMENT company (logo)>
    <!ELEMENT logo EMPTY>
    <!ATTLIST logo
        image   ENTITY  #REQUIRED
        alt     CDATA   #IMPLIED
    >
    <!NOTATION JPEG SYSTEM "image/jpeg">
    <!ENTITY company-logo SYSTEM "../images/week-cycle.jpg" NDATA JPEG>
]>
<company>
    <logo image="company-logo" alt="This is Our Logo"/>
</company>
```

## Parameter Entity

Parameter entities are classified as internal or external.

- An **internal parameter entity** is a parameter entity whose value is stored in the DTD.
- An **external parameter entity** is a parameter entity whose value is stored outside the DTD.

## Parameter: Internal Parsed Entity

**Parameter entities** are entities referenced from **inside a DTD** via **parameter entity references**.

They're useful for eliminating repetitive content from element declarations.

文件：`company.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company SYSTEM "../dtd/company.dtd">
<company>
    <department>
        <accountant>
            <firstname>Tom</firstname>
            <lastname>Cat</lastname>
        </accountant>
        <lawyer>
            <firstname>Jerry</firstname>
            <lastname>Mouse</lastname>
        </lawyer>
        <salesperson>
            <firstname>Lucy</firstname>
            <lastname>Green</lastname>
        </salesperson>
    </department>
</company>
```

文件：`company.dtd`

```text
<!ELEMENT company (department)>
<!ELEMENT department (salesperson|lawyer|accountant)*>
<!ELEMENT salesperson (firstname, lastname)>
<!ELEMENT lawyer (firstname, lastname)>
<!ELEMENT accountant (firstname, lastname)>
<!ELEMENT firstname (#PCDATA)>
<!ELEMENT lastname (#PCDATA)>
```

文件：`company.dtd`（使用Parameter Entity）

```text
<!ELEMENT company (department)>
<!ELEMENT department (salesperson|lawyer|accountant)*>

<!ENTITY % person-name "firstname, lastname">

<!ELEMENT salesperson (%person-name;)>
<!ELEMENT lawyer (%person-name;)>
<!ELEMENT accountant (%person-name;)>

<!ELEMENT firstname (#PCDATA)>
<!ELEMENT lastname (#PCDATA)>
```

### Entity Declaration

Parameter entity declarations are identified by a `%` preceding the entity name:

```text
<!ENTITY % entity-name "replacement text">
```



Parameter entities can be either internal or external,
but they cannot refer to non-XML data (you can't have a parameter entity with a notation).

### Parameter entity references

**Parameter entity references** can only appear in the **external DTD subset** (`.dtd`).

> 位置：.dtd文件


company.xml

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company SYSTEM "../dtd/company.dtd">
<company>
    <contact>
        <email href="mailto:service@example.com" prefered="true"/>
        <tel>123-456-7890</tel>
    </contact>
</company>
```

company.dtd：

```text
<!ELEMENT company (contact)>
<!ELEMENT contact (email, tel)>
<!ELEMENT email EMPTY>
<!ATTLIST email href CDATA #REQUIRED
          prefered (true|false) "false">
<!ELEMENT tel (#PCDATA)>
```

company.dtd：使用Parameter entity

```text
<!ENTITY % boolean "(true|false) 'false'">

<!ELEMENT company (contact)>
<!ELEMENT contact (email, tel)>
<!ELEMENT email EMPTY>
<!ATTLIST email href CDATA #REQUIRED
          prefered %boolean;>
<!ELEMENT tel (#PCDATA)>
```

要注意两点：

- 第一点，Parameter entity只能定义在`.dtd`文件中，不能定义在`.xml`文件的`DOCTYPE`内。
- 第二点，在`.dtd`文件中，Parameter entity的定义在要前面，而Parameter entity references要在后面。


### General Vs Parameter

从Entity Declaration角度来讲：

- general entity定义在internal DTD subset和external DTD subset
- parameter entity只能定义在external DTD subset

从Entity Reference角度来讲：

- general entity需要使用`&`
- parameter entity需要使用`%`

从Entity Expansion角度来讲：

- general entity在XML文档中展开
- parameter entity在DTD文档中展开

Internal and external entity references are not expanded in the DTD or the internal subset
(this allows you to use entity references in the replacement text of other entities without concern about the order of declarations).
If you want to have the effect of entities and entity references in your DTD, **parameter entities** must be used.

Parameter entities can't be used in the content of your document; they simply aren't recognized.

It is legal to have a parameter entity and an internal or external entity with the same name.
They are completely different types of entities and cannot conflict with each other.

### Use

One common use of parameter entities is in conditional sections.
Conditional sections are a mechanism for parameterizing the DTD.
Note, however, that you cannot use conditional sections in the internal subset of XML documents.

## Parameter: External Parsed Entity

**External parameter entities** are similar to **external general entities**.
However, because **parameter entities** appear in the DTD, they must contain valid XML markup.

**External parameter entities** are often used to insert the content of a file in the markup.

### Entity Declaration

```text
<!ENTITY % parameter-entity-name SYSTEM "system-identifier">
```

### 示例

文件：`countries.ent`

```text
<?xml version="1.0" encoding="UTF-8"?>
<!ENTITY be "Belgium">
<!ENTITY cn "China">
<!ENTITY de "Germany">
<!ENTITY it "Italy">
<!ENTITY jp "Japan">
<!ENTITY uk "United Kingdom">
<!ENTITY us "United States">
```

文件：`company.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company [
    <!ELEMENT company (address)>

    <!ELEMENT address (street,region?,postal-code,locality,country)>
    <!ELEMENT street (#PCDATA)>
    <!ELEMENT region (#PCDATA)>
    <!ELEMENT postal-code (#PCDATA)>
    <!ELEMENT locality (#PCDATA)>
    <!ELEMENT country (#PCDATA)>

    <!ENTITY % countries SYSTEM "../entity/countries.ent">
    %countries;
]>
<company>
    <address>
        <street>小梅花路17号</street>
        <postal-code>123456</postal-code>
        <locality>平安区</locality>
        <country>&cn;</country>
    </address>
</company>
```

显示结果：

```text
<company>
    <address>
        <street>小梅花路17号</street>
        <postal-code>123456</postal-code>
        <locality>平安区</locality>
        <country>China</country>
    </address>
</company>
```

## 特殊的情况

### 特殊的Entity

In XML the document, its DTD, and the various files it references (images, and so on) are entities.

The document itself is a special entity because it is the starting point for the XML processor.
The entity of the document is known as the **document entity**.

> document entity

The DTD is a special entity.

### Predefined Entities

XML predefines entities for the characters used in markup (angle brackets, quotes, and so on).
The entities are used to escape the characters from element or attribute content.
The entities are

- `&lt;`: left angle bracket `<` must be escaped with `&lt;`
- `&amp;`: ampersand `&` must be escaped with `&amp;`
- `&gt;`: right angle bracket ">" must be escaped with `&gt;` in the combination `]]>` in CDATA sections
- `&apos;`: single quote `'` can be escaped with `&apos;` essentially in parameter value
- `&quot;`: double quote `"` can be escaped with &quot; essentially in parameter value

The following is not valid because the ampersand would confuse the XML processor:

```text
<company>Mark & Spencer</company>
```

Instead, it must be rewritten to escape the ampersand bracket with an `&amp;` entity:

```text
<company>Mark &amp; Spencer</company>
```

All XML processors are required to support references to these entities, even if they are not declared.

### Character References

XML also supports **character references** where a letter is replaced by its Unicode character code.
For example, if your keyboard does not support accentuated letters, you can still write my name in XML as:

```text
<name>Beno&#238;t Marchal</name>
```

Character references that start with `&#x` provides a hexadecimal representation of the character code.
Character references that start with `&#` provide a decimal representation of the character code.

Character references, which are similar in appearance to entity references,
allow you to reference arbitrary Unicode characters,
even if they aren't available directly on your keyboard.
Character references are not properly entities at all.

Character references are numeric and can be used without any special declaration.

The basic format of a character reference is either `&#nnn;` or `&#xhhh;`
where `nnn` is a decimal Unicode character number and `hhh` is a hexadecimal Unicode character number.

A character reference inserts the specified Unicode character directly into your document.
Note that this does not guarantee that your processing or display system will be able to do anything useful with the character.
For example, `&#x236E;` would insert, in the words of the Unicode standard, an "APL Functional Symbol Semicolon Underbar".
Whether or not you can print that character is an entirely different issue.

**Character references** differ from other **entity references** in a subtle but significant way.
They are expanded immediately by the parser.
Using `&#34;` is exactly the same as `"`.
In particular, this means you can't use the character reference in an attribute value to escape the quotation characters.


### 多次定义的Entity

They may be declared in the DTD, if your XML parser processes the DTD (also known as the external subset), or the internal subset.
Note: if the same entity is declared more than once, only the first declaration applies and the internal subset is processed before the external subset.

## Entity应用

Complex documents are often split over several files: the text, the accompanying graphics, and so on.

XML, however, does not reason in terms of **files**.
Instead it organizes documents physically in **entities**.
In some cases, entities are equivalent to files; in others, they are not.

## Entity Expansion

[Section 4.4](http://www.w3.org/TR/REC-xml#entproc) and [Appendix D](http://www.w3.org/TR/REC-xml#sec-entexpand) of
the [XML Recommendation](http://www.w3.org/TR/REC-xml) describe all the details of **entity expansion**.
The key points are:

- **Character references** are expanded immediately. They behave exactly as if you had typed the literal character.
- **Entity references** in the replacement text of other entities are not expanded until the entity being declared is referenced.
  In other words, this is legal in the internal subset:

```text
<!ENTITY foobar "&f;bar">
<!ENTITY f "foo">
```

because the entity reference "&f;" isn't expanded until "&foobar;" is expanded.

- **Parsed entities** are recognized in the body of your document, where **unparsed entities** are forbidden.
  **Unparsed entities** are allowed in `ENTITY` attributes, where **parsed entities** are forbidden.

- Although you can put references to internal entities in attribute values, it is illegal to refer to an external entity in an attribute value.

