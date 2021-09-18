---
title:  "Method Analysis Examples"
sequence: "412"
---

## Constant conditions & exceptions warning

```text
public void problems(String s, Object obj) {
    if (s == null) {
        // Method invocation 'trim' will produce 'NullPointerException'
        System.out.println(s.trim());
    }

    if (s.length() == 2) {
        // The call to 'substring' always fails as index is out of bounds
        System.out.println(s.substring(3));
    }

    if (obj instanceof Number) {
        // Casting 'obj' to 'String' will produce 'ClassCastException' for any non-null value
        System.out.println(((String) obj).isEmpty());
    }

    // Condition 's.equals("no")' is always 'false'
    // 因为如果s的值为no，那么它的length就应该是2。
    if (s.equals("no")) {
        System.out.println("Impossible!");
    }
}
```

## Condition is always true/false

```text
public void test(int x) {
    if (x < 0) {
        if (x > 1) {
            // Condition 'x > 1' is always 'false'
            System.out.println(x);
        }
    }
}
```

{:refdef: style="text-align: center;"}
![](/assets/images/java/asm/x-less-than-0-and-greater-than-1.png)
{: refdef}


```text
public void test(int idx) {
    if (Character.isLowerCase("Java".charAt(idx)) || idx < 4) {
        // Condition 'Character.isLowerCase("Java".charAt(idx)) || idx < 4' is always 'true'
        System.out.println(idx);
    }
}
```

- `String.charAt(int idx)`:
  - `idx >= this.length` -> fail;
  - `idx < 0` -> fail

- 第一种情况，如果`idx == 0`，那么`false || true`。
- 第二种情况，如果`idx == 1`，那么`true || true`。
- 第三种情况，如果`idx == 2`，那么`true || true`。
- 第四种情况，如果`idx == 3`，那么`true || true`。
- 第五种情况，如果`idx > 3`，那么`StringIndexOutOfBoundsException || true`。
- 第六种情况，如果`idx < 0`，那么`StringIndexOutOfBoundsException || true`。

```text
public void test() {
    if (5 > 5) {
        // Condition '5 > 5' is always 'false'
    }
}
```

```text
public void test() {
    if (12 * 3 - 19 / 6 % 4 * Math.abs(-3) > 2) {
        // Condition '12 * 3 - 19 / 6 % 4 * Math.abs(-3) > 2' is always 'true'
    }
}
```

```text
public void test(int x, int y) {
    if (x % 5 > y % 10 + 20) {
        // Condition 'x % 5 > y % 10 + 20' is always 'false'
    }
}
```

```text
public void test(int x, int y) {
    if (x * 2 == y * 4 + 1) {
        // Condition 'x * 2 == y * 4 + 1' is always 'false'
    }
}
```

```text
public void test() {
    int x = 3;
    int y = x * x;
    int z = x * 2;
    if (x + z > y) {
        // Condition 'x + z > y' is always 'false'
    }
}
```

```text
public void test(int x, int y) {
    int a = x > 0 ? 1 : 0;
    int b = y > 0 ? 1 : 0;
    if (a + b == 2) {
        if (x < 0) {
            // Condition 'x < 0' is always 'false'
        }
    }
}
```

```text
public void test(int x, int y) {
    int a = x > 0 ? 1 : 0;
    int b = y > 0 ? 1 : 0;
    if (a + b == 1) {
        if (x == y) {
            // Condition 'x == y' is always 'false'
        }
    }
}
```

## Nullness

```text
public void test(String s) {
    if (s == null) {
        System.out.println("String is null!");
    }

    // Method invocation 'trim' may produce 'NullPointerException'
    System.out.println(s.trim());
}
```

```text
public void test(String s) {
    // 没有提示
    System.out.println(s.trim());
}
```

## Tracking relations

```text
public void test(Object a, Object b, Object c) {
    if (a == b && b == c) {
        if (a != c) {
            // Condition 'a != c' is always 'false'
        }
    }
}
```

```text
public void test(String a, String b, String c) {
    if (a.equals(b) && b.equals(c)) {
        if (!a.equals(c)) {
            // Condition '!a.equals(c)' is always 'false'
        }
    }
}
```

```text
public void test(int x, int y, int z) {
    if (x < y) return;
    if (y < z) return;
    if (x < z) {
        // Condition 'x < z' is always 'false'
    }
}
```

```text
public void test(int x, int y) {
    if (x == y) return;
    int diff = x - y;
    if (diff == 0) {
        // Condition 'diff == 0' is always 'false'
    }
}
```

## Field

```text
static class Point {
    int x;
    int y;
}

public void test(Point p) {
    p.x = 10;
    p.y = 10;
    // System.out.println("Hello!");
    if (p.x == p.y) { // Condition 'p.x == p.y' is always 'true'
        System.out.println("Impossible");
    }
}
```

