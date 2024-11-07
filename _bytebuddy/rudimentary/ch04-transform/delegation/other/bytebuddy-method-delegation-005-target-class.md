---
title: "Target Class"
sequence: "105"
---

## Class

So far, we only delegated method invocations to static methods
by naming a specific class as in `MethodDelegation.to(Target.class)`.
It is however also possible to delegate to **instance methods or to constructors**:

## Instance

By calling `MethodDelegation.to(new Target())`,
it is possible to delegate method invocations to any of the instance methods of the `Target` class.

Note that this includes methods that are defined anywhere in the instance's class hierarchy,
including the methods that are defined in the `Object` class.

You might want to restrict the range of candidate methods
what is possible by applying a filter to a method delegation
by calling `filter(ElementMatcher)` on any `MethodDelegation`.

The `ElementMatcher` type is the same that was used before
for selecting source methods within Byte Buddy's domain specific language.

The `instance` which is the target of the method delegation is stored in a **static field**.
Similarly to the definition of fixed values, this requires the definition of a `TypeInitializer`.

## Any Field

Instead of storing a delegation in a **static field**,
you can alternatively define the use of any field by `MethodDelegation.toField(String)`
where the argument specifies a field name to which all method delegations are forwarded.

Always remember to assign a value to this field before calling methods on an instance of such a dynamic class.
Otherwise, a method delegation will result in a `NullPointerException`.

## construct instances

**A method delegation can be used to construct instances of a given type.**
By using `MethodDelegation.toConstructor(Class)`,
any invocation of an intercepted method returns a new instance of the given target type.

