---
title: "复杂：@Delegate"
sequence: "105"
---

[UP](/lombok.html)

## composition

```java
public interface HasContactInformation {

    String getFirstName();

    void setFirstName(String firstName);


    String getLastName();

    void setLastName(String lastName);


    String getFullName();

}
```

```java
import lombok.Data;

@Data
public class ContactInformationSupport implements HasContactInformation {

    private String firstName;
    private String lastName;

    @Override
    public String getFullName() {
        return getFirstName() + " " + getLastName();
    }
}
```

```java
import lombok.experimental.Delegate;

public class User implements HasContactInformation {

    // Whichever other User-specific attributes

    @Delegate(types = {HasContactInformation.class})
    private final ContactInformationSupport contactInformation = new ContactInformationSupport();

    // User itself will implement all contact information by delegation
    
}
```

```java
public class User implements HasContactInformation {
    private final ContactInformationSupport contactInformation = new ContactInformationSupport();

    public User() {
    }

    public String getFirstName() {
        return this.contactInformation.getFirstName();
    }

    public void setFirstName(String firstName) {
        this.contactInformation.setFirstName(firstName);
    }

    public String getLastName() {
        return this.contactInformation.getLastName();
    }

    public void setLastName(String lastName) {
        this.contactInformation.setLastName(lastName);
    }

    public String getFullName() {
        return this.contactInformation.getFullName();
    }
}
```

