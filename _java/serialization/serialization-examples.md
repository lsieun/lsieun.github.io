---
title: "Serialization Examples"
sequence: "105"
---

A basic structure is needed to represent objects in a stream.

> 在 stream 当中，一个 object 需要一定的 structure 来组织数据。

Each attribute of the **object** needs to be represented:
**its classes**, **its fields**, and **data** written and later read by class-specific methods.
The representation of **objects** in the stream can be described with a grammar.

> object = its class + its fields + data

There are special representations for `null` objects, **new objects**, **classes**, **arrays**, **strings**,
and **back references** to any object already in the stream.

> 特殊处理：null,

Each **object** written to the stream is assigned **a handle** that is used to refer back to the object.
Handles are assigned sequentially starting from `0x7E0000`.
The handles restart at `0x7E0000` when the stream is reset.

> handle

## null

```java
import java.io.IOException;

public class WriteObject {
    public static void main(String[] args) throws IOException {
        Object obj = null;

        SerializationUtils.write(obj, Const.OUTPUT_FILENAME);
    }
}
```

```text
AC ED 00 05 70
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_NULL            = '70' (TC_NULL)
```

## String

The representation of `String` objects consists of **length** information followed by the **contents** of the string encoded in modified UTF-8.

```java
import java.io.IOException;

public class WriteObject {
    public static void main(String[] args) throws IOException {
        Object obj = "abcd";

        SerializationUtils.write(obj, Const.OUTPUT_FILENAME);
    }
}
```

```text
AC ED 00 05 74 00 04 61 62 63 64
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_STRING          = '74' (TC_STRING)
    length             = '0004' (4)
    contents           = '61626364' (abcd)
```

## Class

A class object is represented by the following:

- Its `ObjectStreamClass` object.

An `ObjectStreamClass` object for a Class that is not a dynamic proxy class is represented by the following:

- The Stream Unique Identifier (SUID) of compatible classes.
- A set of flags indicating various properties of the class,
  such as whether the class defines a `writeObject` method,
  and whether the class is serializable, externalizable, or an enum type
- The number of serializable fields
- The array of fields of the class that are serialized by the default mechanismFor arrays and object fields,
  the type of the field is included as a string which must be in "field descriptor" format (e.g., "Ljava/lang/Object;") as specified in The Java Virtual Machine Specification.
- Optional block-data records or objects written by the `annotateClass` method
- The `ObjectStreamClass` of its supertype (null if the superclass is not serializable)

An `ObjectStreamClass` object for a **dynamic proxy class** is represented by the following:

- The number of interfaces that the dynamic proxy class implements
- The names of all of the interfaces implemented by the dynamic proxy class, listed in the order that they are returned by invoking the getInterfaces method on the Class object.
- Optional block-data records or objects written by the annotateProxyClass method.
- The ObjectStreamClass of its supertype, java.lang.reflect.Proxy.

### Object

```java
import java.io.IOException;

public class WriteObject {
    public static void main(String[] args) throws IOException {
        Object obj = Object.class;

        SerializationUtils.write(obj, Const.OUTPUT_FILENAME);
    }
}
```

```text
AC ED 00 05 76 72 00 10 6A 61 76 61 2E 6C 61 6E 67 2E 4F 62 6A 65 63 74 00 00 00 00 00 00 00 00
00 00 00 78 70
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_CLASS           = '76' (TC_CLASS)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        length             = '0010' (16)
        className          = '6A6176612E6C616E672E4F626A656374' (java.lang.Object)
        serialVersionUID   = '0000000000000000' (0)
        classDescFlags     = '00' ([])
        fields count       = '0000' (0)
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_NULL            = '70' (TC_NULL)
```

### Integer

```java
import java.io.IOException;

public class WriteObject {
    public static void main(String[] args) throws IOException {
        Object obj = Integer.class;

        SerializationUtils.write(obj, Const.OUTPUT_FILENAME);
    }
}
```

