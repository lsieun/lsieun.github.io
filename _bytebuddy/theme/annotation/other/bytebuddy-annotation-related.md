---
title: "Annotation"
sequence: "150"
---


## AnnotationDescription

```text
AnnotationDescription myAnnotation = AnnotationDescription.Builder
        .ofType(MyTag.class)
        .build();
```

## AnnotationList

如何获取 `AnnotationList` 呢？

`TypeDescription.getDeclaredAnnotations()`

`net.bytebuddy.description.annotation.AnnotationList`

### AnnotationList.filter

```text
TypeDescription.Generic type = TypeDescription.Generic.Builder.typeVariable("A").build();
AnnotationList annotationList = type.getDeclaredAnnotations();
AnnotationList filteredAnnotationList = annotationList.filter(
        ElementMatchers.anyOf(
                AnnotationDescription.Builder.ofType(MyTag.class).build(),
                AnnotationDescription.Builder.ofType(YourTag.class).build()
        )
);
int size = filteredAnnotationList.size();
```

### size

```text
int size = filteredAnnotationList.size();
```





