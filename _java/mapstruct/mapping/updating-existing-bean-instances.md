---
title: "Updating existing bean instances"
sequence: "106"
---

In some cases you need mappings which don't create a new instance of the target type
but instead update an existing instance of that type.
This sort of mapping can be realized by **adding a parameter for the target object** and
**marking this parameter with `@MappingTarget`**.

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CustomerMapper {
    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);

    @Mapping(target = "name", source = "customerName")
    void updateEntityFromDto(CustomerDto customerDto, @MappingTarget Customer customer);
}
```

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
    private Long id;
    private String customerName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        Customer customer = new Customer();
        customer.setId(100L);
        customer.setName("Jerry");

        CustomerDto dto = new CustomerDto();
        dto.setId(99L);
        dto.setCustomerName("Tom");

        CustomerMapper.INSTANCE.updateEntityFromDto(dto, customer);
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
    public void updateEntityFromDto(CustomerDto customerDto, Customer customer) {
        if ( customerDto == null ) {
            return;
        }

        customer.setName( customerDto.getCustomerName() );
        customer.setId( customerDto.getId() );
    }
}
```

There may be only one parameter marked as mapping target.
Instead of `void` you may also set the method's return type to the type of the target parameter,
which will cause the generated implementation to update the passed mapping target and return it as well.
This allows for fluent invocations of mapping methods.

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CustomerMapper {
    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);

    @Mapping(target = "name", source = "customerName")
    Customer updateEntityFromDto(CustomerDto customerDto, @MappingTarget Customer customer);
}
```

```java
@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public Customer updateEntityFromDto(CustomerDto customerDto, Customer customer) {
        if ( customerDto == null ) {
            return customer;
        }

        customer.setName( customerDto.getCustomerName() );
        customer.setId( customerDto.getId() );

        return customer;
    }
}
```
