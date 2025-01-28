---
title: "Java Instrument"
sequence: "101"
---

## JPLISAgent.h

```text
struct  _JPLISAgent;

typedef struct _JPLISAgent        JPLISAgent;
typedef struct _JPLISEnvironment  JPLISEnvironment;

#define JPLIS_INSTRUMENTIMPL_CLASSNAME                      "sun/instrument/InstrumentationImpl"
#define JPLIS_INSTRUMENTIMPL_CONSTRUCTOR_METHODNAME         "<init>"
#define JPLIS_INSTRUMENTIMPL_CONSTRUCTOR_METHODSIGNATURE    "(JZZ)V"
#define JPLIS_INSTRUMENTIMPL_PREMAININVOKER_METHODNAME      "loadClassAndCallPremain"
#define JPLIS_INSTRUMENTIMPL_PREMAININVOKER_METHODSIGNATURE "(Ljava/lang/String;Ljava/lang/String;)V"
#define JPLIS_INSTRUMENTIMPL_AGENTMAININVOKER_METHODNAME      "loadClassAndCallAgentmain"
#define JPLIS_INSTRUMENTIMPL_AGENTMAININVOKER_METHODSIGNATURE "(Ljava/lang/String;Ljava/lang/String;)V"
#define JPLIS_INSTRUMENTIMPL_TRANSFORM_METHODNAME           "transform"
#define JPLIS_INSTRUMENTIMPL_TRANSFORM_METHODSIGNATURE      \
    "(Ljava/lang/Module;Ljava/lang/ClassLoader;Ljava/lang/String;Ljava/lang/Class;Ljava/security/ProtectionDomain;[BZ)[B"
```

### JPLISEnvironment

```text
struct _JPLISEnvironment {
    jvmtiEnv *              mJVMTIEnv;              /* the JVM TI environment */
    JPLISAgent *            mAgent;                 /* corresponding agent */
    jboolean                mIsRetransformer;       /* indicates if special environment */
};
```

### JPLISAgent

```text
struct _JPLISAgent {
JavaVM *                mJVM;                   /* handle to the JVM */
JPLISEnvironment        mNormalEnvironment;     /* for every thing but retransform stuff */
JPLISEnvironment        mRetransformEnvironment;/* for retransform stuff only */
jobject                 mInstrumentationImpl;   /* handle to the Instrumentation instance */
jmethodID               mPremainCaller;         /* method on the InstrumentationImpl that does the premain stuff (cached to save lots of lookups) */
jmethodID               mAgentmainCaller;       /* method on the InstrumentationImpl for agents loaded via attach mechanism */
jmethodID               mTransform;             /* method on the InstrumentationImpl that does the class file transform */
jboolean                mRedefineAvailable;     /* cached answer to "does this agent support redefine" */
jboolean                mRedefineAdded;         /* indicates if can_redefine_classes capability has been added */
jboolean                mNativeMethodPrefixAvailable; /* cached answer to "does this agent support prefixing" */
jboolean                mNativeMethodPrefixAdded;     /* indicates if can_set_native_method_prefix capability has been added */
char const *            mAgentClassName;        /* agent class name */
char const *            mOptionsString;         /* -javaagent options string */
const char *            mJarfile;               /* agent jar file name */
};
```

## JPLISAgent.c

`src/java.instrument/share/native/libinstrument/JPLISAgent.c`

### transformClassFile

JPLISAgent.c transformClassFile

