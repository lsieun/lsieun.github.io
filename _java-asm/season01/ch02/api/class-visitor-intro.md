---
title: "ClassVisitor 介绍"
sequence: "201"
---

[上级目录]({% link _posts/2021-06-01-java-asm-index.md %})

在 ASM Core API 中，最重要的三个类就是 `ClassReader`、`ClassVisitor` 和 `ClassWriter` 类。在进行 Class Generation 操作的时候，`ClassVisitor` 和 `ClassWriter` 这两个类起着重要作用，而并不需要 `ClassReader` 类的参与。在本文当中，我们将对 `ClassVisitor` 类进行介绍。

![ASM 里的核心类 ](/assets/images/java/asm/asm-core-classes.png)

## ClassVisitor 类

### class info

第一个部分，`ClassVisitor` 是一个抽象类。
由于 `ClassVisitor 类 ` 是一个 `abstract` 类，所以不能直接使用 `new` 关键字创建 `ClassVisitor` 对象。

```java
public abstract class ClassVisitor {
}
```

同时，由于 `ClassVisitor` 类是一个 `abstract` 类，要想使用它，就必须有具体的子类来继承它。

第一个比较常见的 `ClassVisitor` 子类是 `ClassWriter` 类，属于 Core API：

```java
public class ClassWriter extends ClassVisitor {
}
```

第二个比较常见的 `ClassVisitor` 子类是 `ClassNode` 类，属于 Tree API：

```java
public class ClassNode extends ClassVisitor {
}
```

三个类的关系如下：

- `org.objectweb.asm.ClassVisitor`
    - `org.objectweb.asm.ClassWriter`
    - `org.objectweb.asm.tree.ClassNode`

### fields

第二个部分，`ClassVisitor` 类定义的字段有哪些。

```java
public abstract class ClassVisitor {
    protected final int api;
    protected ClassVisitor cv;
}
```

- `api` 字段：它是一个 `int` 类型的数据，指出了当前使用的 ASM 版本，其可取值为 `Opcodes.ASM4`~`Opcodes.ASM9`。我们使用的 ASM 版本是 9.0，因此我们在给 `api` 字段赋值的时候，选择 `Opcodes.ASM9` 就可以了。
- `cv` 字段：它是一个 `ClassVisitor` 类型的数据，它的作用是将多个 `ClassVisitor` 串连起来。

![](/assets/images/java/asm/class-visitor-cv-field.png)

### constructors

第三个部分，`ClassVisitor` 类定义的构造方法有哪些。

```java
public abstract class ClassVisitor {
    public ClassVisitor(final int api) {
        this(api, null);
    }

    public ClassVisitor(final int api, final ClassVisitor classVisitor) {
        this.api = api;
        this.cv = classVisitor;
    }
}
```

### methods

第四个部分，`ClassVisitor` 类定义的方法有哪些。在 ASM 当中，使用到了 Visitor Pattern（访问者模式），所以 `ClassVisitor` 当中许多的 `visitXxx()` 方法。

虽然，在 `ClassVisitor` 类当中，有许多 `visitXxx()` 方法，但是，我们只需要关注这 4 个方法：`visit()`、`visitField()`、`visitMethod()` 和 `visitEnd()`。

为什么只关注这 4 个方法呢？因为这 4 个方法是 `ClassVisitor` 类的精髓或骨架，在这个“骨架”的基础上，其它的 `visitXxx()` 都容易扩展；同时，将 `visitXxx()` 方法缩减至 4 个，也能减少学习过程中的认知负担，学起来更容易。

```java
public abstract class ClassVisitor {
    public void visit(
        final int version,
        final int access,
        final String name,
        final String signature,
        final String superName,
        final String[] interfaces);
    public FieldVisitor visitField( // 访问字段
        final int access,
        final String name,
        final String descriptor,
        final String signature,
        final Object value);
    public MethodVisitor visitMethod( // 访问方法
        final int access,
        final String name,
        final String descriptor,
        final String signature,
        final String[] exceptions);
    public void visitEnd();
    // ......
}
```

