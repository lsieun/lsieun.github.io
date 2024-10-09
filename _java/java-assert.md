---
title: "Java Assertions"
sequence: "103"
---



编写程序，难免会有 bug 出现；换句说，程序中有 bug 存在，作为开发人员，其中一个很重要的任务就是解决 bug。那么，应该采取什么样的态度来处理呢？或者是积极主动的态度，或者是消极被动的态度。使用 `assert` 关键字，就是一种积极主动解决 bug 的态度。

为什么使用 `assert` 关键字就是积极主动解决 bug 的态度呢？因为使用 `assert` 关键字，其实就是对程序某一部分数据的状态做出了一个假设：如果这个假设成立，那说明一切如你所料，诸事顺利；如果这个假设不成立，就会抛出 `java.lang.AssertionError`，导致程序停止，这样你就能很快的识别错误，并定位到它在什么位置，接着你就采取相应的措施解决它。

那么，什么是消极被动的态度呢？就是不去主动的预测 bug 会出现在哪儿，而是等程序的运行结果出错了，你再去分析到底是哪里出现了错误。

是否需要使用 `assert` 关键字，其实与我们的个人性格有关系：

- 如果你是未雨绸缪类型的人，事情发生之前，就会预估未来的形势，早早做出准备。
- 如果你是随遇而安类型的人，事情发生之前，何必忧虑未来的事情，活在当下就好。

You can program assertions to notify you of bugs where the bugs occur,
greatly reducing the amount of time you would otherwise spend debugging a failing program.

## Introduction

The Java `assert` keyword was introduced in Java 1.4, so it's been around for quite a while.

Java Assertions are implemented via the `assert` statement and `java.lang.AssertionError` class.

## How to Use Java Assertions

The assertion statement has two forms.

### First Form

The first, simpler form is:

```text
assert Expression1;
```

where `Expression1` is a `boolean` expression. When the system runs the assertion, it evaluates `Expression1` and if it is `false` throws an `AssertionError` with no detail message.

代码示例：

```java
package sample;

public class HelloWorld {
    public static void main(String[] args) {
        int x = -1;
        assert x > 0;
    }
}
```

运行结果：

```text
$ java -ea sample.HelloWorld
Exception in thread "main" java.lang.AssertionError
        at sample.HelloWorld.main(HelloWorld.java:6)
```

使用 `javap -c` 命令查看 `sample.HelloWorld` 类包含的 instructions 信息：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  static final boolean $assertionsDisabled;

  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: iconst_m1
       1: istore_1
       2: getstatic     #2                  // Field $assertionsDisabled:Z
       5: ifne          20
       8: iload_1
       9: ifgt          20
      12: new           #3                  // class java/lang/AssertionError
      15: dup
      16: invokespecial #4                  // Method java/lang/AssertionError."<init>":()V
      19: athrow
      20: return

  static {};
    Code:
       0: ldc           #5                  // class sample/HelloWorld
       2: invokevirtual #6                  // Method java/lang/Class.desiredAssertionStatus:()Z
       5: ifne          12
       8: iconst_1
       9: goto          13
      12: iconst_0
      13: putstatic     #2                  // Field $assertionsDisabled:Z
      16: return
}
```

### Second Form

The second form of the assertion statement is:

```text
assert Expression1 : Expression2;
```

where:

- `Expression1` is a `boolean` expression.
- `Expression2` is an expression that has a value. (It cannot be an invocation of a method that is declared `void`.) A useful expression is **a string literal** that describes the reason for failure.

代码示例：

```java
package sample;

public class HelloWorld {
    public static void main(String[] args) {
        int x = -1;
        assert x >= 0: "x < 0";
    }
}
```

运行结果：

```text
$ java -ea sample.HelloWorld
Exception in thread "main" java.lang.AssertionError: x < 0
        at sample.HelloWorld.main(HelloWorld.java:6)
