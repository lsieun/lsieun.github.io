---
title: "快速开始"
sequence: "102"
---

## 生成项目

第 1 步，创建基准测试项目：

```text
$ mvn archetype:generate \
  -DinteractiveMode=false \
  -DarchetypeGroupId=org.openjdk.jmh \
  -DarchetypeArtifactId=jmh-java-benchmark-archetype \
  -DgroupId=org.sample \
  -DartifactId=test \
  -Dversion=1.0
```

第 2 步，修改 POM 文件中的 JDK 版本号和 JMH 版本号

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <jmh.version>1.37</jmh.version>
    <javac.version>1.8</javac.version>
    <ubertar.name>benchmarks</ubertar.name>
</properties>
```

```xml
<dependencies>
    <dependency>
        <groupId>org.openjdk.jmh</groupId>
        <artifactId>jmh-core</artifactId>
        <version>${jmh.version}</version>
    </dependency>
    <dependency>
        <groupId>org.openjdk.jmh</groupId>
        <artifactId>jmh-generator-annprocess</artifactId>
        <version>${jmh.version}</version>
    </dependency>
</dependencies>
```

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-shade-plugin</artifactId>
            <version>3.5.1</version>
            <executions>
                <execution>
                    <phase>package</phase>
                    <goals>
                        <goal>shade</goal>
                    </goals>
                    <configuration>
                        <finalName>microbenchmarks</finalName>
                        <transformers>
                            <transformer
                                    implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                <mainClass>org.openjdk.jmh.Main</mainClass>
                            </transformer>
                        </transformers>
                        <filters>
                            <filter>
                                <artifact>*:*</artifact>
                                <excludes>
                                    <exclude>META-INF/services/javax.annotation.processing.Processor</exclude>
                                </excludes>
                            </filter>
                        </filters>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 代码

```java
import org.openjdk.jmh.annotations.*;

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
public class MyBenchmark {
    @Benchmark
    public int testMethod() {
        //
        int i = 0;
        i++;
        return i;
    }
}
```

## 运行测试

第 1 步，通过 Maven 的 verify 命令，检查代码问题并打成 Jar 包：

```text
$ mvn clean verify
```

第 2 步，执行基准测试：

```text
$ java -jar microbenchmarks.jar
```
