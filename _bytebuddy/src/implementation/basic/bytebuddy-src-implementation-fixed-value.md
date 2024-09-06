---
title: "FixedValue"
sequence: "102"
---

## FixedValue

```java
public abstract class FixedValue implements Implementation {
    protected final Assigner assigner;
    protected final Assigner.Typing typing;

    protected FixedValue(Assigner assigner, Assigner.Typing typing) {
        this.assigner = assigner;
        this.typing = typing;
    }
}
```

### 静态方法

```java
public abstract class FixedValue implements Implementation {
    public static AssignerConfigurable value(Object fixedValue) {
        if (fixedValue instanceof JavaConstant) {
            return value((JavaConstant) fixedValue);
        } else if (fixedValue instanceof TypeDescription) {
            return value((TypeDescription) fixedValue);
        } else {
            Class<?> type = fixedValue.getClass();
            if (type == String.class) {
                return new ForPoolValue(new TextConstant((String) fixedValue), TypeDescription.STRING);
            } else if (type == Class.class) {
                return new ForPoolValue(ClassConstant.of(TypeDescription.ForLoadedType.of((Class<?>) fixedValue)), TypeDescription.CLASS);
            } else if (type == Boolean.class) {
                return new ForPoolValue(IntegerConstant.forValue((Boolean) fixedValue), boolean.class);
            } else if (type == Byte.class) {
                return new ForPoolValue(IntegerConstant.forValue((Byte) fixedValue), byte.class);
            } else if (type == Short.class) {
                return new ForPoolValue(IntegerConstant.forValue((Short) fixedValue), short.class);
            } else if (type == Character.class) {
                return new ForPoolValue(IntegerConstant.forValue((Character) fixedValue), char.class);
            } else if (type == Integer.class) {
                return new ForPoolValue(IntegerConstant.forValue((Integer) fixedValue), int.class);
            } else if (type == Long.class) {
                return new ForPoolValue(LongConstant.forValue((Long) fixedValue), long.class);
            } else if (type == Float.class) {
                return new ForPoolValue(FloatConstant.forValue((Float) fixedValue), float.class);
            } else if (type == Double.class) {
                return new ForPoolValue(DoubleConstant.forValue((Double) fixedValue), double.class);
            } else if (JavaType.METHOD_HANDLE.getTypeStub().isAssignableFrom(type)) {
                return new ForPoolValue(new JavaConstantValue(JavaConstant.MethodHandle.ofLoaded(fixedValue)), type);
            } else if (JavaType.METHOD_TYPE.getTypeStub().represents(type)) {
                return new ForPoolValue(new JavaConstantValue(JavaConstant.MethodType.ofLoaded(fixedValue)), type);
            } else {
                return reference(fixedValue);
            }
        }
    }

    public static AssignerConfigurable reference(Object value) {
        return reference(value, ForValue.PREFIX + "$" + RandomString.hashOf(value));
    }

    public static AssignerConfigurable reference(Object value, String name) {
        return new ForValue(value, name);
    }

    public static AssignerConfigurable value(TypeDescription fixedValue) {
        return new ForPoolValue(ClassConstant.of(fixedValue), TypeDescription.CLASS);
    }

    public static AssignerConfigurable value(JavaConstant fixedValue) {
        return new ForPoolValue(new JavaConstantValue(fixedValue), fixedValue.getTypeDescription());
    }

    public static AssignerConfigurable argument(int index) {
        if (index < 0) {
            throw new IllegalArgumentException("Argument index cannot be negative: " + index);
        }
        return new ForArgument(index);
    }

    public static AssignerConfigurable self() {
        return new ForThisValue();
    }

    public static Implementation nullValue() {
        return ForNullValue.INSTANCE;
    }

    public static AssignerConfigurable originType() {
        return new ForOriginType();
    }
}
```

## FixedValue.AssignerConfigurable

```java
public abstract class FixedValue implements Implementation {
    public interface AssignerConfigurable extends Implementation {
        Implementation withAssigner(Assigner assigner, Assigner.Typing typing);
    }
}
```





