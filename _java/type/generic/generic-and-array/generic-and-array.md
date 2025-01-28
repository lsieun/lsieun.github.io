---
title: "Generic 与 Array 的融合"
sequence: "103"
---

当 arrays 和 generics 混合在一起使用的时候，就会引起一些很特殊的情况。
换句话说，当有两个事物，这两个事物之间本来就有一些不同之处；
如果把这两个事物混合在一起使用，有可能会出现一件事物弥补了另一件事物的不足之处，也有可能就会出现两个事物不协调的情况。
当然，在这里我们强调的是两者“不协调”的情况。

用一个生活当中的例子来说明，两个人结婚，两个人的性格不相同，相处的时候难免就会有矛盾的发生。

Problems arise when an array holds elements whose type is a concrete parameterized type.
**Because of type erasure, parameterized types do not have exact runtime type information.
As a consequence, the array store check does not work**
because it uses the dynamic type information regarding the array's (non-exact) component type for the array store check.

## 两个概念

两个概念：array variable 和 array object

![](/assets/images/java/generic/array-variable-and-array-object.png)

Generally, **reifiable types are permitted as component type of arrays, while arrays with a non-reifiable component type are illegal**

- reifiable types
    - `List` (Raw Type)
    - `List<?>` (Unbounded Wildcard Parameterized type)
- non-reifiable type
    - `T` (Type Parameter)
    - `List<String>` (Concrete Parameterized Type)
    - `List<? extends Number>` (Bounded Wildcard Parameterized Type)

| Types                    | Array Variable | Array Object |
|--------------------------|----------------|--------------|
| `T`                      | OK             | NO           |
| `List<String>`           | OK             | NO           |
| `List<? extends Number>` | OK             | NO           |
| `List<?>`                | OK             | OK           |
| `List`                   | OK             | OK           |


## Type Parameter

如果 `T[]` 作为 array variable，编译器能够接受：

```text
T[] array = null;
```

如果 `T[]` 作为 array object，编译器就会报错：

```text
Object[] array = new T[10];
```

原因：the compiler does not know how to create an array of an unknown component type。

### 举例

比如说，我们想通过泛型（generic）生成不同类型的数组（array）：

```java
public class Box<T> {
    public T[] getArray(int size) {
        T[] array = new T[size]; // 这里会报错
        return array;
    }
}
```

```java
public class HelloWorld {
    public void test() {
        Box<String> box = new Box<>();
        String[] strArray = box.getArray(10);
    }
}
```

### 原因说明

为什么会报错呢？

因为经过类型擦除之后，`T[] array = new T[size];` 就会变成：

```text
Object[] array = new Object[size];
```

再进入到 `HelloWorld.test()` 方法内，就相当于：

```text
Object[] array = new Object[size];
String[] strArray = (String[])array; // 这一步就会出错
```

### 解决方法

If you need to create arrays of an unknown component type, you can use reflection as a workaround.

It requires that you supply type information, typically in form of a `Class` object,
and then use that type information to create arrays via reflection.

```java
import java.lang.reflect.Array;

public class Box<T> {
    public T[] getArray(Class<?> type, int size) {
        // Unchecked cast: 'java.lang.Object' to 'T[]' 
        T[] array = (T[]) Array.newInstance(type, size);
        return array;
    }
}
```

By the way, the unchecked warning is harmless and can be ignored.
It stems from the need to cast to the unknown array type,
because the `newInstance` method returns an `Object[]` as a result.

可以加上一个 `@SuppressWarnings` 注解：

```text
@SuppressWarnings({"unchecked"})
```

```java
public class HelloWorld {
    public void test() {
        Box<String> box = new Box<>();
        String[] strArray = box.getArray(String.class, 10);
    }
}
```

## Concrete Parameterized Type

#### Problems arise

Example (of array store check in case of parameterized component type):

```text
Pair<Integer,Integer>[] intPairArr = new Pair<Integer,Integer>[10]; // illegal
Object[] objArr = intPairArr;
objArr[0] = new Pair<String,String>("",""); // should fail, but would succeed
```

If arrays of concrete parameterized types were allowed,
then a reference variable of type `Object[]` could refer to a `Pair<Integer,Integer>[]`, as shown in the example.
At runtime an array store check must be performed when an array element is added to the array.
Since we are trying to add a `Pair<String,String>` to a `Pair<Integer,Integer>[]` we would expect that the type check fails.
However, the JVM cannot detect any type mismatch here: at runtime, after type erasure,
`objArr` would have the dynamic type `Pair[]` and the element to be stored has the matching dynamic type `Pair`.
Hence the store check succeeds, although it should not.

