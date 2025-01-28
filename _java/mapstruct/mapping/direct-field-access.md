---
title: "Mappings with direct field access"
sequence: "107"
---

MapStruct also supports mappings of `public` fields that have no getters/setters.
MapStruct will use the **fields** as **read/write accessor**
if it cannot find suitable getter/setter methods for the property.

- A field is considered as a **read accessor** if it is `public` or `public final`.
  If a field is `static` it is not considered as a read accessor.
- A field is considered as a **write accessor** only if it is `public`.
  If a field is `final` and/or `static` it is not considered as a write accessor.


|                | public | final | static |
|----------------|--------|-------|--------|
| read accessor  | √      | √     |        |
| write accessor | √      |       |        |


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

```java
public class CustomerDto {
    public Long id;
    public String customerName;
}
```

```java
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CustomerMapper {
    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);

    @Mapping(target = "name", source = "customerName")
    Customer fromDto2Entity(CustomerDto customerDto);

    @InheritInverseConfiguration
    CustomerDto fromEntity2Dto(Customer customer);
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        Customer customer = new Customer();
        customer.setId(100L);
        customer.setName("Jerry");

        CustomerDto dto = CustomerMapper.INSTANCE.fromEntity2Dto(customer);
        System.out.println(dto.id);
        System.out.println(dto.customerName);
    }
}
```

```java
@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public Customer fromDto2Entity(CustomerDto customerDto) {
        if ( customerDto == null ) {
            return null;
        }

        Customer customer = new Customer();

        customer.setName( customerDto.customerName );
        customer.setId( customerDto.id );

        return customer;
    }

    @Override
    public CustomerDto fromEntity2Dto(Customer customer) {
        if ( customer == null ) {
            return null;
        }

        CustomerDto customerDto = new CustomerDto();

        customerDto.customerName = customer.getName();
        customerDto.id = customer.getId();

        return customerDto;
    }
}
```
