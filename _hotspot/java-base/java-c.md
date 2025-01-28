---
title: "java.c"
sequence: "101"
---

## JavaMain

```text
int JavaMain(void* _args)
{
    JavaMainArgs *args = (JavaMainArgs *)_args;
    int argc = args->argc;
    char **argv = args->argv;
    int mode = args->mode;
    char *what = args->what;
    InvocationFunctions ifn = args->ifn;

    JavaVM *vm = 0;
    JNIEnv *env = 0;
    int ret = 0;


    // 第一步，初始化虚拟机
    InitializeJVM(&vm, &env, &ifn);

    // 第二步，获取应用程序主类
    jclass mainClass = LoadMainClass(env, mode, what);

    // 第三步，获取main方法
    jmethodID mainID = (*env)->GetStaticMethodID(env, mainClass, "main", "([Ljava/lang/String;)V");

    // 第四步，执行main方法
    /* Build platform specific argument array */
    jobjectArray mainArgs = CreateApplicationArgs(env, argv, argc);
    (*env)->CallStaticVoidMethod(env, mainClass, mainID, mainArgs);

    // 第五步，与主线程断开
    (*vm)->DetachCurrentThread(vm);

    // 第六步，销毁JVM
    (*vm)->DestroyJavaVM(vm);

    return ret;
}
```

## InitializeJVM

```text
static jboolean InitializeJVM(JavaVM **pvm, JNIEnv **penv, InvocationFunctions *ifn)
{
    JavaVMInitArgs args;
    jint r;

    memset(&args, 0, sizeof(args));
    args.version  = JNI_VERSION_1_2;
    args.nOptions = numOptions;
    args.options  = options;
    args.ignoreUnrecognized = JNI_FALSE;
    
    // 主要关注点
    r = ifn->CreateJavaVM(pvm, (void **)penv, &args);
    JLI_MemFree(options);
    return r == JNI_OK;
}
```
