---
title: "Mapping: Composition"
sequence: "102"
---

MapStruct supports the use of meta annotations.
The `@Mapping` annotation supports now `@Target` with `ElementType#ANNOTATION_TYPE` in addition to `ElementType#METHOD`.
This allows `@Mapping` to be used on other (user defined) annotations for re-use purposes.

```java
@Repeatable(Mappings.class)
@Retention(RetentionPolicy.CLASS)
@Target({ ElementType.METHOD, ElementType.ANNOTATION_TYPE })
public @interface Mapping {
    //
}
```

```java
import org.mapstruct.Mapping;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.CLASS)
@Mapping(target = "memo", source = "description")
@Mapping(target = "createdTime", ignore = true)
@Mapping(target = "timestamp", expression = "java(new java.util.Date())")
public @interface ToDto {
}
```

```java
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class Customer {
    private Long id;
    private String customerName;
    private String description;
    private String createdBy;
    private Date createdTime;
}
```

```java
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class CustomerDto {
    private Long id;
    private String name;
    private String memo;
    private String createdBy;
    private Date createdTime;
    private Date timestamp;
}
```

```java
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class Product {
    private Integer id;
    private String productName;
    private String serialNumber;
    private String description;
    private String createdBy;
    private Date createdTime;
}
```

```java
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
public class ProductDto {
    private Integer id;
    private String name;
    private String serialNumber;
    private String memo;
    private String createdBy;
    private Date createdTime;
    private Date timestamp;
}
```

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface Entity2DtoMapper {
    Entity2DtoMapper INSTANCE = Mappers.getMapper(Entity2DtoMapper.class);

    @ToDto
    @Mapping(target = "name", source = "customerName")
    CustomerDto map(Customer customer);

    @ToDto
    @Mapping(target = "name", source = "productName")
    ProductDto map(Product product);
}
```

```java
import java.text.ParseException;
import java.text.SimpleDateFormat;

public class HelloWorld {
    private static final ThreadLocal<SimpleDateFormat> formatter = ThreadLocal.withInitial(
            () -> new SimpleDateFormat("yyyy-MM-dd")
    );

    public static void main(String[] args) throws ParseException {
        Customer customer = new Customer();
        customer.setId(100L);
        customer.setCustomerName("Jerry");
        customer.setDescription("Jerry is a Mouse");
        customer.setCreatedBy("liusen");
        customer.setCreatedTime(df.parse("2022-10-10"));

        CustomerDto customerDto = Entity2DtoMapper.INSTANCE.map(customer);
        System.out.println(JsonUtils.str(customerDto));

        Product product = new Product();
        product.setId(200);
        product.setProductName("iPhone 14 Pro");
        product.setSerialNumber("1234567890");
        product.setDescription("This is an iPhone");
        product.setCreatedBy("liusen");
        product.setCreatedTime(formatter.get().parse("2022-11-11"));

        ProductDto productDto = Entity2DtoMapper.INSTANCE.map(product);
        System.out.println(JsonUtils.str(productDto));
    }
}
```

```java
@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
public class Entity2DtoMapperImpl implements Entity2DtoMapper {

    @Override
    public CustomerDto map(Customer customer) {
        if ( customer == null ) {
            return null;
        }

        CustomerDto customerDto = new CustomerDto();

        customerDto.setMemo( customer.getDescription() );
        customerDto.setName( customer.getCustomerName() );
        customerDto.setId( customer.getId() );
        customerDto.setCreatedBy( customer.getCreatedBy() );

        customerDto.setTimestamp( new java.util.Date() );

        return customerDto;
    }

    @Override
    public ProductDto map(Product product) {
        if ( product == null ) {
            return null;
        }

        ProductDto productDto = new ProductDto();

        productDto.setMemo( product.getDescription() );
        productDto.setName( product.getProductName() );
        productDto.setId( product.getId() );
        productDto.setSerialNumber( product.getSerialNumber() );
        productDto.setCreatedBy( product.getCreatedBy() );

        productDto.setTimestamp( new java.util.Date() );

        return productDto;
    }
}
```