在 `ClassVisitor` 的 `visit()` 方法、`visitField()` 方法和 `visitMethod()` 方法中都带有 `signature` 参数。这个 `signature` 参数与“泛型”密切相关；换句话说，如果处理的是一个带有泛型信息的类、字段或方法，那么就需要给 `signature` 参数提供一定的值；如果处理的类、字段或方法不带有“泛型”信息，那么将 `signature` 参数设置为 `null` 就可以了。在本次课程当中，我们不去考虑“泛型”相关的内容，所以我们都将 `signature` 参数设置成 `null` 值。

如果大家对 `signature` 参数感兴趣，我们可以使用之前介绍的 `PrintASMCodeCore` 类去打印一下某个泛型类的 ASM 代码。例如，`java.lang.Comparable` 是一个泛型接口，我们就可以使用 `PrintASMCodeCore` 类来打印一下它的 ASM 代码，从来查看 `signature` 参数的值是什么。

## 方法的调用顺序

在 `ClassVisitor` 类当中，定义了多个 `visitXxx()` 方法。这些 `visitXxx()` 方法，遵循一定的调用顺序（可参考 API 文档）：

```text
visit
[visitSource][visitModule][visitNestHost][visitPermittedSubclass][visitOuterClass]
(
 visitAnnotation |
 visitTypeAnnotation |
 visitAttribute
)*
(
 visitNestMember |
 visitInnerClass |
 visitRecordComponent |
 visitField |
 visitMethod
)* 
visitEnd
```

其中，涉及到一些符号，它们的含义如下：

- `[]`: 表示最多调用一次，可以不调用，但最多调用一次。
- `()` 和 `|`: 表示在多个方法之间，可以选择任意一个，并且多个方法之间不分前后顺序。
- `*`: 表示方法可以调用 0 次或多次。

在本次课程当中，我们只关注 `ClassVisitor` 类当中的 `visit()` 方法、`visitField()` 方法、`visitMethod()` 方法和 `visitEnd()` 方法这 4 个方法，所以上面的方法调用顺序可以简化如下：

```text
visit
(
 visitField |
 visitMethod
)* 
visitEnd
```

也就是说，先调用 `visit()` 方法，接着调用 `visitField()` 方法或 `visitMethod()` 方法，最后调用 `visitEnd()` 方法。

```text
                ┌─── visit()
                │
                ├─── visitField()
ClassVisitor ───┤
                ├─── visitMethod()
                │
                └─── visitEnd()
```

## visitXxx() 方法与 ClassFile

`ClassVisitor` 的 `visitXxx()` 方法与 `ClassFile` 之间存在对应关系：

```text
ClassVisitor.visitXxx() --- .class --- ClassFile
```

在 `ClassVisitor` 中定义的 `visitXxx()` 方法，并不是凭空产生的，这些方法存在的目的就是为了生成一个合法的 `.class` 文件，而这个 `.class` 文件要符合 ClassFile 的结构，所以这些 `visitXxx()` 方法与 ClassFile 的结构密切相关。

### visit() 方法

```text
public void visit(
    final int version,
    final int access,
    final String name,
    final String signature,
    final String superName,
    final String[] interfaces);
```

```text
ClassFile {
    u4             magic;
    u2             minor_version;
    u2             major_version;
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;
    u2             this_class;
    u2             super_class;
    u2             interfaces_count;
    u2             interfaces[interfaces_count];
    u2             fields_count;
    field_info     fields[fields_count];
    u2             methods_count;
    method_info    methods[methods_count];
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

<table>
<thead>
<tr>
    <th>ClassVisitor 方法</th>
    <th>参数</th>
    <th>ClassFile</th>
</tr>
</thead>
<tbody>
<tr>
    <td rowspan="6"><code>ClassVisitor.visit()</code></td>
    <td><code>version</code></td>
    <td><code>minor_version</code>和<code>major_version</code></td>
</tr>
<tr>
    <td><code>access</code></td>
    <td><code>access_flags</code></td>
</tr>
<tr>
    <td><code>name</code></td>
    <td><code>this_class</code></td>
</tr>
<tr>
    <td><code>signature</code></td>
    <td><code>attributes</code>的一部分信息</td>
</tr>
<tr>
    <td><code>superName</code></td>
    <td><code>super_class</code></td>
</tr>
<tr>
    <td><code>interfaces</code></td>
    <td><code>interfaces_count</code>和<code>interfaces</code></td>
</tr>
<tr>
    <td><code>ClassVisitor.visitField()</code></td>
    <td></td>
    <td><code>field_info</code></td>
</tr>
<tr>
    <td><code>ClassVisitor.visitMethod()</code></td>
    <td></td>
    <td><code>method_info</code></td>
</tr>
</tbody>
</table>

### visitField() 方法

```text
public FieldVisitor visitField( // 访问字段
    final int access,
    final String name,
    final String descriptor,
    final String signature,
    final Object value);
