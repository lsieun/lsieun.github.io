---
title: "示例：检测潜在的NullPointerException"
sequence: "414"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

## 如何实现NPE分析

### 代码比对

在IntelliJ IDEA当中，如果我们编写如下代码，它就会提示有`NullPointerException`异常：

```java
// 第一种写法
public class HelloWorld {
    public void test() {
        String str = null;
        // Method invocation 'trim' will produce 'NullPointerException'
        System.out.println(str.trim());
    }
}
```

接着，我们将`str`变量作为参数传递给`test`方法，就不会提示有潜在的`NullPointerException`异常：

```java
// 第二种写法
public class HelloWorld {
    public void test(String str) {
        // No Warning
        System.out.println(str.trim());
    }
}
```

再进一步，在`test`方法内，对`str`与`null`进行判断，就会再次提示有潜在的`NullPointerException`异常：

```java
// 第三种写法
public class HelloWorld {
    public void test(String str) {
        if (str == null) {
            System.out.println("str is null");
        }
        else {
            System.out.println("str is not null");
        }

        // Method invocation 'trim' may produce 'NullPointerException'
        System.out.println(str.trim());
    }
}
```

最后，在`test`方法内，将`str`与一个`boolean flag`进行关联，根据`flag`的值来调用`str.trim()`方法，不出现任何提示：

```java
// 第四种写法
public class HelloWorld {
    public void test(String str) {
        boolean flag;
        if (str == null) {
            flag = true;
            System.out.println("str is null");
        }
        else {
            flag = false;
            System.out.println("str is not null");
        }

        if (!flag) {
            // No Warning
            System.out.println(str.trim());
        }
    }
}
```

此时，我们可能会有如下的想法：

- 第一种写法，提示`NullPointerException`异常，很正常，也很容易理解。
- 第二种写法，`str`是有`null`的可能性，那么为什么不提示`NullPointerException`异常呢？
- 第三种写法，比第二种写法多了`if`语句对`null`进行判断，就会再次提示有潜在的`NullPointerException`异常，这是为什么呢？
- 第四种写法，添加了一个`boolean`类型的辅助判断，不提示`NullPointerException`异常，也很合理。

关于这些种写法，有各自的结果（提示或不提示`NullPointerException`异常），这里涉及到两组概念：

- dereference的概念，它是一个过程，是从“变量”到“结果”的分析过程。
- nullness相关的概念，它是一个工具，是解释从“变量”到“结果”的原因。

![](/assets/images/java/asm/null-ability-dereference.png)

在nullness这个概念当中，有四个状态：unknown、not-null、null和nullable。not-null和null两个比较好理解，但是unknown和nullable的区别是什么呢？

最直观的理解方式是这样的：

- unknown表示一种“不知道”的状态，那么“不知道”是不是意味着可能是null，也可能不是null（not-null）呢？ `unknown = not-null + null`
- nullable表示“可以为null”，是不是也同时意味着可以不为null（not-null）呢？ `nullable = not-null + null`

那么，我们就很难解释清楚`unknown`和`nullable`两者之间的区别，也很难确定这2个状态合并之后应该是一个什么样的状态。

接下来，我们借助于“混沌”和“太极”的概念进行展开。在这里，我们解释一下：为什么要提到“混沌”和“太极”呢？
我们借助于“混沌”和“太极”的概念，是引入一种不同的思考方式：理解unknown、not-null、null和nullable这4个状态的区别、理解这4个种状态之间的变化关系。

### 混沌

