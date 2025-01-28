---
title: "ObjectNode"
sequence: "ObjectNode"
---

`ObjectNode`

```java
public class ObjectNode
    extends ContainerNode<ObjectNode>
    implements java.io.Serializable
{}
```

```text
                                               ┌─── set(String propertyName, JsonNode value)
                                               │
                               ┌─── set ───────┼─── setAll(Map<String,? extends JsonNode> properties)
                               │               │
                               │               └─── setAll(ObjectNode other)
                               │
                               ├─── replace ───┼─── replace(String propertyName, JsonNode value)
                               │
                               │               ┌─── without(String propertyName)
                               ├─── without ───┤
                               │               └─── without(Collection<String> propertyNames)
                               │
              ┌─── JsonNode ───┤               ┌─── put(String propertyName, JsonNode value)
              │                ├─── put ───────┤
              │                │               └─── putIfAbsent(String propertyName, JsonNode value)
              │                │
              │                │               ┌─── remove(String propertyName)
              │                │               │
              │                ├─── remove ────┼─── remove(Collection<String> propertyNames)
              │                │               │
              │                │               └─── removeAll()
              │                │
              │                │               ┌─── retain(Collection<String> propertyNames)
              │                └─── retain ────┤
ObjectNode ───┤                                └─── retain(String... propertyNames)
              │
              │                ┌─── ArrayNode ────┼─── putArray(String propertyName)
              │                │
              │                │                  ┌─── putObject(String propertyName)
              │                │                  │
              │                │                  ├─── putPOJO(String propertyName, Object pojo)
              │                │                  │
              │                │                  ├─── putRawValue(String propertyName, RawValue raw)
              │                │                  │
              │                │                  ├─── putNull(String propertyName)
              │                │                  │
              └─── typed ──────┤                  ├─── put(String fieldName, short v)
                               │                  │
                               │                  ├─── put(String fieldName, Short v)
                               │                  │
                               │                  ├─── put(String fieldName, int v)
                               │                  │
                               │                  ├─── put(String fieldName, Integer v)
                               │                  │
                               │                  ├─── put(String fieldName, long v)
                               │                  │
                               │                  ├─── put(String fieldName, Long v)
                               └─── ObjectNode ───┤
                                                  ├─── put(String fieldName, float v)
                                                  │
                                                  ├─── put(String fieldName, Float v)
                                                  │
                                                  ├─── put(String fieldName, double v)
                                                  │
                                                  ├─── put(String fieldName, Double v)
                                                  │
                                                  ├─── put(String fieldName, BigDecimal v)
                                                  │
                                                  ├─── put(String fieldName, BigInteger v)
                                                  │
                                                  ├─── put(String fieldName, String v)
                                                  │
                                                  ├─── put(String fieldName, boolean v)
                                                  │
                                                  ├─── put(String fieldName, Boolean v)
                                                  │
                                                  └─── put(String fieldName, byte[] v)
```
