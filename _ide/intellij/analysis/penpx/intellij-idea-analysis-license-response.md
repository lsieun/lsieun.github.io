---
title: "License: XxxResponse"
sequence: "103"
---

[UP](/ide/intellij-idea-index.html)

### 发送请求

- product.jar

```text
com.intellij.ide.[x].[x].[x]::[x](String url, ...) {
    slots[0] = https://In.God.We.Trust <-- url
    // ...
    invokedynamic ...SomeMethod...  --> objA
    getfield   objA.xxxField
    checkcast com/jetbrains/ls/responses/ObtainTicketResponse
    invokevirtual ObtainTicketResponse.getResponseCode()  --> 判断是不是 OK
    invokevirtual ObtainTicketResponse.getSignature()
    invokestatic com/jetbrains/[x]/[x]/[x]::[x]:(Ljava/lang/Object;J)Ljava/lang/String; --> 将 ObtainTicketResponse 转换成 XML 
    // ...
    invokestatic com/jetbrains/[x]/[Q]/[B]::[b]:(Ljava/lang/String;JLjava/lang/String;[Lcom/jetbrains/b/Q/a;)V --> 验证 XML 和 signature
    invokevirtual ObtainTicketResponse.getTicketId()             <-- String
    invokevirtual ObtainTicketResponse.getProlongationPeriod()   <-- long
    invokevirtual ObtainTicketResponse.getConfirmationStamp()    <-- String
    invokevirtual ObtainTicketResponse.parseTicketProperties()   <-- Map
    // 将上面这些 TicketId、ProlongationPeriod、ConfirmationStamp 和 Map 封装成一个类，暂且表示为 Ticket 类
    // url - https://In.God.We.Trust - String
    // TicketId                      - String
    // ProlongationPeriod            - long
    // ConfirmationStamp             - String
    // TicketProperties              - Map
    // someValue                     - long
    invokevirtual b:(Ljava/lang/String;Ljava/lang/String;JLjava/lang/String;Ljava/util/Map;J)Lcom/intellij/ide/[x]/[x]/[Ticket];
    // 将 Ticket 对象传入下面这个方法，主要是对 ConfirmationStamp 进行验证
    invokeinterface com.intellij.ide.[b].[h]::[b]:(Lcom/intellij/b/Q/Q;)Z 出现异常：The floating ticket does not match this machine
    // 如果上面方法不出现异常，就会返回 Ticket 对象
    aload Ticket
    areturn
}
```

## 验证 Ticket

```text
com.intellij.ide.b.m.H::b:(Lcom/intellij/b/Q/Q;)Z {     // 传入的参数是 com/intellij/ide/[x]/[x]/[Ticket]
    // ... 这里有很长的逻辑，可能是其它类型的验证
    instanceof  Ticket   <-- 可能是多次 if 语句判断
    checkcast Ticket
    astore slotIndexOfTicket
    // ...
    invokevirtual com/intellij/ide/[x]/[x]/[Ticket]::[x]:(JB)Z --> true
    invokevirtual com/intellij/ide/[x]/[x]/[Ticket]::[x]:()Ljava/lang/String; --> String <-- confirmationStamp
    // 用 confirmationStamp 创建一个新对象，表示为 Confirmation
    new com/intellij/ide/[x]/[x]/[Confirmation]
    dup
    invokespecial com/intellij/ide/[x]/[x]/[Confirmation]::<init>:(Ljava/lang/String;)V
    invokevirtual com/intellij/ide/[x]/[x]/[Confirmation]::b:(JB)Ljava/lang/String; --> String <-- confirmationStamp 的第 2/3 部分
    aload String <-- ConfirmationStampSecondPart
    invokestatic com/jetbrains/[b]/[Q]/[z].[b]:(JLjava/lang/String;)Ljava/lang/String; --> String <-- 获取 PermanantInstallationID
    invokevirtual java/lang/String.equals:(Ljava/lang/Object;)Z
}
```



## 2024.2.1

### product.jar



- [ ] com.jetbrains.ls.responses.PingResponse

- com/jetbrains/ls/responses/ObtainTicketResponse

```text
D:\ideaIU-2024.2.1.win\lib\product.jar
    METHOD com/intellij/ide/b/m/I b:(Ljava/lang/String;Ljava/util/Map;)Lcom/jetbrains/b/Q/bY;
```

