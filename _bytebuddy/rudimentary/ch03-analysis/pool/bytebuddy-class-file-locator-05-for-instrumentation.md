---
title: "ClassFileLocator.ForInstrumentation"
sequence: "105"
---

## 源码



```java
public interface ClassFileLocator extends Closeable {
    class ForInstrumentation implements ClassFileLocator {
        private final Instrumentation instrumentation;
        private final ClassLoadingDelegate classLoadingDelegate;

        public ForInstrumentation(Instrumentation instrumentation, @MaybeNull ClassLoader classLoader) {
            this(instrumentation, ClassLoadingDelegate.Default.of(classLoader));
        }

        public ForInstrumentation(Instrumentation instrumentation, ClassLoadingDelegate classLoadingDelegate) {
            if (!DISPATCHER.isRetransformClassesSupported(instrumentation)) {
                throw new IllegalArgumentException(instrumentation + " does not support retransformation");
            }
            this.instrumentation = instrumentation;
            this.classLoadingDelegate = classLoadingDelegate;
        }

        public Resolution locate(String name) {
            try {
                ExtractionClassFileTransformer classFileTransformer = new ExtractionClassFileTransformer(classLoadingDelegate.getClassLoader(), name);
                DISPATCHER.addTransformer(instrumentation, classFileTransformer, true);
                try {
                    DISPATCHER.retransformClasses(instrumentation, new Class<?>[]{classLoadingDelegate.locate(name)});
                    byte[] binaryRepresentation = classFileTransformer.getBinaryRepresentation();
                    return binaryRepresentation == null
                            ? new Resolution.Illegal(name)
                            : new Resolution.Explicit(binaryRepresentation);
                } finally {
                    instrumentation.removeTransformer(classFileTransformer);
                }
            } catch (RuntimeException exception) {
                throw exception;
            } catch (Exception ignored) {
                return new Resolution.Illegal(name);
            }
        }
    }
}
```
