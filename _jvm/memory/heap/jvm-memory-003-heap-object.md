---
title: "对象视角：分配、晋升、担保"
sequence: "103"
---

## 一般过程

为新对象分配内存是一个非常严谨的任务，
JVM 的设计者们不仅需要考虑内存如何分配、在哪里分配等；
并且由于内存分配算法与内存回收算法密切相关，
所以还需要考虑 GC 执行完内存回收后是否会在内存空间中产生内存碎片。

- 第一步，new 的对象先放在 Eden 区，此区有大小限制。
- 第二步，当 Eden 的空间填满时，程序又需要创建对象，JVM 的垃圾回收器将对 Eden 区进行垃圾回收（Minor GC），
  将 Eden 区中不再被其他对象所引用的对象进行销毁；再加载新的对象放到 Eden 区
- 第三步，然后将 Eden 区中的剩余对象移动到 Survivor 0 区
- 第四步，如果再次触发垃圾回收，此时上次幸存下来的、存放到 Survivor 0 区的，如果没有回收，就会放到 Survivor 1 区
- 第五步，如果再次经历垃圾回收，此时会重新放回 Survivor 0 区，接着再去 Survivor 1 区
- 第六步，什么时候能去养老区？可以设置次数，默认是 15 次
    - `-XX:MaxTenuringThreshold=<n>`
- 第七步，在养老区，相对悠闲。当养老区内存不足时，再次触发 Major GC，进行养老区的内存清理。
- 第八步，若养老区执行了 Major GC 之后，仍然发现无法进行对象的保存，就会产生 OOM 异常。

```text
jinfo -flag MaxTenuringThreshold <pid>
```

```text
jinfo -flag MaxTenuringThreshold 9964
-XX:MaxTenuringThreshold=15
```

## 对象分配的特殊情况

分配的对象比较大，可能会直接进行入老年代区域（Old Generation Space）。

## 对象提升（Promotion）规则

针对不同年龄段的对象分配规则：

- 优先分配到 Eden
- 大对象直接分配到老年代，尽量避免程序中出现过多的大对象
- 长期存储的对象分配到老年代
- 动态对象年龄判断
    - 如果 Survivor 区中相同年龄的所有对象大小的总和大于 Survivor 空间的一半，
      年龄大于或等于该年龄的对象可以直接进入老年代，无需等到 MaxTenuringThreshold 中要求的年龄
- 空间分配担保
    - `-XX:HandlePromotionFailure`

```text
-Xms60m -Xmx60m -XX:NewRatio=2 -XX:SurvivorRatio=8 -XX:+PrintGCDetails
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        byte[] bytes = new byte[1024 * 1024 * 20];
    }
}
```

创建了一个 20MB 的 `bytes` 数组，它会直接存放到 Old Generation Space 当中：

```text
| Eden 16MB | S0 2MB | S1 2MB | Old Generation 40MB |
```

```text
Heap
 PSYoungGen      total 18432K, used 2343K [0x00000000fec00000, 0x0000000100000000, 0x0000000100000000)
  eden space 16384K, 14% used [0x00000000fec00000,0x00000000fee49d28,0x00000000ffc00000)
  from space 2048K, 0% used [0x00000000ffe00000,0x00000000ffe00000,0x0000000100000000)
  to   space 2048K, 0% used [0x00000000ffc00000,0x00000000ffc00000,0x00000000ffe00000)
 ParOldGen       total 40960K, used 20480K [0x00000000fc400000, 0x00000000fec00000, 0x00000000fec00000)
  object space 40960K, 50% used [0x00000000fc400000,0x00000000fd800010,0x00000000fec00000)
 Metaspace       used 3301K, capacity 4496K, committed 4864K, reserved 1056768K
  class space    used 359K, capacity 388K, committed 512K, reserved 1048576K
```

## 空间分配担保

在发生 Minor GC 之前，虚拟机会检查老年代最大可用的连续空间是否大于新生代所有对象的总空间。

