---
title: "HotSpot"
sequence: "710"
---

## load

### JVMTI: klassFactory.cpp

```text
InstanceKlass* KlassFactory::create_from_stream(ClassFileStream* stream,
                                                Symbol* name,
                                                ClassLoaderData* loader_data,
                                                const ClassLoadInfo& cl_info,
                                                TRAPS) {
  assert(stream != NULL, "invariant");
  assert(loader_data != NULL, "invariant");

  ResourceMark rm(THREAD);
  HandleMark hm(THREAD);

  JvmtiCachedClassFileData* cached_class_file = NULL;

  ClassFileStream* old_stream = stream;

  // increment counter
  THREAD->statistical_info().incr_define_class_count();

  // Skip this processing for VM hidden classes
  if (!cl_info.is_hidden()) {
    stream = check_class_file_load_hook(stream,
                                        name,
                                        loader_data,
                                        cl_info.protection_domain(),
                                        &cached_class_file,
                                        CHECK_NULL);
  }

  ClassFileParser parser(stream,
                         name,
                         loader_data,
                         &cl_info,
                         ClassFileParser::BROADCAST, // publicity level
                         CHECK_NULL);

  const ClassInstanceInfo* cl_inst_info = cl_info.class_hidden_info_ptr();
  InstanceKlass* result = parser.create_instance_klass(old_stream != stream, *cl_inst_info, CHECK_NULL);
  assert(result != NULL, "result cannot be null with no pending exception");

  if (cached_class_file != NULL) {
    // JVMTI: we have an InstanceKlass now, tell it about the cached bytes
    result->set_cached_class_file(cached_class_file);
  }

  JFR_ONLY(ON_KLASS_CREATION(result, parser, THREAD);)

#if INCLUDE_CDS
  if (Arguments::is_dumping_archive()) {
    ClassLoader::record_result(THREAD, result, stream, old_stream != stream);
  }
#endif // INCLUDE_CDS

  return result;
}



static ClassFileStream* check_class_file_load_hook(ClassFileStream* stream,
                                                   Symbol* name,
                                                   ClassLoaderData* loader_data,
                                                   Handle protection_domain,
                                                   JvmtiCachedClassFileData** cached_class_file,
                                                   TRAPS) {

  assert(stream != NULL, "invariant");

  if (JvmtiExport::should_post_class_file_load_hook()) {
    const JavaThread* jt = THREAD;

    Handle class_loader(THREAD, loader_data->class_loader());

    // Get the cached class file bytes (if any) from the class that is being redefined or retransformed.
    // We use jvmti_thread_state() instead of JvmtiThreadState::state_for(jt)
    // so we don't allocate a JvmtiThreadState any earlier than necessary.
    // This will help avoid the bug described by 7126851.

    JvmtiThreadState* state = jt->jvmti_thread_state();

    if (state != NULL) {
      Klass* k = state->get_class_being_redefined();

      if (k != NULL) {
        InstanceKlass* class_being_redefined = InstanceKlass::cast(k);
        *cached_class_file = class_being_redefined->get_cached_class_file();
      }
    }

    unsigned char* ptr = const_cast<unsigned char*>(stream->buffer());
    unsigned char* end_ptr = ptr + stream->length();

    JvmtiExport::post_class_file_load_hook(name,
                                           class_loader,
                                           protection_domain,
                                           &ptr,
                                           &end_ptr,
                                           cached_class_file);

    if (ptr != stream->buffer()) {
      // JVMTI agent has modified class file data.
      // Set new class file stream using JVMTI agent modified class file data.
      stream = new ClassFileStream(ptr,
                                   end_ptr - ptr,
                                   stream->source(),
                                   stream->need_verify());
    }
  }

  return stream;
}
```

## redefine

### Java: Instrumentation

`java.lang.instrument.Instrumentation`

```java
public interface Instrumentation {
    void redefineClasses(ClassDefinition... definitions) throws  ClassNotFoundException, UnmodifiableClassException;
}
```

### Java: InstrumentationImpl

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

### JVMTI: InstrumentationImplNativeMethods.c

`src/java.instrument/share/native/libinstrument/InstrumentationImplNativeMethods.c`

