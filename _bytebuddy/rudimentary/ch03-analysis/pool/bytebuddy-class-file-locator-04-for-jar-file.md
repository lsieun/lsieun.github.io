---
title: "ClassFileLocator.ForJarFile"
sequence: "104"
---

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.15.0</version>
</dependency>
```

## 示例

```java
import net.bytebuddy.dynamic.ClassFileLocator;

import java.io.File;
import java.io.IOException;

public class HelloWorldAnalysis {
    public static void main(String[] args) throws IOException {
        String jarPath = "C:\\Users\\liusen\\.m2\\repository\\org\\apache\\commons\\commons-lang3\\3.15.0\\commons-lang3-3.15.0.jar";
        String className = "org.apache.commons.lang3.StringUtils";

        try (
                ClassFileLocator jarFileLocator = ClassFileLocator.ForJarFile.of(new File(jarPath));
        ) {
            ClassFileLocator.Resolution resolution = jarFileLocator.locate(className);
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
    class ForJarFile implements ClassFileLocator {
        private final JarFile jarFile;

        public ForJarFile(JarFile jarFile) {
            this.jarFile = jarFile;
        }

        public Resolution locate(String name) throws IOException {
            ZipEntry zipEntry = jarFile.getEntry(name.replace('.', '/') + CLASS_FILE_EXTENSION);
            if (zipEntry == null) {
                return new Resolution.Illegal(name);
            } else {
                InputStream inputStream = jarFile.getInputStream(zipEntry);
                try {
                    return new Resolution.Explicit(StreamDrainer.DEFAULT.drain(inputStream));
                } finally {
                    inputStream.close();
                }
            }
        }

        public void close() throws IOException {
            jarFile.close();
        }
    }
}
```

### 静态方法

```java
public interface ClassFileLocator extends Closeable {
    class ForJarFile implements ClassFileLocator {

        public static ClassFileLocator of(File file) throws IOException {
            return new ForJarFile(new JarFile(file));
        }

        public static ClassFileLocator ofClassPath() throws IOException {
            return ofClassPath(System.getProperty("java.class.path"));
        }

        public static ClassFileLocator ofClassPath(String classPath) throws IOException {
            List<ClassFileLocator> classFileLocators = new ArrayList<ClassFileLocator>();
            for (String element : Pattern.compile(System.getProperty("path.separator"), Pattern.LITERAL).split(classPath)) {
                File file = new File(element);
                if (file.isDirectory()) {
                    classFileLocators.add(new ForFolder(file));
                } else if (file.isFile()) {
                    classFileLocators.add(of(file));
                }
            }
            return new Compound(classFileLocators);
        }

        public static ClassFileLocator ofRuntimeJar() throws IOException {
            String javaHome = System.getProperty("java.home").replace('\\', '/');
            File runtimeJar = null;
            for (String location : RUNTIME_LOCATIONS) {
                File candidate = new File(javaHome, location);
                if (candidate.isFile()) {
                    runtimeJar = candidate;
                    break;
                }
            }
            if (runtimeJar == null) {
                throw new IllegalStateException("Runtime jar does not exist in " + javaHome + " for any of " + RUNTIME_LOCATIONS);
            }
            return of(runtimeJar);
        }
    }
}
```


