---
title: "String Pool"
sequence: "102"
---

## String 基本特性

- 修饰符：
  - String 被声明为 final 的，不可被继承
- 接口
  - `String` 实现了 `Serializable` 接口：表示字符串是支持序列化的。
  - `String` 实现了 `Comparable` 接口：表示 String 可以比较大小
- 实现
  - 在 JDK8 及以前版本中，`String` 内部定义了 `final char value[]` 用于存储字符串数据。
  - 在 JDK9 之后版本中，`String` 内部改为 `byte[]`。

### 存储变化

Java 8 版本：

```java
public final class String implements java.io.Serializable, Comparable<String>, CharSequence {
    private final char[] value;
}
```

Java 11 版本：

```java
public final class String implements java.io.Serializable, Comparable<String>, CharSequence {
    private final byte[] value;
    /**
     * The identifier of the encoding used to encode the bytes in
     * {@code value}. The supported values in this implementation are
     *
     * LATIN1
     * UTF16
     */
    private final byte coder;
}
```

为什么 JDK9 改变了 `String` 的结构

- [JEP 254: Compact Strings](http://openjdk.java.net/jeps/254)

**Motivation**

The current implementation of the `String` class stores characters in a `char` array,
using two bytes (sixteen bits) for each character.
Data gathered from many different applications indicates that **strings are a major component of heap usage** and, moreover,
that **most String objects contain only Latin-1 characters**.
Such characters require only one byte of storage,
hence **half of the space in the internal char arrays of such String objects is going unused**.

**Description**

We propose to change the internal representation of the `String` class from **a `UTF-16` char array** to
**a byte array** plus **an encoding-flag field**.
The new `String` class will store characters encoded either as ISO-8859-1/**Latin-1** (one byte per character),
or as **UTF-16** (two bytes per character), based upon the contents of the string.
The encoding flag will indicate which encoding is used.

```java
public final class String implements java.io.Serializable, Comparable<String>, CharSequence {
    private final byte[] value;
    /**
     * The identifier of the encoding used to encode the bytes in
     * {@code value}. The supported values in this implementation are
     *
     * LATIN1
     * UTF16
     */
    private final byte coder;
}
```

String-related classes such as `AbstractStringBuilder`, `StringBuilder`, and `StringBuffer`
will be updated to use the same representation, as will the HotSpot VM's intrinsic string operations.

> 涉及到相关类

```java
abstract class AbstractStringBuilder implements Appendable, CharSequence {
    /**
     * The value is used for character storage.
     */
    byte[] value;

    /**
     * The id of the encoding used to encode the bytes in {@code value}.
     */
    byte coder;
}
```

This is purely an implementation change, with no changes to existing public interfaces.
There are no plans to add any new public APIs or other interfaces.

> 只是具体 implementation 的修改，不会影响 existing public interfaces

The prototyping work done to date confirms the expected reduction in memory footprint,
substantial reductions of GC activity, and minor performance regressions in some corner cases.

> “目前工作”已经证实：这么做，可以减少 memory footprint，可以减少 GC，可以提升 minor performance

```java
public class HelloWorld {
    public static void main(String[] args) {
        String str = "ABC-abc";
        System.out.println(str);
    }
}
```

![](/assets/images/intellij/string-value-coder-abc.png)

```java
public class HelloWorld {
    public static void main(String[] args) {
        String str = "张三 - 李四";
        System.out.println(str);
    }
}
```

![](/assets/images/intellij/string-value-coder-chinese-character.png)

### 不可变性

String：代表不可变的字符序列。简称：不可变性。

- 当对字符串重新赋值时，需要重写指定内存区域赋值，不能使用原有的 value 进行赋值。
- 当对现有的字符串进行连接操作时，也需要重新指定内存区域赋值，不能使用原有的 value 进行赋值。
- 当调用 String 的 replace()方法修改指定字符或字符串时，也需要重新指定内存区域赋值，不能使用原有的 value 进行赋值。

通过字面量的方式（区别于 new）给一个字符串赋值，此时的字符串值声明在字符串常量池中。

```java
public class StringExer {
    String str = new String("good");
    char[] ch = {'t', 'e', 's', 't'};

