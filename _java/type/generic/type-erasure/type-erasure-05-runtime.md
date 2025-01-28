---
title: "Type Erasure: Runtime Generic"
sequence: "119"
---

## How do I pass type information to a method so that it can be used at runtime?

By means of a `Class` object.

The type information that is provided by a **type parameter** is **static type information** that is no longer available at **runtime**. When we need type information that is available at runtime we must explicitly supply the runtime time information to the method. Below are a couple of situations where the static type information provided by a type parameter does not suffice.

Example (of illegal or pointless use of type parameter):

```java
public static <T> void someMethod() {
    ... new T() ... // error
    ... new T[SIZE] ... // error
    ... ref instanceof T ...      // error
    ... (T) ref .. .               // unchecked warning
  }
}

Utilities.<String>someMethod();
```

The type parameter `T` of the method does not provide any type information that would still be accessible at runtime.  At runtime the type parameter is represented by the raw type of it leftmost bound or type `Object` if no bound was specified. For this reason, the compiler refuses the accept type parameters in `new` expressions, and **type checks** based on the type parameter are either illegal or nonsensical.

If we really need runtime type information we must pass it to the method explicitly.  There are 3 techniques for supplying runtime type information to a method:

- supply an object
- supply an array
- supply a Class object

The 3 alternative implementations of the method above would look like this:

Example (of passing runtime type information):

```java
public static <T> void someMethod(T dummy) {
  Class<?> type = dummy.getClass();
  ...  use type reflectively ...
}
public static <T> void someMethod(T[] dummy) {
  ...  use type reflectively ...
  Class<?> type = dummy.getClass().getComponentType();
}
public static <T> void someMethod(Class<T> type) {
  ...  use type reflectively ...
  ... (T)type.newInstance() ...
  ... (T[])Array.newInstance(type,SIZE) ...
  ... type.isInstance(ref) ...
  ... type.cast(tmp) ...
}

Utilities.someMethod( new String() );
Utilities.someMethod( new String[0] );
Utilities.someMethod( String.class );
```

The first two alternatives are wasteful, because dummy objects must be created for the sole purpose of supplying their type information. In addition, **the first approach** does not work when an abstract class or an interface must be represented, because no objects of these types can be created.

**The second technique** is **the classic approach**; it is the one taken by the `toArray` methods of the collection classes in package java.util (see `java.util.Collection.toArray(T[])`).

**The third alternative** is **the recommended technique**.  It provides runtime type information by means of a `Class` object.

Here are the corresponding operations based on the runtime type information from the example above, this time performed using reflection.

Example (of reflective use of runtime type information):

```java
public static <T> void someMethod(Class<T> type) {
  ... (T)type.newInstance() ...
  ... (T[])Array.newInstance(type, SIZE) ...
  ... type.isInstance(ref) ...
  ... type.cast(tmp) ...
}
```

## How do I generically create objects and arrays?

Using reflection.

The type information that is provided by a type parameter is static type information that is no longer available at runtime. It does not permit generic creation of objects or arrays.

Example (of failed generic array creation based on static type information):

```java
class Utilities {
  private static final int SIZE = 1024;
  public static <T> T[] createBuffer() {
    return new T[SIZE] ; // error
  }
}

public static void main(String[] args) {
  String[] buffer = Utilities.<String> createBuffer();
}
```

The type parameter `T` of method `createBuffer` does not provide any type information that would still be accessible at runtime. At runtime the type parameter is represented by the raw type of it leftmost bound or type `Object` if no bound was specified. For this reason, the compiler refuses the accept type parameters in `new` expressions.

If we need to generically create an object or array, then we must pass type information to the `createBuffer` method that persists until runtime. This runtime type information can then be used to perform the generic object of array creation via reflection. The type information is best supplied by means of a `Class` object. (A  `Class` object used this way is occasionally called a **type token**.)

Example (of generic array creation based on runtime type information):

