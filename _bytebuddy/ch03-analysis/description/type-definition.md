---
title: "TypeDefinition"
sequence: "102"
---

## TypeDefinition

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

## TypeDefinition.Sort

```java
public interface TypeDefinition extends NamedElement, ModifierReviewable.ForTypeDefinition, Iterable<TypeDefinition> {
    enum Sort {
        NON_GENERIC,        // non-generic type
        GENERIC_ARRAY,      // generic array type
        PARAMETERIZED,      // parameterized type
        WILDCARD,           // wildcard type
        VARIABLE,           // type variable that is attached to a TypeVariableSource
        VARIABLE_SYMBOLIC;  // type variable that is merely symbolic and is not attached to a TypeVariableSource
    }
}
```
