---
title: "ja-netfilter 分析"
sequence: "159"
---

[UP]({% link _java-agent/java-agent-01.md %})

## Project

[mini-jn](https://gitee.com/lsieun/mini-jn)

```text
mini-jn
├─── pom.xml
├─── src
│    └─── main
│         └─── java
│              ├─── boot
│              │    └─── filter
│              │         ├─── BigIntegerFilter.java
│              │         ├─── HttpClientFilter.java
│              │         ├─── InetAddressFilter.java
│              │         ├─── LinkedTreeMapFilter.java
│              │         └─── VMManagementImplFilter.java
│              ├─── jn
│              │    ├─── agent
│              │    │    └─── LoadTimeAgent.java
│              │    ├─── asm
│              │    │    ├─── MyClassNode.java
│              │    │    └─── tree
│              │    │         ├─── BigIntegerNode.java
│              │    │         ├─── HttpClientNode.java
│              │    │         ├─── InetAddressNode.java
│              │    │         ├─── LinkedTreeMapNode.java
│              │    │         └─── VMManagementImplNode.java
│              │    ├─── cst
│              │    │    └─── Const.java
│              │    ├─── Main.java
│              │    └─── utils
│              │         ├─── ClassUtils.java
│              │         ├─── FileUtils.java
│              │         └─── TransformerUtils.java
│              ├─── run
│              │    └─── instrument
│              │         └─── StaticInstrumentation.java
│              └─── sample
│                   └─── Program.java
└─── target
     ├─── boot-support.jar
     └─── mini-jn.jar
```

```text
$ mvn clean package
$ cd ./target/classes/
$ jar -cvf boot-support.jar boot/
$ mv boot-support.jar ../
```

## 测试

### VMManagementImpl

```java
package sample;

import sun.management.VMManagement;

import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.lang.reflect.Field;
import java.util.List;

public class Program {
    public static void main(String[] args) throws Exception {
        RuntimeMXBean runtime = ManagementFactory.getRuntimeMXBean();
        Field jvm = runtime.getClass().getDeclaredField("jvm");
        jvm.setAccessible(true);
        VMManagement mgmt = (sun.management.VMManagement) jvm.get(runtime);
        System.out.println(mgmt.getClass());
        
        List<String> vmArguments = mgmt.getVmArguments();
        for (String item : vmArguments) {
            System.out.println(item);
        }
    }
}
```

第一次运行：

```text
$ java -cp ./target/classes/ -Duser.language=en -Duser.country=US -Djanf.debug=true sample.Program

class sun.management.VMManagementImpl
-Duser.language=en
-Duser.country=US
-Djanf.debug=true
```

第二次运行：

```text
$ java -cp ./target/classes/ -Duser.language=en -Duser.country=US -Djanf.debug=true -javaagent:./target/mini-jn.jar sample.Program

Premain-Class: jn.agent.LoadTimeAgent
Can-Redefine-Classes: true
Can-Retransform-Classes: true
Can-Set-Native-Method-Prefix: true
========= ========= =========
class sun.management.VMManagementImpl
-Duser.language=en
-Duser.country=US
```

### InetAddress

```java
package sample;

import java.net.InetAddress;

public class Program {
    public static void main(String[] args) throws Exception {
        getAllByName();
        isReachable();
    }

    private static void getAllByName() {
        try {
            String host = "jetbrains.com";
            InetAddress[] addresses = InetAddress.getAllByName(host);
            System.out.println("host: " + host);
            for (InetAddress item : addresses) {
                System.out.println("    " + item);
            }
        } catch (Exception ignored) {
        }
    }

    private static void isReachable() {
        try {
            String host = "jetbrains.com";
            String ip = "13.33.141.66";
            String[] array = ip.split("\\.");
            byte[] ip_bytes = new byte[4];
            for (int i = 0; i < 4; i++) {
                ip_bytes[i] = (byte) (Integer.parseInt(array[i]) & 0xff);
            }
            InetAddress address = InetAddress.getByAddress(host, ip_bytes);
            boolean reachable = address.isReachable(2000);
            System.out.println(reachable);
        } catch (Exception ignored) {
        }
    }
}
```

第一次运行：

```text
$ java -cp ./target/classes/ sample.Program
host: jetbrains.com
    jetbrains.com/13.33.141.66
    jetbrains.com/13.33.141.72
    jetbrains.com/13.33.141.29
    jetbrains.com/13.33.141.64
true
```

第二次运行：

```text
$ java -cp ./target/classes/ -javaagent:./target/mini-jn.jar sample.Program
Premain-Class: jn.agent.LoadTimeAgent
Can-Redefine-Classes: true
Can-Retransform-Classes: true
Can-Set-Native-Method-Prefix: true
========= ========= =========
Reject dns query: jetbrains.com
Reject dns reachable test: jetbrains.com
false
```

### HttpClient

```java
package sample;

import java.net.URL;
import java.net.URLConnection;

public class Program {
    public static void main(String[] args) throws Exception {
        URL url = new URL("https://account.jetbrains.com/lservice/rpc/validateKey.action");
        URLConnection urlConnection = url.openConnection();
        urlConnection.connect();
    }
}
```

第一次运行：

```text
$ java -cp ./target/classes/ sample.Program

```

第二次运行：

```text
$ java -cp ./target/classes/ -javaagent:./target/mini-jn.jar sample.Program
Premain-Class: jn.agent.LoadTimeAgent
Can-Redefine-Classes: true
Can-Retransform-Classes: true
Can-Set-Native-Method-Prefix: true
========= ========= =========
Exception in thread "main" java.net.SocketTimeoutException: connect timed out
        at boot.filter.HttpClientFilter.testURL(HttpClientFilter.java:15)
        at sun.net.www.http.HttpClient.openServer(Unknown Source)
```

### LinkedTreeMap

```java
package sample;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jn.cst.Const;

public class Program {
    public static void main(String[] args) throws Exception {
        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        Object obj = gson.fromJson(Const.LICENSE_JSON, Object.class);
        System.out.println(gson.toJson(obj));
    }
}
```

第一次运行：

```text
$ java -cp ./target/classes/\;./target/lib/gson-2.8.9.jar sample.Program
{
  "licenseId": "HELLOWORLD",
  "licenseeName": "Jerry",
  "products": [
    {
      "code": "II",
      "fallbackDate": "2020-01-10",
      "paidUpTo": "2021-01-09"
    }
  ],
  "gracePeriodDays": 7.0,
  "autoProlongated": false,
  "isAutoProlongated": false
}
```

第二次运行：

```text
$ java -cp ./target/classes/ -javaagent:./target/mini-jn.jar sample.Program
Premain-Class: jn.agent.LoadTimeAgent
Can-Redefine-Classes: true
Can-Retransform-Classes: true
Can-Set-Native-Method-Prefix: true
========= ========= =========
{
  "licenseId": "HELLOWORLD",
  "licenseeName": "Tom",
  "products": [
    {
      "code": "II",
      "fallbackDate": "2020-01-10",
      "paidUpTo": "2022-12-31"
    }
  ],
  "gracePeriodDays": "30",
  "autoProlongated": false,
  "isAutoProlongated": false
}
```

### BigInteger

```java
package sample;

import java.math.BigInteger;

public class Program {
    public static void main(String[] args) {
        // a^b mod c
        BigInteger a = new BigInteger("5");
        BigInteger b = new BigInteger("3");
        BigInteger c = new BigInteger("101");

        BigInteger actualValue = a.modPow(b, c);
        System.out.println(actualValue);

        BigInteger expectedValue = new BigInteger("21");
        System.out.println(expectedValue);
    }
}
```

第一次运行：

```text
$ java -cp ./target/classes/ sample.Program
24
21
```

第二次运行：

```text
$ java -cp ./target/classes/ -javaagent:./target/mini-jn.jar sample.Program
Premain-Class: jn.agent.LoadTimeAgent
Can-Redefine-Classes: true
Can-Retransform-Classes: true
Can-Set-Native-Method-Prefix: true
========= ========= =========
21
21
```