    public void change(String str, char ch[]) {
        str = "test ok";
        ch[0] = 'b';
    }

    public static void main(String[] args) {
        StringExer ex = new StringExer();
        ex.change(ex.str, ex.ch);
        System.out.println(ex.str);//good
        System.out.println(ex.ch);//best
    }

}
```

### String 的底层结构

字符串常量池是不会存储相同内容的字符串的

- String 的 String Pool（字符串常量池）是一个固定大小的 `Hashtable`，默认值大小长度是 1009。
  如果放进 String Pool 的 String 非常多，就会造成 Hash 冲突严重，从而导致链表会很长，
  而链表长了后直接会造成的影响就是当调用 `String.intern()` 方法时性能会大幅下降。
- 使用 `-XX:StringTablesize` 可设置 `StringTable` 的长度

不同 JDK 版本中，StringTable 的长度：

- 在 JDK6 中 StringTable 是固定的，就是 1009 的长度，所以如果常量池中的字符串过多就会导致效率下降很快，StringTablesize 设置没有要求
- 在 JDK7 中，StringTable 的长度默认值是 60013，StringTablesize 设置没有要求
- 在 JDK8 中，StringTable 的长度默认值是 60013，StringTable 可以设置的最小值为 1009

```text
jinfo -flag StringTableSize <pid>
-XX:StringTableSize=60013
```

在 JDK 6 的版本中，可以修改 `StringTableSize` 的值。

在 JDK 8 版本中，遇到错误：

```text
java -XX:StringTableSize=10 sample.HelloWorld
uintx StringTableSize=10 is outside the allowed range [ 128 ... 16777216 ]
Improperly specified VM option 'StringTableSize=10'
Error: Could not create the Java Virtual Machine.
Error: A fatal exception has occurred. Program will exit.
```

```text
java -XX:StringTableSize=128 sample.HelloWorld
```

```text
jinfo -flag StringTableSize <pid>
-XX:StringTableSize=128
```

测试不同 StringTable 长度下，程序的性能

```java
/**
 * 产生 10 万个长度不超过 10 的字符串，包含 a-z,A-Z
 */
public class GenerateString {
    public static void main(String[] args) throws IOException {
        FileWriter fw =  new FileWriter("words.txt");

        for (int i = 0; i < 100000; i++) {
            //1 - 10
           int length = (int)(Math.random() * (10 - 1 + 1) + 1);
            fw.write(getString(length) + "\n");
        }

        fw.close();
    }

    public static String getString(int length){
        String str = "";
        for (int i = 0; i < length; i++) {
            //65 - 90, 97-122
            int num = (int)(Math.random() * (90 - 65 + 1) + 65) + (int)(Math.random() * 2) * 32;
            str += (char)num;
        }
        return str;
    }
}
```

```java
public class StringTest2 {
    public static void main(String[] args) {

        BufferedReader br = null;
        try {
            br = new BufferedReader(new FileReader("words.txt"));
            long start = System.currentTimeMillis();
            String data;
            while((data = br.readLine()) != null){
                data.intern(); //如果字符串常量池中没有对应 data 的字符串的话，则在常量池中生成
            }

            long end = System.currentTimeMillis();

            System.out.println("花费的时间为：" + (end - start));//1009:143ms  100009:47ms
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if(br != null){
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }

            }
        }
    }
}
```

- `-XX:StringTableSize=1009`：程序耗时 143ms
- `-XX:StringTableSize=100009`：程序耗时 47ms

https://www.bilibili.com/video/BV1PJ411n7xZ?p=120

## String 的内存分配

常量池就类似一个 Java 系统级别提供的缓存。8 种基本数据类型的常量池都是系统协调的，String 类型的常量池比较特殊。它的主要使用方法有两种。

- 直接使用双引号声明出来的 String 对象会直接存储在常量池中。比如：String info="atguigu.com";
- 如果不是用双引号声明的 String 对象，可以使用 String 提供的 intern()方法。

String Pool 存放位置的变化

- Java 6 及以前，字符串常量池存放在**永久代**
- Java 7 中 Oracle 的工程师对字符串池的逻辑做了很大的改变，即将字符串常量池的位置调整到**Java 堆**内
  - 所有的字符串都保存在堆（Heap）中，和其他普通对象一样，这样可以让你在进行调优应用时仅需要调整堆大小就可以了。
  - 字符串常量池概念原本使用得比较多，但是这个改动使得我们有足够的理由让我们重新考虑在 Java 7 中使用 String.intern()。
- Java8 元空间，字符串常量在堆

StringTable 为什么要调整？

- [Java SE 7 Features and Enhancements](https://www.oracle.com/java/technologies/javase/jdk7-relnotes.html#jdk7changes)

Area: HotSpot

Synopsis: In JDK 7, interned strings are **no longer** allocated in the **permanent generation** of the Java heap,
but are instead allocated in the main part of the **Java heap** (known as the young and old generations),
along with the other objects created by the application.
This change will result in more data residing in the main Java heap,
and less data in the permanent generation, and thus may require heap sizes to be adjusted.
Most applications will see only relatively small differences in heap usage due to this change,
but **larger applications that load many classes or make heavy use of the `String.intern()` method**
will see more significant differences.

RFE: 6962931

```java
/**
 * jdk6 中：
 * -XX:PermSize=6m -XX:MaxPermSize=6m -Xms6m -Xmx6m
 *
 * jdk8 中：
 * -XX:MetaspaceSize=6m -XX:MaxMetaspaceSize=6m -Xms6m -Xmx6m
 */
