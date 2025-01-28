---
title: "Mapping methods with several source parameters"
sequence: "104"
---

MapStruct also supports mapping methods with several source parameters.
This is useful e.g. in order to combine several entities into one data transfer object.

```java
import lsieun.mapstruct.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CustomerMapper {
    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);

    @Mapping(target = "customerName", source = "customer.name")
    @Mapping(target = "roadName", source = "address.roadName")
    CustomerDto combineCustomerAndAddress(Customer customer, Address address);
}
```

The shown mapping method takes **two source parameters** and returns **a combined target object**.
As with **single-parameter** mapping methods properties are mapped by **name**.

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
public class Address {
    private String roadName;
    private String houseNumber;

    public String getRoadName() {
        return roadName;
    }

    public void setRoadName(String roadName) {
        this.roadName = roadName;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }
}
```

```java
public class CustomerDto {
    private Long id;
    private String customerName;

    private String roadName;

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

    public String getRoadName() {
        return roadName;
    }

    public void setRoadName(String roadName) {
        this.roadName = roadName;
    }

    @Override
    public String toString() {
        return String.format("CustomerDto{id=%s, customerName='%s', roadName='%s'",
                id, customerName, roadName);
    }
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        Customer customer = new Customer();
        customer.setId(100L);
        customer.setName("Jerry");

        Address address = new Address();
        address.setRoadName("Road 111");
        address.setHouseNumber("House 112");

        CustomerDto customerDto = CustomerMapper.INSTANCE.combineCustomerAndAddress(customer, address);
        System.out.println(customerDto);
    }
}
```

```java
@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public CustomerDto combineCustomerAndAddress(Customer customer, Address address) {
        if ( customer == null && address == null ) {
            return null;
        }

        CustomerDto customerDto = new CustomerDto();

        if ( customer != null ) {
            customerDto.setCustomerName( customer.getName() );
            customerDto.setId( customer.getId() );
        }
        if ( address != null ) {
            customerDto.setRoadName( address.getRoadName() );
        }

        return customerDto;
    }
}
```

In case several source objects define a property with the same name,
the source parameter from which to retrieve the property must be specified using the `@Mapping` annotation.
An error will be raised when such an ambiguity is not resolved.
For properties which only exist once in the given source objects
it is optional to specify the source parameter's name as it can be determined automatically.

Mapping methods with several source parameters will return `null` in case all the source parameters are `null`.
Otherwise, the target object will be instantiated and all properties from the provided parameters will be propagated.

MapStruct also offers the possibility to directly refer to a source parameter.

```java
@Mapper
public interface AddressMapper {
    @Mapping(target = "description", source = "person.description")
    @Mapping(target = "houseNumber", source = "hn")
    DeliveryAddressDto personAndAddressToDeliveryAddressDto(Person person, Integer hn);
}
```

In this case the source parameter is directly mapped into the target as the example above demonstrates.
The parameter `hn`, a non bean type (in this case `java.lang.Integer`) is mapped to `houseNumber`.
