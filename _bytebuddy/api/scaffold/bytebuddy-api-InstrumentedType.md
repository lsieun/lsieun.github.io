---
title: "InstrumentedType"
sequence: "InstrumentedType"
---

## 概览

### TypeDescription 和 InstrumentedType 的关系

- DynamicType: A dynamic type that is created at runtime,
  usually as the result of applying a `DynamicType.Builder` or as the result of an `AuxiliaryType`.
- TypeDescription: will represent their unloaded forms and therefore differ from the loaded types,
  especially with regards to annotations.
- InstrumentedType: an instrumented type that is subject to change

## API 设计



