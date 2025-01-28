---
title: "Type Parameters"
sequence: "104"
---

第一，分清 parameter 和 argument 这两个概念：

- parameter： 是一个 placeholder，是一个容器
- argument：是真正的参数

```java
public void test(Integer value) { // value 是 parameter
   // do nothing
}

test(10); // 而 10 是 argument
```

第二，分清 type、variable parameter、local variable 和 type parameter 这四个概念

- type: 具体的类型，可以是 Class(`Integer`)，可以是 Interface(`Runnable`)，可以是 Array(`int[]`)，可以是 Enum（`TimeUnit`）
- variable parameter：是一个变量（variable），同时也是一个容器（parameter）
- type parameter：是一个类型（type），同时也是一个容器（parameter）
- local variable：是一个变量（variable），是一个局部（local）的变量

```java
public void test_normal_method(Integer value) {// Integer 是 type，value 是 variable parameter
   int i; // i 是 local variable
}
```

![type vs type parameter](images/type_variable_parameter_and_type_parameter.png)

## 1. What is a type parameter?

**A place holder for a type argument**.

Generic types have one or more type parameters.

Example of a parameterized type:

```java
interface Comparable<E> {
    int compareTo(E other);
}
```

The identifier `E` is a type parameter. Each **type parameter** is replaced by a **type argument** when an instantiation of the generic type, such as `Comparable<Object>` or `Comparable<? extends Number>`, is used.

## 2. What is a bounded type parameter?

A reference type that is used to further describe a type parameter. It **restricts the set of types that can be used as type arguments** and **gives access to the non-static methods that it defines**.

**A type parameter can be unbounded**. In this case any reference type can be used as **type argument** to replace the unbounded type parameter in an instantiation of a generic type.

**A type parameter can have one or several bounds**. In this case the **type argument** that replaces the bounded type parameter in an instantiation of a generic type must be a subtype of all bounds.

The syntax for specification of type parameter bounds is:

```java
<TypeParameter extends Class & Interface1 & ... & InterfaceN >
```

A list of bounds consists of one class and/or several interfaces.

Example (of type parameters with several bounds):

```java
class Pair<A extends Comparable<A> & Cloneable,
           B extends Comparable<B> & Cloneable>
  implements Comparable<Pair<A,B>>, Cloneable { ... }
```

This is a generic class with two type arguments `A` and `B`, both of which have two bounds.

## 3. Which types are permitted as type parameter bounds?

All **classes**, **interfaces** and **enum types** including **parameterized types**, but **no primitive types** and **no array types**.

All **classes**, **interfaces**, and **enum types** can be used as type parameter bound, including **nested** and **inner types**.  Neither **primitive types** nor **array types** be used as type parameter bound.

Examples (of type parameter bounds):

```java
class X0 <T extends int > { ... }      // error
class X1 <T extends Object[] > { ... } // error
class X2 <T extends Number > { ... }
class X3 <T extends String > { ... }
class X4 <T extends Runnable > { ... }
class X5 <T extends Thread.State > { ... }
class X6 <T extends List > { ... }
class X7 <T extends List<String> > { ... }
class X8 <T extends List<? extends Number> > { ... }
class X9 <T extends Comparable<? super Number> > { ... }
class X10<T extends Map.Entry<?,?> > { ... }
```

The code sample shows that **primitive types** such as `int` and **array types** such as `Object[]` are not permitted as type parameter bound.

**Class types**, such as `Number` or `String`, and **interface types**, such as `Runnable`, are permitted as type parameter bound.

**Enum types**, such as `Thread.State` are also permitted as type parameter bound. `Thread.State` is an example of **a nested type** used as type parameter bound. **Non-static inner types** are also permitted.

**Raw types** are permitted as type parameter bound; `List` is an example.

**Parameterized types** are permitted as type parameter bound, including concrete parameterized types such as `List<String>`,  bounded wildcard parameterized types such as `List<? extends Number>` and `Comparable<? super Long>`, and unbounded wildcard parameterized types such as `Map.Entry<?,?>`. A bound that is a wildcard parameterized type allows as type argument all types that belong to the type family that the wildcard denotes. The wildcard parameterized type bound gives only restricted access to fields and methods; the restrictions depend on the kind of wildcard.

