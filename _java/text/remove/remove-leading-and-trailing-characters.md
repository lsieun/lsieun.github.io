---
title: "Remove Leading and Trailing Characters from a String"
sequence: "102"
---

## Introduction

In this short tutorial, we'll see several ways to remove leading and trailing characters from a `String`.
For the sake of simplicity, we'll **remove zeroes** in the examples.

With each implementation, we'll create two methods: **one for leading**, and **one for trailing zeroes**.

This problem has an edge case: what do we want to do, **when the input contains zeroes only?**
Return an empty String, or a String containing a single zero?
We'll see implementations for both use cases in each of the solutions.

> 这里讲特殊情况，只包含 0 的情况

## Using StringBuilder

In our first solution, we'll create a `StringBuilder` with the original String,
and we'll delete the unnecessary characters from the beginning or the end:

```java
public class RemoveUsingStringBuilder1 {
    public static String removeLeadingZeroes(String s) {
        StringBuilder sb = new StringBuilder(s);
        while (sb.length() > 0 && sb.charAt(0) == '0') {
            sb.deleteCharAt(0);
        }
        return sb.toString();
    }

    public static String removeTrailingZeroes(String s) {
        StringBuilder sb = new StringBuilder(s);
        while (sb.length() > 0 && sb.charAt(sb.length() - 1) == '0') {
            sb.setLength(sb.length() - 1); // 这里使用了 setLength 方法
        }
        return sb.toString();
    }
}
```

Note, that we use `StringBuilder.setLength()` instead of `StringBuilder.deleteCharAt()`
when we remove trailing zeroes because it also deletes the last few characters, and it's more performant.

If we **don't want to return an empty String** when the input contains only zeroes,
the only thing we need to do is to **stop the loop if there's only a single character left**.

```java
public class RemoveUsingStringBuilder2 {
    public static String removeLeadingZeroes(String s) {
        StringBuilder sb = new StringBuilder(s);
        while (sb.length() > 1 && sb.charAt(0) == '0') {
            sb.deleteCharAt(0);
        }
        return sb.toString();
    }

    public static String removeTrailingZeroes(String s) {
        StringBuilder sb = new StringBuilder(s);
        while (sb.length() > 1 && sb.charAt(sb.length() - 1) == '0') {
            sb.setLength(sb.length() - 1);
        }
        return sb.toString();
    }
}
```

## Using String.subString()

In this solution when we remove leading or trailing zeroes, we find the position of the first or last non-zero character.

After that, we only have to call `substring()`, to return the remaining parts:

```java
public class RemoveUsingString1 {
    public static String removeLeadingZeroes(String s) {
        int index;
        for (index = 0; index < s.length(); index++) {
            if (s.charAt(index) != '0') {
                break;
            }
        }
        return s.substring(index);
    }

    public static String removeTrailingZeroes(String s) {
        int index;
        for (index = s.length() - 1; index >= 0; index--) {
            if (s.charAt(index) != '0') {
                break;
            }
        }
        return s.substring(0, index + 1);
    }
}
```

Note, that we have to declare the variable `index` before the for loop
because we want to use the variable outside the loop's scope.

Also note, that we have to look for non-zero characters manually,
since `String.indexOf()` and `String.lastIndexOf()` work only for exact matching.

If we don't want to return an empty String, we have to do the same thing as before: change the loop condition:

```java
public class RemoveUsingString2 {
    public static String removeLeadingZeroes(String s) {
        int index;
        for (index = 0; index < s.length() - 1; index++) {
            if (s.charAt(index) != '0') {
                break;
            }
        }
        return s.substring(index);
    }

    public static String removeTrailingZeroes(String s) {
        int index;
        for (index = s.length() - 1; index > 0; index--) {
            if (s.charAt(index) != '0') {
                break;
            }
        }
        return s.substring(0, index + 1);
    }
}
```

## Using Apache Commons

Apache Commons has many useful classes, including `org.apache.commons.lang.StringUtils`.
To be more precise, this class is in Apache Commons Lang3.

