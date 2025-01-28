---
title: "JSON Tree Model"
sequence: "101"
---

```text
                                                       ┌─── ArrayNode
                                 ┌─── ContainerNode ───┤
                                 │                     └─── ObjectNode
                                 │
                                 │                     ┌─── BooleanNode
                                 │                     │
                                 │                     ├─── BinaryNode
                                 │                     │
JsonNode ───┼─── BaseJsonNode ───┤                     │                   ┌─── BigIntegerNode
                                 │                     │                   │
                                 │                     │                   ├─── DecimalNode
                                 │                     │                   │
                                 │                     │                   ├─── DoubleNode
                                 │                     │                   │
                                 │                     ├─── NumericNode ───┼─── FloatNode
                                 │                     │                   │
                                 └─── ValueNode ───────┤                   ├─── IntNode
                                                       │                   │
                                                       │                   ├─── LongNode
                                                       │                   │
                                                       │                   └─── ShortNode
                                                       │
                                                       ├─── TextNode
                                                       │
                                                       ├─── POJONode
                                                       │
                                                       ├─── NullNode
                                                       │
                                                       └─── MissingNode
```

## Reference

- [Working with Tree Model Nodes in Jackson](https://www.baeldung.com/jackson-json-node-tree-model)
- [Mapping Nested Values with Jackson](https://www.baeldung.com/jackson-nested-values)
- [Mapping a Dynamic JSON Object with Jackson](https://www.baeldung.com/jackson-mapping-dynamic-object)
