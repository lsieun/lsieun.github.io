---
title: "自定义解析 Enum 的工具类"
sequence: "111"
---

## 第一版

### MassUnits

```java
import java.text.MessageFormat;
import java.util.Arrays;


public enum MassUnits {
    /**
     * 毫克每升 milligram/liter
     */
    MGL(0, "mg/L"),

    /**
     * 微克每升 microgram/liter
     */
    UGL(1, "ug/L"),
    ;

    public final int value;
    public final String name;

    MassUnits(int value, String name) {
        this.value = value;
        this.name = name;
    }

    public static MassUnits parse(String text) {
        for (var item : values()) {
            if (item.name.equalsIgnoreCase(text)) {
                return item;
            }
        }
        String message = MessageFormat.format(
                "Unknown enum type {0}, Allowed values are {1}",
                text,
                Arrays.toString(values())
        );
        throw new IllegalArgumentException(message);
    }

    public static MassUnits parse(int val) {
        for (var item : values()) {
            if (item.value == val) {
                return item;
            }
        }

        String message = MessageFormat.format(
                "Unknown enum type {0}, Allowed values are {1}",
                val,
                Arrays.toString(values())
        );
        throw new IllegalArgumentException(message);
    }
}
```

## 第二版

### MassUnits

```java
import java.util.Objects;

/**
 * @author xxx
 * @since 2023/02/21
 */
public enum MassUnits {
    /**
     * 毫克每升 milligram/liter
     */
    MGL(0, "mg/L"),

    /**
     * 微克每升 microgram/liter
     */
    UGL(1, "ug/L"),
    ;

    public final int value;
    public final String name;

    MassUnits(int value, String name) {
        this.value = value;
        this.name = name;
    }

    public static MassUnits parse(String text) {
        return EnumUtils.parseEnum(MassUnits.class, text, Enum::name, String::equalsIgnoreCase);
    }

    public static MassUnits parse(int val) {
        return EnumUtils.parseEnum(MassUnits.class, val, item -> item.value, Objects::equals);
    }
}
```

### 工具类 EnumUtils

```java
import java.text.MessageFormat;
import java.util.Arrays;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;


public class EnumUtils {
    public static <T extends Enum<T>, S> T parseEnum(
            Class<T> clazz,
            S targetValue,
            Function<T, S> sourceFunc,
            BiFunction<S, S, Boolean> equalFunc
    ) {
        boolean isEnum = clazz.isEnum();
        if (!isEnum) {
            throw new IllegalArgumentException("clazz is not enum: " + clazz);
        }
        T[] array = clazz.getEnumConstants();

        for (T item : array) {
            S sourceValue = sourceFunc.apply(item);
            Boolean flag = equalFunc.apply(sourceValue, targetValue);
            if (flag) {
                return item;
            }
        }

        String message = MessageFormat.format(
                "Unknown enum {0} type {1}, Allowed values are {2}",
                clazz.getCanonicalName(),
                targetValue,
                Arrays.stream(array).map(sourceFunc).collect(Collectors.toList())
        );
        throw new IllegalArgumentException(message);
    }
}
```
