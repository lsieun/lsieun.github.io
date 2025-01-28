---
title: "CopyOnWriteArrayList"
sequence: "104"
---

[UP](/java-concurrency.html)


## 错误代码示例

```java
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class ArrayListUnsafeSample {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            list.add(i);
        }

        Iterator<Integer> it = list.iterator();
        while (it.hasNext()) {
            Integer val = it.next();
            list.remove(val);
            // 修改成下面这样，就可以避免 ConcurrentModificationException
            // it.remove();
        }
        System.out.println(list);
    }
}
```

运行后，会出 `ConcurrentModificationException`：

```text
Exception in thread "main" java.util.ConcurrentModificationException
	at java.base/java.util.ArrayList$Itr.checkForComodification(ArrayList.java:1013)
	at java.base/java.util.ArrayList$Itr.next(ArrayList.java:967)
	at lsieun.concurrent.juc.coll.ArrayListUnsafeSample.main(ArrayListUnsafeSample.java:16)
```

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
    private static final int DEFAULT_CAPACITY = 10;
    private static final Object[] EMPTY_ELEMENTDATA = {};
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
    
    
    transient Object[] elementData;
    // 修改次数
    protected transient int modCount = 0;

    public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+ initialCapacity);
        }
    }

    public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }
    
    public boolean add(E e) {
        // 修改次数加 1
        modCount++;
        add(e, elementData, size);
        return true;
    }

    public boolean remove(Object o) {
        final Object[] es = elementData;
        final int size = this.size;
        int i = 0;
        found: {
            if (o == null) {
                for (; i < size; i++)
                    if (es[i] == null)
                        break found;
            } else {
                for (; i < size; i++)
                    if (o.equals(es[i]))
                        break found;
            }
            return false;
        }

        // 调用 fastRemove
        fastRemove(es, i);
        return true;
    }

    private void fastRemove(Object[] es, int i) {
        // 修改次数加 1
        modCount++;
        final int newSize;
        if ((newSize = size - 1) > i)
            System.arraycopy(es, i + 1, es, i, newSize - i);
        es[size = newSize] = null;
    }

    private class Itr implements Iterator<E> {
        int cursor;       // index of next element to return
        int lastRet = -1; // index of last element returned; -1 if no such
        int expectedModCount = modCount;

        public boolean hasNext() {
            return cursor != size;
        }

        public E next() {
            checkForComodification();
            int i = cursor;
            if (i >= size)
                throw new NoSuchElementException();
            Object[] elementData = ArrayList.this.elementData;
            if (i >= elementData.length)
                throw new ConcurrentModificationException();
            cursor = i + 1;
            return (E) elementData[lastRet = i];
        }

        public void remove() {
            if (lastRet < 0)
                throw new IllegalStateException();
            checkForComodification();

            try {
                ArrayList.this.remove(lastRet);
                cursor = lastRet;
                lastRet = -1;
                // 这里会修改 expectedModCount 的值
                expectedModCount = modCount;
            } catch (IndexOutOfBoundsException ex) {
                throw new ConcurrentModificationException();
            }
        }

        final void checkForComodification() {
            // 实际修改次数 与 期望的修改次数，如果不一致，就会产生异常
            if (modCount != expectedModCount)
                throw new ConcurrentModificationException();
        }
    }
}
```

## 使用 CopyOnWriteArrayList

```java
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class CopyOnWriteArrayListSample {
    public static void main(String[] args) {
        // 注意：这里使用的是 CopyOnWriteArrayList 类
        List<Integer> list = new CopyOnWriteArrayList<>();
        for (int i = 0; i < 1000; i++) {
            list.add(i);
        }

        Iterator<Integer> it = list.iterator();
        while (it.hasNext()) {
            Integer val = it.next();
            list.remove(val);
        }
        System.out.println(list);
    }
}
```

```java
public class CopyOnWriteArrayList<E>
    implements List<E>, RandomAccess, Cloneable, java.io.Serializable {

    final transient Object lock = new Object();
    private transient volatile Object[] array;

    public boolean add(E e) {
        // 加锁，保证 thread safe
        synchronized (lock) {
            // 获取原数组内容
            Object[] es = getArray();
            int len = es.length;
            
            // 复制一份新数组
            es = Arrays.copyOf(es, len + 1);
            es[len] = e;
            
            // 重新设置数据
            setArray(es);
            return true;
        }
    }

    public Iterator<E> iterator() {
        return new COWIterator<E>(getArray(), 0);
    }

    static final class COWIterator<E> implements ListIterator<E> {
        private final Object[] snapshot;
        private int cursor;

        COWIterator(Object[] es, int initialCursor) {
            cursor = initialCursor;
            snapshot = es;
        }

        public boolean hasNext() {
            return cursor < snapshot.length;
        }

        public boolean hasPrevious() {
            return cursor > 0;
        }

        public E next() {
            if (! hasNext())
                throw new NoSuchElementException();
            return (E) snapshot[cursor++];
        }

        public E previous() {
            if (! hasPrevious())
                throw new NoSuchElementException();
            return (E) snapshot[--cursor];
        }
    }
}
```
