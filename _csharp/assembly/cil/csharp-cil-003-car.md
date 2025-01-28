---
title: "Building a .NET Assembly with CIL"
sequence: "103"
---

## Building CILCars.dll

File: `CILCars.il`

```text
.assembly extern mscorlib
{
  .publickeytoken = (B7 7A 5C 56 19 34 E0 89 )
  .ver 4:0:0:0
}

.assembly extern System.Windows.Forms
{
  .publickeytoken = (B7 7A 5C 56 19 34 E0 89 )
  .ver 4:0:0:0
}

// Define the single-file assembly.
.assembly CILCars
{
  .hash algorithm 0x00008004
  .ver 1:0:0:0
}

.module CILCars.dll

.namespace CILCars {
  .class public auto ansi beforefieldinit CILCar
    extends [mscorlib]System.Object
  {
    .field public string petName
    .field public int32 currSpeed

    .method public hidebysig specialname rtspecialname
      instance void .ctor(int32 c, string p) cil managed
    {
      .maxstack 8

      ldarg.0
      call instance void [mscorlib]System.Object::.ctor()

      ldarg.0
      ldarg.1
      stfld int32 CILCars.CILCar::currSpeed

      ldarg.0
      ldarg.2
      stfld string CILCars.CILCar::petName

      ret
    }
  }

  .class public auto ansi beforefieldinit CILCarInfo
    extends [mscorlib]System.Object
  {
    .method public hidebysig static void
      Display(class CILCars.CILCar c) cil managed
    {
      .maxstack 8

      .locals init([0] string caption)

      ldstr "{0}'s speed is:"
      ldarg.0
      ldfld string CILCars.CILCar::petName
      call string [mscorlib]System.String::Format(string,object)
      stloc.0

      ldarg.0
      ldflda int32 CILCars.CILCar::currSpeed
      call instance string [mscorlib]System.Int32::ToString()

      ldloc.0
      call valuetype [System.Windows.Forms]
          System.Windows.Forms.DialogResult
          [System.Windows.Forms]
          System.Windows.Forms.MessageBox::Show(string, string)
      pop
      ret
    }
  }
}
```

```text
>ilasm /dll CILCars.il

Microsoft (R) .NET Framework IL Assembler.  Version 4.8.9105.0
Copyright (c) Microsoft Corporation.  All rights reserved.
Assembling 'CILCars.il'  to DLL --> 'CILCars.dll'
Source file is UTF-8

Assembled method CILCars.CILCar::.ctor
Assembled method CILCars.CILCarInfo::Display
Creating PE file

Emitting classes:
Class 1:        CILCars.CILCar
Class 2:        CILCars.CILCarInfo

Emitting fields and methods:
Global
Class 1 Fields: 2;      Methods: 1;
Class 2 Methods: 1;
Resolving local member refs: 4 -> 4 defs, 0 refs, 0 unresolved

Emitting events and properties:
Global
Class 1
Class 2
Resolving local member refs: 0 -> 0 defs, 0 refs, 0 unresolved
Writing PE file
Operation completed successfully
```

```text
>peverify CILCars.dll

Microsoft (R) .NET Framework PE Verifier.  Version  4.0.30319.0
Copyright (c) Microsoft Corporation.  All rights reserved.

All Classes and Methods in CILCars.dll Verified.
```

## Building CILCarClient.exe

File: `CarClient.il`

```text
.assembly extern mscorlib
{
  .publickeytoken = (B7 7A 5C 56 19 34 E0 89)
  .ver 4:0:0:0
}

.assembly extern CILCars
{
  .ver 1:0:0:0
}

.assembly CarClient
{
  .hash algorithm 0x00008004
  .ver 1:0:0:0
}

.module CarClient.exe

.namespace CarClient {
  .class private auto ansi beforefieldinit Program
    extends [mscorlib]System.Object
  {
    .method private hidebysig static void
      Main(string[] args) cil managed
    {
      .entrypoint
      .maxstack 8

      .locals init ([0] class [CILCars]CILCars.CILCar myCilCar)
      
      ldc.i4 55
      ldstr "Junior"

      newobj instance void [CILCars]CILCars.CILCar::.ctor(int32, string)
      stloc.0

      ldloc.0
      call void [CILCars]CILCars.CILCarInfo::Display(class [CILCars]CILCars.CILCar)
      ret
    }
  }
}
```

```text
>ilasm CarClient.il

Microsoft (R) .NET Framework IL Assembler.  Version 4.8.9105.0
Copyright (c) Microsoft Corporation.  All rights reserved.
Assembling 'CarClient.il'  to EXE --> 'CarClient.exe'
Source file is UTF-8

Assembled method CarClient.Program::Main
Creating PE file

Emitting classes:
Class 1:        CarClient.Program

Emitting fields and methods:
Global
Class 1 Methods: 1;

Emitting events and properties:
Global
Class 1
Writing PE file
Operation completed successfully
```

```text
>peverify CarClient.exe

Microsoft (R) .NET Framework PE Verifier.  Version  4.0.30319.0
Copyright (c) Microsoft Corporation.  All rights reserved.

All Classes and Methods in CarClient.exe Verified.
```

```text
>CarClient.exe
```
