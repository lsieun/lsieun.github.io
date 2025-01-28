---
title: "Externalizable"
sequence: "101"
---

```java
package java.io;

public interface Externalizable extends Serializable {
    void writeExternal(ObjectOutput out) throws IOException;

    void readExternal(ObjectInput in) throws IOException, ClassNotFoundException;
}
```

```java
import java.io.Externalizable;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;

public class HelloWorld implements Externalizable {

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

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeUTF(name);
        out.writeInt(age);
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        this.name = in.readUTF();
        this.age = in.readInt();
    }
}
```

```text
HelloWorld instance = new HelloWorld();
instance.setName("Tom");
instance.setAge(10);
```

```text
STREAM_MAGIC       = 'ACED' (ACED)
STREAM_VERSION     = '0005' (0005)
TC_OBJECT          = '73' (TC_OBJECT)
    TC_CLASSDESC       = '72' (TC_CLASSDESC)
        className length   = '0011' (17)
        className          = '73616D706C652E48656C6C6F576F726C64' (sample.HelloWorld)
        serialVersionUID   = '0000000000001234' (4660)
        classDescFlags     = '0C' ([SC_EXTERNALIZABLE, SC_BLOCK_DATA])
        fields count       = '0000' (0)
    TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
    TC_NULL            = '70' (TC_NULL)
TC_BLOCKDATA       = '77' (TC_BLOCKDATA)
    size               = '09' (9)
    data               = '0003546F6D0000000A' (10)
TC_ENDBLOCKDATA    = '78' (TC_ENDBLOCKDATA)
```
