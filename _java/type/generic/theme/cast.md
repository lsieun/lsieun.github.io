---
title: "Cast"
sequence: "123"
---

## 1. type parameter

Can I cast to the type that the type parameter stands for? **Yes, you can, but it is not type-safe and the compiler issues an "unchecked" warning**.

Type parameters do not have a runtime type representation of their own. They are represented by their leftmost bound, or type `Object` in case of an unbounded type parameter. A cast to a type parameter would therefore be a cast to the bound or to type `Object`.

Example (of unchecked cast):

```text
class Twins<T> {
  public T fst,snd;
  public Twins(T s, T t) { fst = s; snd = t; }
  ...
}
class Pair<S,T> {
  private S fst;
  private T snd;
  public Pair(S s, T t) { fst = s; snd = t; }
  ...
  public <U> Pair(Twins<U> twins) {
    fst = (S) twins.fst;        // unchecked warning
    snd = (T) twins.snd;        // unchecked warning
  }
}
```

The two casts to the type parameters are pointless because they will never fail; at runtime they are casts to type `Object`. As a result any type of `Pair` can be constructed from any type of `Twins`. We could end up with a `Pair<Long,Long>` that contains `String`s instead of `Long`s. This would be a blatant violation of the type-safety principle, because we would later trigger an unexpected `ClassCastException`, when we use this offensive `Pair<Long,Long>` that contains `String`s. In order to draw attention to the potentially unsafe casts the compiler issues "unchecked" warnings.

## 2. parameterized type

Can I cast to a parameterized type? **Yes, you can, but under certain circumstances it is not type-safe and the compiler issues an "unchecked" warning**.

All instantiations of a generic type share the same runtime type representation, namely the representation of the raw type. For instance, the instantiations of a generic type `List`,  such as `List<Date>`, `List<String>`, `List<Long>`, etc. have different static types at **compile time**, but the same dynamic type `List` at **runtime**.

A cast consists of two parts:

- a **static type check** performed by the compiler at **compile time** and
- a **dynamic type check** performed by the virtual machine at **runtime**.

**The static part** sorts out nonsensical casts, that cannot succeed, such as the cast from `String` to `Date` or from `List<String>` to `List<Date>`.

**The dynamic part** uses the runtime type information and performs a type check at runtime. It raises a `ClassCastException` if the dynamic type of the object is not the target type (or a subtype of the target type) of the cast. Examples of casts with a dynamic part are the cast from `Object` to `String` or from `Object` to `List<String>`.  These are the so-called downcasts, from a supertype down to a subtype.

**Not all casts have a dynamic part**. Some casts are just static casts and require no type check at runtime.  Examples are the **casts between primitive types**, such as the cast from `long` to `int` or `byte` to `char`. Another example of static casts are the so-called **upcasts**, from a subtype up to a supertype, such as the casts from `String` to `Object` or from `LinkedList<String>` to `List<String>`. Upcasts are casts that are permitted, but not required. They are automatic conversions that the compiler performs implicitly, even without an explicit cast expression in the source code, which means, the cast is not required and usually omitted.  However, if an upcast appears somewhere in the source code then it is a purely static cast that does not have a dynamic part.

Type casts with a dynamic part are potentially unsafe, when the target type of the cast is a parameterized type.  The runtime type information of a parameterized type is non-exact, because all instantiations of the same generic type share the same runtime type representation. The virtual machine cannot distinguish between different instantiations of the same generic type. Under these circumstances the dynamic part of a cast can succeed although it should not.

Example (of unchecked cast):

```text
void m1() {
  List<Date> list = new ArrayList<Date>();
  ...
  m2(list);
}
void m2(Object arg) {
  ...
  List<String> list = (List<String>) arg;    // unchecked warning
  ...
  m3(list);
  ...
}
void m3(List<String> list) {
  ...
  String s = list.get(0);      // ClassCastException
  ...
}
```

The cast from `Object` to `List<String>` in method `m2` looks like a cast to `List<String>`, but actually is a cast from `Object` to the raw type `List`. It would succeed even if the object referred to were a `List<Date>` instead of a `List<String>`.

After this successful cast we have a reference variable of type `List<String>` which refers to an object of type `List<Date>`. When we retrieve elements from that list we would expect `String`s, but in fact we receive `Date`s - and a `ClassCastException` will occur in a place where nobody had expected it.

We are prepared to cope with `ClassCastException` s when there is a cast expression in the source code, but we do not expect `ClassCastException`s when we extract an element from a list of strings. This sort of unexpected `ClassCastException` is considered a violation of the type-safety principle. In order to draw attention to the potentially unsafe cast the compiler issues an **"unchecked" warning** when it translates the dubious cast expression.

As a result, the compiler emits "unchecked" warnings for every dynamic cast whose target type is a parameterized type.  Note that an upcast whose target type is a parameterized type does not lead to an "unchecked" warning, because the upcast has no dynamic part.
