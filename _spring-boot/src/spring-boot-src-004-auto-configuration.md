---
title: "自动配置"
sequence: "104"
---

自动配置：根据我们添加的 Jar 包依赖，会自动将一些配置类的 Bean 注册进 IOC 容器，
我们可以在需要的地方使用 `@Autowired` 或者 `@Resource` 等注解来使用它。

## @SpringBootApplication

`@SpringBootApplication` 是一个复合注解，它由三个注解组成：

- `@SpringBootConfiguration`
- `@EnableAutoConfiguration`
- `@ComponentScan`

```java
@SpringBootConfiguration    // 标明该类为配置类
@EnableAutoConfiguration    // 启动自动配置功能
@ComponentScan(excludeFilters = {
        @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
        @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class)
})    // 注解扫描
public @interface SpringBootApplication {
    //
}
```

## SpringBootConfiguration

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
public @interface SpringBootConfiguration {
    @AliasFor(annotation = Configuration.class)
    boolean proxyBeanMethods() default true;
}
```

## @EnableAutoConfiguration

Spring 中有很多以 `Enable` 开头的注解，其作用是借助 `@Import` 来收集并注册特定场景相关的 Bean，并加载到 IOC 容器。

`@EnableAutoConfiguration` 就是借助 `@Import` 来收集所有符合自动配置条件的 Bean 定义，并加载到 IOC 容器。

```java
package org.springframework.boot.autoconfigure;

@AutoConfigurationPackage    // 自动配置包：将 启动类（DemoApplication）所在的包（lsieun.mytest），注册成一个 BeanDefinition
@Import(AutoConfigurationImportSelector.class)    // Spring 的底层注解 @Import，给容器中导入一个组件
public @interface EnableAutoConfiguration {
    //
}
```

### @AutoConfigurationPackage

```java
// Spring 的底层注解 @Import，给容器中导入一个组件；
// 导入的组件是 AutoConfigurationPackages.Registrar.class
@Import(AutoConfigurationPackages.Registrar.class)
public @interface AutoConfigurationPackage {

}
```

```java
public abstract class AutoConfigurationPackages {
    private static final String BEAN = AutoConfigurationPackages.class.getName();
    
    static class Registrar implements ImportBeanDefinitionRegistrar, DeterminableImports {

        // step 1.
        @Override
        public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
            // step 2.
            // 将注解标的元信息传入，获取到相应的包名
            // 第 2 个参数，lsieun.mytest
            register(registry, new PackageImport(metadata).getPackageName());
        }

        @Override
        public Set<Object> determineImports(AnnotationMetadata metadata) {
            return Collections.singleton(new PackageImport(metadata));
        }
    }

    // step 2.
    public static void register(BeanDefinitionRegistry registry, String... packageNames) {
        // 第 2 个参数，packageNames，默认情况下就是一个字符串，是使用了注解，值为 lsieun.mytest
        // @SpringBootApplication 的 Spring Boot 应用程序入口类所在的包

        if (registry.containsBeanDefinition(BEAN)) {
            // 如果该 Bean 已经注册，则将要注册包名称添加进去
            BeanDefinition beanDefinition = registry.getBeanDefinition(BEAN);
            ConstructorArgumentValues constructorArguments = beanDefinition.getConstructorArgumentValues();
            constructorArguments.addIndexedArgumentValue(0, addBasePackages(constructorArguments, packageNames));
        } else {
            // 如果该 Bean 尚未注册，则注册该 Bean，参数中提供的包名称会被设置到 Bean 定义中去
            GenericBeanDefinition beanDefinition = new GenericBeanDefinition();
            
            // step 3. BasePackages
            beanDefinition.setBeanClass(BasePackages.class);
            beanDefinition.getConstructorArgumentValues().addIndexedArgumentValue(0, packageNames);
            beanDefinition.setRole(BeanDefinition.ROLE_INFRASTRUCTURE);
            registry.registerBeanDefinition(BEAN, beanDefinition);
        }
    }

    // step 3.
    static final class BasePackages {
        private final List<String> packages;

        BasePackages(String... names) {
            List<String> packages = new ArrayList<>();
            for (String name : names) {
                if (StringUtils.hasText(name)) {
                    packages.add(name);
                }
            }
            this.packages = packages;
        }
    }
}
```

`AutoConfigurationPackages.Registrar` 这个类就做一件事，注册一个 Bean，这个 Bean 就是
`org.springframework.boot.autoconfigure.AutoConfigurationPackages.BasePackages`，
它有一个参数，这个参数是使用 `@AutoConfigurationPackages` 这个注解的类所在的包路径，保存自动配置类，以供之后的使用。

### AutoConfigurationImportSelector.class

`@Import(AutoConfigurationImportSelector.class)`：将 `AutoConfigurationImportSelector` 这个类导入到 Spring 容器中。

`AutoConfigurationImportSelector` 可以帮助 Spring Boot 应用将所有符合条件的 `@Configuration` 配置都加载到
当前 Spring Boot 创建并使用的 IOC 容器（`ApplicataionContext`）中。

`AutoConfigurationImportSelector` 重点是实现了 `DeferredImportSelector` 接口和各种 `Aware` 接口；
而 `DeferredImportSelector` 接口，又继承了 `ImportSelector` 接口；
各个 `Aware` 接口，分别会在某个时机会被回调。

```java
public class AutoConfigurationImportSelector implements DeferredImportSelector,
        BeanClassLoaderAware, ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {
    //
}
```


![](/assets/images/spring-boot/src/auto-configuration-import-selector.png)

```java
public interface DeferredImportSelector extends ImportSelector {
    interface Group {
        void process(AnnotationMetadata metadata, DeferredImportSelector selector);

