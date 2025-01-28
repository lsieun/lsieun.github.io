---
title: "SRC Overview"
sequence: "101"
---

```text
ByteBuddy --> DynamicType.Builder.make()
```

## ByteBuddy

### Main

```text
                            ┌─── instance ───┼─── new ByteBuddy()
                            │
        ┌─── ByteBuddy ─────┤                ┌─── subclass(): DynamicType.Builder
        │                   │                │
        │                   └─── method ─────┼─── redefine(): DynamicType.Builder
        │                                    │
        │                                    └─── rebase()  : DynamicType.Builder
        │
        │                                                                       ┌─── modifiers()
        │                                                                       │
        │                                                   ┌─── type ──────────┼─── name()
        │                                                   │                   │
        │                                                   │                   └─── implement()
        │                                                   │
        │                                                   │                   ┌─── defineField()
        │                                                   │                   │
        │                                                   ├─── field ─────────┼─── field()
        │                                                   │                   │
        │                                                   │                   └─── serialVersionUid()
        │                                                   │
Main ───┤                                                   │                   ┌─── defineConstructor()
        │                                                   ├─── constructor ───┤
        │                                                   │                   └─── constructor()
        │                                                   │
        │                                                   │                   ┌─── defineMethod()
        │                                    ┌─── input ────┤                   │
        │                                    │              │                   ├─── method()
        │                                    │              │                   │
        │                                    │              ├─── method ────────┼─── defineProperty()
        │                                    │              │                   │
        │                                    │              │                   ├─── withHashCodeEquals()
        │                                    │              │                   │
        │                                    │              │                   └─── withToString()
        │                   ┌─── Builder ────┤              │
        │                   │                │              │                   ┌─── initializer()
        │                   │                │              ├─── initializer ───┤
        │                   │                │              │                   └─── invokable()
        │                   │                │              │
        │                   │                │              ├─── attribute ─────┼─── attribute()
        └─── DynamicType ───┤                │              │
                            │                │              └─── asm ───────────┼─── visit()
                            │                │
                            │                └─── output ───┼─── make(): DynamicType.Unloaded
                            │
                            ├─── Unloaded ───┼─── load(): DynamicType.Loaded
                            │
                            └─── Loaded ─────┼─── getLoaded(): Class<?>
```

### Make

```text
                                                                                ┌─── ConstructorStrategy.inject(): MethodRegistry
                                                                                │
                              ┌─── UsingTypeWriter.toTypeWriter():TypeWriter ───┼─── MethodRegistry.prepare():MethodRegistry.Handler.Compiled ───┼─── InstrumentedType.Prepareable.prepare()
                              │                                                 │
DynamicType.Builder.make() ───┤                                                 └─── MethodRegistry.Default.Prepared.compile() ──────────────────┼─── MethodRegistry.Handler.compile() ───┼─── Implementation.appender()
                              │
                              └─── TypeWriter.make() ───────────────────────────┼─── TypeWriter.Default.create()
```

## ASM

### 类型

```text
                               ┌─── cv = AsmVisitorWrapper.wrap()
                               │
                               ├─── cv.visit()
                               │
                               │                                     ┌─── TypeWriter.FieldPool.target(): TypeWriter.FieldPool.Record
                               ├─── for-loop ────────────────────────┤
TypeWriter.Default.create() ───┤                                     └─── TypeWriter.FieldPool.Record.apply(cv)
                               │
                               │                                     ┌─── TypeWriter.MethodPool.target(): TypeWriter.MethodPool.Record
                               ├─── for-loop ────────────────────────┤
                               │                                     └─── TypeWriter.MethodPool.Record.apply(cv)
                               │
                               └─── cv.visitEnd()
```

### 字段

```text
                                         ┌─── fv = cv.visitField()
                                         │
TypeWriter.FieldPool.Record.apply(cv) ───┼─── FieldAttributeAppender.apply(fv)
                                         │
                                         └─── fv.visitEnd()
```

### 方法

```text
                                        ┌─── mv = cv.visitMethod()
                                        │
                                        ├─── mv.visitParameter()
                                        │
                                        ├─── applyHead(mv)
                                        │
                                        │                             ┌─── applyAttributes(mv)
TypeWriter.MethodPool.Record.apply() ───┤                             │
                                        │                             ├─── mv.visitCode()
                                        ├─── applyBody(mv) ───────────┤
                                        │                             ├─── applyCode(mv) ─────────┼─── ByteCodeAppender.apply(mv)
                                        │                             │
                                        │                             └─── mv.visitMaxs()
                                        │
                                        └─── mv.visitEnd()
```
