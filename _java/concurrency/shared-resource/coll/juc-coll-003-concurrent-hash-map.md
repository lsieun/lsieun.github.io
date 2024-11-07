---
title: "ConcurrentHashMap"
sequence: "103"
---

[UP](/java-concurrency.html)


## 错误的示例

```java
import java.util.HashMap;
import java.util.Hashtable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;

public class HashMapUnsafeSample {
    private static int users = 100;
    private static int downTotal = 50000;

    public static HashMap<Integer, Integer> map = new HashMap<>();

    // 修改成 Hashtable，就正确了 
    // public static Hashtable<Integer, Integer> map = new Hashtable<>();

    public static void main(String[] args) throws InterruptedException {
        ExecutorService executorService = Executors.newCachedThreadPool();
        final Semaphore semaphore = new Semaphore(users);

        for (int i = 0; i < downTotal; i++) {
            final Integer index = i;
            executorService.execute(() -> {
                try {
                    semaphore.acquire();
                    map.put(index, index);
                    semaphore.release();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            });
        }

        Thread.sleep(3000);

        executorService.shutdown();
        System.out.println("total = " + map.size());
    }
}
```

输出内容（每次都不一样，但都不是 50000）：

```text
total = 49518
```

## 使用 ConcurrentHashMap

```java
import java.util.concurrent.*;

public class ConcurrentHashMapSample {
    private static int users = 100;
    private static int downTotal = 50000;
    public static ConcurrentHashMap<Integer, Integer> map = new ConcurrentHashMap<>();

    public static void main(String[] args) throws InterruptedException {
        ExecutorService executorService = Executors.newCachedThreadPool();
        final Semaphore semaphore = new Semaphore(users);

        for (int i = 0; i < downTotal; i++) {
            final Integer index = i;
            executorService.execute(() -> {
                try {
                    semaphore.acquire();
                    map.put(index, index);
                    semaphore.release();
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            });
        }

        Thread.sleep(3000);

        executorService.shutdown();
        System.out.println("total = " + map.size());
    }
}
```

## 分段锁

ConcurrentHashMap 采用 ”分段锁“的方式

![](/assets/images/java/concurrency/juc/coll/concurrent-hash-map-segment-lock.png)

Hashtable 为了保证线程安全，所有的 kv 要进行同步，所以 t1、t2、t3...tn 这么多线程都一个一个操作来完成工作，
那效率自然就低了。

在 ConcurrentHashMap 中，它将原始数据切分成了一个一个小的区域来分别处理，每一个小区域叫做 segment；
segment 的长度都是 2^n，可以是 2、4、8、16 等等；
不同的线程，访问不同的 segment，每个 segment 有一把锁，彼此不互相影响；
只有在同一个 segment 里的多个 thread 才会进行排队等待。

## 单词计数

### WordCount

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.BiConsumer;
import java.util.function.Supplier;

public class WordCount {

    public static <V> void count(Supplier<Map<String, V>> supplier,
                                 BiConsumer<Map<String, V>, List<String>> consumer,
                                 List<String> allWords) {
        int count = allWords.size() / 26;


        Map<String, V> counterMap = supplier.get();
        List<Thread> threadList = new ArrayList<>();
        for (int i = 0; i < 26; i++) {

            List<String> words = new ArrayList<>();
            for (int j = 0; j < count; j++) {
                String w = allWords.get(i * count + j);
                words.add(w);
            }

            Thread t = new Thread(() -> {
                consumer.accept(counterMap, words);
            });
            threadList.add(t);
        }

        threadList.forEach(Thread::start);
        threadList.forEach(t -> {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        System.out.println(counterMap);
    }

    public static List<String> getWords() {
        int count = 200;
        List<String> allWords = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            for (int j = 0; j < 26; j++) {
                char ch = (char) ('a' + j);
                String str = String.valueOf(ch);
                allWords.add(str);
            }
        }

        Collections.shuffle(allWords);

        return allWords;
    }
}
```

### 错误：使用 HashMap

```java
import java.util.HashMap;
import java.util.List;

public class WordCountRun {
    public static void main(String[] args) {
        List<String> allWords = WordCount.getWords();

        WordCount.<Integer>count(
                HashMap::new,
                (map, words) -> {
                    for (String word : words) {
                        // 检查 key 有没有
                        Integer counter = map.get(word);
                        int newValue = counter == null ? 1 : counter + 1;
                        map.put(word, newValue);
                    }
                },
                allWords
        );
    }
}
```

添加 `synchronized` 关键字，让程序正确：

```java
import java.util.HashMap;
import java.util.List;

public class WordCountRun {
    public static void main(String[] args) {
        List<String> allWords = WordCount.getWords();

        WordCount.<Integer>count(
                HashMap::new,
                (map, words) -> {
                    for (String word : words) {
                        synchronized (map) { // 对整个 map 进行加锁，但这样效率低
                            // 检查 key 有没有
                            Integer counter = map.get(word);
                            int newValue = counter == null ? 1 : counter + 1;
                            map.put(word, newValue);
                        }
                    }
                },
                allWords
        );
    }
}
```

或者使用：

- `synchronized (map)`，是对整个 map 加锁，效率要低
- `synchronized (word.intern())`，不能直接使用 `word`，因为虽然“单词”内容相同，但属于不同对象，锁不住；其中 `word.intern()` 是对“单词”的“池化对象”进行加锁，它对应到 map 中的 key。


### 错误：使用 ConcurrentHashMap

```java
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class WordCountRun {
    public static void main(String[] args) {
        List<String> allWords = WordCount.getWords();

        WordCount.<Integer>count(
                ConcurrentHashMap::new,
                (map, words) -> {
                    for (String word : words) {
                        // 失败的原因：ConcurrentHashMap 是一个线程安全的类，只是保证它的每个方法内部代码的执行是“原子性”的；
                        // 但是，解决当前的问题，需要保证以下三条语句的“原子性”：获取值、加一、更新值
                        Integer counter = map.get(word);
                        int newValue = counter == null ? 1 : counter + 1;
                        map.put(word, newValue);
                    }
                },
                allWords
        );
    }
}
```

### 正确：使用 ConcurrentHashMap

```java
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.LongAdder;

public class WordCountRun {
    public static void main(String[] args) {
        List<String> allWords = WordCount.getWords();

        WordCount.<LongAdder>count(
                ConcurrentHashMap::new,
                (map, words) -> {
                    for (String word : words) {
                        // 注意不能使用 putIfAbsent，此方法返回的是上一次的 value，首次调用返回 null
                        // 即使这里“设置 key-value”和“value 自增”不是原子性操作，LongAdder 的 CAS 会获取到最新的值再进行加一的，这一点可以放心
                        // 这里 ConcurrentHashMap 只调用了 computeIfAbsent 方法，它本身是“原子性”的
                        LongAdder value = map.computeIfAbsent(word, (key) -> new LongAdder());
                        value.increment();
                        
                        // 或者，写成一句
                        // map.computeIfAbsent(word, (key) -> new LongAdder()).increment();
                    }
                },
                allWords
        );
    }
}
```

```java
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class WordCountRun {
    public static void main(String[] args) {
        List<String> allWords = WordCount.getWords();

        WordCount.<Integer>count(
                ConcurrentHashMap::new,
                (map, words) -> {
                    for (String word : words) {
                        // 函数式编程，无需原子变量
                        map.merge(word, 1, Integer::sum);
                    }
                },
                allWords
        );
    }
}
```