```text
AC ED 00 05 76 72 00 11 6A 61 76 61 2E 6C 61 6E 67 2E 49 6E 74 65 67 65 72 12 E2 A0 A4 F7 81 87
38 02 00 01 49 00 05 76 61 6C 75 65 78 72 00 10 6A 61 76 61 2E 6C 61 6E 67 2E 4E 75 6D 62 65 72
86 AC 95 1D 0B 94 E0 8B 02 00 00 78 70
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_CLASS           = '76' (TC_CLASS)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        length             = '0011' (17)
        className          = '6A6176612E6C616E672E496E7465676572' (java.lang.Integer)
        serialVersionUID   = '12E2A0A4F7818738' (1360826667806852920)
        classDescFlags     = '02' ([SC_SERIALIZABLE])
        fields count       = '0001' (1)
        field[0] {
            type               = '49' (I: int)
            length             = '0005' (5)
            name               = '76616C7565' (value)
        }
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        length             = '0010' (16)
        className          = '6A6176612E6C616E672E4E756D626572' (java.lang.Number)
        serialVersionUID   = '86AC951D0B94E08B' (-8742448824652078965)
        classDescFlags     = '02' ([SC_SERIALIZABLE])
        fields count       = '0000' (0)
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_NULL            = '70' (TC_NULL)
```

### Proxy

```java
import java.io.IOException;
import java.lang.reflect.Proxy;

public class WriteObject {
    public static void main(String[] args) throws IOException {
        Object obj = Proxy.class;

        SerializationUtils.write(obj, Const.OUTPUT_FILENAME);
    }
}
```

```text
AC ED 00 05 76 72 00 17 6A 61 76 61 2E 6C 61 6E 67 2E 72 65 66 6C 65 63 74 2E 50 72 6F 78 79 E1
27 DA 20 CC 10 43 CB 02 00 01 4C 00 01 68 74 00 25 4C 6A 61 76 61 2F 6C 61 6E 67 2F 72 65 66 6C
65 63 74 2F 49 6E 76 6F 63 61 74 69 6F 6E 48 61 6E 64 6C 65 72 3B 78 70
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_CLASS           = '76' (TC_CLASS)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        length             = '0017' (23)
        className          = '6A6176612E6C616E672E7265666C6563742E50726F7879' (java.lang.reflect.Proxy)
        serialVersionUID   = 'E127DA20CC1043CB' (-2222568056686623797)
        classDescFlags     = '02' ([SC_SERIALIZABLE])
        fields count       = '0001' (1)
        field[0] {
            type               = '4C' (L: object)
            length             = '0001' (1)
            name               = '68' (h)
            TC_STRING          = '74' (TC_STRING)
                length             = '0025' (37)
                contents           = '4C6A6176612F6C616E672F7265666C6563742F496E766F636174696F6E48616E646C65723B' (Ljava/lang/reflect/InvocationHandler;)
        }
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_NULL            = '70' (TC_NULL)
```

### SerializedLambda

```java
import java.io.IOException;
import java.lang.invoke.SerializedLambda;

public class WriteObject {
    public static void main(String[] args) throws IOException {
        Object obj = SerializedLambda.class;

        SerializationUtils.write(obj, Const.OUTPUT_FILENAME);
    }
}
```

