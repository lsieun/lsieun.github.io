---
title: "DecimalFormat"
sequence: "103"
---

## 示例一

```java
import java.math.RoundingMode;
import java.text.DecimalFormat;

public class FormatUsingDecimalFormat {
    public static void main(String[] args) {
        double number = 3.1415926D;

        DecimalFormat format = new DecimalFormat("0.##");
        format.setRoundingMode(RoundingMode.HALF_UP);
        String str = format.format(number);
        System.out.println(str);
    }
}
```

输出：

```text
3.14
```

## 示例二

```java
import java.math.RoundingMode;
import java.text.DecimalFormat;

public class NumberFormat {

    public static String succinct(double val) {
        return succinct(val, 3);
    }

    public static String succinct(double val, int precision) {
        return succinct(val, precision, RoundingMode.HALF_UP);
    }

    public static String succinct(double val, int precision, RoundingMode roundingMode) {
        if (precision <= 0) {
            return String.valueOf(val);
        }

        String pattern = "0." + "#".repeat(precision);
        DecimalFormat df = new DecimalFormat(pattern);
        df.setRoundingMode(roundingMode);
        return df.format(val);
    }
}
```

```java
import java.math.RoundingMode;

public class HelloWorld {
    public static void main(String[] args) {
        double [] array = {
                1.0D,
                0.0D,
                Math.PI
        };

        for (double val : array) {
            String str = NumberFormat.succinct(val, 3, RoundingMode.HALF_UP);
            System.out.println(str);
        }
    }
}
```

```text
1
0
3.142
```

## 示例三：scientific notation

```java
import java.text.DecimalFormat;
import java.text.NumberFormat;

public class ScientificNotation {
    public static void main(String[] args) {
        NumberFormat numFormat = new DecimalFormat("0.###E0");

        double[] array = {
                0,
                Math.PI,
                Math.PI / 1000,
                Integer.MAX_VALUE,
                Integer.MIN_VALUE
        };

        for (double item : array) {
            String str = numFormat.format(item);
            System.out.println(str);
        }
    }
}
```

输出结果：

```text
0E0
3.142E0
3.142E-3
2.147E9
-2.147E9
```