public class StringTest3 {
    public static void main(String[] args) {
        //使用 Set 保持着常量池引用，避免 full gc 回收常量池行为
        Set<String> set = new HashSet<String>();
        //在 short 可以取值的范围内足以让 6MB 的 PermSize 或 heap 产生 OOM 了。
        short i = 0;
        while(true){
            set.add(String.valueOf(i++).intern());
        }
    }
}
```

https://www.bilibili.com/video/BV1PJ411n7xZ?p=121

## String 的基本操作

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println();//2060
        System.out.println("1");//2061
        System.out.println("2");
        System.out.println("3");
        System.out.println("4");
        System.out.println("5");
        System.out.println("6");
        System.out.println("7");
        System.out.println("8");
        System.out.println("9");
        System.out.println("10");//2070

        //如下的字符串"1" 到 "10"不会再次加载
        System.out.println();   // 2071
        System.out.println("1");// 2071
        System.out.println("2");// 2071
        System.out.println("3");
        System.out.println("4");
        System.out.println("5");
        System.out.println("6");
        System.out.println("7");
        System.out.println("8");
        System.out.println("9");
        System.out.println("10");// 2071

        System.out.println();// 2071
    }
}
```

![](/assets/images/intellij/idea-debug-memory-string.png)

## 字符串拼接操作

- 常量与常量的拼接结果在常量池，原理是编译期优化
- 常量池中不会存在相同内容的变量
- 拼接前后，只要其中有一个是变量，结果就在堆中。变量拼接的原理是 StringBuilder
- 如果拼接的结果，再次调用 intern()方法，根据该字符串是否在常量池中存在，分为：
  - 如果存在，则返回字符串在常量池中的地址
  - 如果字符串常量池中不存在该字符串，则在常量池中创建一份，并返回此对象的地址

常量与常量的拼接结果在常量池，原理是编译期优化：

```java
public class HelloWorld {
    public static void main(String[] args) {
        String s1 = "a" + "b" + "c";//编译期优化：等同于"abc"
        String s2 = "abc"; //"abc"一定是放在字符串常量池中，将此地址赋给 s2
        /*
         * 最终.java 编译成.class,再执行.class
         * String s1 = "abc";
         * String s2 = "abc"
         */
        System.out.println(s1 == s2); //true
        System.out.println(s1.equals(s2)); //true
    }
}
```

拼接前后，只要其中有一个是变量，结果就在堆中。变量拼接的原理是 StringBuilder：