```java
public static <T> T[] createBuffer( Class<T> type) {
  return (T[])Array.newInstance(type,SIZE);
}

public static void main(String[] args) {
  String[] buffer = Utilities.createBuffer( String.class );
}
```

Note that the parameterization of class `Class` allows to ensure at compile time that no arbitrary types of `Class` objects are passed to the `createBuffer` method. Only a `Class` object that represents a runtime type that matches the desired component type of the created array is permitted.
Example:

```java
String[] buffer = Utilities.createBuffer( String.class );
String[] buffer = Utilities.createBuffer( Long.class ); // error
Number[] buffer = Utilities.createBuffer( Long.class );
```

Note also, that **arrays of primitive type elements** cannot be created using the aforementioned technique.

Example (of a failed attempt to create an array of primitive type):

```java
class Utilities {
  @SuppressWarnings("unchecked")
  public static <T> T[] slice(T[] src, Class<T> type, int start, int length) {
    T[] result = (T[])Array.newInstance(type,length);
    System.arraycopy(src, start, result, 0, length);
    return result;
  }
}
class Test {
  public static void main(String[] args) {
    double[] avg = new double[]{1.0, 2.0, 3.0};
    double[] res = Utilities.slice(avg, double.class , 0, 2); // error
  }
}
```

```txt
error: <T>slice(T[],java.lang.Class<T>,int,int) cannot be applied to (double[],java.lang.Class<java.lang.Double>,int,int)
        double[] res = Utilities.slice(avg, double.class, 0, 2);
                       ^
```

Since primitive types are not permitted as type arguments, we cannot invoke the `slice` method using `double.class` as the type token. The compiler would have to infer `T:=double`, which is not permitted because `double` is a primitive type and cannot be used as the type argument of a generic method. The `slice` method can only create **arrays of reference type** elements, which means that we have to convert back and forth between `double[]` and `Double[]` in the example.

Example (of a successful attempt to create an array of reference type):

```java
class Test {
  public static void main(String[] args) {
        double[] avg = new double[]{1.0, 2.0, 3.0};
        Double[] avgdup = new Double[avg.length];
        for (int i=0; i<avg.length;i++) avgdup[i] = avg[i];  // auto-boxing
        Double[] tmp = Utilities.slice(avgdup, Double.class , 0, 2);  // fine
        avg = new double[tmp.length];
        for (int i=0; i<tmp.length;i++) avg[i] = tmp[i];     // auto-unboxing
  }
}
```

## How do I perform a runtime type check whose target type is a type parameter?

Using reflection.

The type information that is provided by a type parameter is static type information that is no longer available at runtime.  It does not permit any generic type checks.

Consider a method that is supposed to extract from a sequence of objects of arbitrary types all elements of a particular type. Such a method must at runtime check for a match between the type of each element in the sequence and the specific type that it is looking for.  This type check cannot be performed by means on the type parameter.

Example (of failed generic type check based on static type information):

```java
class Utilities {
  public static <T> Collection<T> extract(Collection<?> src) {
    HashSet<T> dest = new HashSet<T>();
    for (Object o : src)
      if (o instanceof T )     // error
         dest.add( (T) o);      // unchecked warning
    return dest;
  }
}

public static void test(Collection<?> coll) {
  Collection<Integer> coll = Utilities. <Integer> extract(coll);
}
```

Type parameters are not permitted in `instanceof` expressions and the `cast` to the type parameter is nonsensical, because it is a cast to type `Object` after type erasure.

For a type check at runtime we must explicitly provide runtime type information so that we can perform the type check and cast by means of reflection. The type information is best supplied by means of a Class object.

Example (of generic type check based on runtime type information):

```java
class Utilities {
  public static <T> Collection<T> extract(Collection<?> src, Class<T> type) {
    HashSet<T> dest = new HashSet<T>();
    for (Object o : src)
      if ( type.isInstance(o) )
         dest.add( type.cast(o) );
    return dest;
  }
}

public static void test(Collection<?> coll) {
  Collection<Integer> coll = Utilities.extract(coll, Integer.class );
}
```
