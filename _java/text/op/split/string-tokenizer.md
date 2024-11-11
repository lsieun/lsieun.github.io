---
title: "StringTokenizer"
sequence: "102"
---

## StringTokenizer 类

`StringTokenizer` 类实现了 `Enumeration` 接口：

```java
public class StringTokenizer implements Enumeration<Object> {
}
```

`Enumeration` 接口：

```java
public interface Enumeration<E> {
    boolean hasMoreElements();

    E nextElement();
}
```

### constructors

```java
public class StringTokenizer implements Enumeration<Object> {
    public StringTokenizer(String str) {
        this(str, " \t\n\r\f", false);
    }

    public StringTokenizer(String str, String delim) {
        this(str, delim, false);
    }

    public StringTokenizer(String str, String delim, boolean returnDelims) {
        currentPosition = 0;
        newPosition = -1;
        delimsChanged = false;
        this.str = str;
        maxPosition = str.length();
        delimiters = delim;
        retDelims = returnDelims;
        setMaxDelimCodePoint();
    }
}
```

### methods

#### Enumeration

```java
public class StringTokenizer implements Enumeration<Object> {
    public boolean hasMoreElements() {
        return hasMoreTokens();
    }

    public Object nextElement() {
        return nextToken();
    }
}
```

## 示例

### 示例一：默认分隔符

在默认情况下，分隔符是 ` \t\n\r\f`（注意，里面有一个空格）

```java
import java.util.StringTokenizer;

public class HelloWorld {
    public static void main(String[] args) {
        StringTokenizer st = new StringTokenizer("www baidu com");
        while (st.hasMoreElements()) {
            System.out.println("Token:" + st.nextToken());
        }
    }
}
```

Output:

```text
Token:www
Token:baidu
Token:com
```

### 示例二：指定分隔符

```java
import java.util.StringTokenizer;

public class HelloWorld {
    public static void main(String[] args) {
        StringTokenizer st = new StringTokenizer("int result = numberA + numberB", " =+");
        while (st.hasMoreElements()) {
            System.out.println("Token:" + st.nextToken());
        }
    }
}
```

Output:

```text
Token:int
Token:result
Token:numberA
Token:numberB
```
