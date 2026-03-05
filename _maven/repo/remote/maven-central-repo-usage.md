---
title: "Maven 中央仓库"
sequence: "101"
---

## 网址

- [https://mvnrepository.com](https://mvnrepository.com)
- [https://central.sonatype.com](https://central.sonatype.com)

## 搜索技巧（基础）

在 [Maven Central Repository](https://mvnrepository.com/search) 上进行搜索时，以下是常用的参数及其含义，并附上相应的示例和完整的 URL 访问地址。

其中

- `%3A` 代表 `:`
- `+` 代表 ` `（空格）

### **Search Query (`q`)**
- **定义**：通过关键字搜索 Maven 项目或描述。
- **示例**：`logging`，`http`
- **URL 访问示例**：
    - **查找与 `http` 相关的库**：[https://mvnrepository.com/search?q=http](https://mvnrepository.com/search?q=http)

### **Sort By (`sort`)**
- **定义**：指定如何对搜索结果进行排序。
- **URL 访问示例**：
    - `https://mvnrepository.com/search?q=http&sort=newest`
    - `https://mvnrepository.com/search?q=http&sort=relevance`
    - `https://mvnrepository.com/search?q=http&sort=popular`

## 搜索技巧（简单）

### **Group ID (`g`)**

- **定义**：用于指定 Maven 项目的组织或分组标识符。
- **示例**：`org.apache.commons`，`com.google.guava`
- **URL 访问示例**：
    - **查找 `org.apache.commons` 组下的所有组件**：[https://mvnrepository.com/search?q=g%3Aorg.apache.commons](https://mvnrepository.com/search?q=g%3Aorg.apache.commons)

### **Artifact ID (`a`)**

- **定义**：指定 Maven 项目的模块或组件的标识符。
- **示例**：`commons-lang3`，`guava`
- **URL 访问示例**：
    - **查找 `commons-lang3` 模块**：[https://mvnrepository.com/search?q=a%3Acommons-lang3](https://mvnrepository.com/search?q=a%3Acommons-lang3)

### **Version (`v`)**

- **定义**：指定 Maven 项目的版本。
- **示例**：`3.12.0`，`30.0-jre`
- **URL 访问示例**：
    - **查找版本为 `4.0.0` 的 `guava` 库**：[https://mvnrepository.com/search?q=com.google.guava+guava+v%3A4.0.0](https://mvnrepository.com/search?q=com.google.guava+guava+v%3A4.0.0)


### **Packaging Type (`p`)**

- **定义**：指定 Maven 项目的打包类型（如 `jar`, `war`, `pom`）。
- **示例**：`jar`，`war`
- **URL 访问示例**：
    - **查找所有 `jar` 类型的库**：[https://mvnrepository.com/search?q=p%3Ajar](https://mvnrepository.com/search?q=p%3Ajar)
    - **查找 `spring-boot` 库的 `war` 打包类型版本**：[https://mvnrepository.com/search?q=org.springframework.boot+spring-boot+p%3Awar](https://mvnrepository.com/search?q=org.springframework.boot+spring-boot+p%3Awar)

### **Class (`c`)**

- **定义**：通过类名查找包含该类的 Maven 组件。
- **示例**：`org.apache.commons.lang3.StringUtils`
- **URL 访问示例**：
    - **查找包含类 `StringUtils` 的库**：[https://mvnrepository.com/search?q=c%3Aorg.apache.commons.lang3.StringUtils](https://mvnrepository.com/search?q=c%3Aorg.apache.commons.lang3.StringUtils)

---

