---
title: "ObjectMapper"
sequence: "ObjectMapper"
---

Since the creation of an `ObjectMapper` object is expensive,
it's recommended that we reuse the same one for multiple operations.

```java
public class ObjectMapper extends ObjectCodec implements Versioned, Serializable {
}
```


```text
                                                              ┌─── registerModule(Module module)
                                                              │
                                                              ├─── registerModules(Module... modules)
                                                              │
                                                              ├─── registerModules(Iterable<? extends Module> modules)
                                                              │
                ┌─── Module registration ───┼─── discovery ───┼─── getRegisteredModuleIds()
                │                                             │
                │                                             ├─── findModules()
                │                                             │
                │                                             ├─── findModules(ClassLoader classLoader)
                │                                             │
                │                                             └─── findAndRegisterModules()
                │
                │                                                 ┌─── createGenerator(OutputStream out)
                │                                                 │
                │                                                 ├─── createGenerator(OutputStream out, JsonEncoding enc)
                │                                                 │
                │                           ┌─── JsonGenerator ───┼─── createGenerator(Writer w)
                │                           │                     │
                │                           │                     ├─── createGenerator(File outputFile, JsonEncoding enc)
                │                           │                     │
                │                           │                     └─── createGenerator(DataOutput out)
                │                           │
                │                           │                     ┌─── createParser(File src)
                │                           │                     │
                ├─── Factory methods ───────┤                     ├─── createParser(URL src)
                │                           │                     │
                │                           │                     ├─── createParser(InputStream in)
                │                           │                     │
                │                           │                     ├─── createParser(Reader r)
                │                           │                     │
                │                           │                     ├─── createParser(byte[] content)
                │                           │                     │
                │                           └─── JsonParser ──────┼─── createParser(byte[] content, int offset, int len)
                │                                                 │
ObjectMapper ───┤                                                 ├─── createParser(String content)
                │                                                 │
                │                                                 ├─── createParser(char[] content)
                │                                                 │
                │                                                 ├─── createParser(char[] content, int offset, int len)
                │                                                 │
                │                                                 ├─── createParser(DataInput content)
                │                                                 │
                │                                                 └─── createNonBlockingByteArrayParser()
                │
                │                                                                             ┌─── getSerializationConfig()
                │                                                                             │
                │                           ┌─── main config object ──────────────────────────┼─── getDeserializationConfig()
                │                           │                                                 │
                │                           │                                                 └─── getDeserializationContext()
                │                           │
                │                           ├─── ser/deser factory
                │                           │
                │                           ├─── mix-in annotations
                │                           │
                │                           ├─── introspection
                │                           │
                │                           ├─── global-default/per-type override settings
                │                           │
                │                           │                                                 ┌─── setDateFormat(DateFormat dateFormat)
                │                           ├─── other ───────────────────────────────────────┤
                │                           │                                                 └─── getDateFormat()
                │                           │
                │                           │                                                 ┌─── MapperFeature ────────────┼─── isEnabled(MapperFeature f)
                │                           │                                                 │
                │                           │                                                 │                              ┌─── isEnabled(SerializationFeature f)
                └─── Configuration ─────────┤                                                 │                              │
                                            │                                                 │                              ├─── configure(SerializationFeature f, boolean state)
                                            │                                                 │                              │
                                            │                                                 │                              ├─── enable(SerializationFeature f)
                                            │                                                 ├─── SerializationFeature ─────┤
                                            │                                                 │                              ├─── enable(SerializationFeature first, SerializationFeature... f)
                                            │                                                 │                              │
                                            │                                                 │                              ├─── disable(SerializationFeature f)
                                            │                                                 │                              │
                                            │                                                 │                              └─── disable(SerializationFeature first, SerializationFeature... f)
                                            │                                                 │
                                            │                                                 │                              ┌─── isEnabled(DeserializationFeature f)
                                            │                                                 │                              │
                                            │                                                 │                              ├─── configure(DeserializationFeature f, boolean state)
                                            │                                                 │                              │
                                            │                                                 │                              ├─── enable(DeserializationFeature feature)
                                            │                                                 ├─── DeserializationFeature ───┤
                                            │                                                 │                              ├─── enable(DeserializationFeature first, DeserializationFeature... f)
                                            │                                                 │                              │
                                            │                                                 │                              ├─── disable(DeserializationFeature feature)
                                            └─── simple features ─────────────────────────────┤                              │
                                                                                              │                              └─── disable(DeserializationFeature first, DeserializationFeature... f)
                                                                                              │
                                                                                              ├─── DatatypeFeature ──────────┼─── configure(DatatypeFeature f, boolean state)
                                                                                              │
                                                                                              │                              ┌─── isEnabled(JsonParser.Feature f)
                                                                                              │                              │
                                                                                              │                              ├─── configure(JsonParser.Feature f, boolean state)
                                                                                              ├─── JsonParser.Feature ───────┤
                                                                                              │                              ├─── enable(JsonParser.Feature... features)
                                                                                              │                              │
                                                                                              │                              └─── disable(JsonParser.Feature... features)
                                                                                              │
                                                                                              │                              ┌─── isEnabled(JsonGenerator.Feature f)
                                                                                              │                              │
                                                                                              │                              ├─── configure(JsonGenerator.Feature f, boolean state)
                                                                                              ├─── JsonGenerator.Feature ────┤
                                                                                              │                              ├─── enable(JsonGenerator.Feature... features)
                                                                                              │                              │
                                                                                              │                              └─── disable(JsonGenerator.Feature... features)
                                                                                              │
                                                                                              ├─── JsonFactory.Feature ──────┼─── isEnabled(JsonFactory.Feature f)
                                                                                              │
                                                                                              │                              ┌─── isEnabled(StreamReadFeature f)
                                                                                              └─── stream ───────────────────┤
                                                                                                                             └─── isEnabled(StreamWriteFeature f)



```

