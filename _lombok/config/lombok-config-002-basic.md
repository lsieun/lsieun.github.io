---
title: "配置内容：基础配置"
sequence: "102"
---

[UP](/lombok.html)

## config.stopBubbling

**The `config.stopBubbling` property tells the configuration system
not to search for config files in the parent directories.**
It's a good practice to add this property to the root of your workspace or project.
By default, its value is `false`.

```text
config.stopBubbling = true
```

## Global Config Keys

Global config keys are configurations that may affect many of the configuration systems themselves.

### addConstructorProperties

The first key we'll discuss is `lombok.anyConstructor.addConstructorProperties`.
It adds the `@java.beans.ConstructorProperties` annotation to all constructors with arguments.
Usually, frameworks that use reflection on constructors need this annotation to map properties and
know the correct order of the params in the constructor.
Here is the code in the Lombok version:

