---
title: "示例：Lambda Currying"
sequence: "104"
---

![](/assets/images/design-pattern/creational/builder/builder-pattern-example-email-lambda-currying.png)


```java
import java.text.MessageFormat;

public class Email {
    private final String from;
    private final String to;
    private final String subject;
    private final String body;

    public Email(String from, String to, String subject, String body) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.body = body;
    }

    @Override
    public String toString() {
        return MessageFormat.format(
                "Email [from={0}, to={1}, subject={2}, body={3}]",
                from, to, subject, body
        );
    }

    public static AddFrom builder() {
        return from -> to -> subject -> body -> new Email(from, to, subject, body);
    }

    @FunctionalInterface
    public interface AddFrom {
        AddTo withFrom(String from);
    }

    @FunctionalInterface
    public interface AddTo {
        AddSubject withTo(String to);
    }

    @FunctionalInterface
    public interface AddSubject {
        AddBody withSubject(String subject);
    }

    @FunctionalInterface
    public interface AddBody {
        Email withBody(String body);
    }
}
```

```java
public class HelloWorld {
    public static void main(String[] args) throws ClassNotFoundException {
        Email email = Email.builder()
                .withFrom("China")
                .withTo("USA")
                .withSubject("Hello World")
                .withBody("You don't need wings to fly.");
        System.out.println(email);
    }
}
```
