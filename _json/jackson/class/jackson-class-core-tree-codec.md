---
title: "TreeCodec"
sequence: "TreeCodec"
---

The `TreeCodec` is an abstract class
that defines objects that can read and write `TreeNode` instances using Streaming API.

```java
public abstract class TreeCodec {
    public abstract <T extends TreeNode> T readTree(JsonParser p) throws IOException, JsonProcessingException;
    public abstract void writeTree(JsonGenerator g, TreeNode tree) throws IOException, JsonProcessingException;

    public TreeNode missingNode() {
        return null;
    }

    public TreeNode nullNode() {
        return null;
    }

    public abstract TreeNode createArrayNode();
    public abstract TreeNode createObjectNode();
    public abstract JsonParser treeAsTokens(TreeNode node);
}
```

```text
             ┌─── TreeNode readTree(JsonParser p)
TreeCodec ───┤
             └─── void writeTree(JsonGenerator g, TreeNode tree)
```

```text
             ┌─── readTree(JsonParser p)
             │
             ├─── writeTree(JsonGenerator g, TreeNode tree)
             │
             ├─── missingNode()
             │
TreeCodec ───┼─── nullNode()
             │
             ├─── createArrayNode()
             │
             ├─── createObjectNode()
             │
             └─── treeAsTokens(TreeNode node)
```
