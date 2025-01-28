---
title: "Mapping: Map"
sequence: "110"
---

There are situations when a mapping from a `Map<String, ???>` into a specific bean is needed.
MapStruct offers a transparent way of doing such a mapping
by using the target bean properties (or defined through `Mapping#source`) to extract the values from the map.

## 示例

### Entity

```java
public class Customer {
    private Long id;
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return String.format("Customer {id = %s, name= '%s'}", id, name);
    }
}
```

### Mapper

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.Map;

@Mapper
public interface CustomerMapper {
    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);

    @Mapping(target = "name", source = "customerName")
    Customer toCustomer(Map<String, String> map);
}
```

### Run

```java
import java.util.HashMap;
import java.util.Map;

public class HelloWorld {
    public static void main(String[] args) {
        Map<String, String> map = new HashMap<>();
        map.put("id", "100");
        map.put("customerName", "jerry");

        Customer customer = CustomerMapper.INSTANCE.toCustomer(map);
        System.out.println(customer);
    }
}
```

```java
@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public Customer toCustomer(Map<String, String> map) {
        if ( map == null ) {
            return null;
        }

        Customer customer = new Customer();

        if ( map.containsKey( "customerName" ) ) {
            customer.setName( map.get( "customerName" ) );
        }
        if ( map.containsKey( "id" ) ) {
            customer.setId( Long.parseLong( map.get( "id" ) ) );
        }

        return customer;
    }
}
```
