---
title: "Block Intro"
sequence: "101"
---

As a design grows in complexity, elements often are repeated many times.
For example, you might use several lines and circles to represent a bolt head or a desk with a grommet.

AutoCAD allows you to reuse geometry by creating what is known as a **block**.
A block is a named grouping of objects that can be inserted in a drawing multiple times.
Each insertion creates a **block reference** that displays the objects stored in the block at the insertion point.
If the block is changed, each block reference based on that block is updated.

```text
block
block reference
```

Blocks aren't the only method for reusing geometry or other data in a drawing.
A drawing file can also include **external references** (**xrefs**) to geometry stored in another drawing file.
External references can include blocks, raster images, and other documents.
When you reference another document, such as a PDF or DWF file, it is known as an **underlay**.

```text
external references (xrefs)
```

