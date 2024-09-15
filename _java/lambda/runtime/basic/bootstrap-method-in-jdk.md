---
title: "bootstrap method(JDK)"
sequence: "101"
---

```text
                                                              ┌─── metafactory
                    ┌─── Java 08 ───┼─── LambdaMetafactory ───┤
                    │                                         └─── altMetafactory
                    │
bootstrap method ───┤                                           ┌─── makeConcat
                    ├─── Java 09 ───┼─── StringConcatFactory ───┤
                    │                                           └─── makeConcatWithConstants
                    │
                    └─── Java 16 ───┼─── ObjectMethods ───┼─── bootstrap
```

## Java 8

### LambdaMetafactory

```java
public final class LambdaMetafactory {
    public static CallSite metafactory(MethodHandles.Lookup caller,
                                       String interfaceMethodName,
                                       MethodType factoryType,
                                       MethodType interfaceMethodType,
                                       MethodHandle implementation,
                                       MethodType dynamicMethodType)
            throws LambdaConversionException {
        // ...
    }

    public static CallSite altMetafactory(MethodHandles.Lookup caller,
                                          String interfaceMethodName,
                                          MethodType factoryType,
                                          Object... args)
            throws LambdaConversionException {
        // ...
    }
}
```

## Java 9

### StringConcatFactory

```java
public final class StringConcatFactory {
    public static CallSite makeConcat(MethodHandles.Lookup lookup,
                                      String name,
                                      MethodType concatType) throws StringConcatException {
        // ...
    }

    public static CallSite makeConcatWithConstants(MethodHandles.Lookup lookup,
                                                   String name,
                                                   MethodType concatType,
                                                   String recipe,
                                                   Object... constants) {
        // ...
    }
}
```

```java
public class HelloWorld {
    public void test(String str, int val) {
        String result = str + val;
        System.out.println("result = " + result);
    }
}
```

```text
>javap -v -p sample.HelloWorld
Constant pool:
   #7 = InvokeDynamic      #0:#8          // #0:makeConcatWithConstants:(Ljava/lang/String;I)Ljava/lang/String;
  #17 = InvokeDynamic      #1:#18         // #1:makeConcatWithConstants:(Ljava/lang/String;)Ljava/lang/String;
  #49 = String             #50            // 
  #51 = String             #52            // result = 
  public void test(java.lang.String, int);
    descriptor: (Ljava/lang/String;I)V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=4, args_size=3
         0: aload_1
         1: iload_2
         2: invokedynamic #7,  0              // InvokeDynamic #0:makeConcatWithConstants:(Ljava/lang/String;I)Ljava/lang/String;
         7: astore_3
         8: getstatic     #11                 // Field java/lang/System.out:Ljava/io/PrintStream;
        11: aload_3
        12: invokedynamic #17,  0             // InvokeDynamic #1:makeConcatWithConstants:(Ljava/lang/String;)Ljava/lang/String;
        17: invokevirtual #20                 // Method java/io/PrintStream.println:(Ljava/lang/String;)V
        20: return
      LineNumberTable:
        line 7: 0
        line 8: 8
        line 9: 20
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      21     0  this   Lsample/HelloWorld;
            0      21     1   str   Ljava/lang/String;
            0      21     2   val   I
            8      13     3 result   Ljava/lang/String;
}
SourceFile: "HelloWorld.java"
BootstrapMethods:
  0: #43 invokestatic java/lang/invoke/StringConcatFactory.makeConcatWithConstants:(
        Ljava/lang/invoke/MethodHandles$Lookup;
        Ljava/lang/String;
        Ljava/lang/invoke/MethodType;
        Ljava/lang/String;
        [Ljava/lang/Object;)Ljava/lang/invoke/CallSite;
    Method arguments:
      #49 
  1: #43 invokestatic java/lang/invoke/StringConcatFactory.makeConcatWithConstants:(
        Ljava/lang/invoke/MethodHandles$Lookup;
        Ljava/lang/String;
        Ljava/lang/invoke/MethodType;
        Ljava/lang/String;
        [Ljava/lang/Object;)Ljava/lang/invoke/CallSite;
    Method arguments:
      #51 result = 
InnerClasses:
     public static final #58= #54 of #56; //Lookup=class java/lang/invoke/MethodHandles$Lookup of class java/lang/invoke/MethodHandles
```

## Java 16

### ObjectMethods

```java
public class ObjectMethods {
    public static Object bootstrap(MethodHandles.Lookup lookup, String methodName, TypeDescriptor type,
                                   Class<?> recordClass,
                                   String names,
                                   MethodHandle... getters) throws Throwable {
        // ...
    }
}
```
