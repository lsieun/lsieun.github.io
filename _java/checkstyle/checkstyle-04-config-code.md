---
title: "Checkstyle配置：Code"
sequence: "104"
---

## 类

### 修饰符

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <!-- 每个关键字都有正确的出现顺序。
            比如 public static final XXX 是对一个常量的声明。
            如果使用 static public final 就是错误的
         -->
        <module name="ModifierOrder"/>
        <!-- 过滤冗余的关键字-->
        <module name="RedundantModifier"/>
    </module>
</module>
```

### 名字

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <!-- 命名检查 -->
        <!-- 包名的检查（只允许小写字母），默认^[a-z]+(\.[a-zA-Z_][a-zA-Z_0-9_]*)*$ -->
        <module name="PackageName">
            <property name="format" value="^[a-z]+(\.[a-z][a-z0-9]*)*$"/>
            <message key="name.invalidPattern" value="包名 ''{0}'' 要符合 ''{1}''格式."/>
        </module>
        <!-- Class或Interface名检查，默认：^[A-Z][a-zA-Z0-9]*$-->
        <module name="TypeName">
            <property name="severity" value="warning"/>
            <message key="name.invalidPattern" value="名称 ''{0}'' 要符合 ''{1}''格式."/>
        </module>
        <!-- 非static型变量的检查，默认：^[a-z][a-zA-Z0-9]*$ -->
        <module name="MemberName"/>
        <!-- 常量名的检查（只允许大写），默认：^[A-Z][A-Z0-9]*(_[A-Z0-9]+)*$ -->
        <module name="ConstantName"/>
        <!-- 仅仅是static型的变量（不包括static final型）的检查，默认：^[a-z][a-zA-Z0-9]*$ -->
        <module name="StaticVariableName"/>
        <!-- 方法名的检查，默认：^[a-z][a-zA-Z0-9]*$ -->
        <module name="MethodName"/>
        <!-- 方法的参数名，默认：^[a-z][a-zA-Z0-9]*$ -->
        <module name="ParameterName"/>
        <!-- 局部的非final型的变量，包括catch中的参数的检查，默认：^[a-z][a-zA-Z0-9]*$ -->
        <module name="LocalVariableName"/>
        <!-- 局部的final变量，包括catch中的参数的检查，默认：^[a-z][a-zA-Z0-9]*$ -->
        <module name="LocalFinalVariableName"/>
    </module>
</module>
```

```java
public class helloworld {
    private String Name;
    private static final int iconst_0 = 0;
    private static final int I__CONST__1 = 1;

    private static int StaticVariable;

    public void Test(int MyValue) {
        int Value = 0;
        final int FinalVariable = 10;
    }
}
```

## 方法

### 方法头

#### Parameter

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <module name="ParameterNumber">
            <property name="max" value="5"/>
            <property name="ignoreOverriddenMethods" value="true"/>
            <property name="tokens" value="METHOD_DEF"/>
        </module>
    </module>
</module>
```

```java
import java.util.Date;
import java.util.List;

public class MethodParameter {
    public void test(String name, int age, Date dob, Object obj, int[] array, List<String> list) {
        //
    }
}
```

#### Return

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <module name="ReturnCount">
            <property name="max" value="3"/>
        </module>
    </module>
</module>
```

```java
public class MethodReturn {
    public int test(int val) {
        if (val == 1) {
            return 2;
        }
        if (val == 2) {
            return 3;
        }
        if (val == 3) {
            return 5;
        }
        if (val == 4) {
            return 9;
        }
        return 0;
    }
}
```

### 方法体

#### Method Length

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <module name="MethodLength">
            <property name="tokens" value="METHOD_DEF"/>
            <property name="max" value="15"/>
        </module>
    </module>
</module>
```

```java
public class MethodLength {
    public void test() {
        System.out.println("Message001");
        System.out.println("Message002");
        System.out.println("Message003");
        System.out.println("Message004");
        System.out.println("Message005");
        System.out.println("Message006");
        System.out.println("Message007");
        System.out.println("Message008");
        System.out.println("Message009");
        System.out.println("Message010");
        System.out.println("Message011");
        System.out.println("Message012");
        System.out.println("Message013");
        System.out.println("Message014");
        System.out.println("Message015");
        System.out.println("Message016");
        System.out.println("Message017");
        System.out.println("Message018");
        System.out.println("Message019");
        System.out.println("Message020");
    }
}
```

#### 打印语句

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">

        <!-- System.out.print -->
        <module name="RegexpSinglelineJava">
            <!-- . matches any character, so we need to escape it and use \. to match dots. -->
            <property name="format" value="System\.out\.print"/>
            <property name="ignoreComments" value="false"/>
        </module>

    </module>
</module>
```

#### main方法

```xml
<!DOCTYPE module PUBLIC
        "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"
        "https://checkstyle.org/dtds/configuration_1_3.dtd">
<module name="Checker">
    <module name="TreeWalker">
        <!-- 除了正常的程序入口之外，所有的main方法都应该被删掉或注释掉 -->
        <module name="UncommentedMain">
            <property name="excludedClasses" value="^.*(Application|Test)$"/>
        </module>
    </module>
</module>
```