```

使用 `javap -c` 命令查看 `sample.HelloWorld` 类包含的 instructions 信息：

```text
$ javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  static final boolean $assertionsDisabled;

  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: iconst_m1
       1: istore_1
       2: getstatic     #2                  // Field $assertionsDisabled:Z
       5: ifne          22
       8: iload_1
       9: ifge          22
      12: new           #3                  // class java/lang/AssertionError
      15: dup
      16: ldc           #4                  // String x < 0
      18: invokespecial #5                  // Method java/lang/AssertionError."<init>":(Ljava/lang/Object;)V
      21: athrow
      22: return

  static {};
    Code:
       0: ldc           #6                  // class sample/HelloWorld
       2: invokevirtual #7                  // Method java/lang/Class.desiredAssertionStatus:()Z
       5: ifne          12
       8: iconst_1
       9: goto          13
      12: iconst_0
      13: putstatic     #2                  // Field $assertionsDisabled:Z
      16: return
}
```

## Enabling and Disabling Java Assertions

**By default, assertions are disabled at runtime.**

Two command-line switches allow you to selectively enable or disable assertions.

- To enable assertions at various granularities, use the `-enableassertions`, or `-ea`, switch.
- To disable assertions at various granularities, use the `-disableassertions`, or `-da`, switch.

### switch's arguments

You specify the granularity with the arguments that you provide to the switch:

- **no arguments**: Enables or disables assertions in all classes except **system classes**.

```text
java -ea sample.HelloWorld
```

- `packageName...`: Enables or disables assertions in the named package and any subpackages.

```text
java -ea:lsieun.asm... sample.HelloWorld
```

- `...`: Enables or disables assertions in the unnamed package in the current working directory.

```text
java -ea:... sample.HelloWorld
```

- `className`: Enables or disables assertions in the named class

```text
java -ea:lsieun.asm.core.ClassCloneVisitor sample.HelloWorld
```

### user classes

For example, the following command runs a program, `BatTutor`, with assertions enabled in only package `com.wombat.fruitbat` and its subpackages:

```text
java -ea:com.wombat.fruitbat... BatTutor
```

If a single command line contains **multiple instances of these switches**, they are processed in order before loading any classes.
For example, the following command runs the `BatTutor` program with assertions enabled in package `com.wombat.fruitbat` but disabled in class `com.wombat.fruitbat.Brickbat`:

```text
java -ea:com.wombat.fruitbat... -da:com.wombat.fruitbat.Brickbat BatTutor
```

The above switches apply to all class loaders.
With **one exception**, they also apply to **system classes** (which do not have an explicit class loader).

**The exception** concerns the switches with **no arguments**, which (as indicated above) do not apply to **system classes**.
This behavior makes it easy to enable asserts in all classes except for **system classes**, which is commonly desirable.

### system classes

To enable assertions in **all system classes**, use a different switch: `-enablesystemassertions`, or `-esa`.
Similarly, to disable assertions in **system classes**, use `-disablesystemassertions`, or `-dsa`.

For example, the following command runs the `BatTutor` program with assertions enabled in **system classes**, as well as in the `com.wombat.fruitbat` package and its subpackages:

```text
java -esa -ea:com.wombat.fruitbat... BatTutor
```

### assertion status of a class

The **assertion status of a class** (enabled or disabled) is set at the time it is initialized, and does not change.
There is, however, one corner case that demands special treatment.
It is possible, though generally not desirable, to execute methods or constructors prior to initialization.
This can happen when a class hierarchy contains a circularity in its static initialization.

If an `assert` statement executes before its class is initialized,
the execution must behave as if assertions were enabled in the class.
This topic is discussed in detail in the assertions specification in the Java Language Specification.

## Handling an AssertionError

The class `AssertionError` extends `Error`, which itself extends `Throwable`. This means that `AssertionError` is an unchecked exception.

Therefore, methods that use assertions are not required to declare them, and further calling code should not try and catch them.

**`AssertionError`s are meant to indicate unrecoverable conditions in an application, so never try to handle them or attempt recovery.**

## 最佳实践：避免使用 Assertions 情况

There are also situations where you should not use them:

- Do not use assertions for **argument checking** in **public methods**.
- Do not use assertions to do any work that your application requires for **correct operation**.

### Argument checking

**Argument checking** is typically part of the published specifications (or contract) of a method,
and these specifications must be obeyed whether assertions are enabled or disabled.

对于 argument checking，不推荐使用 Java Assertions 原因有两个：

- 第一点，Java Assertions 未必是开启的状态，很难保证它一定会执行到。
- 第二点，assert statement 抛出的异常类型非常单一，表达能力有限。也就是说，如果 assert statement 失败，那么只能抛出 `AssertionError` 类型的异常。相比之下，如果抛出 an appropriate runtime exception，它就有许多选择的余地，例如 `IllegalArgumentException`、 `IndexOutOfBoundsException` 或 `NullPointerException` 等。

### Correct Operation

Because assertions may be disabled, programs must not assume that the boolean expression contained in an assertion will be evaluated.
Violating **this rule** has dire consequences.

For example, suppose you wanted to remove all of the `null` elements from a list names, and knew that the list contained one or more `null`s.
It would be wrong to do this:

```text
// Broken! - action is contained in assertion
assert names.remove(null);
```

The program would work fine when asserts were enabled, but would fail when they were disabled, as it would no longer remove the `null` elements from the list.
The correct idiom is to perform the action before the assertion and then assert that the action succeeded:

```text
// Fixed - action precedes assertion
boolean nullsRemoved = names.remove(null);
assert nullsRemoved;  // Runs whether or not asserts are enabled
```

**As a rule**, the expressions contained in assertions should be free of side effects:
**evaluating the expression should not affect any state that is visible after the evaluation is complete.**

**One exception to this rule** is that assertions can modify state that is used only from within other assertions.

```text
static {
  boolean assertsEnabled = false;
  assert assertsEnabled = true; // Intentional side effect!!!
  if (!assertsEnabled)
    throw new RuntimeException("Asserts must be enabled!!!");
} 
```

## 最佳实践：推荐使用 Assertions 情况

### Internal Invariants

#### if 语句

Before assertions were available, many programmers used comments to indicate their assumptions concerning a program's behavior.
For example, you might have written something like this to explain your assumption about an `else` clause in a multiway if-statement:

```text
if (i % 3 == 0) {
    ...
} else if (i % 3 == 1) {
    ...
} else { // We know (i % 3 == 2)
    ...
}
```

You should now **use an assertion whenever you would have written a comment that asserts an invariant**.
For example, you should rewrite the previous if-statement like this:

```text
if (i % 3 == 0) {
   ...
} else if (i % 3 == 1) {
    ...
} else {
    assert i % 3 == 2 : i;
    ...
}
```

Note, incidentally, that the assertion in the above example may fail if `i` is negative, as the `%` operator is not a true modulus operator, but computes the remainder, which may be negative.

#### switch 语句

Another good candidate for an assertion is a `switch` statement with no `default` case.
The absence of a `default` case typically indicates that a programmer believes that one of the cases will always be executed.
The assumption that a particular variable will have one of a small number of values is an invariant that should be checked with an assertion.
For example, suppose the following `switch` statement appears in a program that handles playing cards:

```text
switch(suit) {
  case Suit.CLUBS:
    ...
  break;

  case Suit.DIAMONDS:
    ...
  break;

  case Suit.HEARTS:
    ...
    break;

  case Suit.SPADES:
      ...
}
```

It probably indicates an assumption that the `suit` variable will have one of only four values.
To test this assumption, you should add the following `default` case:

```text
default:
    assert false : suit;
