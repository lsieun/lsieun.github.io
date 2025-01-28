---
title: "Parameterized Type + Wildcard"
sequence: "102"
---

## Type Argument

```text
                                            ┌─── concrete type ───┼─── Concrete Parameterized Type
Parameterized Type ───┼─── Type Argument ───┤
                                            └─── wildcard ────────┼─── Wildcard Parameterized Type
```

### Concrete Parameterized Type

正确示例：

```text
List<String>
Map<String, Date>
```

错误示例：

```text
List<? extends Number>
Map<String, ?>
```

### Wildcard Parameterized Type

A **wildcard parameterized type** is an instantiation of a generic type where at least one type argument is a wildcard.

示例：

```text
Collection<?>
List<? extends Number>
Comparator<? super String>
Map<String, ?>
```

**A wildcard parameterized type denotes a family of types comprising concrete instantiations of a generic type**.
The kind of the wildcard being used determines which concrete parameterized types belong to the family.

- `Collection<?>` denotes the family of all instantiations of the `Collection` interface regardless of the type argument.
- `List<? extends Number>` denotes the family of all list types where the element type is a subtype of `Number`.
- `Comparator<? super String>` is the family of all instantiations of the `Comparator` interface for type argument types that are supertypes of `String`.

## 对比

### 定义变量

Concrete Parameterized Type：可以

```text
List<String> list1;
```

Wildcard Parameterized Type：可以

```text
List<?> list2;
```

### 创建对象: new

Concrete Parameterized Type：可以

```text
List<String> list1 = new ArrayList<String>();
```

Wildcard Parameterized Type：不可以

```text
// Wildcard type '?' cannot be instantiated directly
List<?> list2 = new ArrayList<?>();
```

**A wildcard parameterized type is not a concrete type that could appear in a new expression**.

### 创建数组

Concrete Parameterized Type：不可以

```text
// error
Box<String>[] array = new Box<String>[10];
```

```text
// Unchecked assignment: 'sample.Box[]' to 'sample.Box<java.lang.String>[]'
Box<String>[] array = new Box<>[10];
```

Wildcard Parameterized Type：可以

```text
Box<?>[] array = new Box<?>[10];
```

### supertype-subtype

Concrete Parameterized Type：不可以

```text
// Incompatible types. Found: 'sample.Box<java.lang.Integer>', required: 'sample.Box<java.lang.Number>'
Box<Number> box = new Box<Integer>();
```

Remember that a `Integer` is an `Number` because `Integer` is a subclass of `Number`.
However, a `Box<Integer>` is not a `Box<Number>`.
The normal supertype/subtype rules do not apply to parameterized types.

Wildcard Parameterized Type：可以

```text
Box<?> box1 = new Box<Integer>();

Box<? extends Number> box1 = new Box<Integer>();
```

### Assignment Compatibility

```text
Box<String> box1 = new Box<>();
Box<?> box2 = new Box<>();
```

将 Wildcard Parameterized Type 赋值给 Concrete Parameterized Type：不可以

```text
// Incompatible types. Found: 'sample.Box<capture<?>>', required: 'sample.Box<java.lang.String>'
box1 = box2;
```

将 Concrete Parameterized Type 赋值给 Wildcard Parameterized Type：可以

```text
box2 = box1;
```

The unbounded wildcard parameterized type is kind of the supertype of all other instantiations of the generic type:
"subtypes" can be assigned to the "unbounded supertype", not vice versa.

### 获取 Class

获取 class literal

Concrete Parameterized Type：不可以

```text
// Cannot select from parameterized type
Class<?> clazz = Box<String>.class;
```

Wildcard Parameterized Type：不可以

```text
// Cannot select from parameterized type
Class<?> clazz = Box<?>.class;
```

正确做法：

```text
Class<?> clazz = Box.class;
```

### instanceof

Concrete Parameterized Type：不可以

````text
// Illegal generic type for instanceof
if (obj instanceof Box<String>) {
    // do some thing
}
````

Wildcard Parameterized Type：不可以

```text
if (obj instanceof Box<?>) {
    // do some thing
}
```

## 总结

Wildcard parameterized types can be used for typing (like non-parameterized classes and interfaces):

- as argument and return types of methods
- as type of a field or local reference variable
- as component type of an array
- as type argument of other parameterized types
- as target type in casts

Wildcard parameterized type can NOT be used for the following purposes (different from non-parameterized classes and interfaces):

- for creation of objects
- for creation of arrays (except unbounded wildcard)
- in exception handling
- in `instanceof` expressions (except unbounded wildcard) （我的理解是这样的：`obj instanceof List<? extends Number>`）
- as supertypes （我的理解是这样的：`class MyClass implements Comparable<?>`）
- in a class literal

