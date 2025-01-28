---
title: "The topic Element"
sequence: "101"
---

In this chapter,

- we'll first explain the structure of a `<topic>` element;
- then we'll list the most useful “block elements” (**paragraph**, **table**, **list**, etc);
- then we'll list the most useful “inline elements” (**bold**, **italic**, etc);
- finally, we'll explain how to create **internal and external links**.
  Note that creating internal links in DITA, which is inherently modular,
  is slightly harder than in other, generally-monolithic, document types.
  Therefore, it is important to read this section carefully.

## The structure of the `<topic>` element

```text
Remember: A <topic> element must always be given an ID. Use the @id attribute to specify it.
```

The structure of the `<topic>` element is very simple:
- A `<title>` element.
- An optional `<shortdesc>` or `<abstract>` element.
  - The `<shortdesc>` element is longer and more descriptive than the `<title>` element.
    However, it is recommended to keep it short, approximately one paragraph long,
    because the contents of this element are often used during navigation (e.g. to generate a detailed table of contents).
  - The `<abstract>` element is intended to contain more information than the <shortdesc> element.
- A `<body>` element.
- An optional `<related-links>` element.

This is a kind of **See Also** section containing a list of `<link>` elements.

Topics being generally short, this section stands out clearly after the body of a topic.
That's why it is often preferred to spreading links inside the body of a topic.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
<topic id="docbook_or_dita">
    <title>DITA or DocBook</title>
    <shortdesc>
        Both DITA and DocBook are both mature, feature rich, document types,
        so which one to choose?
    </shortdesc>
    <body>
        <p>
            DocBook 5 is a mature document type. It is well-documented (DocBook:
            The Definitive Guide, DocBook XSL: The Complete Guide), featuring decent
            XSL stylesheets allowing conversion to a variety of formats, based on the
            best schema technologies: RELAX NG and Schematron.
        </p>
        <p>
            DITA concepts (topics, maps, specialization, etc.) have an immediate
            appeal to the technical writer, making this document type more attractive
            than DocBook. However, the DocBook vocabulary is comprehensive and very
            well-thought-out. So choose DITA if its technical vocabulary is
            sufficiently expressive for your needs or if, anyway, you intend to
            specialize DITA.
        </p>
    </body>
    
    <related-links>
        <link format="html" href="https://docbook.org/" scope="external">
            <linktext>DocBook 5</linktext>
        </link>
        <link format="html" href="https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=dita" scope="external">
            <linktext>DITA</linktext>
        </link>
    </related-links>
</topic>
```

## The most commonly used “block elements”

The most commonly used block elements are borrowed from HTML and as such, should be immediately familiar to the reader.

### Paragraphs and lists

- A paragraph is represented by the `<p>` element.
- A preformatted paragraph is represented by the `<pre>` element.
- An itemized list is represented by the `<ul>` element. As expected, it contains `<li>` list item elements.
- An ordered list is represented by the `<ol>` element.
- A variable list is represented by the `<dl>` element.
  Unlike HTML's `<dl>`, the `<dt>` (term being defined) and the `<dd>` (term definition) elements
  must be wrapped in a `<dlentry>` element.

```xml
<ul>
    <li>First item.
        <p>Continuation paragraph.</p>
    </li>

    <li>Second item. This item contains an ordered list.
        <ol>
            <li>First do this.</li>
            <li>Then do that.</li>
            <li>Finally do this.</li>
        </ol>
    </li>

    <li>Third item. This item contains a variable list.
        <dl>
            <dlentry>
                <dt>Term #1</dt>
                <dd>Definition of term #1.</dd>
            </dlentry>

            <dlentry>
                <dt>Term #2</dt>
                <dd>Definition of term #2.</dd>
            </dlentry>
        </dl>
    </li>
</ul>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
<topic id="docbook_or_dita">
    <title>DITA or DocBook</title>
    <shortdesc>
        Both DITA and DocBook are both mature, feature rich, document types,
        so which one to choose?
    </shortdesc>
    <body>
        <p>
            DocBook 5 is a mature document type. It is well-documented (DocBook:
            The Definitive Guide, DocBook XSL: The Complete Guide), featuring decent
            XSL stylesheets allowing conversion to a variety of formats, based on the
            best schema technologies: RELAX NG and Schematron.
        </p>
        <p>
            DITA concepts (topics, maps, specialization, etc) have an immediate
            appeal to the technical writer, making this document type more attractive
            than DocBook. However the DocBook vocabulary is comprehensive and very
            well thought out. So choose DITA if its technical vocabulary is
            sufficiently expressive for your needs or if, anyway, you intend to
            specialize DITA.
        </p>
        
        <ul>
            <li>First item.
                <p>Continuation paragraph.</p>
            </li>
            
            <li>Second item. This item contains an ordered list.
                <ol>
                    <li>First do this.</li>
                    <li>Then do that.</li>
                    <li>Finally do this.</li>
                </ol>
            </li>
            
            <li>Third item. This item contains a variable list.
                <dl>
                    <dlentry>
                        <dt>Term #1</dt>
                        <dd>Definition of term #1.</dd>
                    </dlentry>
                    
                    <dlentry>
                        <dt>Term #2</dt>
                        <dd>Definition of term #2.</dd>
                    </dlentry>
                </dl>
            </li>
        </ul>
    </body>
    
    <related-links>
        <link format="html" href="https://docbook.org/" scope="external">
            <linktext>DocBook 5</linktext>
        </link>
        <link format="html" href="https://www.oasis-open.org/committees/tc_home.php?wg_abbrev=dita" scope="external">
            <linktext>DITA</linktext>
        </link>
    </related-links>
