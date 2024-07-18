---
title: "源码解读"
sequence: "109"
---

## MethodDelegation

```java
public class MethodDelegation implements Implementation.Composable {
    //
}
```

### 静态方法

```java
public class MethodDelegation implements Implementation.Composable {
    public static MethodDelegation to(Class<?> type) {
        return withDefaultConfiguration().to(type);
    }

    public static MethodDelegation to(TypeDescription typeDescription) {
        return withDefaultConfiguration().to(typeDescription);
    }

    public static MethodDelegation to(Object target) {
        return withDefaultConfiguration().to(target);
    }

    public static MethodDelegation to(Object target, MethodGraph.Compiler methodGraphCompiler) {
        return withDefaultConfiguration().to(target, methodGraphCompiler);
    }

    public static MethodDelegation to(Object target, String fieldName) {
        return withDefaultConfiguration().to(target, fieldName);
    }

    public static MethodDelegation to(Object target, String fieldName, MethodGraph.Compiler methodGraphCompiler) {
        return withDefaultConfiguration().to(target, fieldName, methodGraphCompiler);
    }

    public static MethodDelegation to(Object target, Type type) {
        return withDefaultConfiguration().to(target, type);
    }

    public static MethodDelegation to(Object target, Type type, MethodGraph.Compiler methodGraphCompiler) {
        return withDefaultConfiguration().to(target, type, methodGraphCompiler);
    }

    public static MethodDelegation to(Object target, Type type, String fieldName) {
        return withDefaultConfiguration().to(target, type, fieldName);
    }

    public static MethodDelegation to(Object target, Type type, String fieldName, MethodGraph.Compiler methodGraphCompiler) {
        return withDefaultConfiguration().to(target, type, fieldName, methodGraphCompiler);
    }

    public static MethodDelegation to(Object target, TypeDefinition typeDefinition) {
        return withDefaultConfiguration().to(target, typeDefinition);
    }

    public static MethodDelegation to(Object target, TypeDefinition typeDefinition, MethodGraph.Compiler methodGraphCompiler) {
        return withDefaultConfiguration().to(target, typeDefinition, methodGraphCompiler);
    }

    public static MethodDelegation to(Object target, TypeDefinition typeDefinition, String fieldName) {
        return withDefaultConfiguration().to(target, typeDefinition, fieldName);
    }

    public static MethodDelegation to(Object target, TypeDefinition typeDefinition, String fieldName, MethodGraph.Compiler methodGraphCompiler) {
        return withDefaultConfiguration().to(target, typeDefinition, fieldName, methodGraphCompiler);
    }

    public static MethodDelegation toConstructor(Class<?> type) {
        return withDefaultConfiguration().toConstructor(type);
    }

    public static MethodDelegation toConstructor(TypeDescription typeDescription) {
        return withDefaultConfiguration().toConstructor(typeDescription);
    }

    public static MethodDelegation toField(String name) {
        return withDefaultConfiguration().toField(name);
    }

    public static MethodDelegation toField(String name, FieldLocator.Factory fieldLocatorFactory) {
        return withDefaultConfiguration().toField(name, fieldLocatorFactory);
    }

    public static MethodDelegation toField(String name, MethodGraph.Compiler methodGraphCompiler) {
        return withDefaultConfiguration().toField(name, methodGraphCompiler);
    }

    public static MethodDelegation toField(String name, FieldLocator.Factory fieldLocatorFactory, MethodGraph.Compiler methodGraphCompiler) {
        return withDefaultConfiguration().toField(name, fieldLocatorFactory, methodGraphCompiler);
    }

    public static MethodDelegation toMethodReturnOf(String name) {
        return withDefaultConfiguration().toMethodReturnOf(name);
    }

    public static MethodDelegation toMethodReturnOf(String name, MethodGraph.Compiler methodGraphCompiler) {
        return withDefaultConfiguration().toMethodReturnOf(name, methodGraphCompiler);
    }
}
```

## MethodDelegation.ImplementationDelegate

```java
public class MethodDelegation implements Implementation.Composable {
    protected interface ImplementationDelegate extends InstrumentedType.Prepareable {
        Compiled compile(TypeDescription instrumentedType);
    }
}
```

## MethodDelegation.ImplementationDelegate.Compiled

```java
public class MethodDelegation implements Implementation.Composable {
    protected interface ImplementationDelegate extends InstrumentedType.Prepareable {
        interface Compiled {
            StackManipulation prepare(MethodDescription instrumentedMethod);

            MethodDelegationBinder.MethodInvoker invoke();

            List<MethodDelegationBinder.Record> getRecords();
        }
    }
}
```
