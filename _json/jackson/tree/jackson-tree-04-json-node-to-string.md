---
title: "JsonNode --> String"
sequence: "104"
---

## String 2 JsonNode

### Quick Parsing

```text
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class Test {
    public static void main(String[] args) throws IOException {
        String json = "{\"k1\":\"v1\",\"k2\":\"v2\"}";

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(json);
        System.out.println(jsonNode);
    }
}
```

### Low Level Parsing

If, for some reason, you need to go **lower level** than that,
the following example exposes the `JsonParser` responsible with the actual parsing of the `String`:

```java
import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.TreeNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

public class Test {
    public static void main(String[] args) throws IOException {
        String json = "{\"k1\":\"v1\",\"k2\":\"v2\"}";

        ObjectMapper objectMapper = new ObjectMapper();
        JsonFactory factory = objectMapper.getFactory();
        JsonParser parser = factory.createParser(json);
        TreeNode treeNode = objectMapper.readTree(parser);
        System.out.println(treeNode);
    }
}
```