- 如果大于，则此次 Minor GC 是安全的
- 如果小于，则虚拟机会查看 `-XX:HandlePromotionFailure` 设置值是否允担保失败。
    - 如果 `HandlePromotionFailure=true`，那么会继续**检查老年代最大可用连续空间是否大于历次晋升到老年代的对象的平均大小**。
        - 如果大于，则尝试进行一次 Minor GC，但这次 Minor GC 依然是有风险的；
        - 如果小于，则进行一次 Full GC。
    - 如果 `HandlePromotionFailure=false`，则进行一次 Full GC。

历史版本

在 JDK6 Update 24 之后，`HandlePromotionFailure` 参数（失效）不会再影响到虚拟机的空间分配担保策略，
观察 openJDK 中的源码变化，虽然源码中还定义了 HandlePromotionFailure 参数，但是在代码中已经不会再使用它。

JDK6 Update 24 之后的规则变为**只要老年代的连续空间大于新生代对象总大小**或者**历次晋升的平均大小就会进行 Minor GC**，
否则将进行 Full GC。即 `HandlePromotionFailure=true`

## 堆是分配对象的唯一选择么？

在《深入理解 Java 虚拟机》中关于 Java 堆内存有这样一段描述：

随着 JIT 编译期的发展与逃逸分析技术逐渐成熟，栈上分配、标量替换优化技术将会导致一些微妙的变化，
所有的对象都分配到堆上也渐渐变得不那么“绝对”了。

在 Java 虚拟机中，对象是在 Java 堆中分配内存的，这是一个普遍的常识。
但是，有一种特殊情况，那就是如果经过**逃逸分析（Escape Analysis）**后发现，
一个对象并没有逃逸出方法的话，那么就可能被优化成栈上分配。
这样就无需在堆上分配内存，也无须进行垃圾回收了。这也是最常见的**堆外存储技术**。

此外，前面提到的基于 OpenJDK 深度定制的 TaoBao VM，
其中创新的 GCIH（GC invisible heap）技术实现 off-heap，
将生命周期较长的 Java 对象从 heap 中移至 heap 外，
并且 GC 不能管理 GCIH 内部的 Java 对象，
以此达到降低 GC 的回收频率和提升 GC 的回收效率的目的。

### 逃逸分析

一般情况下，所有的对象都是在堆内存中分配的。
然而，在某些情况下，可以确定一个对象不会“逃逸”到方法之外；也就是说，该对象只在方法内部使用，不会被方法外部引用。
如果能够确定这样的对象不会逃逸，那么 JVM 就可以选择在栈上分配该对象的内存，而不是在堆上。

**逃逸分析（Escape Analysis）**是 Java 虚拟机（JVM）中的一种优化技术，
它用于分析对象在程序中的生命周期和作用域，以确定何时可以安全地避免对对象进行堆内存分配。

逃逸分析的主要优点是能够减少堆内存的压力。
因为堆内存是所有线程共享的，所以如果能够将对象分配在栈上而不是堆上，就可以减少线程之间的竞争，提高程序的性能。
此外，逃逸分析还可以帮助 JVM 更好地管理内存，例如，通过更早地释放不再使用的对象，以释放内存空间。

然而，需要注意的是，逃逸分析是一种**优化技术**，它的执行结果可能会因 JVM 的实现和版本而异。
此外，逃逸分析可能不会在所有情况下都产生优化效果。
在某些情况下，即使进行了逃逸分析，JVM 可能仍然需要在堆上分配对象。
因此，开发人员在使用逃逸分析时需要谨慎处理。

- 如何将堆上的对象分配到栈，需要使用逃逸分析手段。
- 这是一种可以有效减少 Java 程序中同步负载和内存堆分配压力的跨函数全局数据流分析算法。
- 通过逃逸分析，Java Hotspot 编译器能够分析出一个新的对象的引用的使用范围从而决定是否要将这个对象分配到堆上。
- 逃逸分析的基本行为就是分析对象动态作用域：
    - 当一个对象在方法中被定义后，对象只在方法内部使用，则认为没有发生逃逸。
    - 当一个对象在方法中被定义后，它被外部方法所引用，则认为发生逃逸。例如作为调用参数传递到其他地方中。

