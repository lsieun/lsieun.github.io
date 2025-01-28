---
title: "简单：@Data/@Value/@Builder"
sequence: "104"
---

[UP](/lombok.html)

```text
@Data  = @Getter + @Setter + @RequiredArgsConstructor + @ToString + @EqualsAndHashCode
@Value = @Getter + final   + @AllArgsConstructor      + @ToString + @EqualsAndHashCode
```

## @Data

```text
@Data = @Getter + @Setter + @RequiredArgsConstructor + @ToString + @EqualsAndHashCode
```

```java
import lombok.Data;

@Data
public class HelloWorld {
    private String name;
    private int age;
}
```

```java
public class HelloWorld {
    private String name;
    private int age;

    public HelloWorld() {
    }

    public String getName() {
        return this.name;
    }

    public int getAge() {
        return this.age;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof HelloWorld)) {
            return false;
        } else {
            HelloWorld other = (HelloWorld)o;
            if (!other.canEqual(this)) {
                return false;
            } else if (this.getAge() != other.getAge()) {
                return false;
            } else {
                Object this$name = this.getName();
                Object other$name = other.getName();
                if (this$name == null) {
                    if (other$name != null) {
                        return false;
                    }
                } else if (!this$name.equals(other$name)) {
                    return false;
                }

                return true;
            }
        }
    }

    protected boolean canEqual(Object other) {
        return other instanceof HelloWorld;
    }

    public int hashCode() {
        int PRIME = true;
        int result = 1;
        result = result * 59 + this.getAge();
        Object $name = this.getName();
        result = result * 59 + ($name == null ? 43 : $name.hashCode());
        return result;
    }

    public String toString() {
        String var10000 = this.getName();
        return "HelloWorld(name=" + var10000 + ", age=" + this.getAge() + ")";
    }
}
```

## @Value

```text
@Value = @Getter + @FieldDefaults(makeFinal=true, level=AccessLevel.PRIVATE) + @AllArgsConstructor + @ToString + @EqualsAndHashCode
```

```java
import lombok.Value;

@Value
public class HelloWorld {
    String name;
    int age;
}
```

```java
public final class HelloWorld {
    private final String name;
    private final int age;

    public HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return this.name;
    }

    public int getAge() {
        return this.age;
    }

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof HelloWorld)) {
            return false;
        } else {
            HelloWorld other = (HelloWorld)o;
            if (this.getAge() != other.getAge()) {
                return false;
            } else {
                Object this$name = this.getName();
                Object other$name = other.getName();
                if (this$name == null) {
                    if (other$name != null) {
                        return false;
                    }
                } else if (!this$name.equals(other$name)) {
                    return false;
                }

                return true;
            }
        }
    }

    public int hashCode() {
        int PRIME = true;
        int result = 1;
        result = result * 59 + this.getAge();
        Object $name = this.getName();
        result = result * 59 + ($name == null ? 43 : $name.hashCode());
        return result;
    }

    public String toString() {
        String var10000 = this.getName();
        return "HelloWorld(name=" + var10000 + ", age=" + this.getAge() + ")";
    }
}
```

## @Builder

```java
import lombok.Builder;

@Builder
public class HelloWorld {
    private String name;
    private int age;
}
```

```java
public class HelloWorld {
    private String name;
    private int age;

    HelloWorld(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public static HelloWorldBuilder builder() {
        return new HelloWorldBuilder();
    }

    public static class HelloWorldBuilder {
        private String name;
        private int age;

        HelloWorldBuilder() {
        }

        public HelloWorldBuilder name(String name) {
            this.name = name;
            return this;
        }

        public HelloWorldBuilder age(int age) {
            this.age = age;
            return this;
        }

        public HelloWorld build() {
            return new HelloWorld(this.name, this.age);
        }

        public String toString() {
            return "HelloWorld.HelloWorldBuilder(name=" + this.name + ", age=" + this.age + ")";
        }
    }
}
```
