---
title: "JsonNode --> Object"
sequence: "105"
---

## Object 2 JsonNode

A node may be converted from a Java object by calling the `valueToTree(Object fromValue)` method on the `ObjectMapper`:

```text
JsonNode node = mapper.valueToTree(fromValue);
```

The `convertValue` API is also helpful here:

```text
JsonNode node = mapper.convertValue(fromValue, JsonNode.class);
```

## JsonNode 2 Object

The most convenient way to convert a `JsonNode` into a Java object is the `treeToValue` API:

```text
NodeBean toValue = mapper.treeToValue(node, NodeBean.class);
```

This is functionally equivalent to the following:

```text
NodeBean toValue = mapper.convertValue(node, NodeBean.class)
```

We can also do that through a token stream:

```text
JsonParser parser = mapper.treeAsTokens(node);
NodeBean toValue = mapper.readValue(parser, NodeBean.class);
```