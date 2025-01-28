---
title: "C# Intro"
sequence: "901"
---

## How does DllImport really work?

- [How does DllImport really work?](https://stackoverflow.com/questions/14471571/how-does-dllimport-really-work)

It uses two core winapi functions.

First is `LoadLibrary()`, the winapi function that loads a DLL into a process.
It uses the name you specified for the DLL.

Second is `GetProcAddress()`, the winapi function that returns the address of a function in a DLL.
It uses the name of the function you specified.

Then some plumbing runs that builds a stack frame for the function call,
using the arguments you specified and it calls the function at the address it found.

So yes, this is very dynamic. 
This doesn't happen until your code actually lands on a statement that calls the pinvoked function.
The technical term is "late binding" as opposed to the more common early binding used by the Windows loader for native code.

## Library Handling

- Windows DLL Search Path
- Linux Shared Library Search Path

- [Interop with Native Libraries](https://www.mono-project.com/docs/advanced/pinvoke/)

## Reference

- [Interoperability (C# Programming Guide)](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/interop/)
- [Using in, out, and ref with Parameters in C#](https://www.pluralsight.com/guides/csharp-in-out-ref-parameters)

