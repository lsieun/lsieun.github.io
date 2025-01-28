---
title: "@RequestParam：快速开始"
sequence: "112"
---

## 示例一

```java
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.text.MessageFormat;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping("/search")
    public String search(@RequestParam String query,
                         @RequestParam(required = false, defaultValue = "0") int offset,
                         @RequestParam(required = false, defaultValue = "10") int limit) {
        return MessageFormat.format("query={0}, offset={1}, limit={2}", query, offset, limit);
    }

}
```