        Iterable<Entry> selectImports();

        class Entry {
            private final AnnotationMetadata metadata;
            private final String importClassName;
        }
    }
}
```

确定**自动配置**实现逻辑的入口方法：

跟自动配置逻辑相关的入口方法在 `ConfigurationClassParser.DeferredImportSelectorGrouping` 类的 `getImports` 方法处，
因此，我们就从 `DeferredImportSelectorGrouping` 类的 `getImports` 方法来分析 Spring Boot 的自动配置源码。

```java
class ConfigurationClassParser {
    private static class DeferredImportSelectorGrouping {
        private final DeferredImportSelector.Group group;
        private final List<DeferredImportSelectorHolder> deferredImports = new ArrayList<>();
        
        public Iterable<Group.Entry> getImports() {
            // 遍历 DeferredImportSelectorHolder 对象集合 deferredImports。
            // deferredImports 集合里装了各种 ImportSelector，
            // 当然，这里装的是 AutoConfigurationImportSelector
            for (DeferredImportSelectorHolder deferredImport : this.deferredImports) {
                // 第 1 步，利用 AutoConfigurationGroup 的 process 方法来处理自动配置的相关逻辑，
                // 决定导入哪些配置类（这个是我们分析的重点，自动配置的逻辑全在这了）
                this.group.process(
                        deferredImport.getConfigurationClass().getMetadata(), // 这里是 DemoApplication 的注解
                        deferredImport.getImportSelector() // AutoConfigurationImportSelector
                );
            }
            
            // 第 2 步，经过上面的处理后，然后再进行选择导入哪些配置类。
            return this.group.selectImports();
        }
    }

    private static class DeferredImportSelectorHolder {

        private final ConfigurationClass configurationClass;

        private final DeferredImportSelector importSelector;

        public DeferredImportSelectorHolder(ConfigurationClass configClass, DeferredImportSelector selector) {
            this.configurationClass = configClass;
            this.importSelector = selector;
        }

        public ConfigurationClass getConfigurationClass() {
            return this.configurationClass;
        }