```

If the `suit` variable takes on another value and assertions are enabled, the assert will fail and an `AssertionError` will be thrown.

An acceptable alternative is:

```text
default:
    throw new AssertionError(suit);
```

This alternative offers protection even if assertions are disabled, but the extra protection adds no cost:
the `throw` statement won't execute unless the program has failed.

Moreover, the alternative is legal under **some circumstances** where the `assert` statement is not.
If the enclosing method returns a value, each `case` in the `switch` statement contains a `return` statement,
and no `return` statement follows the `switch` statement, then it would cause a syntax error to add a `default` case with an assertion.
(The method would `return` without a value if no `case` matched and assertions were disabled.)

### Control-Flow Invariants

The previous example not only tests an invariant, it also checks an assumption about the application's flow of control.
The author of the original `switch` statement probably assumed
not only that the `suit` variable would always have one of four values,
but also that one of the four cases would always be executed.
It points out another general area where you should use assertions: **place an assertion at any location you assume will not be reached**.

The assertions statement to use is:

```text
assert false;
```

For example, suppose you have a method that looks like this:

```text
void foo() {
    for (...) {
      if (...)
        return;
    }
    // Execution should never reach this point!!!
}
```

Replace the final comment so that the code now reads:

```text
void foo() {
    for (...) {
      if (...)
        return;
    }
    assert false; // Execution should never reach this point!
}
```

**Note**: Use this technique with discretion.
If a statement is unreachable as defined in the Java Language Specification,
you will get a compile time error if you try to assert that it is not reached.
Again, an acceptable alternative is simply to throw an `AssertionError`.

### Preconditions

**By convention, preconditions on public methods are enforced by explicit checks that throw particular, specified exceptions**. For example:

```text
/**
  * Sets the refresh rate.
  *
  * @param  rate refresh rate, in frames per second.
  * @throws IllegalArgumentException if rate <= 0 or
  * rate > MAX_REFRESH_RATE.
*/
public void setRefreshRate(int rate) {
  // Enforce specified precondition in public method
  if (rate <= 0 || rate > MAX_REFRESH_RATE)
    throw new IllegalArgumentException("Illegal rate: " + rate);
    setRefreshInterval(1000/rate);
  }
