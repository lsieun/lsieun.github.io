---
title: "YAML 随机数"
sequence: "203"
---

In your `application.properties` or in `your application.yaml`,
you can use the next functions to generate random values.

```text
# Random int
a=${random.int}

# Random int with a maximum value
b=${random.int(1000)}

# Random int in a range
c=${random.int[0, 9999])} 

# Random long with a maximum value
d=${random.long(100000000000000000)}

# Random long in a range
e=${random.long[10000, 999999999999999999])}

# Random 32 bytes value
f=${random.value}

# Random UUID
g=${random.uuid}
```

And if you want, you can use them in the middle of a string.

```text
h=test-${random.int}-value
```

```yaml
#随机值
my:
  number: ${random.int}
  uuid: ${random.uuid}_添加字符串
  secret: ${random.value}
  ten: ${random.int(10)}
  range: ${random.int[1024,65536]}_数字加字符串
```

```java
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloController {

    @Value("${my.number}")
    private int number;

    @Value("${my.uuid}")
    private String uuid;

    @Value("${my.secret}")
    private String secret;

    @Value("${my.ten}")
    private int ten;

    @Value("${my.range}")
    private String range;


    @RequestMapping("/random")
    public String random() {
        String str = "";
        str += "number: " + number + "\r\n";
        str += "uuid: " + uuid + "\r\n";
        str += "secret: " + secret + "\r\n";
        str += "ten: " + ten + "\r\n";
        str += "range: " + range + "\r\n";
        System.out.println(str);
        return str;
    }
}
```

```text
number: 1471883345
uuid: e5189dab-04a4-4c3f-a8ee-c74f9571109d_添加字符串
secret: 1af7c5f4613f38f26c4ec311dd2d1ee3
ten: 8
range: 51587_数字加字符串
```
