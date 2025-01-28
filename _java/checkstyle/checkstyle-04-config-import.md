---
title: "Checkstyle配置：import"
sequence: "104"
---

## Import

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <!-- Import check -->
        <module name="AvoidStarImport"/>
        <module name="IllegalImport"/>
        <module name="RedundantImport">
            <!-- Checks for redundant import statements. -->
            <property name="severity" value="error"/>
        </module>
        <module name="UnusedImports"/>
        <module name="ImportOrder">
            <!-- Checks for out of order import statements. -->
            <property name="severity" value="warning"/>
            <property name="groups" value="com,org,net,java,javax"/>
            <!-- This ensures that static imports go first. -->
            <property name="option" value="top"/>
            <property name="tokens" value="STATIC_IMPORT, IMPORT"/>
        </module>
    </module>
</module>
```
