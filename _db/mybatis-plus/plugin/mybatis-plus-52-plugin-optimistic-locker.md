---
title: "Wrapper: 乐观锁"
sequence: "152"
---

## 乐观锁与悲观锁

## 数据表

添加数据表：

```text
DROP TABLE IF EXISTS `product`;
CREATE TABLE product
(
  `id` BIGINT(20) NOT NULL COMMENT '主键ID',
  `name` VARCHAR(30) NULL DEFAULT NULL COMMENT '商品名称',
  `price` INT(11) DEFAULT 0 COMMENT '价格',
  `version` INT(11) DEFAULT 0 COMMENT '乐观锁版本号',
  PRIMARY KEY (id)
);
```

添加数据：

```text
INSERT INTO product (`id`, `name`, `price`) VALUES (1, '笔记本', 10);
```

## entity

```java
package lsieun.batisplus.entity;

import lombok.Data;

@Data
public class Product {
    private Long id;
    private String name;
    private Integer price;
    private Integer version;
}
```

## DAO

```java
package lsieun.batisplus.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import lsieun.batisplus.entity.Product;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductMapper extends BaseMapper<Product> {
}
```

## Test

```java
package lsieun.batisplus.mapper;

import lsieun.batisplus.entity.Product;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ProductMapperTest {
    @Autowired
    private ProductMapper productMapper;

    @Test
    void testUpdate() {
        Product p1 = productMapper.selectById(1L);
        System.out.println("p1: " + p1.getPrice());

        Product p2 = productMapper.selectById(1L);
        System.out.println("p2: " + p2.getPrice());

        p1.setPrice(p1.getPrice() + 50);
        int result1 = productMapper.updateById(p1);
        System.out.println("result1: " + result1);

        p2.setPrice(p2.getPrice() - 30);
        int result2 = productMapper.updateById(p2);
        System.out.println("result2: " + result2);

        Product p3 = productMapper.selectById(1L);
        System.out.println("p3: " + p3.getPrice());
    }
}
```

## Mybatis-Plus 实现乐观锁

### Entity

```java
package lsieun.batisplus.entity;

import com.baomidou.mybatisplus.annotation.Version;
import lombok.Data;

@Data
public class Product {
    private Long id;
    private String name;
    private Integer price;
    @Version // 标识乐观锁版本号字段
    private Integer version;
}
```

### Config

```java
package lsieun.batisplus.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("lsieun.batisplus.mapper") // 可以将主类中的注解移到此处
public class MyBatisPlusConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 添加分页插件
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        
        // 添加乐观锁插件
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        return interceptor;
    }
}
```
