---
title: "DTD - Conditional Sections"
sequence: "110"
---

As your DTDs mature, you might have to change them in ways that are partly incompatible with previous usage.
During the migration period,
when you have new and old documents, it is difficult to maintain the DTD.

To help you manage migrations and other special cases, XML provides **conditional sections**.
**Conditional sections** are included or excluded from the DTD depending on the value of a keyword.
Therefore, you can include or exclude a large part of a DTD by simply changing one keyword.

文件：`company.dtd`

```text
<!ELEMENT company (department+)>

<!ELEMENT department (employee*)>
<!ELEMENT employee (name, salary)>

<!ENTITY % strict "INCLUDE">
<!ENTITY % lenient "IGNORE">

<![%strict;[
<!ELEMENT name (first-name, last-name)>
]]>

<![%lenient;[
<!ELEMENT name (#PCDATA | first-name | last-name)>
]]>

<!ELEMENT salary (#PCDATA)>
<!ELEMENT first-name (#PCDATA)>
<!ELEMENT last-name (#PCDATA)>
```

文件：`company.xml`

```xml
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
            <name>Jerry Mouse</name>
            <salary>1200</salary>
        </employee>
    </department>
</company>
```

However, to revert to the `lenient` definition of `name`,
it suffices to invert the parameter entity declaration:

```text
<!ENTITY % strict "IGNORE">
<!ENTITY % lenient "INCLUDE">
```
