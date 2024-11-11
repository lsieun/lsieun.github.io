---
title: "Java String Format"
sequence: "101"
---

## Format Specifiers

### General Syntax

The syntax of format specifiers for General, Character, and Numeric type is:

```text
%[argument_index$][flags][width][.precision]conversion
```

Specifiers `argument_index`, `flag`, `width`, and `precision` are optional.

- `argument_index` part is an integer `i` – indicating that the `i`th argument from the argument list should be used here
- `flags` is a set of characters used for modifying the output format
- `width` is **a positive integer** which indicates the minimum number of characters to be written to the output
- `precision` is an integer usually used to restrict the number of characters,
  whose specific behavior depends on the conversion
- `conversion` is the mandatory part. It's a character indicating how the argument should be formatted.
  The set of valid conversions for a given argument depends on the argument's data type

### For Date/Time Representation

```text
%[argument_index$][flags][width]conversion
```

Again the `argument_index`, `flags`, and `width` are optional.

```java
import java.util.Calendar;
import java.util.GregorianCalendar;

public class DateAndTimeFormat {
  public static void main(String[] args) {
    Calendar c = new GregorianCalendar(2023, Calendar.MAY, 10);
    String s = String.format("The date is: %tm %1$te,%1$tY", c);
    System.out.println(s);
  }
}
```

```text
The date is: 05 10,2023
```

Here, for every format specifier, the 1st argument will be used, hence `1$`.
Here if we skip the `argument_index` for 2nd and 3rd format specifier,
it tries to find 3 arguments, but we need to use the same argument for all 3 format specifiers.

So, it's ok if we don't specify `argument_index` for the first one, but we need to specify it for the other two.

The `flag` here is made up of two characters.
Where the first character is always a `t` or `T`.
The second character depends on what part of Calendar is to be displayed.

> t 在这里应该是 time 的意思

In our example, the first format specifiers `tm`, indicates **month** formatted as two digits,
`te` indicates the day of the month and `tY` indicated **Year** formatted as four digits.

### Format Specifiers Without Arguments

```text
%[flags][width]conversion
```

The optional `flags` and `width` are the same as defined in above sections.

The required conversion is a character or `String` indicating content to be inserted in the output.
Currently, only the `%` and newline `n` can be printed using this:

```java
public class EscapePercent {
    public static void main(String[] args) {
        String s = String.format("%s scored 90%% in Fall semester", "liusen");
        System.out.println(s);
    }
}
```

```text
liusen scored 90% in Fall semester
```

Inside `format()`, if we want to print `%` – we need to escape it by using `%%`.

## Conversions

Let's now dig into every detail of the Format Specifier syntax, starting with a conversion.
Note that you can find all the details in the
[Formatter javadocs](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Formatter.html).

As we noticed in the above examples, `conversion` part is required in all format specifiers,
and it can be divided into several categories.

### General

Used for any argument type. The general conversions are:

- `b` or `B` – for `Boolean` values
- `h` or `H` – for HashCode
- `s` or `S` – for `String`, if `null`, it prints `null`, else `arg.toString()`

We'll now try to display `boolean` and `String` values, using the corresponding conversions:

```java
public class FormatWithS {
    public static void main(String[] args) {
        String s = String.format("The correct answer is %s", false);
        System.out.println(s); // The correct answer is false
    }
}
```

```java
public class FormatWithB {
    public static void main(String[] args) {
        String s = String.format("The correct answer is %b", null);
        System.out.println(s); // The correct answer is false
    }
}
```

```java
public class FormatWithB {
    public static void main(String[] args) {
        String s = String.format("The correct answer is %B", true);
        System.out.println(s); // The correct answer is TRUE
    }
}
```

## String Formatting three Methods

### String.format

Most common way of formatting a string in java is using `String.format()`. If there were a “**java sprintf**” then this would be it.

```text
String output = String.format("%s = %d", "joe", 35);
```

### PrintStream.printf

For formatted **console output**, you can use `printf()` or the `format()` method of `System.out` and `System.err` PrintStreams.

```text
System.out.printf("My name is %s%n", "joe");
System.out.format("%s = %d", "joe", 35);
```

### Formatter

Create a `Formatter` and link it to a `StringBuilder`. Output formatted using the `format()` method will be appended to the `StringBuilder`.

```text
StringBuilder sb = new StringBuilder();
Formatter fmt = new Formatter(sb);
fmt.format("PI = %f%n", Math.PI);
System.out.print(sb.toString());
```

Full Code

