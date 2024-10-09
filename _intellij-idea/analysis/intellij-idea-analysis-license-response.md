---
title: "License: XxxResponse"
sequence: "102"
---

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

