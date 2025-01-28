---
title: "Treeable"
sequence: "101"
---

```java
import java.util.*;
import java.util.function.Function;

public interface Treeable<T, S> {
    T getId();

    T getParentId();

    List<S> getChildren();

    void setChildren(List<S> children);

    static <T, E extends Treeable<T, E>> List<E> fromList2Tree(List<E> list) {
        if (list == null || list.size() < 1) {
            return Collections.emptyList();
        }


        Map<T, E> map = new HashMap<>(16);
        for (E item : list) {
            T id = item.getId();
            map.put(id, item);
        }

        List<E> resultList = new ArrayList<>();
        for (E item : list) {
            T parentId = item.getParentId();
            E parent = map.get(parentId);
            if (parent == null) {
                resultList.add(item);
            }
            else {
                List<E> children = parent.getChildren();
                if (children == null) {
                    children = new ArrayList<>();
                    parent.setChildren(children);
                }
                children.add(item);
            }
        }

        return resultList;
    }

    static <T, E extends Treeable<T, E>> Set<T> getAllId(List<E> list) {
        Set<T> set = new HashSet<>();
        recursiveGetId(list, set, Treeable::getId);
        return set;
    }

    static <T, E extends Treeable<T, E>> Set<T> getAllParentId(List<E> list) {
        Set<T> set = new HashSet<>();
        recursiveGetId(list, set, Treeable::getParentId);
        return set;
    }

    private static <T, E extends Treeable<T, E>> void recursiveGetId(List<E> list, Set<T> set, Function<E, T> func) {
        if (isEmpty(list)) {
            return;
        }

        if (set == null) {
            return;
        }

        for (E item : list) {
            T id = func.apply(item);
            if (Objects.isNull(id)) {
                continue;
            }
            set.add(id);

            List<E> children = item.getChildren();

            if (children == null) {
                continue;
            }

            recursiveGetId(children, set, func);
        }

    }

    static <T, E extends Treeable<T, E>> Map<T, E> getMapFromList(List<E> list) {
        Map<T, E> map = new HashMap<>();
        recursiveGetMap(list, map, Treeable::getId);
        return map;
    }

    private static <T, E extends Treeable<T, E>> void recursiveGetMap(List<E> list, Map<T, E> map, Function<E, T> func) {
        if (isEmpty(list)) {
            return;
        }

        if (map == null) {
            return;
        }

        for (E item : list) {
            T id = func.apply(item);
            if (Objects.isNull(id)) {
                continue;
            }
            map.put(id, item);

            List<E> children = item.getChildren();

            if (children == null) {
                continue;
            }

            recursiveGetMap(children, map, func);
        }

    }

    static <T, E extends Treeable<T, E>> int getMaxLevel(List<E> list) {
        if (isEmpty(list)) {
            return 0;
        }

        int maxLevel = 1;
        for (E item : list) {
            List<E> children = item.getChildren();
            if (isEmpty(children)) {
                continue;
            }
            int level = getMaxLevel(children) + 1;
            if (level > maxLevel) {
                maxLevel = level;
            }
        }
        return maxLevel;
    }

    private static boolean isEmpty(Collection<?> coll) {
        return coll == null || coll.isEmpty();
    }

    private static boolean isNotEmpty(Collection<?> coll) {
        return !isEmpty(coll);
    }

}
```
