---
title: "Streams: groupBy"
sequence: "112"
---

## Basic

```java
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.groupingBy;

public class Main {
    public static void main(String[] args) {
        List<Shinobi> shinobiList = DataUtils.getShinobiList();
        Map<Clan, List<Shinobi>> map = shinobiList.stream()
                .collect(groupingBy(Shinobi::getClan));
        map.forEach((key, list) -> {
            System.out.println(key);
            list.forEach(System.out::println);
        });
    }
}
```

输出结果：

```text
Nara
Shinobi{id='012611', name='Nara Shikamaru', sex=MALE, age=12, birthDay=Wed Sep 22 16:27:13 CST 1512, clan=Nara, country=LAND_OF_FIRE}
Uzumaki
Shinobi{id='012607', name='Uzumaki Naruto', sex=MALE, age=12, birthDay=Sun Oct 10 16:27:13 CST 1512, clan=Uzumaki, country=LAND_OF_FIRE}
Uchiha
Shinobi{id='012110', name='Uchiha Itachi', sex=MALE, age=17, birthDay=Tue Jun 09 16:27:13 CST 1495, clan=Uchiha, country=LAND_OF_FIRE}
Shinobi{id='012606', name='Uchiha Sasuke', sex=MALE, age=12, birthDay=Fri Jul 23 16:27:13 CST 1512, clan=Uchiha, country=LAND_OF_FIRE}
Hatake
Shinobi{id='009720', name='Hatake Kakashi', sex=MALE, age=26, birthDay=Fri Sep 15 16:27:13 CST 1486, clan=Hatake, country=LAND_OF_FIRE}
```

Also note that the regular one-argument `groupingBy(f)`, where `f` is the classification function,
is in reality just shorthand for `groupingBy(f, toList())`.

```java
public final class Collectors {
    public static <T, K> Collector<T, ?, Map<K, List<T>>> groupingBy(
            Function<? super T, ? extends K> classifier
    ) {
        return groupingBy(classifier, toList());
    }

    public static <T, K, A, D> Collector<T, ?, Map<K, D>> groupingBy(
            Function<? super T, ? extends K> classifier,
            Collector<? super T, A, D> downstream
    ) {
        return groupingBy(classifier, HashMap::new, downstream);
    }

    public static <T, K, D, A, M extends Map<K, D>> Collector<T, ?, M> groupingBy(
            Function<? super T, ? extends K> classifier,
            Supplier<M> mapFactory,
            Collector<? super T, A, D> downstream
    ) {
        // ...
    }

    public static <T> Collector<T, ?, List<T>> toList() {
        return new CollectorImpl<>((Supplier<List<T>>) ArrayList::new, List::add,
                (left, right) -> { left.addAll(right); return left; },
                CH_ID);
    }
}
```



## Basic2

```java
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.*;

public class Main {
    public static void main(String[] args) {
        List<Shinobi> shinobiList = DataUtils.getShinobiList();
        Map<Clan, List<String>> map = shinobiList.stream()
                .collect(groupingBy(Shinobi::getClan, HashMap::new, mapping(Shinobi::getName, toList())));
        map.forEach((key, list) -> {
            String line = String.format("%s: %s", key, String.join(", ", list));
            System.out.println(line);
        });
    }
}
```

输出结果：

```text
Nara: Nara Shikamaru
Uchiha: Uchiha Itachi, Uchiha Sasuke
Hatake: Hatake Kakashi
Uzumaki: Uzumaki Naruto
```

## Collecting data in subgroups

### counting

```java
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.counting;
import static java.util.stream.Collectors.groupingBy;

public class Main {
    public static void main(String[] args) {
        List<Shinobi> shinobiList = DataUtils.getShinobiList();
        Map<Clan, Long> map = shinobiList.stream()
                .collect(groupingBy(Shinobi::getClan, counting()));
        map.forEach((key, value) -> {
            System.out.println(key + ": " + value);
        });
    }
}
```

输出结果：

```text
Uzumaki: 1
Hatake: 1
Uchiha: 2
Nara: 1
```

### maxBy

```java
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.stream.Collectors.*;

public class Main {
    public static void main(String[] args) {
        List<Shinobi> shinobiList = DataUtils.getShinobiList();
        Map<Clan, Optional<Shinobi>> map = shinobiList.stream()
                .collect(groupingBy(Shinobi::getClan, maxBy(Comparator.comparingInt(Shinobi::getAge))));
        map.forEach((key, value) -> {
            String line = String.format("%s: %s", key, value.orElseGet(Shinobi::new));
            System.out.println(line);
        });
    }
}
```

输出结果：

```text
Uzumaki: Shinobi{id='012607', name='Uzumaki Naruto', sex=MALE, age=12, birthDay=Sun Oct 10 16:52:08 CST 1512, clan=Uzumaki, country=LAND_OF_FIRE}
Hatake: Shinobi{id='009720', name='Hatake Kakashi', sex=MALE, age=26, birthDay=Fri Sep 15 16:52:08 CST 1486, clan=Hatake, country=LAND_OF_FIRE}
Nara: Shinobi{id='012611', name='Nara Shikamaru', sex=MALE, age=12, birthDay=Wed Sep 22 16:52:08 CST 1512, clan=Nara, country=LAND_OF_FIRE}
Uchiha: Shinobi{id='012110', name='Uchiha Itachi', sex=MALE, age=17, birthDay=Tue Jun 09 16:52:08 CST 1495, clan=Uchiha, country=LAND_OF_FIRE}
```

