---
title: "AuxiliaryType"
sequence: "110"
---

## AuxiliaryType

```text
HelloWorld$auxiliary$<random>
```

This helper class is called an `AuxiliaryType` within Byte Buddy's terminology.

Auxiliary types are created on demand by Byte Buddy and are directly accessible from the `DynamicType` interface after a class was created.

```java
public interface DynamicType {
    TypeDescription getTypeDescription();

    byte[] getBytes();
    
    Map<TypeDescription, byte[]> getAuxiliaryTypes();

    Map<TypeDescription, byte[]> getAllTypes();
}
```

```text
getAllTypes() = currentType + getAuxiliaryTypes()

currentType = getTypeDescription() + getBytes()
```

```text
                                                            ┌─── getTypeDescription()
                                     ┌─── currentType ──────┤
DynamicType ───┼─── getAllTypes() ───┤                      └─── getBytes()
                                     │
                                     └─── auxiliaryTypes ───┼─── getAuxiliaryTypes()
```

```java
public interface DynamicType {
    class Default implements DynamicType {
        protected final TypeDescription typeDescription;
        protected final byte[] binaryRepresentation;

        protected final List<? extends DynamicType> auxiliaryTypes;

        public TypeDescription getTypeDescription() {
            return typeDescription;
        }

        public Map<TypeDescription, byte[]> getAllTypes() {
            Map<TypeDescription, byte[]> allTypes = new LinkedHashMap<TypeDescription, byte[]>();
            allTypes.put(typeDescription, binaryRepresentation);
            for (DynamicType auxiliaryType : auxiliaryTypes) {
                allTypes.putAll(auxiliaryType.getAllTypes());
            }
            return allTypes;
        }

        public byte[] getBytes() {
            return binaryRepresentation;
        }

        public Map<TypeDescription, byte[]> getAuxiliaryTypes() {
            Map<TypeDescription, byte[]> auxiliaryTypes = new HashMap<TypeDescription, byte[]>();
            for (DynamicType auxiliaryType : auxiliaryTypes) {
                auxiliaryTypes.put(auxiliaryType.getTypeDescription(), auxiliaryType.getBytes());
                auxiliaryTypes.putAll(auxiliaryType.getAuxiliaryTypes());
            }
            return auxiliaryTypes;
        }
    }
}
```

Because of such auxiliary types,
the manual creation of one dynamic type might result in the creation of several additional types
which aid the implementation of the original class.

