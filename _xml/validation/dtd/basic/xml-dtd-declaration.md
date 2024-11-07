---
title: "DTD - Declaration"
sequence: "105"
---

The **document type declaration** attaches a DTD to a document.

Don't confuse the **document type declaration** with the **document type definition** (DTD).

> 区分两个概念

The document type declaration has the form:

> 格式

```text
<!DOCTYPE company SYSTEM "../dtd/company.dtd">
```

The **document type declaration** appears at the beginning of the XML document, after the **XML declaration**.

> 位置

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company SYSTEM "../dtd/company.dtd">
```

**Document Type Definition** and **document type declaration** are two different things.
The **DTD** acronym identifies a **Document Type Definition** and never identifies a **document type declaration**.

A **document type declaration** appears immediately after the **XML declaration** and is specified in one of the following ways:

## DOCTYPE Declarations

An XML document can also include a **document type definition** (**DTD**).

A DTD defines the structure of an XML document.

> DTD的作用：定义XML文档的结构

If the content of an XML document conforms to the structure imposed by its DTD, then such a document is termed **valid**.

> 注意两个名词：well-formed和valid

A DTD is defined in a `DOCTYPE` declaration.

> 再注意两个概念：document type definition （.dtd）和document type declaration（.xml）

A `DOCTYPE` has three types of DTD specifications: **internal**, **private**, and **public**.

> 三种类型

### internal DTD

You can specify an internal DTD within an XML document as follows:

```text
<!DOCTYPE root-element-name [Elements, Attributes]>
```

```text
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE company [
        <!ELEMENT company (department)*>
        <!ELEMENT department (employee)*>
        <!ELEMENT employee (#PCDATA)>
        <!ATTLIST department name CDATA #IMPLIED>
        <!ATTLIST employee id CDATA #IMPLIED>
        <!ATTLIST employee name CDATA #IMPLIED>
        ]>
<company>
    <department name="DEV">
        <employee id="001" name="Tom Cat">
        </employee>
    </department>
</company>
```

### private DTD

You can specify a **private** external DTD as follows:

```text
<!DOCTYPE rootElement SYSTEM "DTDLocation">
```

文件：`company.xml`：（注意，`standalone`属性为`no`，不能为`yes`）

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE company SYSTEM "../dtd/company.dtd">
<company>
    <department name="DEV">
        <employee id="001" name="Tom Cat">
        </employee>
    </department>
</company>
```

文件`company.dtd`：

```text
<!ELEMENT company (department)*>
<!ELEMENT department (employee)*>
<!ELEMENT employee (#PCDATA)>
<!ATTLIST department name CDATA #IMPLIED>
<!ATTLIST employee id CDATA #IMPLIED>
<!ATTLIST employee name CDATA #IMPLIED>
```

### public DTD

You can specify a public external DTD as follows:

```text
<!DOCTYPE rootElement PUBLIC "DTDName" "DTDLocation">
```

```text
<!DOCTYPE journal PUBLIC "-//Apress.//DTD Journal Example 1.0//EN" "http://www.apress.com/javaxml/dtd/journal.dtd">
```

- DTDName: `-//Apress.//DTD Journal Example 1.0//EN`
- DTDLocation: `http://www.apress.com/javaxml/dtd/journal.dtd`

文件系统（相对路径）：

```text
<!DOCTYPE company PUBLIC "-//LSIEUN/Learn XML//EN" "../dtd/company.dtd">
```

文件系统（绝对路径）：

```text
<!DOCTYPE company PUBLIC "-//LSIEUN/Learn XML//EN" "file://D:/git-repo/learn-java-xml/src/main/resources/company.dtd">
```

HTTP协议（本地）：

```text
<!DOCTYPE company PUBLIC "-//LSIEUN/Learn XML//EN" "http://127.0.0.1:8888/assets/xml/company.dtd">
```

HTTP协议（公网）：

```text
<!DOCTYPE company PUBLIC "-//LSIEUN/Learn XML//EN" "https://lsieun.github.io/assets/xml/company.dtd">
```



## Internal DTD

The internal DTD must appear between square brackets:

```text
<!DOCTYPE root-element-name [dtd]>
```

文件：`company.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company [
    <!ELEMENT company (department+)>
    
    <!ELEMENT department (employee*)>
    <!ELEMENT employee (name, salary)>
    
    <!ELEMENT name (first-name, last-name)>
    <!ELEMENT salary (#PCDATA)>
    
    <!ELEMENT first-name (#PCDATA)>
    <!ELEMENT last-name (#PCDATA)>
]>
<company>
    <department>
        <employee>
            <name>
                <first-name>Tom</first-name>
                <last-name>Cat</last-name>
            </name>
            <salary>1000</salary>
        </employee>
        <employee>
            <name>
                <first-name>Jerry</first-name>
                <last-name>Mouse</last-name>
            </name>
            <salary>1200</salary>
        </employee>
    </department>
</company>
```

## External Private DTD

An external but private DTD via uri:

```text
<!DOCTYPE root-element-name SYSTEM uri>
```

示例一：相对路径（文件系统）

```text
<!DOCTYPE company SYSTEM "../dtd/company.dtd">
```

其中，system identifier指"../dtd/company.dtd"。

示例二：绝对路径（文件系统）

```text
<!DOCTYPE company SYSTEM "file://D:/git-repo/learn-java-xml/src/main/resources/company.dtd">
```

其中，system identifier指"file://D:/git-repo/learn-java-xml/src/main/resources/company.dtd"。

示例三：HTTP协议（localhost）

```text
<!DOCTYPE company SYSTEM "https://lsieun.github.io/assets/xml/company.dtd">
```

其中，system identifier指"https://lsieun.github.io/assets/xml/company.dtd"。

文件：`company.xml`

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company SYSTEM "../dtd/company.dtd">
<company>
    <department>
        <employee>
            <name>
                <first-name>Tom</first-name>
                <last-name>Cat</last-name>
            </name>
            <salary>1000</salary>
        </employee>
        <employee>
            <name>
                <first-name>Jerry</first-name>
                <last-name>Mouse</last-name>
            </name>
            <salary>1200</salary>
        </employee>
    </department>
</company>
```

文件：`company.dtd`

```text
<!ELEMENT company (department+)>

<!ELEMENT department (employee*)>
<!ELEMENT employee (name, salary)>

<!ELEMENT name (first-name, last-name)>
<!ELEMENT salary (#PCDATA)>

<!ELEMENT first-name (#PCDATA)>
<!ELEMENT last-name (#PCDATA)>
```

## External Public DTD

An external but public DTD via `fpi`, a **[formal public identifier](https://en.wikipedia.org/wiki/Formal_Public_Identifier)**, and `uri`:

```text
<!DOCTYPE root-element-name PUBLIC fpi uri>
```

If a validating XML parser cannot locate the DTD via public identifier `fpi`,
it can use system identifier `uri` to locate the DTD.

For example, `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">` references
the XHTML 1.0 DTD first via public identifier `-//W3C//DTD XHTML 1.0 Transitional//EN`
and second via system identifier `http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd`.




## external subset

```text
<!DOCTYPE address-book SYSTEM "http://www.xmli.com/dtd/address-book.dtd">
<!DOCTYPE address-book PUBLIC "-//Pineapplesoft//Address Book//EN" "http://catwoman.pineapplesoft.com/dtd/address-book.dtd">
<!DOCTYPE address-book SYSTEM "../dtds/address-book.dtd">
```

There are two types of identifiers: **system identifiers** and **public identifiers**.
A keyword, respectively `SYSTEM` and `PUBLIC`, indicates the type of identifier.

A **system identifier** is a **Universal Resource Identifier** (**URI**) pointing to the DTD.
URI is a superset of URLs.
For all practical purposes, a URI is a URL.

In addition to the **system identifier**, the DTD identifier might include a **public identifier**.
A **public identifier** points to a DTD recorded with the ISO according to the rules of ISO 9070.
Note that a **system identifier** must follow the **public identifier**.

The **system identifier** is easy to understand.
The XML processor must download the document from the URI.

**Public identifiers** are used to manage local copies of DTDs.
The XML processor maintains a catalog file that lists **public identifiers** and **their associated URIs**.
The processor will use these URIs instead of the **system identifier**.

Obviously, if the URIs in the catalog point to local copies of the DTD,
the XML processor saves some downloads.

## Both: Internal + External

Finally, note that a document can have both an internal and an external subset as in

```text
<!DOCTYPE address SYSTEM "address-content.dtd" [
<!ELEMENT address  (street,region?,postal-code,locality,country)>
<!ATTLIST address  preferred (true | false) "false">
]>
```

A document can have internal and external DTDs:

```text
<!DOCTYPE recipe SYSTEM URI [
    <!ELEMENT ...>
]>
```

The **internal DTD** is referred to as the **internal DTD subset** and
the **external DTD** is referred to as the **external DTD subset**.

![](/assets/images/xml/xml-dtd-subset-internal-and-external.png)

Neither subset can override the element declarations of the other subset.

文件：`company.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE company SYSTEM "../dtd/company.dtd" [
    <!ELEMENT address (street,region?,postal-code,locality,country)>
    <!ATTLIST address preferred (true|false) "false">
    
    <!ELEMENT street (#PCDATA)>
    <!ELEMENT region (#PCDATA)>
    <!ELEMENT postal-code (#PCDATA)>
    <!ELEMENT locality (#PCDATA)>
    <!ELEMENT country (#PCDATA)>
]>
<company>
    <department>
        <employee>
            <name>
                <first-name>Tom</first-name>
                <last-name>Cat</last-name>
            </name>
            <salary>1000</salary>
        </employee>
        <employee>
            <name>
                <first-name>Jerry</first-name>
                <last-name>Mouse</last-name>
            </name>
            <salary>1200</salary>
        </employee>
    </department>
</company>
```

文件：`company.dtd`

```text
<!ELEMENT company (department+)>

<!ELEMENT department (employee*)>
<!ELEMENT employee (name, salary)>

<!ELEMENT name (first-name, last-name)>
<!ELEMENT salary (#PCDATA)>

<!ELEMENT first-name (#PCDATA)>
<!ELEMENT last-name (#PCDATA)>
```

## Public Identifiers Format

```text
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

The public identifiers:

```text
-//W3C//DTD HTML 4.01//EN
```

There are four parts, separated by `//`:

- The first character is `+` if the organization is registered with ISO, `-` otherwise (most frequent).
- The second part is the **owner** of the DTD.
- The third part is the **description** of the DTD; spaces are allowed.
- The final part is the **language** (EN for English).
