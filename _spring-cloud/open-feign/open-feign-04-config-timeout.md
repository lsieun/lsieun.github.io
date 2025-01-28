---
title: "OpenFeign：超时时间配置"
sequence: "104"
---

## 配置类

```java
import feign.Logger;
import feign.Request;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class FeignConfig {
    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public Request.Options options() {
        return new Request.Options(5, TimeUnit.SECONDS, 10, TimeUnit.SECONDS, true);
    }
}
```

## 配置文件

```text
# feign.client.config.服务名.connect-timeout默认值是2s
feign.client.config.service-provider.connect-timeout=5000
# feign.client.config.服务名.read-timeout默认值是5s
feign.client.config.service-provider.read-timeout=10000
```
