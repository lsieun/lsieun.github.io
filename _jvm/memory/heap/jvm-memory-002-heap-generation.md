---
title: "堆：分代（内存细分）"
sequence: "102"
---

现代垃圾回收器大部分都基于分代收集理论设计

## 分代的变化

### Java 7 及之前

Java 7 及之前堆内存逻辑上分为三部分：新生区 + 老年区 + 永久区

- Young Generation Space 新生区 Young/New
    - 又被划分为 Eden 区和 Survivor 区
- Tenure Generation Space 养老区 Old/Tenure
- Permanent Space 永久区 Perm

### Java 8 及之后

Java 8 及之后堆内存逻辑上分为三部分：新生区 + 养老区 + 元空间

- Young Generation Space 新生区 Young/New
    - 又被划分为 Eden 区和 Survivor 区
- Tenure Generation Space 养老区 Old/Tenure
- Meta Space 元空间 Meta

## 年轻代和老年代

### 相对比例

注意，一般情况下不会去修改“新生代与老年代”的比例；除非特殊情况。

配置新生代与老年代在堆结构的占比：

- 默认 `-XX:NewRatio=2`，表示新生代占 1，老年代占 2，新生代占整个堆的 1/3
- 可以修改成 `-XX:NewRatio=4`，表示新生代占 1，老年代占 4，新生代占整个堆的 1/5

```text
-Xms10m -Xmx10m -XX:NewRatio=4 -XX:+PrintGCDetails
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

输出结果：

```text
[GC (Allocation Failure) [PSYoungGen: 1024K->504K(1536K)] 1024K->584K(9728K), 0.0007269 secs] [Times: user=0.05 sys=0.05, real=0.00 secs] 
Hello World
Heap
 PSYoungGen      total 1536K, used 1185K [0x00000000ffe00000, 0x0000000100000000, 0x0000000100000000)
  eden space 1024K, 66% used [0x00000000ffe00000,0x00000000ffeaa4e0,0x00000000fff00000)
  from space 512K, 98% used [0x00000000fff00000,0x00000000fff7e010,0x00000000fff80000)
  to   space 512K, 0% used [0x00000000fff80000,0x00000000fff80000,0x0000000100000000)
 ParOldGen       total 8192K, used 80K [0x00000000ff600000, 0x00000000ffe00000, 0x00000000ffe00000)
  object space 8192K, 0% used [0x00000000ff600000,0x00000000ff614040,0x00000000ffe00000)
 Metaspace       used 3195K, capacity 4496K, committed 4864K, reserved 1056768K
  class space    used 347K, capacity 388K, committed 512K, reserved 1048576K
```

也可以使用 `jinfo` 来查看：

```text
jinfo -flag NewRatio <pid>
```

```text
jinfo -flag NewRatio 1234
```

### 绝对数值

可以使用选项 `-Xmn` 设置新生代最大内存大小

- 这个参数一般使用默认值就可以了

```text
-Xms60m -Xmx60m -XX:+PrintGCDetails
```

```java
public class HelloWorldRun {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

从下面的输出结果，我们可以看到：Young Generation Space 占用了 20M，而 Tenure Generation Space 占用了 40MB

```text
Heap
 PSYoungGen      total 17920K, used 2151K [0x00000000fec00000, 0x0000000100000000, 0x0000000100000000)
  eden space 15360K, 14% used [0x00000000fec00000,0x00000000fee19d58,0x00000000ffb00000)
  from space 2560K, 0% used [0x00000000ffd80000,0x00000000ffd80000,0x0000000100000000)
  to   space 2560K, 0% used [0x00000000ffb00000,0x00000000ffb00000,0x00000000ffd80000)
 ParOldGen       total 40960K, used 0K [0x00000000fc400000, 0x00000000fec00000, 0x00000000fec00000)
  object space 40960K, 0% used [0x00000000fc400000,0x00000000fc400000,0x00000000fec00000)
 Metaspace       used 3218K, capacity 4496K, committed 4864K, reserved 1056768K
  class space    used 353K, capacity 388K, committed 512K, reserved 1048576K
```

第二次测试，使用 `-Xmn` 选项：

```text
-Xms60m -Xmx60m -Xmn10m -XX:+PrintGCDetails
```

从下面的输出结果，可以看到：Young Generation Space 占用了 10M，而 Tenure Generation Space 占用了 60MB

```text
Heap
 PSYoungGen      total 9216K, used 2028K [0x00000000ff600000, 0x0000000100000000, 0x0000000100000000)
  eden space 8192K, 24% used [0x00000000ff600000,0x00000000ff7fb3d0,0x00000000ffe00000)
  from space 1024K, 0% used [0x00000000fff00000,0x00000000fff00000,0x0000000100000000)
  to   space 1024K, 0% used [0x00000000ffe00000,0x00000000ffe00000,0x00000000fff00000)
 ParOldGen       total 51200K, used 0K [0x00000000fc400000, 0x00000000ff600000, 0x00000000ff600000)
  object space 51200K, 0% used [0x00000000fc400000,0x00000000fc400000,0x00000000ff600000)
 Metaspace       used 3176K, capacity 4496K, committed 4864K, reserved 1056768K
  class space    used 345K, capacity 388K, committed 512K, reserved 1048576K
```

### 相对比例 VS. 绝对值

对比一下 `-XX:NewRatio` 和 `-Xmn` 选项哪个起作用：

```text
-Xms60m -Xmx60m -XX:NewRatio=2 -Xmn10m -XX:+PrintGCDetails
```

从下面的输出结果，可以看到：绝对值选项 `-Xmn` 发挥了作用

```text
Heap
 PSYoungGen      total 9216K, used 2028K [0x00000000ff600000, 0x0000000100000000, 0x0000000100000000)
  eden space 8192K, 24% used [0x00000000ff600000,0x00000000ff7fb3d0,0x00000000ffe00000)
  from space 1024K, 0% used [0x00000000fff00000,0x00000000fff00000,0x0000000100000000)
  to   space 1024K, 0% used [0x00000000ffe00000,0x00000000ffe00000,0x00000000fff00000)
 ParOldGen       total 51200K, used 0K [0x00000000fc400000, 0x00000000ff600000, 0x00000000ff600000)
  object space 51200K, 0% used [0x00000000fc400000,0x00000000fc400000,0x00000000ff600000)
 Metaspace       used 3193K, capacity 4496K, committed 4864K, reserved 1056768K
  class space    used 347K, capacity 388K, committed 512K, reserved 1048576K
```

## Eden 和 Survivor

在 HotSpot 中，Eden 空间和另外两个 Survivor 空间的默认比例是 `8:1:1`。

可以通过 `-XX:SurvivorRatio` 调整这个空间比例，比如 `-XX:SurvivorRatio=8`

**几乎**所有的 Java 对象都是在 Eden 区被 new 出来的。例如，一个对象占用的空间非常大，在 Eden 区存放不下，它会直接进入老年代区域（Tenure
Generation Space）。

绝大部分的 Java 对象的销毁都在新生代（Young Generation Space）进行了

- IBM 公司的专门研究表明，新生代中 80% 的对象都是“朝生夕死”

我们去查看 Eden 与 Survivor 比例的时候发现是 6:1，这个时候需要关闭“自适应的内存分配策略”，但是并不起作用：

```text
-XX:-UseAdaptiveSizePolicy
```

需要明确的指明：

```text
-XX:SurvivorRatio=8
```

```text
jinfo -flag SurvivorRatio <pid>
```
