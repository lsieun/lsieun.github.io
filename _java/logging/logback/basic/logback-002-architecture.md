---
title: "Logback Architecture"
sequence: "102"
---

[UP](/java/java-logging-index.html)


## Logback Architecture

- Logback Architecture
    - Logger
    - Appender
    - Layout

The Logback architecture comprises three classes: `Logger`, `Appender`, and `Layout`.

A `Logger` is a context for log messages. This is the class that applications interact with to create log messages.

`Appender`s place log messages in their final destinations.
A Logger can have more than one Appender.
We generally think of `Appender`s as being attached to text files, but Logback is much more potent than that.

`Layout` prepares messages for outputting.
Logback supports the creation of custom classes for formatting messages,
as well as robust configuration options for the existing ones.