```text
AC ED 00 05 76 72 00 21 6A 61 76 61 2E 6C 61 6E 67 2E 69 6E 76 6F 6B 65 2E 53 65 72 69 61 6C 69
7A 65 64 4C 61 6D 62 64 61 6F 61 D0 94 2C 29 36 85 02 00 0A 49 00 0E 69 6D 70 6C 4D 65 74 68 6F
64 4B 69 6E 64 5B 00 0C 63 61 70 74 75 72 65 64 41 72 67 73 74 00 13 5B 4C 6A 61 76 61 2F 6C 61
6E 67 2F 4F 62 6A 65 63 74 3B 4C 00 0E 63 61 70 74 75 72 69 6E 67 43 6C 61 73 73 74 00 11 4C 6A
61 76 61 2F 6C 61 6E 67 2F 43 6C 61 73 73 3B 4C 00 18 66 75 6E 63 74 69 6F 6E 61 6C 49 6E 74 65
72 66 61 63 65 43 6C 61 73 73 74 00 12 4C 6A 61 76 61 2F 6C 61 6E 67 2F 53 74 72 69 6E 67 3B 4C
00 1D 66 75 6E 63 74 69 6F 6E 61 6C 49 6E 74 65 72 66 61 63 65 4D 65 74 68 6F 64 4E 61 6D 65 71
00 7E 00 03 4C 00 22 66 75 6E 63 74 69 6F 6E 61 6C 49 6E 74 65 72 66 61 63 65 4D 65 74 68 6F 64
53 69 67 6E 61 74 75 72 65 71 00 7E 00 03 4C 00 09 69 6D 70 6C 43 6C 61 73 73 71 00 7E 00 03 4C
00 0E 69 6D 70 6C 4D 65 74 68 6F 64 4E 61 6D 65 71 00 7E 00 03 4C 00 13 69 6D 70 6C 4D 65 74 68
6F 64 53 69 67 6E 61 74 75 72 65 71 00 7E 00 03 4C 00 16 69 6E 73 74 61 6E 74 69 61 74 65 64 4D
65 74 68 6F 64 54 79 70 65 71 00 7E 00 03 78 70
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_CLASS           = '76' (TC_CLASS)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        length             = '0021' (33)
        className          = '6A6176612E6C616E672E696E766F6B652E53657269616C697A65644C616D626461' (java.lang.invoke.SerializedLambda)
        serialVersionUID   = '6F61D0942C293685' (8025925345765570181)
        classDescFlags     = '02' ([SC_SERIALIZABLE])
        fields count       = '000A' (10)
        field[0] {
            type               = '49' (I: int)
            length             = '000E' (14)
            name               = '696D706C4D6574686F644B696E64' (implMethodKind)
        }
        field[1] {
            type               = '5B' ([: array)
            length             = '000C' (12)
            name               = '636170747572656441726773' (capturedArgs)
            TC_STRING          = '74' (TC_STRING)
                length             = '0013' (19)
                type               = '5B4C6A6176612F6C616E672F4F626A6563743B' ([Ljava/lang/Object;)
        }
        field[2] {
            type               = '4C' (L: object)
            length             = '000E' (14)
            name               = '636170747572696E67436C617373' (capturingClass)
            TC_STRING          = '74' (TC_STRING)
                length             = '0011' (17)
                contents           = '4C6A6176612F6C616E672F436C6173733B' (Ljava/lang/Class;)
        }
        field[3] {
            type               = '4C' (L: object)
            length             = '0018' (24)
            name               = '66756E6374696F6E616C496E74657266616365436C617373' (functionalInterfaceClass)
            TC_STRING          = '74' (TC_STRING)
                length             = '0012' (18)
                contents           = '4C6A6176612F6C616E672F537472696E673B' (Ljava/lang/String;)
        }
        field[4] {
            type               = '4C' (L: object)
            length             = '001D' (29)
            name               = '66756E6374696F6E616C496E746572666163654D6574686F644E616D65' (functionalInterfaceMethodName)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }
        field[5] {
            type               = '4C' (L: object)
            length             = '0022' (34)
            name               = '66756E6374696F6E616C496E746572666163654D6574686F645369676E6174757265' (functionalInterfaceMethodSignature)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }
        field[6] {
            type               = '4C' (L: object)
            length             = '0009' (9)
            name               = '696D706C436C617373' (implClass)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }
        field[7] {
            type               = '4C' (L: object)
            length             = '000E' (14)
            name               = '696D706C4D6574686F644E616D65' (implMethodName)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }
        field[8] {
            type               = '4C' (L: object)
            length             = '0013' (19)
            name               = '696D706C4D6574686F645369676E6174757265' (implMethodSignature)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }
        field[9] {
            type               = '4C' (L: object)
            length             = '0016' (22)
            name               = '696E7374616E7469617465644D6574686F6454797065' (instantiatedMethodType)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_NULL            = '70' (TC_NULL)
```

## Object

```java
import java.io.Serializable;

public class HelloWorld implements Serializable {

    private static final long serialVersionUID = 0x1234L;

    private String name;
    private int age;

    public HelloWorld() {
        System.out.println("create instance");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

```text
HelloWorld instance = new HelloWorld();
instance.setName("Tom");
instance.setAge(10);
```

```text
AC ED 00 05 73 72 00 11 73 61 6D 70 6C 65 2E 48 65 6C 6C 6F 57 6F 72 6C 64 00 00 00 00 00 00 12
34 02 00 02 49 00 03 61 67 65 4C 00 04 6E 61 6D 65 74 00 12 4C 6A 61 76 61 2F 6C 61 6E 67 2F 53
74 72 69 6E 67 3B 78 70 00 00 00 0A 74 00 03 54 6F 6D
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_OBJECT          = '73' (TC_OBJECT)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        className length   = '0011' (17)
        className          = '73616D706C652E48656C6C6F576F726C64' (sample.HelloWorld)
        serialVersionUID   = '0000000000001234' (4660)
        classDescFlags     = '02' ([SC_SERIALIZABLE])
        fields count       = '0002' (2)
        field[0] {         = '' (NO DATA)
            field type         = '49' (I: int)
            field name length  = '0003' (3)
            field name         = '616765' (age)
        }                  = '' (NO DATA)
        field[1] {         = '' (NO DATA)
            field type         = '4C' (L: object)
            field name length  = '0004' (4)
            field name         = '6E616D65' (name)
            TC_STRING          = '74' (TC_STRING)
                type length        = '0012' (18)
                type               = '4C6A6176612F6C616E672F537472696E673B' (Ljava/lang/String;)
        }                  = '' (NO DATA)
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_NULL            = '70' (TC_NULL)
    int value          = '0000000A' (10)
    TC_STRING          = '74' (TC_STRING)
        type length        = '0003' (3)
        type               = '546F6D' (Tom)
