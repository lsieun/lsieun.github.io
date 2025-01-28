---
title: "HotSpot: Instrumentation.redefineClasses()"
sequence: "105"
---

## Instrumentation

### redefineClasses

```java
public interface Instrumentation {
    void redefineClasses(ClassDefinition... definitions)
            throws  ClassNotFoundException, UnmodifiableClassException;
}
```

## InstrumentationImpl

`sun.instrument.InstrumentationImpl`

```java
public class InstrumentationImpl implements Instrumentation {
    public void redefineClasses(ClassDefinition... definitions) throws ClassNotFoundException {
        if (!isRedefineClassesSupported()) {
            throw new UnsupportedOperationException("redefineClasses is not supported in this environment");
        }
        if (definitions == null) {
            throw new NullPointerException("null passed as 'definitions' in redefineClasses");
        }
        for (int i = 0; i < definitions.length; ++i) {
            if (definitions[i] == null) {
                throw new NullPointerException("element of 'definitions' is null in redefineClasses");
            }
        }
        if (definitions.length == 0) {
            return; // short-circuit if there are no changes requested
        }

        redefineClasses0(mNativeAgent, definitions);
    }

    private native void redefineClasses0(long nativeAgent, ClassDefinition[] definitions) throws ClassNotFoundException;
}
```

这是InstrumentationImpl中的redefineClasses实现，该方法的具体实现依赖一个Native方法redefineClasses()，我们可以在libinstrument中找到这个Native方法的实现：

## InstrumentationImplNativeMethods.c

`src/java.instrument/share/native/libinstrument/InstrumentationImplNativeMethods.c`

```text
/*
 * Class:     sun_instrument_InstrumentationImpl
 * Method:    redefineClasses0
 * Signature: ([Ljava/lang/instrument/ClassDefinition;)V
 */
JNIEXPORT void JNICALL Java_sun_instrument_InstrumentationImpl_redefineClasses0
  (JNIEnv * jnienv, jobject implThis, jlong agent, jobjectArray classDefinitions) {
    redefineClasses(jnienv, (JPLISAgent*)(intptr_t)agent, classDefinitions);
}
```

redefineClasses这个函数的实现比较复杂，代码很长。下面是一段关键的代码片段：

## JPLISAgent.c

```text
/*
 *  Java code must not call this with a null list or a zero-length list.
 */
void redefineClasses(JNIEnv * jnienv, JPLISAgent * agent, jobjectArray classDefinitions) {
    jvmtiEnv*   jvmtienv                        = jvmti(agent);
    jboolean    errorOccurred                   = JNI_FALSE;
    jclass      classDefClass                   = NULL;
    jmethodID   getDefinitionClassMethodID      = NULL;
    jmethodID   getDefinitionClassFileMethodID  = NULL;
    jvmtiClassDefinition* classDefs             = NULL;
    jbyteArray* targetFiles                     = NULL;
    jsize       numDefs                         = 0;

    jplis_assert(classDefinitions != NULL);

    // 获取classDefinitions数组的长度
    numDefs = (*jnienv)->GetArrayLength(jnienv, classDefinitions);

    /* get method IDs for methods to call on class definitions */
    classDefClass = (*jnienv)->FindClass(jnienv, "java/lang/instrument/ClassDefinition");

    // 获取ClassDefinition.getDefinitionClass()方法
    getDefinitionClassMethodID = (*jnienv)->GetMethodID(jnienv, classDefClass, "getDefinitionClass", "()Ljava/lang/Class;");

    // 获取ClassDefinition.getDefinitionClassFile()方法
    getDefinitionClassFileMethodID = (*jnienv)->GetMethodID(jnienv, classDefClass, "getDefinitionClassFile", "()[B");

    // 为classDefs数组分配内存空间
    classDefs = (jvmtiClassDefinition *) allocate(jvmtienv, numDefs * sizeof(jvmtiClassDefinition));

    /*
     * We have to save the targetFile values that we compute
     * so that we can release the class_bytes arrays that are returned by GetByteArrayElements().
     * In case of a JNI error, we can't (easily) recompute the targetFile values
     * and we still want to free any memory we allocated.
     */
    targetFiles = (jbyteArray *) allocate(jvmtienv, numDefs * sizeof(jbyteArray));


    int i, j;

    // clear classDefs so we can correctly free memory during errors
    memset(classDefs, 0, numDefs * sizeof(jvmtiClassDefinition));

    // 进行for循环，为classDefs数组里的元素赋值
    for (i = 0; i < numDefs; i++) {
        jclass classDef = NULL;

        // 获取第i个值：从jobjectArray类型转换成jclass类型
        classDef = (*jnienv)->GetObjectArrayElement(jnienv, classDefinitions, i);

        // 调用ClassDefinition.getDefinitionClass()方法，返回Class<?>类型
        classDefs[i].klass = (*jnienv)->CallObjectMethod(jnienv, classDef, getDefinitionClassMethodID);

        // 调用ClassDefinition.getDefinitionClassFile()方法，返回byte[]类型
        targetFiles[i] = (*jnienv)->CallObjectMethod(jnienv, classDef, getDefinitionClassFileMethodID);

        // 获取上一步byte[]的长度
        classDefs[i].class_byte_count = (*jnienv)->GetArrayLength(jnienv, targetFiles[i]);
        
        /*
         * Allocate class_bytes last so we don't have to free memory on a partial row error.
         */
        classDefs[i].class_bytes = (unsigned char *) (*jnienv)->GetByteArrayElements(jnienv, targetFiles[i], NULL);
    }

    // 调用RedefineClasses方法，对classDefs进行转换
    (*jvmtienv)->RedefineClasses(jvmtienv, numDefs, classDefs);


    /*
     * Cleanup memory that we allocated above.
     */
    for (j = 0; j < i; j++) {
        if ((jbyte *) classDefs[j].class_bytes != NULL) {
            (*jnienv)->ReleaseByteArrayElements(jnienv, targetFiles[j], (jbyte *) classDefs[j].class_bytes, 0 /* copy back and free */);
        }
    }
    deallocate(jvmtienv, (void *) targetFiles);
    deallocate(jvmtienv, (void *) classDefs);
}
```

## jvmtiEnv.cpp

`src/hotspot/share/prims/jvmtiEnv.cpp`

```text
// class_count - pre-checked to be greater than or equal to 0
// class_definitions - pre-checked for NULL
jvmtiError
JvmtiEnv::RedefineClasses(jint class_count, const jvmtiClassDefinition* class_definitions) {
    // 主要关注点
    VM_RedefineClasses op(class_count, class_definitions, jvmti_class_load_kind_redefine);
    VMThread::execute(&op);
    
    // 后续处理
    EventRedefineClasses event;
    jvmtiError error = op.check_error();
    if (error == JVMTI_ERROR_NONE) {
        event.set_classCount(class_count);
        event.set_redefinitionId(op.id());
        event.commit();
    }
    return error;
}
```

重定义类的请求会被JVM包装成一个`VM_RedefineClasses`类型的`VM_Operation`，`VM_Operation`是JVM内部的一些操作的基类，包括GC操作等。
`VM_Operation`由`VMThread`来执行，新的`VM_Operation`操作会被添加到`VMThread`的运行队列中去，
`VMThread`会不断从队列里面拉取`VM_Operation`并调用其`doit`等函数执行具体的操作。
`VM_RedefineClasses`函数的流程较为复杂，下面是VM_RedefineClasses的大致流程：

## jvmtiRedefineClasses.cpp

`src/hotspot/share/prims/jvmtiRedefineClasses.cpp`