Example (of wildcard parameterized type as type parameter bound):

```java
class X<T extends List<? extends Number> > {
  public void someMethod(T t) {
    t.add(new Long(0L));    // error
    Number n = t.remove(0);
  }
}

class Test {
  public static void main(String[] args) {
     X<ArrayList<Long>>   x1 = new X<ArrayList<Long>>();
     X<ArrayList<String>> x2 = new X<ArrayList<String>>(); // error
  }
}
```

Reference variables of type `T` (the type parameter) are treated like reference variables of a wildcard type (the type parameter  bound). In our example the consequence is that the compiler rejects invocation of methods that take an argument of the "unknown" type that the type parameter stands for, such as `List.add`, because the bound is a wildcard parameterized type with an upper bound.

At the same time the bound `List<? extends Number>` determines the types that can be used as type arguments. The compiler accepts all type arguments that belong to the type family `List<? extends Number>`, that is, all subtypes of `List` with a type argument that is a subtype of `Number`.

Note, that even types that do not have subtypes, such as **final classes** and **enum types**, can be used as **upper bound**. In this case there is only one type that can be used as type argument, namely the type parameter bound itself. Basically, the parameterization is pointless then.

Example (of nonsensical parameterization):

```java
class Box<T extends String> {
  private T theObject;
  public Box( T t) { theObject = t; }
  ...
}
class Test {
  public static void main(String[] args) {
    Box<String> box1 = Box<String>("Jack");
    Box<Long>   box2 = Box<Long>(100L);    // error
  }
}
```

The compiler rejects all type arguments except `String` as "not being within bounds". The type parameter `T` is not needed and the `Box` class would better be defined as a non-parameterized class.

## 4. Can I use a type parameter as a type parameter bound?

**Yes**.

A type parameter can be used as the bound of another type parameter.

Example (of a type parameter used as a type parameter bound):

```java
class Triple <T> {
  private T fst, snd, trd;
  public <U extends T, V extends T, W extends T> Triple(U arg1, V arg2, W arg3) {
    fst = arg1;
    snd = arg2;
    trd = arg3;
  }
}
```

In this example the type parameter `T` of the parameterized class is used as bound of the type parameters `U`, `V` and `W` of a parameterized instance method of that class.

Further opportunities for using type parameters as bounds of other type parameters include situations where **a nested type is defined inside a generic type** or **a local class is defined inside a generic method**. It is even permitted to use a type parameter as bound of another type parameter in the same type parameter section.<sub>本段意图：介绍使用场景</sub>

## 5. Does a bound that is a class type give access to all its public members?

**Yes, except any constructors**.

A bound that is a class gives access to all its **public members**, that is, **public fields**, **methods**, and **nested type**. **Only constructors are not made accessible**, because there is no guarantee that a subclass of the bound has the same constructors as the bound.

Example (of a class used as bound of a type parameter):

```java
public class SuperClass {
    // static members
    public enum EnumType {THIS, THAT}
    public static Object staticField;
    public static void staticMethod() { ... }

    // non-static members
    public class InnerClass { ... }
    public Object nonStaticField;
    public void nonStaticMethod() { ... }

    // constructors
    public SuperClass() { ... }

    // private members
    private Object privateField;

    ...
}

public final class SomeClass<T extends SuperClass > {
    private T object;
    public SomeClass(T t) { object = t; }

    public String toString() {
        return
         "static nested type    : "+T.EnumType.class+"\n" 
        +"static field          : "+T.staticField+"\n"
        +"static method         : "+T.staticMethod()+"\n"
        +"non-static nested type: "+T.InnerClass.class+"\n"
        +"non-static field      : "+object.nonStaticField+"\n"
        +"non-static method     : "+object.nonStaticMethod()+"\n"
        +"constructor           : "+(new T())+"\n"                    // error
        +"private member        : "+object.privateField+"\n"          // error 
        ;
    }
}
```

