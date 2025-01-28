---
title: "BOM"
sequence: "104"
---

[UP](/maven-index.html)


## Spring Data

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.data</groupId>
            <artifactId>spring-data-bom</artifactId>
            <version>${calver.major.minor}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.data</groupId>
        <artifactId>spring-data-commons</artifactId>
    </dependency>
</dependencies>
```

## Jackson BOM

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.fasterxml.jackson</groupId>
            <artifactId>jackson-bom</artifactId>
            <version>2.14.2</version>
            <scope>import</scope>
            <type>pom</type>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## Reference

- [Using Maven's Bill of Materials (BOM)](https://reflectoring.io/maven-bom/)
- [Spring Data BOM](https://github.com/spring-projects/spring-data-bom)
- [Jackson BOM](https://github.com/FasterXML/jackson-bom)