```java
import org.apache.commons.lang3.StringUtils;

public class RemoveUsingApache1 {
    public static String removeLeadingZeroes(String s) {
        return StringUtils.stripStart(s, "0");
    }

    public static String removeTrailingZeroes(String s) {
        return StringUtils.stripEnd(s, "0");
    }
}
```

Unfortunately, we can't configure, if we want to remove all occurrences or not.
Therefore, we need to control it manually.

If the input wasn't empty, but the stripped String is empty, then we have to return exactly one zero:

```java
import org.apache.commons.lang3.StringUtils;

public class RemoveUsingApache2 {
    public static String removeLeadingZeroes(String s) {
        String stripped = StringUtils.stripStart(s, "0");
        if (stripped.isEmpty() && !s.isEmpty()) {
            return "0";
        }
        return stripped;
    }

    public static String removeTrailingZeroes(String s) {
        String stripped = StringUtils.stripEnd(s, "0");
        if (stripped.isEmpty() && !s.isEmpty()) {
            return "0";
        }
        return stripped;
    }
}
```

## Using Guava

Guava also provides many utility classes.
For this problem, we can use `com.google.common.base.CharMatcher`,
which provides utility methods to interact with matching characters.

In our case, we're interested in `trimLeadingFrom()` and `trimTrailingFrom()`.

As their name suggests, they remove any leading or trailing character respectively from a `String`,
which matches the `CharMatcher`:

```java
import com.google.common.base.CharMatcher;

public class RemoveUsingGuava1 {
    public static String removeLeadingZeroes(String s) {
        return CharMatcher.is('0').trimLeadingFrom(s);
    }

    public static String removeTrailingZeroes(String s) {
        return CharMatcher.is('0').trimTrailingFrom(s);
    }
}
```

They have the same characteristics, as the Apache Commons methods we saw.

Therefore, if we don't want to remove all zeroes, we can use the same trick:

```java
import com.google.common.base.CharMatcher;

public class RemoveUsingGuava2 {
    public static String removeLeadingZeroes(String s) {
        String stripped = CharMatcher.is('0').trimLeadingFrom(s);
        if (stripped.isEmpty() && !s.isEmpty()) {
            return "0";
        }
        return stripped;
    }

    public static String removeTrailingZeroes(String s) {
        String stripped = CharMatcher.is('0').trimTrailingFrom(s);
        if (stripped.isEmpty() && !s.isEmpty()) {
            return "0";
        }
        return stripped;
    }
}
```

Note, that with `CharMatcher` we can create more complex matching rules.

## Using Regular Expressions

Since our problem is a pattern matching problem, we can use regular expressions:
**we want to match all zeroes at the beginning or the end of a String.**

On top of that, we want to remove those matching zeroes.
In other words, we want to **replace them with nothing, or in other words, an empty String.**

We can do exactly that, with the `String.replaceAll()` method:

```java
public class RemoveUsingRegex1 {
    public static String removeLeadingZeroes(String s) {
        return s.replaceAll("^0+", "");
    }

    public static String removeTrailingZeroes(String s) {
        return s.replaceAll("0+$", "");
    }
}
```

If we don't want to remove all zeroes, we could use the same solution we used with Apache Commons and Guava.
However, there's **a pure regular expression way** to do this:
we have to provide a pattern, which doesn't match the whole String.

That way, if the input contains only zeroes, the regexp engine will keep exactly one out from the matching.
We can do this with the following patterns:

```java
public class RemoveUsingRegex2 {
    public static String removeLeadingZeroes(String s) {
        return s.replaceAll("^0+(?!$)", "");
    }

    public static String removeTrailingZeroes(String s) {
        return s.replaceAll("(?!^)0+$", "");
    }
}
```

Note, that `(?!^)` and `(?!$)` means that it's not the beginning or the end of the `String` respectively.

## Reference

- [Remove Leading and Trailing Characters from a String](https://www.baeldung.com/java-remove-trailing-characters)
