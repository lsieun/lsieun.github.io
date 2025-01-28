---
title: "ObjectCodec"
sequence: "ObjectCodec"
---

The `ObjectCodec` is an abstract class
that defines the interface that `JsonParser` and `JsonGenerator` use
to serialize and deserialize regular Java objects (POJOs aka Beans).

The standard implementation of this class is `com.fasterxml.jackson.databind.ObjectMapper`,
defined in the "jackson-databind".

```java
public abstract class ObjectCodec
    extends TreeCodec // since 2.3
    implements Versioned // since 2.3
{
    
}
```

```text
             ┌─── readTree(JsonParser p)
             │
             ├─── writeTree(JsonGenerator g, TreeNode tree)
             │
             ├─── missingNode()
             │
TreeCodec ───┼─── nullNode()
             │
             ├─── createArrayNode()
             │
             ├─── createObjectNode()
             │
             └─── treeAsTokens(TreeNode node)
```

```text
                                        ┌─── readValue(JsonParser p, Class<T> valueType)
                                        │
                                        ├─── readValue(JsonParser p, TypeReference<T> valueTypeRef)
                                        │
                                        ├─── readValue(JsonParser p, ResolvedType valueType)
               ┌─── de-serialization ───┤
               │                        ├─── readValues(JsonParser p, Class<T> valueType)
               │                        │
               │                        ├─── readValues(JsonParser p, TypeReference<T> valueTypeRef)
               │                        │
ObjectCodec ───┤                        └─── readValues(JsonParser p, ResolvedType valueType)
               │
               ├─── serialization ──────┼─── writeValue(JsonGenerator gen, Object value)
               │
               ├─── conversion ─────────┼─── treeToValue(TreeNode n, Class<T> valueType)
               │
               └─── basic accessor ─────┼─── getFactory()
```