```java
public class HelloWorld {
    public static void main(String[] args) {
        String s1 = "javaEE";
        String s2 = "hadoop";

        String s3 = "javaEEhadoop";
        String s4 = "javaEE" + "hadoop";//编译期优化
        //如果拼接符号的前后出现了变量，则相当于在堆空间中 new String()，具体的内容为拼接的结果：javaEEhadoop
        String s5 = s1 + "hadoop";
        String s6 = "javaEE" + s2;
        String s7 = s1 + s2;

        System.out.println(s3 == s4);//true
        System.out.println(s3 == s5);//false
        System.out.println(s3 == s6);//false
        System.out.println(s3 == s7);//false
        System.out.println(s5 == s6);//false
        System.out.println(s5 == s7);//false
        System.out.println(s6 == s7);//false
        //intern():判断字符串常量池中是否存在 javaEEhadoop 值，如果存在，则返回常量池中 javaEEhadoop 的地址；
        //如果字符串常量池中不存在 javaEEhadoop，则在常量池中加载一份 javaEEhadoop，并返回次对象的地址。
        String s8 = s6.intern();
        System.out.println(s3 == s8);//true
    }
}
```

字符串拼接的底层细节：

```java
public class HelloWorld {
    public static void main(String[] args) {
        String s1 = "a";
        String s2 = "b";
        String s3 = "ab";
        /*
        如下的 s1 + s2 的执行细节：(变量 s 是我临时定义的）
        ① StringBuilder s = new StringBuilder();
        ② s.append("a")
        ③ s.append("b")
        ④ s.toString()  --> 约等于 new String("ab")，但不等价
    
        补充：在 jdk5.0 之后使用的是 StringBuilder,在 jdk5.0 之前使用的是 StringBuffer
         */
        String s4 = s1 + s2;//
        System.out.println(s3 == s4);//false
    }
}
```

```java
/*
    1. 字符串拼接操作不一定使用的是 StringBuilder!
       如果拼接符号左右两边都是字符串常量或常量引用，则仍然使用编译期优化，即非 StringBuilder 的方式。
    2. 针对于 final 修饰类、方法、基本数据类型、引用数据类型的量的结构时，能使用上 final 的时候建议使用上。
     */
public class HelloWorld {
    public static void main(String[] args) {
        final String s1 = "a";
        final String s2 = "b";
        String s3 = "ab";
        String s4 = s1 + s2;
        System.out.println(s3 == s4);//true
    }
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        String s1 = "HelloWorld";
        String s2 = "Hello";
        String s3 = s2 + "World";
        System.out.println(s1 == s3); // false

        final String s4 = "Hello";
        String s5 = s4 + "World";
        System.out.println(s1 == s5); // true
    }
}
```

拼接操作与 append 操作的效率对比

```text
    @Test
    public void test6(){

        long start = System.currentTimeMillis();

//        method1(100000);//4014
        method2(100000);//7

        long end = System.currentTimeMillis();

        System.out.println("花费的时间为：" + (end - start));
    }

    public void method1(int highLevel){
        String src = "";
        for(int i = 0;i < highLevel;i++){
            src = src + "a";//每次循环都会创建一个 StringBuilder、String
        }
//        System.out.println(src);

    }

    public void method2(int highLevel){
        //只需要创建一个 StringBuilder
        StringBuilder src = new StringBuilder();
        for (int i = 0; i < highLevel; i++) {
            src.append("a");
        }
//        System.out.println(src);
    }
```

体会执行效率：通过 StringBuilder 的 append()的方式添加字符串的效率要远高于使用 String 的字符串拼接方式！

原因：

- StringBuilder 的 append()的方式：
  - 自始至终中只创建过一个 StringBuilder 的对象
- 使用 String 的字符串拼接方式：
  - 创建过多个 StringBuilder 和 String（调的 toString 方法）的对象，内存占用更大；
  - 如果进行 GC，需要花费额外的时间（在拼接的过程中产生的一些中间字符串可能永远也用不到，会产生大量垃圾字符串）。

改进的空间：

- 在实际开发中，如果基本确定要前前后后添加的字符串长度不高于某个限定值 highLevel 的情况下，建议使用构造器实例化：
- StringBuilder s = new StringBuilder(highLevel); //new char[highLevel]
- 这样可以避免频繁扩容

## intern() 的使用

`intern()` 是一个 `native` 方法：

