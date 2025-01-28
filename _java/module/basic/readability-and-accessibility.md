---
title: "Readability And Accessibility"
sequence: "105"
---

关于readability和accessibility两者的区别：

- readability，是较大粒度（module）的概念，讲的是一个module对另一个module的读取（read）。
- accessibility，是较小粒度（class）的概念，讲的是一个class对于另一个class的的字段、方法的调用。

```text
member(field/method) ---> class ---> package ---> module
```

## Module Readability

### Readability: Connecting the pieces

**Modules** are the **atomic building blocks**: the **nodes** in a graph of interacting artifacts.
But there can be no graph without **edges** connecting the nodes!
This is where **readability** comes in, based on which the **module system** will create connections between nodes.

The connection between the **two modules** is called a **readability edge**, or **reads edge** for short.

### 构建Readability的三种方式

Whereas phrases like “customer requires bar” and “customer depends on bar” mirror
**a static, compile-time relationship** between customer and bar,
**readability** is its more **dynamic, run-time counterpart**.
Why is it more dynamic?
The `requires` directive is the primal originator of reads edges, but it's by no means the only one.
Others are command-line options (`--add-reads`) and the **reflection API**, both of which can be used to add more;
in the end, it's irrelevant.

```text
                      ┌─── source : 'requires' directive in module-info.java
                      │
Module Readability ───┼─── compile: '--add-reads' option for javac/java
                      │
                      └─── runtime: reflection API
```

Regardless of how **reads edges** come to be, their effects are always the same:
they're the basis for **reliable configuration** and **accessibility**.

- reads edges
  - reliable configuration
  - accessibility

## Module Accessibility

Three conditions that are the premise for accessibility:

- public type     （当前module），这里是类自身的Access Flag
- exported package（当前module），这里是在module-info.java中进行exports
- reading module   （外部module），这里应该是在它的module-info.java当中进行requires

For one, `public` is no longer `public`.
It's no longer possible to tell by looking at a type whether it will be visible outside of the module—
for that, it's necessary to check `module-info.java`.
Without `requires` directives, all types in a module are inaccessible to the outside.
Encapsulation is the new default!

## Strong Encapsulation

Combining **accessibility** and **readability** provides the **strong encapsulation** guarantees.

```text
strong encapsulation = accessibility + readability
```

The question of whether you can access a type from module `M2` in module `M1` becomes twofold:

- Does M1 read M2?
- If yes, is the type accessible in the package exported by M2?

Only `public` types in **exported packages** are accessible in other modules.

- If a type is in an **exported package** but not `public`, traditional accessibility rules block its use.
- If it is `public` but **not exported**, the module system's readability rules prevent its use.

Violations at compile-time result in a compiler error, whereas violations at run-time result in `IllegalAccessError`.

Another elephant in the room with regards to **accessibility** rules is **reflection**.
**Before the module system**, an interesting but dangerous method called `setAccessible` was available on all reflected objects.
By calling `setAccessible(true)`, any element (regardless of whether it is public or private) becomes accessible.
**After the module system**, This method is still available but now abides by the same rules as discussed previously.
It is no longer possible to invoke `setAccessible` on an arbitrary element exported from another module and expect it to work as before.
**Even reflection cannot break strong encapsulation.**

