---
title: "Field: @Getter, @Setter"
sequence: "101"
---

[UP](/lombok.html)


## @Getter

```java
import lombok.Getter;

@Getter
public class HelloWorld {
    private String name;
    private int age;
}
```

```java
public class HelloWorld {
    private String name;
    private int age;

    public HelloWorld() {
    }

    public String getName() {
        return this.name;
    }

    public int getAge() {
        return this.age;
    }
}
```

### AccessLevel

```java
import lombok.AccessLevel;
import lombok.Getter;

import java.util.Date;

public class UserWithGetterAccess {
    @Getter(AccessLevel.PRIVATE)
    String username;

    @Getter(AccessLevel.PACKAGE)
    String password;

    @Getter(AccessLevel.PROTECTED)
    int age;

    @Getter(AccessLevel.PUBLIC)
    Date dob;
}
```

```java
import java.util.Date;

public class UserWithGetterAccess {
    String username;
    String password;
    int age;
    Date dob;

    public UserWithGetterAccess() {
    }

    // private
    private String getUsername() {
        return this.username;
    }

    // package
    String getPassword() {
        return this.password;
    }

    // protected
    protected int getAge() {
        return this.age;
    }

    // public
    public Date getDob() {
        return this.dob;
    }
}
```

### Lazy

```java
import lombok.Getter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GetterLazy {
    private static final String DELIMETER = ":";

    @Getter(lazy = true)
    private final Map<String, Long> transactions = getMyTransactions();

    private Map<String, Long> getMyTransactions() {

        final Map<String, Long> cache = new HashMap<>();
        List<String> txnRows = readTxnListFromFile();

        txnRows.forEach(s -> {
            String[] txnIdValueTuple = s.split(DELIMETER);
            cache.put(txnIdValueTuple[0], Long.parseLong(txnIdValueTuple[1]));
        });

        return cache;
    }

    private List<String> readTxnListFromFile() {
        List<String> lines = new ArrayList<>();
        lines.add("k1:v1");
        lines.add("k2:v2");
        lines.add("k3:v3");
        return lines;
    }
}
```

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

public class GetterLazy {
    private static final String DELIMETER = ":";
    private final AtomicReference<Object> transactions = new AtomicReference();

    public GetterLazy() {
    }

    private Map<String, Long> getMyTransactions() {
        Map<String, Long> cache = new HashMap();
        List<String> txnRows = this.readTxnListFromFile();
        txnRows.forEach((s) -> {
            String[] txnIdValueTuple = s.split(":");
            cache.put(txnIdValueTuple[0], Long.parseLong(txnIdValueTuple[1]));
        });
        return cache;
    }

    private List<String> readTxnListFromFile() {
        List<String> lines = new ArrayList();
        lines.add("k1:v1");
        lines.add("k2:v2");
        lines.add("k3:v3");
        return lines;
    }

    public Map<String, Long> getTransactions() {
        Object value = this.transactions.get();
        if (value == null) {
            synchronized(this.transactions) {
                value = this.transactions.get();
                if (value == null) {
                    Map<String, Long> actualValue = this.getMyTransactions();
                    value = actualValue == null ? this.transactions : actualValue;
                    this.transactions.set(value);
                }
            }
        }

        return (Map)(value == this.transactions ? null : value);
    }
}
```

## @Setter

```java
import lombok.Setter;

@Setter
public class HelloWorld {
    private String name;
    private int age;
}
```

```java
public class HelloWorld {
    private String name;
    private int age;

    public HelloWorld() {
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

### AccessLevel

```java
import lombok.AccessLevel;
import lombok.Setter;

@Setter
public class UserWithSetterAccess {
    @Setter(AccessLevel.PROTECTED)
    private String username;

    private String password;
}
```

```java
public class UserWithSetterAccess {
    private String username;
    private String password;

    public UserWithSetterAccess() {
    }

    public void setPassword(String password) {
        this.password = password;
    }

    protected void setUsername(String username) {
        this.username = username;
    }
}
```
