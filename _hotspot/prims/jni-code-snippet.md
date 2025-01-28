---
title: "JNI Code"
sequence: "101"
---

## JNI_CreateJavaVM

- `JNI_CreateJavaVM(JavaVM **vm, void **penv, void *args)`
  - `JNI_CreateJavaVM_inner(vm, penv, args)`

注意：`vm`和`env`是在`JNI_CreateJavaVM`函数中实现赋值。

```text
// src/hotspot/share/prims/jni.cpp

jint JNI_CreateJavaVM(JavaVM **vm, void **penv, void *args) {
    jint result = JNI_ERR;
    result = JNI_CreateJavaVM_inner(vm, penv, args);
    return result;
}
```

## JNI_CreateJavaVM_inner

```text
static jint JNI_CreateJavaVM_inner(JavaVM **vm, void **penv, void *args) {
    jint result = JNI_ERR;

    bool can_try_again = true;

    result = Threads::create_vm((JavaVMInitArgs *) args, &can_try_again);

    return result;
}
```






