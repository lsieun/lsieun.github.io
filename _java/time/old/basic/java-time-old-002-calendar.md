---
title: "java.util.Calendar"
sequence: "102"
---

[UP](/java-time.html)


## 想法

如果时间是 `2022-01-31`，加上 1 个月，那结果是 2 月，还是 3 月呢？

```java
import java.util.Calendar;
import java.util.Date;

public class CalendarRun {
    public static void main(String[] args) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(2022, Calendar.JANUARY, 31, 23, 59, 59);

        Date time1 = calendar.getTime();
        System.out.println(time1);

        calendar.add(Calendar.MONTH, 1);
        Date time2 = calendar.getTime();
        System.out.println(time2);
    }
}
```

输出结果：

```text
Mon Jan 31 23:59:59 CST 2022
Mon Feb 28 23:59:59 CST 2022
```
