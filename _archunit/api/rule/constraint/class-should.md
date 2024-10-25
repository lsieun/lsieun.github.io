---
title: "Class Should"
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
                 │                                    ┌─── beAssignableFrom()
                 │                  ┌─── from ────────┤
                 │                  │                 └─── notBeAssignableFrom()
                 │                  │
                 │                  │                 ┌─── beAssignableTo()
                 │                  ├─── to ──────────┤
                 │                  │                 └─── notBeAssignableTo()
                 ├─── hierarchy ────┤
                 │                  │                 ┌─── implement()
                 │                  ├─── interface ───┤
                 │                  │                 └─── notImplement()
                 │                  │
                 │                  │                 ┌─── be()
                 │                  └─── class ───────┤
                 │                                    └─── notBe()
                 │
                 │                                    ┌─── haveModifier()
                 │                  ┌─── mod ─────────┤
                 │                  │                 └─── notHaveModifier()
                 │                  │
                 │                  │                 ┌─── bePublic()
                 │                  ├─── public ──────┤
                 │                  │                 └─── notBePublic()
                 │                  │
                 │                  │                 ┌─── beProtected()
                 ├─── modifier ─────┼─── protected ───┤
                 │                  │                 └─── notBeProtected()
                 │                  │
                 │                  │                 ┌─── bePackagePrivate()
                 │                  ├─── package ─────┤
                 │                  │                 └─── notBePackagePrivate()
                 │                  │
                 │                  │                 ┌─── bePrivate()
                 │                  └─── private ─────┤
                 │                                    └─── notBePrivate()
                 │
                 │                                                   ┌─── haveSimpleName()
                 │                                 ┌─── equals ──────┤
                 │                                 │                 └─── notHaveSimpleName()
                 │                                 │
                 │                                 │                 ┌─── haveSimpleNameContaining()
                 │                                 ├─── contain ─────┤
                 │                                 │                 └─── haveSimpleNameNotContaining()
                 │                  ┌─── simple ───┤
                 │                  │              │                 ┌─── haveSimpleNameStartingWith()
                 │                  │              ├─── startWith ───┤
                 │                  │              │                 └─── haveSimpleNameNotStartingWith()
                 │                  │              │
                 │                  │              │                 ┌─── haveSimpleNameEndingWith()
                 ├─── name ─────────┤              └─── endWith ─────┤
                 │                  │                                └─── haveSimpleNameNotEndingWith()
                 │                  │
                 │                  │              ┌─── haveFullyQualifiedName()
                 │                  │              │
                 │                  │              ├─── notHaveFullyQualifiedName()
                 │                  └─── full ─────┤
                 │                                 ├─── haveNameMatching()
                 │                                 │
                 │                                 └─── haveNameNotMatching()
                 │
                 │                                    ┌─── beEnums()
                 │                  ┌─── enum ────────┤
                 │                  │                 └─── notBeEnums()
                 │                  │
                 │                  │                 ┌─── beInterfaces()
                 ├─── type ─────────┼─── interface ───┤
                 │                  │                 └─── notBeInterfaces()
                 │                  │
                 │                  │                 ┌─── beRecords()
                 │                  └─── record ──────┤
ClassesShould ───┤                                    └─── notBeRecords()
                 │
                 │                  ┌─── constructor ───┼─── haveOnlyPrivateConstructors()
                 │                  │
                 │                  │                                ┌─── getField()
                 │                  │                   ┌─── get ────┤
                 │                  │                   │            └─── getFieldWhere()
                 │                  │                   │
                 ├─── member ───────┼─── fields ────────┤            ┌─── setField()
                 │                  │                   ├─── set ────┤
                 │                  │                   │            └─── setFieldWhere()
                 │                  │                   │
                 │                  │                   └─── have ───┼─── haveOnlyFinalFields()
                 │                  │
                 │                  └─── number ────────┼─── containNumberOfElements()
                 │
                 │                                ┌─── accessClassesThat()
                 │                                │
                 │                  ┌─── class ───┼─── onlyAccessClassesThat()
                 │                  │             │
                 │                  │             └─── onlyAccessMembersThat()
                 │                  │
                 │                  │             ┌─── accessField()
                 ├─── access ───────┤             │
                 │                  ├─── field ───┼─── onlyAccessFieldsThat()
                 │                  │             │
                 │                  │             └─── accessFieldWhere()
                 │                  │
                 │                  │             ┌─── accessTargetWhere()
                 │                  └─── other ───┤
                 │                                └─── onlyBeAccessed()
                 │
                 │                                      ┌─── callConstructor()
                 │                                      │
                 │                  ┌─── constructor ───┼─── callConstructorWhere()
                 │                  │                   │
                 │                  │                   └─── onlyCallConstructorsThat()
                 │                  │
                 │                  │                   ┌─── callMethod()
                 ├─── call ─────────┤                   │
                 │                  ├─── method ────────┼─── callMethodWhere()
                 │                  │                   │
                 │                  │                   └─── onlyCallMethodsThat()
                 │                  │
                 │                  │                   ┌─── onlyCallCodeUnitsThat()
                 │                  └─── code.unit ─────┤
                 │                                      └─── callCodeUnitWhere()
                 │
                 │                  ┌─── dependOnClassesThat()
                 │                  │
                 │                  ├─── onlyDependOnClassesThat()
                 ├─── depend ───────┤
                 │                  ├─── onlyHaveDependentClassesThat()
                 │                  │
                 │                  └─── transitivelyDependOnClassesThat()
                 │
                 │                  ┌─── beAnnotatedWith()
                 │                  │
                 │                  ├─── notBeAnnotatedWith()
                 ├─── annotation ───┤
                 │                  ├─── beMetaAnnotatedWith()
                 │                  │
                 │                  └─── notBeMetaAnnotatedWith()
                 │
                 │                                    ┌─── beLocalClasses()
                 │                  ┌─── local ───────┤
                 │                  │                 └─── notBeLocalClasses()
                 │                  │
                 │                  │                 ┌─── beMemberClasses()
                 │                  ├─── member ──────┤
                 │                  │                 └─── notBeMemberClasses()
                 │                  │
                 │                  │                 ┌─── beNestedClasses()
                 │                  ├─── nest ────────┤
                 │                  │                 └─── notBeNestedClasses()
                 └─── nest ─────────┤
                                    │                 ┌─── beTopLevelClasses()
                                    ├─── top ─────────┤
                                    │                 └─── notBeTopLevelClasses()
                                    │
                                    │                 ┌─── beInnerClasses()
                                    ├─── inner ───────┤
                                    │                 └─── notBeInnerClasses()
                                    │
                                    │                 ┌─── beAnonymousClasses()
                                    └─── anonymous ───┤
                                                      └─── notBeAnonymousClasses()
```