The bound `SuperClass` gives access to its **nested types**, **static fields and methods** and **non-static fields and methods**. **Only the constructor is not accessible**. This is because constructors are not inherited. Every subclass defines its own constructors and need not support its superclass's constructors. Hence there is no guarantee that a subclass of `SuperClass` will have the same constructor as its superclass.

Although a superclass bound gives access to types, fields and methods of the type parameter, **only the non-static methods are dynamically dispatched**. In the unlikely case that a subclass redefines types, fields and static methods of its superclass, these redefinitions would not be accessible through the superclass bound.

Example (of a subclass of the bound used for instantiation):

```java
public final class SubClass extends SuperClass {
    // static members
    public enum Type {FIX, FOXI} 
    public static Object staticField;
    public static Object staticMethod() { ... }
    // non-static members 
    public class Inner { ... }
    public Object nonStaticField;
    public Object nonStaticMethod() { ... }

    // constructors 
    public SubClass(Object o) { ... }
    public SubClass(String s) { ... }

    ...
}

SomeClass<SubClass> ref = new SomeClass<SubClass>(new SubClass("xxx"));
System.out.println(ref);
```

```txt
prints:
static nested type    : SuperClass.EnumType
static field          : SuperClass.staticField
static method         : SuperClass.staticMethod  => SuperClass.staticField
non-static nested type: SuperClass.InnerClass
non-static field      : SuperClass.nonStaticField
non-static method     : SubClass.nonStaticMethod => SubClass.nonStaticField
```

Calling the `nonStaticMethod` results in invocation of the subclass's overriding version of the `nonStaticMethod`. In contrast, the subclass's redefinitions of types, fields and static methods are not accessible through the bounded parameter. This is nothing unusual. First, it is poor programming style to redefine in a subclass any of the superclass's nested types, fields and static methods. Only non-static methods are overridden. Second, the kind of hiding that we observe in the example above also happens when a subclass object is used through a superclass reference variable.

## 6. Why is there no lower bound for type parameters?

**Because it does not make sense for type parameters of classes; it would occasionally be useful in conjunction with method declarations, though**.

Type parameters can have several upper bounds, but no lower bound.  This is mainly because lower bound type parameters of classes would be confusing and not particularly helpful. In conjunctions with method declarations, type parameters with a lower bound would occasionally be useful. In the following, we first discuss **lower bound type parameters of classes** and subsequently **lower bound type parameters of methods**.

### Lower Bound Type Parameters of Classes

Type parameters can have several bounds, like in class `Box<T extends Number> {...}`. But a type parameter can have no lower bound, that is, a construct such as class `Box<T super Number> {...}` is not permitted. Why not? The answer is: **it is pointless because it would not buy you anything, were it allowed**. Let us see why lower bound type parameters of classes are confusing by exploring **what a upper bound on a type parameter means**.

The upper bound on a type parameter has three effects:

**Restricted Instantiation**. The upper bound restricts the set of types that can be used for instantiation of the generic type. If we declare a class `Box<T extends Number> {...}` then the compiler would ensure that only subtypes of `Number` can be used as type argument. That is, a `Box<Number>` or a `Box<Long>` is permitted, but a `Box<Object>` or `Box<String>` would be rejected.

Example (of restricted instantiation due to an upper bound on a type parameter):

```java
class Box<T extends Number> {
   private T value;
   public Box(T t) { value = t; }
   ...
}

class Test {
   public static void main(String[] args) {
       Box<Long>    boxOfLong   = new Box<Long>(0L);   // fine
       Box<String>  boxOfString = new Box<String>(""); // error: String is not within bounds
   }
}
```

**Access To Non-Static Members**. The upper bound gives access to all public non-static methods and fields of the upper bound. In the implementation of our class `Box<T extends Number> {...}` we can invoke all public non-static methods defined in class `Number`, such as `intValue()` for instance. Without the upper bound the compiler would reject any such invocation.

Example (of access to non-static members due to an upper bound on a type parameter):

```java
class Box<T extends Number> {
   private T value;
   public Box(T t) { value = t; }
   public int increment() { return value.intValue()+1; } // <= would be an error without the Number bound
   ...
}
```

