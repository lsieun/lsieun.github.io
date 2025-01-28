---
title: "Spring ASM"
sequence: "111"
---

## 示例

```java
package lsieun.utils;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyComponent {
    String value();
}
```

```java
package lsieun.utils;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.core.type.classreading.CachingMetadataReaderFactory;
import org.springframework.core.type.classreading.MetadataReader;
import org.springframework.core.type.classreading.MetadataReaderFactory;
import org.springframework.util.ClassUtils;

import java.util.HashMap;
import java.util.Map;

public class BaseClassScanUtils {
    // 设置资源规则
    private static final String RESOURCE_PATTERN = "/**/*.class";

    public static Map<String, Class<?>> scanMyComponentAnnotation(String basePackage) {
        // 创建容器存储使用了指定注解 Bean 字节码对象
        Map<String, Class<?>> annotationClassMap = new HashMap<>();

        // Spring 工具类，可以获取指定路径下的全部类
        ResourcePatternResolver resourcePatternResolver = new PathMatchingResourcePatternResolver();
        try {
            String pattern = ResourcePatternResolver.CLASSPATH_ALL_URL_PREFIX +
                    ClassUtils.convertClassNameToResourcePath(basePackage) + RESOURCE_PATTERN;
            Resource[] resources = resourcePatternResolver.getResources(pattern);

            // MetadataReader 的工厂类
            MetadataReaderFactory readerFactory = new CachingMetadataReaderFactory(resourcePatternResolver);
            for (Resource resource : resources) {
                // 用于读取类信息
                MetadataReader reader = readerFactory.getMetadataReader(resource);
                // 扫描到的 class
                String classname = reader.getClassMetadata().getClassName();
                Class<?> clazz = Class.forName(classname);

                // 判断是否属于指定的
                if (clazz.isAnnotationPresent(MyComponent.class)) {
                    // 获得注解对象
                    MyComponent annotation = clazz.getAnnotation(MyComponent.class);
                    // 获得 value 属性值
                    String beanName = annotation.value();
                    // 判断是否为 ""
                    if (beanName != null && !"".equals(beanName)) {
                        // 存储到 Map 中去
                        annotationClassMap.put(beanName, clazz);
                    } else {
                        // 如果没有为 ""，那就把当前类的类名作为 beanName
                        annotationClassMap.put(clazz.getSimpleName(), clazz);
                    }
                }
            }
        } catch (Exception ignored) {
        }

        return annotationClassMap;
    }

    public static void main(String[] args) {
        Map<String, Class<?>> classMap = scanMyComponentAnnotation("lsieun");
        System.out.println(classMap);
    }
}
```

## SimpleMetadataReader

```java
final class SimpleMetadataReader implements MetadataReader {
    private static final int PARSING_OPTIONS = ClassReader.SKIP_DEBUG
            | ClassReader.SKIP_CODE | ClassReader.SKIP_FRAMES;
    private final Resource resource;
    private final AnnotationMetadata annotationMetadata;

    SimpleMetadataReader(Resource resource, @Nullable ClassLoader classLoader) throws IOException {
        // 这里使用 ASM
        SimpleAnnotationMetadataReadingVisitor visitor = new SimpleAnnotationMetadataReadingVisitor(classLoader);
        getClassReader(resource).accept(visitor, PARSING_OPTIONS);
        this.resource = resource;
        this.annotationMetadata = visitor.getMetadata();
    }

    private static ClassReader getClassReader(Resource resource) throws IOException {
        try (InputStream is = resource.getInputStream()) {
            try {
                // 这里创建了 ClassReader
                return new ClassReader(is);
            }
            catch (IllegalArgumentException ex) {
                throw new org.springframework.core.NestedIOException("ASM ClassReader failed to parse class file - " +
                        "probably due to a new Java class file version that isn't supported yet: " + resource, ex);
            }
        }
    }
}
```