        public DeferredImportSelector getImportSelector() {
            return this.importSelector;
        }
    }
}
```

在第 1 步中，

```text
this.group.process(
    deferredImport.getConfigurationClass().getMetadata(),
    deferredImport.getImportSelector()
);
```

`this.group` 即 `AutoConfigurationImportSelector.AutoConfigurationGroup` 对象的 `process` 方法中，
传入 `AutoConfigurationImportSelector` 对象来选择一些符合条件的自动配置类，过滤掉一些不符合条件的自动配置类。

`AutoConfigurationGroup` 是 `AutoConfigurationImportSelector` 的内部类，主要用来处理自动配置相关的逻辑，
拥有 `process` 和 `selectImports` 方法，然后拥有

```java
public class AutoConfigurationImportSelector implements DeferredImportSelector,
        BeanClassLoaderAware, ResourceLoaderAware, BeanFactoryAware, EnvironmentAware,
        Ordered {
    // 
    private ConfigurableListableBeanFactory beanFactory;

    private Environment environment;

    private ClassLoader beanClassLoader;

    private ResourceLoader resourceLoader;

    protected AutoConfigurationEntry getAutoConfigurationEntry(AutoConfigurationMetadata autoConfigurationMetadata,
                                                               AnnotationMetadata annotationMetadata) {
        // 获取是否有配置 spring.boot.enableautoconfiguration属性，默认返回 true
        if (!isEnabled(annotationMetadata)) {
            return EMPTY_ENTRY;
        }
        AnnotationAttributes attributes = getAttributes(annotationMetadata);

        // 第 1 步，得到 spring.factories 文件配置的所有自动配置类
        List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);

        // 利用 LinkedHashSet 移除重复的配置类
        configurations = removeDuplicates(configurations);

        // 得到要排除的自动配置类，比如注解属性 exclude的配置类
        // 比如：@SpringBootApplication(exclude=FreeMarkerAutoConfiguration.class)
        // 将会获取到 exclude = FreeMarkerAutoConfiguration.class 的注解数据
        Set<String> exclusions = getExclusions(annotationMetadata, attributes);

        // 检查要被排查的配置类，因为有些不是自动配置类，故要抛出异常
        checkExcludedClasses(configurations, exclusions);

        // 第 2 步，将要排除的配置类移除
        configurations.removeAll(exclusions);

        // 第 3 步，因为从 spring.factories 文件获取的自动配置类太多
        // 如果有些不必要的自动配置类都加载进内存，会造成内存浪费，因此这里需要进行过滤
        configurations = filter(configurations, autoConfigurationMetadata);

        // 第 4 步，获取了符合条件的自动配置类后，此时触发 AutoConfigurationImportEvent 事件，
        // 目的是告诉 ConditionEvaluationReport 条件评估报告器对象来记录符合条件的自动配置类
        fireAutoConfigurationImportEvents(configurations, exclusions);

        // 第 5 步，将符合条件和要排除的自动配置类封装进 AutoConfigurationEntry 对象，并返回
        return new AutoConfigurationEntry(configurations, exclusions);
    }

    protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
        // 这个方法需要传入两个参数：getSpringFactoriesLoaderFactoryClass()和getBeanClassLoader()
        // getSpringFactoriesLoaderFactoryClass() 这个方法返回的是 EnableAutoConfiguration.class
        // getBeanClassLoader() 这个方法返回的是 beanClassLoader （类加载器）
        List<String> configurations = SpringFactoriesLoader.loadFactoryNames(
                getSpringFactoriesLoaderFactoryClass(),
                getBeanClassLoader()
        );
        Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you "
                + "are using a custom packaging, make sure that file is correct.");
        return configurations;
    }

    protected Class<?> getSpringFactoriesLoaderFactoryClass() {
        return EnableAutoConfiguration.class;
    }

    protected static class AutoConfigurationEntry {
        private final List<String> configurations;
        private final Set<String> exclusions;

        private AutoConfigurationEntry() {
            this.configurations = Collections.emptyList();
            this.exclusions = Collections.emptySet();
        }
    }

    private static class AutoConfigurationGroup implements DeferredImportSelector.Group,
            BeanClassLoaderAware, BeanFactoryAware, ResourceLoaderAware {

        private final List<AutoConfigurationEntry> autoConfigurationEntries = new ArrayList<>();
        private final Map<String, AnnotationMetadata> entries = new LinkedHashMap<>();
        
        @Override
        public void process(AnnotationMetadata annotationMetadata, DeferredImportSelector deferredImportSelector) {
            Assert.state(deferredImportSelector instanceof AutoConfigurationImportSelector,
                    () -> String.format("Only %s implementations are supported, got %s",
                            AutoConfigurationImportSelector.class.getSimpleName(),
                            deferredImportSelector.getClass().getName()));

            // 第 1 步，调用 getAutoConfigurationEntry 方法得到自动配置类，放入 autoConfigurationEntry 对象中
            AutoConfigurationEntry autoConfigurationEntry = ((AutoConfigurationImportSelector) deferredImportSelector)
                    .getAutoConfigurationEntry(getAutoConfigurationMetadata(), annotationMetadata);

            // 第 2 步，又将封装了自动配置类的 autoConfigurationEntry 对象装进 autoConfigurationEntries 集合
            this.autoConfigurationEntries.add(autoConfigurationEntry);

            // 第 3 步，遍历刚获取的自动配置类
            for (String importClassName : autoConfigurationEntry.getConfigurations()) {
                // 这里符合条件的自动配置类作为 key，annotationMetadata 作为值放进 entries 集合
                this.entries.putIfAbsent(importClassName, annotationMetadata);
            }
        }

        @Override
        public Iterable<Entry> selectImports() {
            if (this.autoConfigurationEntries.isEmpty()) {
                return Collections.emptyList();
            }

            // 第 1 步，得到所有要排除的自动配置类的Set集合
            Set<String> allExclusions = this.autoConfigurationEntries.stream()
                    .map(AutoConfigurationEntry::getExclusions).flatMap(Collection::stream)
                    .collect(Collectors.toSet());

            // 第 2 步，得到经过过滤后所有符合条件的自动配置类的Set集合
            Set<String> processedConfigurations = this.autoConfigurationEntries.stream()
                    .map(AutoConfigurationEntry::getConfigurations).flatMap(Collection::stream)
                    .collect(Collectors.toCollection(LinkedHashSet::new));

            // 第 3 步，移除要排除的自动配置类
            processedConfigurations.removeAll(allExclusions);

            // 第 4 步，对标注有@Order注解的自动配置类进行排序
            return sortAutoConfigurations(processedConfigurations, getAutoConfigurationMetadata()).stream()
                    .map((importClassName) -> new Entry(this.entries.get(importClassName), importClassName))
                    .collect(Collectors.toList());
        }

        private AutoConfigurationMetadata getAutoConfigurationMetadata() {
            if (this.autoConfigurationMetadata == null) {
                this.autoConfigurationMetadata = AutoConfigurationMetadataLoader.loadMetadata(this.beanClassLoader);
            }
            return this.autoConfigurationMetadata;
        }
    }
}
```

```java
final class AutoConfigurationMetadataLoader {
    // 默认加载元数据的路径
    protected static final String PATH = "META-INF/spring-autoconfigure-metadata.properties";

