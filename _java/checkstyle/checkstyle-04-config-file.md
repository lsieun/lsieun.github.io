---
title: "Checkstyle配置：file"
sequence: "104"
---



## 开头和结尾

### 开头

File: `config/java.header`

```text
////////////////////////////////////////////////////////////////////
// checkstyle:
// Checks Java source code for adherence to a set of rules.
// Copyright (C) 2002  Oliver Burn
////////////////////////////////////////////////////////////////////
```

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="Header">
        <property name="headerFile" value="config/java.header"/>
        <property name="ignoreLines" value="2, 3, 4"/>
        <property name="fileExtensions" value="java"/>
    </module>
</module>
```

```java
////////////////////////////////////////////////////////////////////
// I Love Three Things in this world:
// The Sun for the day, the Moon for the night,
// And You Forever.
////////////////////////////////////////////////////////////////////

package lsieun.checkstyle.file;

public class Header {
}
```

### 空行结尾

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="NewlineAtEndOfFile"/>
</module>
```

## 数量

### 行数

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="FileLength">
        <property name="max" value="10"/>
    </module>
</module>
```

```java
public class FileLength {
    // 0
    // 1
    // 2
    // 3
    // 4
    // 5
    // 6
    // 7
    // 8
    // 9
    // 10
    // 11
    // 12
}
```

### 列数

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="LineLength">
        <property name="max" value="25"/>
    </module>
</module>
```

```java
public class LineLength {
    // 123456789012345678901234567890
}
```

## 检查 Tab 键

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <!-- 检查文件中是否含有'\t' -->
    <module name="FileTabCharacter"/>
</module>
```

```java
public class FileTab {
	// this is a tab
}
```
