---
title: "JNA VS JNI"
sequence: "105"
---

Java Native Access (JNA) and Java Native Interface (JNI) are two frameworks
that allow Java to directly call C-style functions located in executable libraries,
such as Windows Dynamic Link Libraries (DLLs).
Very often the Java code seeks to directly access functions inside of the WIN32 API.

## Performance

Though JNA and JNI both accomplish similar goals, there are some important differences.
JNI has much better performance than JNA. However, JNA is much easier to work with than JNI.