If it were permitted to declare arrays that holds elements whose type is a concrete parameterized type
we would end up in **an unacceptable situation**.
The array in our example would contain different types of pairs instead of pairs of the same type.
This is in contradiction to **the expectation** that arrays hold elements of the same type (or subtypes thereof).
This undesired situation would most likely lead to program failure some time later,
perhaps when a method is invoked on the array elements.

我的理解就是，“人们心中总会对事物的有所期待”，当“这种期待”与现实的真实结果不一致的时候，就容易让人们（的思维逻辑）感到困惑。
为了解决这个困惑，JVM 的实现上选择了“不能让 concrete parameterized type 创建数组”

Example (of subsequent failure):

```text
Pair<Integer,Integer>[] intPairArr = new Pair<Integer,Integer>[10]; // illegal
Object[] objArr = intPairArr;
objArr[0] = new Pair<String,String>("",""); // should fail, but would succeed
Integer i = intPairArr[0].getFirst(); // fails at runtime with ClassCastException
```

The method `getFirst` is applied to the first element of the array and
it returns a `String` instead of an `Integer`
because the first element in the array `intPairArr` is a pair of strings,
and not a pair of integers as one would expect.
The innocent-looking assignment to the `Integer` variable `i` will fail with a `ClassCastException`,
although no cast expression is present in the source code.
Such an unexpected `ClassCastException` is considered a violation of type-safety.

In order to prevent programs that are not type-safe **all arrays holding elements whose type is a concrete parameterized type are illegal**.
For the same reason, **arrays holding elements whose type is a bounded wildcard parameterized type are banned**, too.
**Only arrays with an unbounded wildcard parameterized type as the component type are permitted**.
More generally, **reifiable types are permitted as component type of arrays, while arrays with a non-reifiable component type are illegal**.

### array variable

Can I declare a reference variable of an array type whose component type is a concrete parameterized type?
**Yes, you can, but you should not, because it is neither helpful nor type-safe**.

You can declare a reference variable of an array type whose component type is a concrete parameterized type.
Arrays of such a type must not be created.
Hence, this reference variable cannot refer to an array of its type.
All that it can refer to is `null`, **an array whose component type is a non-parameterized subtype of the concrete parameterized type**,
or **an array whose component type is the corresponding raw type**.
Neither of these cases is overly useful, yet they are permitted.

Example (of an array reference variable with parameterized component type):

```text
Pair<String,String>[] arr = null;  // fine
arr = new Pair<String,String>[2] ; // error: generic array creation
```

The code snippet shows that a reference variable of type `Pair<String,String>[]` can be declared,
but the creation of such an array is rejected.
But we can have the reference variable of type `Pair<String,String>[]` refer to an array of a non-parameterized subtype.

Example (of another array reference variable with parameterized component type):

```text
class Name extends Pair<String,String> { ... }
Pair<String,String>[] arr = new Name[2];    // fine
```

Which raises the question: how useful is such an array variable if it never refers to an array of its type?  Let us consider an example.

Example (of an array reference variable refering to array of subtypes; not recommended):

```text
void printArrayOfStringPairs(Pair<String, String>[] array) {
    for (Pair<String, String> p : array) {
        if (p != null) {
            System.out.println(p.getFirst() + " " + p.getSecond());
        }
    }
}

Pair<String, String>[] createArrayOfStringPairs() {
    Pair<String, String>[] arr = new Name[2];
    arr[0] = new Name("Hello", "World");         // fine
    arr[1] = new Pair<String, String>("a", "b"); // fine (but runtime will causes ArrayStoreException)
    return arr;
}

void extractStringPairsFromArray(Pair<String, String>[] arr) {
    Name name = (Name) arr[0];        // fine
    Pair<String, String> p1 = arr[1]; // fine
}

void test() {
    Pair<String, String>[] arr = createArrayOfStringPairs();
    printArrayOfStringPairs(arr);
    extractStringPairsFromArray(arr);
}
```

The example shows that a reference variable of type `Pair<String,String>[]` can refer to an array of type `Name[]`,
where `Name` is a non-parameterized subtype of `Pair<String,String>`.
However, using a reference variable of type `Pair<String,String>[]` offers no advantage over using a variable of the actual type `Name[]`.
Quite the converse; it is an invitation for making mistakes.<sub>使用 `Pair<String,String>[]`，还不如使用 `Name[]`</sub>

