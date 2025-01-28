---
title: "检查数字"
sequence: "101"
---

[UP](/java/java-text-index.html)


```java
import java.util.regex.Pattern;

public class CheckNumber {
    private static final Pattern pattern = Pattern.compile("-?\\d+(\\.\\d+)?");

    public static boolean isNumeric(String strNum) {
        if (strNum == null) {
            return false;
        }
        return pattern.matcher(strNum).matches();
    }

    public static void main(String[] args) {
        String[] array = {
                "123", "34.56", "-789",
                null, "abc"
        };
        BoxUtils.print(array, CheckNumber::isNumeric);
    }
}
```

```text
┌───────┬───────┐
│  123  │ true  │
├───────┼───────┤
│ 34.56 │ true  │
├───────┼───────┤
│ -789  │ true  │
├───────┼───────┤
│ null  │ false │
├───────┼───────┤
│  abc  │ false │
└───────┴───────┘
```

## Reference

- [Check If a String Is Numeric in Java](https://www.baeldung.com/java-check-string-number)
