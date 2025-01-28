---
title: "Customizing the Default ObjectMapper"
sequence: "102"
---

When using JSON format, Spring Boot will use a Jackson `ObjectMapper` instance
to serialize responses and deserialize requests.

## Customizing the Default ObjectMapper

### Application Properties and Custom Jackson Module

**The simplest way to configure the mapper is via `application.properties`.**

Here's the general structure of the configuration:

```text
spring.jackson.<category_name>.<feature_name>=true,false
```

As an example, here's what we'll add to disable `SerializationFeature.WRITE_DATES_AS_TIMESTAMPS`:

```text
spring.jackson.serialization.write-dates-as-timestamps=false
```

Besides the mentioned feature categories, we can also configure property inclusion:

```text
spring.jackson.default-property-inclusion=always, non_null, non_absent, non_default, non_empty
```

### Jackson2ObjectMapperBuilderCustomizer

The purpose of this functional interface is to allow us to create configuration beans.

They will be applied to the default `ObjectMapper` created via `Jackson2ObjectMapperBuilder`:

```java

```

**The configuration beans are applied in a specific order, which we can control using the `@Order` annotation.**
This elegant approach is suitable if we want to configure the `ObjectMapper` from different configurations or modules.

## Overriding the Default Configuration

### ObjectMapper

The simplest way to override the default configuration is to define an `ObjectMapper` bean and to mark it as `@Primary`:

```text
@Bean
@Primary
public ObjectMapper objectMapper() {
    JavaTimeModule module = new JavaTimeModule();
    module.addSerializer(LOCAL_DATETIME_SERIALIZER);
    return new ObjectMapper()
      .setSerializationInclusion(JsonInclude.Include.NON_NULL)
      .registerModule(module);
}
```

We should use this approach when we want to have full control over the serialization process and
don't want to allow external configuration.

### Jackson2ObjectMapperBuilder

### MappingJackson2HttpMessageConverter



## Reference

- [Spring Boot: Customize the Jackson ObjectMapper](https://www.baeldung.com/spring-boot-customize-jackson-objectmapper)
