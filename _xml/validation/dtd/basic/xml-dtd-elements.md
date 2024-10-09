---
title: "DTD - Elements"
sequence: "106"
---

In a DTD, XML elements are declared with the following syntax:

```text
<!ELEMENT element-name (element-content)>
```

or

```text
<!ELEMENT element-name category>
```

```text
                                                                                 ┌─── sequence (,)
                                                              ┌─── order ────────┤
                                                              │                  └─── or       (|)
                                              ┌─── Element ───┤
                                              │               │                  ┌─── *
                                              │               │                  │
                           ┌─── None-Empty ───┤               └─── occurrence ───┼─── +
                           │                  │                                  │
                           │                  │                                  └─── ?
DTD Element ───┼─── ANY ───┤                  │
                           │                  └─── Text ──────┼─── PCDATA
                           │
                           └─── EMPTY
```

## Element

### Order

Elements with one or more children are declared with the name of the children elements inside parentheses:

```text
<!ELEMENT element-name (child1)>
```

or

```text
<!ELEMENT element-name (child1,child2,...)>
```




#### Parentheses

Parentheses are used to group elements in the content model

```text
<!ELEMENT name (lname, (fname | title))>
```

#### Comma and Vertical Bar

The comma (`,`) and vertical bar (`|`) characters are **connectors**.
Connectors separate the children in the content model,
they indicate the order in which the children can appear.
The connectors are

- the `,` character, which means both elements on the right and the left of the comma must appear in the same order in the document.
- the `|` character, which means that only one of the elements on the left or the right of the vertical bar must appear in the document.

Example:

```text
<!ELEMENT note (to,from,heading,body)>
```

When children are declared in a sequence separated by commas, the children must appear in the same sequence in the document.
In a full declaration, the children must also be declared, and the children can also have children.
The full declaration of the "note" element is:

```text
<!ELEMENT note (to,from,heading,body)>
<!ELEMENT to (#PCDATA)>
<!ELEMENT from (#PCDATA)>
<!ELEMENT heading (#PCDATA)>
<!ELEMENT body (#PCDATA)>
```

### Occurrence

#### Plus, Star, and Question Mark

The plus (`+`), star (`*`), and question mark (`?`) characters in the element content are **occurrence indicators**.
They indicate whether and how elements in the child list can repeat.

- An element followed by no occurrence indicator must appear once and only once in the element being defined.
- An element followed by a `+` character must appear one or several times in the element being defined. The element can repeat.
- An element followed by a `*` character can appear zero or more times in the element being defined.
  The element is optional but, if it is included, it can repeat indefinitely.
- An element followed by a `?` character can appear once or not at all in the element being defined.
  It indicates the element is optional and, if included, cannot repeat.



Declaring Only One Occurrence of an Element

```text
<!ELEMENT element-name (child-name)>
```

Example:

```text
<!ELEMENT note (message)>
```

Declaring Minimum One Occurrence of an Element

```text
<!ELEMENT element-name (child-name+)>
```

Example:

```text
<!ELEMENT note (message+)>
```

Declaring Zero or More Occurrences of an Element

```text
<!ELEMENT element-name (child-name*)>
```

Example:

```text
<!ELEMENT note (message*)>
```

Declaring Zero or One Occurrences of an Element

```text
<!ELEMENT element-name (child-name?)>
```

Example:

```text
<!ELEMENT note (message?)>
```

### Declaring either/or Content

```text
<!ELEMENT note (to,from,header,(message|body))>
```





## category

- `#PCDATA` stands for parsed character data and means the element can contain **text**.
  `#PCDATA` is often (but not always) used for **leaf elements**.
  Leaf elements are elements that have no child elements.
- `EMPTY` means the element is an empty element. `EMPTY` always indicates a leaf element.
- `ANY` means the element can contain any other element declared in the DTD.
  This is seldom used because it carries almost no structure information.
  `ANY` is sometimes used during the development of a DTD, before a precise rule has been written.
  Note that the elements must be declared in the DTD.

Element contents that have `#PCDATA` are said to be **mixed content**.
Element contents that contain only elements are said to be **element content**.

Note that `CDATA` sections appear anywhere `#PCDATA` appears.

### Empty

Empty elements are declared with the category keyword `EMPTY`:

```text
<!ELEMENT element-name EMPTY>
```

Example:

```text
<!ELEMENT br EMPTY>
```

XML example:

```text
<br />
```

### PCDATA

Elements with only parsed character data are declared with `#PCDATA` inside **parentheses**:

```text
<!ELEMENT element-name (#PCDATA)>
```

Example:

```text
<!ELEMENT from (#PCDATA)>
```

### ANY

Elements declared with the category keyword `ANY`, can contain any combination of parsable data:

```text
<!ELEMENT element-name ANY>
```

Example:

```text
<!ELEMENT note ANY>
```

## Mixed Content

To state that an element contains **mixed content**,
you would specify `#PCDATA` and a list of element names, separated by vertical bars (`|`).

```text
<!ELEMENT note (#PCDATA|to|from|header|message)*>
```

However, `#PCDATA` must be the first item specified in the list.

```text
<!ELEMENT company (department)+>
```

## ignorable whitespaces

If a DTD is associated with the document,
then the XML processor knows that spaces in an element that has element content must indent
(because the element has element content, it cannot contain any text).
The XML processor can label the spaces as **ignorable whitespaces**.
This is a very powerful hint to the application that the spaces are indenting.

## Nonambiguous Model

The content model must be **deterministic** or unambiguous.
In plain English, it means that it is possible to decide
which part of the model applies to the current element by looking only at the current element.

For example, the following model is not acceptable:

```text
<!ELEMENT cover  ((title, author) | (title, subtitle))>
```

because when the XML processor is reading the element

```text
<title>XML by Example</title>
```

in

```text
<cover><title>XML by Example</title><author>Benoît Marchal</author></cover>
```

it cannot decide whether the `title` element is part of `(title, author)` or
of `(title, subtitle)` by looking at `title` only.
To decide that `title` is part of `(title, author)`, it needs to look past `title` to the `author` element.

In most cases, however, it is possible to reorganize the document
so that the model becomes acceptable:

```text
<!ELEMENT cover  (title, (author | subtitle))>
```

Now when the processor sees `title`, it knows where it fits in the model.
