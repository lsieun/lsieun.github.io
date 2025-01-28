---
title: "Class Match"
sequence: "101"
---

```text
                                  ┌─── resideInAPackage()
                                  │
                                  ├─── resideInAnyPackage()
               ┌─── package ──────┤
               │                  ├─── resideOutsideOfPackage()
               │                  │
               │                  └─── resideOutsideOfPackages()
               │
               │                                    ┌─── areAssignableFrom()
               │                  ┌─── from ────────┤
               │                  │                 └─── areNotAssignableFrom()
               │                  │
               │                  │                 ┌─── areAssignableTo()
               ├─── hierarchy ────┼─── to ──────────┤
               │                  │                 └─── areNotAssignableTo()
               │                  │
               │                  │                 ┌─── implement()
               │                  └─── interface ───┤
               │                                    └─── doNotImplement()
               │
               │                                    ┌─── haveModifier()
               │                  ┌─── mod ─────────┤
               │                  │                 └─── doNotHaveModifier()
               │                  │
               │                  │                 ┌─── arePublic()
               │                  ├─── public ──────┤
               │                  │                 └─── areNotPublic()
               │                  │
               │                  │                 ┌─── areProtected()
               ├─── modifier ─────┼─── protected ───┤
               │                  │                 └─── areNotProtected()
               │                  │
               │                  │                 ┌─── arePackagePrivate()
               │                  ├─── package ─────┤
               │                  │                 └─── areNotPackagePrivate()
               │                  │
               │                  │                 ┌─── arePrivate()
               │                  └─── private ─────┤
               │                                    └─── areNotPrivate()
               │
               │                                 ┌─── haveSimpleName()
               │                                 │
               │                                 ├─── doNotHaveSimpleName()
               │                                 │
               │                                 ├─── haveSimpleNameContaining()
               │                                 │
               │                                 ├─── haveSimpleNameNotContaining()
               │                  ┌─── simple ───┤
               │                  │              ├─── haveSimpleNameStartingWith()
               │                  │              │
               │                  │              ├─── haveSimpleNameNotStartingWith()
               │                  │              │
               │                  │              ├─── haveSimpleNameEndingWith()
               ├─── name ─────────┤              │
               │                  │              └─── haveSimpleNameNotEndingWith()
               │                  │
               │                  │              ┌─── haveFullyQualifiedName()
               │                  │              │
ClassesThat ───┤                  │              ├─── doNotHaveFullyQualifiedName()
               │                  └─── full ─────┤
               │                                 ├─── haveNameMatching()
               │                                 │
               │                                 └─── haveNameNotMatching()
               │
               │                  ┌─── containAnyMembersThat()
               │                  │
               │                  ├─── containAnyFieldsThat()
               │                  │
               │                  ├─── containAnyConstructorsThat()
               ├─── member ───────┤
               │                  ├─── containAnyStaticInitializersThat()
               │                  │
               │                  ├─── containAnyMethodsThat()
               │                  │
               │                  └─── containAnyCodeUnitsThat()
               │
               │                  ┌─── areAnnotatedWith()
               │                  │
               │                  ├─── areNotAnnotatedWith()
               ├─── annotation ───┤
               │                  ├─── areMetaAnnotatedWith()
               │                  │
               │                  └─── areNotMetaAnnotatedWith()
               │
               │                                     ┌─── areAnnotations()
               │                  ┌─── annotation ───┤
               │                  │                  └─── areNotAnnotations()
               │                  │
               │                  │                  ┌─── areEnums()
               │                  ├─── enum ─────────┤
               │                  │                  └─── areNotEnums()
               ├─── type ─────────┤
               │                  │                  ┌─── areInterfaces()
               │                  ├─── interface ────┤
               │                  │                  └─── areNotInterfaces()
               │                  │
               │                  │                  ┌─── areRecords()
               │                  └─── record ───────┤
               │                                     └─── areNotRecords()
               │
               │                                    ┌─── areAnonymousClasses()
               │                  ┌─── anonymous ───┤
               │                  │                 └─── areNotAnonymousClasses()
               │                  │
               │                  │                 ┌─── areInnerClasses()
               │                  ├─── inner ───────┤
               │                  │                 └─── areNotInnerClasses()
               │                  │
               │                  │                 ┌─── areLocalClasses()
               │                  ├─── local ───────┤
               │                  │                 └─── areNotLocalClasses()
               │                  │
               │                  │                 ┌─── areMemberClasses()
               └─── nested ───────┼─── member ──────┤
                                  │                 └─── areNotMemberClasses()
                                  │
                                  │                 ┌─── areNestedClasses()
                                  ├─── nested ──────┤
                                  │                 └─── areNotNestedClasses()
                                  │
                                  │                 ┌─── areTopLevelClasses()
                                  ├─── top ─────────┤
                                  │                 └─── areNotTopLevelClasses()
                                  │
                                  │                 ┌─── belongToAnyOf()
                                  └─── belong ──────┤
                                                    └─── doNotBelongToAnyOf()
```