    // 默认调用该方法，传入默认 PATH
    static AutoConfigurationMetadata loadMetadata(ClassLoader classLoader) {
        return loadMetadata(classLoader, PATH);
    }

    static AutoConfigurationMetadata loadMetadata(ClassLoader classLoader, String path) {
        try {
            // 获取数据存储于 Enumeration 中
            Enumeration<URL> urls = (classLoader != null) ? classLoader.getResources(path)
                    : ClassLoader.getSystemResources(path);
            Properties properties = new Properties();
            while (urls.hasMoreElements()) {
                URL url = urls.nextElement();
                Properties props = PropertiesLoaderUtils.loadProperties(new UrlResource(url));
                properties.putAll(props);
            }
            return loadMetadata(properties);
        } catch (IOException ex) {
            throw new IllegalArgumentException("Unable to load @ConditionalOnClass location [" + path + "]", ex);
        }
    }
}
```

## 关于条件注解的讲解

`@Conditional` 是 Spring 4 新提供的注解，它的作用是按照一定的条件进行判断，满足条件给容器注册 bean。

- `@ConditionalOnBean`：仅仅在当前上下文中存在某个对象时，才会实例化一个 Bean。
- `@ConditionalOnClass`：某个 class 位于类路径上，才会实例化一个 Bean。
- `@ConditionalOnExpression`：当表达式为 `true` 的时候，才会实例化一个 Bean。基于 SpEL 表达式的条件判断。
- `@ConditionalOnMissingBean`：仅仅在当前上下文中不存在某个对象时，才会实例化一个Bean。
- `@ConditionalOnMissingClass`：在类路径上不存在某个class 的时候，才会实例化一个Bean。
- `@ConditionalOnWebApplication`：当项目是一个 Web 项目时进行实例化
- `@ConditionalOnNotWebApplication`：不是 Web 应用，才会实例化一个Bean
- `@ConditionalOnProperty`：当指定的属性有指定的值时进行实例化。
- `@ConditionalOnJava`：当 JVM 版本为指定的版本范围时，触发实例化。
- `@ConditionalOnResource`：当类路径下有指定的资源时，触发实例化。
- `@ConditionalOnJndi`：在 JNDI 存在的条件下触发实例化。
- `@ConditionalOnSingleCandidate`：当指定的Bean在容器中只有一个，或者有多个，但是指定了首选的Bean时触发实例化。

```java
@ConditionalOnProperty(prefix = "spring.http.encoding", value = "enabled", matchIfMissing = true)
public class HttpEncodingAutoConfiguration {
    // ...
}
```


## @ComponentScan

主要是从定义的扫描路径中，找出标识了需要装配的类，自动装配到 Spring 的 Bean 容器中。

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@Documented
@Repeatable(ComponentScans.class)
public @interface ComponentScan {
    @AliasFor("basePackages")
    String[] value() default {};

    @AliasFor("value")
    String[] basePackages() default {};

    Filter[] includeFilters() default {};

    Filter[] excludeFilters() default {};
}
```

