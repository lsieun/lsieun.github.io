---
title: "deep reflection"
sequence: "101"
---

One important use case for reflection has always been to break into APIs
by accessing nonpublic types, methods, and fields.
This is called **deep reflection**.

For deep reflection, you need to do nothing more that call `setAccessible(true)`
on a `Method`, `Constructor`, or `Field` instance before using it:

One challenge when migrating to the **module system** is that it takes away **reflection's superpowers**,
meaning calls to `setAccessible` are much more likely to fail.

## Two Things

There are two things you can do using reflection:

- Describe an entity
- Access the members of an entity

**Describing an entity** means knowing the entity's details.
For example, describing a class means
knowing its name, modifiers, packages, modules, fields, methods, and constructors.

**Accessing the members of an entity** means reading and writing fields and invoking methods and constructors.

### access control

**Describing an entity** does not pose any issues of access control.
If you have access to a class file,
you should be able to know the details of the entity represented in that class file.

However, **accessing members of an entity** is controlled by the Java language access control.
For example, if you declare a field of a class as private, the field should be accessible only within the class.
Code outside the class should not be able to access the private field of the class.
However, this is half-true.
The Java language **access control** rules are applied when you access members statically.
The access control rules can be suppressed when you access members using reflection.

## deep reflection

Java has been allowing access to rather inaccessible members
such as a private field of a class outside the class using reflection.
This is called **deep reflection**.
Reflective access to inaccessible members made it possible to have many great frameworks in Java
such as Hibernate and Spring.
These frameworks perform most of their work using deep reflection.

### JDK 9

Before JDK9, accessing inaccessible members was easy.
All you had to do was call the `setAccessible(true)` method
on the inaccessible `Field`, `Method`, and `Constructor` objects before accessing them.
The introduction of the module system in JDK9 has made deep reflection a bit complicated.

### security manager

Note: If a **security manager** is present, the code performing deep reflection must
have a `ReflectPermission("suppressAccessChecks")` permission.

### AccessibleObject

To perform deep reflection, you need to get the reference of the desired field,
method, and constructor using the `getDeclaredXxx()` method of the `Class` object,
where `Xxx` can be `Field`, `Method`, or `Constructor`.

Note that using the `getXxx()` method to get the reference of an inaccessible field, method, or constructor
will throw an `IllegalAccessException`.

The `Field`, `Method`, and `Constructor` classes have the `AccessibleObject` class as their superclass.

The `AccessibleObject` class contains the following methods to let you work with the accessible flag:

- void setAccessible(boolean flag)
- static void setAccessible(AccessibleObject[] array, boolean flag)
- boolean trySetAccessible()
- boolean canAccess(Object obj)

The `setAccessible(boolean flag)` method sets the accessible flag for a member
(`Field`, `Method`, and `Constructor`) to `true` or `false`.
If you are trying to access an inaccessible member,
you need to call `setAccessible(true)` on the member object before accessing the member.
The method throws an `InaccessibleObjectException`
if the accessible flag cannot be set.

The static `setAccessible(AccessibleObject[] array, boolean flag)` is a convenience method
to set the accessible flag for all `AccessibleObject` in the specified array.

The `trySetAccessible()` method attempts to set the accessible flag to `true`
on the object on which it is called.
It returns `true` if the accessible flag was set to `true` and `false` otherwise.
Compare this method with the `setAccessible(true)` method.
This method does not throw a runtime exception on failure, whereas the `setAccessible(true)` does.

The `canAccess(Object obj)` method returns `true`
if the caller can access the member for the specified `obj` object.
Otherwise, it returns `false`.
If the member is a static member or a constructor, the `obj` must be `null`.

## Within a Module

Access to inaccessible members of a class is handled through the **Java security manager**.

By default, when you run your application on your computer,
the **security manager** is not installed for your application.
The absence of the security manager for your application
lets you access all fields, methods, and constructors of a class in the same module
after you set the accessible flag to `true`.

However, if a **security manager** is installed for your application,
whether you can access an inaccessible class member depends on the permission
granted to your application to access such members.

You can check if the **security manager** is installed for your application or not by using the following piece of code:

```text
SecurityManager smgr = System.getSecurityManager();
if (smgr == null) {
    System.out.println("Security manager is not installed.");
}
```

You can install a default security manager by passing the `-Djava.security.manager` option on the command line
when you run the Java application.
The **security manager** uses a Java security policy file to enforce the rules specified in that policy file.
The Java security policy file is specified using the `-Djava.security.policy` command-line option.

```text
java -Djava.security.manager -Djava.security.policy=conf\myjava.policy
--module-path build\modules\jdojo.reflection --module jdojo.reflection/com.jdojo.reflection.IllegalAccess2
```

The `myjava.policy` file is empty when this command was run,
which means that the application did not have permission to suppress the Java language access control.

Contents of the `conf\myjava.policy` File:

```text
grant {
    // Grant permission to all programs to access inaccessible members
    permission java.lang.reflect.ReflectPermission "suppressAccessChecks";
};
```

```text
java -Djava.security.manager -Djava.security.policy=conf\myjava.policy
--module-path build\modules\jdojo.reflection --module jdojo.reflection/com.jdojo.reflection.IllegalAccess2
```

## Across Modules

## Unnamed Modules

All packages in an unnamed module are open to all other modules.
Therefore, you can always perform deep reflection on types in unnamed modules.

## JDK Modules







