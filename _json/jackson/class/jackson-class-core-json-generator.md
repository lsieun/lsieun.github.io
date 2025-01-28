---
title: "JsonGenerator"
sequence: "JsonGenerator"
---

The `JsonGenerator` is a base class that defines public API for writing JSON content.

Instances are created using factory methods of a `JsonFactory` instance.


```text
                                                                       ┌─── writeStartArray()
                                                                       │
                                                                       ├─── writeStartArray(Object forValue)
                                                        ┌─── array ────┤
                                                        │              ├─── writeStartArray(Object forValue, int size)
                                                        │              │
                                                        │              └─── writeEndArray()
                                                        │
                                                        │              ┌─── writeStartObject()
                                                        │              │
                                     ┌─── structural ───┤              ├─── writeStartObject(Object forValue)
                                     │                  ├─── object ───┤
                                     │                  │              ├─── writeStartObject(Object forValue, int size)
                                     │                  │              │
                                     │                  │              └─── writeEndObject()
                                     │                  │
                                     │                  │              ┌─── writeFieldName(String name)
                                     │                  │              │
                                     │                  └─── field ────┼─── writeFieldName(SerializableString name)
                                     │                                 │
                                     │                                 └─── writeFieldId(long id)
                                     │
                                     │                  ┌─── writeArray(int[] array, int offset, int length)
                                     │                  │
                                     │                  ├─── writeArray(long[] array, int offset, int length)
                                     ├─── array ────────┤
                                     │                  ├─── writeArray(double[] array, int offset, int length)
                                     │                  │
                                     │                  └─── writeArray(String[] array, int offset, int length)
                                     │
                                     │                  ┌─── writeString(String text)
                                     │                  │
                                     │                  ├─── writeString(Reader reader, int len)
                                     │                  │
                                     │                  ├─── writeString(char[] buffer, int offset, int len)
                                     ├─── text ─────────┤
                                     │                  ├─── writeString(SerializableString text)
                                     │                  │
                                     │                  ├─── writeRawUTF8String(byte[] buffer, int offset, int len)
                                     │                  │
                                     │                  └─── writeUTF8String(byte[] buffer, int offset, int len)
                                     │
                                     │                  ┌─── writeRaw(String text)
                                     │                  │
                                     │                  ├─── writeRaw(String text, int offset, int len)
                                     │                  │
                                     │                  ├─── writeRaw(char[] text, int offset, int len)
                                     │                  │
                                     │                  ├─── writeRaw(char c)
                                     │                  │
                                     │                  ├─── writeRaw(SerializableString raw)
                                     │                  │
                                     │                  ├─── writeRawValue(String text)
                 ┌─── write ─────────┤                  │
                 │                   │                  ├─── writeRawValue(String text, int offset, int len)
                 │                   ├─── binary ───────┤
                 │                   │                  ├─── writeRawValue(char[] text, int offset, int len)
                 │                   │                  │
                 │                   │                  ├─── writeRawValue(SerializableString raw)
                 │                   │                  │
                 │                   │                  ├─── writeBinary(Base64Variant bv, byte[] data, int offset, int len)
                 │                   │                  │
                 │                   │                  ├─── writeBinary(byte[] data, int offset, int len)
                 │                   │                  │
                 │                   │                  ├─── writeBinary(byte[] data)
                 │                   │                  │
                 │                   │                  ├─── writeBinary(InputStream data, int dataLength)
                 │                   │                  │
                 │                   │                  └─── writeBinary(Base64Variant bv, InputStream data, int dataLength)
                 │                   │
                 │                   │                  ┌─── writeNumber(short v)
                 │                   │                  │
                 │                   │                  ├─── writeNumber(int v)
                 │                   │                  │
                 │                   │                  ├─── writeNumber(long v)
                 │                   │                  │
                 │                   │                  ├─── writeNumber(BigInteger v)
                 │                   │                  │
                 │                   ├─── numeric ──────┼─── writeNumber(double v)
                 │                   │                  │
                 │                   │                  ├─── writeNumber(float v)
                 │                   │                  │
                 │                   │                  ├─── writeNumber(BigDecimal v)
                 │                   │                  │
JsonGenerator ───┤                   │                  ├─── writeNumber(String encodedValue)
                 │                   │                  │
                 │                   │                  └─── writeNumber(char[] encodedValueBuffer, int offset, int len)
                 │                   │
                 │                   │                  ┌─── writeBoolean(boolean state)
                 │                   │                  │
                 │                   ├─── other ────────┼─── writeNull()
                 │                   │                  │
                 │                   │                  └─── writeEmbeddedObject(Object object)
                 │                   │
                 │                   │                  ┌─── writePOJO(Object pojo)
                 │                   │                  │
                 │                   └─── object ───────┼─── writeObject(Object pojo)
                 │                                      │
                 │                                      └─── writeTree(TreeNode rootNode)
                 │
                 │                                      ┌─── writeNumberField(String fieldName, short value)
                 │                                      │
                 │                                      ├─── writeNumberField(String fieldName, int value)
                 │                                      │
                 │                                      ├─── writeNumberField(String fieldName, long value)
                 │                                      │
                 │                   ┌─── number ───────┼─── writeNumberField(String fieldName, BigInteger value)
                 │                   │                  │
                 │                   │                  ├─── writeNumberField(String fieldName, float value)
                 │                   │                  │
                 │                   │                  ├─── writeNumberField(String fieldName, double value)
                 │                   │                  │
                 │                   │                  └─── writeNumberField(String fieldName, BigDecimal value)
                 │                   │
                 │                   ├─── text ─────────┼─── writeStringField(String fieldName, String value)
                 │                   │
                 └─── convenience ───┤                  ┌─── writePOJOField(String fieldName, Object pojo)
                                     ├─── object ───────┤
                                     │                  └─── writeObjectField(String fieldName, Object pojo)
                                     │
                                     │                  ┌─── writeArrayFieldStart(String fieldName)
                                     ├─── collection ───┤
                                     │                  └─── writeObjectFieldStart(String fieldName)
                                     │
                                     │                  ┌─── writeBinaryField(String fieldName, byte[] data)
                                     │                  │
                                     │                  ├─── writeBooleanField(String fieldName, boolean value)
                                     └─── other ────────┤
                                                        ├─── writeNullField(String fieldName)
                                                        │
                                                        └─── writeOmittedField(String fieldName)
```
