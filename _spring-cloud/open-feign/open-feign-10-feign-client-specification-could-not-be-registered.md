---
title: "OpenFeign：FeignClientSpecification could not be registered"
sequence: "110"
---

## 错误信息

```text
***************************
APPLICATION FAILED TO START
***************************

Description:

The bean 'xxx.FeignClientSpecification' could not be registered.
 A bean with that name has already been defined and overriding is disabled.

Action:

Consider renaming one of the beans or enabling overriding by setting
spring.main.allow-bean-definition-overriding=true
```

## 原因分析

多个FeignClient访问同一个目标服务,导致`value`值相同。

```text
@FeignClient(value = "product.center", path = "/info")
```

在`FeignClient`的自动配置类`org.springframework.cloud.openfeign.FeignClientsRegistrar`中注册Bean时，导致BeanName相同，报错：

```java
class FeignClientsRegistrar implements ImportBeanDefinitionRegistrar, ResourceLoaderAware, EnvironmentAware {
    public void registerFeignClients(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {

        LinkedHashSet<BeanDefinition> candidateComponents = new LinkedHashSet<>();
        Map<String, Object> attrs = metadata.getAnnotationAttributes(EnableFeignClients.class.getName());
        final Class<?>[] clients = attrs == null ? null : (Class<?>[]) attrs.get("clients");
        if (clients == null || clients.length == 0) {
            ClassPathScanningCandidateComponentProvider scanner = getScanner();
            scanner.setResourceLoader(this.resourceLoader);
            scanner.addIncludeFilter(new AnnotationTypeFilter(FeignClient.class));
            Set<String> basePackages = getBasePackages(metadata);
            for (String basePackage : basePackages) {
                candidateComponents.addAll(scanner.findCandidateComponents(basePackage));
            }
        }
        else {
            for (Class<?> clazz : clients) {
                candidateComponents.add(new AnnotatedGenericBeanDefinition(clazz));
            }
        }

        // 第一步，在这里遍历所有的FeignClient
        for (BeanDefinition candidateComponent : candidateComponents) {
            if (candidateComponent instanceof AnnotatedBeanDefinition) {
                // verify annotated class is an interface
                AnnotatedBeanDefinition beanDefinition = (AnnotatedBeanDefinition) candidateComponent;
                AnnotationMetadata annotationMetadata = beanDefinition.getMetadata();
                Assert.isTrue(annotationMetadata.isInterface(), "@FeignClient can only be specified on an interface");

                // 这里使用FeignClient.class
                Map<String, Object> attributes = annotationMetadata
                        .getAnnotationAttributes(FeignClient.class.getCanonicalName());

                String name = getClientName(attributes);
                registerClientConfiguration(registry, name, attributes.get("configuration"));

                registerFeignClient(registry, annotationMetadata, attributes);
            }
        }
    }

    private void registerFeignClient(BeanDefinitionRegistry registry, AnnotationMetadata annotationMetadata,
                                     Map<String, Object> attributes) {
        // 这里出现了className
        String className = annotationMetadata.getClassName();
        Class clazz = ClassUtils.resolveClassName(className, null);
        ConfigurableBeanFactory beanFactory = registry instanceof ConfigurableBeanFactory
                ? (ConfigurableBeanFactory) registry : null;
        String contextId = getContextId(beanFactory, attributes);
        String name = getName(attributes);
        FeignClientFactoryBean factoryBean = new FeignClientFactoryBean();
        factoryBean.setBeanFactory(beanFactory);
        factoryBean.setName(name);
        factoryBean.setContextId(contextId);
        factoryBean.setType(clazz);
        factoryBean.setRefreshableClient(isClientRefreshEnabled());
        BeanDefinitionBuilder definition = BeanDefinitionBuilder.genericBeanDefinition(clazz, () -> {
            factoryBean.setUrl(getUrl(beanFactory, attributes));
            factoryBean.setPath(getPath(beanFactory, attributes));
            factoryBean.setDecode404(Boolean.parseBoolean(String.valueOf(attributes.get("decode404"))));
            Object fallback = attributes.get("fallback");
            if (fallback != null) {
                factoryBean.setFallback(fallback instanceof Class ? (Class<?>) fallback
                        : ClassUtils.resolveClassName(fallback.toString(), null));
            }
            Object fallbackFactory = attributes.get("fallbackFactory");
            if (fallbackFactory != null) {
                factoryBean.setFallbackFactory(fallbackFactory instanceof Class ? (Class<?>) fallbackFactory
                        : ClassUtils.resolveClassName(fallbackFactory.toString(), null));
            }
            return factoryBean.getObject();
        });
        definition.setAutowireMode(AbstractBeanDefinition.AUTOWIRE_BY_TYPE);
        definition.setLazyInit(true);
        validate(attributes);

        AbstractBeanDefinition beanDefinition = definition.getBeanDefinition();
        beanDefinition.setAttribute(FactoryBean.OBJECT_TYPE_ATTRIBUTE, className);
        beanDefinition.setAttribute("feignClientsRegistrarFactoryBean", factoryBean);

        // has a default, won't be null
        boolean primary = (Boolean) attributes.get("primary");

        beanDefinition.setPrimary(primary);

        // 这里出现了contextId
        String[] qualifiers = getQualifiers(attributes);
        if (ObjectUtils.isEmpty(qualifiers)) {
            qualifiers = new String[] { contextId + "FeignClient" };
        }

        // 这里构建BeanDefinitionHolder
        BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDefinition, className, qualifiers);
        BeanDefinitionReaderUtils.registerBeanDefinition(holder, registry);

        registerOptionsBeanDefinition(registry, contextId);
    }

    private String getClientName(Map<String, Object> client) {
        if (client == null) {
            return null;
        }
        String value = (String) client.get("contextId");
        if (!StringUtils.hasText(value)) {
            value = (String) client.get("value");
        }
        if (!StringUtils.hasText(value)) {
            value = (String) client.get("name");
        }
        if (!StringUtils.hasText(value)) {
            value = (String) client.get("serviceId");
        }
        if (StringUtils.hasText(value)) {
            return value;
        }

        throw new IllegalStateException(
                "Either 'name' or 'value' must be provided in @" + FeignClient.class.getSimpleName());
    }

    private void registerClientConfiguration(BeanDefinitionRegistry registry, Object name, Object configuration) {
        BeanDefinitionBuilder builder = BeanDefinitionBuilder.genericBeanDefinition(FeignClientSpecification.class);
        builder.addConstructorArgValue(name);
        builder.addConstructorArgValue(configuration);
        registry.registerBeanDefinition(name + "." + FeignClientSpecification.class.getSimpleName(),
                builder.getBeanDefinition());
    }
}
```

