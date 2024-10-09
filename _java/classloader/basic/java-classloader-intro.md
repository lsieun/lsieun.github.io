---
title: "ClassLoader"
sequence: "101"
---

Java class loaders are used to load classes at runtime.
`ClassLoader` in Java works on three principles: **delegation**, **visibility**, and **uniqueness**.

- The **delegation principle** forward request of class loading to parent class loader and
  only loads the class if the parent is not able to find or load the class.
- The **visibility principle** allows the child class loader to see all the classes loaded by the parent ClassLoader,
  but the parent class loader can not see classes loaded by a child.
- The **uniqueness principle** allows one to load a class exactly once,
  which is basically achieved by **delegation** and ensures that child `ClassLoader` doesn't reload the class already loaded by a parent.

Correct understanding of class loader is a must to resolve issues like `NoClassDefFoundError` in Java and `java.lang.ClassNotFoundException`, which is related to class loading.


Every Java program has at least three class loaders:

- The bootstrap class loader
- The extension class loader
- The system class loader (sometimes also called the application class loader)


在Inside JVM2当中，还提到了active use（主动使用）和被动使用

## Reference

stackoverflow: 在stackoverflow上会遇到哪些问题呢？

- [stackoverflow: classloader](https://stackoverflow.com/questions/tagged/classloader)
- [★★★How ClassLoader Works in Java](https://javarevisited.blogspot.com/2012/12/how-classloader-works-in-java.html)，它链接了许多文章，我觉得有价值，但是要注意，它的链接域名过时了，需要修改成新的域名地址
- [Understanding the Java Virtual Machine: Class Loading and Reflection](https://www.pluralsight.com/courses/understanding-java-vm-class-loading-reflection)
- [Class loaders](https://www.ibm.com/docs/en/was-zos/9.0.5?topic=loading-class-loaders)
- [Classloaders Demystified](https://www.theserverside.com/tutorial/Classloaders-Demystified-Understanding-How-Java-Classes-Get-Loaded-in-Web-Applications)
- [Demystify Java Class Loading](https://dzone.com/articles/demystify-java-class-loading)
- [ClassLoader Class - Class Loaders](http://www.herongyang.com/JVM/ClassLoader-Class-Loader.html)

- [How Classes are Found](https://docs.oracle.com/javase/8/docs/technotes/tools/findingclasses.html)


