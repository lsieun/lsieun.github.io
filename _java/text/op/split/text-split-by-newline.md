---
title: "Split Java String by Newline"
sequence: "102"
---

## Using the System.lineSeparator()

Given that the newline character is different in various operating systems,
we can use system-defined constants or methods when we want our code to be platform-independent.

The `System.lineSeparator()` method returns the line separator string for the underlying operating system.
It returns the value of the system property `line.separator`.

Therefore, we can use the line separator string returned by the `System.lineSeparator` method
along with `String.split` method to split the Java `String` by newline:

```java
import java.util.Arrays;

public class TextSplitByNewline {
    public static void main(String[] args) {
        String[] lines = "Line1\r\nLine2\r\nLine3".split(System.lineSeparator());
        System.out.println(Arrays.toString(lines));
    }
}
```

```text
[Line1, Line2, Line3]
```

## Using Regular Expressions

Next, let's start by looking at the different characters used to separate lines in different operating systems.

- The `\n` character separates lines in Unix, Linux, and macOS.
- On the other hand, the `\r\n` character separates lines in Windows Environment.
- Finally, the `\r` character separates lines in Mac OS 9 and earlier.

Therefore, we need to take care of all the possible newline characters
while splitting a string by newlines using regular expressions.

Finally, let's look at the regular expression pattern
that will cover all the different operating systems' newline characters.
That is to say, we need to look for `\n`, `\r\n` and `\r` patterns.
This can be easily done by using regular expressions in Java.

The regular expression pattern to cover all the different newline characters will be:

```text
"\\r?\\n|\\r"
```

Breaking it down, we see that:

- `\\n` = Unix, Linux and macOS pattern
- `\\r\\n` = Windows Environment pattern
- `\\r` = MacOS 9 and earlier pattern

Next, let's use the `String#split` method to split the Java String. Let's look at a few examples:

```java
import java.util.Arrays;

public class TextSplitByNewline {
    public static void main(String[] args) {
        String[] lines1 = "Line1\nLine2\nLine3".split("\\r?\\n|\\r");
        String[] lines2 = "Line1\rLine2\rLine3".split("\\r?\\n|\\r");
        String[] lines3 = "Line1\r\nLine2\r\nLine3".split("\\r?\\n|\\r");

        System.out.println(Arrays.toString(lines1));
        System.out.println(Arrays.toString(lines2));
        System.out.println(Arrays.toString(lines3));
    }
}
```

```text
[Line1, Line2, Line3]
[Line1, Line2, Line3]
[Line1, Line2, Line3]
```

## Using Java 8

Java 8 provides an `\R` pattern that matches any Unicode line-break sequence and
covers all the newline characters for different operating systems.
Therefore, we can use the `\R` pattern instead of `"\\r?\\n|\\r"` in Java 8 or higher.

```java
import java.util.Arrays;

public class TextSplitByNewline {
    public static void main(String[] args) {
        String[] lines1 = "Line1\nLine2\nLine3".split("\\R");
        String[] lines2 = "Line1\rLine2\rLine3".split("\\R");
        String[] lines3 = "Line1\r\nLine2\r\nLine3".split("\\R");

        System.out.println(Arrays.toString(lines1));
        System.out.println(Arrays.toString(lines2));
        System.out.println(Arrays.toString(lines3));
    }
}
```

```text
[Line1, Line2, Line3]
[Line1, Line2, Line3]
[Line1, Line2, Line3]
```

## Using Pattern Class

In Java 8, `Pattern` class comes with a handy `splitAsStream` method.

In our case, we can utilize the `\R` pattern, but of course,
this method can also be used to split String by any, more sophisticated, regular expression.

```java
import java.util.regex.Pattern;
import java.util.stream.Stream;

public class TextSplitByNewline {
    public static void main(String[] args) {
        Pattern pattern = Pattern.compile("\\R");
        Stream<String> lines1 = pattern.splitAsStream("Line1\nLine2\nLine3");
        Stream<String> lines2 = pattern.splitAsStream("Line1\rLine2\rLine3");
        Stream<String> lines3 = pattern.splitAsStream("Line1\r\nLine2\r\nLine3");

        lines1.forEach(System.out::println);
        lines2.forEach(System.out::println);
        lines3.forEach(System.out::println);
    }
}
```

```text
Line1
Line2
Line3
Line1
Line2
Line3
Line1
Line2
Line3
```

## Using Java 11

Java 11 makes splitting by newline really easy:

```java
import java.util.stream.Stream;

public class TextSplitByNewline {
    public static void main(String[] args) {
        Stream<String> lines = "Line1\nLine2\rLine3\r\nLine4".lines();

        lines.forEach(System.out::println);
    }
}
```

```text
Line1
Line2
Line3
Line4
```

Because `lines()` uses an `\R` pattern under the hood, it works with all kinds of line separators.

## Guava

```java
import com.google.common.base.Splitter;

import java.util.List;

public class TextSplitGuava {
    public static void main(String[] args) {
        List<String> resultList = Splitter.onPattern("\\R")
                .trimResults()
                .omitEmptyStrings()
                .splitToList("Line1\n\nLine2\rLine3\r\nLine4");
        System.out.println(resultList);
    }
}
```

```text
[Line1, Line2, Line3, Line4]
```

```java
import java.util.stream.Stream;

public class TextSplitByNewline {
    public static void main(String[] args) {
        Stream<String> lines = "Line1\n\nLine2\rLine3\r\nLine4".lines();

        lines.forEach(System.out::println);
    }
}
```

```text
Line1

Line2
Line3
Line4
```

## Reference

- [Split Java String by Newline](https://www.baeldung.com/java-string-split-by-newline)
