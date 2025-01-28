---
title: "Generic Unchecked Warning"
sequence: "130"
---

## 1. How do I best implement the clone method of a generic type?

Override `Object.clone()` as usual and ignore the **inevitable unchecked warnings**.

The recommended implementation of the `clone` method of a generic type looks like the one shown in the example below.

Example (implementation of clone ):

```java
class Triple<T> implements Cloneable {
  private T fst, snd, trd;
  public Triple(T t1, T t2, T t3) {fst = t1; snd = t2; trd = t3;}
  ...
  public Triple<T> clone() {
     Triple<T> clon = null;
     try {
       clon = (Triple<T>) super.clone(); // unchecked warning
     } catch (CloneNotSupportedException e) {
       throw new InternalError();
     }
     try {
       Class<?> clzz = this.fst.getClass();
       Method   meth = clzz.getMethod("clone", new Class[0]);
       Object   dupl = meth.invoke(this.fst, new Object[0]);
       clon.fst = (T) dupl; // unchecked warning
     } catch (Exception e) {
       ...
     }
     try {
       Class<?> clzz = this.snd.getClass();
       Method   meth = clzz.getMethod("clone", new Class[0]);
       Object   dupl = meth.invoke(this.snd, new Object[0]);
       clon.snd = (T) dupl; // unchecked warning
     } catch (Exception e) {
       ...
     }
     try {
       Class<?> clzz = this.trd.getClass();
       Method   meth = clzz.getMethod("clone", new Class[0]);
       Object   dupl = meth.invoke(this.trd, new Object[0]);
       clon.trd = (T) dupl; // unchecked warning
     } catch (Exception e) {
       ...
     }
     return clon;
  }
}
```

## 2. Return type

In our implementation we declared **the return type **of the `clone` method not as type `Object`, but of **the more specific generic type**. This is possible, since the **overriding rules** have been relaxed and **an overriding method in a subclass need no longer have the exact same signature as the superclass's method that it overrides**. Since Java 5.0 it is permitted that **the subclass version of a method returns a type that is a subtype of the return type of the superclass's method**. In our example, the method `clone` in class `Triple<T>` returns a `Triple<T>` and overrides the `clone` method in class `Object`, which returns an `Object`.

The more specific return type is largely a matter of taste. One might equally well stick to the traditional technique of declaring the return type of all `clone` methods as type `Object`. The more specific return type is beneficial for the users of our triple class, because it saves them a cast from `Object` down to `Triple<T>` after a call to `Triple<T>.clone`.

## 3. "unchecked cast" warnings

The most annoying aspect of implementing `clone` for a generic type are the **inevitable "unchecked" warnings**. The warning stem from two categories of casts that are needed.

- Casting the result of `super.clone` to the generic type.（整体 clone）
- Casting the result of **cloning any fields** to the type that the type parameter stands for.（局部 clone）

### 3.1. Casting the result of `super.clone` to the generic type.

Part of every implementation of `clone` is the invocation of the superclass's `clone` method. The result of `super.clone` is either of the supertype itself or of type `Object`. In our example `super.clone` is `Object.clone`, whose return type is `Object`. In order to access the fields of the clone returned from `super.clone` a cast to own type is needed. In our example this is a cast to the type `Triple<T>`. The target type of this cast is the generic type itself and the compiler issues the usual **"unchecked cast" warning**.

**In some cases the cast is not needed at all**, namely when the clone produced by `super.clone` is already deep enough so that the fields of the clone need not be accessed. This would be the case if all fields are either of **primitive type** or of **an immutable reference type**.

**In all other cases, there is no way to avoid the unchecked warning**. A cast to `Triple<?>` instead of `Triple<T>` would eliminate the unchecked warning, but does not give the required access to the fields. The two fields in our example would be of type "capture of ?" to which we cannot assign the result of cloning the individual fields. Alternatively we might consider a cast to the raw type `Triple` instead of `Triple<T>`, but that would give us "unchecked assignment" warnings instead of "unchecked cast" warnings. The compiler would issue the warnings when we access the fields of our raw triple class. No matter how we put it, we cannot avoid the unchecked warnings the cast after `super.clone`. The warnings are harmless and hence best suppressed by means of the standard annotation `@SuppressWarnings`.

### 3.2. Cloning the individual fields

We must invoke the fields' clone method via reflection because we do not know whether the respective field has an accessible `clone` method. Two factor play a role:

- Every class inherits a `clone` method from class `Object`, but `Object.clone` is a `protected` method and for this reason not part of the public interface of a class. In essence, all classes have a `clone` method, but only a private one, unless they explicitly provide a public clone method.
- Most classes that have a `clone` method also implement the `Cloneable` interface. The `Cloneable` interface is an empty marker interface and does not mandate that a `Cloneable` class must have a public `clone` method. Even if we could sucessfully cast down to `Cloneable` we would not have access to a `clone` method. Hence, for purposes of invoking a `clone` method the `Cloneable` interface is totally irrelevant.

In the example we use reflection to find out whether the field has a public `clone` method. If it has a `clone` method, we invoke it.

Casting the result of cloning any fields to the type that the type parameter stands for.

