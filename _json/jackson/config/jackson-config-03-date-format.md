---
title: "Handling Date Formats"
sequence: "103"
---

By default, Jackson will serialize a `java.util.Date` object to its `long` value,
which is the number of milliseconds since January 1st 1970.
However, Jackson also supports formatting dates as strings.

```java
import java.text.MessageFormat;
import java.util.Date;

public class Student {
    private String name;
    private Date dob;

    public Student() {
    }

    public Student(String name, Date dob) {
        this.name = name;
        this.dob = dob;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDob() {
        return dob;
    }

    public void setDob(Date dob) {
        this.dob = dob;
    }

    @Override
    public String toString() {
        return MessageFormat.format("Student - {0} - {1}", name, dob);
    }
}
```

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class FromObject2String {
    public static void main(String[] args) throws JsonProcessingException {
        Object instance = StudentUtils.getXiaoMing();

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(instance);
        System.out.println(json);
    }
}
```

输出信息：

```text
{"name":"xiao ming","dob":1676553018398}
```

To control the String format of a date and set it to, e.g., `yyyy-MM-dd HH:mm:ss`, consider the following snippet:

```java
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.text.DateFormat;
import java.text.SimpleDateFormat;

public class FromDate2String {
    public static void main(String[] args) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        objectMapper.setDateFormat(df);

        Student student = StudentUtils.getXiaoMing();
        String json = objectMapper.writeValueAsString(student);
        System.out.println(json);
    }
}
```

输出信息：

```text
{"name":"xiao ming","dob":"2023-02-16 21:13:50"}
```
