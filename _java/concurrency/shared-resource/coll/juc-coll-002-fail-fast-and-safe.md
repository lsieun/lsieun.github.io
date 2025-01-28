---
title: "fail-safe 与 fail-fast"
sequence: "102"
---

[UP](/java-concurrency.html)


fail-safe 和 fail-fast，是多线程并发操作集合时的一种**失败处理机制**。

## fail-fast

fail-fast，表示快速失败。
在集合**遍历**过程中，一旦发现容器中的数据被修改了，会立刻抛出 `ConcurrentModificationException` 异常，
从而导致**遍历失败**。

`java.util` 包下的集合类，都是 fail-fast 机制的。
常见的使用 fail-fast 方式遍历的容器有 `HashMap` 和 `ArrayList` 等。

```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class FailFast {
    public static void main(String[] args) {
        Map<String, String> map = new HashMap<>();
        map.put("name", "tomcat");
        map.put("sex", "male");
        map.put("age", "18");

        Iterator<String> it = map.keySet().iterator();
        while (it.hasNext()) {
            String key = it.next();
            String value = map.get(key);
            System.out.println("value = " + value);

            map.put("language", "java");
        }
    }
}
```

运行后，会出现 `ConcurrentModificationException` 异常：

```text
Exception in thread "main" java.util.ConcurrentModificationException
	at java.base/java.util.HashMap$HashIterator.nextNode(HashMap.java:1597)
	at java.base/java.util.HashMap$KeyIterator.next(HashMap.java:1620)
	at lsieun.concurrent.juc.coll.FailFast.main(FailFast.java:16)
```

## fail-safe

fail-safe，表示失败安全。
在这种机制下，出现集合元素的修改，不会抛出 `ConcurrentModificationException` 异常。
原因是采用 fail-safe 机制的集合容器，在遍历时，不是直接在集合内容上访问的，
而是先复制原有集合内容，在拷贝的集合上进行遍历；
由于迭代时，是对原集合的拷贝进行遍历，所以，在遍历过程中，对原集合的修改并不能被迭代器检测到。

`java.util.concurrent` 包下的容器，都是使用 fail-safe 机制，可以在多线程下并发使用。
常见的使用 fail-safe 方式遍历的容器有 `ConcurrentHashMap` 和 `CopyOnWriteArrayList` 等。

```java
import java.util.Iterator;
import java.util.concurrent.CopyOnWriteArrayList;

public class FailSafe {
    public static void main(String[] args) {
        CopyOnWriteArrayList<Integer> list = new CopyOnWriteArrayList<>(
                new Integer[]{1, 7, 9, 11}
        );
        Iterator<Integer> it = list.iterator();
        while (it.hasNext()) {
            Integer val = it.next();
            System.out.println("val = " + val);

            if (val == 7) {
                list.add(15); // 在 fail-safe 模式下，这里不会被打印
            }
        }

    }
}
```

输出内容：

```text
val = 1
val = 7
val = 9
val = 11
```
