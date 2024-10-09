---
title: "Human-Readable Byte Size"
sequence: "101"
---

It's worth mentioning that there are two variants of the unit prefixes:

- **Binary Prefixes** – They are the powers of 1024; for example, 1MiB = 1024 KiB, 1GiB = 1024 MiB, and so on
- **SI** (International System of Units) Prefixes – They are the powers of 1000;
  for example, 1MB = 1000 KB, 1GB = 1000 MB, and so on.

```java
public class HumanReadableConst {
    public static final long BYTE = 1L;
    public static final long KiB = BYTE << 10;
    public static final long MiB = KiB << 10;
    public static final long GiB = MiB << 10;
    public static final long TiB = GiB << 10;
    public static final long PiB = TiB << 10;
    public static final long EiB = PiB << 10;

    public static final long KB = BYTE * 1000;
    public static final long MB = KB * 1000;
    public static final long GB = MB * 1000;
    public static final long TB = GB * 1000;
    public static final long PB = TB * 1000;
    public static final long EB = PB * 1000;
}
```

```java
import java.util.HashMap;
import java.util.Map;

public class HumanReadableData {
    public static final Map<Long, String> DATA_MAP_BINARY_PREFIXES = new HashMap<>();

    public static final Map<Long, String> DATA_MAP_SI_PREFIXES = new HashMap<>();

    static {
        DATA_MAP_BINARY_PREFIXES.put(0L, "0 Bytes");
        DATA_MAP_BINARY_PREFIXES.put(1023L, "1023 Bytes");
        DATA_MAP_BINARY_PREFIXES.put(1024L, "1 KiB");
        DATA_MAP_BINARY_PREFIXES.put(12_345L, "12.06 KiB");
        DATA_MAP_BINARY_PREFIXES.put(10_123_456L, "9.65 MiB");
        DATA_MAP_BINARY_PREFIXES.put(10_123_456_798L, "9.43 GiB");
        DATA_MAP_BINARY_PREFIXES.put(1_777_777_777_777_777_777L, "1.54 EiB");

        DATA_MAP_SI_PREFIXES.put(0L, "0 Bytes");
        DATA_MAP_SI_PREFIXES.put(999L, "999 Bytes");
        DATA_MAP_SI_PREFIXES.put(1000L, "1 KB");
        DATA_MAP_SI_PREFIXES.put(12_345L, "12.35 KB");
        DATA_MAP_SI_PREFIXES.put(10_123_456L, "10.12 MB");
        DATA_MAP_SI_PREFIXES.put(10_123_456_798L, "10.12 GB");
        DATA_MAP_SI_PREFIXES.put(1_777_777_777_777_777_777L, "1.78 EB");
    }
}
```

## Basic

```java
import java.text.DecimalFormat;
import java.util.Map;
import java.util.function.Function;

import static lsieun.number.byt3.HumanReadableData.DATA_MAP_BINARY_PREFIXES;
import static lsieun.number.byt3.HumanReadableData.DATA_MAP_SI_PREFIXES;
import static lsieun.number.byt3.HumanReadableConst.*;

public class HumanReadableByteSize {
    private static final DecimalFormat DEC_FORMAT = new DecimalFormat("#.##");

    private static String formatSize(long size, long divider, String unitName) {
        return DEC_FORMAT.format((double) size / divider) + " " + unitName;
    }

    public static String toHumanReadableBinaryPrefixes(long size) {
        if (size < 0) {
            throw new IllegalArgumentException("Invalid file size: " + size);
        }
        if (size >= EiB) {
            return formatSize(size, EiB, "EiB");
        }
        if (size >= PiB) {
            return formatSize(size, PiB, "PiB");
        }
        if (size >= TiB) {
            return formatSize(size, TiB, "TiB");
        }
        if (size >= GiB) {
            return formatSize(size, GiB, "GiB");
        }
        if (size >= MiB) {
            return formatSize(size, MiB, "MiB");
        }
        if (size >= KiB) {
            return formatSize(size, KiB, "KiB");
        }
        return formatSize(size, BYTE, "Bytes");
    }

    public static String toHumanReadableSIPrefixes(long size) {
        if (size < 0) {
            throw new IllegalArgumentException("Invalid file size: " + size);
        }
        if (size >= EB) {
            return formatSize(size, EB, "EB");
        }
        if (size >= PB) {
            return formatSize(size, PB, "PB");
        }
        if (size >= TB) {
            return formatSize(size, TB, "TB");
        }
        if (size >= GB) {
            return formatSize(size, GB, "GB");
        }
        if (size >= MB) {
            return formatSize(size, MB, "MB");
        }
        if (size >= KB) {
            return formatSize(size, KB, "KB");
        }
        return formatSize(size, BYTE, "Bytes");
    }


    private static void process(Map<Long, String> map, Function<Long, String> func) {
        System.out.println(map);
        map.forEach(
                (in, expected) -> {
                    String value = func.apply(in);
                    String message = String.format("%s%n    %s%n    %s%n", in, expected, value);
                    System.out.println(message);
                }
        );
    }

    public static void main(String[] args) {
        process(DATA_MAP_BINARY_PREFIXES, HumanReadableByteSize::toHumanReadableBinaryPrefixes);
        process(DATA_MAP_SI_PREFIXES, HumanReadableByteSize::toHumanReadableSIPrefixes);
    }
}
```

## Using Enum

