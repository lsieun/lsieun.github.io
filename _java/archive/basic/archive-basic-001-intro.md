---
title: "Intro"
sequence: "101"
---

## What Is an Archive File?

An archive file consists of **one or more files**.
It also contains **metadata** that may include the directory structure of the files,
comments, error detection and recovery information, etc.

An archive file may also be encrypted.
Typically, but not necessarily, an archive file is stored in a compressed format.

An archive file is created using file archiver software.
For example, the WinZip, 7-zip, etc.
Utilities are used to create a file archive in a ZIP format on Microsoft Windows;
the `tar` utility is used to create archive files on UNIX-based operating systems.
An archive file makes it easier to store and transmit multiple files as one file.

This chapter discusses in detail **how to work with archive files using the Java I/O API** and
**the `jar` command-line utility** that is included in the JDK.

That goes back to the fundamental interpretation of **what JARs are**: **mere containers**.
Java doesn't recognize them as first-class citizens like packages and types,
so it has no representation at run time that sees them as anything more than just Zip files.

> Jar的本质是 container
