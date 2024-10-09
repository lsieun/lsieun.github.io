---
title: "JavaConstant"
sequence: "101"
---

## JavaConstant

```java
public interface JavaConstant {
}
```

```java
public interface JavaConstant {
    Object toDescription();

    TypeDescription getTypeDescription();

    <T> T accept(Visitor<T> visitor);
}
```

## JavaConstant.Simple

### 内部实现

```java
public interface JavaConstant {
    abstract class Simple<T> implements JavaConstant {
        protected final T value;

        private final TypeDescription typeDescription;

        protected Simple(T value, TypeDescription typeDescription) {
            this.value = value;
            this.typeDescription = typeDescription;
        }

        public T getValue() {
            return value;
        }

        public TypeDescription getTypeDescription() {
            return typeDescription;
        }
    }
}
```

### 静态方法

```java
public interface JavaConstant {
    abstract class Simple<T> implements JavaConstant {
        public static JavaConstant ofLoaded(Object value) {
            if (value instanceof Integer) {
                return new OfTrivialValue<Integer>((Integer) value, TypeDescription.ForLoadedType.of(int.class));
            } else if (value instanceof Long) {
                return new OfTrivialValue<Long>((Long) value, TypeDescription.ForLoadedType.of(long.class));
            } else if (value instanceof Float) {
                return new OfTrivialValue<Float>((Float) value, TypeDescription.ForLoadedType.of(float.class));
            } else if (value instanceof Double) {
                return new OfTrivialValue<Double>((Double) value, TypeDescription.ForLoadedType.of(double.class));
            } else if (value instanceof String) {
                return new OfTrivialValue<String>((String) value, TypeDescription.STRING);
            } else if (value instanceof Class<?>) {
                return Simple.of(TypeDescription.ForLoadedType.of((Class<?>) value));
            } else if (JavaType.METHOD_HANDLE.isInstance(value)) {
                return MethodHandle.ofLoaded(value);
            } else if (JavaType.METHOD_TYPE.isInstance(value)) {
                return MethodType.ofLoaded(value);
            } else {
                throw new IllegalArgumentException("Not a loaded Java constant value: " + value);
            }
        }

        public static JavaConstant ofDescription(Object value, @MaybeNull ClassLoader classLoader) {
            return ofDescription(value, ClassFileLocator.ForClassLoader.of(classLoader));
        }

        public static JavaConstant ofDescription(Object value, ClassFileLocator classFileLocator) {
            return ofDescription(value, TypePool.Default.WithLazyResolution.of(classFileLocator));
        }
    }
}
```

## JavaConstant.MethodType

```java
public interface JavaConstant {
    class MethodType implements JavaConstant {
        //
    }
}
```

### 内部实现

```java
public interface JavaConstant {
    class MethodType implements JavaConstant {
        private final TypeDescription returnType;

        private final List<? extends TypeDescription> parameterTypes;

        protected MethodType(TypeDescription returnType, List<? extends TypeDescription> parameterTypes) {
            this.returnType = returnType;
            this.parameterTypes = parameterTypes;
        }

        public TypeDescription getReturnType() {
            return returnType;
        }

        public TypeList getParameterTypes() {
            return new TypeList.Explicit(parameterTypes);
        }

        public String getDescriptor() {
            StringBuilder stringBuilder = new StringBuilder("(");
            for (TypeDescription parameterType : parameterTypes) {
                stringBuilder.append(parameterType.getDescriptor());
            }
            return stringBuilder.append(')').append(returnType.getDescriptor()).toString();
        }

        public Object toDescription() {
            Object[] parameterType = Simple.CLASS_DESC.toArray(parameterTypes.size());
            for (int index = 0; index < parameterTypes.size(); index++) {
                parameterType[index] = Simple.CLASS_DESC.ofDescriptor(parameterTypes.get(index).getDescriptor());
            }
            return Simple.METHOD_TYPE_DESC.of(Simple.CLASS_DESC.ofDescriptor(returnType.getDescriptor()), parameterType);
        }

        public TypeDescription getTypeDescription() {
            return JavaType.METHOD_TYPE.getTypeStub();
        }
    }
}
```

### 静态方法

```java
public interface JavaConstant {
    class MethodType implements JavaConstant {
        public static MethodType ofLoaded(Object methodType) {
            if (!JavaType.METHOD_TYPE.isInstance(methodType)) {
                throw new IllegalArgumentException("Expected method type object: " + methodType);
            }
            return of(DISPATCHER.returnType(methodType), DISPATCHER.parameterArray(methodType));
        }

        public static MethodType of(Class<?> returnType, Class<?>... parameterType) {
            return of(TypeDescription.ForLoadedType.of(returnType), new TypeList.ForLoadedTypes(parameterType));
        }

        public static MethodType of(TypeDescription returnType, TypeDescription... parameterType) {
            return new MethodType(returnType, Arrays.asList(parameterType));
        }

        public static MethodType of(TypeDescription returnType, List<? extends TypeDescription> parameterTypes) {
            return new MethodType(returnType, parameterTypes);
        }

        public static MethodType of(Method method) {
            return of(new MethodDescription.ForLoadedMethod(method));
        }

        public static MethodType of(Constructor<?> constructor) {
            return of(new MethodDescription.ForLoadedConstructor(constructor));
        }

        public static MethodType of(MethodDescription methodDescription) {
            return new MethodType(methodDescription.getReturnType().asErasure(), methodDescription.getParameters().asTypeList().asErasures());
        }

        public static MethodType ofSetter(Field field) {
            return ofSetter(new FieldDescription.ForLoadedField(field));
        }

        public static MethodType ofSetter(FieldDescription fieldDescription) {
            return new MethodType(TypeDescription.VOID, Collections.singletonList(fieldDescription.getType().asErasure()));
        }

        public static MethodType ofGetter(Field field) {
            return ofGetter(new FieldDescription.ForLoadedField(field));
        }

        public static MethodType ofGetter(FieldDescription fieldDescription) {
            return new MethodType(fieldDescription.getType().asErasure(), Collections.<TypeDescription>emptyList());
        }

        public static MethodType ofConstant(Object instance) {
            return ofConstant(instance.getClass());
        }

        public static MethodType ofConstant(Class<?> type) {
            return ofConstant(TypeDescription.ForLoadedType.of(type));
        }

        public static MethodType ofConstant(TypeDescription typeDescription) {
            return new MethodType(typeDescription, Collections.<TypeDescription>emptyList());
        }
    }
}
```
