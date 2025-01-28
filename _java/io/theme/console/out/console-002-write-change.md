---
title: "一行数据不断变化"
sequence: "102"
---

[UP](/java/java-io-index.html)


## 一行：打印进度

```java
public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        for (int i = 0; i <= 100; i++) {
            System.out.print("\r" + i + "%");
            Thread.sleep(100);
        }
    }
}
```

## 一行：打印 + 撤销

```java
public class HelloWorld {
    public static void main(String[] args) throws InterruptedException {
        String str1 = "Good";
        String str2 = "Morning!";
        String str3 = "Evening!";

        for (int i = 0; i < str1.length(); i++) {
            char ch = str1.charAt(i);
            print(ch);
        }

        print(' ');

        for (int i = 0; i < str2.length(); i++) {
            char ch = str2.charAt(i);
            print(ch);
        }

        for (int i = 0; i < str2.length(); i++) {
            print('\b');
        }

        for (int i = 0; i < str3.length(); i++) {
            char ch = str3.charAt(i);
            print(ch);
        }
        System.out.println();
    }

    private static void print(char ch) throws InterruptedException {
        System.out.print(ch);
        Thread.sleep(200);
    }
}
```