常用属性如下：

- `basePackages`、`value`：指定扫描路径；如果为空，则以 `@ComponentScan` 注解的类所在的包为基本的扫描路径
- `basePackageClasses`：指定具体扫描的类
- `includeFilters`：指定满足 Filter 条件的类
- `excludeFilters`：指定排除 Filter 条件的类

`includeFilters` 和 `excludeFilters` 的 `FilterType` 可选：
ANNOTATION（注解类型，默认）、ASSIGNABLE_TYPE（指定固定类）、ASPECTJ（ASPECTJ 类型）、
REGEX（正则表达式）、CUSTOM（自定义类型，自定义的 Filter 需要实现 TypeFilter 接口）

`@ComponentScan` 的配置如下：

```text
@ComponentScan(excludeFilters = {
        @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
        @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class)
})
```

借助 `excludeFilters` 将 `TypeExcludeFilter` 和 `AutoConfigurationExcludeFilter` 这两个类排除。

当前 `@ComponentScan` 注解没有标注 `basePackages` 及 `value`，所以扫描路径默认为 `@ComponentScan` 注解的类
所在的包为基本的扫描路径（也就是标注了 `@SpringBootApplication` 注解的项目启动类所在的路径）

提出疑问：`@EnableAutoConfiguration` 注解是通过 `@Import` 注解进行了自动配置固定的 Bean；
`@ComponentScan` 注解自动进行注解扫描，那么真正根据包扫描，把组件类生成实例对象存到 IOC 容器中，又是怎么来完成的？

## SpringFactoriesLoader

```java
public final class SpringFactoriesLoader {
    public static final String FACTORIES_RESOURCE_LOCATION = "META-INF/spring.factories";

    private static final Map<ClassLoader, MultiValueMap<String, String>> cache = new ConcurrentReferenceHashMap<>();

    private static Map<String, List<String>> loadSpringFactories(@Nullable ClassLoader classLoader) {
        MultiValueMap<String, String> result = cache.get(classLoader);
        if (result != null) {
            return result;
        }

        try {
            Enumeration<URL> urls = (classLoader != null ?
                    classLoader.getResources(FACTORIES_RESOURCE_LOCATION) :
                    ClassLoader.getSystemResources(FACTORIES_RESOURCE_LOCATION));
            result = new LinkedMultiValueMap<>();
            while (urls.hasMoreElements()) {
                URL url = urls.nextElement();
                UrlResource resource = new UrlResource(url);
                Properties properties = PropertiesLoaderUtils.loadProperties(resource);
                for (Map.Entry<?, ?> entry : properties.entrySet()) {
                    String factoryTypeName = ((String) entry.getKey()).trim();
                    for (String factoryImplementationName : StringUtils.commaDelimitedListToStringArray((String) entry.getValue())) {
                        result.add(factoryTypeName, factoryImplementationName.trim());
                    }
                }
            }
            cache.put(classLoader, result);
            return result;
        }
        catch (IOException ex) {
            throw new IllegalArgumentException("Unable to load factories from location [" +
                    FACTORIES_RESOURCE_LOCATION + "]", ex);
        }
    }
}
```

## HttpEncodingAutoConfiguration

```java
// 这是一个配置类，
@Configuration(proxyBeanMethods = false)

// 启动指定类的 ConfigurationProperties 功能，将配置文件中对应的值和HttpProperties绑定起来
@EnableConfigurationProperties(HttpProperties.class)

// Spring 底层 @Conditional 注解，根据不同的条件
// 如果满足指定的条件，整个配置类里面的配置就会生效；
// 判断当前应用是否是 Web 应用；如果是，当前配置类生效。
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)

// 判断当前项目 classpath 中有没有 CharacterEncodingFilter 类：SpringMVC 中进行乱码解决的过滤器
@ConditionalOnClass(CharacterEncodingFilter.class)

// 判断配置文件中是否存在某个配置 spring.http.encoding.enabled 如果不存在，判断也是成立的
// matchIfMissing = true 表示即使我们配置文件中不配置 spring.http.encoding.enabled=true，也是默认生效的
@ConditionalOnProperty(prefix = "spring.http.encoding", value = "enabled", matchIfMissing = true)
public class HttpEncodingAutoConfiguration {
    //
}
```

