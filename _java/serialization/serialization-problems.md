---
title: "Serialization Problems"
sequence: "101"
---

Serialization can have unintended consequences.
For example, serialization allows unintended access to non-transient `private` members.
This means if you declare a member `private` the serialization algorithm still writes the data out to whoever is reading...

Serialization also presents inconsistencies when `serialVersionUID` isn't explicitly defined.
This is because objects are tied to classes.
Classes tend to change over time.
A serialized object may be unrecognized depending on what has changed.

## transient field

下面的例子是演示 `transient` 修改的字段不参与 Serialization 的过程：

```java
import java.io.Serializable;

public class User implements Serializable {
    private static final long serialVersionUID = 1234L;

    private String username;
    private transient String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
```

```java
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        String filePath = FileUtils.getFilePath("user.data");

        FileOutputStream fos = new FileOutputStream(filePath);
        ObjectOutputStream oos = new ObjectOutputStream(fos);
        User user = new User("Tom", "123456");
        oos.writeObject(user);
        oos.flush();
        oos.close();

        FileInputStream fis = new FileInputStream(filePath);
        ObjectInputStream oin = new ObjectInputStream(fis);
        User userFromFile = (User) oin.readObject();
        System.out.println(userFromFile.getUsername()); //Tom
        System.out.println(userFromFile.getPassword()); //null because transient field isn't serialized.
    }
}
```

## serialVersionUID

在修改之前，`serialVersionUID` 的值是 `1234L`：

```java
import java.io.Serializable;

public class HelloWorld implements Serializable {

    private static final long serialVersionUID = 1234L;
    public byte version = 100;
}
```

在修改之后，`serialVersionUID` 的值是 `4321L`：

```java
import java.io.Serializable;

public class HelloWorld implements Serializable {

    private static final long serialVersionUID = 4321L;
    public byte version = 100;
}
```

出现 `InvalidClassException` 错误：

```text
java.io.InvalidClassException: sample.HelloWorld; local class incompatible: 
stream classdesc serialVersionUID = 1234, local class serialVersionUID = 4321
```

## alternatives

While Java's serialization algorithm makes it possible to serialize any object,
alternatives like **Protocol buffers** and **Jackson's JSON parser** can be better for serializing objects.

## References