```text
JNIEXPORT void JNICALL Java_sun_instrument_InstrumentationImpl_redefineClasses0
  (JNIEnv * jnienv, jobject implThis, jlong agent, jobjectArray classDefinitions) {
    redefineClasses(jnienv, (JPLISAgent*)(intptr_t)agent, classDefinitions);
}
```

### JVMTI: JPLISAgent.c

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

    // 获取 classDefinitions 数组的长度
    numDefs = (*jnienv)->GetArrayLength(jnienv, classDefinitions);
    errorOccurred = checkForThrowable(jnienv);
    jplis_assert(!errorOccurred);

    // 加载 java.lang.instrument.ClassDefinition 类
    if (!errorOccurred) {
        jplis_assert(numDefs > 0);
        /* get method IDs for methods to call on class definitions */
        classDefClass = (*jnienv)->FindClass(jnienv, "java/lang/instrument/ClassDefinition");
        errorOccurred = checkForThrowable(jnienv);
        jplis_assert(!errorOccurred);
    }

    // 找到 ClassDefinition.getDefinitionClass()方法
    if (!errorOccurred) {
        getDefinitionClassMethodID = (*jnienv)->GetMethodID(    jnienv,
                                                classDefClass,
                                                "getDefinitionClass",
                                                "()Ljava/lang/Class;");
        errorOccurred = checkForThrowable(jnienv);
        jplis_assert(!errorOccurred);
    }

    // 找到 ClassDefinition.getDefinitionClassFile 方法
    if (!errorOccurred) {
        getDefinitionClassFileMethodID = (*jnienv)->GetMethodID(    jnienv,
                                                    classDefClass,
                                                    "getDefinitionClassFile",
                                                    "()[B");
        errorOccurred = checkForThrowable(jnienv);
        jplis_assert(!errorOccurred);
    }

    if (!errorOccurred) {
        // 分配内存空间
        classDefs = (jvmtiClassDefinition *) allocate(jvmtienv, numDefs * sizeof(jvmtiClassDefinition));
        errorOccurred = (classDefs == NULL);
        jplis_assert(!errorOccurred);
        if (errorOccurred) {
            createAndThrowThrowableFromJVMTIErrorCode(jnienv, JVMTI_ERROR_OUT_OF_MEMORY);
        }

        else {
            /*
             * We have to save the targetFile values that we compute so
             * that we can release the class_bytes arrays that are
             * returned by GetByteArrayElements(). In case of a JNI
             * error, we can't (easily) recompute the targetFile values
             * and we still want to free any memory we allocated.
             */
             // 分配内存空间
            targetFiles = (jbyteArray *) allocate(jvmtienv, numDefs * sizeof(jbyteArray));
            errorOccurred = (targetFiles == NULL);
            jplis_assert(!errorOccurred);
            if (errorOccurred) {
                deallocate(jvmtienv, (void*)classDefs);
                createAndThrowThrowableFromJVMTIErrorCode(jnienv, JVMTI_ERROR_OUT_OF_MEMORY);
            }
            else {
                jint i, j;

                // clear classDefs so we can correctly free memory during errors
                memset(classDefs, 0, numDefs * sizeof(jvmtiClassDefinition));

                // 在 for 循环当中，就是为了给 classDefs 数组赋值
                for (i = 0; i < numDefs; i++) {
                    jclass      classDef    = NULL;

                    // 获取某一个 ClassDefinition 对象
                    classDef = (*jnienv)->GetObjectArrayElement(jnienv, classDefinitions, i);
                    errorOccurred = checkForThrowable(jnienv);
                    jplis_assert(!errorOccurred);
                    if (errorOccurred) {
                        break;
                    }

                    // 调用 ClassDefinition.getDefinitionClass()方法，返回值类型是 Class<?>。
                    classDefs[i].klass = (*jnienv)->CallObjectMethod(jnienv, classDef, getDefinitionClassMethodID);
                    errorOccurred = checkForThrowable(jnienv);
                    jplis_assert(!errorOccurred);
                    if (errorOccurred) {
                        break;
                    }

                    // 调用 ClassDefinition.getDefinitionClassFile()方法，返回值类型是 byte[]。
                    targetFiles[i] = (*jnienv)->CallObjectMethod(jnienv, classDef, getDefinitionClassFileMethodID);
                    errorOccurred = checkForThrowable(jnienv);
                    jplis_assert(!errorOccurred);
                    if (errorOccurred) {
                        break;
                    }

                    // 获取 byte[] 数组长度
                    classDefs[i].class_byte_count = (*jnienv)->GetArrayLength(jnienv, targetFiles[i]);
                    errorOccurred = checkForThrowable(jnienv);
                    jplis_assert(!errorOccurred);
                    if (errorOccurred) {
                        break;
                    }

                    /*
                     * Allocate class_bytes last so we don't have to free
                     * memory on a partial row error.
                     */
                    classDefs[i].class_bytes = (unsigned char*)(*jnienv)->GetByteArrayElements(jnienv, targetFiles[i], NULL);
                    errorOccurred = checkForThrowable(jnienv);
                    jplis_assert(!errorOccurred);
                    if (errorOccurred) {
                        break;
                    }
                }

                // 调用 RedefineClasses() 方法
                if (!errorOccurred) {
                    jvmtiError  errorCode = JVMTI_ERROR_NONE;
                    errorCode = (*jvmtienv)->RedefineClasses(jvmtienv, numDefs, classDefs);
                    if (errorCode == JVMTI_ERROR_WRONG_PHASE) {
                        /* insulate caller from the wrong phase error */
                        errorCode = JVMTI_ERROR_NONE;
                    } else {
                        errorOccurred = (errorCode != JVMTI_ERROR_NONE);
                        if ( errorOccurred ) {
                            createAndThrowThrowableFromJVMTIErrorCode(jnienv, errorCode);
                        }
                    }
                }

                /*
                 * Cleanup memory that we allocated above. If we had a
                 * JNI error, a JVM/TI error or no errors, index 'i'
                 * tracks how far we got in processing the classDefs
                 * array. Note:  ReleaseByteArrayElements() is safe to
                 * call with a JNI exception pending.
                 */
                for (j = 0; j < i; j++) {
                    if ((jbyte *)classDefs[j].class_bytes != NULL) {
                        (*jnienv)->ReleaseByteArrayElements(jnienv,
                            targetFiles[j], (jbyte *)classDefs[j].class_bytes,
                            0 /* copy back and free */);
                        /*
                         * Only check for error if we didn't already have one
                         * so we don't overwrite errorOccurred.
                         */
                        if (!errorOccurred) {
                            errorOccurred = checkForThrowable(jnienv);
                            jplis_assert(!errorOccurred);
                        }
                    }
                }
                deallocate(jvmtienv, (void*)targetFiles);
                deallocate(jvmtienv, (void*)classDefs);
            }
        }
    }

    mapThrownThrowableIfNecessary(jnienv, redefineClassMapper);
}
```

### JVMTI:jvmtiEnv.cpp

`src/hotspot/share/prims/jvmtiEnv.cpp`

```text
// class_count - pre-checked to be greater than or equal to 0
// class_definitions - pre-checked for NULL
jvmtiError
JvmtiEnv::RedefineClasses(jint class_count, const jvmtiClassDefinition* class_definitions) {
//TODO: add locking
  EventRedefineClasses event;
  VM_RedefineClasses op(class_count, class_definitions, jvmti_class_load_kind_redefine);
  VMThread::execute(&op);
  jvmtiError error = op.check_error();
  if (error == JVMTI_ERROR_NONE) {
    event.set_classCount(class_count);
    event.set_redefinitionId(op.id());
    event.commit();
  }
  return error;
}
```

## retransform

### Java: Instrumentation

```java
public interface Instrumentation {
    void retransformClasses(Class<?>... classes) throws UnmodifiableClassException;
}
```

### Java: InstrumentationImpl

```java
public class InstrumentationImpl implements Instrumentation {
    public void retransformClasses(Class<?>... classes) {
        if (!isRetransformClassesSupported()) {
            throw new UnsupportedOperationException("retransformClasses is not supported in this environment");
        }
        if (classes.length == 0) {
            return; // no-op
        }
        retransformClasses0(mNativeAgent, classes);
    }