```text
Java 17: public synchronized com/jetbrains/ls/responses/ObtainTicketResponse extends com/jetbrains/ls/responses/AbstractFloatingResponse implements []
    private ticketId:Ljava/lang/String;
    private ticketProperties:Ljava/lang/String;
    private prolongationPeriod:J
    public <init>:()V
    public <init>:(Ljava/lang/String;Lcom/jetbrains/ls/responses/ResponseCode;Ljava/lang/String;Ljava/lang/String;J)V
    public getTicketId:()Ljava/lang/String;
    public setTicketId:(Ljava/lang/String;)V
    public getTicketProperties:()Ljava/lang/String;
    public parseTicketProperties:()Ljava/util/Map;
    public setTicketProperties:(Ljava/lang/String;)V
    public getProlongationPeriod:()J
    public setProlongationPeriod:(J)V
    public static error:(Ljava/lang/String;Lcom/jetbrains/ls/requests/ObtainTicketRequest;)Lcom/jetbrains/ls/responses/ObtainTicketResponse;
```

返回 `ObtainTicketResponse`：

```text
D:\ideaIU-2024.2.1.win\lib\product.jar
    METHOD com/jetbrains/b/Q/z b:(Ljava/lang/String;Ljava/lang/String;IJIZLjava/util/Map;)Lcom/jetbrains/ls/responses/ObtainTicketResponse;
    METHOD com/jetbrains/ls/responses/ObtainTicketResponse error:(Ljava/lang/String;Lcom/jetbrains/ls/requests/ObtainTicketRequest;)Lcom/jetbrains/ls/responses/ObtainTicketResponse;

```

调用返回  `ObtainTicketResponse` 的方法：

```text
D:\ideaIU-2024.2.1.win\lib\product.jar
    METHOD com/intellij/ide/b/m/I b:(Ljava/lang/String;Ljava/util/Map;)Lcom/jetbrains/b/Q/bY;
```

## 类

### TicketProperties

```java
package com.jetbrains.ls.responses;

public class TicketProperties {
    public static final String LICENSEE = "licensee";
    public static final String LICENSE_TYPE = "licenseType";
    public static final String MAINTENANCE_DUE = "maintenanceDue";
    public static final String METADATA = "metadata";
    public static final String ADDITIONAL_PLUGINS = "plugins";
}
```

### JBAccountInfoService

- Jar: `app-client.jar`

```java
package com.intellij.ui;

public interface JBAccountInfoService {
    public static enum LoginMode {
        AUTO,
        MANUAL;
    }

    public static enum LicenseeType {
        UNKNOWN,
        COMPANY,
        INDIVIDUAL,
        STUDENT,
        OPENSOURCE,
        CLASSROOM;
    }

    public static enum LicenseKind {
        STANDARD,
        TRIAL,
        FREE;
    }
}
```

## 资源

- jar: `product.jar`
- file: `messages/LicenseBundle.properties`

```properties
message.expiration.date=Expiration date: {0}
message.educational.license=1-Year Educational License. {0}
message.open.source.project.license=Open Source Project License. {0}
message.personal.license=Personal License
message.invalid.license.data=Invalid license data. Please try again.
message.license.expired=The license has expired
```

```properties
message.server.protocol.hijacked=License Server response did not pass data integrity check: {0}
message.evaluation.expired=A valid subscription is required to continue using {0}
message.evaluation.expired.free.run=A valid subscription is required to continue using {0}. This session will be limited to 30 minutes.
message.license.expired.free.run=The {0} license has expired. This session will be limited to 30 minutes.
message.evaluation.license.expired.shutdown=Your trial has expired. {0} will now close.
message.plugin.evaluation.license.expired.shutdown=The plugin trial has expired. Plugin {0} will be disabled.
message.license.expired.shutdown=The license has expired. {0} will now close.
message.plugin.license.expired.shutdown=The plugin license has expired. Plugin {0} will be disabled.
message.jetbrains.ide=JetBrains IDE
```

```properties
license.type.individual=Individual license
license.type.company=Company license
license.type.academic=Educational license
license.type.open.source=Open source license
license.type.non.commercial=Non-commercial license
```