</topic>
```

### Sections

DITA has no `<h1>`, `<h2>`, `<h3>`, etc, heading elements.
Instead, it has the `<section>` element which generally always has a `<title>` child element.

Note that **`<section>` elements cannot nest**.

Example:

```xml
<section>
  <title>The customary “hello word” program in Tcl/Tk</title>

  <pre frame="all">button .hello -text "Hello, World!" -command { exit }
       pack .hello</pre>
</section>
```

## Figures and examples

Of course, DITA has also `<fig>`, `<table>` and `<example>` elements.

- The `<example>` element is just a specialized kind of `<section>`.
- The `<fig>` element generally has a `<title>` and generally contains an `<image>` element.
- Like `<img>`, its HTML counterpart, the `<image>` “inline element” may be contained in any “block element”.
  The graphics file to be displayed is specified using the `<href>` attribute.
  The `<image>` element also has `@width`, `@height`, `@scale` and `@align` attributes.

```xml
<example>
    <title>Converting a color image to black and white</title>

    <pre>$ convert -dither Floyd-Steinberg -monochrome photo.png bwphoto.gif</pre>

    <fig>
        <title>The photo converted to black and white</title>
        <image href="bwphoto.gif" align="center"/>
    </fig>
</example>
```

## Tables

DITA has two kinds of table element:
`<simpletable>` which is specific to DITA, and
`<table>` which is in fact a CALS table (also know as a DocBook table).

`<Simpletable>` example:

```xml
<simpletable relcolwidth="1* 2* 3*">
  <sthead>
    <stentry>A</stentry>
    <stentry>B</stentry>
    <stentry>C</stentry>
  </sthead>

  <strow>
    <stentry>A,1</stentry>
    <stentry>B,1</stentry>
    <stentry>C,1</stentry>
  </strow>

  <strow>
    <stentry>A,2</stentry>
    <stentry>B,2</stentry>
    <stentry>C,2</stentry>
  </strow>
</simpletable>
```

A `<simpletable>` element contains an optional `<sthead>` element, followed by one or more `<strow>` elements.
Both row elements, `<sthead>` and `<strow>`, contain `<stentry>` cell elements.
The `@relcolwidth` attribute may be used to specify the relative width of each column.

Same as above example but using a CALS `<table>` this time:

```xml
<table>
  <title>Sample CALS table</title>

  <tgroup cols="3">
    <colspec colwidth="1*"/>
    <colspec colwidth="2*"/>
    <colspec colwidth="3*"/>

    <thead>
      <row>
        <entry align="center">A</entry>
        <entry align="center">B</entry>
        <entry align="center">C</entry>
      </row>
    </thead>

    <tbody>
      <row>
        <entry>A,1</entry>
        <entry>B,1</entry>
        <entry>C,1</entry>
      </row>

      <row>
        <entry>A,2</entry>
        <entry>B,2</entry>
        <entry>C,2</entry>
      </row>
    </tbody>
  </tgroup>
</table>
```

CALS tables are quite complex and explaining how they can be used is out of the scope of this tutorial.
**Our recommendation is to use CALS tables rather than `<simpletable>`s
only when you want a cell to span more than one row and/or more than one column.**

## The most commonly used “inline elements”

The most generic inline elements are also borrowed from HTML:
`<i>` (italic), `<b>` (bold), `<tt>` (teletype or monospaced text), `<sub>` (subscript), `<sup>` (superscript).

However, like with any other document type,
you should always try to use the most specific element for your needs. Examples:

- If you need to specify a **filename**, do not use `<tt>`, instead use `<filepath>`.
- If you need to specify a **variable**, do not use `<i>`, instead use `<varname>`.
- If you need to specify **the name of a command**, do not use `<b>`, instead use `<cmdname>`.

DITA has dozens of such useful inline elements.
In order to use them, we recommend authoring your documents with a DITA-aware XML editor and
browsing through the element names suggested by the editor.
Generally these names are very descriptive, so there is no real need to read the documentation.

**Remember**

Using the most specific elements rather than the generic `<i>`, `<b>`, `<tt>` elements, means getting nicer deliverables.

Example: Let's suppose you want to refer to the "Open" item of the "File" menu.
Do not type `<tt>File->Open</tt>` which would be rendered as: `File->Open`.
Instead, type `<menucascade><uicontrol>File</uicontrol><uicontrol>Open</uicontrol></menucascade>`,
which will be rendered as: `File → Open`. Much nicer, isn't it?

See [`<uicontrol>`](http://docs.oasis-open.org/dita/dita/v1.3/os/part2-tech-content/langRef/technicalContent/uicontrol.html) and
[`<menucascade>`](http://docs.oasis-open.org/dita/dita/v1.3/os/part2-tech-content/langRef/technicalContent/menucascade.html).

## The `<xref>` and `<link>` elements

DITA has two elements which allow specification of internal or external links: `<xref>` and `<link>`.

- The `<xref>` “inline element” may be contained in any “block element”.
- The `<link>` element may be contained only in a `<related-links>` element.

Both elements may contain text, though in the case of the `<link>` element,
this text must be wrapped in a `<linktext>` child element.

For both elements, the target of the link is specified by the value of the `@href` attribute,
which is an absolute or relative URL, possibly ending with a fragment.

Examples:

```text
<xref href="topic_structure.dita"/>

