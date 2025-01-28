---
title: "Checkstyle配置：注释"
sequence: "104"
---

## 文档注释

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <module name="JavadocType">
            <property name="authorFormat" value="\S"/>
            <property name="allowUnknownTags" value="false"/>
            <property name="allowMissingParamTags" value="false"/>
            <message key="javadoc.missing" value="类注释：缺少Javadoc注释。"/>
        </module>
    </module>
</module>
```

```java
/**
 * @author
 * @version abc
 * @date 10/09/2023
 * @unknownTag value // violation
 */
public class JavaDoc {

    /**
     * @param a first number
     * @return sum
     */
    public int add(int a, int b) {
        return a + b;
    }

}
```

## 单行注释

### 后面加空格

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <module name="TodoComment">
            <property name="id" value="commentStartWithSpace"/>
            <property name="format" value="^([^\s\/*])"/>
            <message key="todo.match" value="Comment text should start with space."/>
        </module>
    </module>
</module>
```

```java
//This is a Comment
public class CommentWithoutSpace {
}
```