```java
import java.io.PrintStream;

public class HelloWorld {
    static class Point {
        int x;
        int y;
    }

    public static void test(Point p) {
        p.x = 10;
        p.y = 10;
        System.out.println("Hello!");
        if (p.x == p.y) { // Not always false anymore?
            System.out.println("Impossible");
        }
    }

    public static void main(String[] args) {
        Point p = new Point();
        System.setOut(new PrintStream(System.out) {
            @Override
            public void println(String x) {
                super.println(x);
                p.x = p.y = 0;
            }
        });
        test(p);
    }
}
```

Pure methods

```java
public class HelloWorld {
    static class Point {
        int x;
        int y;
    }

    public static void test(Point p) {
        p.x = 10;
        p.y = 20;
        double z = Math.sqrt(2);
        if (p.x == p.y) { // Condition 'p.x == p.y' is always 'false'
            System.out.println("Impossible");
        }
    }
}
```

## Locality tracking

```java
public class HelloWorld {
    static class Point {
        int x;
        int y;
    }

    public static void test() {
        Point p = new Point();
        p.x = 10;
        p.y = 20;
        System.out.println("Hello!");
        if (p.x == p.y) { // Condition 'p.x == p.y' is always 'false'
            System.out.println("Impossible");
        }
    }
}
```

## Array elements

```java
public class HelloWorld {
    public static void test(int[] array) {
        if (array[0] == array[1]) {
            // Result of 'array[0] - array[1]' is always '0'
            int diff = array[0] - array[1];
            System.out.println(diff);
        }
    }
}
```

```java
public class HelloWorld {
    public static void test(int[] array, int i) {
        if (array[0] == array[1]) {
            array[i] = 10;
            int diff = array[0] - array[1];
            System.out.println(diff);
        }
    }
}
```

```java
public class HelloWorld {
    public static void test(int[] array, int i) {
        if (array[0] == array[1] && i >= 2) {
            array[i] = 10;
            int diff = array[0] - array[1];
            System.out.println(diff);
        }
    }
}
```

```java
public class HelloWorld {
    public static void test(int[] array, int i, int j) {
        if (array[i] == array[j]) {
            int diff = array[i] - array[j];
            System.out.println(diff);
        }
    }
}
```

## Getters

```java
public class HelloWorld {
    public final class Point {
        private final int x;
        private final int y;

        public Point(int x, int y) {
            this.x = x;
            this.y = y;
        }

        public int getX() {
            return x;
        }

        public int getY() {
            return y;
        }
    }

    public static void test(Point p) {
        if (p.getX() % 2 == 1) {
            if (p.getX() == p.getY() * 2) {
                // Condition 'p.getX() == p.getY() * 2' is always 'false'
            }
        }
    }
}
```

## Special fields

- Array length
- String length
- Collection size(mutable)
- Map size(mutable)
- Optional value
- Boxed value

### Hardcoded contracts

- `String.isEmpty()`: this.length == 0 -> true; else -> false

```java
public class HelloWorld {
    public static void test(String s) {
        if (s.isEmpty()) return;
        int length = s.length();
        if (length >= 1) {
            // Condition 'length >= 1' is always 'true'
        }
    }
}
```

- `String.startsWith(String str)`: `this.length < str.length` -> false

```java
public class HelloWorld {
    public static void test(String s) {
        if (s.startsWith("--")) {
            if (s.isEmpty()) {
                // Condition 's.isEmpty()' is always 'false'
            }
        }
    }
}
```

## Method handlers

## Method ranges

```java
public class HelloWorld {
    public void test(LocalDate date) {
        int day = date.getDayOfMonth();
        if (day == 0) {
            // Condition 'day == 0' is always 'false'
        }
    }
}
```

## Mutability

```java
public class HelloWorld {
    public void test(List<String> input) {
        List<String> list = Collections.unmodifiableList(input);
        list.add("Java"); // Immutable object is modified
    }
}
```

## Common dataflow

```java
public class HelloWorld {
    public void test(int x, int y) {
        if (x == y) {
            // Division by zero
            System.out.println(1 / (x - y));
        }
    }
}
```

```java
public class HelloWorld {
    public void test(List<String> list) {
        if (!list.isEmpty()) return;
        // Collection 'list' is always empty
        for (String s : list) {
            System.out.println(s);
        }
    }
}
```

```java
public class HelloWorld {
    public long test(int hour, int minutes, int seconds) {
        // hour * 3600: integer multiplication implicitly cast to long
        return hour * 3600 + minutes * 60 + seconds;
    }
}
```

```java
public class HelloWorld {
    public long test(int hour, int minutes, int seconds) {
        assert hour >= 0 && hour < 24;
        assert minutes >= 0 && minutes < 60;
        assert seconds >= 0 && seconds < 60;
        return hour * 3600 + minutes * 60 + seconds;
    }
}
```

在`return`语句中，选中`hour * 3600 + minutes * 60 + seconds`部分，按下两次`Ctrl + Shift + P`，可以查看这个表达式的Range。