    private native void retransformClasses0(long nativeAgent, Class<?>[] classes);
}
```

### JVMTI: InstrumentationImplNativeMethods.c

`src/java.instrument/share/native/libinstrument/InstrumentationImplNativeMethods.c`

```text
JNIEXPORT void JNICALL
Java_sun_instrument_InstrumentationImpl_retransformClasses0
  (JNIEnv * jnienv, jobject implThis, jlong agent, jobjectArray classes) {
    retransformClasses(jnienv, (JPLISAgent*)(intptr_t)agent, classes);
}
```

### JVMTI: JPLISAgent.c

```text
void retransformClasses(JNIEnv * jnienv, JPLISAgent * agent, jobjectArray classes) {
    jvmtiEnv *  retransformerEnv     = retransformableEnvironment(agent);
    jboolean    errorOccurred        = JNI_FALSE;
    jvmtiError  errorCode            = JVMTI_ERROR_NONE;
    jsize       numClasses           = 0;
    jclass *    classArray           = NULL;

    /* This is supposed to be checked by caller, but just to be sure */
    if (retransformerEnv == NULL) {
        jplis_assert(retransformerEnv != NULL);
        errorOccurred = JNI_TRUE;
        errorCode = JVMTI_ERROR_MUST_POSSESS_CAPABILITY;
    }

    /* This was supposed to be checked by caller too */
    if (!errorOccurred && classes == NULL) {
        jplis_assert(classes != NULL);
        errorOccurred = JNI_TRUE;
        errorCode = JVMTI_ERROR_NULL_POINTER;
    }

    // 获取 classes 的长度
    if (!errorOccurred) {
        numClasses = (*jnienv)->GetArrayLength(jnienv, classes);
        errorOccurred = checkForThrowable(jnienv);
        jplis_assert(!errorOccurred);

        if (!errorOccurred && numClasses == 0) {
            jplis_assert(numClasses != 0);
            errorOccurred = JNI_TRUE;
            errorCode = JVMTI_ERROR_NULL_POINTER;
        }
    }

    // 为 classArray 数组分配内存空间
    if (!errorOccurred) {
        classArray = (jclass *) allocate(retransformerEnv, numClasses * sizeof(jclass));
        errorOccurred = (classArray == NULL);
        jplis_assert(!errorOccurred);
        if (errorOccurred) {
            errorCode = JVMTI_ERROR_OUT_OF_MEMORY;
        }
    }

    // 为 classArray 数组中的元素赋值
    if (!errorOccurred) {
        jint index;
        for (index = 0; index < numClasses; index++) {
            classArray[index] = (*jnienv)->GetObjectArrayElement(jnienv, classes, index);
            errorOccurred = checkForThrowable(jnienv);
            jplis_assert(!errorOccurred);
            if (errorOccurred) {
                break;
            }

            if (classArray[index] == NULL) {
                jplis_assert(classArray[index] != NULL);
                errorOccurred = JNI_TRUE;
                errorCode = JVMTI_ERROR_NULL_POINTER;
                break;
            }
        }
    }

    // 调用 RetransformClasses() 方法
    if (!errorOccurred) {
        errorCode = (*retransformerEnv)->RetransformClasses(retransformerEnv, numClasses, classArray);
        errorOccurred = (errorCode != JVMTI_ERROR_NONE);
    }

    /* Give back the buffer if we allocated it.  Throw any exceptions after.
     */
    if (classArray != NULL) {
        deallocate(retransformerEnv, (void*)classArray);
    }

    /* Return back if we executed the JVMTI API in a wrong phase
     */
    check_phase_ret(errorCode);

    if (errorCode != JVMTI_ERROR_NONE) {
        createAndThrowThrowableFromJVMTIErrorCode(jnienv, errorCode);
    }

    mapThrownThrowableIfNecessary(jnienv, redefineClassMapper);
}
```

### JVMTI:jvmtiEnv.cpp

`src/hotspot/share/prims/jvmtiEnv.cpp`

```text
// class_count - pre-checked to be greater than or equal to 0
// classes - pre-checked for NULL
jvmtiError
JvmtiEnv::RetransformClasses(jint class_count, const jclass* classes) {
//TODO: add locking

  int index;
  JavaThread* current_thread = JavaThread::current();
  ResourceMark rm(current_thread);

  // 为 class_definitions 数组分配空间
  jvmtiClassDefinition* class_definitions = NEW_RESOURCE_ARRAY(jvmtiClassDefinition, class_count);
  NULL_CHECK(class_definitions, JVMTI_ERROR_OUT_OF_MEMORY);

  // 进行 for 循环，为 class_definitions 数组中元素进行赋值
  for (index = 0; index < class_count; index++) {
    HandleMark hm(current_thread);

    // 取出每一个类 jclass
    jclass jcls = classes[index];
    
    // 由 jclass 转换成 oop
    oop k_mirror = JNIHandles::resolve_external_guard(jcls);
    if (k_mirror == NULL) {
      return JVMTI_ERROR_INVALID_CLASS;
    }
    if (!k_mirror->is_a(vmClasses::Class_klass())) {
      return JVMTI_ERROR_INVALID_CLASS;
    }

    if (!VM_RedefineClasses::is_modifiable_class(k_mirror)) {
      return JVMTI_ERROR_UNMODIFIABLE_CLASS;
    }

    // 由 oop 转换成 Klass
    Klass* klass = java_lang_Class::as_Klass(k_mirror);

    jint status = klass->jvmti_class_status();
    if (status & (JVMTI_CLASS_STATUS_ERROR)) {
      return JVMTI_ERROR_INVALID_CLASS;
    }

    // 由 Klass 转换成 InstanceKlass
    InstanceKlass* ik = InstanceKlass::cast(klass);
    if (ik->get_cached_class_file_bytes() == NULL) {
      // Not cached, we need to reconstitute the class file from the VM representation.
      // We don't attach the reconstituted class bytes to the InstanceKlass here
      // because they have not been validated and we're not at a safepoint.
      JvmtiClassFileReconstituter reconstituter(ik);
      if (reconstituter.get_error() != JVMTI_ERROR_NONE) {
        return reconstituter.get_error();
      }

      class_definitions[index].class_byte_count = (jint)reconstituter.class_file_size();
      class_definitions[index].class_bytes      = (unsigned char*)reconstituter.class_file_bytes();
    } else {
      // it is cached, get it from the cache
      class_definitions[index].class_byte_count = ik->get_cached_class_file_len();
      class_definitions[index].class_bytes      = ik->get_cached_class_file_bytes();
    }
    class_definitions[index].klass              = jcls;
  }
  EventRetransformClasses event;
  
  // 关键点在下面两行代码
  VM_RedefineClasses op(class_count, class_definitions, jvmti_class_load_kind_retransform);
  VMThread::execute(&op);
  
  jvmtiError error = op.check_error();
  if (error == JVMTI_ERROR_NONE) {
    event.set_classCount(class_count);
    event.set_redefinitionId(op.id());
    event.commit();
  }
  return error;
}
```

## Third

### jvmtiRedefineClasses.cpp

```text
VM_RedefineClasses::VM_RedefineClasses(jint class_count,
                                       const jvmtiClassDefinition *class_defs,
                                       JvmtiClassLoadKind class_load_kind) {
  _class_count = class_count;
  _class_defs = class_defs;
  _class_load_kind = class_load_kind;
  _any_class_has_resolved_methods = false;
  _res = JVMTI_ERROR_NONE;
  _the_class = NULL;
  _id = next_id();
}



