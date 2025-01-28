---
title: "Quick Example"
sequence: "102"
---

## named module

```java
module lsieun.app {
    requires lsieun.reflection;
}
```

### compile

```text
$ find ./src/ -type f -name "*.java" > sources.txt
```

```text
$ javac --module-path mods/ -d ./out/ @sources.txt
```

### runtime

```text
$ java --module-path mods\;out --module lsieun.app/sample.Main
```

Reflection:

```text
Exception in thread "main" java.lang.IllegalAccessException: class sample.Main (in module lsieun.app) cannot access a member of class lsieun.reflection.export.ExportedPublicClass (in module lsieun.reflection) with modifiers "private static"
        at java.base/jdk.internal.reflect.Reflection.newIllegalAccessException(Reflection.java:361)
        at java.base/java.lang.reflect.AccessibleObject.checkAccess(AccessibleObject.java:591)
        at java.base/java.lang.reflect.Method.invoke(Method.java:558)
        at lsieun.app/sample.Main.main(Main.java:11)
```

Deep Reflection:

```text
Exception in thread "main" java.lang.reflect.InaccessibleObjectException: Unable to make private static void lsieun.reflection.export.ExportedPublicClass.testPrivateStaticMethod() accessible: module lsieun.reflection does not "opens lsieun.reflection.export" to module lsieun.app
        at java.base/java.lang.reflect.AccessibleObject.checkCanSetAccessible(AccessibleObject.java:340)
        at java.base/java.lang.reflect.AccessibleObject.checkCanSetAccessible(AccessibleObject.java:280)
        at java.base/java.lang.reflect.Method.checkCanSetAccessible(Method.java:198)
        at java.base/java.lang.reflect.Method.setAccessible(Method.java:192)
        at lsieun.app/sample.Main.main(Main.java:11)
```

成功：add-opens

```text
$ java --module-path mods\;out --add-opens lsieun.reflection/lsieun.reflection.export=lsieun.app --module lsieun.app/sample.Main
```

## unnamed module

### compile

```text
$ find ./src/ -type f -name "*.java" > sources.txt
```

```text
$ javac --module-path mods --add-modules lsieun.reflection -d ./out/ @sources.txt
```

### run

```text
$ java --module-path mods --add-modules lsieun.reflection -cp ./out/ sample.Main
```

```text
$ java --module-path mods --add-modules lsieun.reflection --illegal-access=permit -cp ./out/ sample.Main
```

```text
$ java --module-path mods --add-modules lsieun.reflection --add-opens lsieun.reflection/lsieun.reflection.export=ALL-UNNAMED -cp ./out/ sample.Main
```

```text
$ java -cp "lib/*"\;./out/ sample.Main
```

Reflection:

```text
Exception in thread "main" java.lang.IllegalAccessException: class sample.Main cannot access a member of class lsieun.reflection.export.ExportedPublicClass (in module lsieun.reflection) with modifiers "private static"
        at java.base/jdk.internal.reflect.Reflection.newIllegalAccessException(Reflection.java:361)
        at java.base/java.lang.reflect.AccessibleObject.checkAccess(AccessibleObject.java:591)
        at java.base/java.lang.reflect.Method.invoke(Method.java:558)
        at sample.Main.main(Main.java:11)
```

Deep Reflection

```text

```

## Unamed Module: JDK

```text
$ find ./src/ -type f -name "*.java" > sources.txt
```

```text
$ javac -d ./out/ @sources.txt
```

```text
$ java -cp ./out/ sample.Main
```

```text
$ java --module-path mods --add-modules lsieun.reflection --illegal-access=permit -cp ./out/ sample.Main
```

```text
$ java --module-path mods --add-modules lsieun.reflection --add-opens lsieun.reflection/lsieun.reflection.export=ALL-UNNAMED -cp ./out/ sample.Main
```

```text
$ java --illegal-access=permit -cp ./out/ sample.Main
```

```text
$ java --illegal-access=deny -cp ./out/ sample.Main
```

```text
$ java --illegal-access=deny com.baeldung.module.unnamed.Main
```

## agent

```text
javac -d ./out/ @sources.txt
```

```text
jar --create --file=lsieun-agent.jar --manifest=MANIFEST.MF -C ./out/ .
```

### unnamed

```text
java -javaagent:./lib/lsieun-agent.jar -cp ./out/ sample.Main
```

```text
java -javaagent:./lib/lsieun-agent.jar --illegal-access=deny -cp ./out/ sample.Main
```

### named

失败：不使用agent

```text
$ java --module-path mods\;out --module lsieun.app/sample.Main
```

成功：使用agent

```text
$ java -javaagent:./lib/lsieun-agent.jar=lsieun.reflection.export.ExportedPublicClass,sample.Main --module-path mods\;out --module lsieun.app/sample.Main
```