```java
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@SuppressWarnings("AlibabaEnumConstantsMustHaveComment")
enum SizeUnitBinaryPrefixes {
    Bytes(1L),
    KiB(Bytes.unitBase << 10),
    MiB(KiB.unitBase << 10),
    GiB(MiB.unitBase << 10),
    TiB(GiB.unitBase << 10),
    PiB(TiB.unitBase << 10),
    EiB(PiB.unitBase << 10);

    private final Long unitBase;

    SizeUnitBinaryPrefixes(Long unitBase) {
        this.unitBase = unitBase;
    }

    public Long getUnitBase() {
        return unitBase;
    }

    public static List<SizeUnitBinaryPrefixes> unitsInDescending() {
        List<SizeUnitBinaryPrefixes> list = Arrays.asList(values());
        Collections.reverse(list);
        return list;
    }

}
```

```java
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@SuppressWarnings("AlibabaEnumConstantsMustHaveComment")
enum SizeUnitSIPrefixes {
    Bytes(1L),
    KB(Bytes.unitBase * 1000),
    MB(KB.unitBase * 1000),
    GB(MB.unitBase * 1000),
    TB(GB.unitBase * 1000),
    PB(TB.unitBase * 1000),
    EB(PB.unitBase * 1000);

    private final Long unitBase;

    SizeUnitSIPrefixes(Long unitBase) {
        this.unitBase = unitBase;
    }

    public Long getUnitBase() {
        return unitBase;
    }

    public static List<SizeUnitSIPrefixes> unitsInDescending() {
        List<SizeUnitSIPrefixes> list = Arrays.asList(values());
        Collections.reverse(list);
        return list;
    }
}
```

```java
import java.text.DecimalFormat;
import java.util.List;

import static lsieun.number.byt3.HumanReadableData.DATA_MAP_BINARY_PREFIXES;

@SuppressWarnings("all")
public class HumanReadableByteSizeEnum {

    private static final DecimalFormat DEC_FORMAT = new DecimalFormat("#.##");

    private static String formatSize(long size, long divider, String unitName) {
        return DEC_FORMAT.format((double) size / divider) + " " + unitName;
    }

    public static String toHumanReadableWithEnum(long size) {
        List<SizeUnitBinaryPrefixes> units = SizeUnitBinaryPrefixes.unitsInDescending();
        if (size < 0) {
            throw new IllegalArgumentException("Invalid file size: " + size);
        }
        String result = null;
        for (SizeUnitBinaryPrefixes unit : units) {
            if (size >= unit.getUnitBase()) {
                result = formatSize(size, unit.getUnitBase(), unit.name());
                break;
            }
        }
        return result == null ? formatSize(size, SizeUnitBinaryPrefixes.Bytes.getUnitBase(), SizeUnitBinaryPrefixes.Bytes.name()) : result;
    }

    public static void main(String[] args) {
        DATA_MAP_BINARY_PREFIXES.forEach(
                (in, expected) -> {
                    String value = toHumanReadableWithEnum(in);
                    String message = String.format("%s%n    %s%n    %s%n", in, expected, value);
                    System.out.println(message);
                }
        );
    }
}
```

## Using Long

```java
import java.text.DecimalFormat;

public class HumanReadableByteSizeLong {
    private static final DecimalFormat DEC_FORMAT = new DecimalFormat("#.##");

    private static String formatSize(long size, long divider, String unitName) {
        return DEC_FORMAT.format((double) size / divider) + " " + unitName;
    }

    public static String toHumanReadableByNumOfLeadingZeros(long size) {
        if (size < 0) {
            throw new IllegalArgumentException("Invalid file size: " + size);
        }
        if (size < 1024) {
            return size + " Bytes";
        }
        int unitIdx = (63 - Long.numberOfLeadingZeros(size)) / 10;
        return formatSize(size, 1L << (unitIdx * 10), " KMGTPE".charAt(unitIdx) + "iB");
    }

    public static void main(String[] args) {
        DATA_MAP_BINARY_PREFIXES.forEach(
                (in, expected) -> {
                    String value = toHumanReadableByNumOfLeadingZeros(in);
                    String message = String.format("%s%n    %s%n    %s%n", in, expected, value);
                    System.out.println(message);
                }
        );
    }

    private static void test() {
        long[] array = {
                BYTE, KiB, MiB, GiB, TiB, PiB, EiB
        };
        for (long item : array) {
            int num = Long.numberOfLeadingZeros(item);
            String message = String.format("%s : %s", item, num);
            System.out.println(message);
        }
    }
}
```

```text
0
    0 Bytes
    0 Bytes

1024
    1 KiB
    1 KiB

1777777777777777777
    1.54 EiB
    1.54 EiB

12345
    12.06 KiB
    12.06 KiB

10123456
    9.65 MiB
    9.65 MiB

10123456798
    9.43 GiB
    9.43 GiB

1023
    1023 Bytes
    1023 Bytes
```

## Using Apache Commons IO

```xml
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.11.0</version>
</dependency>
```

```java
import org.apache.commons.io.FileUtils;

public class HumanReadableByteSizeApache {
    public static void main(String[] args) {
        DATA_MAP_BINARY_PREFIXES.forEach(
                (in, expected) -> {
                    String value = FileUtils.byteCountToDisplaySize(in);
                    String message = String.format("%s%n    %s%n    %s%n", in, expected, value);
                    System.out.println(message);
                }
        );
    }
}
```

```text
0
    0 Bytes
    0 bytes

1024
    1 KiB
    1 KB

1777777777777777777
    1.54 EiB
    1 EB              // 这里不一致

12345
    12.06 KiB
    12 KB              // 这里不一致

10123456
    9.65 MiB
    9 MB              // 这里不一致

10123456798
    9.43 GiB
    9 GB              // 这里不一致

1023
    1023 Bytes
    1023 bytes
```

## Reference

- [Convert Byte Size Into a Human-Readable Format in Java](https://www.baeldung.com/java-human-readable-byte-size)
