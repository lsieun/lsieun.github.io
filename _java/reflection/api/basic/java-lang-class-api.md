---
title: "Class"
sequence: "102"
---

## Basic

```text
              ┌─── static ───────┼─── classloader ───┼─── forName()
              │
              │                                                           ┌─── getModifiers()
              │                                      ┌─── modifier ───────┤
              │                                      │                    └─── isSynthetic()
              │                                      │
              │                                      │                    ┌─── getName()
              │                                      │                    │
              │                                      │                    ├─── getTypeName()
              │                                      ├─── clasname ───────┤
              │                                      │                    ├─── getSimpleName()
              │                                      │                    │
              │                                      │                    └─── getCanonicalName()
              │                                      │
              │                                      │                    ┌─── getSuperclass()
              │                                      │                    │
              │                                      ├─── superclass ─────┼─── getAnnotatedSuperclass()
              │                                      │                    │
              │                                      │                    └─── getGenericSuperclass()
              │                                      │
              │                                      │                    ┌─── getInterfaces()
              │                                      │                    │
              │                                      ├─── interfaces ─────┼─── getAnnotatedInterfaces()
              │                                      │                    │
              │                                      │                    └─── getGenericInterfaces()
              │                                      │
              │                                      │                    ┌─── getField()
              │                                      │                    │
              │                                      │                    ├─── getFields()
              │                                      ├─── fields ─────────┤
              │                                      │                    ├─── getDeclaredField()
              │                                      │                    │
              │                                      │                    └─── getDeclaredFields()
              │                                      │
              │                                      │                    ┌─── getConstructor()
              │                                      │                    │
              │                                      │                    ├─── getConstructors()
              │                                      ├─── constructors ───┤
              │                  ┌─── classfile ─────┤                    ├─── getDeclaredConstructor()
              │                  │                   │                    │
              │                  │                   │                    └─── getDeclaredConstructors()
              │                  │                   │
              │                  │                   │                    ┌─── getMethod()
              │                  │                   │                    │
              │                  │                   │                    ├─── getMethods()
              │                  │                   ├─── methods ────────┤
Class::api ───┤                  │                   │                    ├─── getDeclaredMethod()
              │                  │                   │                    │
              │                  │                   │                    └─── getDeclaredMethods()
              │                  │                   │
              │                  │                   │                                                ┌─── isAnnotationPresent()
              │                  │                   │                                                │
              │                  │                   │                                                ├─── getAnnotation()
              │                  │                   │                                                │
              │                  │                   │                                                ├─── getAnnotations()
              │                  │                   │                                                │
              │                  │                   │                    ┌─── annotation ────────────┼─── getAnnotationsByType()
              │                  │                   │                    │                           │
              │                  │                   │                    │                           ├─── getDeclaredAnnotation()
              │                  │                   │                    │                           │
              │                  │                   │                    │                           ├─── getDeclaredAnnotations()
              │                  │                   │                    │                           │
              │                  │                   │                    │                           └─── getDeclaredAnnotationsByType()
              │                  │                   │                    │
              │                  │                   │                    │                           ┌─── getClasses()
              │                  │                   │                    │                           │
              │                  │                   │                    │                           ├─── getDeclaredClasses()
              │                  │                   │                    │                           │
              │                  │                   │                    │                           ├─── getDeclaringClass()
              │                  │                   │                    │                           │
              │                  │                   │                    ├─── InnerClasses ──────────┼─── getEnclosingClass()
              │                  │                   │                    │                           │
              │                  │                   │                    │                           ├─── isLocalClass()
              │                  │                   │                    │                           │
              │                  │                   └─── attributes ─────┤                           ├─── isAnonymousClass()
              │                  │                                        │                           │
              │                  │                                        │                           └─── isMemberClass()
              │                  │                                        │
              │                  │                                        │                           ┌─── getNestMembers()
              │                  │                                        ├─── NestMembers ───────────┤
              │                  │                                        │                           └─── isNestmateOf()
              │                  │                                        │
              │                  │                                        ├─── NestHost ──────────────┼─── getNestHost()
              │                  │                                        │
              │                  │                                        │                           ┌─── getEnclosingConstructor()
              │                  │                                        ├─── EnclosingMethod ───────┤
              │                  │                                        │                           └─── getEnclosingMethod()
              │                  │                                        │
              │                  │                                        │                           ┌─── isSealed()
              │                  │                                        ├─── PermittedSubclasses ───┤
              │                  │                                        │                           └─── getPermittedSubclasses()
              │                  │                                        │
              │                  │                                        │                           ┌─── isRecord()
              └─── non-static ───┤                                        └─── Record ────────────────┤
                                 │                                                                    └─── getRecordComponents()
                                 │
                                 │                   ┌─── primitive ────┼─── isPrimitive()
                                 │                   │
                                 │                   ├─── interface ────┼─── isInterface()
                                 │                   │
                                 │                   ├─── annotation ───┼─── isAnnotation()
                                 │                   │
                                 │                   │                  ┌─── isEnum()
                                 │                   ├─── enum ─────────┤
                                 ├─── type ──────────┤                  └─── getEnumConstants()
                                 │                   │
                                 │                   │                  ┌─── toGenericString()
                                 │                   ├─── generic ──────┤
                                 │                   │                  └─── getTypeParameters()
                                 │                   │
                                 │                   │                  ┌─── isArray()
                                 │                   │                  │
                                 │                   └─── array ────────┼─── become ──────┼─── arrayType()
                                 │                                      │
                                 │                                      │                 ┌─── componentType()
                                 │                                      └─── is ──────────┤
                                 │                                                        └─── getComponentType()
                                 │
                                 │                   ┌─── getClassLoader()
                                 │                   │
                                 ├─── classloader ───┼─── getResource()
                                 │                   │
                                 │                   └─── getResourceAsStream()
                                 │
                                 │                   ┌─── asSubclass()
                                 ├─── hierarchy ─────┤
                                 │                   └─── isAssignableFrom()
                                 │
                                 │                   ┌─── isInstance()
                                 │                   │
                                 ├─── instance ──────┼─── cast()
                                 │                   │
                                 │                   └─── newInstance()
                                 │
                                 │                   ┌─── describeConstable()
                                 ├─── descriptor ────┤
                                 │                   └─── descriptorString()
                                 │
                                 ├─── assertion ─────┼─── desiredAssertionStatus()
                                 │
                                 │                   ┌─── getModule()
                                 │                   │
                                 ├─── belong ────────┼─── getPackage()
                                 │                   │
                                 │                   └─── getPackageName()
                                 │
                                 ├─── security ──────┼─── getProtectionDomain()
                                 │
                                 │                   ┌─── getSigners()
                                 └─── other ─────────┤
                                                     └─── isHidden()
```