**Type Erasure**. The leftmost upper bound is used for type erasure and replaces the type parameter in the byte code. In our class `Box<T extends Number> {...}` all occurrences of `T` would be replaced by the upper bound `Number`. For instance, if class `Box` has a private field of type `T` and a method `void set(T content)` for setting this private field, then the field would be of type `Number` after type erasure and the method would be translated to a method `void set(Number content)`.

Example (of use of upper bound on a type parameter in type erasure - before type erasure):

```java
class Box< T extends Number > {
   private T value;
   public Box(T t) { value = t; }
   ...
}
```

Example (of use of upper bound on a type parameter in type erasure - after type erasure):

```java
class Box {
   private Number value;
   public Box(Number t) { value = t; }
   ...
}
```

In addition, the leftmost upper bound appears in further locations, such as automatically inserted **casts** and **bridge methods**.

If lower bounds were permitted on type parameters, which side effects would or should they have? If a construct such as class `Box<T super Number> {...}` were permitted, what would it mean?  What would the 3 side effects of an upper type parameter bound  - **restricted instantiation**, **access to non-static member**, **type erasure** - mean for a lower bound?

**Restricted Instantiations**. The compiler could restrict the set of types that can be used for instantiation of the generic type with a lower bound type parameter. For instance, the compiler could permit instantiations such as `Box<Number>` and `Box<Object>` from a `Box<T super Number>` and reject instantiations such as `Box<Long>` or `Box<Short>`. This would be an effect in line with the restrictive side-effect described for upper type parameter bounds.

**Access To Non-Static Members**. A lower type parameter bound does not give access to any particular methods beyond those inherited from class `Object`. In the example of `Box<T super Number>` the supertypes of `Number` have nothing in common, except that they are reference types and therefore subtypes of `Object`. The compiler cannot assume that the field of type `T` is of type `Number` or a subtype thereof. Instead, the field of type `T` can be of any supertype of `Number`, such as `Serializable` or `Object`. The invocation of a method such as `intValue()` is no longer type-safe and the compiler would have to reject it. As a consequence, the lower type parameter bound would not give access to an non-static members beyond those defined in class `Object` and thus has the same effect as "no bound".

**Type Erasure**.  Following this line of logic, it does not make sense to replace the occurences of the type parameter by its leftmost lower bound. Declaring a method like the constructor `Box( T t)` as a constructor `Box(Number t)` does not make sense, considering that `T` is replaces by a supertype of `Number`. An `Object` might be rightly passed to the constructor in an instantiation `Box<Object>` and the constructor would reject it.  This would be dead wrong. So, type erasure would replace all occurences of the type variable `T` by type `Object`, and not by its lower bound. Again, the lower bound would have the same effect as "no bound".

Do you want to figure out what it would mean if both **lower** and **upper** bounds were permitted? Personally, I do not even want to think about it and would prefer to file it under "not manageable", if you permit.

The bottom line is: all that a "super" bound would buy you is the restriction that only supertypes of `Number` can be used as type arguments. And even that is frequently misunderstood. It would NOT mean, that class `Box<T super Number> {...}` contains only instances of supertypes of `Number`. Quite the converse - as the example below demonstrates!

Example (of use of upper bound on a type parameter in type erasure - before type erasure):

```java
class Box<T super Number > {
   private T value;
   public Box(T t) { value = t; }
   ...
}
```

Example (of use of upper bound on a type parameter in type erasure - after type erasure):

```java
class Box {
   private Object value;
   public Box(Object t) { value = t; }
   ...
}
```

A class `Box<T super Number> {...}` would be translated by type erasure to a `Box` containing an `Object` field and it's constructor would be translated to `Box(Object t)`. That's fundamentally different from a class `Box<T extends Number> {...}`, which would be translated to a `Box` containing a `Number` field and it's constructor would be translated to `Box(Number t)`. Consequently, a `Box<Number>` instantiated from a class `Box<T extends Number> {...}` would be different from a `Box<Number>` instantiation from a class `Box<T super Number> {...}`, which is likely to cause confusion. For this reason **lower bounds do not make sense on type parameters of classes**.

### Lower Bound Type Parameters of Methods

In conjunction with methods and their argument types, a type parameter with a lower bound can occasionally be useful.

Example (of a method that would profit from a type parameter with a lower bound):

