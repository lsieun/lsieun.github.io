---
title: "JSON Tree: Create"
sequence: "103"
---

## Creating a Node

The first step in the creation of a node is to instantiate an `ObjectMapper` object by using the default constructor:

```text
ObjectMapper mapper = new ObjectMapper();
```

**Since the creation of an `ObjectMapper` object is expensive,
it's recommended that we reuse the same one for multiple operations.**

Next, we have three different ways to create a tree node once we have our `ObjectMapper`.

### Construct a Node from Scratch

This is the most common way to create a node out of nothing:

```text
JsonNode node = mapper.createObjectNode();
```

Alternatively, we can also create a node via the `JsonNodeFactory`:

```text
JsonNode node = JsonNodeFactory.instance.objectNode();
```

## Example

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class AddNewObjectNode {
    public static void main(String[] args) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        ObjectNode node = objectMapper.createObjectNode();
        node.put("username", "tom");
        node.put("password", "123456");

        String json = objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(node);
        System.out.println(json);
    }
}
```

```text
{
  "username" : "tom",
  "password" : "123456"
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class AddNewArrayNode {
    public static void main(String[] args) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();

        ArrayNode arrayNode = objectMapper.createArrayNode();
        for (int i = 0; i < 3; i++) {
            ObjectNode item = arrayNode.addObject();
            item.put("name", "user" + i);
            item.put("age", 10 + i);
        }

        String json = objectMapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(arrayNode);
        System.out.println(json);
    }
}
```

```text
[ {
  "name" : "user0",
  "age" : 10
}, {
  "name" : "user1",
  "age" : 11
}, {
  "name" : "user2",
  "age" : 12
} ]
```

### Adding a New Node

A node can be added as a child of another node:

```text
ObjectNode newNode = ((ObjectNode) locatedNode).put(fieldName, value);
```

Many overloaded variants of `put` may be used to add new nodes of different value types.

Many other similar methods are also available, including `putArray`, `putObject`, `PutPOJO`, `putRawValue` and `putNull`.

### Editing a Node

An `ObjectNode` instance may be modified by invoking `set(String fieldName, JsonNode value)` method:

```text
JsonNode locatedNode = locatedNode.set(fieldName, value);
```

Similar results might be achieved by using `replace` or `setAll` methods on objects of the same type.

### Removing a Node

A node can be removed by calling the `remove(String fieldName)` API on its parent node:

```text
JsonNode removedNode = locatedNode.remove(fieldName);
```

In order to remove multiple nodes at once,
we can invoke an overloaded method with the parameter of `Collection<String>` type,
which returns the parent node instead of the one to be removed:

```text
ObjectNode locatedNode = locatedNode.remove(fieldNames);
```

In the extreme case when we want to delete all subnodes of a given node, the `removeAll` API comes in handy.

### Locating a Node

Before working on any node, the first thing we need to do is to locate and assign it to a variable.

If we know the path to the node beforehand, that's pretty easy to do.

Say we want a node named `last`, which is under the `name` node:

```text
JsonNode locatedNode = rootNode.path("name").path("last");
```

Alternatively, the `get` or `with` APIs can also be used instead of `path`.

If the path isn't known, the search will, of course, become more complex and iterative.


