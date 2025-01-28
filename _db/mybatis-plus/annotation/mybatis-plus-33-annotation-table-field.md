---
title: "Annotation: @TableField"
sequence: "133"
---

## Examples

### name

```java
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

@Data
public class User {
    private Long id;
    @TableField(value = "user_name")
    private String name;
    private Integer age;
    private String email;
}
```

### fill

```text
@TableField(fill = FieldFill.INSERT_UPDATE)
```

```java
import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * <p>
 * 水泵 - 参数
 * </p>
 *
 * @author xxx
 * @since 2023/02/03
 */
@Data
@TableName(value = "biz_pump_param")
public class PumpParam implements Serializable {
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    /**
     * ID
     */
    @TableId
    private Long id;

    /**
     * 水泵 ID
     */
    private Long pumpId;

    /**
     * 水泵曲线 ID
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long pumpCurveId;

    /**
     * 效率曲线 ID
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long efficiencyCurveId;


    /**
     * 模式 ID
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long patternId;


    /**
     * 价格模式 ID
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long pricePatternId;

    /**
     * 排序
     */
    private Integer orderNumber;

    /**
     * 乐观锁
     */
    @Version
    private Integer version;
}
```
