---
title: "DITA XML: map"
sequence: "103"
---

## The `<map>` element

A topic `<map>` mainly contains:

- A `<title>` child element.
- A `<topicmeta>` element where you can specify the author of the document, the date of publication, etc.
- A hierarchy of `<topicref>` elements.

The `<href>` attribute of a `<topicref>` element specifies the URL of a topic
which is part of the DITA document. Example:

```text
<topicref href="samples/sample_glossary.dita"/>
```

If the target XML file contains several topics (not recommended),
you'll have to use a fragment to specify the ID of the referenced topic.

```text
<topicref href="samples/sample_glossary.dita#javascript"/>
```

A map contains a hierarchy of `<topicref>` elements. What does this mean?

```xml

<topicref href="topic.dita">
    <topicref href="topic_structure.dita">
        <topicref href="samples/sample_topic.dita"/>
    </topicref>
    <topicref href="block_elements.dita"/>
    <topicref href="inline_elements.dita"/>
    <topicref href="link_elements.dita"/>
</topicref>
```

In the case of the above example, this means two things:

- The overall DITA document contains this sequence of topics: `topic.dita`, `topic_structure.dita`,
  `samples/sample_topic.dita`, `block_elements.dita`, `inline_elements.dita`, `link_elements.dita`.
- Topics `topic_structure.dita`, `block_elements.dita`, `inline_elements.dita`, `link_elements.dita`
  are subsections of topic `topic.dita`.
  Topic `samples/sample_topic.dita` is a subsection of topic `topic_structure.dita`.

What follows is the topic map actually used for this tutorial (contents of file `tutorial.ditamap`):

```text
<map>
  <title>DITA for the Impatient</title>

  <topicmeta>
    <author>Hussein Shafie</author>
    <publisher>Pixware</publisher>
    <critdates>
      <created date="October 7, 2009"/>
    </critdates>
  </topicmeta>

  <topicref href="introduction.dita"/>
  <topicref href="topics_and_maps.dita"/>
  <topicref href="topic.dita">
    <topicref href="topic_structure.dita">
      <topicref href="samples/sample_topic.dita" toc="no"/>
    </topicref>
    <topicref href="block_elements.dita"/>
    <topicref href="inline_elements.dita"/>
    <topicref href="link_elements.dita"/>
  </topicref>
  .
  .
  .
  <topichead navtitle="Topic maps">
    <topicref href="map.dita"/>
    <topicref href="bookmap.dita"/>
  </topichead>
  <topicref href="conclusion.dita"/>
</map>
```

### The @toc attribute

Specifying attribute `toc="no"` for a `<topicref>` element prevents it from appearing in the generated Table of Contents.

```xml
<topicref href="topic_structure.dita">
    <topicref href="samples/sample_topic.dita" toc="no"/>
</topicref>
```

### The `<topichead>` element

The `<topichead>` element provides an author with a simple way
to group several topics in the same HTML page and to give this HTML page a title.

```xml
<topichead navtitle="Topic maps">
    <topicref href="map.dita"/>
    <topicref href="bookmap.dita"/>
</topichead>
```

## The `<bookmap>` element

A `<bookmap>` element is just a more elaborate form of `<map>`.
We recommend using a `<bookmap>` for anything more complex than an article.


> Tip: 
> You don't need to create a `<map>` for the screen media and a `<bookmap>` for the print media.
> If you follow the “one topic per XML file” rule,
> a single topic map (`<map>` or `<bookmap>` depending on the complexity of the contents) is all you need.

- A `<bookmap>` may have a `<booktitle>` rather than a `<title>`.
- Its metadata wrapper element, `<bookmeta>`, may contain richer information than the `<topicmeta>` element.
- A bookmap may contain specializations of the `<topicref>` element having stronger semantics: `<part>`, `<chapter>`, `<appendix>`.
- The hierarchy of references to topic elements
  which makes up the body of the document may be preceded by a `<frontmatter>` element and followed by a `<backmatter>` element.

These wrapper elements can contain references to actual, hand-written, topics:
bookabstract, `<preface>`, `<dedication>`, `<colophon>`, etc.

However, the most common use of `<frontmatter>` and `<backmatter>` is to contain the following,
empty placeholder elements: `<toc>`, `<figurelist>`, `<tablelist>`, `<indexlist>`.
These placeholders instruct the DITA processing software to automatically generate:
a Table of Contents, a List of Figures, a List of Tables, an Index.

What follows is a possible `<bookmap>` for this tutorial (contents of file `tutorial-book.ditamap`):

```text
<bookmap>
  <booktitle>
    <mainbooktitle>DITA for the Impatient</mainbooktitle>
  </booktitle>

  <bookmeta>
    <authorinformation>
      <personinfo>...</personinfo>
      <organizationinfo>...</organizationinfo>
    </authorinformation>
    <critdates>
      <created date="October 7, 2009"/>
    </critdates>
  </bookmeta>

  <frontmatter>
    <booklists>
      <toc/>
      <figurelist/>
      <tablelist/>
    </booklists>
  </frontmatter>

  <chapter href="introduction.dita"/>
  <chapter href="topics_and_maps.dita"/>
  <chapter href="topic.dita">
    <topicref href="topic_structure.dita">
      <topicref href="samples/sample_topic.dita" toc="no"/>
    </topicref>
    <topicref href="block_elements.dita"/>
    <topicref href="inline_elements.dita"/>
    <topicref href="link_elements.dita"/>
  </chapter>
  .
  .
  .
  <chapter navtitle="Topic maps">
    <topicref href="map.dita"/>
    <topicref href="bookmap.dita"/>
  </chapter>
  <chapter href="conclusion.dita"/>
</bookmap>
```


