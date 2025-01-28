---
title: "代码生成器"
sequence: "161"
---

## 引入依赖

```text
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.5.3</version>
</dependency>
<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
    <version>2.3.31</version>
</dependency>
```

```java
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.engine.FreemarkerTemplateEngine;

import java.util.Collections;

public class FastAutoGeneratorTest {
    public static void main(String[] args) {
        FastAutoGenerator.create("jdbc:mysql://192.168.80.128:3306/mybatis_plus?serverTimezone=GMT%2B8&characterEncoding=utf-8&useSSL=false",
                "root", "123456")
                .globalConfig(builder -> {
                    builder.author("liusen") // 设置作用
                            .enableSwagger() // 开启 swagger 模式
                            .fileOverride()
                            .outputDir("D://mybatis_plus"); //指定输出目录
                })
                .packageConfig(builder -> {
                    builder.parent("lsieun.batisplus") // 设置父包名
                            .moduleName("xxx")
                            .pathInfo(Collections.singletonMap(OutputFile.xml, "D://mybatis_plus"));
                })
                .strategyConfig(builder -> {
                    builder.addInclude("user") // 设置需要生成的表名
                            .addTablePrefix("t_", "c_"); // 设置过滤表前缀
                })
                .templateEngine(new FreemarkerTemplateEngine()) // 使用 Freemarker 引擎模板，默认的是 Velocity 引擎模板
                .execute();
    }
}
```

## Reference

- [代码生成器配置新](https://baomidou.com/pages/981406/)
- [EasyCode](https://gitee.com/makejava/EasyCode)
