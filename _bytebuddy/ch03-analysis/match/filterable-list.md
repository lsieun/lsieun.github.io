---
title: "FilterableList"
sequence: "101"
---

## FilterableList

三个核心方法

```java
public interface FilterableList<T, S extends FilterableList<T, S>> extends List<T> {
    // 如果列表中只有一个元素，则获取成功；其它情况则获取失败
    T getOnly();

    // 获取子列表：根据索引获取
    S subList(int fromIndex, int toIndex);

    // 获取子列表：根据匹配条件获取
    S filter(ElementMatcher<? super T> elementMatcher);
}
```

## 具体实现类

```text
                  ┌─── TypeList
                  │
                  ├─── TypeList.Generic
                  │
                  ├─── FieldList
                  │
FilterableList ───┼─── MethodList
                  │
                  ├─── ParameterList
                  │
                  ├─── AnnotationList
                  │
                  └─── RecordComponentList
```

## 哪里提供

```java
public interface TypeDescription extends TypeDefinition, ByteCodeElement, TypeVariableSource {
    FieldList<FieldDescription.InDefinedShape> getDeclaredFields();

    MethodList<MethodDescription.InDefinedShape> getDeclaredMethods();

    RecordComponentList<RecordComponentDescription.InDefinedShape> getRecordComponents();

    AnnotationList getInheritedAnnotations();
}
```

```java
public interface TypeDescription extends TypeDefinition, ByteCodeElement, TypeVariableSource {
    interface Generic extends TypeDefinition, AnnotationSource {
        FieldList<FieldDescription.InGenericShape> getDeclaredFields();

        MethodList<MethodDescription.InGenericShape> getDeclaredMethods();

        RecordComponentList<RecordComponentDescription.InGenericShape> getRecordComponents();
    }
}
```
