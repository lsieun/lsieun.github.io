---
title: "MemberAttributeExtension"
sequence: "102"
---

## MemberAttributeExtension

```text
                                                                 ┌─── annotate(Annotation... annotation)
                                                                 │
                                                                 ├─── annotate(List<? extends Annotation> annotations)
                                                                 │
                                              ┌─── annotation ───┼─── annotate(AnnotationDescription... annotation)
                                              │                  │
                                              │                  ├─── annotate(Collection<? extends AnnotationDescription> annotations)
                            ┌─── ForField ────┤                  │
                            │                 │                  └─── attribute(FieldAttributeAppender.Factory attributeAppenderFactory)
                            │                 │
                            │                 └─── on ───────────┼─── on(ElementMatcher<? super FieldDescription.InDefinedShape> matcher)
                            │
                            │
                            │                                                      ┌─── annotateMethod(Annotation... annotation)
                            │                                                      │
                            │                                                      ├─── annotateMethod(List<? extends Annotation> annotations)
                            │                                    ┌─── method ──────┤
MemberAttributeExtension ───┤                                    │                 ├─── annotateMethod(AnnotationDescription... annotation)
                            │                                    │                 │
                            │                                    │                 └─── annotateMethod(Collection<? extends AnnotationDescription> annotations)
                            │                                    │
                            │                                    │                 ┌─── annotateParameter(int index, Annotation... annotation)
                            │                                    │                 │
                            │                 ┌─── annotation ───┤                 ├─── annotateParameter(int index, List<? extends Annotation> annotations)
                            │                 │                  ├─── parameter ───┤
                            │                 │                  │                 ├─── annotateParameter(int index, AnnotationDescription... annotation)
                            │                 │                  │                 │
                            └─── ForMethod ───┤                  │                 └─── annotateParameter(int index, Collection<? extends AnnotationDescription> annotations)
                                              │                  │
                                              │                  └─── common ──────┼─── attribute(MethodAttributeAppender.Factory attributeAppenderFactory)
                                              │
                                              └─── on ───────────┼─── on(ElementMatcher<? super MethodDescription> matcher)
```

