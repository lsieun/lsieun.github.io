---
title: "Link: permalink"
sequence: "102"
---

[UP](/jekyll/jekyll-index.html)

## Collections

For collections (including `posts` and `drafts`), you have the option to override the global permalink in the collection configuration in `_config.yml`:

```text
collections:
  my_collection:
    output: true
    permalink: /:collection/:name
```

Collections have the following placeholders available:

| VARIABLE | DESCRIPTION |
|----------|-------------|
| `:collection` | Label of the containing collection. |
| `:path` | Path to the document relative to the collection's directory, including base filename of the document. |
| `:name` | The document's base filename, with every sequence of spaces and non-alphanumeric characters replaced by a hyphen. |
| `:title` | The `:title` template variable will take the `slug` front matter variable value if any is present in the document; if none is defined then `:title` will be equivalent to `:name`, aka the slug generated from the filename. |
| `:output_ext` | Extension of the output file. (Included by default and usually unnecessary.) |

我自己的应用示例：

```text
java-asm:
  output: true
  permalink: /java/asm/:path:output_ext
  title: "Java ASM系列"
```

## References

- [jekyllrb: Permalinks](https://jekyllrb.com/docs/permalinks/)