在`registerFeignClients`方法中扫描到指定包下所有的`FeignClient`，
并在`registerFeignClient`中构建对应的`BeanDefinition`对象并注入到容器中,但是这里可以看见, BeanName 是使用的每个FeignClient的类名:

```text
// 这里出现了className
String className = annotationMetadata.getClassName();
...
// 这里出现了contextId
String[] qualifiers = getQualifiers(attributes);
if (ObjectUtils.isEmpty(qualifiers)) {
    qualifiers = new String[] { contextId + "FeignClient" };
}

// 这里构建BeanDefinitionHolder
BeanDefinitionHolder holder = new BeanDefinitionHolder(beanDefinition, className, qualifiers);
BeanDefinitionReaderUtils.registerBeanDefinition(holder, registry);
```

所以不是`FeignClient`本身的问题

但是在`registerFeignClients`方法中，还有一行代码:

```text
String name = getClientName(attributes);
registerClientConfiguration(registry, name, attributes.get("configuration"));
```

这里注入的是每个`FeignClient`的自定义`configuration`(即`FeignClient`的`configuration`属性定义的配置类)

此类的名称取法如下:

```text
private String getClientName(Map<String, Object> client) {
    if (client == null) {
        return null;
    }
    String value = (String) client.get("contextId");
    if (!StringUtils.hasText(value)) {
        value = (String) client.get("value");
    }
    if (!StringUtils.hasText(value)) {
        value = (String) client.get("name");
    }
    if (!StringUtils.hasText(value)) {
        value = (String) client.get("serviceId");
    }
    if (StringUtils.hasText(value)) {
        return value;
    }

    throw new IllegalStateException(
            "Either 'name' or 'value' must be provided in @" + FeignClient.class.getSimpleName());
}
```

即可看到，在`contextId`属性为空的情况下，不同的`FeignClient`类，因为`value`值相同，所以`beanName`相同，生成方式如下:

```text
registry.registerBeanDefinition(name + "." + FeignClientSpecification.class.getSimpleName(),
				builder.getBeanDefinition());
```

## 解决方法

### 第一种

正如错误提示信息一样, 可以加如下配置：

```text
spring.main.allow-bean-definition-overriding=true
```

即当名称相同时，则覆盖。

这样可以解决问题，并且网上大多数都是这么解决的，但是这样可能会有一些问题：

- 第一，在上面的分析中，因为注入每个`FeignClient`的`configuration`配置信息类导致的。
  如果配置了可覆盖，那么所有的`FeignClient`都是使用同一份配置。
  在平常使用时，如果没有配置`configuration`属性，则没有问题；如果配置了，就不能使用这种方式。

- 第二，配置全局的可覆盖可能会隐藏简单的、代价小的、在启动时就会报错的问题，并且因为覆盖的原因，导致运行时出现无法追溯的问题。

### 第二种（推荐）

根据源码可以看出

```text
private String getClientName(Map<String, Object> client) {
    if (client == null) {
        return null;
    }
    String value = (String) client.get("contextId");
    if (!StringUtils.hasText(value)) {
        value = (String) client.get("value");
    }
    if (!StringUtils.hasText(value)) {
        value = (String) client.get("name");
    }
    if (!StringUtils.hasText(value)) {
        value = (String) client.get("serviceId");
    }
    if (StringUtils.hasText(value)) {
        return value;
    }

    throw new IllegalStateException(
            "Either 'name' or 'value' must be provided in @" + FeignClient.class.getSimpleName());
}
```

名称首要取的是`contextId`属性，如果不为空，则不会使用`value`作为名称，所以只需要在`value`相同的`FeignClient`配置不同的`contextId`即可：

```text
@FeignClient(contextId = "water-meter", name = "jm-meter-management-service", path = "/meter-management/water-meter")
```

## Reference

- [FeignClient 报错: A bean with that name has already been defined and overriding is disabled.](https://www.cnblogs.com/xjwhaha/p/15251904.html)
