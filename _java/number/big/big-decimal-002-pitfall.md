---
title: "BigDecimal 的常见陷阱"
sequence: "112"
---

## 构造方法 double

```java
import java.math.BigDecimal;

public class HelloWorld {
    public static void main(String[] args) {
        BigDecimal val1 = new BigDecimal(0.01);
        BigDecimal val2 = BigDecimal.valueOf(0.01);
        System.out.println("val1 = " + val1);
        System.out.println("val2 = " + val2);
    }
}
```

输出：

```text
val1 = 0.01000000000000000020816681711721685132943093776702880859375    // 注意：这里是一个近似值
val2 = 0.01
```

正确做法：

- 使用 `BigDecimal(String val)` 构造方法，接收字符串
- 使用 `BigDecimal.valueOf(double val)` 方法

```java
public class BigDecimal extends Number implements Comparable<BigDecimal> {
    /**
     * The results of this constructor can be somewhat unpredictable.
     * 查看文档注释
     */
    public BigDecimal(double val) {
        this(val,MathContext.UNLIMITED);
    }

    public BigDecimal(String val) {
        this(val.toCharArray(), 0, val.length());
    }

    public static BigDecimal valueOf(double val) {
        return new BigDecimal(Double.toString(val));
    }
}
```

## 比较

```java
import java.math.BigDecimal;

public class HelloWorld {
    public static void main(String[] args) {
        BigDecimal val1 = new BigDecimal("0.01");  // 这里是 0.01
        BigDecimal val2 = new BigDecimal("0.010"); // 这里是 0.010
        System.out.println(val1.equals(val2));
        System.out.println(val1.compareTo(val2));
    }
}
```

输出结果：

```text
false
0
```

在源码当中，找一下问题的原因：

```java
public class BigDecimal extends Number implements Comparable<BigDecimal> {
    @Override
    public boolean equals(Object x) {
        // 第 1 步，比较类型
        if (!(x instanceof BigDecimal xDec))
            return false;
        
        // 第 2 步，比较引用 this
        if (x == this)
            return true;
        
        // 第 3 步，比较 scale（问题出在这里，在上面的例子中，一个是 2，一个是 3）
        if (scale != xDec.scale)
            return false;
        long s = this.intCompact;
        long xs = xDec.intCompact;
        if (s != INFLATED) {
            if (xs == INFLATED)
                xs = compactValFor(xDec.intVal);
            return xs == s;
        } else if (xs != INFLATED)
            return xs == compactValFor(this.intVal);

        return this.inflated().equals(xDec.inflated());
    }

    @Override
    public int compareTo(BigDecimal val) {
        // Quick path for equal scale and non-inflated case.
        if (scale == val.scale) {
            long xs = intCompact;
            long ys = val.intCompact;
            if (xs != INFLATED && ys != INFLATED)
                return xs != ys ? ((xs > ys) ? 1 : -1) : 0;
        }
        int xsign = this.signum();
        int ysign = val.signum();
        if (xsign != ysign)
            return (xsign > ysign) ? 1 : -1;
        if (xsign == 0)
            return 0;
        int cmp = compareMagnitude(val);
        return (xsign > 0) ? cmp : -cmp;
    }
}
```

## 除法

```java
import java.math.BigDecimal;

public class HelloWorld {
    public static void main(String[] args) {
        BigDecimal val1 = new BigDecimal("1.00");
        BigDecimal val2 = new BigDecimal("3.00");
        BigDecimal result = val1.divide(val2);
        System.out.println(result);
    }
}
```

出现异常：

```text
Exception in thread "main" java.lang.ArithmeticException:
                          Non-terminating decimal expansion; no exact representable decimal result.
	at java.base/java.math.BigDecimal.divide(BigDecimal.java:1766)
```

原因解释：`1` 除以 `3` 得到的是 `0.33...` 循环，无法用 `BigDecimal` 精确表示。

正确做法：

```text
// 保留两位小数，进行四舍五入
BigDecimal result = val1.divide(val2, 2, RoundingMode.HALF_UP);
```