```text
void
transformClassFile(             JPLISAgent *            agent,
                                JNIEnv *                jnienv,
                                jobject                 loaderObject,
                                const char*             name,
                                jclass                  classBeingRedefined,
                                jobject                 protectionDomain,
                                jint                    class_data_len,
                                const unsigned char*    class_data,
                                jint*                   new_class_data_len,
                                unsigned char**         new_class_data,
                                jboolean                is_retransformer) {
    jboolean        errorOutstanding        = JNI_FALSE;
    jstring         classNameStringObject   = NULL;
    jarray          classFileBufferObject   = NULL;
    jarray          transformedBufferObject = NULL;
    jsize           transformedBufferSize   = 0;
    unsigned char * resultBuffer            = NULL;
    jboolean        shouldRun               = JNI_FALSE;

    /* only do this if we aren't already in the middle of processing a class on this thread */
    shouldRun = tryToAcquireReentrancyToken(
                                jvmti(agent),
                                NULL);  /* this thread */

    if ( shouldRun ) {
        /* first marshall all the parameters */
        classNameStringObject = (*jnienv)->NewStringUTF(jnienv, name);
        errorOutstanding = checkForAndClearThrowable(jnienv);
        jplis_assert_msg(!errorOutstanding, "can't create name string");

        if ( !errorOutstanding ) {
            classFileBufferObject = (*jnienv)->NewByteArray(jnienv, class_data_len);
            errorOutstanding = checkForAndClearThrowable(jnienv);
            jplis_assert_msg(!errorOutstanding, "can't create byte array");
        }

        if ( !errorOutstanding ) {
            jbyte * typedBuffer = (jbyte *) class_data; /* nasty cast, dumb JNI interface, const missing */
                                                        /* The sign cast is safe. The const cast is dumb. */
            (*jnienv)->SetByteArrayRegion(  jnienv,
                                            classFileBufferObject,
                                            0,
                                            class_data_len,
                                            typedBuffer);
            errorOutstanding = checkForAndClearThrowable(jnienv);
            jplis_assert_msg(!errorOutstanding, "can't set byte array region");
        }

        /*  now call the JPL agents to do the transforming */
        /*  potential future optimization: may want to skip this if there are none */
        if ( !errorOutstanding ) {
            jobject moduleObject = NULL;

            if (classBeingRedefined == NULL) {
                moduleObject = getModuleObject(jvmti(agent), loaderObject, name);
            } else {
                // Redefine or retransform, InstrumentationImpl.transform() will use
                // classBeingRedefined.getModule() to get the module.
            }
            jplis_assert(agent->mInstrumentationImpl != NULL);
            jplis_assert(agent->mTransform != NULL);
            // 经过transformation之后得到的byte[]对象
            transformedBufferObject = (*jnienv)->CallObjectMethod(
                                                jnienv,
                                                agent->mInstrumentationImpl,
                                                agent->mTransform,
                                                moduleObject,
                                                loaderObject,
                                                classNameStringObject,
                                                classBeingRedefined,
                                                protectionDomain,
                                                classFileBufferObject,
                                                is_retransformer);
            errorOutstanding = checkForAndClearThrowable(jnienv);
            jplis_assert_msg(!errorOutstanding, "transform method call failed");
        }

        /* Finally, unmarshall the parameters (if someone touched the buffer, tell the JVM) */
        if ( !errorOutstanding ) {
            if ( transformedBufferObject != NULL ) {
                transformedBufferSize = (*jnienv)->GetArrayLength(  jnienv,
                                                                    transformedBufferObject);
                errorOutstanding = checkForAndClearThrowable(jnienv);
                jplis_assert_msg(!errorOutstanding, "can't get array length");

                if ( !errorOutstanding ) {
                    /* allocate the response buffer with the JVMTI allocate call.
                     *  This is what the JVMTI spec says to do for Class File Load hook responses
                     */
                    jvmtiError  allocError = (*(jvmti(agent)))->Allocate(jvmti(agent),
                                                                             transformedBufferSize,
                                                                             &resultBuffer);
                    errorOutstanding = (allocError != JVMTI_ERROR_NONE);
                    jplis_assert_msg(!errorOutstanding, "can't allocate result buffer");
                }

                if ( !errorOutstanding ) {
                    (*jnienv)->GetByteArrayRegion(  jnienv,
                                                    transformedBufferObject,
                                                    0,
                                                    transformedBufferSize,
                                                    (jbyte *) resultBuffer);
                    errorOutstanding = checkForAndClearThrowable(jnienv);
                    jplis_assert_msg(!errorOutstanding, "can't get byte array region");

                    /* in this case, we will not return the buffer to the JVMTI,
                     * so we need to deallocate it ourselves
                     */
                    if ( errorOutstanding ) {
                        deallocate( jvmti(agent),
                                   (void*)resultBuffer);
                    }
                }

                if ( !errorOutstanding ) {
                    *new_class_data_len = (transformedBufferSize);
                    *new_class_data     = resultBuffer;
                }
            }
        }

        /* release the token */
        releaseReentrancyToken( jvmti(agent),
                                NULL);      /* this thread */

    }

    return;
}
```

![](/assets/images/java/agent/jplis-agent-transform-classfile.png)

## InvocationAdapter.c

`src/java.instrument/share/native/libinstrument/InvocationAdapter.c`