```

This convention is unaffected by the addition of the assert construct.
**Do not use assertions to check the parameters of a public method.**
An assert is inappropriate because the method guarantees that it will always enforce the argument checks.
It must check its arguments whether or not assertions are enabled.
Further, the assert construct does not throw an exception of the specified type.
It can throw only an `AssertionError`.

You can, however, use **an assertion** to test **a nonpublic method's precondition** that you believe will be `true` no matter what a client does with the class.
For example, an assertion is appropriate in the following "helper method" that is invoked by the previous method:

```text
/**
 * Sets the refresh interval (which must correspond to a legal frame rate).
 *
 * @param  interval refresh interval in milliseconds.
*/
 private void setRefreshInterval(int interval) {
  // Confirm adherence to precondition in nonpublic method
  assert interval > 0 && interval <= 1000/MAX_REFRESH_RATE : interval;

  ... // Set the refresh interval
 } 
```

Note, the above assertion will fail if `MAX_REFRESH_RATE` is greater than `1000` and the client selects a refresh rate greater than `1000`.
This would, in fact, indicate a bug in the library!

### Postconditions

You can test postcondition with assertions in both **public** and **nonpublic methods**.
For example, the following public method uses an assert statement to check a post condition:

```text
 /**
  * Returns a BigInteger whose value is (this-1 mod m).
  *
  * @param  m the modulus.
  * @return this-1 mod m.
  * @throws ArithmeticException  m <= 0, or this BigInteger
  *has no multiplicative inverse mod m (that is, this BigInteger
  *is not relatively prime to m).
  */
public BigInteger modInverse(BigInteger m) {
  if (m.signum <= 0)
    throw new ArithmeticException("Modulus not positive: " + m);
  ... // Do the computation
  assert this.multiply(result).mod(m).equals(ONE) : this;
  return result;
}
```

Occasionally it is necessary to save some data prior to performing a computation in order to check a postcondition.
You can do this with two assert statements and a simple inner class that saves the state of one or more variables
so they can be checked (or rechecked) after the computation.
For example, suppose you have a piece of code that looks like this:

```text
 void foo(int[] array) {
  // Manipulate array
  ...

  // At this point, array will contain exactly the ints that it did
  // prior to manipulation, in the same order.
 }
