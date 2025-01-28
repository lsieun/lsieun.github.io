---
title: "ObjectPool"
sequence: "101"
---

[UP](/netty.html)

## ObjectPool

### 实例方法

```java
public abstract class ObjectPool<T> {
    public abstract T get();
}
```

### 静态方法

```java
public abstract class ObjectPool<T> {
    public static <T> ObjectPool<T> newPool(final ObjectCreator<T> creator) {
        return new RecyclerObjectPool<T>(ObjectUtil.checkNotNull(creator, "creator"));
    }
}
```

## RecyclerObjectPool

`ObjectPool.get()` 方法是交由 `Recycler` 类实现的。

```java
public abstract class ObjectPool<T> {
    private static final class RecyclerObjectPool<T> extends ObjectPool<T> {
        private final Recycler<T> recycler;

        RecyclerObjectPool(final ObjectCreator<T> creator) {
            recycler = new Recycler<T>() {
                @Override
                protected T newObject(Handle<T> handle) {
                    return creator.newObject(handle);
                }
            };
        }

        @Override
        public T get() {
            return recycler.get();
        }
    }
}
```
