---
title: "Type Erasure Limitation"
sequence: "153"
---

## Method Signature

Type erasure also prohibits some other definitions, which would otherwise seem legal. In this code, we want to count the orders as represented in two slightly different data structures:

```java
// Won't compile
interface OrderCounter {
    // Name maps to list of order numbers
    int totalOrders(Map<String, List<String>> orders);
    // Name maps to total orders made so far
    int totalOrders(Map<String, Integer> orders);
}
```

This seems like perfectly legal Java code, but it will not compile. The issue is that although the two methods seem like normal overloads, after **type erasure**, the signature of both methods becomes:

```java
int totalOrders(Map);
```

All that is left after type erasure is the raw type of the container — in this case, `Map`. The runtime would be unable to distinguish between the methods by signature, and so the language specification makes this syntax illegal.
