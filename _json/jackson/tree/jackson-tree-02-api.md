---
title: "JSON Tree API"
sequence: "102"
---

## API

### ObjectMapper

```text
                                  ┌─── createObjectNode()
                ┌─── container ───┤
                │                 └─── ArrayNode createArrayNode()
ObjectMapper ───┤
                │                 ┌─── missingNode()
                └─── value ───────┤
                                  └─── nullNode()
```

### ObjectNode

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

## API

### ObjectMapper

```text
                                  ┌─── createObjectNode()
                ┌─── container ───┤
                │                 └─── ArrayNode createArrayNode()
ObjectMapper ───┤
                │                 ┌─── missingNode()
                └─── value ───────┤
                                  └─── nullNode()
```

### JsonNodeFactory

```text
                                                        ┌─── booleanNode(boolean v)
                                                        │
                                     ┌─── literal ──────┼─── nullNode()
                                     │                  │
                                     │                  └─── missingNode()
                                     │
                                     │                  ┌─── numberNode(byte v)
                                     │                  │
                                     │                  ├─── numberNode(Byte value)
                                     │                  │
                                     │                  ├─── numberNode(short v)
                                     │                  │
                                     │                  ├─── numberNode(Short value)
                                     │                  │
                                     │                  ├─── numberNode(int v)
                                     │                  │
                                     │                  ├─── numberNode(Integer value)
                                     │                  │
                                     │                  ├─── numberNode(long v)
                                     ├─── numeric ──────┤
                                     │                  ├─── numberNode(Long v)
                   ┌─── value ───────┤                  │
                   │                 │                  ├─── numberNode(BigInteger v)
                   │                 │                  │
                   │                 │                  ├─── numberNode(float v)
                   │                 │                  │
                   │                 │                  ├─── numberNode(Float value)
                   │                 │                  │
                   │                 │                  ├─── numberNode(double v)
                   │                 │                  │
                   │                 │                  ├─── numberNode(Double value)
                   │                 │                  │
                   │                 │                  └─── numberNode(BigDecimal v)
JsonNodeFactory ───┤                 │
                   │                 │                  ┌─── textNode(String text)
                   │                 │                  │
                   │                 ├─── textual ──────┼─── binaryNode(byte[] data) - base64-encoded
                   │                 │                  │
                   │                 │                  └─── binaryNode(byte[] data, int offset, int length) - base64-encoded
                   │                 │
                   │                 │                  ┌─── pojoNode(Object pojo)
                   │                 └─── structured ───┤
                   │                                    └─── rawValueNode(RawValue value)
                   │
                   │                 ┌─── arrayNode()
                   │                 │
                   └─── container ───┼─── arrayNode(int capacity)
                                     │
                                     └─── objectNode()
```