```java
import java.util.Formatter;

public class ThreeMethod {
    public static void main(String[] args) {
        // 第一种方式：使用 String.format 方法（最常用）
        String output = String.format("%s = %d", "joe", 35);
        System.out.println(output);

        // 第二种方式：使用 PrintStream 的 printf 或 format 方法
        // printf 方法本质上是调用 format 方法
        System.out.printf("My name is %s%n", "joe");
        System.out.format("%s = %d%n", "joe", 35);

        // 第三种方式：使用 Formatter 和 StringBuilder 相结合
        StringBuilder sb = new StringBuilder();
        Formatter fmt = new Formatter(sb);
        fmt.format("PI = %f%n", Math.PI);
        System.out.print(sb.toString());
    }
}
```

## Argument Index

An argument index is specified as **a number** ending with a “`$`” after the “`%`” and selects the specified argument in the argument list.

```text
String.format("%2$s", 32, "Hello"); // Hello
```

Full Code:

```java
package lsieun.format;

public class ArgumentIndex {
    public static void main(String[] args) {
        String value = String.format("%2$s", 32, "Hello"); // Hello
        System.out.println(value);

        String name = "Tom";
        int age = 12;
        String intro = String.format("My Name is %2$s, I'm %1$d years old, My Email is %2$s@gmail.com", age, name);
        System.out.println(intro);
    }
}
```

Output:

```txt
Hello
My Name is Tom, I'm 12 years old, My Email is Tom@gmail.com
```

## Different Data

### Integer Formatting

With the `%d` format specifier, you can use an argument of all integral types including `byte`, `short`, `int`, `long` and `BigInteger`.

**Default formatting**:

```text
String.format("%d", 93);
// prints 93
```

**Specifying a width**:

```text
String.format("|%20d|", 93);
// prints: |                  93|
```

**Left-justifying within the specified width**:

```text
String.format("|%-20d|", 93);
// prints: |93                  |
```

**Pad with zeros**:

```text
String.format("|%020d|", 93);
// prints: |00000000000000000093|
```

**Print positive numbers with a “+”**:
(Negative numbers always have the “-” included):

```text
String.format("|%+20d|", 93);
// prints: |                 +93|
```

**A `space` before positive numbers**.
A “`-`” is included for negative numbers as per normal.

```text
String.format("|% d|", 93);
// prints: | 93|

String.format("|% d|", -36);
// prints: |-36|
```

**Use locale-specific thousands separator**.
For the US locale, it is “,”:

```text
String.format("|%,d|", 10000000);
// prints: |10,000,000|
```

**Enclose negative numbers within parantheses (“`()`”) and skip the “`-`“**:

```text
String.format("|%(d|", -36);
// prints: |(36)|
```

**Octal Output**

```text
String.format("|%o|"), 93);
// prints: 135
```

**Hex Output**

```text
String.format("|%x|", 93);
// prints: 5d
```

**Alternate Representation for Octal and Hex Output**

Prints octal numbers with a leading “`0`” and hex numbers with leading “`0x`“.

```text
String.format("|%#o|", 93);
// prints: 0135

String.format("|%#x|", 93);
// prints: 0x5d

String.format("|%#X|", 93);
// prints: 0X5D
```

Full Code:

```text
package lsieun.format;

public class IntegerFormatting {
    public static void main(String[] args) {
        // Default formatting
        System.out.println("\n\n默认");
        System.out.printf("%d%n", 93);        // 93
        System.out.printf("%d%n", -93);       // 93

        // "%+d", 结果带正负号
        System.out.println("\n\n正负号");
        System.out.printf("|%+d|%n", 99);     // |+99|
        System.out.printf("|%+d|%n", -99);    // |-99|
        //System.out.printf("|%-d|%n", 99);   // Exception

        // A space before positive numbers
        // A “-” is included for negative numbers as per normal.
        System.out.println("\n\n空格");
        System.out.printf("|% d|%n", 93);     // | 93|
        System.out.printf("|% d|%n", -93);    // |-93|

        // Specifying a width
        System.out.println("\n\n指定宽度");
        System.out.printf("|%20d|%n", 93);    // |                  93|
        System.out.printf("|%20d|%n", -93);   // |                 -93|

        // Left-justifying within the specified width
        System.out.println("\n\n左对齐");
        System.out.printf("|%-20d|%n", 93);   // |93                  |
        System.out.printf("|%-20d|%n", -93);  // |-93                 |
        System.out.printf("|%-+20d|%n", 93);  // |+93                 |

        // Print positive numbers with a “+”
        System.out.println("\n\n指定宽度 and 正负号");
        System.out.printf("|%+20d|%n", 93);   // |                 +93|
        System.out.printf("|%+20d|%n", -93);  // |                 -93|


        // Pad with zeros
        System.out.println("\n\nPadding with zeros");
        System.out.printf("|%020d|%n", 93);   // |00000000000000000093|

        //
        System.out.println("\n\n逗号分隔");
        System.out.printf("|%,d|%n", 10000000);    // |10,000,000|
        System.out.printf("|%,d|%n", -10000000);   // |-10,000,000|

        System.out.println("\n\n左小括号");
        System.out.printf("|%(d|%n", 36);    // |36|
        System.out.printf("|%(d|%n", -36);   // |(36)|

        System.out.println("\n\n八进制");
        System.out.printf("|%o|%n", 15);    // |17|
        System.out.printf("|%#o|%n", 15);   // |017|

        System.out.println("\n\n十六进制");
        System.out.printf("|%x|%n", 93);    // |5d|
        System.out.printf("|%#x|%n", 93);   // |0x5d|
        System.out.printf("|%#X|%n", 93);   // |0X5D|
    }
}
```

