---
title: "Unnamed Modules"
sequence: "103"
---

Java 9 has a strict constraint on how types can be accessed across module boundaries.
If you are creating a brand-new application targeting Java 9, then you should use the new module system.
However, Java 9 still supports running all applications written prior to Java 9.
This is done with the help of the **unnamed modules**.

When the module system needs to load a type whose package is not defined in any module,
it will try to load it from the **class path**.
If the type is loaded successfully,
then this type is considered to be a member of a special module called the **unnamed module**.
**The unnamed module is special because it reads all other named modules and exports all of its packages.**

When a type is loaded from the class path,
it can access exported types of all other **named modules**,
including built-in **platform modules**.
For Java 8 applications, all types of this application are loaded from the class path,
so they are all in the same **unnamed module** and have no issues accessing each other.
The application can also access **platform modules**.
That's why Java 8 applications can run on Java 9 without changes.

The **unnamed module** exports all of its packages,
but code in other **named modules** cannot access types in the **unnamed module**,
and you cannot use `requires` to declare the dependency—there is no name for you to use to reference it.
This constraint is necessary; otherwise we lose all the benefits of the module system
and go back to the dark old days of messy class path.
**The unnamed module is designed purely for backward compatibility.**
**If a package is defined in both a named and unnamed module,
the package in the unnamed module is ignored.**
Unexpected duplicate packages in the class path won't interfere with the code in other named modules.






