---
title: "InstrumentationImpl"
sequence: "142"
---

[UP]({% link _java-agent/java-agent-01.md %})

在本文当中，我们的关注点在于 `InstrumentationImpl`、transformer 和 `TransformerManager` 三者的关系。

## InstrumentationImpl

### class info

`sun.instrument.InstrumentationImpl` 实现了 `java.lang.instrument.Instrumentation` 接口：

```java
public class InstrumentationImpl implements Instrumentation {
}
```

### fields

```java
public class InstrumentationImpl implements Instrumentation {
    private final TransformerManager mTransformerManager;
    private TransformerManager mRetransfomableTransformerManager;

    // ...
}
```

### constructor

```java
public class InstrumentationImpl implements Instrumentation {
    private InstrumentationImpl(long nativeAgent,
                                boolean environmentSupportsRedefineClasses,
                                boolean environmentSupportsNativeMethodPrefix) {
        mTransformerManager = new TransformerManager(false);
        mRetransfomableTransformerManager = null;

        // ...
    }
}
```

### xxxTransformer

#### addTransformer

```java
public class InstrumentationImpl implements Instrumentation {
    public void addTransformer(ClassFileTransformer transformer) {
        addTransformer(transformer, false);
    }

    public synchronized void addTransformer(ClassFileTransformer transformer, boolean canRetransform) {
        if (transformer == null) {
            throw new NullPointerException("null passed as 'transformer' in addTransformer");
        }
        if (canRetransform) {
            if (!isRetransformClassesSupported()) {
                throw new UnsupportedOperationException("adding retransformable transformers is not supported in this environment");
            }
            if (mRetransfomableTransformerManager == null) {
                mRetransfomableTransformerManager = new TransformerManager(true);
            }
            mRetransfomableTransformerManager.addTransformer(transformer);
            if (mRetransfomableTransformerManager.getTransformerCount() == 1) {
                setHasRetransformableTransformers(mNativeAgent, true);
            }
        }
        else {
            mTransformerManager.addTransformer(transformer);
        }
    }
}
```

#### removeTransformer

```java
public class InstrumentationImpl implements Instrumentation {
    public synchronized boolean removeTransformer(ClassFileTransformer transformer) {
        if (transformer == null) {
            throw new NullPointerException("null passed as 'transformer' in removeTransformer");
        }
        TransformerManager mgr = findTransformerManager(transformer);
        if (mgr != null) {
            mgr.removeTransformer(transformer);
            if (mgr.isRetransformable() && mgr.getTransformerCount() == 0) {
                setHasRetransformableTransformers(mNativeAgent, false);
            }
            return true;
        }
        return false;
    }
}
```

#### findTransformerManager

```java
public class InstrumentationImpl implements Instrumentation {
    private TransformerManager findTransformerManager(ClassFileTransformer transformer) {
        if (mTransformerManager.includesTransformer(transformer)) {
            return mTransformerManager;
        }
        if (mRetransfomableTransformerManager != null &&
                mRetransfomableTransformerManager.includesTransformer(transformer)) {
            return mRetransfomableTransformerManager;
        }
        return null;
    }
}
```

### transform

```java
public class InstrumentationImpl implements Instrumentation {
    private byte[] transform(ClassLoader loader,
                             String classname,
                             Class<?> classBeingRedefined,
                             ProtectionDomain protectionDomain,
                             byte[] classfileBuffer,
                             boolean isRetransformer) {
        TransformerManager mgr = isRetransformer ? mRetransfomableTransformerManager : mTransformerManager;
        if (mgr == null) {
            return null; // no manager, no transform
        }
        else {
            return mgr.transform(loader, classname, classBeingRedefined, protectionDomain, classfileBuffer);
        }
    }
}
```

## TransformerInfo

```java
private class TransformerInfo {
    final ClassFileTransformer mTransformer;
    String mPrefix;

    TransformerInfo(ClassFileTransformer transformer) {
        mTransformer = transformer;
        mPrefix = null;
    }

    ClassFileTransformer transformer() {
        return mTransformer;
    }

    String getPrefix() {
        return mPrefix;
    }

    void setPrefix(String prefix) {
        mPrefix = prefix;
    }
}
```

