---
title: "Java SPI：Service Provider Interface"
sequence: "102"
---

## 什么是SPI

Java SPI是在Java 6引入的。

> 时间：Java 6

Java 6引入

SPI: Service Provider Interface

- Application
    - Service Provider Interface
        - Service Provider Implementation

ClassLoader的中resourceLoad机制中，加载META-INF/services的一个过程

## 核心概念

- 类层面的要求 service provider class
    - 子类实现，要提供无参构造方法。 The service provider classes must have a public, parameterless constructor so that they can be instantiated during loading.
- 配置层面 configuration file
    - 文件名称：`META-INF/services/<fully-qualified binary name of the service's type>`
    - 文件内容：The file contains a list of fully-qualified binary names of concrete provider classes, one per line.
    - 文件格式：The file must be encoded in UTF-8.

- service provider是service的具体实现，而configuration file是建立service和service provider之间的静态联系，
- runtime: 而`ServiceLoader`会根据configuration file在runtime建立service和service provider之间的动态联系。

The service architecture is made up of four parts:

– The **service** is a class or an interface.
– The **provider** is a concrete implementation of the service.
– The **consumer** is any piece of code that wants to use a service.
– The `ServiceLoader` creates and returns an instance of each provider of a given service to consumers.

## 工作原理

名字对比：

- ServiceLoader （小）
- ClassLoader （中）
- ResourceLoader（大）

实现思路：java.util.ServiceLoader.load(Class clazz)

application --- service loader: service --- service provider

利用Reflection和ClassLoader来实现


Service Provider ---> class ServiceLoader ---> ClassLoader ---> Service Implementation

How to select muliple service



Java 9的实现

Java 9 ServiceLoader添加了stream()方法

精简 ServiceLoader代码，生成自己的一份。

## 代码实现（Java 8）

```text
spi
├─── animal-company
│    ├─── out
│    └─── src
│         └─── com/animal/manga/TalkativeAnimal.java
├─── buyer
│    ├─── out
│    └─── src
│         └─── com/buyer/manga/Main.java
├─── cat-company
│    ├─── out
│    │    └─── META-INF/services/com.animal.manga.TalkativeAnimal
│    └─── src
│         └─── com/cat/manga/Doraemon.java
├─── dog-company
│    ├─── out
│    │    └─── META-INF/services/com.animal.manga.TalkativeAnimal
│    └─── src
│         └─── com/dog/manga/Inuyasha.java
└─── jars
     ├─── animal-manga.jar
     ├─── buyer.jar
     ├─── cat-manga.jar
     └─── dog-manga.jar
```

```text
#!/bin/bash
mkdir -p {animal-company,buyer,cat-company,dog-company}/{src,out}
mkdir    jars

mkdir -p animal-company/src/com/animal/manga/
touch    animal-company/src/com/animal/manga/TalkativeAnimal.java

mkdir -p buyer/src/com/buyer/manga/
touch    buyer/src/com/buyer/manga/Main.java

mkdir -p cat-company/src/com/cat/manga/
touch    cat-company/src/com/cat/manga/Doraemon.java

mkdir -p dog-company/src/com/dog/manga/
touch    dog-company/src/com/dog/manga/Inuyasha.java

mkdir -p {cat-company,dog-company}/src/META-INF/services/
touch    {cat-company,dog-company}/src/META-INF/services/com.animal.manga.TalkativeAnimal
```

TODO: Jar的文件结构，主要是包含META-INF/services

### animal-manga.jar

```java
package com.animal.manga;

public interface TalkativeAnimal {
    String getName();
    String talk();
}
```

编译：

```text
cd animal-company/
javac -d ./out/ src/com/animal/manga/TalkativeAnimal.java
cd out/
jar -cvf animal-manga.jar com/
```

生成Jar包：

```text
$ jar -cvf animal-pet.jar TalkativeAnimal.class
```

### buyer

```java
package com.buyer.manga;

import com.animal.manga.TalkativeAnimal;
import java.util.Iterator;
import java.util.ServiceLoader;

public class Main {
    public static void main(String[] args) {
        ServiceLoader<TalkativeAnimal> loader = ServiceLoader.load(TalkativeAnimal.class);
        Iterator<TalkativeAnimal> it = loader.iterator();
        System.out.println("Hello Manga!");
        while (it.hasNext()) {
            TalkativeAnimal animal = it.next();
            System.out.println(animal.getName() + ": " + animal.talk());
        }
    }
}
```

