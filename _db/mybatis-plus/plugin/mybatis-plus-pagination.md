---
title: "Mybatis-Plus 分页查询"
sequence: "105"
---

## 预先配置

注意：使用分页查询必须设置 mybatis-plus 提供的**分页插件**，才能实现分页效果

```java
package com.jm.dma.config;

import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement
@Configuration
@MapperScan("com.jm.dma.dao")
public class MybatisPlusConfig {
    @Bean
    public PaginationInnerInterceptor paginationInnerInterceptor() {
        return new PaginationInnerInterceptor();
    }
}
```

## 分页查询

```java

```

