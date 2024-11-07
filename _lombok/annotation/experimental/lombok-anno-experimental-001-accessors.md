---
title: "@Accessors"
sequence: "101"
---

[UP](/lombok.html)

## fluent = false

```java
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Accessors(fluent = false)
@Getter
@Setter
public class UserWithAccessor {
    private String username;

    private String password;
}
```

```java
public class UserWithAccessor {
    private String username;
    private String password;

    public UserWithAccessor() {
    }

    public String getUsername() {
        return this.username;
    }

    public String getPassword() {
        return this.password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
```

## fluent = true

```java
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

@Accessors(fluent = true)
@Getter
@Setter
public class UserWithAccessor {
    private String username;

    private String password;
}
```

```java
public class UserWithAccessor {
    private String username;
    private String password;

    public UserWithAccessor() {
    }

    public String username() {
        return this.username;
    }

    public String password() {
        return this.password;
    }

    public UserWithAccessor username(String username) {
        this.username = username;
        return this;
    }

    public UserWithAccessor password(String password) {
        this.password = password;
        return this;
    }
}
```