```

Here is how you could modify the above method to turn the textual assertion of a postcondition into a functional one:

```text
void foo(final int[] array) {

  // Inner class that saves state and performs final consistency check
  class DataCopy {
    private int[] arrayCopy;
    
    DataCopy() { arrayCopy = (int[]) array.clone(); }
    
    boolean isConsistent() { return Arrays.equals(array, arrayCopy); }
  }

  DataCopy copy = null;

  // Always succeeds; has side effect of saving a copy of array
  assert ((copy = new DataCopy()) != null);

  ... // Manipulate array

  // Ensure array has same ints in same order as before manipulation.
  assert copy.isConsistent();
} 
```

You can easily generalize this idiom to save more than one data field, and to test arbitrarily complex assertions concerning pre-computation and post-computation values.

You might be tempted to replace the first `assert` statement (which is executed solely for its side-effect) by the following, more expressive statement:

```text
copy = new DataCopy();
```

**Don't make this replacement**. The statement above would copy the `array` whether or not asserts were enabled, violating the principle that assertions should have no cost when disabled.

### Class Invariants

A **class invariant** is a type of **internal invariant** that applies to **every instance of a class** at all times,
except when an instance is in transition from one consistent state to another.
A **class invariant** can specify the relationships among multiple attributes,
and should be `true` before and after any method completes.
For example, suppose you implement a balanced tree data structure of some sort.
A class invariant might be that the tree is balanced and properly ordered.

```text
 // Returns true if this tree is properly balanced
 private boolean balanced() {
  ...
 }
```

Because this method checks a constraint that should be `true` before and after any method completes,
each public method and constructor should contain the following line immediately prior to its `return`:

```text
assert balanced();
```

It is generally unnecessary to place similar checks at **the head of each public method** unless the data structure is implemented by native methods.
In this case, it is possible that a memory corruption bug could corrupt a "native peer" data structure in between method invocations.
A failure of the assertion at the head of such a method would indicate that such memory corruption had occurred.
Similarly, it may be advisable to include class invariant checks at the heads of methods in classes whose state is modifiable by other classes.
(Better yet, design classes so that their state is not directly visible to other classes!)

## Java Assertions 的本质

### 代码示例

```java
package sample;

public class HelloWorld {
    public static void main(String[] args) {
        int length = args.length;
        assert length > 0 : "length is 0";
        System.out.println(length);
    }
}
```

第一次运行，使用 `-ea` 选项，运行结果如下：

```text
$ java -ea sample.HelloWorld
Exception in thread "main" java.lang.AssertionError: length is 0
        at sample.HelloWorld.main(HelloWorld.java:6)
```

第二次运行，不使用 `-ea` 选项，运行结果如下：

```text
$ java sample.HelloWorld
0
```

### assert 本质

使用 `javap` 命令查看 `sample.HelloWorld` 的内容：

```text
javap -c sample.HelloWorld
Compiled from "HelloWorld.java"
public class sample.HelloWorld {
  static final boolean $assertionsDisabled;

  public sample.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: aload_0
       1: arraylength
       2: istore_1
       3: getstatic     #2                  // Field $assertionsDisabled:Z
       6: ifne          23
       9: iload_1
      10: ifgt          23
      13: new           #3                  // class java/lang/AssertionError
      16: dup
      17: ldc           #4                  // String length is 0
      19: invokespecial #5                  // Method java/lang/AssertionError."<init>":(Ljava/lang/Object;)V
      22: athrow
      23: return

  static {};
    Code:
       0: ldc           #6                  // class sample/HelloWorld
       2: invokevirtual #7                  // Method java/lang/Class.desiredAssertionStatus:()Z
       5: ifne          12
       8: iconst_1
       9: goto          13
      12: iconst_0
      13: putstatic     #2                  // Field $assertionsDisabled:Z
      16: return
}
```

对于上面的输出结果，我们有三点需要注意的内容：

- 第一点，生成了 `$assertionsDisabled` 字段，其类型是 `boolean` 类型，并带有 `static final` 标识。其中，`static` 标识表示“不管创建多少类的实例，都只有一个 `$assertionsDisabled` 字段”，而 `final` 标识表示“一旦 `$assertionsDisabled` 字段经赋值，就不会再发生变化了。
- 第二点，在 `<clinit>` 方法中，会为 `$assertionsDisabled` 字段赋值。
  - 第一步，获取 `HelloWorld.class`。
  - 第二步，调用 `Class.desiredAssertionStatus()` 方法。
  - 第三步，为 `$assertionsDisabled` 字段赋值。
    - 使用 `java -ea sample.HelloWorld` 运行，`Class.desiredAssertionStatus()` 方法返回值是 `true`，`$assertionsDisabled` 字段为 `false` 值。
    - 使用 `java sample.HelloWorld` 运行，`Class.desiredAssertionStatus()` 方法返回值是 `false`，`$assertionsDisabled` 字段为 `true` 值。
- 第三点，在 `main` 方法中，对 `$assertionsDisabled` 字段的值进行使用。

### AssertionError 类

在 `AssertionError` 类当中，有多个构造方法，有无参构造方法，也有接收 `boolean`、`char`、`int`、`long`、`float`、`double`、`Object` 类型的构造方法，可以满足你的各种”小心思“（需求）。

在下面 `assert` 的使用格式中，`Expression2` 可以是 `boolean`、`char`、`int`、`long`、`float`、`double`、`Object` 类型中的任意一种。更进一步，`Expression2` 也可以是对方法的调用，但是方法的返回值不能是 `void` 类型。

```text
assert Expression1 : Expression2;
```

```java
public class AssertionError extends Error {
  public AssertionError() {
  }

