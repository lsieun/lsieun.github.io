---
title: "Assignment"
sequence: "122"
---

## unbounded wildcard parameterized type VS concrete parameterized type

The unbounded wildcard parameterized type is assignment compatible with all instantiations of the correspinding generic type. Assignment of another instantiation to the unbounded wildcard instantiation is permitted without warnings; assignment of the unbounded wildcard instantiation to another instantiation is illegal.<sub>彼此之间的赋值，产生不同的结果</sub>

Example (of assignment compatibility):

```java
ArrayList <?>       anyList    = new ArrayList<Long>();
ArrayList<String> stringList = new ArrayList<String>();
anyList    = stringList;
stringList = anyList;      // error
```

The unbounded wildcard parameterized type is kind of the supertype of all other instantiations of the generic type: "subtypes" can be assigned to the "unbounded supertype", not vice versa.