```text
com.intellij.ide.b.L
{d = idea, v = II, F = idea, E = 49c202d4-ac56-452b-bb84-735056242fb3, Z = true, b = true, X = true},
{d = RubyMine, v = RM, F = Ruby, E = b27b2de6-cc3c-4e75-a0a6-d3aead9c2d8b, Z = true, b = true, X = true},
{d = PyCharm, v = PC, F = Python, E = e8d15448-eecd-440e-bbe9-1e5f754d781b, Z = true, b = true, X = true}, 
{d = PyCharm (Anaconda Edition), v = PCA, F = Python, E = e8d15448-eecd-440e-bbe9-1e5f754d781b, Z = true, b = true, X = true}, 
{d = DataSpell, v = DS, F = DataSpell, E = ce303c78-bca1-40ee-b41f-3bb1081cc489, Z = true, b = true, X = true}, 
{d = WebStorm, v = WS, F = WebStorm, E = 342e66b2-956c-4384-81da-f50365b990e9, Z = true, b = true, X = true}, 
{d = PhpStorm, v = PS, F = PhpStorm, E = 0d85f2cc-b84f-44c7-b319-93997d080ac9, Z = true, b = true, X = true}, 
{d = AppCode, v = AC, F = AppCode, E = 8a00c148-759c-4289-80ae-63fe83cb14f9, Z = true, b = true, X = true}, 
{d = Aqua, v = QA, F = Aqua, E = 745f47a8-6de0-44e1-bb62-5904ccd5f0da, Z = true, b = true, X = true}, 
{d = RustRover, v = RR, F = RustRover, E = 3def2536-775b-466a-aaaa-6518854e4a1c, Z = true, b = true, X = true}, 
{d = DataGrip, v = DB, F = DataGrip, E = 94ed896e-599e-4e2c-8724-204935e593ff, Z = true, b = true, X = true}, 
{d = CLion, v = CL, F = CLion, E = cfc7082d-ae43-4978-a2a2-46feb1679405, Z = true, b = true, X = true}, 
{d = Rider, v = RD, F = Rider, E = c9e1fa2c-9f19-4ad7-935c-481ca0c2d23c, Z = true, b = true, X = true}, 
{d = GoLand, v = GO, F = GoLand, E = 6ca374ac-f547-4984-be94-adb3e47b580c, Z = true, b = true, X = true}, 
{d = Datalore, v = DL, F = DL, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = true, b = true, X = true}, 
{d = dotCover, v = DC, F = DC, E = 59bb7cf0-d203-4e54-9a5f-04fbb1aebcd4, Z = true, b = true, X = true}, 
{d = dotMemory, v = DM, F = DM, E = dd8d40c7-866b-4204-9d56-9e620cd76a4d, Z = true, b = true, X = true}, 
{d = dotTrace, v = DPN, F = DPN, E = fdf9f05f-d8fe-44b1-9721-4455e35ea49f, Z = true, b = true, X = true}, 
{d = ReSharper, v = RS, F = RS, E = 5931f436-2506-415e-a0a9-27f50d7f62bf, Z = true, b = true, X = true}, 
{d = ReSharper C++, v = RC, F = RC, E = 39365442-7f02-4765-ab93-770c04f400b7, Z = true, b = true, X = true}, 
{d = Upsource, v = US, F = US, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = true, b = true, X = true}, 
{d = Rider C++, v = RDCPPP, F = RDCPPP, E = eb4a28b4-a30f-41ee-9df5-6a42f2a9a58a, Z = true, b = true, X = true}, 
{d = CodeWithMe, v = PCWMP, F = PCWMP, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = false, b = true, X = true}, 
{d = CodeWithMe RD, v = PRDEV, F = PRDEV, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = false, b = true, X = true}, 
{d = CodeWithMe RD, v = PRDPC, F = PRDPC, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = false, b = true, X = true}, 
{d = Qodana, v = QDL, F = Qodana, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = true, b = true, X = true}, 
{d = AI Assistant, v = AIP, F = AIP, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = false, b = false, X = false}, 
{d = Grazie Pro, v = GZL, F = GZL, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = false, b = false, X = false}, 
{d = RDHost-Individual, v = RMDVP, F = RMDVP, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = false, b = true, X = true}, 
{d = RDHost-Vendor, v = RMDVV, F = RMDVV, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = false, b = true, X = true}, 
{d = RDHost-Enterprise, v = RMDVEH, F = RMDVEH, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = false, b = true, X = true}, 
{d = RDHost-EnterpriseClient, v = RMDVEC, F = RMDVEC, E = c3ea6721-9669-4af3-895f-75302648ff5e, Z = false, b = true, X = true}]
```