```java
class Pair<X,Y> {
   private X first;
   private Y second;
   ...
   public <A super X, B super Y> B addToMap(Map<A,B> map) {  // error: type parameter cannot have lower bound
      return map.put(first, second);
   }
}

class Test {
   public static void main(String[] args) {
     Pair<String,Long> pair = new Pair<>("ABC",42L);
     Map<CharSequence, Number> map = HashMap<CharSequence, Number>();
     Number number = pair.addToMap(map);
   }
}
```

The `addToMap()` method adds the content of the pair to a `map`.  Any map that can hold supertypes of `X` and `Y` would do. The map's `put()` method returns the value found in the map for the given key, if there already is a key-value entry for the key in the map. The return value of the map's `put()` method shall be returned from the `addToMap()` method. Under these circumstances one would like to declare the method as shown above: The `map` is parameterized with supertypes of the pair's type parameters and the `addToMap()` method's return type is the map's value type.

Since **the compiler does not permit lower bounds on type parameters** we need a work-around.

One work-around that comes to mind is use of a **wildcard**, because **wildcards can have a lower bound**. Here is a work-around using a wildcard.

Example (of a work-around for the previous example using wildcards):

```java
class Pair<X,Y> {
   private X first;
   private Y second;
   ...
   public Object addToMap(Map<? super X, ? super Y> map) {
      return map.put(first, second);
   }
}

class Test {
   public static void main(String[] args) {
     Pair<String,Long> pair = new Pair<>("ABC",42L);
     Map<CharSequence, Number> map = HashMap<CharSequence, Number>();
     Number number = (Number) pair.addToMap(map);
   }
}
```

It works, except that there is no way to declare the return type as desired. It would be the supertype of `Y` that the compiler captures from the map type, but there is no syntax for specifying it. We must not declare the return type a "`? super Y`", because "`? super Y`" is a wildcard and not a type and therefore not permitted as a return type. We have no choice and must use `Object` instead as our method's return type. This rather unspecific return type in turn forces callers of the `addToMap()` method into casting the return value down from `Object` to its actual type. This is not exactly what we had in mind.

Another work-around is use of **static methods**. Here is a work-around with a static instead of a non-static method.

Example (of a work-around for the previous example using a static method):

```java
class Pair<X,Y> {
   private X first;
   private Y second;
   ...
   public static <A , B, X extends A, Y extends B> B addToMap(Pair<X,Y> pair, Map<A , B> map) {
      return map.put(pair.first,pair.second);
   }
}

class Test {
   public static void main(String[] args) {
     Pair<String,Long> pair = new Pair<>("ABC",42L);
     Map<CharSequence, Number> map = HashMap<CharSequence, Number>();
     Number number = Pair .addToMap(pair ,map);
   }
}
```

The generic `addToMap()` method has four type parameters: two placeholders `X` and `Y` for the pair's type and two placeholders `A` and `B` for the map's type. `A` and `B` are supertypes of `X` and `Y`, because `X` and `Y` are declared with `A` and `B` as their upper bounds. (Note, that the generic method's type parameters `X` and `Y` have nothing to do with the Pair class's `X` and `Y` parameters. The names `X` and `Y` are reused for the generic method to make them easily recognizably as the pair's type parameters.)  Using four type parameters we can declare the precise return type as desired: it is the same type as the value type of the map.<sub>这里让我明白一个很重要的道理：Pair Class 中的 X 和 Y，与 Generic method 中的 X 和 Y 并不是一回事儿，就和“平行宇宙”类似，在一个宇宙中有一个人的名字叫“小明”，在另一个平行宇宙中也有一个人叫“小明”，但是两者并不能确切的说是同一个人，而是两个拥有相同的名字，但却可能过着完全不同人生的人。</sub>

The bottom line is that **the usefulness of lower bounds on type parameters is somewhat debatable**. They would be confusing and perhaps even misleading when used as type parameters of a generic class. On the other hand, generic methods would occasionally profit from a type parameter with a lower bound. For methods, a work-around for the lack of a lower bound type parameter can often be found. Such a work-around typically involves **a static generic method** or **a lower bound wildcard**.
