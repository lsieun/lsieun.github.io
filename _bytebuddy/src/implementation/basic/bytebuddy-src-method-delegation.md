---
title: "MethodDelegation 源码解析"
sequence: "103"
---

## 本质

MethodDelegation 是『一个方法』对『另一个方法』的调用。

从 operand stack 的角度来说，『调用方法』需要两个步骤：

- 第一步，准备参数，包括 `this` 和方法的形参；
- 第二步，对方法进行调用，例如 `invokestatic`、`invokevirtual` 等。

```text
                                                ┌─── ParameterBinding
                     ┌─── MethodBinding ────────┤
StackManipulation ───┤                          └─── MethodInvoker
                     │
                     └─── TerminationHandler
```

另外，`MethodDelegation` 在完成『调用方法』之后，还有一些额外工作需要做？
它需要考虑『被调用方法的返回值』（target method's returned value）要如何进行处理？
一种方式是，将『被调用方法的返回值』作为『源方法』（source method）的『返回值』；
另一种方式，就是将『被调用方法的返回值』进行“舍弃”。
这部分工作，就是由 `TerminationHandler` 来承担的。

```text
                                                                           ┌─── ParameterBinding
                          ┌─── Record ───────────────┼─── MethodBinding ───┤
                          │                                                └─── MethodInvoker
MethodDelegationBinder ───┤
                          ├─── BindingResolver ──────┼─── AmbiguityResolver
                          │
                          └─── TerminationHandler
```

## MethodDelegation

```java
public class MethodDelegation implements Implementation.Composable {

}
```

### ImplementationDelegate

```java
public class MethodDelegation implements Implementation.Composable {
    protected interface ImplementationDelegate extends InstrumentedType.Prepareable {
        Compiled compile(TypeDescription instrumentedType);
    }
}
```

## MethodDelegationBinder

```java
public interface MethodDelegationBinder {
    Record compile(MethodDescription candidate);

    interface Record {
        MethodBinding bind(Implementation.Target implementationTarget,
                           MethodDescription source,
                           TerminationHandler terminationHandler,
                           MethodInvoker methodInvoker,
                           Assigner assigner);
    }

    interface MethodBinding extends StackManipulation {
        @MaybeNull
        Integer getTargetParameterIndex(Object parameterBindingToken);

        MethodDescription getTarget();
    }
}
```

```text
MethodDelegationBinder --> Record --> MethodBinding
```

## TargetMethodAnnotationDrivenBinder

```java
public class TargetMethodAnnotationDrivenBinder implements MethodDelegationBinder {

}
```

```text
MethodDelegationBinder --> TargetMethodAnnotationDrivenBinder --> DelegationProcessor -->
ParameterBinder
```

### ParameterBinder

```java
public class TargetMethodAnnotationDrivenBinder implements MethodDelegationBinder {
    public interface ParameterBinder<T extends Annotation> {
        Class<T> getHandledType();

        ParameterBinding<?> bind(AnnotationDescription.Loadable<T> annotation,
                                 MethodDescription source,
                                 ParameterDescription target,
                                 Implementation.Target implementationTarget,
                                 Assigner assigner,
                                 Assigner.Typing typing);
    }
}
```

### ParameterBinding

```java
public interface MethodDelegationBinder {
    interface ParameterBinding<T> extends StackManipulation {
        T getIdentificationToken();
    }
}
```

### DelegationProcessor

```java
public class TargetMethodAnnotationDrivenBinder implements MethodDelegationBinder {
    protected static class DelegationProcessor {
        private final Map<? extends TypeDescription, ? extends ParameterBinder<?>> parameterBinders;

        protected Handler prepare(ParameterDescription target) {
            Assigner.Typing typing = RuntimeType.Verifier.check(target);
            Handler handler = new Handler.Unbound(target, typing);
            for (AnnotationDescription annotation : target.getDeclaredAnnotations()) {
                ParameterBinder<?> parameterBinder = parameterBinders.get(annotation.getAnnotationType());
                if (parameterBinder != null && handler.isBound()) {
                    throw new IllegalStateException("Ambiguous binding for parameter annotated with two handled annotation types");
                } else if (parameterBinder != null /* && !handler.isBound() */) {
                    handler = Handler.Bound.of(target, parameterBinder, annotation, typing);
                }
            }
            return handler;
        }

        protected interface Handler {
            boolean isBound();

            ParameterBinding<?> bind(MethodDescription source, Implementation.Target implementationTarget, Assigner assigner);
        }
    }
}
```

```java
public interface MethodDelegationBinder {
    class Processor implements MethodDelegationBinder.Record {
        public MethodBinding bind(Implementation.Target implementationTarget,
                                  MethodDescription source,
                                  TerminationHandler terminationHandler,
                                  MethodInvoker methodInvoker,
                                  Assigner assigner) {
            List<MethodBinding> targets = new ArrayList<>();
            for (Record record : records) {
                MethodBinding methodBinding = record.bind(
                        implementationTarget,
                        source,
                        terminationHandler,
                        methodInvoker,
                        assigner
                );
                targets.add(methodBinding);
            }
            return bindingResolver.resolve(ambiguityResolver, source, targets);
        }
    }
}
```

```java
public class TargetMethodAnnotationDrivenBinder implements MethodDelegationBinder {
    protected static class Record implements MethodDelegationBinder.Record {
        public MethodBinding bind(Implementation.Target implementationTarget,
                                  MethodDescription source,
                                  MethodDelegationBinder.TerminationHandler terminationHandler,
                                  MethodInvoker methodInvoker,
                                  Assigner assigner) {

            MethodBinding.Builder methodDelegationBindingBuilder = new MethodBinding.Builder(methodInvoker, candidate);
            for (DelegationProcessor.Handler handler : handlers) {
                ParameterBinding<?> parameterBinding = handler.bind(source, implementationTarget, assigner);
                methodDelegationBindingBuilder.append(parameterBinding);
            }

            StackManipulation methodTermination = terminationHandler.resolve(assigner, typing, source, candidate);
            return methodDelegationBindingBuilder.build(methodTermination);
        }
    }
}
```