## TransformerManager

### class info

```java
public class TransformerManager {
}
```

### fields

```java
public class TransformerManager {
    private TransformerInfo[] mTransformerList;
    private boolean mIsRetransformable;
}
```

### constructor

```java
public class TransformerManager {
    TransformerManager(boolean isRetransformable) {
        mTransformerList = new TransformerInfo[0];
        mIsRetransformable = isRetransformable;
    }
}
```

### xxxTransformer

#### addTransformer

```java
public class TransformerManager {
    public synchronized void addTransformer(ClassFileTransformer transformer) {
        TransformerInfo[] oldList = mTransformerList;
        TransformerInfo[] newList = new TransformerInfo[oldList.length + 1];
        System.arraycopy(oldList, 0, newList, 0, oldList.length);
        newList[oldList.length] = new TransformerInfo(transformer);
        mTransformerList = newList;
    }
}
```

#### removeTransformer

```java
public class TransformerManager {
    public synchronized boolean removeTransformer(ClassFileTransformer transformer) {
        boolean found = false;
        TransformerInfo[] oldList = mTransformerList;
        int oldLength = oldList.length;
        int newLength = oldLength - 1;

        // look for it in the list, starting at the last added, and remember
        // where it was if we found it
        int matchingIndex = 0;
        for (int x = oldLength - 1; x >= 0; x--) {
            if (oldList[x].transformer() == transformer) {
                found = true;
                matchingIndex = x;
                break;
            }
        }

        // make a copy of the array without the matching element
        if (found) {
            TransformerInfo[] newList = new TransformerInfo[newLength];

            // copy up to but not including the match
            if (matchingIndex > 0) {
                System.arraycopy(oldList, 0, newList, 0, matchingIndex);
            }

            // if there is anything after the match, copy it as well
            if (matchingIndex < (newLength)) {
                System.arraycopy(oldList, matchingIndex + 1, newList, matchingIndex, (newLength) - matchingIndex);
            }
            mTransformerList = newList;
        }
        return found;
    }
}
```

#### includesTransformer

```java
public class TransformerManager {
    synchronized boolean includesTransformer(ClassFileTransformer transformer) {
        for (TransformerInfo info : mTransformerList) {
            if (info.transformer() == transformer) {
                return true;
            }
        }
        return false;
    }
}
```

### transform

```java
public class TransformerManager {
    public byte[] transform(ClassLoader loader,
                            String classname,
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain,
                            byte[] classfileBuffer) {
        boolean someoneTouchedTheBytecode = false;

        TransformerInfo[] transformerList = getSnapshotTransformerList();

        byte[] bufferToUse = classfileBuffer;

        // order matters, gotta run 'em in the order they were added
        for (int x = 0; x < transformerList.length; x++) {
            TransformerInfo transformerInfo = transformerList[x];
            ClassFileTransformer transformer = transformerInfo.transformer();
            byte[] transformedBytes = null;

            try {
                transformedBytes = transformer.transform(loader, classname, classBeingRedefined, protectionDomain, bufferToUse);
            } catch (Throwable t) {
                // don't let any one transformer mess it up for the others.
                // This is where we need to put some logging. What should go here? FIXME
            }

            if (transformedBytes != null) {
                someoneTouchedTheBytecode = true;
                bufferToUse = transformedBytes;
            }
        }

        // if someone modified it, return the modified buffer.
        // otherwise return null to mean "no transforms occurred"
        byte[] result;
        if (someoneTouchedTheBytecode) {
            result = bufferToUse;
        }
        else {
            result = null;
        }

        return result;
    }
}
```

## 总结

本文内容总结如下：

- 第一点，在 `InstrumentationImpl` 当中，transformer 会根据是否具有 retransform 能力而分开存储。
- 第二点，在 `TransformerManager` 当中，重点关注 `transform` 方法的处理逻辑。