For instance, in the `createArrayOfStringPairs` method the compiler would permit code for insertion of elements of type `Pair<String,String>` into the array though the reference variable of type `Pair<String,String>[]`. Yet, at runtime, this insertion will always fail with an `ArrayStoreException` because we are trying to insert a `Pair` into a `Name[]`. The same would happen if we tried to insert a raw type `Pair` into the array; it would compile with **an "unchecked" warning** and would fail at runtime with an `ArrayStoreException`. If we used `Name[]` instead of `Pair<String,String>[]` the debatable insertions would not compile in the first place.

Also, remember that a variable of type `Pair<String,String>[]` can never refer to an array that contains elements of type `Pair<String,String>`. When we want to recover the actual type of the array elements, which is the subtype `Name` in our example, we must cast down from `Pair<String,String>` to `Name`, as is demonstrated in the `extractStringPairsFromArray` method.  Here again, using a variable of type `Name[]` would be much clearer.

Example (improved):

```text
void printArrayOfStringPairs(Pair<String, String>[] array) {
    for (Pair<String, String> p : array) {
        if (p != null) {
            System.out.println(p.getFirst() + " " + p.getSecond());
        }
    }
}

Name[] createArrayOfStringPairs() {
    Name[] arr = new Name[2];
    arr[0] = new Name("Hello", "World");         // fine
    arr[1] = new Pair<String, String>("a", "b"); // error
    return arr;
}

void extractStringPairsFromArray(Name[] arr) {
    Name name = (Name) arr[0];        // fine
    Pair<String, String> p1 = arr[1]; // fine
}

void test() {
    Name[] arr = createArrayOfStringPairs();
    printArrayOfStringPairs(arr);
    extractStringPairsFromArray(arr);
}
```

Since an array reference variable whose component type is a concrete parameterized type can never refer to an array of its type, such a reference variable does not really make sense.  Matters are even worse than in the example discussed above, when we try to have the variable refer to an array of the **raw type** instead of a subtype. First, it leads to **numerous "unchecked" warnings** because we are mixing use of raw and parameterized type. Secondly, and more importantly, **this approach is not type-safe** and suffers from all the deficiencies that lead to the ban of arrays of concrete instantiation in the first place.

No matter how you put it, you should better refrain from using array reference variable whose component type is a **concrete parameterized type**. Note, that the same holds for array reference variable whose component type is a **bounded wildcard parameterized type**. **Only array reference variable whose component type is an unbounded wildcard parameterized type make sense**. This is because an **unbounded wildcard parameterized type** is a reifiable type and arrays with a reifiable component type can be created; the array reference variable can refer to an array of its type and the deficiencies discussed above simply do not exist for unbounded wildcard arrays.

## bounded wildcard parameterized type

### array object

Can I create an array whose component type is a bounded wildcard parameterized type? **No, because it is not type-safe**.

The rationale is the same as for concrete parameterized types: a wildcard parameterized type, unless it is an unbounded wildcard parameterized type, is a non-reifiable type and arrays of non-reifiable types are not type-safe.

The array store check cannot be performed reliably because a wildcard parameterized type that is not an unbounded wildcard parameterized type has a non-exact runtime type.

Example (of the consequences):

```text
Object[] numPairArr = new Pair<? extends Number,? extends Number>[10]; // illegal
numPairArr[0] = new Pair<Long,Long>(0L,0L);     // fine
numPairArr[0] = new Pair<String,String>("",""); // should fail, but would succeed
```

The array store check would have to check whether the pair added to the array is of type `Pair<? extends Number,? extends Number>` or of a subtype thereof. Obviously, a `Pair<String,String>` is not of a matching type and should be rejected with an `ArrayStoreException`. But the array store check does not detect any type mismatch, because the JVM can only check the array's runtime component type, which is `Pair[]` after type erasure, against the element's runtime type, which is `Pair` after type erasure.

### array variable

Can I declare a reference variable of an array type whose component type is a bounded wildcard parameterized type? **Yes, you can, but you should not, because it is neither helpful nor type-safe**.

The rationale is the same as for concrete parameterized types: a wildcard parameterized type, unless it is an unbounded wildcard parameterized type, is a non-reifiable type and arrays of non-reifiable types must not be created. Hence it does not make sense to have a reference variable of such an array type because it can never refer to array of its type. All that it can refer to is `null`, **an array whose component type is a non-parameterized subtype of the instantiations that belong to the type family denoted by the wildcard**, or **an array whose component type is the corresponding raw type**. Neither of these cases is overly useful, yet they are permitted.

