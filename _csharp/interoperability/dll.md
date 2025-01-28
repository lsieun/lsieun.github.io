---
title: "Dynamic Link library (DLL)"
sequence: "903"
---

A Dynamic Link library (DLL) is a library that contains functions and codes that can be used by more than one program at a time.
Once we have created a DLL file, we can use it in many applications.

## Difference between normal DLL and .Net DLL

- [Difference between normal DLL and .Net DLL](http://net-informations.com/faq/net/dll.htm)

### What is .Net dll ?

When you implement a `.Net` DLL (Assembly) in `.NET` Languages such as C# or VB.NET you produce a Managed Assembly.
Managed Assembly is the component standard specified by the `.NET`.
Hence, `.Net` assemblies are understandable only to Microsoft.NET and can be used only in `.NET` managed applications.
A manage assembly contains managed code and it is executing by the `.NET` Runtime.

### normal DLL

When you create a DLL with C++ you produce a win32/Com DLL.
If you use this dll in a `.NET` Language, the Visual Studio create automatically an INTEROP file for you,
so you can call the "unmanaged" dll from manage code .

### 从使用角度来说

For using a `.Net` DLL (Assembly), the simplest option is to copy the dll to the bin folder.
Normal DLL files are need to be register with the "regsvr32" tool.

## Reference

- [Creating and Using DLL (Class Library) in C#](https://www.c-sharpcorner.com/UploadFile/1e050f/creating-and-using-dll-class-library-in-C-Sharp/)



