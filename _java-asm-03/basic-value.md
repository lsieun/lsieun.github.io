---
title:  "BasicValue"
sequence: "405"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## Value

```java
public interface Value {
    int getSize();
}
```

## BasicValue

### class info

```java
public class BasicValue implements Value {
}
```

### fields

```java
public class BasicValue implements Value {
    private final Type type;

    public Type getType() {
        return type;
    }
}
```

### constructors

```java
public class BasicValue implements Value {
    public BasicValue(final Type type) {
        this.type = type;
    }
}
```

### methods

```java
public class BasicValue implements Value {
    @Override
    public int getSize() {
        return type == Type.LONG_TYPE || type == Type.DOUBLE_TYPE ? 2 : 1;
    }

    public boolean isReference() {
        return type != null && (type.getSort() == Type.OBJECT || type.getSort() == Type.ARRAY);
    }

    @Override
    public String toString() {
        if (this == UNINITIALIZED_VALUE) {
            return ".";
        } else if (this == RETURNADDRESS_VALUE) {
            return "A";
        } else if (this == REFERENCE_VALUE) {
            return "R";
        } else {
            return type.getDescriptor();
        }
    }
}
```

### static fields

```java
public class BasicValue implements Value {
    public static final BasicValue UNINITIALIZED_VALUE = new BasicValue(null);
    
    public static final BasicValue INT_VALUE = new BasicValue(Type.INT_TYPE);
    public static final BasicValue FLOAT_VALUE = new BasicValue(Type.FLOAT_TYPE);
    public static final BasicValue LONG_VALUE = new BasicValue(Type.LONG_TYPE);
    public static final BasicValue DOUBLE_VALUE = new BasicValue(Type.DOUBLE_TYPE);

    public static final BasicValue REFERENCE_VALUE = new BasicValue(Type.getObjectType("java/lang/Object"));
    public static final BasicValue RETURNADDRESS_VALUE = new BasicValue(Type.VOID_TYPE);
}
```