```

```text
field_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

<table>
<thead>
<tr>
    <th>ClassVisitor 方法</th>
    <th>参数</th>
    <th>field_info</th>
</tr>
</thead>
<tbody>
<tr>
    <td rowspan="5"><code>ClassVisitor.visitField()</code></td>
    <td><code>access</code></td>
    <td><code>access_flags</code></td>
</tr>
<tr>
    <td><code>name</code></td>
    <td><code>name_index</code></td>
</tr>
<tr>
    <td><code>descriptor</code></td>
    <td><code>descriptor_index</code></td>
</tr>
<tr>
    <td><code>signature</code></td>
    <td><code>attributes</code>的一部分信息</td>
</tr>
<tr>
    <td><code>value</code></td>
    <td><code>attributes</code>的一部分信息</td>
</tr>
</tbody>
</table>

### visitMethod() 方法

```text
public MethodVisitor visitMethod( // 访问方法
    final int access,
    final String name,
    final String descriptor,
    final String signature,
    final String[] exceptions);
```

```text
method_info {
    u2             access_flags;
    u2             name_index;
    u2             descriptor_index;
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

<table>
<thead>
<tr>
    <th>ClassVisitor 方法</th>
    <th>参数</th>
    <th>method_info</th>
</tr>
</thead>
<tbody>
<tr>
    <td rowspan="5"><code>ClassVisitor.visitMethod()</code></td>
    <td><code>access</code></td>
    <td><code>access_flags</code></td>
</tr>
<tr>
    <td><code>name</code></td>
    <td><code>name_index</code></td>
</tr>
<tr>
    <td><code>descriptor</code></td>
    <td><code>descriptor_index</code></td>
</tr>
<tr>
    <td><code>signature</code></td>
    <td><code>attributes</code>的一部分信息</td>
</tr>
<tr>
    <td><code>exceptions</code></td>
    <td><code>attributes</code>的一部分信息</td>
</tr>
</tbody>
</table>

### visitEnd() 方法

`visitEnd()` 方法，它是这些 `visitXxx()` 方法当中最后一个调用的方法。

为什么 `visitEnd()` 方法是“最后一个调用的方法”呢？是因为在 `ClassVisitor` 当中，定义了多个 `visitXxx()` 方法，这些个 `visitXxx()` 方法之间要遵循一个先后调用的顺序，而 `visitEnd()` 方法是最后才去调用的。

等到 `visitEnd()` 方法调用之后，就表示说再也不去调用其它的 `visitXxx()` 方法了，所有的“工作”已经做完了，到了要结束的时候了。

```text
/*
 * Visits the end of the class.
 * This method, which is the last one to be called,
 * is used to inform the visitor that all the fields and methods of the class have been visited.
 */
public void visitEnd() {
    if (cv != null) {
        cv.visitEnd();
    }
}
```


## 总结

本文主要对 `ClassVisitor` 类进行介绍，内容总结如下：

- 第一点，介绍了 `ClassVisitor` 类的不同部分。我们去了解这个类不同的部分，是为了能够熟悉 `ClassVisitor` 这个类。
- 第二点，在 `ClassVisitor` 类当中，定义了许多 `visitXxx()` 方法，这些方法的调用要遵循一定的顺序。
- 第三点，在 `ClassVisitor` 类当中，定义的 `visitXxx()` 方法中的参数与 ClassFile 结构密切相关。
