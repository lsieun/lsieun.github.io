---
title: "Explicit Modules, Automatic Modules and Unnamed Module"
sequence: "103"
---

the difference between **automatic modules** and **explicit modules** when it comes to reading **the unnamed module**.

- An **explicit module** can read only other **explicit modules**, and **automatic modules**.
- An **automatic module** reads **all modules** including the **unnamed module**.

![](/assets/images/java/module/explicit-automatic-unnamed-module.png)

The readability to the **unnamed module** is only a mechanism to facilitate **automatic modules**
in a mixed classpath/module path migration scenario. 

The classpath is not completely gone yet.
All JARs (modular or not) and classes on the **classpath** will be contained in the **Unnamed Module**.
Similar to **automatic modules**, it exports all packages and reads all other modules.
But it does not have a name, obviously.
For that reason, it cannot be required and read by **named application modules**.
The **unnamed module** in turn can access **all other modules**.

## Unnamed Module

### ClassLoader

Every `ClassLoader` has **its own unnamed module** that it uses to represent classes that it loaded from the class path.
This is necessary because the module system requires everything to be in a module.

