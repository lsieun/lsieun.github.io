---
title: "Composition"
sequence: "113"
---



## Defining schema documents

A schema document is most typically a physical XML file whose root element is `schema`,
but this is only one form of schema document.
A schema document may also be a fragment of another XML document referenced
using a fragment identifier or an XPointer, a DOM tree in memory, or some other physical representation.

**Each schema document** describes components for **at most one namespace**, known as its **target namespace**.
Several schema documents can describe components in the same namespace.
Some schema documents have no **target namespace** at all.

## Combining multiple schema documents

There are several methods of explicitly combining multiple schema documents.

- **Includes** are used to combine schema documents that have the same target namespace.
- **Imports** are used to combine schema documents that have different target namespaces.
- **Redefines** and **overrides** are used to combine schema documents that have the same target namespace,
  while revising the definition of the included components.

Although **includes** and **imports** are very common, they are not the only way to assemble schema documents.
There is not always a "main" schema document that represents the whole schema.
Some other alternatives are:

- The instance author can specify multiple schema locations in the instance.
- The processor can assemble schema documents from predefined locations.
- Multiple command-line parameters can be used to list the locations of the schema documents.

### include

An `include` is used when you want to include other schema documents in a schema document
that has the same target namespace.
This provides for modularization of schema documents.

The `include` elements may only appear at the top level of a `schema` document,
and they must appear at the beginning (along with the `import`, `redefine`, and `override` elements).

The `schemaLocation` attribute indicates where the included schema document is located.
This attribute is required, although the location is not required to be resolvable.
However, if it is resolvable, it must be a complete schema document.

There can be multiple `include` elements in a schema document.
There can also be multiple levels of includes in schema documents.

It is not an error to include the exact same schema document twice.

### Chameleon includes

In the case where the included schema document has no target namespace,
all components of the included schema document take on the namespace of the including schema document.
These components are sometimes called chameleon components,
because their namespace changes depending on where they are included.

### import

An `import` is used to tell the processor that you will be referring to components from other namespaces.

**Imports** differ from **includes** in two important ways.
First, includes only take place within a namespace,
while imports take place across namespaces.
The second, subtler distinction is their general purpose.
The purpose of an include is specifically to pull in other schema documents,
while the purpose of an import is to record a dependency on another namespace, not necessarily another schema document.
Import does allow you to specify the location of a schema document for that namespace,
but it is just a hint, and the processor is not required to try to resolve it.

The `import` elements may only appear at the top level of a schema document,
and must appear at the beginning (along with the `include`, `redefine`, and `override` elements).

The `namespace` attribute indicates the namespace that you wish to import.
If you do not specify a namespace, it means that you are importing components that are not in any namespace.
The imported namespace cannot be the same as the target namespace of the importing schema document.
If the importing schema document has no target namespace,
the `import` element must have a `namespace` attribute.

The `schemaLocation` attribute provides a hint to the processor as to where to find a schema document
that declares components for that namespace.
If you do not specify a `schemaLocation`,
it is assumed that the processor somehow knows where to find the schema document,
perhaps because it was specified by the user or built into the processor.
When `schemaLocation` is present and the processor is able to resolve the location to some resource,
it must resolve to a schema document.
That schema document's **target namespace** must be equal to the value of the `namespace` attribute of the `import` element.

**Looping referencesare** also acceptable, because this just indicates the interdependence of the components.