在[三五曆記](https://zh.m.wikisource.org/zh-hant/%E4%B8%89%E4%BA%94%E6%9B%86%E8%A8%98)中，描述如下：

```text
天地混沌如雞子，盤古生其中。萬八千歲，天地開闢，清陽為天，濁陰為地。
盤古在其中，一日九變，神於天，聖於地。天日高一丈，地日厚一丈，盤古日長一丈。
如此萬八千歲，天數極高，地數極厚，盤古氏極長。故天去地九萬里，後乃有三皇。
天氣蒙鴻，萌芽茲始，遂分天地，肇立乾坤，啟陰感陽，分佈元氣，乃孕中和，是為人也。
首生盤古。垂死化身，氣成風雲，聲為雷霆，左眼為日，右眼為月，
四肢五體為四極五嶽，血液為江河，筋脈為地裏，肌肉為田土，
髮為星辰，皮膚為草木，齒骨為金石，精髓為珠玉，汗流為雨澤，身之諸蟲，因風所感，化為黎甿。
```

![](/assets/images/chinese-culture/chaos-heaven-earth.png)

### 太极

```text
《周易大传·系辞上》云：“易有太极，是生两仪，两仪生四象，四象生八卦，八卦定吉凶，吉凶生大业。是故法象莫大乎天地，变通莫大乎四时，县象著明莫大乎日月。”
```

![](/assets/images/chinese-culture/tai-chi.png)

### Nullability

Nullness kinds有四种状态：

- unknown
- not-null
- null
- nullable

其中，`unknown`可以理解成“混沌”的状态，它代表“纯净”的物质；而`not-null`和`null`可以理解成由`unknown`衍生出的“纯净”的“阳”和“阴”两种物质；最后，`nullable`可以理解成不同比例`not-null`和`null`结合成的“混合”物质。

![](/assets/images/java/asm/nullable-unknown.png)

我们将任意两个状态进行合并（merge），合并的规律就是“只能向前演进，不能向后退化”。那么，任意两个状态合并之后的结果，可以使用表格来进行表示：

|            |  `unknown` | `not-null` |   `null`   | `nullable` |
|------------|------------|------------|------------|------------|
|  `unknown` |  `unknown` | `not-null` |   `null`   | `nullable` |
| `not-null` | `not-null` | `not-null` | `nullable` | `nullable` |
|   `null`   |   `null`   | `nullable` |   `null`   | `nullable` |
| `nullable` | `nullable` | `nullable` | `nullable` | `nullable` |

我们以结果为导向，对上面的表格进行总结：

- `unknown`:
  - `unknown + unknown = unknown`
- `not-null`:
  - `not-null + not-null = not-null`
  - `unknown + not-null = not-null`
- `null`
  - `null + null = null`
  - `unknown + null = null`
- `nullable`: 剩余情况
  - `nullable + nullable = nullable`
  - `not-null + null = nullable`
  - `nullable + other = nullable`

其中，`nullable`可以理解为“最强烈的状态”，任何其它的状态都会被`nullable`所“掩盖”。

```java
public enum Nullability {
    UNKNOWN(0),
    NOT_NULL(1),
    NULL(1),
    NULLABLE(2);

    public final int priority;

    Nullability(int priority) {
        this.priority = priority;
    }

    public static Nullability merge(Nullability value1, Nullability value2) {
        // 第一种情况，两者相等，则直接返回一个
        if (value1 == value2) {
            return value1;
        }

        // 第二种情况，两者不相等，比较优先级大小，谁大返回谁
        int priority1 = value1.priority;
        int priority2 = value2.priority;
        if (priority1 > priority2) {
            return value1;
        }
        else if (priority1 < priority2) {
            return value2;
        }
        
        // 第三种情况，两者不相等，但优先级相等，则一个是NOT_NULL，另一个是NULL
        return NULLABLE;
    }
}
```

举个生活当中的例子，`nullable`可以理解成不同颜色混合在一起的烟雾，加入任何其它烟雾（单纯的黄色、紫色），它仍然是混合颜色的烟雾。

![](/assets/images/java/asm/colorful-smoke.gif)

那么，`unknown`、`not-null`、`null`和`nullable`四种状态与`NullPointerException`异常的关系：

- 如果变量是`unknown`或`not-null`状态，不会提示`NullPointerException`异常。
  - 如果是`not-null`状态，就不可能有`NullPointerException`异常。
  - 如果是`unknown`状态，它有可能演进成`null`的状态。如果提示`NullPointerException`异常，那提示就太多了；如果提示太多了，也就没有什么用了。
- 如果变量是`null`或`nullable`状态，就会提示`NullPointerException`异常。

在下面的代码中，遇到`str.trim()`的时候，`str`是`unknown`的状态：

```java
public class HelloWorld {
    public void test(String str) {
        // State: str:nullness = unknown
        System.out.println(str.trim());
    }
}
```

相应的，在下面的代码中，加上了`if`语句对`str`与`null`进行判断，再次遇到`str.trim()`的时候，`str`是`nullable`的状态：

```java
public class HelloWorld {
    public void test(String str) {
        // State: str:nullness = unknown
        if (str == null) {
            // State#1: str:nullness = null
            System.out.println("str is null");
        }
        else {
            // State#2: str:nullness = not-null
            System.out.println("str is not null");
        }

        // State#1: str:nullness = null
        // State#2: str:nullness = not-null
        // Merged state: str:nullness = nullable
        System.out.println(str.trim());
    }
}
```

我们生活当中，经常会听到有人说“薛定谔的猫”：比喻一件事，如果你不去做，它就可能有两个结果；而一旦你去做了，最后结果就只能有一个。也就是说，**你的参与直接干预了结果**。

接下来，就是将unknown、not-null、null和nullable这4个状态和彼此之间的转换关系应用于代码逻辑当中。

## 代码示例：实现一

这个实现是ASM官方文档（[asm4-guide.pdf](https://asm.ow2.io/asm4-guide.pdf)）提供的实现，代码比较简单，功能也比较简单。

### 预期目标

假如有一个`HelloWorld`类：

```java
public class HelloWorld {
    public void test(boolean flag) {
        Object obj = null;
        if (flag) {
            obj = "10";
            System.out.println(obj);
        }
        // Method invocation 'hashCode' may produce 'NullPointerException'
        int hash = obj.hashCode();
        System.out.println(hash);
    }
}
```

我们的预期目标：检测出`obj.hashCode()`方法可能会造成`NullPointerException`异常。

借助于`NullDeferenceInterpreter`类，我们来查看一下`test`方法的Frame变化：

```text
test:(Z)V
000:    aconst_null                             {R, I, ., .} | {}
001:    astore_2                                {R, I, ., .} | {null}
002:    iload_1                                 {R, I, null, .} | {}
003:    ifeq L0                                 {R, I, null, .} | {I}
004:    ldc "10"                                {R, I, null, .} | {}
005:    astore_2                                {R, I, null, .} | {R}
006:    getstatic System.out                    {R, I, R, .} | {}
007:    aload_2                                 {R, I, R, .} | {R}
008:    invokevirtual PrintStream.println       {R, I, R, .} | {R, R}
009:    L0                                      {R, I, may-be-null, .} | {}
010:    aload_2                                 {R, I, may-be-null, .} | {}
011:    invokevirtual Object.hashCode           {R, I, may-be-null, .} | {may-be-null}
012:    istore_3                                {R, I, may-be-null, .} | {I}
013:    getstatic System.out                    {R, I, may-be-null, I} | {}
014:    iload_3                                 {R, I, may-be-null, I} | {R}
015:    invokevirtual PrintStream.println       {R, I, may-be-null, I} | {R, I}
016:    return                                  {R, I, may-be-null, I} | {}
================================================================
```

在`011`行的operand stack上，能够看到`obj`有可能为`null`值（`may-be-null`），这就是我们判断的依据。

### 编码实现

#### NullDeferenceInterpreter

在`BasicInterpreter`类当中，它使用`BasicValue.REFERENCE_VALUE`来表示所有的reference type（引用类型）。

在下面的`NullDeferenceInterpreter`类，继承自`BasicInterpreter`类。`NullDeferenceInterpreter`类使用三个不同的`BasicValue`值来表示reference type（引用类型）：

- `BasicValue.REFERENCE_VALUE`：表示unknown和not-null的状态。
- `NullDeferenceInterpreter.NULL_VALUE`：表示null的状态。
- `NullDeferenceInterpreter.MAYBE_NULL_VALUE`：表示nullable的状态。

这三个`BasicValue`值进行合并（merge）的操作定义在`merge`方法内。

```java
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.analysis.AnalyzerException;
import org.objectweb.asm.tree.analysis.BasicInterpreter;
import org.objectweb.asm.tree.analysis.BasicValue;
import org.objectweb.asm.tree.analysis.Value;

public class NullDeferenceInterpreter extends BasicInterpreter {
    public final static BasicValue NULL_VALUE = new BasicValue(NULL_TYPE);
    public final static BasicValue MAYBE_NULL_VALUE = new BasicValue(Type.getObjectType("may-be-null"));

    public NullDeferenceInterpreter(int api) {
        super(api);
    }

    @Override
    public BasicValue newOperation(AbstractInsnNode insn) throws AnalyzerException {
        if (insn.getOpcode() == ACONST_NULL) {
            return NULL_VALUE;
        }
        return super.newOperation(insn);
    }

    @Override
    public BasicValue merge(BasicValue value1, BasicValue value2) {
        if (isRef(value1) && isRef(value2) && value1 != value2) {
            return MAYBE_NULL_VALUE;
        }
        return super.merge(value1, value2);
    }

    private boolean isRef(Value value) {
        return value == BasicValue.REFERENCE_VALUE || value == NULL_VALUE || value == MAYBE_NULL_VALUE;
    }
}
```

#### NullDereferenceDiagnosis

在下面的`NullDereferenceDiagnosis`类当中，主要的逻辑就是判断operand stack上的某一个元素是否可能为`null`值：

```java
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.MethodInsnNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.*;

import java.util.Arrays;

import static org.objectweb.asm.Opcodes.*;

public class NullDereferenceDiagnosis {
    public static int[] diagnose(String owner, MethodNode mn) throws AnalyzerException {
        // 第一步，获取Frame信息
        Analyzer<BasicValue> analyzer = new Analyzer<>(new NullDeferenceInterpreter(ASM9));
        Frame<BasicValue>[] frames = analyzer.analyze(owner, mn);

        // 第二步，判断是否为null或maybe-null，收集数据
        TIntArrayList intArrayList = new TIntArrayList();
        InsnList instructions = mn.instructions;
        int size = instructions.size();
        for (int i = 0; i < size; i++) {
            AbstractInsnNode insn = instructions.get(i);
            if (frames[i] != null) {
                Value value = getTarget(insn, frames[i]);
                if (value == NullDeferenceInterpreter.NULL_VALUE || value == NullDeferenceInterpreter.MAYBE_NULL_VALUE) {
                    intArrayList.add(i);
                }
            }
        }

        // 第三步，将结果转换成int[]形式
        int[] array = intArrayList.toNativeArray();
        Arrays.sort(array);
        return array;
    }

    private static BasicValue getTarget(AbstractInsnNode insn, Frame<BasicValue> frame) {
        int opcode = insn.getOpcode();
        switch (opcode) {
            case GETFIELD:
            case ARRAYLENGTH:
            case MONITORENTER:
            case MONITOREXIT:
                return getStackValue(frame, 0);
            case PUTFIELD:
                return getStackValue(frame, 1);
            case INVOKEVIRTUAL:
            case INVOKESPECIAL:
            case INVOKEINTERFACE:
                String desc = ((MethodInsnNode) insn).desc;
                return getStackValue(frame, Type.getArgumentTypes(desc).length);

        }
        return null;
    }

    private static BasicValue getStackValue(Frame<BasicValue> frame, int index) {
        int top = frame.getStackSize() - 1;
        return index <= top ? frame.getStack(top - index) : null;
    }
}
```

### 进行分析

```java
public class HelloWorldAnalysisTree {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）生成ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        //（3）进行分析
        String className = cn.name;
        List<MethodNode> methods = cn.methods;
        MethodNode mn = methods.get(1);
        int[] array = NullDereferenceDiagnosis.diagnose(className, mn);
        System.out.println(Arrays.toString(array));
        BoxDrawingUtils.printInstructionLinks(mn.instructions, array);
    }
}
```

运行结果：

```text
[11]
      000: aconst_null
      001: astore_2
      002: iload_1
      003: ifeq L0
      004: ldc "10"
      005: astore_2
      006: getstatic System.out
      007: aload_2
      008: invokevirtual PrintStream.println
      009: L0
      010: aload_2
├──── 011: invokevirtual Object.hashCode
      012: istore_3
      013: getstatic System.out
      014: iload_3
      015: invokevirtual PrintStream.println
      016: return
```

但是，我们当前介绍的方法有局限性，无法识别下面的代码。在下面的例子当中，并没有直接将`null`赋值给`str`变量，而是判断`str`是否为`null`：

```java
public class HelloWorld {
    public void test(String str) {
        if (str == null) {
            System.out.println("str is null");
        }
        else {
            System.out.println("str is not null");
        }

        // Method invocation 'trim' may produce 'NullPointerException'
        System.out.println(str.trim());
    }
}
```

## 代码示例：实现二

这个实现是[项目](https://gitee.com/lsieun/learn-java-asm)当中提供的实现，代码比较复杂，功能也相对上一个版本较强一些。

### 预期目标

```java
public class HelloWorld {
    public void test(String str) {
        if (str == null) {
            System.out.println("str is null");
        }
        else {
            System.out.println("str is not null");
        }

        // Method invocation 'trim' may produce 'NullPointerException'
        System.out.println(str.trim());
    }
}
```

我们的预期目标：检测出`str.trim()`方法可能会造成`NullPointerException`异常。

借助于`NullabilityAnalyzer`和`NullabilityInterpreter`类，我们来查看一下`test`方法的Frame变化：

```text
test:(Ljava/lang/String;)V
000:    aload_1                                 {HelloWorld, String} | {}
001:    ifnonnull L0                            {HelloWorld, String} | {String}
002:    getstatic System.out                    {HelloWorld, String:NULL} | {}
003:    ldc "str is null"                       {HelloWorld, String:NULL} | {PrintStream}
004:    invokevirtual PrintStream.println       {HelloWorld, String:NULL} | {PrintStream, String:NOT-NULL}
005:    goto L1                                 {HelloWorld, String:NULL} | {}
006:    L0                                      {HelloWorld, String:NOT-NULL} | {}
007:    getstatic System.out                    {HelloWorld, String:NOT-NULL} | {}
008:    ldc "str is not null"                   {HelloWorld, String:NOT-NULL} | {PrintStream}
009:    invokevirtual PrintStream.println       {HelloWorld, String:NOT-NULL} | {PrintStream, String:NOT-NULL}
010:    L1                                      {HelloWorld, String:NULLABLE} | {}
011:    getstatic System.out                    {HelloWorld, String:NULLABLE} | {}
012:    aload_1                                 {HelloWorld, String:NULLABLE} | {PrintStream}
013:    invokevirtual String.trim               {HelloWorld, String:NULLABLE} | {PrintStream, String:NULLABLE}
014:    invokevirtual PrintStream.println       {HelloWorld, String:NULLABLE} | {PrintStream, String}
015:    return                                  {HelloWorld, String:NULLABLE} | {}
================================================================
```

在`013`行的operand stack上，能够看到`str`有可能为`null`值（`String:NULLABLE`），这就是我们判断的依据。

### 编码实现

#### NullabilityValue

下面的`NullabilityValue`类，是模拟着`BasicValue`类来写的，但是`NullabilityValue`类包含一个`Nullability state`字段，它记录了unknown、not-null、null和nullable四种状态。

```java
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.analysis.Value;

public class NullabilityValue implements Value {
    private final Type type;
    private Nullability state;

    public NullabilityValue(Type type) {
        this(type, Nullability.UNKNOWN);
    }

    public NullabilityValue(Type type, Nullability state) {
        this.type = type;
        this.state = state;
    }

    public Type getType() {
        return type;
    }

    public void setState(Nullability state) {
        this.state = state;
    }

    public Nullability getState() {
        return state;
    }

    @Override
    public int getSize() {
        return type == Type.LONG_TYPE || type == Type.DOUBLE_TYPE ? 2 : 1;
    }

    public boolean isReference() {
        return type != null && (type.getSort() == Type.OBJECT || type.getSort() == Type.ARRAY);
    }

    @Override
    public boolean equals(final Object value) {
        if (value == this) {
            return true;
        }
        else if (value instanceof NullabilityValue) {
            NullabilityValue another = (NullabilityValue) value;
            if (type == null) {
                return ((NullabilityValue) value).type == null;
            }
            else {
                return type.equals(((NullabilityValue) value).type) && state == another.state;
            }
        }
        else {
            return false;
        }
    }

    @Override
    public int hashCode() {
        return type == null ? 0 : type.hashCode();
    }
}
```

#### NullabilityInterpreter

在下面的`NullabilityInterpreter`类当中，它是模拟着`SimpleVerifier`类来写的。这个类并没有经过很多的测试，可能有许多的bug存在，所以我们就不介绍它的具体逻辑了。

```java
import org.objectweb.asm.ConstantDynamic;
import org.objectweb.asm.Handle;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.*;
import org.objectweb.asm.tree.analysis.AnalyzerException;
import org.objectweb.asm.tree.analysis.Interpreter;

import java.util.List;

public class NullabilityInterpreter extends Interpreter<NullabilityValue> implements Opcodes {
    public static final Type NULL_TYPE = Type.getObjectType("null");

    public static final NullabilityValue UNINITIALIZED_VALUE = new NullabilityValue(null);
    public static final NullabilityValue RETURN_ADDRESS_VALUE = new NullabilityValue(Type.VOID_TYPE);

    private final ClassLoader loader = getClass().getClassLoader();

    public NullabilityInterpreter(int api) {
        super(api);
    }

    @Override
    public NullabilityValue newValue(Type type) {
        if (type == null) {
            return UNINITIALIZED_VALUE;
        }

        int sort = type.getSort();
        if (sort == Type.VOID) {
            return null;
        }
        return new NullabilityValue(type);
    }

    @Override
    public NullabilityValue newOperation(AbstractInsnNode insn) throws AnalyzerException {
        switch (insn.getOpcode()) {
            case ACONST_NULL:
                return new NullabilityValue(NULL_TYPE, Nullability.NULL);
            case ICONST_M1:
            case ICONST_0:
            case ICONST_1:
            case ICONST_2:
            case ICONST_3:
            case ICONST_4:
            case ICONST_5:
            case BIPUSH:
            case SIPUSH:
                return newValue(Type.INT_TYPE);
            case LCONST_0:
            case LCONST_1:
                return newValue(Type.LONG_TYPE);
            case FCONST_0:
            case FCONST_1:
            case FCONST_2:
                return newValue(Type.FLOAT_TYPE);
            case DCONST_0:
            case DCONST_1:
                return newValue(Type.DOUBLE_TYPE);
            case LDC:
                Object value = ((LdcInsnNode) insn).cst;
                if (value instanceof Integer) {
                    return newValue(Type.INT_TYPE);
                }
                else if (value instanceof Float) {
                    return newValue(Type.FLOAT_TYPE);
                }
                else if (value instanceof Long) {
                    return newValue(Type.LONG_TYPE);
                }
                else if (value instanceof Double) {
                    return newValue(Type.DOUBLE_TYPE);
                }
                else if (value instanceof String) {
                    return new NullabilityValue(Type.getObjectType("java/lang/String"), Nullability.NOT_NULL);
                }
                else if (value instanceof Type) {
                    int sort = ((Type) value).getSort();
                    if (sort == Type.OBJECT || sort == Type.ARRAY) {
                        return newValue(Type.getObjectType("java/lang/Class"));
                    }
                    else if (sort == Type.METHOD) {
                        return newValue(Type.getObjectType("java/lang/invoke/MethodType"));
                    }
                    else {
                        throw new AnalyzerException(insn, "Illegal LDC value " + value);
                    }
                }
                else if (value instanceof Handle) {
                    return newValue(Type.getObjectType("java/lang/invoke/MethodHandle"));
                }
                else if (value instanceof ConstantDynamic) {
                    return newValue(Type.getType(((ConstantDynamic) value).getDescriptor()));
                }
                else {
                    throw new AnalyzerException(insn, "Illegal LDC value " + value);
                }
            case JSR:
                return RETURN_ADDRESS_VALUE;
            case GETSTATIC:
                return newValue(Type.getType(((FieldInsnNode) insn).desc));
            case NEW:
                return newValue(Type.getObjectType(((TypeInsnNode) insn).desc));
            default:
                throw new AssertionError();
        }
    }

    @Override
    public NullabilityValue copyOperation(AbstractInsnNode insn, NullabilityValue value) {
        return value;
    }

    @Override
    public NullabilityValue unaryOperation(AbstractInsnNode insn, NullabilityValue value) throws AnalyzerException {
        switch (insn.getOpcode()) {
            case INEG:
            case IINC:
            case L2I:
            case F2I:
            case D2I:
            case I2B:
            case I2C:
            case I2S:
            case ARRAYLENGTH:
            case INSTANCEOF:
                return newValue(Type.INT_TYPE);
            case FNEG:
            case I2F:
            case L2F:
            case D2F:
                return newValue(Type.FLOAT_TYPE);
            case LNEG:
            case I2L:
            case F2L:
            case D2L:
                return newValue(Type.LONG_TYPE);
            case DNEG:
            case I2D:
            case L2D:
            case F2D:
                return newValue(Type.DOUBLE_TYPE);
            case GETFIELD:
                return newValue(Type.getType(((FieldInsnNode) insn).desc));
            case NEWARRAY:
                switch (((IntInsnNode) insn).operand) {
                    case T_BOOLEAN:
                        return newValue(Type.getType("[Z"));
                    case T_CHAR:
                        return newValue(Type.getType("[C"));
                    case T_BYTE:
                        return newValue(Type.getType("[B"));
                    case T_SHORT:
                        return newValue(Type.getType("[S"));
                    case T_INT:
                        return newValue(Type.getType("[I"));
                    case T_FLOAT:
                        return newValue(Type.getType("[F"));
                    case T_DOUBLE:
                        return newValue(Type.getType("[D"));
                    case T_LONG:
                        return newValue(Type.getType("[J"));
                    default:
                        break;
                }
                throw new AnalyzerException(insn, "Invalid array type");
            case ANEWARRAY:
                return newValue(Type.getType("[" + Type.getObjectType(((TypeInsnNode) insn).desc)));
            case CHECKCAST:
                return value;
            case IFEQ:
            case IFNE:
            case IFLT:
            case IFGE:
            case IFGT:
            case IFLE:
            case TABLESWITCH:
            case LOOKUPSWITCH:
            case IRETURN:
            case LRETURN:
            case FRETURN:
            case DRETURN:
            case ARETURN:
            case PUTSTATIC:
            case ATHROW:
            case MONITORENTER:
            case MONITOREXIT:
            case IFNULL:
            case IFNONNULL:
                return null;
            default:
                throw new AssertionError();
        }
    }

    @Override
    public NullabilityValue binaryOperation(AbstractInsnNode insn,
                                            NullabilityValue value1,
                                            NullabilityValue value2) {
        switch (insn.getOpcode()) {
            case IALOAD:
            case BALOAD:
            case CALOAD:
            case SALOAD:
            case IADD:
            case ISUB:
            case IMUL:
            case IDIV:
            case IREM:
            case ISHL:
            case ISHR:
            case IUSHR:
            case IAND:
            case IOR:
            case IXOR:
            case LCMP:
            case FCMPL:
            case FCMPG:
            case DCMPL:
            case DCMPG:
                return newValue(Type.INT_TYPE);
            case FALOAD:
            case FADD:
            case FSUB:
            case FMUL:
            case FDIV:
            case FREM:
                return newValue(Type.FLOAT_TYPE);
            case LALOAD:
            case LADD:
            case LSUB:
            case LMUL:
            case LDIV:
            case LREM:
            case LSHL:
            case LSHR:
            case LUSHR:
            case LAND:
            case LOR:
            case LXOR:
                return newValue(Type.LONG_TYPE);
            case DALOAD:
            case DADD:
            case DSUB:
            case DMUL:
            case DDIV:
            case DREM:
                return newValue(Type.LONG_TYPE);
            case AALOAD:
                return getElementValue(value1);
            case IF_ICMPEQ:
            case IF_ICMPNE:
            case IF_ICMPLT:
            case IF_ICMPGE:
            case IF_ICMPGT:
            case IF_ICMPLE:
            case IF_ACMPEQ:
            case IF_ACMPNE:
            case PUTFIELD:
                return null;
            default:
                throw new AssertionError();
        }
    }

    @Override
    public NullabilityValue ternaryOperation(AbstractInsnNode insn,
                                             NullabilityValue value1,
                                             NullabilityValue value2,
                                             NullabilityValue value3) {
        return null;
    }

    @Override
    public NullabilityValue naryOperation(AbstractInsnNode insn,
                                          List<? extends NullabilityValue> values) {
        int opcode = insn.getOpcode();
        if (opcode == MULTIANEWARRAY) {
            return newValue(Type.getType(((MultiANewArrayInsnNode) insn).desc));
        }
        else if (opcode == INVOKEDYNAMIC) {
            return newValue(Type.getReturnType(((InvokeDynamicInsnNode) insn).desc));
        }
        else {
            return newValue(Type.getReturnType(((MethodInsnNode) insn).desc));
        }
    }

    @Override
    public void returnOperation(AbstractInsnNode insn,
                                NullabilityValue value,
                                NullabilityValue expected) {
        // Nothing to do.
    }

    @Override
    public NullabilityValue merge(NullabilityValue value1, NullabilityValue value2) {
        // 合并两者的状态
        Nullability mergedState = Nullability.merge(value1.getState(), value2.getState());


        // 第一种情况，两个value的类型相同且状态（state）相同
        if (value1.equals(value2)) {
            return value1;
        }

        // 第二种情况，两个value的类型相同，但状态（state）不同，需要合并它们的状态（state）
        Type type1 = value1.getType();
        Type type2 = value2.getType();
        if (type1 != null && type1.equals(type2)) {
            Type type = value1.getType();
            return new NullabilityValue(type, mergedState);
        }

        // 第三种情况，两个value的类型不相同的，而且要合并它们的状态（state）
        if (type1 != null
                && (type1.getSort() == Type.OBJECT || type1.getSort() == Type.ARRAY)
                && type2 != null
                && (type2.getSort() == Type.OBJECT || type2.getSort() == Type.ARRAY)) {
            if (type1.equals(NULL_TYPE)) {
                return new NullabilityValue(type2, mergedState);
            }
            if (type2.equals(NULL_TYPE)) {
                return new NullabilityValue(type1, mergedState);
            }
            if (isAssignableFrom(type1, type2)) {
                return new NullabilityValue(type1, mergedState);
            }
            if (isAssignableFrom(type2, type1)) {
                return new NullabilityValue(type2, mergedState);
            }
            int numDimensions = 0;
            if (type1.getSort() == Type.ARRAY
                    && type2.getSort() == Type.ARRAY
                    && type1.getDimensions() == type2.getDimensions()
                    && type1.getElementType().getSort() == Type.OBJECT
                    && type2.getElementType().getSort() == Type.OBJECT) {
                numDimensions = type1.getDimensions();
                type1 = type1.getElementType();
                type2 = type2.getElementType();
            }


            while (true) {
                if (type1 == null || isInterface(type1)) {
                    NullabilityValue arrayValue = newArrayValue(Type.getObjectType("java/lang/Object"), numDimensions);
                    return new NullabilityValue(arrayValue.getType(), mergedState);
                }
                type1 = getSuperClass(type1);
                if (isAssignableFrom(type1, type2)) {
                    NullabilityValue arrayValue = newArrayValue(type1, numDimensions);
                    return new NullabilityValue(arrayValue.getType(), mergedState);
                }
            }
        }
        return UNINITIALIZED_VALUE;
    }

    protected boolean isInterface(final Type type) {
        return getClass(type).isInterface();
    }

    protected Type getSuperClass(final Type type) {
        Class<?> superClass = getClass(type).getSuperclass();
        return superClass == null ? null : Type.getType(superClass);
    }

    private NullabilityValue newArrayValue(final Type type, final int dimensions) {
        if (dimensions == 0) {
            return newValue(type);
        }
        else {
            StringBuilder descriptor = new StringBuilder();
            for (int i = 0; i < dimensions; ++i) {
                descriptor.append('[');
            }
            descriptor.append(type.getDescriptor());
            return newValue(Type.getType(descriptor.toString()));
        }
    }

    protected NullabilityValue getElementValue(final NullabilityValue objectArrayValue) {
        Type arrayType = objectArrayValue.getType();
        if (arrayType != null) {
            if (arrayType.getSort() == Type.ARRAY) {
                return newValue(Type.getType(arrayType.getDescriptor().substring(1)));
            }
            else if (arrayType.equals(NULL_TYPE)) {
                return objectArrayValue;
            }
        }
        throw new AssertionError();
    }

    protected boolean isSubTypeOf(final NullabilityValue value, final NullabilityValue expected) {
        Type expectedType = expected.getType();
        Type type = value.getType();
        switch (expectedType.getSort()) {
            case Type.INT:
            case Type.FLOAT:
            case Type.LONG:
            case Type.DOUBLE:
                return type.equals(expectedType);
            case Type.ARRAY:
            case Type.OBJECT:
                if (type.equals(NULL_TYPE)) {
                    return true;
                }
                else if (type.getSort() == Type.OBJECT || type.getSort() == Type.ARRAY) {
                    if (isAssignableFrom(expectedType, type)) {
                        return true;
                    }
                    else if (getClass(expectedType).isInterface()) {
                        // The merge of class or interface types can only yield class types (because it is not
                        // possible in general to find an unambiguous common super interface, due to multiple
                        // inheritance). Because of this limitation, we need to relax the subtyping check here
                        // if 'value' is an interface.
                        return Object.class.isAssignableFrom(getClass(type));
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return false;
                }
            default:
                throw new AssertionError();
        }
    }

    protected boolean isAssignableFrom(final Type type1, final Type type2) {
        if (type1.equals(type2)) {
            return true;
        }
        return getClass(type1).isAssignableFrom(getClass(type2));
    }

    protected Class<?> getClass(final Type type) {
        try {
            if (type.getSort() == Type.ARRAY) {
                return Class.forName(type.getDescriptor().replace('/', '.'), false, loader);
            }
            return Class.forName(type.getClassName(), false, loader);
        }
        catch (ClassNotFoundException e) {
            throw new TypeNotPresentException(e.toString(), e);
        }
    }
}
```

#### NullabilityFrame

在下面的`NullabilityFrame`当中，重点是关注`initJumpTarget`方法。Overriding this method and changing the frame values allows implementing branch-sensitive analyses.

```java
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.tree.LabelNode;
import org.objectweb.asm.tree.analysis.Frame;

public class NullabilityFrame extends Frame<NullabilityValue> {
    public NullabilityFrame(int numLocals, int numStack) {
        super(numLocals, numStack);
    }

    public NullabilityFrame(NullabilityFrame frame) {
        super(frame);
    }

    @Override
    public void initJumpTarget(int opcode, LabelNode target) {
        // 首先，处理自己的代码逻辑
        int stackIndex = getStackSize();
        NullabilityValue oldValue = getStack(stackIndex);
        switch (opcode) {
            case Opcodes.IFNULL: {
                if (target == null) {
                    updateFrame(oldValue, Nullability.NOT_NULL);
                }
                else {
                    updateFrame(oldValue, Nullability.NULL);
                }
                break;
            }
            case Opcodes.IFNONNULL: {
                if (target == null) {
                    updateFrame(oldValue, Nullability.NULL);
                }
                else {
                    updateFrame(oldValue, Nullability.NOT_NULL);
                }
                break;
            }
        }

        // 其次，调用父类的方法实现
        super.initJumpTarget(opcode, target);
    }

    private void updateFrame(NullabilityValue oldValue, Nullability newState) {
        NullabilityValue newValue = new NullabilityValue(oldValue.getType(), newState);
        int numLocals = getLocals();
        for (int i = 0; i < numLocals; i++) {
            NullabilityValue currentValue = getLocal(i);
            if (oldValue == currentValue) {
                setLocal(i, newValue);
            }
        }

        int numStack = getMaxStackSize();
        for (int i = 0; i < numStack; i++) {
            NullabilityValue currentValue = getStack(i);
            if (oldValue == currentValue) {
                setStack(i, newValue);
            }
        }
    }
}
```

#### NullabilityAnalyzer

在下面的`NullabilityAnalyzer`当中，重点是关注`newFrame`方法，它使用`NullabilityFrame`替换掉了`Frame`类的实现：

```java
import org.objectweb.asm.tree.analysis.Analyzer;
import org.objectweb.asm.tree.analysis.Frame;
import org.objectweb.asm.tree.analysis.Interpreter;

public class NullabilityAnalyzer extends Analyzer<NullabilityValue> {
    public NullabilityAnalyzer(Interpreter<NullabilityValue> interpreter) {
        super(interpreter);
    }

    @Override
    protected Frame<NullabilityValue> newFrame(Frame<? extends NullabilityValue> frame) {
        return new NullabilityFrame((NullabilityFrame) frame);
    }

    @Override
    protected Frame<NullabilityValue> newFrame(int numLocals, int numStack) {
        return new NullabilityFrame(numLocals, numStack);
    }
}
```

#### NullabilityDiagnosis

在`NullabilityDiagnosis`类当中，主要的逻辑也是判断operand stack上的某一个元素是否可能为`null`值：

```java
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.AbstractInsnNode;
import org.objectweb.asm.tree.InsnList;
import org.objectweb.asm.tree.MethodInsnNode;
import org.objectweb.asm.tree.MethodNode;
import org.objectweb.asm.tree.analysis.Analyzer;
import org.objectweb.asm.tree.analysis.AnalyzerException;
import org.objectweb.asm.tree.analysis.Frame;

import java.util.Arrays;

import static org.objectweb.asm.Opcodes.*;

public class NullabilityDiagnosis {
    public static int[] diagnose(String className, MethodNode mn) throws AnalyzerException {
        // 第一步，获取Frame信息
        Analyzer<NullabilityValue> analyzer = new NullabilityAnalyzer(new NullabilityInterpreter(Opcodes.ASM9));
        Frame<NullabilityValue>[] frames = analyzer.analyze(className, mn);

        // 第二步，判断是否为null或maybe-null，收集数据
        TIntArrayList intArrayList = new TIntArrayList();
        InsnList instructions = mn.instructions;
        int size = instructions.size();
        for (int i = 0; i < size; i++) {
            AbstractInsnNode insn = instructions.get(i);
            if (frames[i] != null) {
                NullabilityValue value = getTarget(insn, frames[i]);
                if (value == null) continue;
                if (value.getState() == Nullability.NULL || value.getState() == Nullability.NULLABLE) {
                    intArrayList.add(i);
                }
            }
        }

        // 第三步，将结果转换成int[]形式
        int[] array = intArrayList.toNativeArray();
        Arrays.sort(array);
        return array;
    }

    private static NullabilityValue getTarget(AbstractInsnNode insn, Frame<NullabilityValue> frame) {
        int opcode = insn.getOpcode();
        switch (opcode) {
            case GETFIELD:
            case ARRAYLENGTH:
            case MONITORENTER:
            case MONITOREXIT:
                return getStackValue(frame, 0);
            case PUTFIELD:
                return getStackValue(frame, 1);
            case INVOKEVIRTUAL:
            case INVOKESPECIAL:
            case INVOKEINTERFACE:
                String desc = ((MethodInsnNode) insn).desc;
                return getStackValue(frame, Type.getArgumentTypes(desc).length);

        }
        return null;
    }

    private static NullabilityValue getStackValue(Frame<NullabilityValue> frame, int index) {
        int top = frame.getStackSize() - 1;
        return index <= top ? frame.getStack(top - index) : null;
    }
}
```

### 进行分析

```java
public class HelloWorldAnalysisTree {
    public static void main(String[] args) throws Exception {
        String relative_path = "sample/HelloWorld.class";
        String filepath = FileUtils.getFilePath(relative_path);
        byte[] bytes = FileUtils.readBytes(filepath);

        //（1）构建ClassReader
        ClassReader cr = new ClassReader(bytes);

        //（2）生成ClassNode
        int api = Opcodes.ASM9;
        ClassNode cn = new ClassNode(api);

        int parsingOptions = ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES;
        cr.accept(cn, parsingOptions);

        //（3）进行分析
        String className = cn.name;
        List<MethodNode> methods = cn.methods;
        MethodNode mn = methods.get(1);
        int[] array = NullabilityDiagnosis.diagnose(className, mn);
        System.out.println(Arrays.toString(array));
        BoxDrawingUtils.printInstructionLinks(mn.instructions, array);
    }
}
```

输出结果：

```text
[13]
      000: aload_1
      001: ifnonnull L0
      002: getstatic System.out
      003: ldc "str is null"
      004: invokevirtual PrintStream.println
      005: goto L1
      006: L0
      007: getstatic System.out
      008: ldc "str is not null"
      009: invokevirtual PrintStream.println
      010: L1
      011: getstatic System.out
      012: aload_1
├──── 013: invokevirtual String.trim
      014: invokevirtual PrintStream.println
      015: return
```

## 测试用例

### unknown

```java
public class HelloWorld {
    public void test(String str) {
        System.out.println(str.trim());
    }
}
```

### not-null

```java
public class HelloWorld {
    public void test() {
        String str = "ABC";
        System.out.println(str.trim());
    }
}
```

### null

```java
public class HelloWorld {
    public void test() {
        String str = null;
        System.out.println(str.trim());
    }
}
```

### if: not-null+null=nullable

```java
public class HelloWorld {
    public void test(String str) {
        // unknown
        if (str == null) {
            // null
            System.out.println("str is null");
        }
        else {
            // not-null
            System.out.println("str is not null");
        }
        // nullable
        System.out.println(str.trim());
    }
}
```

### Infeasible Paths

```java
public class HelloWorld {
    public void test(String str) {
        boolean flag;
        if (str != null) {
            flag = true;
        }
        else {
            flag = false;
        }

        if (flag) {
            // flag记录了str的状态，因此不会出现NullPointerException异常
            int length = str.length();
            System.out.println(length);
        }
    }
}
```

## 总结

本文内容总结如下：

- 第一点，使用unknown、not-null、null和nullable四个状态对潜在`NullPointerException`进行分析。
- 第二点，代码示例，进行两个版本的实现。第一个版本，代码比较简单，实现的功能也比较简单；第二个版本，代码比较复杂，实现的功能也相对较强。
- 第三点，对于`NullPointerException`进行分析，仍然有很多改进的空间。在一些特殊情况下，本文呈现的思路无法进行解决。
