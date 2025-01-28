---
title: "CIL Example"
sequence: "102"
---

File: `HelloProgram.cs`

```csharp
using System;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello CIL Code!");
        Console.ReadLine();
    }
}
```

```text
using System;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello CIL Code!");
        Console.ReadLine();
    }
}
```

```text
.assembly extern System.Windows.Forms
{
  .publickeytoken = (B7 7A 5C 56 19 34 E0 89 )
  .ver 4:0:0:0
}
```

```text
  .method private hidebysig static void  Main(string[] args) cil managed
  {
    .entrypoint
    .maxstack  8

    ldstr      "CIL is way cool!"
    call       valuetype [System.Windows.Forms]System.Windows.Forms.DialogResult [System.Windows.Forms]System.Windows.Forms.MessageBox::Show(string)
    pop
    ret
  }
```

```text
ilasm /exe HelloProgram.il /output=NewAssembly.exe
```

```text
>ilasm /exe HelloProgram.il /output=NewAssembly.exe

Microsoft (R) .NET Framework IL Assembler.  Version 4.8.9105.0
Copyright (c) Microsoft Corporation.  All rights reserved.
Assembling 'HelloProgram.il'  to EXE --> 'NewAssembly.exe'
Source file is UTF-8

Assembled method Program::Main
Assembled method Program::.ctor
Creating PE file

Emitting classes:
Class 1:        Program

Emitting fields and methods:
Global
Class 1 Methods: 2;

Emitting events and properties:
Global
Class 1
Writing PE file
Operation completed successfully
```

```text
>peverify NewAssembly.exe

Microsoft (R) .NET Framework PE Verifier.  Version  4.0.30319.0
Copyright (c) Microsoft Corporation.  All rights reserved.

All Classes and Methods in NewAssembly.exe Verified.
```

```text
.assembly extern mscorlib
{
  .publickeytoken = (B7 7A 5C 56 19 34 E0 89 )
  .ver 4:0:0:0
}

// Our assembly
.assembly CILTypes
{
  .ver 1:0:0:0
}

// The module of our single-file assembly
.module CILTypes.dll

// Our assembly has a single namespace.
.namespace MyNamespace {
  // An interface definition.
  .class public interface IMyInterface {}

  .class public interface IMyOtherInterface
    implements MyNamespace.IMyInterface {}

  // System.Object base class assumed
  .class public MyBaseClass {}

  .class public MyDerivedClass
    extends MyNamespace.MyBaseClass
    implements MyNamespace.IMyInterface {}

  .class public sealed MyStruct
    extends [mscorlib]System.ValueType {}

  .class public sealed MyEnum
    extends [mscorlib]System.Enum {}
}
```

```text
>ilasm /dll CILTypes.il

Microsoft (R) .NET Framework IL Assembler.  Version 4.8.9105.0
Copyright (c) Microsoft Corporation.  All rights reserved.
Assembling 'CILTypes.il'  to DLL --> 'CILTypes.dll'
Source file is UTF-8

Creating PE file

Emitting classes:
Class 1:        MyNamespace.IMyInterface
Class 2:        MyNamespace.IMyOtherInterface
Class 3:        MyNamespace.MyBaseClass
Class 4:        MyNamespace.MyDerivedClass
Class 5:        MyNamespace.MyStruct
Class 6:        MyNamespace.MyEnum

Emitting fields and methods:
Global
Class 1
Class 2
Class 3
Class 4
Class 5
Class 6

Emitting events and properties:
Global
Class 1
Class 2
Class 3
Class 4
Class 5
Class 6
Writing PE file
Operation completed successfullyp
```

```text
>peverify CILTypes.dll

Microsoft (R) .NET Framework PE Verifier.  Version  4.0.30319.0
Copyright (c) Microsoft Corporation.  All rights reserved.

[MD]: Error: Value class has neither fields nor size parameter. [token:0x02000006]
[MD]: Error: Value class has neither fields nor size parameter. [token:0x02000007]
[MD]: Error: Enum has no instance field. [token:0x02000007]
3 Error(s) Verifying CILTypes.dll
```

