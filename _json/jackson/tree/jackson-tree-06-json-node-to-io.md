---
title: "JsonNode --> IO"
sequence: "106"
---

## Write out as JSON

This is the basic method to transform a tree node into a JSON string,
where the `destination` can be a `File`, an `OutputStream` or a `Writer`:

```text
mapper.writeValue(destination, node);
```

## Manipulating Tree Nodes

```json
{
  "name": {
    "first": "Tatu",
    "last": "Saloranta"
  },
  "title": "Jackson founder",
  "company": "FasterXML",
  "pets": [
    {
      "type": "dog",
      "number": 1
    },
    {
      "type": "fish",
      "number": 50
    }
  ]
}
```

```text
public class ExampleStructure {
    private static ObjectMapper mapper = new ObjectMapper();

    static JsonNode getExampleRoot() throws IOException {
        InputStream exampleInput = 
          ExampleStructure.class.getClassLoader()
          .getResourceAsStream("example.json");
        
        JsonNode rootNode = mapper.readTree(exampleInput);
        return rootNode;
    }
}
```

