---
title: "JsonParser"
sequence: "JsonParser"
---

The `JsonParser` is a base class
that defines public API for reading JSON content.

Instances are created using factory methods of a `JsonFactory` instance.

```text
笔记：如何创建实例
```

```java
public abstract class JsonParser
    implements Closeable, Versioned
{}
```

```text
                                  ┌─── getCodec()
              ┌─── Codec ─────────┤
              │                   └─── setCodec(ObjectCodec oc)
              │
              ├─── InputSource ───┼─── getInputSource()
              │
              │                                   ┌─── currentName()
              │                                   │
              │                                   ├─── getText()
              │                                   │
              │                                   ├─── getText(Writer writer)
              │                                   │
              │                   ┌─── text ──────┼─── getTextCharacters()
              │                   │               │
              │                   │               ├─── getTextLength()
JsonParser ───┤                   │               │
              │                   │               ├─── getTextOffset()
              │                   │               │
              │                   │               └─── hasTextCharacters()
              │                   │
              │                   │               ┌─── getNumberValue()
              │                   │               │
              │                   │               ├─── getNumberValueExact()
              │                   │               │
              │                   │               ├─── getNumberType()
              │                   │               │
              │                   │               ├─── getByteValue()
              │                   │               │
              │                   │               ├─── getShortValue()
              │                   │               │
              └─── token ─────────┼─── numeric ───┼─── getIntValue()
                                  │               │
                                  │               ├─── getLongValue()
                                  │               │
                                  │               ├─── getBigIntegerValue()
                                  │               │
                                  │               ├─── getFloatValue()
                                  │               │
                                  │               ├─── getDoubleValue()
                                  │               │
                                  │               └─── getDecimalValue()
                                  │
                                  │               ┌─── getBooleanValue()
                                  ├─── other ─────┤
                                  │               └─── getEmbeddedObject()
                                  │
                                  │               ┌─── getBinaryValue(Base64Variant bv)
                                  │               │
                                  │               ├─── getBinaryValue()
                                  └─── binary ────┤
                                                  ├─── readBinaryValue(OutputStream out)
                                                  │
                                                  └─── readBinaryValue(Base64Variant bv, OutputStream out)
```
