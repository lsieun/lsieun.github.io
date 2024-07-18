---
title: "Predefined Annotations"
sequence: "133"
---

Besides using the **predefined annotations**,
Byte Buddy allows you to define your own annotations by registering one or several `ParameterBinder`s.

There are several more predefined annotations that can be used with a `MethodDelegation` that we only want to name briefly.
If you want to read more about these annotations, you can find further information in the in-code documentation.
These annotations are:



## @StubValue

`@StubValue`: With this annotation, the annotated parameter is injected a stub value of the intercepted method.

For reference-return-types and `void` methods, the value `null` is injected.
For methods that return a primitive value, the equivalent boxing type of 0 is injected.

This can be helpful in combination when defining a generic interceptor that returns a `Object` type
while using a `@RuntimeType` annotation.

By returning the injected value, the method behaves as a stub while correctly considering primitive return types.



## @FieldProxy

@FieldProxy: Using this annotation, Byte Buddy injects an accessor for a given field.
The accessed field can either be specified explicitly by its name or it is derived from a getter or setter methods name,
in case that the intercepted method represents such a method.

Before this annotation can be used, it needs to be installed and registered explicitly, similarly to the @Pipe annotation.



## @SuperMethod

@SuperMethod: This annotation can only be used on parameter types that are assignable from Method.

The assigned method is set to be a synthetic accessor method that allows for the invocation of the original code.

Note that using this annotation causes a public accessor to be created for the proxy class
that allows for the outside invocation of the super method without passing a security manager.

## @DefaultMethod

@DefaultMethod: Similar to `@SuperMethod` but for a default method call.
The default method is invoked on a unique type if there is only one possibility for a default method invocation.

Otherwise, a type can be specified explicitly as an annotation property.
