---
title: "季度和季节"
sequence: "110"
---

[UP](/java-time.html)


## 季度

```text
public class HelloWorld {
    public static void main(String[] args) {
        for (int i = 1; i <= 12; i++) {
            int quarter = getQuarter(i);
            String message = String.format("第 %02d 月是属于第 %d 季度", i, quarter);
            System.out.println(message);
        }
    }

    private static int getQuarter(int month) {
        int quarter;
        if (month >= 1 && month <= 3) {
            quarter = 1;
        } else if (month >= 4 && month <= 6) {
            quarter = 2;
        } else if (month >= 7 && month <= 9) {
            quarter = 3;
        } else if (month >= 10 && month <= 12) {
            quarter = 4;
        } else {
            throw new IllegalArgumentException("month is not valid: " + month);
        }
        return quarter;
    }
}
```

输出结果：

```text
第 01 月是属于第 1 季度
第 02 月是属于第 1 季度
第 03 月是属于第 1 季度
第 04 月是属于第 2 季度
第 05 月是属于第 2 季度
第 06 月是属于第 2 季度
第 07 月是属于第 3 季度
第 08 月是属于第 3 季度
第 09 月是属于第 3 季度
第 10 月是属于第 4 季度
第 11 月是属于第 4 季度
第 12 月是属于第 4 季度
```

改进一下：

```java
public class HelloWorld {
    public static void main(String[] args) {
        for (int i = 1; i <= 12; i++) {
            int quarter = getQuarter(i);
            String message = String.format("第 %02d 月是属于第 %d 季度", i, quarter);
            System.out.println(message);
        }
    }

    private static int getQuarter(int month) {
        int quarter = (month + 2) / 3;
        return quarter;
    }
}
```

## 季节

- 春天：3、4、5 月
- 夏天：6、7、8 月
- 秋天：9、10、11 月
- 冬天：12、1、2 月

```java
public class HelloWorld {
    public static void main(String[] args) {
        for (int i = 1; i <= 12; i++) {
            String season = getSeason(i);
            String message = String.format("第 %02d 月是属于 %s", i, season);
            System.out.println(message);
        }
    }

    private static String getSeason(int month) {
        String season;
        switch (month / 3) {
            case 1:
                season = "春天";
                break;
            case 2:
                season = "夏天";
                break;
            case 3:
                season = "秋天";
                break;
            default:
                season = "冬天";
        }
        return season;
    }
}
```

输出结果：

```text
第 01 月是属于冬天
第 02 月是属于冬天
第 03 月是属于春天
第 04 月是属于春天
第 05 月是属于春天
第 06 月是属于夏天
第 07 月是属于夏天
第 08 月是属于夏天
第 09 月是属于秋天
第 10 月是属于秋天
第 11 月是属于秋天
第 12 月是属于冬天
```