<xref href="http://www.xmlmind.com/xmleditor/"
      format="html"
      scope="external">XMLmind XML Editor</xref>

<link href="samples/sample_topic.dita#docbook_or_dita"/>

<link href="http://www.xmlmind.com/ditac/"
      format="html"
      scope="external">
<linktext>XMLmind DITA Converter</linktext>
</link>
```

### External links

The target of an external link is any location outside the overall DITA document.
This location may be an absolute or relative URL.
This location is not intended to be transformed by the DITA processing software
(e.g. DITA Open Toolkit or XMLmind DITA Converter).

**Remember**

- Always specify a text for an external link,
  as the DITA processing software has no way to automatically generate some text for such links.
- Always specify the `@format` attribute of the link element.
  Example: given a URL such as "http://www.xmlmind.com/ditac/",
  the DITA processing software has no way to guess that this corresponds to an HTML file.
- Always specify attribute `scope="external"` for such links.
  By doing so, you instruct the DITA processing software to use the target location as is in the deliverable.

### Internal links

The target of an **internal link** (`<xref>` or `<link>` element) is a DITA element belonging to the same DITA document.
This target element may be found in the same XML file as the link element or, on the contrary, in a different XML file.
The latter case is still considered to be an internal link
because both the link and its target belong to the same overall DITA document.

Of course, in order to use **a DITA element** as the **target of a link**, this element must have an `@id` attribute.

The value of the `@href` attribute of a `link` element is:
`URL_of_the_target_DITA_file#qualified_ID_of_the_target_element`, where:

- `URL_of_the_target_DITA_file` may be omitted when both the link and its target are found in the same XML file.
- `#qualified_ID_of_the_target_element` may be omitted if you want to address the first topic contained in an XML file.

What is the qualified ID of the target element?

- It's simply the value of the `@id` attribute for a topic element (of any kind: `<topic>`, `<concept>`, `<reference>`, etc).
- It's the value of the `@id` attribute of the target element prefixed by "`ID_of_the_topic_ancestor/`" for any descendant element of a topic.

Example: Let's suppose you want to add an `<xref>` element to `topic1.dita`:

```xml
<topic id="t1">
  <title>Title of topic 1</title>
  <body>
    <p id="p1">Paragraph inside topic 1.</p>
    <p>More information in <xref href="???"/>.</p>
  </body>
</topic>
```

Let's suppose that you want to address elements contained in `topic2.dita`,
this file being found in the same directory as `topic1.dita`.

```xml
<topic id="t2">
  <title>Title of topic 2</title>
  <body>
    <p id="p2">Paragraph inside topic 2.</p>
  </body>
</topic>
```

- If you want to address topic "t1", specify href="#t1".
- If you want to address paragraph "p1", specify href="#t1/p1".
- If you want to address topic "t2", specify href="topic2.dita#t2" or more simply href="topic2.dita".
- If you want to address paragraph "p2", specify href="topic2.dita#t2/p2".

**Remember**

There is generally no need to specify the text of internal links,
as the DITA processing software can automatically generate this text.

Example: converting the following paragraph to XHTML

```text
<p>More information in <xref href="topic2.dita"/>.</p>
```

may result in something like:

```text
<p>More information in
   <a href="page-23.html#t2">Title of topic 2</a>.</p>
```

This probably works fine for any element having a title: `<topic>`, `<section>`, `<table>`, `<fig>`, etc.
However this cannot work for the other elements.

For example, do not expect the DITA processing software to generate some text for:

```text
<xref href="topic2.dita#t2/p2"/>
```

Instead, explicitly specify some text:

```text
<xref href="topic2.dita#t2/p2">this paragraph</xref>
```

Link targets are tedious and error-prone to specify by hand.
Using a DITA-aware XML editor is therefore especially handy when it comes to inserting link elements.




