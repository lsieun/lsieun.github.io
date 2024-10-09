---
title: "Generic 与 VarArgs 的融合"
sequence: "104"
---

## ClassFile: varargs method

```java
public class HelloWorld {
    public static void printMessage(String... messages) {
        // ...
    }

    public static void test() {
        printMessage("First", "Second", "Third");
    }
}
```

使用命令：

```bash
javap -c HelloWorld.class
```

输出结果：

```txt
Compiled from "HelloWorld.java"
public class HelloWorld {
  ...

  public static void printMessage(java.lang.String...);
    Code:
       0: return

  public static void test();
    Code:
       0: iconst_3
       1: anewarray     #2                  // class java/lang/String
       =====================================
       4: dup
       5: iconst_0
       6: ldc           #3                  // String First
       8: aastore
       =====================================
       9: dup
      10: iconst_1
      11: ldc           #4                  // String Second
      13: aastore
      =====================================
      14: dup
      15: iconst_2
      16: ldc           #5                  // String Third
      18: aastore
      =====================================
      19: invokestatic  #6                  // Method printMessage:([Ljava/lang/String;)V
      22: return
}
```
