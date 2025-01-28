---
title: "配置Jackson转换Long为String类型"
sequence: "104"
---

Jackson对`long`型的转换是没有问题的。
只不过前端js有个问题，java的long型，在转换后，js中展示会损失精度。
如：1500829886697496578，在前端使用js数字类型展示是可能就变成了1500829886697496600。
为了解决这个问题，一般情况下我们会将后端的Long型转换为字符串类型。

在Spring boot环境下，配置如下代码即可：

```java
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonConfig {
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer() {
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

## Reference

- [Springboot Long类型转String](https://zhuanlan.zhihu.com/p/421177959)
