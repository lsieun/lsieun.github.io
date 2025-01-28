---
title: "自定义追踪：细粒度追踪"
sequence: "103"
---

## 引入依赖

```xml
<dependency>
    <groupId>org.apache.skywalking</groupId>
    <artifactId>apm-toolkit-trace</artifactId>
    <version>8.15.0</version>
</dependency>
```


## 注解


- TraceContext
- @Trace
- @Tags


```java
public class Test {
    @RequestMapping("/trace")
    public void traceId() {
        // 可以向上下文对象中绑定 key/value 数据
        TraceContext.putCorrelation("name", "tomcat");
        
        // 获取 traceId
        log.info("get trace id: {}", TraceContext.traceId());
    }
}
```

```text
@Trace(operationName="FIND_USER")
```

如果想为业务方法的追踪增加额外的描述信息，可以通过 `@Tags` 配合 `@Tag` 实现多个 key/value 数据绑定：

```text
@Tags({
    @Tag(key="param", value="arg[0]"),
    @Tag(key="returnValue", value="returnedObj")
})
```

## Example

### Controller

```java
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.apache.skywalking.apm.toolkit.trace.TraceContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/trace")
@Slf4j
@RequiredArgsConstructor
public class TraceController {
    private final TraceService traceService;


    @GetMapping("/transfer")
    public String transferMoney(Long senderId, Long receiverId, int money) {
        String traceId = TraceContext.traceId();
        String segmentId = TraceContext.segmentId();
        int spanId = TraceContext.spanId();
        TraceContext.putCorrelation("someInfo", "OOOOOOOOOOK");

        log.info("traceId = {}", traceId);
        log.info("segmentId = {}", segmentId);
        log.info("spanId = {}", spanId);

        String result = traceService.transfer(senderId, receiverId, money);

        log.info("result = {}", result);

        return result;
    }
}
```

### Service

```java
public interface TraceService {
    String transfer(Long senderId, Long receiverId, int money);
}
```

```java
import lombok.extern.slf4j.Slf4j;

import org.apache.skywalking.apm.toolkit.trace.Tag;
import org.apache.skywalking.apm.toolkit.trace.Tags;
import org.apache.skywalking.apm.toolkit.trace.Trace;
import org.apache.skywalking.apm.toolkit.trace.TraceContext;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class TraceServiceImpl implements TraceService {

    @Trace(operationName = "TRANSFER")
    @Tag(key = "senderId", value = "arg[0]")
    @Tag(key = "receiverId", value = "arg[1]")
    @Tag(key = "money", value = "arg[2]")
    @Tag(key = "result", value = "returnedObj")
    @Override
    public String transfer(Long senderId, Long receiverId, int money) {
        User sender = findUser(senderId);
        log.info("sender info: {}", sender);

        User receiver = findUser(receiverId);
        log.info("receiver info: {}", receiver);

        boolean flag = checkEnoughMoney(senderId, money);
        log.info("{} has enough money? {}", sender, flag);

        Optional<String> someInfo = TraceContext.getCorrelation("someInfo");
        log.info("someInfo = {}", someInfo.orElse("Noooooooo"));

        if (!flag) {
            return "failed";
        }

        int actualMoney = transferMoney(money);
        log.info("expected money {} and actual money {}", money, actualMoney);

        String result = String.format("%s sends %s, and %s receives %s",
                sender.getName(), money, receiver.getName(), actualMoney);

        log.info("result: {}", result);
        return result;
    }

    @Trace(operationName = "FIND_USER")
    @Tag(key = "userId", value = "arg[0]")
    @Tag(key = "user", value = "returnedObj.name")
    private User findUser(Long userId) {
        if (123L == userId) {
            return new User(123L, "tomcat");
        }
        else if (456L == userId) {
            return new User(456L, "jerry");
        }

        return new User(userId, "Xxx");
    }

    @Trace(operationName = "CHECK_MONEY")
    @Tag(key = "userId", value = "arg[0]")
    @Tag(key = "money", value = "arg[1]")
    @Tag(key = "success", value = "returnedObj")
    private boolean checkEnoughMoney(Long userId, int money) {
        return Math.random() > 0.2D;
    }

    @Trace(operationName = "TRANSFER_MONEY")
    @Tags({
            @Tag(key = "expectedMoney", value = "arg[0]"),
            @Tag(key = "actualMoney", value = "returnedObj")
    })
    private int transferMoney(int money) {
        if (money < 0) {
            return 0;
        }
        else if (money < 100) {
            return money;
        }
        else if (money < 200) {
            return (int) (money * 0.8);
        }
        return (int) (money * 0.7);
    }
}
```

## Reference

- [apm-toolkit-trace](https://skywalking.apache.org/docs/skywalking-java/v8.15.0/en/setup/service-agent/java-agent/application-toolkit-trace/)
- [Customize Enhance Trace](https://skywalking.apache.org/docs/skywalking-java/v8.15.0/en/setup/service-agent/java-agent/application-toolkit-trace/)