```text
                                                                                     ┌─── readTree(InputStream in)
                                                                                     │
                                                                                     ├─── readTree(Reader r)
                                                                                     │
                                                                                     ├─── readTree(String content)
                                                                                     │
                                            ┌─── deserialization ───┼─── JsonNode ───┼─── readTree(byte[] content)
                                            │                                        │
                                            │                                        ├─── readTree(byte[] content, int offset, int len)
                                            │                                        │
                                            │                                        ├─── readTree(File file)
                ┌─── Public API ────────────┤                                        │
                │                           │                                        └─── readTree(URL source)
                │                           │
                │                           ├─── serialization ─────┼─── writeTree(JsonGenerator g, JsonNode rootNode)
                │                           │
                │                           │                       ┌─── treeToValue(TreeNode n, JavaType valueType)
                │                           └─── conversion ────────┤
                │                                                   └─── valueToTree(Object fromValue)
                │
                │                                                   ┌─── canSerialize(Class<?> type)
                │                                                   │
                │                                                   ├─── canSerialize(Class<?> type, AtomicReference<Throwable> cause)
                │                           ┌─── accessor ──────────┤
                │                           │                       ├─── canDeserialize(JavaType type)
                │                           │                       │
                │                           │                       └─── canDeserialize(JavaType type, AtomicReference<Throwable> cause)
                │                           │
                │                           │                                           ┌─── readValue(File src, Class<T> valueType)
                │                           │                                           │
                │                           │                       ┌─── file ──────────┼─── readValue(File src, TypeReference<T> valueTypeRef)
                │                           │                       │                   │
                │                           │                       │                   └─── readValue(File src, JavaType valueType)
                │                           │                       │
                │                           │                       │                   ┌─── readValue(URL src, Class<T> valueType)
                │                           │                       │                   │
                │                           │                       ├─── url ───────────┼─── readValue(URL src, TypeReference<T> valueTypeRef)
                │                           │                       │                   │
                │                           │                       │                   └─── readValue(URL src, JavaType valueType)
                │                           │                       │
                │                           │                       │                   ┌─── readValue(String content, Class<T> valueType)
                │                           │                       │                   │
                │                           │                       ├─── string ────────┼─── readValue(String content, TypeReference<T> valueTypeRef)
                │                           │                       │                   │
                │                           │                       │                   └─── readValue(String content, JavaType valueType)
                │                           │                       │
                │                           │                       │                   ┌─── readValue(Reader src, Class<T> valueType)
                │                           │                       │                   │
                │                           │                       ├─── reader ────────┼─── readValue(Reader src, TypeReference<T> valueTypeRef)
ObjectMapper ───┤                           │                       │                   │
                │                           ├─── deserialization ───┤                   └─── readValue(Reader src, JavaType valueType)
                │                           │                       │
                │                           │                       │                   ┌─── readValue(InputStream src, Class<T> valueType)
                │                           │                       │                   │
                │                           │                       ├─── InputStream ───┼─── readValue(InputStream src, TypeReference<T> valueTypeRef)
                │                           │                       │                   │
                │                           │                       │                   └─── readValue(InputStream src, JavaType valueType)
                │                           │                       │
                │                           │                       │                   ┌─── readValue(byte[] src, Class<T> valueType)
                │                           │                       │                   │
                │                           │                       │                   ├─── readValue(byte[] src, int offset, int len, Class<T> valueType)
                │                           │                       │                   │
                │                           │                       │                   ├─── readValue(byte[] src, TypeReference<T> valueTypeRef)
                │                           │                       ├─── byte[] ────────┤
                │                           │                       │                   ├─── readValue(byte[] src, int offset, int len, TypeReference<T> valueTypeRef)
                │                           │                       │                   │
                │                           │                       │                   ├─── readValue(byte[] src, JavaType valueType)
                │                           │                       │                   │
                │                           │                       │                   └─── readValue(byte[] src, int offset, int len, JavaType valueType)
                │                           │                       │
                │                           │                       │                   ┌─── readValue(DataInput src, Class<T> valueType)
                │                           │                       └─── DataInput ─────┤
                │                           │                                           └─── readValue(DataInput src, JavaType valueType)
                │                           │
                │                           │                                      ┌─── writeValue(File resultFile, Object value)
                │                           │                                      │
                │                           │                                      ├─── writeValue(OutputStream out, Object value)
                │                           │                       ┌─── void ─────┤
                │                           │                       │              ├─── writeValue(DataOutput out, Object value)
                │                           │                       │              │
                │                           ├─── serialization ─────┤              └─── writeValue(Writer w, Object value)
                │                           │                       │
                │                           │                       ├─── String ───┼─── writeValueAsString(Object value)
                │                           │                       │
                │                           │                       └─── byte[] ───┼─── writeValueAsBytes(Object value)
                │                           │
                │                           │                       ┌─── writer()
                └─── Extended Public API ───┤                       │
                                            │                       ├─── writer(SerializationFeature feature)
                                            │                       │
                                            │                       ├─── writer(SerializationFeature first, SerializationFeature... other)
                                            │                       │
                                            │                       ├─── writer(DateFormat df)
                                            │                       │
                                            │                       ├─── writerWithView(Class<?> serializationView)
                                            │                       │
                                            │                       ├─── writerFor(Class<?> rootType)
                                            │                       │
                                            │                       ├─── writerFor(TypeReference<?> rootType)
                                            │                       │
                                            ├─── ObjectWriter ──────┼─── writerFor(JavaType rootType)
                                            │                       │
                                            │                       ├─── writer(PrettyPrinter pp)
                                            │                       │
                                            │                       ├─── writerWithDefaultPrettyPrinter()
                                            │                       │
                                            │                       ├─── writer(FilterProvider filterProvider)
                                            │                       │
                                            │                       ├─── writer(FormatSchema schema)
                                            │                       │
                                            │                       ├─── writer(Base64Variant defaultBase64)
                                            │                       │
                                            │                       ├─── writer(CharacterEscapes escapes)
                                            │                       │
                                            │                       └─── writer(ContextAttributes attrs)
                                            │
                                            │                       ┌─── reader()
                                            │                       │
                                            │                       ├─── reader(DeserializationFeature feature)
                                            │                       │
                                            │                       ├─── reader(DeserializationFeature first, DeserializationFeature... other)
                                            │                       │
                                            │                       ├─── readerForUpdating(Object valueToUpdate)
                                            │                       │
                                            │                       ├─── readerFor(JavaType type)
                                            │                       │
                                            │                       ├─── readerFor(Class<?> type)
                                            │                       │
                                            │                       ├─── readerFor(TypeReference<?> typeRef)
                                            │                       │
                                            │                       ├─── readerForArrayOf(Class<?> type)
                                            ├─── ObjectReader ──────┤
                                            │                       ├─── readerForListOf(Class<?> type)
                                            │                       │
                                            │                       ├─── readerForMapOf(Class<?> type)
                                            │                       │
                                            │                       ├─── reader(JsonNodeFactory nodeFactory)
                                            │                       │
                                            │                       ├─── reader(FormatSchema schema)
                                            │                       │
                                            │                       ├─── reader(InjectableValues injectableValues)
                                            │                       │
                                            │                       ├─── readerWithView(Class<?> view)
                                            │                       │
                                            │                       ├─── reader(Base64Variant defaultBase64)
                                            │                       │
                                            │                       └─── reader(ContextAttributes attrs)
                                            │
                                            │                       ┌─── convertValue(Object fromValue, Class<T> toValueType)
                                            │                       │
                                            │                       ├─── convertValue(Object fromValue, TypeReference<T> toValueTypeRef)
                                            └─── conversion ────────┤
                                                                    ├─── convertValue(Object fromValue, JavaType toValueType)
                                                                    │
                                                                    └─── updateValue(T valueToUpdate, Object overrides)
```
