---
title:  "Data Flow Analysis"
sequence: "402"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

## Basic data flow analysis

The `BasicInterpreter` class is one of the predefined subclass of the `Interpreter` abstract class.
It simulates the effect of bytecode instructions by using seven sets of values, defined in the `BasicValue` class:

- `UNINITIALIZED_VALUE` means "all possible values".
- `INT_VALUE` means "all int, short, byte, boolean or char values".
- `FLOAT_VALUE` means "all float values".
- `LONG_VALUE` means "all long values".
- `DOUBLE_VALUE` means "all double values".
- `REFERENCE_VALUE` means "all object and array values".
- `RETURNADDRESS_VALUE` is used for subroutines 

This interpreter is not very useful in itself,
but it can be used as an "empty" `Interpreter` implementation in order to construct an `Analyzer`.
This analyzer can then be used to detect unreachable code in a method.
Indeed, even by following both branches in jumps instructions,
it is not possible to reach code that cannot be reached from the first instruction.
The consequence is that, after an analysis, and whatever the `Interpreter` implementation,
the computed frames – returned by the `Analyzer.getFrames` method – are `null` for instructions that cannot be reached.
This property can be used to implement a `RemoveDeadCodeAdapter` class very easily
(there are more efficient ways, but they require writing more code):

```java
public class HelloWorld {
    public void test(boolean flag) {
        Object obj = null;
        if (flag) {
            obj = "10";
        }
        int hash = obj.hashCode();
        System.out.println(hash);
    }
}
```

