---
title: "Object Instance"
sequence: "125"
---

## 1. type parameter

- variable: OK
- new: NO

Can I create an object whose type is a type parameter? **No, because the compiler does not know how to create objects of an unknown type**.

Each object creation is accompied by a constructor call. When we try to create an object whose type is a type parameter then we need an accessible constructor of the unknown type that the type parameter is a place holder for. However, there is no way to make sure that the actual type arguments have the required constructors.

Example (illegal generic object creation):

```java
public final class Pair<A, B> {
    public final A fst;
    public final B snd;
    public Pair() {
       this.fst = new A() ;  // error
       this.snd = new B() ;  // error
    }
    public Pair(A fst, B snd) {
       this.fst = fst;
       this.snd = snd;
    }
}
```

In the example above, we are trying to invoke the no-argument constructors of two unknown types represented by the type parameters `A` and `B`. It is not known whether the actual type arguments will have an accessible no-argument constructor.

In situations like this - when the compiler needs more knowledge about the unknown type in order to invoke a method - we use type parameter bounds. However, the bounds only give access to methods of the type parameter. Constructors cannot be made available through a type parameter bound.

If you need to create objects of unknown type, you can use reflection as a workaround. It requires that you supply type information, typically in form of a `Class` object, and then use that type information to create objects via reflection.

Example (workaround using reflection):

```java
public final class Pair <A,B> {
    public final A fst;
    public final B snd;
    public Pair(Class<A> typeA, Class<B> typeB) {
       this.fst = typeA.newInstance();
       this.snd = typeB.newInstance();
    }
    public Pair(A fst, B snd) {
       this.fst = fst;
       this.snd = snd;
    }
}
```

## 2. concrete parameterized type

- variable: OK
- new: OK

```java
ArrayList<String> strList = new ArrayList<String>();
```

## 3. wildcard parameterized type

- variable: OK
- new: NO

**A wildcard parameterized type is not a concrete type that could appear in a `new` expression**. A wildcard parameterized type is similar to an interface type in the sense that reference variables of a wildcard parameterized type can be declared, but no objects of the wildcard parameterized type can be created. The reference variables of a wildcard parameterized type can refer to an object that is of a type that belongs to the family of types that the wildcard parameterized type denotes.

Examples:

```java
Collection<?> coll = new ArrayList<String>();
List<? extends Number> list = new ArrayList<Long>();
Comparator<? super String> cmp = new RuleBasedCollator("< a< b< c< d");
Pair<String,?> pair = new Pair<String,String>();
```

```java
// Won't compile
List<?> unknowns = new ArrayList<?>();

// Perfectly legal
List<?> objects = new ArrayList<String>();
```

### 3.1. Can I create an object whose type is a wildcard parameterized type?

**No, not directly**.

**Objects of a wildcard parameterized type are not particularly useful, mainly because there is not much you can do with the object**. You can access an object of a wildcard parameterized type only through a reference of that wildcard parameterized type, and such a reference gives only restricted access to the referenced object. Basically, the wildcard parameterized type is too abstract to be useful. For this reason, the creation of objects of a wildcard parameterized type is discouraged: **it is illegal that a wildcard parameterized type appears in a `new` expression**.

Example (of illegal creation of objects of a wildcard parameterized type):

```java
ArrayList<String> list = new ArrayList<String>();
... populate the list ...
ArrayList<?> coll1 = new ArrayList <?> (); // error
ArrayList<?> coll2 = new ArrayList <?> (10); // error
ArrayList<?> coll3 = new ArrayList <?> (list); // error
```

The compiler rejects all attempts to create an object of the wildcard type `ArrayList<?>`.

In a way, a wildcard parameterized type is like an interface type: you can declare reference variables of the type, but you cannot create objects of the type. A reference variable of an interface type or a wildcard parameterized type can refer to an object of a compatible type. For an interface, the compatible types are the class (or enum) types that implement the interface. For a wildcard parameterized type, the compatible types are the concrete instantiations of the corresponding generic type that belong to the family of instantiations that the wildcard denotes.

Example (comparing interface and wildcard parameterized type ):

```java
Cloneable clon1 = new Date();
Cloneable clon2 = new Cloneable();     // error
ArrayList<?> coll1 = new ArrayList<String> ();
ArrayList<?> coll2 = new ArrayList<?>(); // error
```

The code snippet above illustrates the similarity between an interface and a wildcard parameterized type, using the interface `Cloneable` and the wildcard parameterized type `ArrayList<?>` as examples. We can declare reference variables of type `Cloneable` and `ArrayList<?>`, but we must not create objects of type `Cloneable` and `ArrayList<?>`.

Interestingly, the compiler's effort to prevent the creation of objects of a wildcard parameterized type can be circumvented. It is unlikely that you will ever want to create an object of a wildcard parameterized type, but should you ever need one, there's the workaround (see TechnicalDetails.FAQ609).
