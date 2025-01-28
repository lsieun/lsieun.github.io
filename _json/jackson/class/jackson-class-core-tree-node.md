---
title: "TreeNode"
sequence: "TreeNode"
---

The `TreeNode` is a Marker interface used to denote JSON Tree nodes,
as far as the core package knows them (which is very little):
mostly needed to allow `ObjectCodec` to have some level of interoperability.
Most functionality is within `JsonNode` base class in mapper package.

```java
public interface TreeNode {}
```

```java
public abstract class JsonNode
    extends JsonSerializable.Base // i.e. implements JsonSerializable
    implements TreeNode, Iterable<JsonNode>
{}
```

Note that in Jackson 1.x `JsonNode` itself was part of core package:
Jackson 2.x refactored this since conceptually Tree Model is part of mapper package,
and so part visible to core package should be minimized.

NOTE: starting with Jackson 2.2,
there is more functionality available via this class,
and the intent was that this should form actual base for multiple alternative tree representations;
for example, immutable trees could use different implementation than mutable trees.


```text
                                  ┌─── asToken()
                                  │
                                  ├─── numberType()
                                  │
                                  ├─── size()
                                  │
            ┌─── introspection ───┼─── isValueNode()
            │                     │
            │                     │                         ┌─── isArray()
            │                     ├─── isContainerNode() ───┤
            │                     │                         └─── isObject()
            │                     │
            │                     └─── isMissingNode()
            │
            │                                  ┌─── get(String fieldName)
            │                     ┌─── get ────┤
            │                     │            └─── get(int index)
TreeNode ───┤                     │
            │                     │            ┌─── path(String fieldName)
            │                     ├─── path ───┤
            ├─── traversal ───────┤            └─── path(int index)
            │                     │
            │                     ├─── all ────┼─── fieldNames()
            │                     │
            │                     │            ┌─── at(JsonPointer ptr)
            │                     └─── at ─────┤
            │                                  └─── at(String jsonPointerExpression)
            │
            │                     ┌─── traverse()
            └─── convert ─────────┤
                                  └─── traverse(ObjectCodec codec)
```