void VM_RedefineClasses::doit() {
  Thread* current = Thread::current();


  // Mark methods seen on stack and everywhere else so old methods are not
  // cleaned up if they're on the stack.
  MetadataOnStackMark md_on_stack(/*walk_all_metadata*/true, /*redefinition_walk*/true);
  HandleMark hm(current);   // make sure any handles created are deleted
                            // before the stack walk again.

  for (int i = 0; i < _class_count; i++) {
    redefine_single_class(current, _class_defs[i].klass, _scratch_classes[i]);
  }

  // Flush all compiled code that depends on the classes redefined.
  flush_dependent_code();

  // Adjust constantpool caches and vtables for all classes
  // that reference methods of the evolved classes.
  // Have to do this after all classes are redefined and all methods that
  // are redefined are marked as old.
  AdjustAndCleanMetadata adjust_and_clean_metadata(current);
  ClassLoaderDataGraph::classes_do(&adjust_and_clean_metadata);

  // JSR-292 support
  if (_any_class_has_resolved_methods) {
    bool trace_name_printed = false;
    ResolvedMethodTable::adjust_method_entries(&trace_name_printed);
  }

  // Increment flag indicating that some invariants are no longer true.
  // See jvmtiExport.hpp for detailed explanation.
  JvmtiExport::increment_redefinition_count();

  // check_class() is optionally called for product bits, but is
  // always called for non-product bits.
#ifdef PRODUCT
  if (log_is_enabled(Trace, redefine, class, obsolete, metadata)) {
#endif
    log_trace(redefine, class, obsolete, metadata)("calling check_class");
    CheckClass check_class(current);
    ClassLoaderDataGraph::classes_do(&check_class);
#ifdef PRODUCT
  }
#endif

  // Clean up any metadata now unreferenced while MetadataOnStackMark is set.
  ClassLoaderDataGraph::clean_deallocate_lists(false);
}
```

### JVMTI: vmOperations.hpp

## Other

### jvmtiThreadState.hpp

```text
enum JvmtiClassLoadKind {
    jvmti_class_load_kind_load = 100,
    jvmti_class_load_kind_retransform,
    jvmti_class_load_kind_redefine
};
```

## JPLISAgent.c

src/java.instrument/share/native/libinstrument/JPLISAgent.c

- createInstrumentationImpl()
- JPLIS_INSTRUMENTIMPL_TRANSFORM_METHODNAME

- transformClassFile()
- retransformableEnvironment()
  - callbacks.ClassFileLoadHook = &eventHandlerClassFileLoadHook;

## InvocationAdapter.c

- DEF_Agent_OnAttach()
- eventHandlerClassFileLoadHook()

## SU Cai

[Link](https://stackoverflow.com/questions/26275503/java-virtualmachine-loadagent-only-load-agent-at-once)

The class is actually loaded once, except if you have done some optimization to unload classes.
So if you call `loadAgent` multiple time on the same jar,
the classes would not be reloaded but the `Agent_OnAttach` (`agentmain`) might be called multiple time.
Actually it's platform specific and depends on the JVM implementation.

The `loadAgent` method calls `loadAgentLibrary`
which calls [`Agent_OnAttach`](http://docs.oracle.com/javase/8/docs/platform/jvmti/jvmti.html#onattach) which is platform specific.

[`HotSpotVirtualMachine#loadAgent(String, String)`](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/7u40-b43/sun/tools/attach/HotSpotVirtualMachine.java#HotSpotVirtualMachine.loadAgent%28java.lang.String%2Cjava.lang.String%29) source code (The HotSpot implementation of `com.sun.tools.attach.VirtualMachine`),
take a look in hierarchy tab to see the BSD, Linux, Solaris and Windows implementation.
These classes end up calling native methods.
You can find them if you download openJDK source for example for windows,
it will use `jdk\src\windows\native\sun\tools\attach\WindowsVirtualMachine.c` file

VirtualMachineImpl.c

src/jdk.attach/windows/native/libattach/VirtualMachineImpl.c

https://stackoverflow.com/questions/62731360/how-to-speed-up-runtime-java-code-instrumentation

## Reference Table

JVMTI:

- `InstrumentationImplNativeMethods.c`: `src/java.instrument/share/native/libinstrument/InstrumentationImplNativeMethods.c`
- `JPLISAgent.c`: `src/java.instrument/share/native/libinstrument/JPLISAgent.c`
- `vmOperations.hpp`: `src/hotspot/share/runtime/vmOperations.hpp`
- `jvmtiRedefineClasses.cpp`: `src/hotspot/share/prims/jvmtiRedefineClasses.cpp`

