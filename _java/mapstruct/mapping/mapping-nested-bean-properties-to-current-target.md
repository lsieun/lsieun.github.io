---
title: "Mapping nested bean properties to current target"
sequence: "105"
---

If you don't want explicitly name all properties from nested source bean, you can use `.` as target.
This will tell MapStruct to map every property from source bean to target object.

```java
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CustomerMapper {
    CustomerMapper INSTANCE = Mappers.getMapper(CustomerMapper.class);

    @Mapping(target = "name", source = "record.name")
    @Mapping(target = ".", source = "record")
    @Mapping(target = ".", source = "account")
    Customer customerDto2Entity(CustomerDto customerDto);
}
```

```java
public class Customer {
    private Long id;
    private String name;

    private Long recordId;

    private Long accountId;

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

    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    @Override
    public String toString() {
        return String.format("Customer {id = %s, name= '%s', recordId = %s, accountId = %s}",
                id, name, recordId, accountId);
    }
}
```

```java
public class CustomerDto {
    private Long id;
    private String customerName;

    private RecordDto record;

    private AccountDto account;

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

    public RecordDto getRecord() {
        return record;
    }

    public void setRecord(RecordDto record) {
        this.record = record;
    }

    public AccountDto getAccount() {
        return account;
    }

    public void setAccount(AccountDto account) {
        this.account = account;
    }
}
```

```java
public class RecordDto {
    private Long recordId;
    private String name;

    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

```java
public class AccountDto {
    private Long accountId;
    private String name;

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

```java
@Generated(
    value = "org.mapstruct.ap.MappingProcessor"
)
public class CustomerMapperImpl implements CustomerMapper {

    @Override
    public Customer customerDto2Entity(CustomerDto customerDto) {
        if ( customerDto == null ) {
            return null;
        }

        Customer customer = new Customer();

        customer.setName( customerDtoRecordName( customerDto ) );
        customer.setRecordId( customerDtoRecordRecordId( customerDto ) );
        customer.setAccountId( customerDtoAccountAccountId( customerDto ) );
        customer.setId( customerDto.getId() );

        return customer;
    }

    private String customerDtoRecordName(CustomerDto customerDto) {
        if ( customerDto == null ) {
            return null;
        }
        RecordDto record = customerDto.getRecord();
        if ( record == null ) {
            return null;
        }
        String name = record.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long customerDtoRecordRecordId(CustomerDto customerDto) {
        if ( customerDto == null ) {
            return null;
        }
        RecordDto record = customerDto.getRecord();
        if ( record == null ) {
            return null;
        }
        Long recordId = record.getRecordId();
        if ( recordId == null ) {
            return null;
        }
        return recordId;
    }

    private Long customerDtoAccountAccountId(CustomerDto customerDto) {
        if ( customerDto == null ) {
            return null;
        }
        AccountDto account = customerDto.getAccount();
        if ( account == null ) {
            return null;
        }
        Long accountId = account.getAccountId();
        if ( accountId == null ) {
            return null;
        }
        return accountId;
    }
}
```

The generated code will map every property from `CustomerDto.record` to `Customer` directly,
without need to manually name any of them. The same goes for `Customer.account`.

**When there are conflicts, these can be resolved by explicitely defining the mapping.**
For instance in the example above. `name` occurs in `CustomerDto.record` and in `CustomerDto.account`.
The mapping `@Mapping( target = "name", source = "record.name" )` resolves this conflict.

This "**target this**" notation can be very useful
when mapping hierarchical objects to flat objects and vice versa (`@InheritInverseConfiguration`).

