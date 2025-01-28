---
title: "Type Erasure: Performance"
sequence: "119"
---

## 1. Is generic code faster or slower than non-generic code?

There is no perceivable difference.

**Some programmers**, especially those with a C++ background, expect that generic code should perform much faster than non-generic code, because this is one observable benefit of using templates in C++. **Other programmers** assume that the synthetic bridge methods and implicit casts inserted by the compiler in the process of type erasure would degrade the runtime performance of generic code.  Which one is true?

The short answer is: it is likely that one will find neither a substantial difference in runtime performance nor any consistent trend.  However, this has not yet been verified by any benchmarks I know of.

### 1.1. Implicit casts

The casts added by the compiler are exactly the casts that would appear in non-generic code. Hence the implicit casts do not add any overhead.

[原文有示例代码](http://www.angelikalanger.com/GenericsFAQ/FAQSections/TechnicalDetails.html#FAQ110)

### 1.2. Bridge methods

The compiler adds bridge methods. These synthetic methods cause an additional method invocation at runtime, they are represented in the byte code and increase its volume, and they add to the memory footprint of the program.

### 1.3. Runtime type information

Static information about type parameters and their bounds is made available via reflection. This runtime type information adds to the size of the byte code and the memory footprint, because the information must be loaded into memory at runtime.  Again, this only affects new (i.e. 5.0) source code.  On the other hand, there are some enhancements to reflection that apply even to existing language features, and those do require slightly larger class files, too. At the same time, the representation of runtime type information has been improved. For example, there is now an access bit for "synthetic" rather than a class file attribute, and **class literals** now generate only a single instruction. These things often balance out.  For any particular program you might notice a very slight degradation in startup time due to slightly larger class files, or you might find improved running time because of shorter code sequences.  Yet it is unlikely that one will find any large or consistent trends.

### 1.4. Compilation time

Compiler performance might **decrease** because translating generic source code is more work than translating non-generic source code. Just think of all the **static type checks** the compiler must perform for generic types and methods. On the other hand, the performance of a compiler is often more dominated by its implementation techniques rather than the features of the language being compiled. Again, it is unlikely that one will find any perceivable or measurable trends.

## 2. Reference

- [Is generic code faster or slower than non-generic code?](http://www.angelikalanger.com/GenericsFAQ/FAQSections/TechnicalDetails.html#FAQ110)
