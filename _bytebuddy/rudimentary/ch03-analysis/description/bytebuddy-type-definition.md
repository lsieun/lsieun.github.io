---
title: "TypeDefinition"
sequence: "102"
---

## TypeDefinition

```text
                  ┌─── TypeDescription
TypeDefinition ───┤
                  └─── TypeDescription.Generic
```

```java
public interface TypeDefinition extends NamedElement, ModifierReviewable.ForTypeDefinition, Iterable<TypeDefinition> {
    TypeDescription.Generic asGenericType();
    TypeDescription asErasure();

    TypeDescription.Generic getSuperClass();
    TypeList.Generic getInterfaces();
    FieldList<?> getDeclaredFields();
    MethodList<?> getDeclaredMethods();

    String getTypeName();
    
    // array
    TypeDefinition getComponentType();
    boolean isArray();
    
    // sort
    Sort getSort();
    
    // record
    boolean isRecord();
    RecordComponentList<?> getRecordComponents();
    
    // primitive
    boolean isPrimitive();
    
    // unknown
    StackSize getStackSize();
    boolean represents(Type type);
}
```


