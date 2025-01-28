---
title: "Attributes"
sequence: "103"
---

## Attributes

Elements can have attributes, which are specified in the **start tag**.

An attribute is defined as a name-value pair.

### name-value pair

```text
<?xml version="1.0" encoding="UTF-8"?>
<company>
    <department>
        <employee id="001" name="Tom Cat">
        </employee>
    </department>
</company>
```

添加一个`birthday`属性，其值为`<2022-01-01>`：

```text
<?xml version="1.0" encoding="UTF-8"?>
<company>
    <department>
        <employee id="001" name="Tom Cat" birthday="&lt;2022-01-01&gt;">
        </employee>
    </department>
</company>
```

### quotation

Unlike HTML, XML insists on the **quotation marks**.

```xml
<class-file magic="0xCAFEBABE" version="8"></class-file>
```

The XML processor would reject the following:

```text
<class-file magic=0xCAFEBABE version=8></class-file>
```

The **quotation marks** can be either **single** or **double quotes**.
This is convenient if you need to insert single or double quotation marks in an attribute value.

```text
<class-file magic='0xCAFEBABE' version='8'></class-file>
```