```text
void JNICALL
eventHandlerClassFileLoadHook(  jvmtiEnv *              jvmtienv,
                                JNIEnv *                jnienv,
                                jclass                  class_being_redefined,
                                jobject                 loader,
                                const char*             name,
                                jobject                 protectionDomain,
                                jint                    class_data_len,
                                const unsigned char*    class_data,
                                jint*                   new_class_data_len,
                                unsigned char**         new_class_data) {
    JPLISEnvironment * environment  = NULL;

    environment = getJPLISEnvironment(jvmtienv);

    /* if something is internally inconsistent (no agent), just silently return without touching the buffer */
    if ( environment != NULL ) {
        jthrowable outstandingException = preserveThrowable(jnienv);
        // 下面的方法定义在JPLISAgent.c文件
        transformClassFile( environment->mAgent,
                            jnienv,
                            loader,
                            name,
                            class_being_redefined,
                            protectionDomain,
                            class_data_len,
                            class_data,
                            new_class_data_len,
                            new_class_data,
                            environment->mIsRetransformer);
        restoreThrowable(jnienv, outstandingException);
    }
}
```

## jvmtiEnv.cpp

`src/hotspot/share/prims/jvmtiEnv.cpp`

### RedefineClasses

```text
// class_count - pre-checked to be greater than or equal to 0
// class_definitions - pre-checked for NULL
jvmtiError
JvmtiEnv::RedefineClasses(jint class_count, const jvmtiClassDefinition* class_definitions) {
  EventRedefineClasses event;
   op(class_count, class_definitions, jvmti_class_load_kind_redefine);
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

### RetransformClasses

```text
// class_count - pre-checked to be greater than or equal to 0
// classes - pre-checked for NULL
jvmtiError
JvmtiEnv::RetransformClasses(jint class_count, const jclass* classes) {

  int index;
  JavaThread* current_thread = JavaThread::current();
  ResourceMark rm(current_thread);

  jvmtiClassDefinition* class_definitions =
                            NEW_RESOURCE_ARRAY(jvmtiClassDefinition, class_count);
  NULL_CHECK(class_definitions, JVMTI_ERROR_OUT_OF_MEMORY);

  for (index = 0; index < class_count; index++) {
    HandleMark hm(current_thread);

    jclass jcls = classes[index];
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

    Klass* klass = java_lang_Class::as_Klass(k_mirror);

    jint status = klass->jvmti_class_status();
    if (status & (JVMTI_CLASS_STATUS_ERROR)) {
      return JVMTI_ERROR_INVALID_CLASS;
    }

    InstanceKlass* ik = InstanceKlass::cast(klass);
    if (ik->get_cached_class_file_bytes() == NULL) {
      // Not cached, we need to reconstitute the class file from the
      // VM representation. We don't attach the reconstituted class
      // bytes to the InstanceKlass here because they have not been
      // validated and we're not at a safepoint.
      JvmtiClassFileReconstituter reconstituter(ik);
      if (reconstituter.get_error() != JVMTI_ERROR_NONE) {
        return reconstituter.get_error();
      }

      class_definitions[index].class_byte_count = (jint)reconstituter.class_file_size();
      class_definitions[index].class_bytes      = (unsigned char*)
                                                       reconstituter.class_file_bytes();
    } else {
      // it is cached, get it from the cache
      class_definitions[index].class_byte_count = ik->get_cached_class_file_len();
      class_definitions[index].class_bytes      = ik->get_cached_class_file_bytes();
    }
    class_definitions[index].klass              = jcls;
  }
  EventRetransformClasses event;
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

## jvmtiRedefineClasses.hpp

`src/hotspot/share/prims/jvmtiRedefineClasses.hpp`

```text
class VM_RedefineClasses: public VM_Operation {
 private:
  // These static fields are needed by ClassLoaderDataGraph::classes_do()
  // facility and the CheckClass and AdjustAndCleanMetadata helpers.
  static Array<Method*>* _old_methods;
  static Array<Method*>* _new_methods;
  static Method**        _matching_old_methods;
  static Method**        _matching_new_methods;
  static Method**        _deleted_methods;
  static Method**        _added_methods;
  static int             _matching_methods_length;
  static int             _deleted_methods_length;
  static int             _added_methods_length;
  static bool            _has_redefined_Object;
  static bool            _has_null_class_loader;

  // Used by JFR to group class redefininition events together.
  static u8              _id_counter;

  // The instance fields are used to pass information from
  // doit_prologue() to doit() and doit_epilogue().
  Klass*                      _the_class;
  jint                        _class_count;
  const jvmtiClassDefinition *_class_defs;  // ptr to _class_count defs

  // This operation is used by both RedefineClasses and
  // RetransformClasses.  Indicate which.
  JvmtiClassLoadKind          _class_load_kind;

  // _index_map_count is just an optimization for knowing if
  // _index_map_p contains any entries.
  int                         _index_map_count;
  intArray *                  _index_map_p;

  // _operands_index_map_count is just an optimization for knowing if
  // _operands_index_map_p contains any entries.
  int                         _operands_cur_length;
  int                         _operands_index_map_count;
  intArray *                  _operands_index_map_p;

  // ptr to _class_count scratch_classes
  InstanceKlass**             _scratch_classes;
  jvmtiError                  _res;

  // Set if any of the InstanceKlasses have entries in the ResolvedMethodTable
  // to avoid walking after redefinition if the redefined classes do not
  // have any entries.
  bool _any_class_has_resolved_methods;

  // Performance measurement support. These timers do not cover all
  // the work done for JVM/TI RedefineClasses() but they do cover
  // the heavy lifting.
  elapsedTimer  _timer_rsc_phase1;
  elapsedTimer  _timer_rsc_phase2;
  elapsedTimer  _timer_vm_op_prologue;

  // Redefinition id used by JFR
  u8 _id;

  // These routines are roughly in call order unless otherwise noted.

  // Load the caller's new class definition(s) into _scratch_classes.
  // Constant pool merging work is done here as needed. Also calls
  // compare_and_normalize_class_versions() to verify the class
  // definition(s).
  jvmtiError load_new_class_versions();

  // Verify that the caller provided class definition(s) that meet
  // the restrictions of RedefineClasses. Normalize the order of
  // overloaded methods as needed.
  jvmtiError compare_and_normalize_class_versions(
    InstanceKlass* the_class, InstanceKlass* scratch_class);

  // Figure out which new methods match old methods in name and signature,
  // which methods have been added, and which are no longer present
  void compute_added_deleted_matching_methods();

  // Change jmethodIDs to point to the new methods
  void update_jmethod_ids();

  // In addition to marking methods as old and/or obsolete, this routine
  // counts the number of methods that are EMCP (Equivalent Module Constant Pool).
  int check_methods_and_mark_as_obsolete();
  void transfer_old_native_function_registrations(InstanceKlass* the_class);

  // Install the redefinition of a class
  void redefine_single_class(Thread* current, jclass the_jclass,
                             InstanceKlass* scratch_class_oop);

  void swap_annotations(InstanceKlass* new_class,
                        InstanceKlass* scratch_class);

  // Increment the classRedefinedCount field in the specific InstanceKlass
  // and in all direct and indirect subclasses.
  void increment_class_counter(InstanceKlass* ik);

  // Support for constant pool merging (these routines are in alpha order):
  void append_entry(const constantPoolHandle& scratch_cp, int scratch_i,
    constantPoolHandle *merge_cp_p, int *merge_cp_length_p);
  void append_operand(const constantPoolHandle& scratch_cp, int scratch_bootstrap_spec_index,
    constantPoolHandle *merge_cp_p, int *merge_cp_length_p);
  void finalize_operands_merge(const constantPoolHandle& merge_cp, TRAPS);
  int find_or_append_indirect_entry(const constantPoolHandle& scratch_cp, int scratch_i,
    constantPoolHandle *merge_cp_p, int *merge_cp_length_p);
  int find_or_append_operand(const constantPoolHandle& scratch_cp, int scratch_bootstrap_spec_index,
    constantPoolHandle *merge_cp_p, int *merge_cp_length_p);
  int find_new_index(int old_index);
  int find_new_operand_index(int old_bootstrap_spec_index);
  bool is_unresolved_class_mismatch(const constantPoolHandle& cp1, int index1,
    const constantPoolHandle& cp2, int index2);
  void map_index(const constantPoolHandle& scratch_cp, int old_index, int new_index);
  void map_operand_index(int old_bootstrap_spec_index, int new_bootstrap_spec_index);
  bool merge_constant_pools(const constantPoolHandle& old_cp,
    const constantPoolHandle& scratch_cp, constantPoolHandle *merge_cp_p,
    int *merge_cp_length_p, TRAPS);
  jvmtiError merge_cp_and_rewrite(InstanceKlass* the_class,
    InstanceKlass* scratch_class, TRAPS);
  u2 rewrite_cp_ref_in_annotation_data(
    AnnotationArray* annotations_typeArray, int &byte_i_ref,
    const char * trace_mesg);
  bool rewrite_cp_refs(InstanceKlass* scratch_class);
  bool rewrite_cp_refs_in_annotation_struct(
    AnnotationArray* class_annotations, int &byte_i_ref);
  bool rewrite_cp_refs_in_annotations_typeArray(
    AnnotationArray* annotations_typeArray, int &byte_i_ref);
  bool rewrite_cp_refs_in_class_annotations(InstanceKlass* scratch_class);
  bool rewrite_cp_refs_in_element_value(
    AnnotationArray* class_annotations, int &byte_i_ref);
  bool rewrite_cp_refs_in_type_annotations_typeArray(
    AnnotationArray* type_annotations_typeArray, int &byte_i_ref,
    const char * location_mesg);
  bool rewrite_cp_refs_in_type_annotation_struct(
    AnnotationArray* type_annotations_typeArray, int &byte_i_ref,
    const char * location_mesg);
  bool skip_type_annotation_target(
    AnnotationArray* type_annotations_typeArray, int &byte_i_ref,
    const char * location_mesg);
  bool skip_type_annotation_type_path(
    AnnotationArray* type_annotations_typeArray, int &byte_i_ref);
  bool rewrite_cp_refs_in_fields_annotations(InstanceKlass* scratch_class);
  bool rewrite_cp_refs_in_nest_attributes(InstanceKlass* scratch_class);
  bool rewrite_cp_refs_in_record_attribute(InstanceKlass* scratch_class);
  bool rewrite_cp_refs_in_permitted_subclasses_attribute(InstanceKlass* scratch_class);

  void rewrite_cp_refs_in_method(methodHandle method,
    methodHandle * new_method_p, TRAPS);
  bool rewrite_cp_refs_in_methods(InstanceKlass* scratch_class);

  bool rewrite_cp_refs_in_methods_annotations(InstanceKlass* scratch_class);
  bool rewrite_cp_refs_in_methods_default_annotations(InstanceKlass* scratch_class);
  bool rewrite_cp_refs_in_methods_parameter_annotations(InstanceKlass* scratch_class);
  bool rewrite_cp_refs_in_class_type_annotations(InstanceKlass* scratch_class);
  bool rewrite_cp_refs_in_fields_type_annotations(InstanceKlass* scratch_class);
  bool rewrite_cp_refs_in_methods_type_annotations(InstanceKlass* scratch_class);

  void rewrite_cp_refs_in_stack_map_table(const methodHandle& method);
  void rewrite_cp_refs_in_verification_type_info(
         address& stackmap_addr_ref, address stackmap_end, u2 frame_i,
         u1 frame_size);
  void set_new_constant_pool(ClassLoaderData* loader_data,
         InstanceKlass* scratch_class,
         constantPoolHandle scratch_cp, int scratch_cp_length, TRAPS);

  void flush_dependent_code();

  // lock classes to redefine since constant pool merging isn't thread safe.
  void lock_classes();
  void unlock_classes();

  u8 next_id();

  static void dump_methods();

  // Check that there are no old or obsolete methods
  class CheckClass : public KlassClosure {
    Thread* _thread;
   public:
    CheckClass(Thread* t) : _thread(t) {}
    void do_klass(Klass* k);
  };

  // Unevolving classes may point to methods of the_class directly
  // from their constant pool caches, itables, and/or vtables. We
  // use the ClassLoaderDataGraph::classes_do() facility and this helper
  // to fix up these pointers and clean MethodData out.
  class AdjustAndCleanMetadata : public KlassClosure {
    Thread* _thread;
   public:
    AdjustAndCleanMetadata(Thread* t) : _thread(t) {}
    void do_klass(Klass* k);
  };

 public:
  VM_RedefineClasses(jint class_count,
                     const jvmtiClassDefinition *class_defs,
                     JvmtiClassLoadKind class_load_kind);
  VMOp_Type type() const { return VMOp_RedefineClasses; }
  bool doit_prologue();
  void doit();
  void doit_epilogue();

  bool allow_nested_vm_operations() const        { return true; }
  jvmtiError check_error()                       { return _res; }
  u8 id()                                        { return _id; }

  // Modifiable test must be shared between IsModifiableClass query
  // and redefine implementation
  static bool is_modifiable_class(oop klass_mirror);

  static jint get_cached_class_file_len(JvmtiCachedClassFileData *cache) {
    return cache == NULL ? 0 : cache->length;
  }
  static unsigned char * get_cached_class_file_bytes(JvmtiCachedClassFileData *cache) {
    return cache == NULL ? NULL : cache->data;
  }

  // Error printing
  void print_on_error(outputStream* st) const;
};
```