```text
         ┌─── module ────────┼─── getModule()
         │
         │                   ┌─── getPackage()
         ├─── package ───────┤
         │                   └─── getPackageName()
         │
         │                   ┌─── getSuperclass()
         ├─── super ─────────┤
         │                   └─── getGenericSuperclass()
         │
         │                   ┌─── isInterface()
         │                   │
         ├─── interface ─────┼─── getInterfaces()
         │                   │
         │                   └─── getGenericInterfaces()
         │
         │                   ┌─── getName()
         │                   │
         │                   ├─── getSimpleName()
         ├─── name ──────────┤
         │                   ├─── getTypeName()
         │                   │
         │                   └─── getCanonicalName()
Class ───┤
         ├─── modifier ──────┼─── getModifiers()
         │
         │                   ┌─── getFields()
         │                   │
         │                   ├─── getField(String name)
         ├─── field ─────────┤
         │                   ├─── getDeclaredFields()
         │                   │
         │                   └─── getDeclaredField(String name)
         │
         │                   ┌─── getConstructors()
         │                   │
         │                   ├─── getConstructor(Class<?>... parameterTypes)
         ├─── constructor ───┤
         │                   ├─── getDeclaredConstructors()
         │                   │
         │                   └─── getDeclaredConstructor(Class<?>... parameterTypes)
         │
         │
         │                   ┌─── getMethods()
         │                   │
         │                   ├─── getMethod(String name, Class<?>... parameterTypes)
         └─── method ────────┤
                             ├─── getDeclaredMethods()
                             │
                             └─── getDeclaredMethod(String name, Class<?>... parameterTypes)
```

## API

### hierarchy

```text
                    ┌─── module ───────┼─── getModule()
                    │
                    │                  ┌─── getPackage()
                    ├─── package ──────┤
                    │                  └─── getPackageName()
                    │
                    │                  ┌─── getSuperclass()
                    ├─── super ────────┤
Class::hierarchy ───┤                  └─── getGenericSuperclass()
                    │
                    │                  ┌─── isInterface()
                    │                  │
                    ├─── interface ────┼─── getInterfaces()
                    │                  │
                    │                  └─── getGenericInterfaces()
                    │
                    │                  ┌─── isAssignableFrom(Class<?> cls)
                    └─── compatible ───┤
                                       └─── asSubclass(Class<U> clazz)
```

### member

