---
title: "OpenFeign：拦截器配置-自定义拦截器实现认证逻辑"
sequence: "105"
---

## Interceptor

```java
import feign.RequestInterceptor;
import feign.RequestTemplate;

import java.util.UUID;

public class FeignAuthRequestInterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate template) {
        // 业务逻辑
        String access_token = UUID.randomUUID().toString();
        template.header("Authorization", access_token);
        // template.query("id", "123");
        // template.uri("/good");
    }
}
```

在`service-provider`端，可以通过`@RequestHeader`获取请求参数，建议在filter和interceptor中处理。

## 配置类

```java
import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    /**
     * 自定义拦截器
     */
    @Bean
    public FeignAuthRequestInterceptor feignAuthRequestInterceptor() {
        return new FeignAuthRequestInterceptor();
    }
}
```

### 配置文件

```text
feign.client.config.service-provider.request-interceptors[0]=lsieun.feign.interceptor.FeignAuthRequestInterceptor
```

