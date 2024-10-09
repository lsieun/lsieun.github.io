---
title: "ClassFileLocator.ForClassLoader"
sequence: "102"
---

## 示例

```java
import net.bytebuddy.dynamic.ClassFileLocator;

import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        String className = "sample.HelloWorld";

        try (
                ClassFileLocator folderLocator = ClassFileLocator.ForClassLoader.ofSystemLoader();
        ) {
            ClassFileLocator.Resolution resolution = folderLocator.locate(className);
            byte[] bytes = resolution.resolve();
            System.out.println(bytes.length);
        }
    }
}
```

## 源码

### 工作原理

```java
public interface ClassFileLocator extends Closeable {
    String CLASS_FILE_EXTENSION = ".class";

    class ForClassLoader implements ClassFileLocator {
        private final ClassLoader classLoader;

        protected ForClassLoader(ClassLoader classLoader) {
            this.classLoader = classLoader;
        }

        public Resolution locate(String name) throws IOException {
            return locate(classLoader, name);
        }

        public void close() {
            /* do nothing */
        }

        protected static Resolution locate(ClassLoader classLoader, String name) throws IOException {
            InputStream inputStream = classLoader.getResourceAsStream(name.replace('.', '/') + CLASS_FILE_EXTENSION);
            if (inputStream != null) {
                try {
                    return new Resolution.Explicit(StreamDrainer.DEFAULT.drain(inputStream));
                } finally {
                    inputStream.close();
                }
            } else {
                return new Resolution.Illegal(name);
            }
        }
    }
}
```

### 静态方法

#### ClassFileLocator

```java
public interface ClassFileLocator extends Closeable {
    class ForClassLoader implements ClassFileLocator {
        public static ClassFileLocator ofSystemLoader() {
            return new ForClassLoader(ClassLoader.getSystemClassLoader());
        }

        public static ClassFileLocator ofPlatformLoader() {
            return of(ClassLoader.getSystemClassLoader().getParent());
        }

        public static ClassFileLocator ofBootLoader() {
            return new ForClassLoader(BOOT_LOADER_PROXY);
        }
    }
}
```

#### byte[]

```java
public interface ClassFileLocator extends Closeable {
    class ForClassLoader implements ClassFileLocator {
        public static byte[] read(Class<?> type) {
            try {
                ClassLoader classLoader = type.getClassLoader();
                return locate(classLoader == null
                        ? BOOT_LOADER_PROXY
                        : classLoader, TypeDescription.ForLoadedType.getName(type)).resolve();
            } catch (IOException exception) {
                throw new IllegalStateException("Cannot read class file for " + type, exception);
            }
        }

        public static Map<Class<?>, byte[]> read(Class<?>... type) {
            return read(Arrays.asList(type));
        }

        public static Map<Class<?>, byte[]> read(Collection<? extends Class<?>> types) {
            Map<Class<?>, byte[]> result = new HashMap<Class<?>, byte[]>();
            for (Class<?> type : types) {
                result.put(type, read(type));
            }
            return result;
        }

        public static Map<String, byte[]> readToNames(Class<?>... type) {
            return readToNames(Arrays.asList(type));
        }

        public static Map<String, byte[]> readToNames(Collection<? extends Class<?>> types) {
            Map<String, byte[]> result = new HashMap<String, byte[]>();
            for (Class<?> type : types) {
                result.put(type.getName(), read(type));
            }
            return result;
        }
    }
}
```