  private AssertionError(String detailMessage) {
    super(detailMessage);
  }

  public AssertionError(boolean detailMessage) {
    this(String.valueOf(detailMessage));
  }

  public AssertionError(char detailMessage) {
    this(String.valueOf(detailMessage));
  }

  public AssertionError(int detailMessage) {
    this(String.valueOf(detailMessage));
  }

  public AssertionError(long detailMessage) {
    this(String.valueOf(detailMessage));
  }

  public AssertionError(float detailMessage) {
    this(String.valueOf(detailMessage));
  }

  public AssertionError(double detailMessage) {
    this(String.valueOf(detailMessage));
  }

  public AssertionError(Object detailMessage) {
    this(String.valueOf(detailMessage));
    if (detailMessage instanceof Throwable)
      initCause((Throwable) detailMessage);
  }

  public AssertionError(String message, Throwable cause) {
    super(message, cause);
  }
}
```

## 最佳实践：Advanced Uses

The following sections discuss topics that apply only to resource-constrained devices and to systems where asserts must not be disabled in the field.

### Removing all Trace of Assertions from Class Files

Programmers developing applications for **resource-constrained devices** may wish to strip assertions out of class files entirely.
While this makes it impossible to enable assertions in the field,
it also reduces class file size, possibly leading to improved class loading performance.
In the absence of a high quality JIT, it could lead to decreased footprint and improved runtime performance.

The assertion facility offers no direct support for stripping assertions out of class files.
The assert statement may, however, be used in conjunction with the "**conditional compilation**" idiom described in the Java Language Specification,
enabling the compiler to eliminate all traces of these asserts from the class files that it generates:

```text
static final boolean asserts = ... ; // false to eliminate asserts

if (asserts)
  assert <expr>; 
```

### Requiring that Assertions are Enabled

Programmers of certain critical systems might wish to ensure that **assertions are not disabled** in the field.
The following **static initialization idiom** prevents a class from being initialized if its assertions have been disabled:

```text
static {
  boolean assertsEnabled = false;
  assert assertsEnabled = true; // Intentional side effect!!!
  if (!assertsEnabled)
    throw new RuntimeException("Asserts must be enabled!!!");
} 
```

Put this static-initializer at the top of your class.

## Best Practices

The most important thing to remember about assertions is that they can be disabled, so **never assume they'll be executed**.

Therefore keep the followings things in mind when using assertions:

- Always check for `null` values and empty `Optional`s where appropriate
- Avoid using assertions to check **inputs into a public method** and instead use an unchecked exception such as `IllegalArgumentException` or `NullPointerException`
- Don't call methods in assertion conditions and instead assign **the result of the method to a local variable** and use that variable with `assert`
- Assertions are great for places in the code that will never be executed, such as the `default` case of a `switch` statement or after a loop that never finishes

## References

- [Baeldung: Using Java Assertions](https://www.baeldung.com/java-assert)
- [Oracle: Programming With Assertions](https://docs.oracle.com/javase/8/docs/technotes/guides/language/assert.html)
- [InfoWorld: How to use assertions in Java](https://www.infoworld.com/article/3543239/how-to-use-assertions-in-java.html)，我觉得这个很不错
- [StackOverflow: What does the Java assert keyword do, and when should it be used?](https://stackoverflow.com/questions/2758224/what-does-the-java-assert-keyword-do-and-when-should-it-be-used)