```java
public final class String implements java.io.Serializable, Comparable<String>, CharSequence {
     /**
     * Returns a canonical representation for the string object.
     * <p>
     * A pool of strings, initially empty, is maintained privately by the
     * class {@code String}.
     * <p>
     * When the intern method is invoked, if the pool already contains a
     * string equal to this {@code String} object as determined by
     * the {@link #equals(Object)} method, then the string from the pool is
     * returned. Otherwise, this {@code String} object is added to the
     * pool and a reference to this {@code String} object is returned.
     * <p>
     * It follows that for any two strings {@code s} and {@code t},
     * {@code s.intern() == t.intern()} is {@code true}
     * if and only if {@code s.equals(t)} is {@code true}.
     * <p>
     * All literal strings and string-valued constant expressions are
     * interned. String literals are defined in section 3.10.5 of the
     * <cite>The Java&trade; Language Specification</cite>.
     *
     * @return  a string that has the same contents as this string, but is
     *          guaranteed to be from a pool of unique strings.
     * @jls 3.10.5 String Literals
     */
    public native String intern(); 
}
```

intern 是一个 native 方法，调用的是底层 C 的方法

字符串常量池池最初是空的，由 String 类私有地维护。
在调用 intern 方法时，如果池中已经包含了由 equals(object)方法确定的与该字符串内容相等的字符串，则返回池中的字符串地址。
否则，该字符串对象将被添加到池中，并返回对该字符串对象的地址。（这是源码里注释的大概翻译）

如果不是用双引号声明的 String 对象，可以使用 String 提供的 intern 方法：intern 方法会从字符串常量池中查询当前字符串是否存在，若不存在就会将当前字符串放入常量池中。比如：

```text
String myInfo = new string("I love atguigu").intern();
```

也就是说，如果在任意字符串上调用 String.intern 方法，那么其返回结果所指向的那个类实例，必须和直接以常量形式出现的字符串实例完全相同。因此，下列表达式的值必定是 true

```text
("a"+"b"+"c").intern()=="abc"
```

通俗点讲，Interned String 就是确保字符串在内存里只有一份拷贝，这样可以节约内存空间，加快字符串操作任务的执行速度。注意，这个值会被存放在字符串内部池（String Intern Pool）

new String(“ab”)会创建几个对象？

```java
/**
 * 题目：
 * new String("ab")会创建几个对象？看字节码，就知道是两个。
 *     一个对象是：new 关键字在堆空间创建的
 *     另一个对象是：字符串常量池中的对象"ab"。 字节码指令：ldc
 *
 */
public class StringNewTest {
    public static void main(String[] args) {
        String str = new String("ab");
    }
}
```

new String(“a”) + new String(“b”) 会创建几个对象？

```java
/**
 * 思考：
 * new String("a") + new String("b")呢？
 *  对象 1：new StringBuilder()
 *  对象 2： new String("a")
 *  对象 3： 常量池中的"a"
 *  对象 4： new String("b")
 *  对象 5： 常量池中的"b"
 *
 *  深入剖析： StringBuilder 的 toString():
 *      对象 6 ：new String("ab")
 *       强调一下，toString()的调用，在字符串常量池中，没有生成"ab"
 *
 */
public class StringNewTest {
    public static void main(String[] args) {

        String str = new String("a") + new String("b");
    }
}
```

有点难的面试题

