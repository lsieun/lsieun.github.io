---
title: "读取数据行"
sequence: "102"
---

[UP](/java/java-io-index.html)


在 Java 中，可以使用从控制台或键盘读取输入：

- `java.util.Scanner` 类
- `java.io.BufferedReader` 类
- `java.io.Console` 类

## Scanner

```java
import java.util.Scanner;

public class HelloWorld {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Read String
        System.out.println("Enter your name.");
        String name = scanner.nextLine();
        System.out.println("Your name is: " + name);

        // Read Int
        System.out.println("Enter your age.");
        int age = scanner.nextInt();
        System.out.println("Your age is: " + age);

        scanner.close();
    }
}
```

```text
Enter your name.
小明
Your name is: 小明
Enter your age.
10
Your age is: 10
```

## BufferedReader

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class HelloWorld {
    public static void main(String[] args) {
        BufferedReader bufferedReader = null;
        try {
            bufferedReader = new BufferedReader(new InputStreamReader(System.in));

            // Read first line
            System.out.println("Enter first line");
            String line = bufferedReader.readLine();
            System.out.println("First line is : " + line);

            // Read second line
            System.out.println("\nEnter second line");
            line = bufferedReader.readLine();
            System.out.println("Second line is : " + line);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (bufferedReader != null) {
                    bufferedReader.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

```text
Enter first line
小明
First line is : 小明

Enter second line
小莉
Second line is : 小莉
```

## Console

```java
import java.io.Console;

public class HelloWorld {
    public static void main(String[] args) {
        Console console = System.console();
        if (console != null) {
            // Read String
            System.out.println("Enter username: ");
            String name = console.readLine();
            System.out.println("Username is : " + name);

            // Read password
            System.out.println("Enter your password.");
            char[] password = console.readPassword();
            System.out.println("Password is : " + new String(password));
        }
    }
}
```

```text

```