```text
                                                      ┌─── getName()
                                                      │
                                                      ├─── getTypeName()
                                     ┌─── name ───────┤
                                     │                ├─── getSimpleName()
                                     │                │
                 ┌─── class info ────┤                └─── getCanonicalName()
                 │                   │
                 │                   │                ┌─── getModifiers()
                 │                   └─── modifier ───┤
                 │                                    └─── isSynthetic
                 │
                 │                   ┌─── getFields()
                 │                   │
                 │                   ├─── getDeclaredFields()
                 ├─── field ─────────┤
                 │                   ├─── getField(String name)
                 │                   │
Class::member ───┤                   └─── getDeclaredField(String name)
                 │
                 │                   ┌─── getConstructors()
                 │                   │
                 │                   ├─── getDeclaredConstructors()
                 ├─── constructor ───┤
                 │                   ├─── getConstructor(Class<?>... parameterTypes)
                 │                   │
                 │                   └─── getDeclaredConstructor(Class<?>... parameterTypes)
                 │
                 │                   ┌─── getMethods()
                 │                   │
                 │                   ├─── getDeclaredMethods()
                 └─── method ────────┤
                                     ├─── getMethod(String name, Class<?>... parameterTypes)
                                     │
                                     └─── getDeclaredMethod(String name, Class<?>... parameterTypes)
```


### type

```text
               ┌─── primitive ────┼─── isPrimitive()
               │
               ├─── interface ────┼─── isInterface()
               │
               │                  ┌─── isEnum()
               ├─── enum ─────────┤
               │                  └─── getEnumConstants()
               │
               │                  ┌─── getNestHost()
               │                  │
               ├─── nested ───────┼─── getNestMembers()
               │                  │
               │                  └─── isNestmateOf(Class<?> c)
               │
               │                                 ┌─── getClasses()
               │                  ┌─── outer ────┤
               │                  │              └─── getDeclaredClasses()
               │                  │
               │                  │                                          ┌─── isMemberClass()
               ├─── inner ────────┤              ┌─── common ────────────────┤
               │                  │              │                           └─── getDeclaringClass()
               │                  │              │
               │                  │              ├─── static nested class
               │                  │              │
               │                  └─── member ───┤                                                   ┌─── getEnclosingClass()
               │                                 │                                                   │
               │                                 │                           ┌─── common ────────────┼─── getEnclosingMethod()
               │                                 │                           │                       │
               │                                 │                           │                       └─── getEnclosingConstructor()
               │                                 └─── inner class ───────────┤
               │                                                             ├─── local class ───────┼─── isLocalClass()
               │                                                             │
               │                                                             └─── anonymous class ───┼─── isAnonymousClass()
               │
               │                  ┌─── type variable ───┼─── getTypeParameters()
               │                  │
               ├─── generic ──────┼─── super ───────────┼─── getGenericSuperclass()
Class::type ───┤                  │
               │                  └─── str ─────────────┼─── toGenericString()
               │
               │                  ┌─── is ──────────┼─── isAnnotation()
               │                  │
               │                  │                                  ┌─── getAnnotation(Class<A> annotationClass)
               │                  │                                  │
               │                  │                 ┌─── single ─────┼─── getDeclaredAnnotation(Class<A> annotationClass)
               │                  │                 │                │
               │                  │                 │                └─── isAnnotationPresent(Class<? extends Annotation> annotationClass)
               │                  ├─── has ─────────┤
               ├─── annotation ───┤                 │                ┌─── getAnnotationsByType(Class<A> annotationClass)
               │                  │                 │                │
               │                  │                 │                ├─── getDeclaredAnnotationsByType(Class<A> annotationClass)
               │                  │                 └─── multiple ───┤
               │                  │                                  ├─── getAnnotations()
               │                  │                                  │
               │                  │                                  └─── getDeclaredAnnotations()
               │                  │
               │                  │                 ┌─── getAnnotatedSuperclass()
               │                  └─── hierarchy ───┤
               │                                    └─── getAnnotatedInterfaces()
               │
               │                  ┌─── isRecord()
               ├─── record ───────┤
               │                  └─── getRecordComponents()
               │
               │                  ┌─── isSealed()
               ├─── sealed ───────┤
               │                  └─── getPermittedSubclasses()
               │
               ├─── hidden ───────┼─── isHidden()
               │
               │                             ┌─── isArray()
               │                             │
               │                  ┌─── is ───┼─── getComponentType()
               │                  │          │
               └─── array ────────┤          └─── componentType()
                                  │
                                  └─── to ───┼─── arrayType()
```

### classLoader

```text
                      ┌─── loader ─────┼─── getClassLoader()
                      │
                      │                ┌─── forName(String className)
                      │                │
                      ├─── load ───────┼─── forName(String name, boolean initialize, ClassLoader loader)
                      │                │
                      │                └─── forName(Module module, String name)
Class::classloader ───┤
                      │                ┌─── getResourceAsStream(String name)
                      ├─── resource ───┤
                      │                └─── getResource(String name)
                      │
                      ├─── security ───┼─── getProtectionDomain()
                      │
                      └─── signer ─────┼─── getSigners()
```

### instance

```text
                   ┌─── new ────┼─── newInstance()
                   │
Class::instance ───┼─── is ─────┼─── isInstance(Object obj)
                   │
                   └─── cast ───┼─── cast(Object obj)
```



### classfile

```text
                                       ┌─── descriptorString()
Class::classfile ───┼─── descriptor ───┤
                                       └─── describeConstable()
```

