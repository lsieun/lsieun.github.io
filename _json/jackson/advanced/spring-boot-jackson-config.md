---
title: "Spring Boot: JacksonConfig.java"
sequence: "102"
---

```java
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import org.geolatte.geom.json.GeolatteGeomModule;
import org.geolatte.geom.json.Setting;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;


@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper getObjectMapper(Jackson2ObjectMapperBuilder builder) {
        ObjectMapper mapper = builder.build();

        // 注册 之后 org.geolatte.geom.Geometry 将能够转换标准GeoJSON格式
        GeolatteGeomModule module = new GeolatteGeomModule();
        module.set(Setting.IGNORE_CRS, true);
        module.set(Setting.SUPPRESS_CRS_SERIALIZATION, true);
        mapper.registerModule(module);

        return mapper;
    }

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
        // Jackson全局转化long类型为String，解决jackson序列化时long类型缺失精度问题
        Jackson2ObjectMapperBuilderCustomizer customizer = new Jackson2ObjectMapperBuilderCustomizer() {
            @Override
            public void customize(Jackson2ObjectMapperBuilder jacksonObjectMapperBuilder) {
                jacksonObjectMapperBuilder
                        .serializerByType(Long.class, ToStringSerializer.instance)
                        .serializerByType(Long.TYPE, ToStringSerializer.instance);
            }
        };
        return customizer;
    }
}
```