### String Formatting

**Default formatting**: Prints the whole string.

```text
String.format("|%s|", "Hello World");
// prints: "Hello World"
```

**Specify Field Length**

```text
String.format("|%30s|", "Hello World");
// prints: |                   Hello World|
```

**Left Justify Text**

```text
String.format("|%-30s|", "Hello World");
// prints: |Hello World                   |
```

**Specify Maximum Number of Characters**

```text
String.format("|%.5s|", "Hello World");
// prints: |Hello|
```

**Field Width and Maximum Number of Characters**

```text
String.format("|%30.5s|", "Hello World");
|                         Hello|
```

Full Code:

```text
package lsieun.format;

public class StringFormatting {
    public static void main(String[] args) {
        // Default formatting
        System.out.println("\n默认");
        System.out.printf("|%s|%n", "Hello World");    // |Hello World|

        // Specify Field Length
        System.out.println("\n指定宽度");
        System.out.printf("|%30s|%n", "Hello World");  // |                   Hello World|

        // Left Justify Text
        System.out.println("\n指定宽度+左对齐");
        System.out.printf("|%-30s|%n", "Hello World"); // |Hello World                   |

        // Specify Maximum Number of Characters
        System.out.println("\n限制字符个数");
        System.out.printf("|%.5s|%n", "Hello World");  // |Hello|

        // Field Width and Maximum Number of Characters
        System.out.println("\n指定宽度+限制字符个数");
        System.out.printf("|%30.5s|%n", "Hello World");// |                         Hello|
    }
}
```

### Date and Time Formatting

Note: Using the formatting characters with “`%T`” instead of “`%t`” in the table below makes the output uppercase.

| Flag   | Notes                                                        |
| ------ | ------------------------------------------------------------ |
| `%tA`  | Full name of the day of the week, e.g. “`Sunday`“, “`Monday`“ |
| `%ta`  | Abbreviated name of the week day e.g. “`Sun`“, “`Mon`“, etc. |
| `%tB`  | Full name of the month e.g. “`January`“, “`February`“, etc.  |
| `%tb`  | Abbreviated month name e.g. “`Jan`“, “`Feb`“, etc.           |
| `%tC`  | Century part of year formatted with two digits e.g. “00” through “99”. |
| `%tc` | Date and time formatted with “`%ta %tb %td %tT %tZ %tY`” e.g. “`Fri Feb 17 07:45:42 PST 2017`“ |
| `%tD`  | Date formatted as “`%tm/%td/%ty`“                            |
| `%td`  | Day of the month formatted with two digits. e.g. “`01`” to “`31`“. |
| `%te`  | Day of the month formatted without a leading 0 e.g. “1” to “31”. |
| `%tF`  | ISO 8601 formatted date with “`%tY-%tm-%td`“.                |
| `%tH`  | Hour of the day for the 24-hour clock e.g. “`00`” to “`23`“. |
| `%th`  | Same as %tb.                                                 |
| `%tI`  | Hour of the day for the 12-hour clock e.g. “`01`” – “`12`“.  |
| `%tj`  | Day of the year formatted with leading 0s e.g. “`001`” to “`366`“. |
| `%tk`  | Hour of the day for the 24 hour clock without a leading 0 e.g. “`0`” to “`23`“. |
| `%tl`  | Hour of the day for the 12-hour click without a leading 0 e.g. “`1`” to “`12`“. |
| `%tM`  | Minute within the hour formatted a leading 0 e.g. “`00`” to “`59`“. |
| `%tm`  | Month formatted with a leading 0 e.g. “`01`” to “`12`“.      |
| `%tN`  | Nanosecond formatted with 9 digits and leading 0s e.g. “000000000” to “999999999”. |
| `%tp`  | Locale specific “am” or “pm” marker.                         |
| `%tQ`  | Milliseconds since epoch Jan 1 , 1970 00:00:00 UTC.          |
| `%tR`  | Time formatted as 24-hours e.g. “`%tH:%tM`“.                 |
| `%tr`  | Time formatted as 12-hours e.g. “`%tI:%tM:%tS %Tp`“.         |
| `%tS`  | Seconds within the minute formatted with 2 digits e.g. “00” to “60”. “60” is required to support leap seconds. |
| `%ts`  | Seconds since the epoch Jan 1, 1970 00:00:00 UTC.            |
| `%tT`  | Time formatted as 24-hours e.g. “`%tH:%tM:%tS`“.             |
| `%tY`  | Year formatted with 4 digits e.g. “`0000`” to “`9999`“.      |
| `%ty`  | Year formatted with 2 digits e.g. “`00`” to “`99`“.          |
| `%tZ`  | Time zone abbreviation. e.g. “`UTC`“, “`PST`“, etc.          |
| `%tz`  | Time Zone Offset from GMT e.g. “`-0800`“.                    |