```java
/**
 * 如何保证变量 s 指向的是字符串常量池中的数据呢？
 * 有两种方式：
 * 方式一： String s = "shkstart";//字面量定义的方式
 * 方式二： 调用 intern()
 *         String s = new String("shkstart").intern();
 *         String s = new StringBuilder("shkstart").toString().intern();
 *
 */
public class HelloWorld {
    public static void main(String[] args) {
        String s = new String("1");
        s.intern();//调用此方法之前，字符串常量池中已经存在了"1"
        String s2 = "1";
        System.out.println(s == s2);//jdk6：false   jdk7/8：false

        /*
         1、s3 变量记录的地址为：new String("11")
         2、经过上面的分析，我们已经知道执行完 pos_1 的代码，在堆中有了一个 new String("11")
         这样的 String 对象。但是在字符串常量池中没有"11"
         3、接着执行 s3.intern()，在字符串常量池中生成"11"
           3-1、在 JDK6 的版本中，字符串常量池还在永久代，所以直接在永久代生成"11",也就有了新的地址
           3-2、而在 JDK7 的后续版本中，字符串常量池被移动到了堆中，此时堆里已经有 new String（"11"）了
           出于节省空间的目的，直接将堆中的那个字符串的引用地址储存在字符串常量池中。没错，字符串常量池
           中存的是 new String（"11"）在堆中的地址
         4、所以在 JDK7 后续版本中，s3 和 s4 指向的完全是同一个地址。
         */
        String s3 = new String("1") + new String("1");//pos_1
        System.out.println(System.identityHashCode(s3)); // 1798286609
        s3.intern();
        System.out.println(System.identityHashCode(s3)); // 1798286609

        String s4 = "11";//s4 变量记录的地址：使用的是上一行代码代码执行时，在常量池中生成的"11"的地址
        System.out.println(System.identityHashCode(s4)); // 1798286609
        System.out.println(s3 == s4);//jdk6：false  jdk7/8：true
    }
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        //执行完下一行代码以后，字符串常量池中，是否存在"11"呢？答案：不存在！！
        String s3 = new String("1") + new String("1");//new String("11")
        //在字符串常量池中生成对象"11"，代码顺序换一下，实打实的在字符串常量池里有一个"11"对象
        String s4 = "11";
        String s5 = s3.intern();

        // s3 是堆中的 "ab" ，s4 是字符串常量池中的 "ab"
        System.out.println(s3 == s4);//false

        // s5 是从字符串常量池中取回来的引用，当然和 s4 相等
        System.out.println(s5 == s4);//true
    }
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        String s3 = new String("1") + new String("1");//new String("11")

        String s5 = s3.intern();
        String s4 = "11";

        System.out.println(s3 == s4);//true

        // s5 是从字符串常量池中取回来的引用，当然和 s4 相等
        System.out.println(s5 == s4);//true
    }
}
```

总结 `String` 的 `intern()` 的使用：

- JDK 1.6 中，将这个字符串对象尝试放入 String Pool
  - 如果 String Pool 中有，则并不会放入，返回已有的 String Pool 中对象的地址
  - 如果 String Pool 中没有，会把**对象复制一份**，放入串池，并返回串池中的对象地址
- JDK 1.7 之后，将这个字符串对象尝试放入 String Pool
  - 如果 String Pool 中有，则并不会放入，返回已有的 String Pool 中对象的地址
  - 如果 String Pool 中没有，则会把**对象的引用地址复制一份**，放入串池，并返回 String Pool 中的引用地址

intern() 方法的练习

练习 1

```java
public class HelloWorld {
    public static void main(String[] args) {
        String s = new String("a") + new String("b");//new String("ab")
        //在上一行代码执行完以后，字符串常量池中并没有"ab"
		/*
		1、jdk6 中：在字符串常量池（此时在永久代）中创建一个字符串"ab"
        2、jdk8 中：字符串常量池（此时在堆中）中没有创建字符串"ab",而是创建一个引用，指向 new String("ab")，		  将此引用返回
        3、详解看上面
		*/
        String s2 = s.intern();

        System.out.println(s2 == "ab");//jdk6:true  jdk8:true
        System.out.println(s == "ab");//jdk6:false  jdk8:true
    }
}
```

练习 2

```java
public class HelloWorld {
    public static void main(String[] args) {
        //加一行这个
        String x = "ab";
        String s = new String("a") + new String("b");//new String("ab")

        String s2 = s.intern();

        System.out.println(s2 == "ab");//jdk6:true  jdk8:true
        System.out.println(s == "ab");//jdk6:false  jdk8:false
    }
}
```

```java
public class HelloWorld {
    public static void main(String[] args) {
        String s1 = new String("ab");//执行完以后，会在字符串常量池中会生成"ab"

        s1.intern();
        String s2 = "ab";
        System.out.println(s1 == s2);//false
    }
}
```

