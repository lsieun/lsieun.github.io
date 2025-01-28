---
title: "Spring Boot: Auto Configure Jackson"
sequence: "103"
---

## spring-boot-autoconfigure-2.7.5.jar

### Jackson2ObjectMapperBuilderCustomizer

```java
@FunctionalInterface
public interface Jackson2ObjectMapperBuilderCustomizer {

	/**
	 * Customize the JacksonObjectMapperBuilder.
	 * @param jacksonObjectMapperBuilder the JacksonObjectMapperBuilder to customize
	 */
	void customize(Jackson2ObjectMapperBuilder jacksonObjectMapperBuilder);

}
```