```

## Class

```text
Object obj = Integer.class;
```

```text
AC ED 00 05 76 72 00 11 6A 61 76 61 2E 6C 61 6E 67 2E 49 6E 74 65 67 65 72 12 E2 A0 A4 F7 81 87
38 02 00 01 49 00 05 76 61 6C 75 65 78 72 00 10 6A 61 76 61 2E 6C 61 6E 67 2E 4E 75 6D 62 65 72
86 AC 95 1D 0B 94 E0 8B 02 00 00 78 70
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_CLASS           = '76' (TC_CLASS)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        className length   = '0011' (17)
        className          = '6A6176612E6C616E672E496E7465676572' (java.lang.Integer)
        serialVersionUID   = '12E2A0A4F7818738' (1360826667806852920)
        classDescFlags     = '02' ([SC_SERIALIZABLE])
        fields count       = '0001' (1)
        field[0] {         = '' (NO DATA)
            field type         = '49' (I: int)
            field name length  = '0005' (5)
            field name         = '76616C7565' (value)
        }                  = '' (NO DATA)
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        className length   = '0010' (16)
        className          = '6A6176612E6C616E672E4E756D626572' (java.lang.Number)
        serialVersionUID   = '86AC951D0B94E08B' (-8742448824652078965)
        classDescFlags     = '02' ([SC_SERIALIZABLE])
        fields count       = '0000' (0)
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_NULL            = '70' (TC_NULL)
```

## Array List - TC_BLOCKDATA

```text
List<String> list = new ArrayList<>();
list.add("Hello");
list.add("World");
```

```text
AC ED 00 05 73 72 00 13 6A 61 76 61 2E 75 74 69 6C 2E 41 72 72 61 79 4C 69 73 74 78 81 D2 1D 99
C7 61 9D 03 00 01 49 00 04 73 69 7A 65 78 70 00 00 00 02 77 04 00 00 00 02 74 00 05 48 65 6C 6C
6F 74 00 05 57 6F 72 6C 64 78
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_OBJECT          = '73' (TC_OBJECT)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        className length   = '0013' (19)
        className          = '6A6176612E7574696C2E41727261794C697374' (java.util.ArrayList)
        serialVersionUID   = '7881D21D99C7619D' (8683452581122892189)
        classDescFlags     = '03' ([SC_WRITE_METHOD, SC_SERIALIZABLE])
        fields count       = '0001' (1)
        field[0] {         = '' (NO DATA)
            field type         = '49' (I: int)
            field name length  = '0004' (4)
            field name         = '73697A65' (size)
        }                  = '' (NO DATA)
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_NULL            = '70' (TC_NULL)
    int value          = '00000002' (2)
TC_BLOCKDATA       = '77' (TC_BLOCKDATA)
    size               = '04' (4)
    data               = '00000002' (2)
TC_STRING          = '74' (TC_STRING)
    type length        = '0005' (5)
    type               = '48656C6C6F' (Hello)
TC_STRING          = '74' (TC_STRING)
    type length        = '0005' (5)
    type               = '576F726C64' (World)
TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
```

## Serializable Lambda

```java
import java.io.Serializable;
import java.util.function.Function;

