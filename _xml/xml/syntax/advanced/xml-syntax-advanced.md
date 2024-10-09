---
title: "XML Syntax - Advanced"
sequence: "103"
---

## Processing Instructions

Processing instructions (abbreviated PI) is a mechanism to insert non-XML statements, such as scripts, in the document.

Processing instructions in an XML document specify directions for applications
that are expected to process the document.
The semantics associated with these instructions are application specific.

The syntax of a processing instruction is as follows:

```text
<?target "instructions"?>
```

In a processing instruction,
`target` specifies the target application that is expected to process the instruction,
and `instructions` specifies the processing instructions.

它的位置有要求吗？要放到头部吗？



## Special Attributes

XML defines two attributes:

- `xml:space`
- `xml:lang`

`xml:space` for those applications that discard duplicate spaces
(similar to Web browsers that discard unnecessary spaces in HTML).
This attribute controls whether the application can discard spaces.
If set to `preserve`, the application should preserve all spaces in this element and its children.
If set to `default`, the application can use its default space handling.

`xml:lang` in publishing, it is often desirable to know in which language the content is written.
This attribute can be used to indicate the language of the element's content. For example:

```text
<p xml:lang="en-GB">What colour is it?</p>
<p xml:lang="en-US">What color is it?</p>
```



