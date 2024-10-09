---
title: "Inner Class: Bytecode"
sequence: "105"
---

## First Example

```java
public class OuterClass {
    public class InnerClass {
    }
}
```

### OuterClass.class

```text
$ javap -v -p OuterClass.class

  Last modified Apr 20, 2022; size 347 bytes
  MD5 checksum 0fdd69d81abe46c637bc23868e285c9e
  Compiled from "OuterClass.java"
public class sample.OuterClass
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #3.#16         // java/lang/Object."<init>":()V
   #2 = Class              #17            // sample/OuterClass
   #3 = Class              #18            // java/lang/Object
   #4 = Class              #19            // sample/OuterClass$InnerClass
   #5 = Utf8               InnerClass
   #6 = Utf8               InnerClasses
   #7 = Utf8               <init>
   #8 = Utf8               ()V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               LocalVariableTable
  #12 = Utf8               this
  #13 = Utf8               Lsample/OuterClass;
  #14 = Utf8               SourceFile
  #15 = Utf8               OuterClass.java
  #16 = NameAndType        #7:#8          // "<init>":()V
  #17 = Utf8               sample/OuterClass
  #18 = Utf8               java/lang/Object
  #19 = Utf8               sample/OuterClass$InnerClass
{
  public sample.OuterClass();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 3: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lsample/OuterClass;
}
SourceFile: "OuterClass.java"
InnerClasses:
     public #5= #4 of #2; //InnerClass=class sample/OuterClass$InnerClass of class sample/OuterClass
```

### OuterClass$InnerClass

```text
$ javap -v -p OuterClass\$InnerClass.class

  Last modified Apr 20, 2022; size 477 bytes
  MD5 checksum 464c0f4ea8153747514274126250534a
  Compiled from "OuterClass.java"
public class sample.OuterClass$InnerClass
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Fieldref           #3.#19         // sample/OuterClass$InnerClass.this$0:Lsample/OuterClass;
   #2 = Methodref          #4.#20         // java/lang/Object."<init>":()V
   #3 = Class              #22            // sample/OuterClass$InnerClass
   #4 = Class              #23            // java/lang/Object
   #5 = Utf8               this$0
   #6 = Utf8               Lsample/OuterClass;
   #7 = Utf8               <init>
   #8 = Utf8               (Lsample/OuterClass;)V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               LocalVariableTable
  #12 = Utf8               this
  #13 = Utf8               InnerClass
  #14 = Utf8               InnerClasses
  #15 = Utf8               Lsample/OuterClass$InnerClass;
  #16 = Utf8               MethodParameters
  #17 = Utf8               SourceFile
  #18 = Utf8               OuterClass.java
  #19 = NameAndType        #5:#6          // this$0:Lsample/OuterClass;
  #20 = NameAndType        #7:#24         // "<init>":()V
  #21 = Class              #25            // sample/OuterClass
  #22 = Utf8               sample/OuterClass$InnerClass
  #23 = Utf8               java/lang/Object
  #24 = Utf8               ()V
  #25 = Utf8               sample/OuterClass
{
  final sample.OuterClass this$0;
    descriptor: Lsample/OuterClass;
    flags: ACC_FINAL, ACC_SYNTHETIC

  public sample.OuterClass$InnerClass(sample.OuterClass);
    descriptor: (Lsample/OuterClass;)V
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=2, args_size=2
         0: aload_0
         1: aload_1
         2: putfield      #1                  // Field this$0:Lsample/OuterClass;
         5: aload_0
         6: invokespecial #2                  // Method java/lang/Object."<init>":()V
         9: return
      LineNumberTable:
        line 4: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      10     0  this   Lsample/OuterClass$InnerClass;
            0      10     1 this$0   Lsample/OuterClass;
    MethodParameters:
      Name                           Flags
      this$0                         final mandated
}
SourceFile: "OuterClass.java"
InnerClasses:
     public #13= #3 of #21; //InnerClass=class sample/OuterClass$InnerClass of class sample/OuterClass
```

## Second Example

```java
public class HelloWorld {
    public void test() {
        OuterClass outerObject = new OuterClass();
        OuterClass.InnerClass innerObject = outerObject.new InnerClass();
    }
}
```

我想重点关注 `outerObject.new InnerClass()` 如何转换成 bytecode：

```text
$ javap -v -p HelloWorld.class

  Last modified Apr 20, 2022; size 650 bytes
  MD5 checksum 456a387c64caf2dcefc86e9b630b0884
  Compiled from "HelloWorld.java"
public class sample.HelloWorld
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #8.#25         // java/lang/Object."<init>":()V
   #2 = Class              #26            // sample/OuterClass
   #3 = Methodref          #2.#25         // sample/OuterClass."<init>":()V
   #4 = Class              #27            // sample/OuterClass$InnerClass
   #5 = Methodref          #8.#28         // java/lang/Object.getClass:()Ljava/lang/Class;
   #6 = Methodref          #4.#29         // sample/OuterClass$InnerClass."<init>":(Lsample/OuterClass;)V
   #7 = Class              #30            // sample/HelloWorld
   #8 = Class              #31            // java/lang/Object
   #9 = Utf8               <init>
  #10 = Utf8               ()V
  #11 = Utf8               Code
  #12 = Utf8               LineNumberTable
  #13 = Utf8               LocalVariableTable
  #14 = Utf8               this
  #15 = Utf8               Lsample/HelloWorld;
  #16 = Utf8               test
  #17 = Utf8               outerObject
  #18 = Utf8               Lsample/OuterClass;
  #19 = Utf8               innerObject
  #20 = Utf8               InnerClass
  #21 = Utf8               InnerClasses
  #22 = Utf8               Lsample/OuterClass$InnerClass;
  #23 = Utf8               SourceFile
  #24 = Utf8               HelloWorld.java
  #25 = NameAndType        #9:#10         // "<init>":()V
  #26 = Utf8               sample/OuterClass
  #27 = Utf8               sample/OuterClass$InnerClass
  #28 = NameAndType        #32:#33        // getClass:()Ljava/lang/Class;
  #29 = NameAndType        #9:#34         // "<init>":(Lsample/OuterClass;)V
  #30 = Utf8               sample/HelloWorld
  #31 = Utf8               java/lang/Object
  #32 = Utf8               getClass
  #33 = Utf8               ()Ljava/lang/Class;
  #34 = Utf8               (Lsample/OuterClass;)V
{
  public sample.HelloWorld();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return
      LineNumberTable:
        line 3: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       5     0  this   Lsample/HelloWorld;

  public void test();
    descriptor: ()V
    flags: ACC_PUBLIC
    Code:
      stack=4, locals=3, args_size=1
         0: new           #2                  // class sample/OuterClass
         3: dup
         4: invokespecial #3                  // Method sample/OuterClass."<init>":()V
         7: astore_1
         8: new           #4                  // class sample/OuterClass$InnerClass
        11: dup
        12: aload_1
        13: dup
        14: invokevirtual #5                  // Method java/lang/Object.getClass:()Ljava/lang/Class;
        17: pop
        18: invokespecial #6                  // Method sample/OuterClass$InnerClass."<init>":(Lsample/OuterClass;)V
        21: astore_2
        22: return
      LineNumberTable:
        line 5: 0
        line 6: 8
        line 7: 22
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      23     0  this   Lsample/HelloWorld;
            8      15     1 outerObject   Lsample/OuterClass;
           22       1     2 innerObject   Lsample/OuterClass$InnerClass;
}
SourceFile: "HelloWorld.java"
InnerClasses:
     public #20= #4 of #2; //InnerClass=class sample/OuterClass$InnerClass of class sample/OuterClass
```

