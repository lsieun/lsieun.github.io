---
title: "Member Should"
sequence: "102"
---

## MembersShould

```text
                                    ┌─── beDeclaredIn()
                                    │
                 ┌─── class ────────┼─── notBeDeclaredIn()
                 │                  │
                 │                  └─── beDeclaredInClassesThat()
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
                 │                                 ┌─── haveName()
                 │                                 │
                 │                                 ├─── notHaveName()
                 │                                 │
                 │                                 ├─── haveNameContaining()
                 │                                 │
MembersShould ───┤                                 ├─── haveNameNotContaining()
                 │                                 │
                 │                                 ├─── haveNameStartingWith()
                 │                  ┌─── simple ───┤
                 │                  │              ├─── haveNameNotStartingWith()
                 │                  │              │
                 │                  │              ├─── haveNameEndingWith()
                 │                  │              │
                 │                  │              ├─── haveNameNotEndingWith()
                 │                  │              │
                 ├─── name ─────────┤              ├─── haveNameMatching()
                 │                  │              │
                 │                  │              └─── haveNameNotMatching()
                 │                  │
                 │                  │              ┌─── haveFullName()
                 │                  │              │
                 │                  │              ├─── notHaveFullName()
                 │                  └─── full ─────┤
                 │                                 ├─── haveFullNameMatching()
                 │                                 │
                 │                                 └─── haveFullNameNotMatching()
                 │
                 │                  ┌─── beAnnotatedWith()
                 │                  │
                 │                  ├─── notBeAnnotatedWith()
                 ├─── annotation ───┤
                 │                  ├─── beMetaAnnotatedWith()
                 │                  │
                 │                  └─── notBeMetaAnnotatedWith()
                 │
                 └─── number ───────┼─── containNumberOfElements()
```

## FieldsShould

```text
                                                ┌─── beFinal()
                                 ┌─── final ────┤
                                 │              └─── notBeFinal()
                ┌─── modifier ───┤
                │                │              ┌─── beStatic()
                │                └─── static ───┤
                │                               └─── notBeStatic()
                │
FieldsShould ───┤                ┌─── haveRawType()
                ├─── type ───────┤
                │                └─── notHaveRawType()
                │
                │                ┌─── beAccessedByMethodsThat()
                └─── access ─────┤
                                 └─── notBeAccessedByMethodsThat()
```

## CodeUnitsShould

```text
                                     ┌─── haveRawParameterTypes()
                   ┌─── param ───────┤
                   │                 └─── notHaveRawParameterTypes()
                   │
                   │                 ┌─── haveRawReturnType()
                   ├─── return ──────┤
CodeUnitsShould ───┤                 └─── notHaveRawReturnType()
                   │
                   │                 ┌─── declareThrowableOfType()
                   ├─── exception ───┤
                   │                 └─── notDeclareThrowableOfType()
                   │
                   └─── invoke ──────┼─── onlyBeCalled()
```

## MethodsShould

```text
                                                 ┌─── beFinal()
                                  ┌─── final ────┤
                                  │              └─── notBeFinal()
MethodsShould ───┼─── modifier ───┤
                                  │              ┌─── beStatic()
                                  └─── static ───┤
                                                 └─── notBeStatic()
```
