---
title: "JSONNode Example"
sequence: "103"
---

## Example

### data.json

```text
{
  "name": "iPhone 14 Plus",
  "category": "cellphone",
  "details": {
    "capacity": "256GB",
    "chip": "A15 Bionic chip"
  }
}
```

### Product.java

第一种方式，使用 `JsonNode`：

```java
import com.fasterxml.jackson.databind.JsonNode;

public class Product {
    private String name;
    private String category;
    private JsonNode details;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public JsonNode getDetails() {
        return details;
    }

    public void setDetails(JsonNode details) {
        this.details = details;
    }

    @Override
    public String toString() {
        return "Product{" +
                "name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", details=" + details +
                '}';
    }
}
```

第二种方式，使用 `Map<String, Object>`：

```java
import java.util.Map;

public class Product {
    private String name;
    private String category;
    private Map<String, Object> details;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }

    @Override
    public String toString() {
        return "Product{" +
                "name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", details=" + details +
                '}';
    }
}
```

### HelloWorld.java

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class HelloWorld {
    public static void main(String[] args) throws JsonProcessingException {
        String json = DataUtils.getJson();

        ObjectMapper objectMapper = new ObjectMapper();
        Product product = objectMapper.readValue(json, Product.class);
        System.out.println(product);
    }
}
```