```java
package lsieun.format;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateAndTimeFormatting2 {
    public static void main(String[] args) {
        System.out.println("===Composite");
        testComposite();
        System.out.println();

        System.out.println("===Year");
        testYear();
        System.out.println();

        System.out.println("===Month");
        testMonth();
        System.out.println();

        System.out.println("===Day");
        testDay();
        System.out.println();

        System.out.println("===Hour");
        testHour();
        System.out.println();

        System.out.println("===Minute");
        testMinute();
        System.out.println();

        System.out.println("===Second");
        testSecond();
        System.out.println();


        System.out.println("===Week");
        testWeek();
        System.out.println();

        System.out.println("===Other");
        testOther();
        System.out.println();

    }

    public static void testComposite() {
        // Date and time formatted with “%ta %tb %td %tT %tZ %tY” e.g. “Fri Feb 17 07:45:42 PST 2017“
        System.out.printf("%tc%n", getDate("2018-11-11 12:00:00")); // Sun Nov 11 12:00:00 CST 2018
        // Date formatted as “%tm/%td/%ty“
        System.out.printf("%tD%n", getDate("2018-08-09 12:00:00")); // 08/09/18
        // ISO 8601 formatted date with “%tY-%tm-%td“.
        System.out.printf("%tF%n", getDate("2018-08-09 12:00:00")); // 2018-08-09


        // Time formatted as 24-hours e.g. “%tH:%tM“.
        System.out.printf("%tR%n", getDate("2018-11-20 09:09:00")); // 09:09
        // Time formatted as 12-hours e.g. “%tI:%tM:%tS %Tp“.
        System.out.printf("%tr%n", getDate("2018-11-20 11:00:00")); // 11:00:00 AM
        System.out.printf("%tr%n", getDate("2018-11-20 13:00:00")); // 01:00:00 PM

        // Time formatted as 24-hours e.g. “%tH:%tM:%tS“.
        System.out.printf("%tT%n", getDate("1970-01-01 08:00:09")); // 08:00:09
        System.out.printf("%tT%n", getDate("1970-01-01 13:00:09")); // 13:00:09
    }

    public static void testYear() {
        // Century part of year formatted with two digits e.g. “00” through “99”.
        System.out.printf("%tC%n", getDate("2018-11-11 12:00:00")); // 20
        System.out.printf("%tC%n", getDate("1970-01-01 12:00:00")); // 19

        // Year formatted with 4 digits e.g. “0000” to “9999“.
        System.out.printf("%tY%n", getDate("1970-01-01 12:00:00")); // 1970
        // Year formatted with 2 digits e.g. “00” to “99“.
        System.out.printf("%ty%n", getDate("1970-01-01 12:00:00")); // 70
    }

    public static void testMonth() {
        // Full name of the month e.g. “January“, “February“, etc.
        System.out.printf("%tB%n", getDate("2018-11-11 12:00:00")); // November
        // Abbreviated month name e.g. “Jan“, “Feb“, etc.
        System.out.printf("%tb%n", getDate("2018-11-11 12:00:00")); // Nov
        // Same as %tb.
        System.out.printf("%th%n", getDate("2018-08-09 13:00:00")); // Aug

        // Month formatted with a leading 0 e.g. “01” to “12“.
        System.out.printf("%tm%n", getDate("2018-08-09 07:06:00")); // 08
    }

    public static void testDay() {
        // Day of the month formatted with two digits. e.g. “01” to “31“.
        System.out.printf("%td%n", getDate("2018-08-09 12:00:00")); // 09
        // Day of the month formatted without a leading 0 e.g. “1” to “31”.
        System.out.printf("%te%n", getDate("2018-08-09 12:00:00")); // 9

        // Day of the year formatted with leading 0s e.g. “001” to “366“.
        System.out.printf("%tj%n", getDate("2018-01-10 13:00:00")); // 010
    }

    public static void testHour() {
        // Hour of the day for the 24-hour clock e.g. “00” to “23“.
        System.out.printf("%tH%n", getDate("2018-08-09 13:00:00")); // 13

        // Hour of the day for the 12-hour clock e.g. “01” – “12“.
        System.out.printf("%tI%n", getDate("2018-08-09 09:00:00")); // 09
        System.out.printf("%tI%n", getDate("2018-08-09 13:00:00")); // 01

        // Hour of the day for the 24 hour clock without a leading 0 e.g. “0” to “23“.
        System.out.printf("%tk%n", getDate("2018-08-09 07:00:00")); // 7
        System.out.printf("%tk%n", getDate("2018-08-09 13:00:00")); // 13

        // Hour of the day for the 12-hour click without a leading 0 e.g. “1” to “12“.
        System.out.printf("%tl%n", getDate("2018-08-09 07:00:00")); // 7
        System.out.printf("%tl%n", getDate("2018-08-09 13:00:00")); // 1
    }

    public static void testMinute() {
        // Minute within the hour formatted a leading 0 e.g. “00” to “59“.
        System.out.printf("%tM%n", getDate("2018-08-09 07:06:00")); // 06
    }

    public static void testSecond() {
        // Milliseconds since epoch Jan 1 , 1970 00:00:00 UTC.
        System.out.printf("%tQ%n", getDate("1970-01-01 08:00:01")); // 1000

        // Seconds within the minute formatted with 2 digits e.g. “00” to “60”.
        System.out.printf("%tS%n", getDate("1970-01-01 08:00:09")); // 09

        // Seconds since the epoch Jan 1, 1970 00:00:00 UTC.
        System.out.printf("%ts%n", getDate("1970-01-01 08:00:09")); // 9
    }

    public static void testWeek() {
        // Full name of the day of the week, e.g. “Sunday“, “Monday“
        System.out.printf("%tA%n", getDate("2018-11-11 12:00:00")); // Sunday
        // Abbreviated name of the week day e.g. “Sun“, “Mon“, etc.
        System.out.printf("%ta%n", getDate("2018-11-11 12:00:00")); // Sun
    }

    public static void testOther() {
        // Nanosecond formatted with 9 digits and leading 0s e.g. “000000000” to “999999999”.
        System.out.printf("%tN%n", getDate("2018-11-20 12:00:00")); // 000000000
        System.out.printf("%tN%n", new Date()); // 变化的值

        // Locale specific “am” or “pm” marker.
        System.out.printf("%tp%n", getDate("2018-11-20 11:00:00")); // am
        System.out.printf("%tp%n", getDate("2018-11-20 12:00:00")); // pm
        System.out.printf("%tp%n", getDate("2018-11-20 13:00:00")); // pm
        System.out.printf("%tp%n", getDate("2018-11-20 24:00:00")); // am

        // Time zone abbreviation. e.g. “UTC“, “PST“, etc.
        System.out.printf("%tZ%n", new Date()); // CST
        // Time Zone Offset from GMT e.g. “-0800“.
        System.out.printf("%tz%n", new Date()); // +0800
    }



    public static Date getDate(String str) {
        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            date = fmt.parse(str);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return date;
    }
}
```

### escape %

To escape `%`, you will need to double it up: `%%`.

一个简单的替换方式：

```text
str = str.replace("%", "%%");
```

但是，这种简单的方式可能会将正常的 `%%` 替换成 `%%%%` 的形式。

This is a stronger regex replace that won't replace %% that are already doubled in the input.

```text
str = str.replaceAll("(?:[^%]|\\A)%(?:[^%]|\\z)", "%%");
```

## Reference

- [Guide to java.util.Formatter](https://www.baeldung.com/java-string-formatter)
- [Java String Format Examples](https://www.novixys.com/blog/java-string-format-examples/)
- [Java 8 Doc: Class Formatter](https://docs.oracle.com/javase/8/docs/api/java/util/Formatter.html)

