---
title: "调用方法"
sequence: "301"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 细微的差异

在本文当中，主要是介绍一下 `.java` 文件和 `.class` 文件中方法调用的差异。

在 `.java` 文件中，一般的方法由三部分组成，其书写步骤如下：

- 第一步，写对象的变量名
- 第二步，写方法的名字
- 第三步，写方法的参数

![在 Java 文件中方法的调用顺序](/assets/images/java/asm/method-invoke-in-java-file.png)

在 `.class` 文件中，一般方法也是由三部分组成，但其指令执行顺序有所不同：

- 第一步，加载对象
- 第二步，加载方法的参数
- 第三步，对方法进行调用 （第一步和第二步，就是在准备数据，此时，万事俱备，只差“方法调用”了）

![在 Class 文件中方法的调用顺序](/assets/images/java/asm/method-invoke-in-class-file.png)

简单来说，两者的差异如下：

- Java 文件：instance --> method --> parameters
- Class 文件: instance --> parameters --> method

## 举例说明

假如有一个 `GoodChild` 类，其代码如下：

```java
public class GoodChild {
    private String name;
    private int age;

    public GoodChild(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void study(String subject, int minutes) {
        String str = String.format("%s who is %d years old has studied %s for %d minutes", name, age, subject, minutes);
        System.out.println(str);
    }

    @Override
    public String toString() {
        return String.format("GoodChild{name='%s', age=%d}", name, age);
    }
}
```

假如有一个 `HelloWorld` 类，其代码如下：

```java
public class HelloWorld {
    public void test() {
        GoodChild child = new GoodChild("Lucy", 8);
        child.study("Math", 30);
    }
}
```

假如有一个 `HelloWorldRun` 类，其代码如下：

```java
import sample.HelloWorld;

public class HelloWorldRun {
    public static void main(String[] args) throws Exception {
        HelloWorld instance = new HelloWorld();
        instance.test();
    }
}
```

对于上面的三个类，我们只关注其中的 `HelloWorld` 类。
通过 `javap -c sample.HelloWorld` 命令，我们可以查看其 `test()` 方法对应的 instructions 内容：

```text
$  javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
...
  public void test();
    Code:
       0: new           #2                  // class sample/GoodChild
       3: dup
       4: ldc           #3                  // String Lucy
       6: bipush        8
       8: invokespecial #4                  // Method sample/GoodChild."<init>":(Ljava/lang/String;I)V
      11: astore_1
      12: aload_1
      13: ldc           #5                  // String Math
      15: bipush        30
      17: invokevirtual #6                  // Method sample/GoodChild.study:(Ljava/lang/String;I)V
      20: return
}
```

从 Frame 的视角来看，local variable 和 operand stack 的变化：

```text
                               // {this} | {}
0000: new             #2       // {this} | {uninitialized_GoodChild}
0003: dup                      // {this} | {uninitialized_GoodChild, uninitialized_GoodChild}
0004: ldc             #3       // {this} | {uninitialized_GoodChild, uninitialized_GoodChild, String}
0006: bipush          8        // {this} | {uninitialized_GoodChild, uninitialized_GoodChild, String, int}
0008: invokespecial   #4       // {this} | {GoodChild}
0011: astore_1                 // {this, GoodChild} | {}
0012: aload_1                  // {this, GoodChild} | {GoodChild}
0013: ldc             #5       // {this, GoodChild} | {GoodChild, String}
0015: bipush          30       // {this, GoodChild} | {GoodChild, String, int}
0017: invokevirtual   #6       // {this, GoodChild} | {}
0020: return                   // {} | {}
```