编译：

```text
cp animal-company/out/animal-manga.jar buyer/
cd buyer/
javac -cp ./out/animal-manga.jar -s ./src -d ./out/ ./src/com/buyer/manga/Main.java
```

生成Jar包：

```text
cd out/
jar -cvf buyer.jar com/
```

### cat-manga.jar

```java
package com.cat.manga;

import com.animal.manga.TalkativeAnimal;

public class Doraemon implements TalkativeAnimal {
    @Override
    public String getName() {
        return "哆啦A梦";
    }

    @Override
    public String talk() {
        return "时间就像一张网，你撒在哪里，你的收获就在哪里。";
    }
}
```

```text
cp jars/animal-manga.jar cat-company/
cd cat-company/
javac -cp animal-manga.jar -d ./out/ src/com/cat/manga/Doraemon.java
```

```text
com.cat.manga.Doraemon
```

```text
cd out/
jar -cvf cat-manga.jar com/ META-INF/
```

```text
cp cat-company/out/cat-manga.jar ./jars/
```

```text
$ java -cp "./jars/*" com.buyer.manga.Main
```

### dog-manga.jar

```java
package com.dog.manga;

import com.animal.manga.TalkativeAnimal;

public class Inuyasha implements TalkativeAnimal {
    @Override
    public String getName() {
        return "犬夜叉";
    }

    @Override
    public String talk() {
        return "命运的红线一旦断了，就再也接不上了。";
    }
}
```

```text
cp jars/animal-manga.jar dog-company/
cd dog-company/
javac -cp animal-manga.jar -d ./out/ src/com/dog/manga/Inuyasha.java
```

```text
com.dog.manga.Inuyasha
```

```text
cd out/
jar -cvf dog-manga.jar com/ META-INF/
```

```text
cp dog-company/out/dog-manga.jar ./jars/
```

```text
java -cp "./jars/*" com.buyer.manga.Main
```

## 代码示例（JDK 11 Module）

```text
#!/bin/bash
touch {animal-company,buyer,cat-company,dog-company}/src/module-info.java
```

### animal-manga.jar

```java
module animal.manga {
    exports com.animal.manga;
}
```

```text
cd animal-company/
javac -d ./out/ src/module-info.java src/com/animal/manga/TalktiveAnimal.java
```

```text
cd out/
jar --create --file animal-manga.jar module-info.class com/
```

### buyer.jar

```text
module buyer {
    requires animal.manga;
    
    uses com.animal.manga.TalktiveAnimal;
}
```

```text
cp jars/animal-manga.jar buyer/
javac --module-path animal-manga.jar -d ./out/ src/module-info.java src/com/buyer/manga/Main.java
```

```text
cd out/
jar --create --file buyer.jar -C ./out/ .
```

```text
java --module-path ./jars --module buyer/com.buyer.manga.Main
```

### cat-manga.jar

```java
module cat.manga {
    requires animal.manga;

    exports com.cat.manga;
    provides com.animal.manga.TalktiveAnimal
        with com.cat.manga.Doraemon;
}
```

```text
find ./src/ -type f -name "*.java" > sources.txt
javac --module-path animal-manga.jar -d ./out/ @sources.txt
```

```text
jar --create --file cat-manga.jar -C ./out/ .
```

```text
java --module-path ./jars --module buyer/com.buyer.manga.Main
```

### dog-manga.jar

```java
module dog.manga {
  requires animal.manga;

  exports com.dog.manga;
  provides com.animal.manga.TalktiveAnimal
      with com.dog.manga.Inuyasha;
}
```

```text
cd dog-company/
find ./src/ -type f -name "*.java" > sources.txt
javac --module-path animal-manga.jar -d ./out/ @sources.txt
```

```text
jar --create --file dog-manga.jar -C ./out/ .
```

```text
java --module-path ./jars --module buyer/com.buyer.manga.Main
```


- [Java Service Provider Interface](https://www.baeldung.com/java-spi)

## 源码解析

- 得到ServiceLoader
- 使用ServiceLoader进行加载

## SPI in JDK

### SPI in JDK

`com.sun.nio.zipfs.ZipFileSystemProvider`

### SPI in Third-Party

JDBC:/

- com.mysql.jdbc.Driver
- oracle.jdbc.driver.OracleDriver
- com.sybase.jdbc.SybDriver

Spring Boot: META-INFO/spring.factories

Dubbo SPI

Servlet
