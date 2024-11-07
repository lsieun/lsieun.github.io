---
title: "案例：日期格式化方法性能测试"
sequence: "104"
---

## 问题

在 JDK 8 中，可以使用 Date 进行日期的格式化，也可以使用 LocalDateTime 进行格式化，使用 JMH 对比这两种格式化的性能。

## 代码

```java
import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.infra.Blackhole;
import org.openjdk.jmh.results.format.ResultFormatType;
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.RunnerException;
import org.openjdk.jmh.runner.options.Options;
import org.openjdk.jmh.runner.options.OptionsBuilder;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.concurrent.TimeUnit;

// 预热次数 时间
@Warmup(iterations = 5, time = 1)
// 启动多个进程
@Fork(value = 1, jvmArgsAppend = {"-Xms1g", "-Xmx1g"})
// 指定显示结果
@BenchmarkMode(Mode.AverageTime)
// 指定显示结果单位
@OutputTimeUnit(TimeUnit.NANOSECONDS)
// 变量共享范围
@State(Scope.Benchmark)
public class DateBenchmark {
    private static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
    private final Date date = new Date();

    private static final ThreadLocal<DateFormat> dateFormatThreadLocal = new ThreadLocal<>();
    private final LocalDateTime localDateTime = LocalDateTime.now();

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern(DATE_FORMAT);

    // 初始化方法
    @Setup
    public void setUp() {
        DateFormat df = new SimpleDateFormat(DATE_FORMAT);
        dateFormatThreadLocal.set(df);
    }

    // 第 1 个测试，每次都要创建 SimpleDateFormat 对象
    @Benchmark
    public void testDate(Blackhole bh) {
        DateFormat df = new SimpleDateFormat(DATE_FORMAT);
        String str = df.format(date);
        bh.consume(str);
    }

    // 第 2 个测试，使用 ThreadLocal 将 SimpleDateFormat 存储起来
    @Benchmark
    public void testDateThreadLocal(Blackhole bh) {
        String str = dateFormatThreadLocal.get().format(date);
        bh.consume(str);
    }

    // 第 3 个测试，每次都创建 DateTimeFormatter 对象
    @Benchmark
    public void testLocalDateTime(Blackhole bh) {
        String str = localDateTime.format(DateTimeFormatter.ofPattern(DATE_FORMAT));
        bh.consume(str);
    }

    // 第 4 个测试，将 DateTimeFormatter 保存起来
    @Benchmark
    public void testLocalDateTimeStatic(Blackhole bh) {
        String str = localDateTime.format(dateTimeFormatter);
        bh.consume(str);
    }

    public static void main(String[] args) throws RunnerException {
        Options options = new OptionsBuilder()
                .include(DateBenchmark.class.getName())
                .forks(1)
                .resultFormat(ResultFormatType.JSON) // 这里输出 JSON 格式的信息
                .build();
        new Runner(options).run();
    }
}
```

## 显示结果

```text
https://jmh.morethan.io
```

![](/assets/images/java/jmh/jmh-visualizer-date-benchmark.png)


## 总结

Date 对象使用的 SimpleDateFormat 是线程不安全的，所以每次需要重新创建对象或者将对象放入 ThreadLocal 中进行保存。
其中，每次重新创建对象性能比较差，将对象放入 ThreadLocal 之后性能相对还是比较好的。

LocalDateTime 对象使用的 DateTimeFormatter 线程安全，并且性能较好。
如果将 DateTimeFormatter 对象保存下来，性能可以得到进一步的提升。