```java
public class HelloWorld {
    // 对象内存地址可以使用 System.identityHashCode(object)方法获取
    public static void main(String[] args) {
        String s1 = new String("a") + new String("b");//执行完以后，不会在字符串常量池中会生成"ab"
        System.out.println(System.identityHashCode(s1));
        s1.intern();
        System.out.println(System.identityHashCode(s1));
        String s2 = "ab";
        System.out.println(System.identityHashCode(s2));
        System.out.println(s1 == s2); // true
    }
}
```

intern() 的效率测试（空间角度）

```java
/**
 * 使用 intern()测试执行效率：空间使用上
 *
 * 结论：对于程序中大量存在存在的字符串，尤其其中存在很多重复字符串时，使用 intern()可以节省内存空间。
 *
 */
public class HelloWorld {
    static final int MAX_COUNT = 1000 * 10000;
    static final String[] arr = new String[MAX_COUNT];

    public static void main(String[] args) {
        Integer[] data = new Integer[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

        long start = System.currentTimeMillis();
        for (int i = 0; i < MAX_COUNT; i++) {
//            arr[i] = new String(String.valueOf(data[i % data.length]));
            arr[i] = new String(String.valueOf(data[i % data.length])).intern();

        }
        long end = System.currentTimeMillis();
        System.out.println("花费的时间为：" + (end - start));

        try {
            Thread.sleep(1000000);
        }
        catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.gc();
    }
}
```

## String Table 的垃圾回收

```java
/**
 * String 的垃圾回收:
 * -Xms15m -Xmx15m -XX:+PrintStringTableStatistics -XX:+PrintGCDetails
 */
public class StringGCTest {
    public static void main(String[] args) {
        for (int j = 0; j < 100000; j++) {
            String.valueOf(j).intern();
        }
    }
}
```

## G1 中的 String 去重操作

- [JEP 192: String Deduplication in G1](http://openjdk.java.net/jeps/192)

命令行选项

- `UseStringDeduplication(bool)`：开启 String 去重，默认是不开启的，需要手动开启。
- `PrintStringDeduplicationStatistics(bool)`：打印详细的去重统计信息
- `stringDeduplicationAgeThreshold(uintx)`：达到这个年龄的 String 对象被认为是去重的候选对象

## Garbage Collection

Before Java 7, the JVM placed the **Java String Pool** in the **PermGen space**,
which has a fixed size — it can't be expanded at runtime and is not eligible for garbage collection.

The risk of interning Strings in the **PermGen** (instead of the Heap) is that we can get an **OutOfMemory error**
from the JVM if we intern too many Strings.

From Java 7 onwards, **the Java String Pool** is stored in the **Heap space**, which is garbage collected by the JVM.
The advantage of this approach is the reduced risk of OutOfMemory error
because unreferenced Strings will be removed from the pool, thereby releasing memory.

## Performance and Optimizations

In **Java 6**, the only optimization we can perform is increasing the **PermGen space**
during the program invocation with the `MaxPermSize` JVM option:

```text
-XX:MaxPermSize=1G
```

In **Java 7**, we have more detailed options to examine and expand/reduce the pool size.
Let's see the two options for viewing the pool size:

```text
-XX:+PrintFlagsFinal
```

```text
-XX:+PrintStringTableStatistics
```

If we want to increase the pool size in terms of buckets, we can use the `StringTableSize` JVM option:

```text
-XX:StringTableSize=4901
```

Prior to **Java 7u40**, the default pool size was `1009` buckets
but this value was subject to a few changes in more recent Java versions.
To be precise, the default pool size from **Java 7u40** until **Java 11** was `60013` and now it increased to `65536`.

**Note that increasing the pool size will consume more memory
but has the advantage of reducing the time required to insert the Strings into the table.**

## A Note About Java 9

Until **Java 8**, Strings were internally represented as an array of characters – `char[]`, encoded in UTF-16,
so that every character uses two bytes of memory.

With **Java 9** a new representation is provided, called **Compact Strings**.
This new format will choose the appropriate encoding between `char[]` and `byte[]` depending on the stored content.

Since the new String representation will use the `UTF-16` encoding only when necessary,
the amount of heap memory will be significantly lower, which in turn causes less Garbage Collector overhead on the JVM.

## Reference

- [Guide to Java String Pool](https://www.baeldung.com/java-string-pool)
