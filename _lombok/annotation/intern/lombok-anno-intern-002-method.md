---
title: "Method: @EqualsAndHashCode, @ToString"
sequence: "102"
---

[UP](/lombok.html)


## @EqualsAndHashCode

```java
import lombok.EqualsAndHashCode;

@EqualsAndHashCode
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

    public boolean equals(Object o) {
        if (o == this) {
            return true;
        } else if (!(o instanceof HelloWorld)) {
            return false;
        } else {
            HelloWorld other = (HelloWorld)o;
            if (!other.canEqual(this)) {
                return false;
            } else if (this.age != other.age) {
                return false;
            } else {
                Object this$name = this.name;
                Object other$name = other.name;
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
        result = result * 59 + this.age;
        Object $name = this.name;
        result = result * 59 + ($name == null ? 43 : $name.hashCode());
        return result;
    }
}
```

## @ToString

```java
import lombok.ToString;

@ToString
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

    public String toString() {
        return "HelloWorld(name=" + this.name + ", age=" + this.age + ")";
    }
}
```
