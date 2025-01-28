---
title: "java.net.http.HttpClient"
sequence: "101"
---

```text
                               ┌─── newHttpClient()
                               │
              ┌─── instance ───┼─── newBuilder()
              │                │
HttpClient ───┤                └─── newWebSocketBuilder()
              │
              │                ┌─── send
              └─── data ───────┤
                               └─── sendAsync
```
