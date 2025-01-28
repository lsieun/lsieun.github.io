---
title: "JsonNode"
sequence: "JsonNode"
---


```text
                                                                       ┌─── getNodeType():JsonNodeType
                                                                       │
                                                                       │                                  ┌─── isBoolean()
                                                                       │                                  │
                                                                       │                                  ├─── isBinary()
                                                                       │                                  │
                                                                       │                                  │                                                   ┌─── isShort()
                                                                       │                                  │                                                   │
                                                                       │                                  │                   ┌─── isIntegralNumber() ────────┼─── isInt()
                                                                       │                                  │                   │                               │
                                                                       │                                  │                   │                               └─── isLong()
                                                                       │                                  │                   │
                                                                       │                                  │                   │                               ┌─── isFloat()
                                                                       ├─── is ───────────────────────────┼─── isNumber() ────┼─── isFloatingPointNumber() ───┤
                               ┌─── type introspection ────────────────┤                                  │                   │                               └─── isDouble()
                               │                                       │                                  │                   │
                               │                                       │                                  │                   ├─── isBigDecimal()
                               │                                       │                                  │                   │
                               │                                       │                                  │                   └─── isBigInteger()
                               │                                       │                                  │
                               │                                       │                                  ├─── isTextual()
                               │                                       │                                  │
                               │                                       │                                  ├─── isPojo()
                               │                                       │                                  │
                               │                                       │                                  └─── isNull()
                               │                                       │
                               │                                       │                                  ┌─── canConvertToInt()
                               │                                       │                                  │
                               │                                       └─── can ──────────────────────────┼─── canConvertToLong()
                               │                                                                          │
                               │                                                                          └─── canConvertToExactIntegral()
                               │
                               │                                       ┌─── booleanValue()
                               │                                       │
                               │                                       ├─── binaryValue()
                               │                                       │
                               │                                       │                      ┌─── shortValue()
                               │                                       │                      │
                               │                                       │                      ├─── intValue()
                               │                                       │                      │
                               │                                       │                      ├─── longValue()
                               ├─── straight value access ─────────────┤                      │
                               │                                       ├─── numberValue() ────┼─── floatValue()
                               │                                       │                      │
                               │                                       │                      ├─── doubleValue()
                               │                                       │                      │
                               │                                       │                      ├─── decimalValue()
                               │                                       │                      │
                               │                                       │                      └─── bigIntegerValue()
                               │                                       │
                               │                                       └─── textValue()
                               │
                               │                                       ┌─── asText()
                               │                                       │
                               │                                       ├─── asText(String defaultValue)
                               │                                       │
                               │                                       ├─── asInt()
                               │                                       │
                               │                                       ├─── asInt(int defaultValue)
                               │                                       │
                               │                                       ├─── asLong()
                               ├─── value access with conversion(s) ───┤
                               │                                       ├─── asLong(long defaultValue)
                               │                                       │
                               │                                       ├─── asDouble()
                               │                                       │
                               │                                       ├─── asDouble(double defaultValue)
                               │                                       │
                               │                                       ├─── asBoolean()
                               │                                       │
                               │                                       └─── asBoolean(boolean defaultValue)
                               │
                               │                                       ┌─── require()
JsonNode ───┼─── Public API ───┤                                       │
                               │                                       ├─── requireNonNull()
                               │                                       │
                               │                                       ├─── required(String propertyName)
                               ├─── extended traversal ────────────────┤
                               │                                       ├─── required(int index)
                               │                                       │
                               │                                       ├─── requiredAt(String pathExpr)
                               │                                       │
                               │                                       └─── requiredAt(JsonPointer path)
                               │
                               │                                       ┌─── has(String fieldName)
                               │                                       │
                               │                                       ├─── has(int index)
                               ├─── value find ────────────────────────┤
                               │                                       ├─── hasNonNull(String fieldName)
                               │                                       │
                               │                                       └─── hasNonNull(int index)
                               │
                               │                                       ┌─── iterator()
                               │                                       │
                               ├─── container access ──────────────────┼─── elements()
                               │                                       │
                               │                                       └─── fields()
                               │
                               │                                       ┌─── findValue(String fieldName)
                               │                                       │
                               │                                       ├─── findValues(String fieldName)
                               │                                       │
                               │                                       ├─── findValues(String fieldName, List<JsonNode> foundSoFar)
                               │                                       │
                               │                                       ├─── findValuesAsText(String fieldName)
                               │                                       │
                               ├─── find methods ──────────────────────┼─── findValuesAsText(String fieldName, List<String> foundSoFar)
                               │                                       │
                               │                                       ├─── findPath(String fieldName)
                               │                                       │
                               │                                       ├─── findParent(String fieldName)
                               │                                       │
                               │                                       ├─── findParents(String fieldName)
                               │                                       │
                               │                                       └─── findParents(String fieldName, List<JsonNode> foundSoFar)
                               │
                               │                                                          ┌─── withObject(String expr)
                               │                                                          │
                               │                                                          ├─── withObject(String expr, OverwriteMode overwriteMode, boolean preferIndex)
                               │                                       ┌─── withObject ───┤
                               │                                       │                  ├─── withObject(JsonPointer ptr)
                               │                                       │                  │
                               │                                       │                  └─── withObject(JsonPointer ptr, OverwriteMode overwriteMode, boolean preferIndex)
                               ├─── path handling ─────────────────────┤
                               │                                       │                  ┌─── withArray(String exprOrProperty)
                               │                                       │                  │
                               │                                       │                  ├─── withArray(String expr, OverwriteMode overwriteMode, boolean preferIndex)
                               │                                       └─── withArray ────┤
                               │                                                          ├─── withArray(JsonPointer ptr)
                               │                                                          │
                               │                                                          └─── withArray(JsonPointer ptr, OverwriteMode overwriteMode, boolean preferIndex)
                               │
                               └─── standard methods ──────────────────┼─── toPrettyString()
```

```text
难难难，道最玄，莫把金丹作等闲。不遇至人传妙诀，空言口困舌头干。
```

## JsonNodeType

```java
public enum JsonNodeType
{
    ARRAY,
    BINARY,
    BOOLEAN,
    MISSING,
    NULL,
    NUMBER,
    OBJECT,
    POJO,
    STRING
}
```