Example (of an array reference variable with wildcard parameterized component type):

```text
Pair<? extends Number,? extends Number>[] arr = null;  // fine
arr = new Pair<? extends Number,? extends Number>[2] ;  // error: generic array creation
```

The code snippet shows that a reference variable of type `Pair<? extends Number,? extends Number>[]` can be declared, but the creation of such an array is illegal. But we can have the reference variable of type `Pair<? extends Number,? extends Number>[]` refer to an array of a non-parameterized subtype of any of the concrete instantiations that belong to the type family denoted by `Pair<? extends Number,? extends Number>`. (Remember, wildcard parameterized types cannot be used as supertypes; hence a non-parameterized subtype must be a subtype of a concrete parameterized type.)

Example (of another array reference variable with parameterized component type):

```text
class Point extends Pair<Double,Double> { ... }
Pair<? extends Number,? extends Number>[] arr = new Point[2];    // fine
```

Using a reference variable of type `Pair<? extends Number,? extends Number>[]` offers no advantage over using a variable of the actual type `Point[]`. Quite the converse; it is an invitation for making mistakes.

Example (of an array reference variable refering to array of subtypes; not recommended):

```text
Pair<? extends Number,? extends Number>[] arr = new Point[3];
arr[0] = new Point(-1.0,1.0);  // fine
arr[1] = new Pair<Number,Number>(-1.0,1.0); // fine (causes ArrayStoreException)
arr[2] = new Pair<Integer,Integer>(1,2); // fine (causes ArrayStoreException)
```

The compiler permits code for insertion of elements of type `Pair< Number,Number>` or `Pair<Integer,Integer>` into the array through the reference variable of type `Pair<? extends Number,? extends Number>[]`. Yet, at runtime, this insertion will always fail with an `ArrayStoreException` because we are trying to insert a `Pair` into a `Point[]`. The debatable insertions would be flagged as errors and thereby prevented if we used the actual type of the array, namely `Point[]` instead of `Pair<?extends Number,? extends Number>[]`.

In essence, you should better refrain from using array reference variable whose component type is a wildcard parameterized type.  Note, that the same holds for array reference variable whose component type is a concrete parameterized type. Only an array reference variable whose component type is an unbounded wildcard parameterized type make sense. This is because an unbounded wildcard parameterized type is a reifiable type and arrays with a reifiable component type can be created; the array reference variable can refer to an array of its type and the deficiencies discussed above simply do not exist for unbounded wildcard arrays.

## unbounded wildcard parameterized type

### array object

Why is it allowed to create an array whose component type is an unbounded wildcard parameterized type? **Because it is type-safe**.

The rationale is related to the rule for other instantiations of a generic type: **an unbounded wildcard parameterized type is a reifiable type** and **arrays of reifiable types are type-safe**, in contrast to arrays of non-reifiable types, which are not safe and therefore illegal. The problem with the unreliable array store check (the reason for banning arrays with a non-reifiable component type) does not occur if the component type is reifiable.
Example (of array of unbounded wildcard parameterized type):

```text
Object[] pairArr = new Pair<?, ?>[10];         // fine
pairArr[0] = new Pair<Long, Long>(0L, 0L);     // fine
pairArr[0] = new Pair<String, String>("", ""); // fine
pairArr[0] = new ArrayList<String>();          // fails with ArrayStoreException
```

The array store check must check whether the element added to the array is of type `Pair<?,?>` or of a subtype thereof. In the example the two pairs, although of different type, are perfectly acceptable array elements. And indeed, the array store check, based on the non-exact runtime type `Pair`, accepts the two pairs and correctly sorts out the "alien" `ArrayList` object as illegal by raising an `ArrayStoreException`. The behavior is exactly the same as for an array of the raw type, which is not at all surprising because the raw type is a reifiable type as well.

### array variable

Can I declare a reference variable of an array type whose component type is an unbounded wildcard parameterized type? **Yes**.

**An array reference variable whose component type is an unbounded wildcard parameterized type** (such as `Pair<?,?>[]`) **is permitted and useful**. This is in contrast to array reference variables with a component type that is a concrete or bounded wildcard parameterized type (such as `Pair<Long,Long>[]` or `Pair<? extends Number,? extends Number>[]`); the array reference variable is permitted, but not overly helpful.

The difference stems from the fact that **an unbounded wildcard parameterized type is a reifiable type** and **arrays with a reifiable component type can be created**. **Concrete and bounded wildcard parameterized types are non-reifiable types** and **arrays with a non-reifiable component type can not be created**. As a result, an array variable with a reifiable component type can refer to array of its type, but this is not possible for the non-reifiable component types.

