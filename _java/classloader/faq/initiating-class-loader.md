---
title: "Initiating ClassLoader and Defining ClassLoader"
sequence: "109"
---

To better visualize the parent-delegation model,
imagine a Java application creates a user-defined class loader named `Grandma`.
Because the application passes `null` to `Grandma`'s constructor,
`Grandma`'s parent is set to the **bootstrap class loader**.
Time passes.
Sometime later, the application creates another class loader named `Mom`.
Because the application passes to `Mom`'s constructor a reference to `Grandma`,
`Mom`'s parent is set to the user-defined class loader referred to affectionately as `Grandma`.
More time passes.
At some later time, the application creates a class loader named, `Cindy`.
Because the application passes to `Cindy`'s constructor a reference to `Mom`,
`Cindy`'s parent is set to the user-defined class loader referred to as `Mom`.

```text
bootstrap class loader --> Grandma --> Mom --> Cindy
```

Now imagine the application asks `Cindy` to load a type named `java.io.FileReader`.
When a class that follows the parent delegation model loads a type,
it first delegates to its parent -- it asks its parent to try and load the type.
Its parent, in turn, asks its parent, which first asks its parent, and so on.
The delegation continues all the way up to the end-point of the parent-delegation chain,
which is usually the **bootstrap class loader**.
Thus, the first thing `Cindy` does is ask `Mom` to load the type.
The first thing `Mom` does is ask `Grandma` to load the type.
And the first thing `Grandma` does is ask the **bootstrap class loader** to load the type.
In this case, the **bootstrap class loader** is able to load (or already has loaded) the type,
and returns the `Class` instance representing `java.io.FileReader` to `Grandma`.
`Grandma` passes this `Class` reference back to `Mom`,
who passes it back to `Cindy`, who returns it to the application.

举个例子，来说明 parent delegation model 是如何工作的。


Note that given **delegation** between **class loaders**, **the class loader that initiates loading** is not necessarily **the class loader that actually defines the type**.

For example, the application initially asked `Cindy` to load the type,
but ultimately, the **bootstrap class loader** defined the type.

In Java terminology, a class loader that is asked to load a type,
but returns a type loaded by some other class loader, is called an **initiating class loader** of that type.
The class loader that actually defines the type is called the **defining class loader** for the type.

In the previous example, therefore, the **defining class loader** for `java.io.FileReader` is the **bootstrap class loader**.
Class `Cindy` is an **initiating class loader**, but so are `Mom`, `Grandma`, and even the **bootstrap class loader**.

Any class loader that is asked to load a type and is able to return a reference to the `Class` instance
representing the type is an **initiating loader** of that type.

这里讲述 initiating class loader 和 defining class loader 这两个概念。

For another example, imagine the application asks `Cindy` to load a type named `com.artima.knitting.QuiltPattern`.
`Cindy` delegates to `Mom`, who delegates to `Grandma`, who delegates to the **bootstrap class loader**.
In this case, however, the **bootstrap class loader** is unable to load the type.
So control returns back to `Grandma`, who attempts to load the type in her custom way.
Because `Grandma` is responsible for loading standard extensions,
and the `com.artima.knitting` package is wisely installed in a JAR file in the standard extensions directory,
`Grandma` is able to load the type.
`Grandma` defines the type and returns the `Class` instance representing `com.artima.knitting.QuiltPattern` to Mom.
`Mom` passes this `Class` reference back to `Cindy`, who returns it to the application.
In this example, `Grandma` is the **defining loader** of the `com.artima.knitting.QuiltPattern` type.
`Cindy`, `Mom`, and `Grandma` -- but not the **bootstrap class loader** -- are initiating class loaders for the type.

进一步举例说明 initiating class loader 和 defining class loader 两者的区别。
