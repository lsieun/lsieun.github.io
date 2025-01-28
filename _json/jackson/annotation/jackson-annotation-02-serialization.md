---
title: "Jackson Annotation: Serialization"
sequence: "102"
---

## @JsonAnySetter

### data.json

```text
{
  "name": "iPhone 14 Plus",
  "category": "cellphone",
  "capacity": "256GB",
  "chip": "A15 Bionic chip"
}
```

### Product.java

```java
import com.fasterxml.jackson.annotation.JsonAnySetter;

import java.util.HashMap;
import java.util.Map;

public class Product {
    private String name;
    private String category;
    private final Map<String, Object> details = new HashMap<>();

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

    @JsonAnySetter
    public void setDetails(String key, Object value) {
        details.put(key, value);
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

```text
Product{name='iPhone 14 Plus', category='cellphone', details={chip=A15 Bionic chip, capacity=256GB}}
```