Example (of array reference variables with parameterized component types):

```text
Pair<?,?>[] arr = new Pair<?,?>[2];           // fine
Pair<? extends Number,? extends Number>[] arr
  = new Pair<? extends Number,? extends Number>[2];  // error: generic array creation

Pair<Double,Double>[] arr
  = new Pair<Double,Double>[2];    // error: generic array creation
```

The examples above demonstrate that unbounded wildcard parameterized types are permitted as component type of an array, while other instantiations are not permitted. In the case of a non-reifiable component type the array reference variable can be declared, but it cannot refer to an array of its type. At most it can refer to an array of a non-parameterized subtype (or an array of the corresponding raw type), which opens opportunities for mistakes, but does not offer any advantage.

## Workaround

### three workarounds

How can I work around the restriction that there are no arrays whose component type is a concrete parameterized type?

You can use **arrays of raw types**, **arrays of unbounded wildcard parameteriezd types**, or **collections of concrete parameteriezd types** as a workaround.

Arrays holding elements whose type is a concrete parameterized type are illegal.

Example (of illegal array type):

```text
static void test() {
  Pair<Integer,Integer>[] intPairArr = new Pair<Integer,Integer>[10] ; // error
  addElements(intPairArr);
  Pair<Integer,Integer> pair = intPairArr[1];
  Integer i = pair.getFirst();
  pair.setSecond(i);
}

static void addElements(Object[] objArr) {
  objArr[0] = new Pair<Integer,Integer>(0,0);
  objArr[1] = new Pair<String,String>("","");      // should fail with ArrayStoreException
}
```

The compiler prohibits creation of arrays whose component type is a concrete parameterized type, like `Pair<Integer,Integer>` in our example. We discussed in the preceding entry why is it reasonable that the compiler qualifies a `Pair<Integer,Integer>[]` as illegal.  **The key problem is that compiler and runtime system must ensure that an array is a homogenous sequence of elements of the same type**. One of the type checks, namely the array-store-check performed by the virtual machine at runtime, fails to detect the offending insertion of an alien element. In the example the second insertion in the `addElements` method should fail, because were are adding a pair of strings to an array of integral values, but it does not fail as expected  The reasons were discussed in the preceding entry.

If we cannot use arrays holding elements whose type is a concrete parameterized type, what do we use as a workaround?

Let us consider 3 conceivable workarounds:

- array of raw type
- array of unbounded wildcard parameterized type
- collection instead of array

### Raw types

Raw types and unbounded wildcard parameterized type are permitted as component type of arrays. Hence they would be alternatives.

Example (of array of raw type):

```text
static void test() {
  Pair[] intPairArr = new Pair[10];
  addElements(intPairArr);
  Pair<Integer,Integer> pair = intPairArr[1];  // unchecked warning
  Integer i = pair.getFirst();                   // fails with ClassClassException
  pair.setSecond(i);
}

static void addElements(Object[] objArr) {
  objArr[0] = new Pair<Integer,Integer>(0,0);
  objArr[1] = new Pair<String,String>("","");    // should fail, but succeeds
}
```

Use of the raw type, instead of a parameterized type, as the component type of an array, is permitted. The downside is that we can stuff any type of pair into the raw type array. There is no guarantee that a `Pair[]` is homogenous in the sense that it contains only pairs of the same type. Instead the `Pair[]` can contain a mix of arbitrary pair types.

This has numerous side effects. When elements are fetched from the `Pair[]` only raw type `Pair` references are received. Using raw type `Pair`s leads to unchecked warnings invarious situations, for instance, when we try to access the pair member or, like in the example, when we assign the `Pair` to the more specific `Pair<Integer,Integer>`, that we really wanted to use.

### unbounded wildcard parameterized type

Let us see whether an array of an **unbounded wildcard parameterized type** would be a better choice.

Example (of array of unbounded wildcard parameterized type):

```text
static void test() {
  Pair<?,?>[] intPairArr = new Pair<?,?>[10];
  addElements(intPairArr);
  Pair<Integer,Integer> pair = intPairArr[1];  // error
  Integer i = pair.getFirst();
  pair.setSecond(i);
}

static void addElements(Object[] objArr) {
  objArr[0] = new Pair<Integer,Integer>(0,0);
  objArr[1] = new Pair<String,String>("","");    // should fail, but succeeds
}
```

