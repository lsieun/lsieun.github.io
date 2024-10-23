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
