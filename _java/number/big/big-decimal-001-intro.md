---
title: "BigDecimal"
sequence: "111"
---

## Intro

使用 `double` 进行运算，会失去精度。以前，我以为只会发生在“乘法”和“除法”的时候；今天发现“减法”，也会损失精度。

```text
double d1 = 13.135D;
double d2 = 8.589D;
double diff = d1 - d2;
System.out.println(diff);
```

输出结果：

```text
4.545999999999999
```

## 写法

```text
BigDecimal num1 = new BigDecimal(2.225667); // 这种写法不允许，会造成精度损失
```

```text
BigDecimal num2 = new BigDecimal(2); // 这种写法是可以的
```

```text
BigDecimal num = new BigDecimal("2.225667"); // 一般都会这样写最好
int count = num.scale();
System.out.println(count); // 6 返回的是小数点后的位数
```

## 枚举介绍

### ROUND_DOWN

```text
BigDecimal b = new BigDecimal("2.225667").setScale(2, BigDecimal.ROUND_DOWN);
System.out.println(b); // 2.22 直接去掉多余的位数
```

### ROUND_UP

```text
BigDecimal c = new BigDecimal("2.224667").setScale(2, BigDecimal.ROUND_UP);
System.out.println(c); // 2.23 跟上面相反，进位处理
```

### ROUND_CEILING

```text
BigDecimal f = new BigDecimal("2.224667").setScale(2, BigDecimal.ROUND_CEILING);
System.out.println(f); // 2.23 如果是正数，相当于 BigDecimal.ROUND_UP

BigDecimal g = new BigDecimal("-2.225667").setScale(2, BigDecimal.ROUND_CEILING);
System.out.println(g); // -2.22 如果是负数，相当于 BigDecimal.ROUND_DOWN
```

### ROUND_FLOOR

```text
BigDecimal h = new BigDecimal("2.225667").setScale(2, BigDecimal.ROUND_FLOOR);
System.out.println(h); // 2.22 如果是正数，相当于 BigDecimal.ROUND_DOWN

BigDecimal i = new BigDecimal("-2.224667").setScale(2, BigDecimal.ROUND_FLOOR);
System.out.println(i); // -2.23 如果是负数，相当于 BigDecimal.ROUND_HALF_UP
```

### ROUND_HALF_UP

```text
BigDecimal d = new BigDecimal("2.225").setScale(2, BigDecimal.ROUND_HALF_UP);
System.out.println("ROUND_HALF_UP"+d); // 2.23  四舍五入（若舍弃部分>=.5，就进位）
```

### ROUND_HALF_DOWN

```text
BigDecimal e = new BigDecimal("2.225").setScale(2, BigDecimal.ROUND_HALF_DOWN);
System.out.println("ROUND_HALF_DOWN"+e); // 2.22  四舍五入（若舍弃部分>.5,就进位）
```

### ROUND_HALF_EVEN

```text
BigDecimal j = new BigDecimal("2.225").setScale(2, BigDecimal.ROUND_HALF_EVEN);
System.out.println(j); // 2.22 如果舍弃部分左边的数字为偶数，则作   ROUND_HALF_DOWN 

BigDecimal k = new BigDecimal("2.215").setScale(2, BigDecimal.ROUND_HALF_EVEN);
System.out.println(k); // 2.22 如果舍弃部分左边的数字为奇数，则作   ROUND_HALF_UP


System.out.println("************************************");

System.out.println("4.05: " + new BigDecimal("4.05").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 4.05: 4.0  down
System.out.println("4.15: " + new BigDecimal("4.15").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 4.15: 4.2  up
System.out.println("4.25: " + new BigDecimal("4.25").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 4.25: 4.2  down
System.out.println("4.35: " + new BigDecimal("4.35").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 4.35: 4.4  up
System.out.println("4.45: " + new BigDecimal("4.45").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 4.45: 4.4  down
System.out.println("4.55: " + new BigDecimal("4.55").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 4.55: 4.6  up
System.out.println("4.65: " + new BigDecimal("4.65").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 4.65: 4.6  down

System.out.println("3.05: " + new BigDecimal("3.05").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 3.05: 3.0  down
System.out.println("3.15: " + new BigDecimal("3.15").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 3.15: 3.2  up
System.out.println("3.25: " + new BigDecimal("3.25").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 3.25: 3.2  down
System.out.println("3.35: " + new BigDecimal("3.35").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 3.35: 3.4  up
System.out.println("3.45: " + new BigDecimal("3.45").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 3.45: 3.4  down
System.out.println("3.55: " + new BigDecimal("3.55").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 3.55: 3.6  up
System.out.println("3.65: " + new BigDecimal("3.65").setScale(1, BigDecimal.ROUND_HALF_EVEN)); // 3.65: 3.6  down
```

### ROUND_UNNECESSARY

```text
BigDecimal l = new BigDecimal("2.215").setScale(3, BigDecimal.ROUND_UNNECESSARY);
System.out.println(l);
// 断言请求的操作具有精确的结果，因此不需要舍入。
// 如果对获得精确结果的操作指定此舍入模式，则抛出 ArithmeticException。
```

## Reference

- [BigDecimal and BigInteger in Java](https://www.baeldung.com/java-bigdecimal-biginteger)
- [Check if BigDecimal Value Is Zero](https://www.baeldung.com/java-bigdecimal-zero)
- [Converting String to BigDecimal in Java](https://www.baeldung.com/java-string-to-bigdecimal)
- [BigDecimal.setScale 用法总结](https://www.cnblogs.com/sxdcgaq8080/p/12123917.html)

视频：

- [BigDecimal中十分常见的陷阱](https://www.bilibili.com/video/BV1t8411r7gs/)
