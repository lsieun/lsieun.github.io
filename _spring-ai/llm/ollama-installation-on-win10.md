---
title: "Win10: Ollama 安装"
sequence: "102"
---

## Ollama

### 下载

Windows 平台，只支持 Win10 和 Win11

```text
https://ollama.com/download
```

### 安装

Ollama 默认安装位置: `C:\Users\xxx\AppData\Local\Programs\Ollama`

将 Ollama 安装到 D:\Ollama` 目录，可以在 CMD 上执行如下命令：

```text
OllamaSetup.exe /DIR=D:\Ollama
```

![](/assets/images/ollama/win/ollama-install-windows-001.png)

出现安装界面， 点击 `Install` 按钮：

![](/assets/images/ollama/win/ollama-install-windows-002.png)

安装过程：

![](/assets/images/ollama/win/ollama-install-windows-003.png)

安装完成之后：

![](/assets/images/ollama/win/ollama-install-windows-004.png)

### 安装验证

通过 CMD 命令行查看 Ollama 的版本：

```text
ollama --version
```

![](/assets/images/ollama/win/ollama-install-windows-005.png)

同样，也可以查看 Ollama 的安装目录：

![](/assets/images/ollama/win/ollama-install-windows-006.png)

### 模型下载目录

Ollama 模型(models及其配置文件)默认下载位置: `C:\Users\xxx\.ollama`

![](/assets/images/ollama/win/ollama-install-windows-007.png)

将里面原有1个文件夹和2个文件，复制到 `D:\OllamaModels` 目录（没有这个id文件会报错）：

![](/assets/images/ollama/win/ollama-install-windows-008.png)

按 `Win + R` 打开 “运行” 对话框，输入以下命令：

```text
rundll32 sysdm.cpl,EditEnvironmentVariables
```

配置环境变量：

- 变量名：`OLLAMA_MODELS`
- 变量值: `D:\OllamaModels`

![](/assets/images/ollama/win/ollama-install-windows-009.png)

## Qwen3 模型

| Model Name     | Size  | Context | Input       |
|----------------|-------|---------|-------------|
| `qwen3:0.6b`   | 523MB | 40K     | Text        |
| `qwen3.5:0.8b` | 1.0GB | 256K    | Text, Image |

### 拉取模型

查看本地模型：

```text
ollama ls
```

![](/assets/images/ollama/win/ollama-install-windows-010.png)

拉取 `qwen3:0.6b` 模型：

```text
ollama pull qwen3:0.6b
```

![](/assets/images/ollama/win/ollama-install-windows-011.png)

拉取完成：

![](/assets/images/ollama/win/ollama-install-windows-012.png)

再次查看本地模型：

![](/assets/images/ollama/win/ollama-install-windows-013.png)

同样，可以查看模型存放目录：

```text
C:\Users\User\.ollama\models\blobs
```

![](/assets/images/ollama/win/ollama-install-windows-014.png)

### 运行模型

运行模型：

```text
ollama run qwen3:0.6b
```

![](/assets/images/ollama/win/ollama-install-windows-015.png)

### 问题测试

```text
>>> 你是谁？
>>> 你可以做哪些事？
>>> 你有独立意识吗？
>>> 你有感情吗？
>>> 你没有感情怎么能对感情有深刻的理解？
>>> 人工智能的本质是什么？
```

## Qwen3.5 模型

使用 `ollama pull` 命令拉取 `qwen3.5:0.8b` 模型（1.0 GB）：

```text
ollama pull qwen3.5:0.8b
```

运行模型：

```text
ollama run qwen3.5:0.8b
```

```text
> ollama pull qwen3.5:0.8b
pulling manifest
pulling afb707b6b8fa: 100% ▕██████████████████████████████████████████████████████████▏ 1.0 GB
pulling 9be69ef46306: 100% ▕██████████████████████████████████████████████████████████▏  11 KB
pulling 9371364b27a5: 100% ▕██████████████████████████████████████████████████████████▏   65 B
pulling b14c6eab49f9: 100% ▕██████████████████████████████████████████████████████████▏  476 B
verifying sha256 digest
writing manifest
success
```

## API

Many model services provide an API which is compatible with OpenAI.
Ollama also has this API. After Ollama is started,
this API can be accessed from base URL `http://localhost:11434/v1/`.

By default, Ollama provides its API endpoint at port `11434`.

By default, Ollama uses Mistral model.
The property to configure the Ollama model is `spring.ai.ollama.chat.options.model`.

## Win10 开放端口

第 1 步，按 `Windows + R` 快捷键打开「运行」对话框，输入 `wf.msc`并回车，
打开「高级安全 Windows Defender 防火墙」管理控制台。

第 2 步，在左侧，选择「入站规则」；在右侧「操作」栏中，点击「新建规则」。

- **入站规则**：允许外部设备访问你的电脑，例如搭建 IIS、FTP 或远程桌面连接等。
- **出站规则**：允许本机访问外部网络。

![](/assets/images/ollama/win/ollama-install-windows-016.png)

第 3 步，在弹出的向导中，选择「端口」，然后点击「下一步」。

![](/assets/images/ollama/win/ollama-install-windows-017.png)

第 4 步，配置协议与端口：

- 选择「TCP」。
- 在「特定本地端口」栏，输入端口号：`11434`。

![](/assets/images/ollama/win/ollama-install-windows-018.png)

第 5 步，选择「允许连接」，然后点击「下一步」

![](/assets/images/ollama/win/ollama-install-windows-019.png)

第 6 步，选择应用场景：勾选规则生效的网络类型（域、专用、公用）。通常情况下，保持默认全选即可。

![](/assets/images/ollama/win/ollama-install-windows-020.png)

第 7 步，为规则命名：起一个容易识别的名字，例如「Ollama 入站 11434」。

![](/assets/images/ollama/win/ollama-install-windows-021.png)

在中间的「入站规则」，可以看到刚才添加的规则：

![](/assets/images/ollama/win/ollama-install-windows-022.png)

## Reference

- [Ollama](https://ollama.com/)
    - [Qwen3](https://ollama.com/library/qwen3)
        - [qwen3:0.6b](https://ollama.com/library/qwen3:0.6b)
    - [Qwen 3.5](https://ollama.com/library/qwen3.5)
        - [qwen3.5:0.8b](https://ollama.com/library/qwen3.5:0.8b)
    - [Gemma3](https://ollama.com/library/gemma3)
        - [gemma3:270m](https://ollama.com/library/gemma3:270m)
