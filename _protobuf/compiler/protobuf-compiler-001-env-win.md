---
title: "安装 Protobuf 环境（Windows）"
sequence: "101"
---

[UP](/protobuf.html)

## 下载

下载 ProtoBuf 编译器：

```text
https://github.com/protocolbuffers/protobuf/releases
```

![](/assets/images/protobuf/compiler/protoc-26-win64-zip-download.png)

## 环境变量

第 1 步，添加 `PROTOCBUF_HOME` 环境变量：

```text
D:\software\protoc-26.1-win64
```

![](/assets/images/protobuf/compiler/protobuf-home-env-variable.png)

第 2 步，修改 `Path` 环境变量，添加如下内容：

```text
%PROTOCBUF_HOME%\bin
```

![](/assets/images/protobuf/compiler/path-variable-protobuf-bin.png)

## 验证

```text
> protoc --version
```

![](/assets/images/protobuf/compiler/cmd-protoc-version.png)

