---
title: "Spring Boot: Path Variables and Request Parameters"
sequence: "103"
---

## Controller

```java
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.Min;

@RestController
@Validated
public class ValidateParametersController {

    @GetMapping("/validatePathVariable/{id}")
    public ResponseEntity<String> validatePathVariable(@PathVariable("id") @Min(5) int id) {
        return ResponseEntity.ok("valid");
    }

    @GetMapping("/validateRequestParameter")
    public ResponseEntity<String> validateRequestParameter(@RequestParam("param") @Min(5) int param) {
        return ResponseEntity.ok("valid");
    }

}
```

Note that we have to add Spring's `@Validated` annotation to the controller at class level
to tell Spring to evaluate the constraint annotations on method parameters.

## Exception

In contrast to **request body validation** a failed validation will trigger a `ConstraintViolationException`
instead of a `MethodArgumentNotValidException`.

Spring does not register a default exception handler for this exception,
so it will by default cause a response with HTTP status 500 (Internal Server Error).


