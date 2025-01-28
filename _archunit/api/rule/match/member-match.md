---
title: "Member Match"
sequence: "102"
---

```text
               ┌─── FieldsThat
MembersThat ───┤
               └─── CodeUnitsThat ───┼─── MethodsThat
```

## MembersThat

```text
                                   ┌─── areDeclaredIn()
                                   │
               ┌─── class ─────────┼─── areNotDeclaredIn()
               │                   │
               │                   └─── areDeclaredInClassesThat()
               │
               │                                     ┌─── haveModifier()
               │                   ┌─── mod ─────────┤
               │                   │                 └─── doNotHaveModifier()
               │                   │
               │                   │                 ┌─── arePublic()
               │                   ├─── public ──────┤
               │                   │                 └─── areNotPublic()
               │                   │
               │                   │                 ┌─── areProtected()
               ├─── modifier ──────┼─── protected ───┤
               │                   │                 └─── areNotProtected()
               │                   │
               │                   │                 ┌─── arePackagePrivate()
               │                   ├─── package ─────┤
               │                   │                 └─── areNotPackagePrivate()
               │                   │
               │                   │                 ┌─── arePrivate()
               │                   └─── private ─────┤
               │                                     └─── areNotPrivate()
               │
               │                                     ┌─── haveName()
               │                                     │
               │                                     ├─── doNotHaveName()
MembersThat ───┤                                     │
               │                                     ├─── haveNameStartingWith()
               │                                     │
               │                                     ├─── haveNameNotStartingWith()
               │                                     │
               │                                     ├─── haveNameEndingWith()
               │                   ┌─── name ────────┤
               │                   │                 ├─── haveNameNotEndingWith()
               │                   │                 │
               │                   │                 ├─── haveNameContaining()
               │                   │                 │
               │                   │                 ├─── haveNameNotContaining()
               │                   │                 │
               ├─── member.name ───┤                 ├─── haveNameMatching()
               │                   │                 │
               │                   │                 └─── haveNameNotMatching()
               │                   │
               │                   │                 ┌─── haveFullName()
               │                   │                 │
               │                   │                 ├─── doNotHaveFullName()
               │                   └─── full.name ───┤
               │                                     ├─── haveFullNameMatching()
               │                                     │
               │                                     └─── haveFullNameNotMatching()
               │
               │                   ┌─── areAnnotatedWith()
               │                   │
               │                   ├─── areNotAnnotatedWith()
               └─── annotation ────┤
                                   ├─── areMetaAnnotatedWith()
                                   │
                                   └─── areNotMetaAnnotatedWith()
```

## FieldsThat

```text
                                              ┌─── areFinal()
                               ┌─── final ────┤
                               │              └─── areNotFinal()
              ┌─── modifier ───┤
              │                │              ┌─── areStatic()
              │                └─── static ───┤
FieldsThat ───┤                               └─── areNotStatic()
              │
              │                ┌─── haveRawType()
              └─── type ───────┤
                               └─── doNotHaveRawType()
```

## CodeUnitsThat

```text
                                     ┌─── haveRawParameterTypes()
                 ┌─── param ─────────┤
                 │                   └─── doNotHaveRawParameterTypes()
                 │
                 │                   ┌─── haveRawReturnType()
CodeUnitsThat ───┼─── return.type ───┤
                 │                   └─── doNotHaveRawReturnType()
                 │
                 │                   ┌─── declareThrowableOfType()
                 └─── exception ─────┤
                                     └─── doNotDeclareThrowableOfType()
```

## MethodsThat

```text
                                               ┌─── areFinal()
                                ┌─── final ────┤
                                │              └─── areNotFinal()
MethodsThat ───┼─── modifier ───┤
                                │              ┌─── areStatic()
                                └─── static ───┤
                                               └─── areNotStatic()
```

