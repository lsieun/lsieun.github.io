---
title: "VarHandle 创建"
sequence: "102"
---

## Prepare

```java
public class VariableHandlesExample {
    public int publicTestVariable = 1;
    private int privateTestVariable = 1;
    public int variableToSet = 1;
    public int variableToCompareAndSet = 1;
    public int variableToGetAndAdd = 0;
    public byte variableToBitwiseOr = 0;
}
```

```java
import java.lang.invoke.VarHandle;
import java.util.List;

public class VarHandlePrintUtils {
    public static void printVarHandle(VarHandle varHandle) {
        System.out.println("varHandle = " + varHandle);
        List<Class<?>> classList = varHandle.coordinateTypes();

        int size = classList.size();
        System.out.println("    size = " + size);

        for (Class<?> clazz : classList) {
            System.out.println("    " + clazz.getName());
        }

        System.out.println("===========================");
    }
}
```

## Public Variables

```java
import java.lang.invoke.MethodHandles;
import java.lang.invoke.VarHandle;

public class A_Creation_01_PublicVariable {
    public static void main(String[] args) throws NoSuchFieldException, IllegalAccessException {
        Class<?> clazz = VariableHandlesExample.class;

        VarHandle PUBLIC_TEST_VARIABLE = MethodHandles
                .lookup()
                .in(clazz)
                .findVarHandle(clazz, "publicTestVariable", int.class);

        VarHandlePrintUtils.printVarHandle(PUBLIC_TEST_VARIABLE);
    }
}
```

```text
varHandle = VarHandle[varType=int, coord=[class lsieun.invoke.variable.VariableHandlesExample]]
    size = 1
    lsieun.invoke.variable.VariableHandlesExample
===========================
```

## Private Variables

```java
import java.lang.invoke.MethodHandles;
import java.lang.invoke.VarHandle;

public class A_Creation_02_PrivateVariable {
    public static void main(String[] args) throws IllegalAccessException, NoSuchFieldException {
        Class<?> clazz = VariableHandlesExample.class;
        
        VarHandle PRIVATE_TEST_VARIABLE = MethodHandles
                .privateLookupIn(clazz, MethodHandles.lookup())    // A. privateLookupIn
                .findVarHandle(clazz, "privateTestVariable", int.class);
        
        VarHandlePrintUtils.printVarHandle(PRIVATE_TEST_VARIABLE);
    }
}
```

```text
varHandle = VarHandle[varType=int, coord=[class lsieun.invoke.variable.VariableHandlesExample]]
    size = 1
    lsieun.invoke.variable.VariableHandlesExample
===========================
```

## Array

```java
import java.lang.invoke.MethodHandles;
import java.lang.invoke.VarHandle;

public class A_Creation_03_Array {
    public static void main(String[] args) {
        VarHandle arrayVarHandle = MethodHandles.arrayElementVarHandle(int[].class);

        VarHandlePrintUtils.printVarHandle(arrayVarHandle);
    }
}
```

```text
varHandle = VarHandle[varType=int, coord=[class [I, int]]
    size = 2
    [I
    int
===========================
```
