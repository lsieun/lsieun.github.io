---
title:  "Method Analysis"
sequence: "401"
---

[上级目录]({% link _posts/2021-05-01-java-asm-season-03.md %})

A **data flow analysis** consists in computing the state of the execution frames of a method, for each instruction of this method.
This state can be represented in a more or less abstract way.
For example reference values can be represented by a single value, by one value per class,
by three possible values in the `{ null, not null, may be null }` set, etc.

A **control flow analysis** consists in computing the control flow graph of a method, and in performing analyses on this graph.
The control flow graph is a graph whose nodes are instructions,
and whose oriented edges connect two instructions `i → j` if `j` can be executed just after `i`.

## Data flow analyses

Two types of data flow analyses can be performed:

- a **forward analysis** computes, for each instruction, the state of the execution frame after this instruction, from the state before its execution.
- a **backward analysis** computes, for each instruction, the state of the execution frame before this instruction, from the state after its execution.

The ASM API for code analysis is in the `org.objectweb.asm.tree.analysis` package.
As the package name implies, it is based on the tree API.
In fact, this package provides a framework for doing **forward data flow analyses**.

In order to be able to perform various data flow analyses,
with more or less precise sets of values,
the **data flow analysis algorithm** is split in two parts:
**one is fixed and is provided by the framework**,
**the other is variable and provided by users**. More precisely:

- The overall data flow analysis algorithm, and the task of popping from the stack, and pushing back to the stack, the appropriate number of values, is implemented once and for all in the `Analyzer` and `Frame` classes.
- The task of combining values and of computing unions of value sets is performed by user defined subclasses of the `Interpreter` and `Value` abstract classes. Several predefined subclasses are provided.

- Analyzer
    - Frame
    - Interpreter

Although the primary goal of the framework is to perform **data flow analyses**,
the `Analyzer` class can also construct the **control flow graph** of the analysed method.
This can be done by overriding the `newControlFlowEdge` and `newControlFlowExceptionEdge` methods of this class, which by default do nothing.
The result can be used for doing **control flow analyses**.

## Control flow analyses


