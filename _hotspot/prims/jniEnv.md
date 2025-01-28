---
title: "JNIEnv"
sequence: "101"
---

## load Library

调用JNI的时候，通常使用`System.loadLibrary()`方法加载JNI Library，
同样也可以使用`System.load()`方法加载JNI Library，
两者的区别是一个只需要设置库的名字，比如如果动态链接库的名称为`libA.so`，则只要输入`A`就可以了，
而`libA.so`的位置可以通过设置`java.library.path`或者`sun.boot.library.path`指定，
而`System.load()`方法需要输入完整路经的文件名。