public class LambdaCapture {
    public static Object getLambda() {
        Function<String, String> func = (Function<String, String> & Serializable) name -> String.format("my name is %s", name);
        return func;
    }
}
```

```text
AC ED 00 05 73 72 00 21 6A 61 76 61 2E 6C 61 6E 67 2E 69 6E 76 6F 6B 65 2E 53 65 72 69 61 6C 69
7A 65 64 4C 61 6D 62 64 61 6F 61 D0 94 2C 29 36 85 02 00 0A 49 00 0E 69 6D 70 6C 4D 65 74 68 6F
64 4B 69 6E 64 5B 00 0C 63 61 70 74 75 72 65 64 41 72 67 73 74 00 13 5B 4C 6A 61 76 61 2F 6C 61
6E 67 2F 4F 62 6A 65 63 74 3B 4C 00 0E 63 61 70 74 75 72 69 6E 67 43 6C 61 73 73 74 00 11 4C 6A
61 76 61 2F 6C 61 6E 67 2F 43 6C 61 73 73 3B 4C 00 18 66 75 6E 63 74 69 6F 6E 61 6C 49 6E 74 65
72 66 61 63 65 43 6C 61 73 73 74 00 12 4C 6A 61 76 61 2F 6C 61 6E 67 2F 53 74 72 69 6E 67 3B 4C
00 1D 66 75 6E 63 74 69 6F 6E 61 6C 49 6E 74 65 72 66 61 63 65 4D 65 74 68 6F 64 4E 61 6D 65 71
00 7E 00 03 4C 00 22 66 75 6E 63 74 69 6F 6E 61 6C 49 6E 74 65 72 66 61 63 65 4D 65 74 68 6F 64
53 69 67 6E 61 74 75 72 65 71 00 7E 00 03 4C 00 09 69 6D 70 6C 43 6C 61 73 73 71 00 7E 00 03 4C
00 0E 69 6D 70 6C 4D 65 74 68 6F 64 4E 61 6D 65 71 00 7E 00 03 4C 00 13 69 6D 70 6C 4D 65 74 68
6F 64 53 69 67 6E 61 74 75 72 65 71 00 7E 00 03 4C 00 16 69 6E 73 74 61 6E 74 69 61 74 65 64 4D
65 74 68 6F 64 54 79 70 65 71 00 7E 00 03 78 70 00 00 00 06 75 72 00 13 5B 4C 6A 61 76 61 2E 6C
61 6E 67 2E 4F 62 6A 65 63 74 3B 90 CE 58 9F 10 73 29 6C 02 00 00 78 70 00 00 00 00 76 72 00 14
73 61 6D 70 6C 65 2E 4C 61 6D 62 64 61 43 61 70 74 75 72 65 00 00 00 00 00 00 00 00 00 00 00 78
70 74 00 1B 6A 61 76 61 2F 75 74 69 6C 2F 66 75 6E 63 74 69 6F 6E 2F 46 75 6E 63 74 69 6F 6E 74
00 05 61 70 70 6C 79 74 00 26 28 4C 6A 61 76 61 2F 6C 61 6E 67 2F 4F 62 6A 65 63 74 3B 29 4C 6A
61 76 61 2F 6C 61 6E 67 2F 4F 62 6A 65 63 74 3B 74 00 14 73 61 6D 70 6C 65 2F 4C 61 6D 62 64 61
43 61 70 74 75 72 65 74 00 1B 6C 61 6D 62 64 61 24 67 65 74 4C 61 6D 62 64 61 24 36 38 35 30 62
33 32 61 24 31 74 00 26 28 4C 6A 61 76 61 2F 6C 61 6E 67 2F 53 74 72 69 6E 67 3B 29 4C 6A 61 76
61 2F 6C 61 6E 67 2F 53 74 72 69 6E 67 3B 71 00 7E 00 0E
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_OBJECT          = '73' (TC_OBJECT)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        className length   = '0021' (33)
        className          = '6A6176612E6C616E672E696E766F6B652E53657269616C697A65644C616D626461' (java.lang.invoke.SerializedLambda)
        serialVersionUID   = '6F61D0942C293685' (8025925345765570181)
        classDescFlags     = '02' ([SC_SERIALIZABLE])
        fields count       = '000A' (10)
        field[0] {         = '' (NO DATA)
            field type         = '49' (I: int)
            field name length  = '000E' (14)
            field name         = '696D706C4D6574686F644B696E64' (implMethodKind)
        }                  = '' (NO DATA)
        field[1] {         = '' (NO DATA)
            field type         = '5B' ([: array)
            field name length  = '000C' (12)
            field name         = '636170747572656441726773' (capturedArgs)
            TC_STRING          = '74' (TC_STRING)
                type length        = '0013' (19)
                type               = '5B4C6A6176612F6C616E672F4F626A6563743B' ([Ljava/lang/Object;)
        }                  = '' (NO DATA)
        field[2] {         = '' (NO DATA)
            field type         = '4C' (L: object)
            field name length  = '000E' (14)
            field name         = '636170747572696E67436C617373' (capturingClass)
            TC_STRING          = '74' (TC_STRING)
                type length        = '0011' (17)
                type               = '4C6A6176612F6C616E672F436C6173733B' (Ljava/lang/Class;)
        }                  = '' (NO DATA)
        field[3] {         = '' (NO DATA)
            field type         = '4C' (L: object)
            field name length  = '0018' (24)
            field name         = '66756E6374696F6E616C496E74657266616365436C617373' (functionalInterfaceClass)
            TC_STRING          = '74' (TC_STRING)
                type length        = '0012' (18)
                type               = '4C6A6176612F6C616E672F537472696E673B' (Ljava/lang/String;)
        }                  = '' (NO DATA)
        field[4] {         = '' (NO DATA)
            field type         = '4C' (L: object)
            field name length  = '001D' (29)
            field name         = '66756E6374696F6E616C496E746572666163654D6574686F644E616D65' (functionalInterfaceMethodName)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }                  = '' (NO DATA)
        field[5] {         = '' (NO DATA)
            field type         = '4C' (L: object)
            field name length  = '0022' (34)
            field name         = '66756E6374696F6E616C496E746572666163654D6574686F645369676E6174757265' (functionalInterfaceMethodSignature)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }                  = '' (NO DATA)
        field[6] {         = '' (NO DATA)
            field type         = '4C' (L: object)
            field name length  = '0009' (9)
            field name         = '696D706C436C617373' (implClass)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }                  = '' (NO DATA)
        field[7] {         = '' (NO DATA)
            field type         = '4C' (L: object)
            field name length  = '000E' (14)
            field name         = '696D706C4D6574686F644E616D65' (implMethodName)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }                  = '' (NO DATA)
        field[8] {         = '' (NO DATA)
            field type         = '4C' (L: object)
            field name length  = '0013' (19)
            field name         = '696D706C4D6574686F645369676E6174757265' (implMethodSignature)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }                  = '' (NO DATA)
        field[9] {         = '' (NO DATA)
            field type         = '4C' (L: object)
            field name length  = '0016' (22)
            field name         = '696E7374616E7469617465644D6574686F6454797065' (instantiatedMethodType)
            TC_REFERENCE       = '71' (TC_REFERENCE)
                handle             = '007E0003' (007E0003)
        }                  = '' (NO DATA)
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_NULL            = '70' (TC_NULL)
    int value          = '00000006' (6)
    TC_ARRAY           = '75' (TC_ARRAY)
        TC_CLASSDESC       = '72' (TC_CLASSDESC)
            className length   = '0013' (19)
            className          = '5B4C6A6176612E6C616E672E4F626A6563743B' ([Ljava.lang.Object;)
            serialVersionUID   = '90CE589F1073296C' (-8012369246846506644)
            classDescFlags     = '02' ([SC_SERIALIZABLE])
            fields count       = '0000' (0)
        TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
        TC_NULL            = '70' (TC_NULL)
        newHandle          = '00000000' (00000000)
    TC_CLASS           = '76' (TC_CLASS)
        TC_CLASSDESC       = '72' (TC_CLASSDESC)
            className length   = '0014' (20)
            className          = '73616D706C652E4C616D62646143617074757265' (sample.LambdaCapture)
            serialVersionUID   = '0000000000000000' (0)
            classDescFlags     = '00' ([])
            fields count       = '0000' (0)
        TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
        TC_NULL            = '70' (TC_NULL)
    TC_STRING          = '74' (TC_STRING)
        type length        = '001B' (27)
        type               = '6A6176612F7574696C2F66756E6374696F6E2F46756E6374696F6E' (java/util/function/Function)
    TC_STRING          = '74' (TC_STRING)
        type length        = '0005' (5)
        type               = '6170706C79' (apply)
    TC_STRING          = '74' (TC_STRING)
        type length        = '0026' (38)
        type               = '284C6A6176612F6C616E672F4F626A6563743B294C6A6176612F6C616E672F4F626A6563743B' ((Ljava/lang/Object;)Ljava/lang/Object;)
    TC_STRING          = '74' (TC_STRING)
        type length        = '0014' (20)
        type               = '73616D706C652F4C616D62646143617074757265' (sample/LambdaCapture)
    TC_STRING          = '74' (TC_STRING)
        type length        = '001B' (27)
        type               = '6C616D626461246765744C616D6264612436383530623332612431' (lambda$getLambda$6850b32a$1)
    TC_STRING          = '74' (TC_STRING)
        type length        = '0026' (38)
        type               = '284C6A6176612F6C616E672F537472696E673B294C6A6176612F6C616E672F537472696E673B' ((Ljava/lang/String;)Ljava/lang/String;)
    TC_REFERENCE       = '71' (TC_REFERENCE)
        handle             = '007E000E' (007E000E)
```
