---
title: "Status Code"
sequence: "101"
---

```java
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/status")
public class StatusController {

    @GetMapping("/teapot")
    @ResponseStatus(HttpStatus.I_AM_A_TEAPOT)
    String teapot() {
        return "I'm a teapot";
    }
}
```

## Reference

- [Using Spring @ResponseStatus to Set HTTP Status Code](https://www.baeldung.com/spring-response-status)
