---
title: "Package"
sequence: "110"
---

```text
                                 ┌─── getPackage(String name)
           ┌─── static ──────────┤
           │                     └─── getPackages()
           │
           ├─── name ────────────┼─── getName()
           │
           │                     ┌─── isAnnotationPresent(Class<? extends Annotation> annotationClass)
           │                     │
           │                     ├─── getAnnotation(Class<A> annotationClass)
           │                     │
           │                     ├─── getDeclaredAnnotation(Class<A> annotationClass)
           │                     │
           ├─── annotation ──────┼─── getAnnotationsByType(Class<A> annotationClass)
           │                     │
           │                     ├─── getDeclaredAnnotationsByType(Class<A> annotationClass)
           │                     │
Package ───┤                     ├─── getAnnotations()
           │                     │
           │                     └─── getDeclaredAnnotations()
           │
           │                     ┌─── isSealed()
           ├─── sealed ──────────┤
           │                     └─── isSealed(URL url)
           │
           ├─── compatible ──────┼─── isCompatibleWith(String desired)
           │
           │                     ┌─── getSpecificationTitle()
           │                     │
           │                     ├─── getSpecificationVersion()
           │                     │
           │                     ├─── getSpecificationVendor()
           └─── specification ───┤
                                 ├─── getImplementationTitle()
                                 │
                                 ├─── getImplementationVersion()
                                 │
                                 └─── getImplementationVendor()
```