```text
error: incompatible types
found   : Pair<?,?>
required: Pair<java.lang.Integer,java.lang.Integer>
        Pair<Integer,Integer> pair = intPairArr[1];
                                               ^
```

A `Pair<?,?>[]` contains a mix of arbitrary pair types; it is not homogenous and semantically similar to the raw type array `Pair[]`.  When we retrieve elements from the array we receive references of type `Pair<?,?>`, instead of type `Pair` in the raw type case. **The key difference is that the compiler issues an error for the wildcard pair where it issues "unchecked" warnings for the raw type pair**. In our example, we cannot assign the the `Pair<?,?>` to the more specific `Pair<Integer,Integer>`, that we really wanted to use. Also, various operations on the `Pair<?,?>` would be rejected as errors.

As we can see, arrays of **raw types** and **unbounded wildcard parameterized types** are very different from the illegal arrays of a **concrete parameterized type**. An array of a concrete parameterized type would be a homogenous sequence of elements of the exact same type. In constrast, arrays of raw types and unbounded wildcard parameterized type are heterogenous sequences of elements of different types. The compiler cannot prevent that they contain different instantiations of the generic type.

By using arrays of raw types or unbounded wildcard parameterized types we give away the static type checks that a homogenous sequence would come with. As a result we must use explicit casts or we risk unexpected `ClassCastException`s. In the case of the **unbounded wildcard parameterized type** we are additionally **restricted in how we can use the array elements**, because the compiler prevents certain operations on the unbounded wildcard parameterized type. In essence, arrays of raw types and unbounded wildcard parameterized types are semantically very different from what we would express with an array of a concrete parameterized type. For this reason they are not a good workaround and only acceptable when the superior efficiency of arrays (as compared to collections) is of paramount importance.

### collection

While arrays of concrete parameterized types are illegal, collections of concrete parameterized types are permitted.

Example (using collections):

```text
static void test() {
  ArrayList<Pair<Integer,Integer>> intPairArr = new ArrayList<Pair<Integer,Integer>>(10);
  addElements(intPairArr);
  Pair<Integer,Integer> pair = intPairArr.get(1);
  Integer i = pair.getFirst();
  pair.setSecond(i);
}

static void addElements(List<?> objArr) {
  objArr.add (0,new Pair<Integer,Integer>(0,0)); // error
  objArr.add (1,new Pair<String,String>("","")); // error
}
```

```text
error: cannot find symbol
symbol  : method add(int,Pair<java.lang.Integer,java.lang.Integer>)
location: interface java.util.List<capture of ?>
        objArr.add(0,new Pair<Integer,Integer>(0,0));
              ^
error: cannot find symbol
symbol  : method add(int,Pair<java.lang.String,java.lang.String>)
location: interface java.util.List<capture of ?>
        objArr.add(1,new Pair<String,String>("",""));
              ^
```

A collection of a concrete parameterized type is a homogenous sequence of elements and the compiler prevents any attempt to add alien elements by means of static type checks. To this regard it is semantically similar to the illegal array, but otherwise collections are very different from arrays. They have different operations; no index operator, but `get` and `add` methods. They have different type relationships; **arrays are covariant, while collections are not**. **They are not as efficient as arrays; they add overhead in terms of memory footprint and performance**. By using collections of concrete parameterized types as a workaround for the illegal array type many things change in your implementation.

The different type relationships, for instance, can be observed in the example above and it renders method `addElements` pointless.  Using **arrays** we declared the argument type of the `addElements` method as type `Object[]` so that the method would accept all types of arrays.  For the **collections** there is no such supertype as an `Object[]`.  Type `Collection<?>`, or type `List<?>` in our example, comes closest to what the `Object[]` is for arrays. But wildcard instantiations of the collection types give only limited access to the collections' operations. In our example, we cannot insert any elements into the collection of integer pairs through a reference of type `List<?>`. A method like `addElements` does not make any sense any longer; we would need a method specifically for a collection of `Pair<Integer,Integer>` instead. In essence, you must design your APIs differently, when you work with collections instead of arrays.

The most compelling argument against collections is **efficiency**; arrays are without doubt more efficient. The argument in favor of collections is **type safety**; the compiler performs all necessary type checks to ensure that the collection is a homogenous sequence.

## Recap

Depending on the situation, an array of a **unbouned wildcard parameterized type** may be a viable alternative to the illegal array of a **concrete (or bounded wildcard) parameterized type**. If full access to the referenced element is needed, this approach does not work and a better solution would be use of a **collection** instead of an **array**.
