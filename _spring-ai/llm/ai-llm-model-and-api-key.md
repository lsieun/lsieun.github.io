---
title: "LLM 模型和 API Key"
sequence: "101"
---

[UP](/spring-ai/index.html)

## 模型

[Chat Models Comparison](https://docs.spring.io/spring-ai/reference/api/chat/comparison.html)


国内

- [阿里云百炼（需要登录）](https://bailian.console.aliyun.com/)
    - [模型用量 - 免费额度（需要登录）](https://bailian.console.aliyun.com/cn-beijing/?tab=model#/model-usage/free-quota)
    - [密钥管理（需要登录）](https://bailian.console.aliyun.com/cn-beijing/?tab=model#/api-key)
    - [API 参考（模型）](https://help.aliyun.com/zh/model-studio/install-sdk)

国外

- [OpenAI for developers](https://developers.openai.com/)
    - [Models](https://developers.openai.com/api/docs/models)

## API Key Safety

- DeepSeek：`DEEPSEEK_API_KEY`
- OpenAI：`OPENAI_API_KEY`
- 阿里云百炼：`DASHSCOPE_API_KEY`

- [大模型服务平台百炼：将API Key配置到环境变量](https://help.aliyun.com/zh/model-studio/configure-api-key-through-environment-variables)

### Linux

第 1 步，执行以下命令来将环境变量设置追加到 `~/.bashrc` 文件中（API Key 代替 `YOUR_API_KEY`）

```text
echo "export DASHSCOPE_API_KEY='YOUR_API_KEY'" >> ~/.bashrc
```

```text
echo "export DEEPSEEK_API_KEY='YOUR_API_KEY'" >> ~/.bashrc
```

```text
echo "export OPENAI_API_KEY='YOUR_API_KEY'" >> ~/.bashrc
```

第 2 步，执行以下命令，使变更生效

```text
source ~/.bashrc
```

第 3 步，重新打开一个终端窗口，运行以下命令检查环境变量是否生效

```text
echo $DASHSCOPE_API_KEY
```

### Windows

第 1 步，在 Windows 系统桌面中按 `Win+Q`键，在搜索框中搜索**编辑系统环境变量**，单击打开**系统属性界面**。

第 2 步，在**系统属性**窗口，单击**环境变量**，
然后在**系统变量**区域下单击**新建**，
**变量名**填入 `DASHSCOPE_API_KEY`，
**变量值**填入您的DashScope API Key。

![](/assets/images/spring-ai/api-key-safety-windows-env.png)

第 3 步，检查环境变量是否生效

```text
# CMD 查询命令
echo %DASHSCOPE_API_KEY%
```

```text
# Windows PowerShell 查询命令
echo $env:DASHSCOPE_API_KEY
```
