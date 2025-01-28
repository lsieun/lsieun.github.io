---
title: "Block With Attribute"
sequence: "104"
---


**The definition of a block** is stored in a `BlockTableRecord`.
If that block has attributes, these are stored in the `BlockTableRecord` as `AttributeDefinitions` – 
just like any other entity is stored in the `BlockTableRecord`.



When **we insert a block** into a drawing (e.g. into modelspace), we insert a `BlockReference`.
If the block has attributes,
then each (non-constant) `AttributeDefinition` in the `BlockTableRecord` has a matching `AttributeReference`
attached to the `BlockReference`.

**Constant attributes** are treated slightly differently
because their text is constant across all instances of the block (across all `BlockReference`s).
They are stored in the `BlockTableRecord`,
and there is no corresponding `AttributeReference` attached to the `BlockReference`.

## Reference

- [Inserting a block with attributes to modelspace](https://adndevblog.typepad.com/autocad/2012/06/inserting-a-block-with-attributes-to-modelspace.html)