If individual fields must be cloned, the `clone` method of the respective fields' type must be invoked. The result of this invocation of the `clone` method is often type `Object`, **so that another cast is necessary**. If the field in question has the type that the enclosing class's type parameter stands for then the target of this cast is the type variable and the compiler issues the usual "unchecked cast" warning. In our example we must clone the three fields of the unknown type `T`, which requires that we invoke the field's `clone` method via reflection. The result of the reflective call is of type `Object` and we must cast from `Object` to the type parameter `T`. Again, there is no way to avoid the unchecked casts after cloning the fields and the warnings are best suppressed by means of the standard annotation `@SuppressWarnings`.

### More "unchecked" warnings

If a class has fields that are of a parameterized type and these fields must be cloned then a cast from `Object` to the parameterized type might be necessary and the compiler issues the usual "unchecked cast" warning.

Example:

```java
class Store {
  private ArrayList<String> store = new ArrayList<String>();
  ...
  public Store clone() {
    Store clon = (Store)super.clone();
    clon.store = (ArrayList<String>) this.store.clone(); // unchecked warning
  }
}
```

Again there is no chance to avoid the "unchecked cast" warnings and they are best suppressed by means of the standard annotation `@SuppressWarnings`.

The reason for the undesired unchecked warnings in conjunction with the `clone` method stem from the fact that the `clone` method is **a non-generic legacy method**. **In situations where generic and non-generic code is mixed, unchecked warnings cannot be avoided.**

## Exception Handling.

In the example, we left open how the exceptions from reflective invocation of the members' `clone` methods should be handled. Should we suppress the exceptions, or should we map them to a `CloneNotSupportedException` , or perhaps simply propagate the exceptions to the caller?

Example (excerpt from implementation of clone):

```java
public Triple<T> clone( ) {
     ...
     try { 
       Class<?> clzz = this.fst.getClass();
       Method   meth = clzz. getMethod ( "clone" , new Class[0]);
       Object   dupl = meth. invoke (this.fst, new Object[0]);
       clon.fst = (T)dupl; 
     } catch (Exception e) {
      ...  ???  what should be done here ??? ...
     }
     ...
}
```

Usually, a `clone` method does not throw any exceptions; at least it does not throw a `CloneNotSupportedException`. The point in implementing a `clone` method is to support cloning. Why should a `clone` method throw a `CloneNotSupportedException` then? It is equally unusual that a `clone` method would throw any other exception, because a class knows its fields and their types well enough to successfully produce a clone of each field.

**For a generic class the situation is more complex**. We do not know anything about those fields of the class whose type is a type parameter.  In particular, we do not know whether those fields are `Cloneable` and/or have a `clone` method, as was explained above. The attempted invocation of the members' `clone` method via reflection bears the risk of failure, indicated by a number of exceptions raised by `Class.getMethod` and `Method.invoke` such as `NoSuchMethodException`, `IllegalArgumentException`, etc. In this situation the `clone` method might in fact fail to produce a clone and it might make sense to indicate this failure by mapping all (or some) exceptions to a `CloneNotSupportedException`.

Example (throwing a CloneNotSupportedException ):

```java
public Triple<T> clone( ) throws CloneNotSupportedException {
     ...
     try {
       Class<?> clzz = this.fst.getClass();
       Method   meth = clzz. getMethod ( "clone" , new Class[0]);
       Object   dupl = meth. invoke (this.fst, new Object[0]);
       clon.fst = (T)dupl;
     } catch (Exception e) {
      throw new CloneNotSupportedException (e.toString());
     }
     ...
}
```

On the other hand, one might argue that a type that does not have a `clone` method probably needs no cloning because objects of the type can safely be referenced from many other objects at the same time. Class `String` is an example. Class `String` is neither `Cloneable` nor has it a `clone` method.  Class `String` does not support the cloning feature, because `String` objects are immutable, that is, they cannot be modified. An immutable object is never copied, but simply shared among all objects that hold a reference to it. With our exception handling above the `clone` method of a `Triple<String>` would throw a `CloneNotSupportedException`, which is not quite appropriate. It would be preferable to let the original triple and its clone hold references to the shared string members.

Example (suppressing the NoSuchMethodException ):

```java
public Triple<T> clone( ) {
     ...
     try { 
       Class<?> clzz = this.fst.getClass();
      Method   meth = clzz. getMethod ( "clone" , new Class[0]);
       Object   dupl = meth. invoke (this.fst, new Object[0]);
       clon.fst = (T)dupl;
     } catch ( NoSuchMethodException e) {
      // exception suppressed
     } catch ( Exception e) {
       throw new InternalError(e.toString());
     }
     ...
}
```

In the exception handling suggested above we suppress the `NoSuchMethodException` under the assumption that an object without a `clone` method need not be cloned, but can be shared.

Note, that we cannot ascertain statically by means of type argument bounds, that the members of a triple have a `clone` method. We could define the type parameter with `Cloneable` as a bound, that is, as class `Triple<T extends Cloneable>`, but that would not avoid any of the issues discussed above. The `Cloneable` interface is an empty tagging interface and does not demand that a cloneable type has a `clone` method. We would still have to invoke the `clone` method via reflection and face the exception handling issues as before.
