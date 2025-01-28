---
title: "Art DAQ"
sequence: "112"
---

## Art DAQ

- AI：模拟输入，同Analog In
- AO：模拟输出，同Analog Out
- DI: 数字输入，同Digital Input
- DO: 数字输出，同Digital Output
- CI: 计数器输入，同Counter Input
- CO: 计数器输出，同Counter Output
- Acq：采集，默认为有限点采集
- Cont：连续，常用于ContAcq，意思是连续采集
- Gen：生成，多用于AO输出，默认为有限点生成任务，ContGen为连续生成任务
- Ext：外部，例如Acq_ExtClk，意思是外时钟采集
- Int：内部，例如Acq_IntClk，意思是内时钟采集
- Clk：时钟
- Start：开始触发
- Ref：参考触发
- Pause：暂停触发
- Anlg：模拟，常跟触发一起使用，例如AnlgStart，意思是使用模拟输入信号作为开始触发
- Dig：数字，常跟触发一起使用，例如DigStartRef，意思是使用数字输入信号作为开始触发和参考触发

不同的示例：

- AI有限采集 外部时钟源 数字触发流程
- AI有限采集 内部时钟源 软件触发流程
- AI有限采集 内部时钟源 通道模拟触发流程
- AI有限采集 内部时钟源 数字参考触发流程
- AI有限采集 内部时钟源 数字开始触发流程
- ^_^
- AI连续采集 外部时钟源 数字触发流程
- AI连续采集 内部时钟源 软件触发流程
- AI连续采集 内部时钟源 通道模拟触发流程
- AI连续采集 内部时钟源 数字触发流程
- ^_^
- AO连续输出 外部时钟例程
- AO连续输出 外部时钟源 数字触发流程
- AO连续输出 内部时钟 软件触发流程
- ^_^
- AO有限输出 内部时钟 软件触发流程
- AO单点输出
- AO有限单点输出 内部时钟 软件触发流程

- Factors
  - Channel
  - Clock
  - Triger

- Task
  - Signal Source: 
  - TaskName
  - TaskHandle
  - Card 板卡
  - Channel 通道

```text
Create Task --> Create Channel --> Configure Clock
Start Task --> ReadData
```
- Create Task: `ArtDAQ.ArtDAQ_CreateTask`
  - Create Channel: `ArtDAQ.ArtDAQ_CreateAIVoltageChan`
  - Configure Clock:
    - Clock: `ArtDAQ.ArtDAQ_CfgSampClkTiming`
      - 采集方式
        - `ArtDAQ.ArtDAQ_Val_FiniteSamps`
        - `ArtDAQ.ArtDAQ_Val_ContSamps`
    - Extern Clock: `ArtDAQ.ArtDAQ_SetAIConvClk`
  - Triggering: 
    - `ArtDAQ.ArtDAQ_CfgAnlgEdgeStartTrig`
    - `ArtDAQ.ArtDAQ_CfgDigEdgeRefTrig`
    - `ArtDAQ.ArtDAQ_CfgDigEdgeStartTrig`
- Start Task: `ArtDAQ.ArtDAQ_StartTask`
  - ReadData: `ArtDAQ.ArtDAQ_ReadAnalogF64`
- Stop Task: `ArtDAQ.ArtDAQ_StopTask`
- Clear Task: `ArtDAQ.ArtDAQ_ClearTask`

### 采集模式

- Acq：采集，默认为有限点采集
- Cont：连续，常用于ContAcq，意思是连续采集

```text
//*** Value set AcquisitionType ***
public const Int32 ArtDAQ_Val_FiniteSamps = 10178; // Finite Samples
public const Int32 ArtDAQ_Val_ContSamps = 10123; // Continuous Samples
```

### 时钟

- Ext：外部，例如Acq_ExtClk，意思是外时钟采集
- Int：内部，例如Acq_IntClk，意思是内时钟采集
- Clk：时钟

### 读取数据

```text
//*** Values for the Fill Mode parameter of ArtDAQ_Readxxxx ***
public const Int32 ArtDAQ_Val_GroupByChannel = 0;   // Group by Channel
public const Int32 ArtDAQ_Val_GroupByScanNumber = 1;   // Group by Scan Number
```

## 问题汇总

- 时钟
  - 处时钟和内时钟有什么区别
- 触发
  - 数字触发流程、软件触发流程、通道模拟触发流程、数字参考触发流程

## Windows

在`C:\Windows\SysWOW64`目录下，我发现了`Art_DAQ.dll`文件

Portable Executable 64:

- C:\Windows\System32\Art_QAQ.dll

Portable Executable 32:

- C:\Windows\SysWOW64\Art_QAQ.dll

软件安装目录：

- C:\Program Files (x86)\ART Technology\ArtDAQ\Lib
  - win32\Art_QAQ.dll
  - x64\Art_QAQ.dll
