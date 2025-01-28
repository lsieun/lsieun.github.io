---
title: "Spring Boot: Customize the Jackson ObjectMapper"
sequence: "101"
---

## Default Configuration

By default, the Spring Boot configuration will disable the following:

- `MapperFeature.DEFAULT_VIEW_INCLUSION`
- `DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES`
- `SerializationFeature.WRITE_DATES_AS_TIMESTAMPS`

## Customizing the Default ObjectMapper

### Application Properties and Custom Jackson Module

**The simplest way to configure the mapper is via application properties.**

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

Configuring the environment variables is the simplest approach.
**The downside of this approach is that we can't customize advanced options like having a custom date format for `LocalDateTime`.**

In order to achieve our goal, we'll register a new `JavaTimeModule` with our custom date format:

```java
@Configuration
@PropertySource("classpath:coffee.properties")
public class CoffeeRegisterModuleConfig {

    @Bean
    public Module javaTimeModule() {
        JavaTimeModule module = new JavaTimeModule();
        module.addSerializer(LOCAL_DATETIME_SERIALIZER);
        return module;
    }
}
```

Also, the configuration properties file `coffee.properties` will contain the following:

```text
spring.jackson.default-property-inclusion=non_null
```

Spring Boot will automatically register any bean of type `com.fasterxml.jackson.databind.Module`.
Here's our final result:

```text
{
  "brand": "Lavazza",
  "date": "16-11-2020 10:43"
}
```

### Jackson2ObjectMapperBuilderCustomizer

The purpose of this functional interface is to allow us to create configuration beans.

They will be applied to the default `ObjectMapper` created via `Jackson2ObjectMapperBuilder`:

```text
@Bean
public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
    return builder -> builder.serializationInclusion(JsonInclude.Include.NON_NULL)
      .serializers(LOCAL_DATETIME_SERIALIZER);
}
```

**The configuration beans are applied in a specific order, which we can control using the `@Order` annotation.**
This elegant approach is suitable if we want to configure the `ObjectMapper` from different configurations or modules.

## Overriding the Default Configuration

If we want to have full control over the configuration,
there are several options that will disable the auto-configuration and allow only our custom configuration to be applied.

Let's take a close look at these options.

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

**We should use this approach
when we want to have full control over the serialization process and don't want to allow external configuration.**

### Jackson2ObjectMapperBuilder

Another clean approach is to define a `Jackson2ObjectMapperBuilder` bean.

Spring Boot actually uses this builder by default
when building the `ObjectMapper` and will automatically pick up the defined one:

```text
@Bean
public Jackson2ObjectMapperBuilder jackson2ObjectMapperBuilder() {
    return new Jackson2ObjectMapperBuilder().serializers(LOCAL_DATETIME_SERIALIZER)
      .serializationInclusion(JsonInclude.Include.NON_NULL);
}
```

It will configure two options by default:

- disable `MapperFeature.DEFAULT_VIEW_INCLUSION`
- disable `DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES`

According to the `Jackson2ObjectMapperBuilder` documentation,
it will also register some modules if they're present on the classpath:

- `jackson-datatype-jdk8`: support for other Java 8 types like Optional
- `jackson-datatype-jsr310`: support for Java 8 Date and Time API types
- `jackson-datatype-joda`: support for Joda-Time types
- `jackson-module-kotlin`: support for Kotlin classes and data classes

**The advantage of this approach is that
the `Jackson2ObjectMapperBuilder` offers a simple and intuitive way to build an `ObjectMapper`.**

### MappingJackson2HttpMessageConverter

We can just define a bean with type `MappingJackson2HttpMessageConverter`, and Spring Boot will automatically use it:

```text
@Bean
public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
    Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder().serializers(LOCAL_DATETIME_SERIALIZER)
      .serializationInclusion(JsonInclude.Include.NON_NULL);
    return new MappingJackson2HttpMessageConverter(builder.build());
}
```

## Testing the Configuration

To test our configuration, we'll use `TestRestTemplate` and serialize the objects as String.

In this way, we can validate that our `Coffee` object is serialized without `null` values and with the custom date format:

```text
@Test
public void whenGetCoffee_thenSerializedWithDateAndNonNull() {
    String formattedDate = DateTimeFormatter.ofPattern(CoffeeConstants.dateTimeFormat).format(FIXED_DATE);
    String brand = "Lavazza";
    String url = "/coffee?brand=" + brand;
    
    String response = restTemplate.getForObject(url, String.class);
    
    assertThat(response).isEqualTo("{\"brand\":\"" + brand + "\",\"date\":\"" + formattedDate + "\"}");
}
```

## Reference

- [Spring Boot: Customize the Jackson ObjectMapper](https://www.baeldung.com/spring-boot-customize-jackson-objectmapper)
