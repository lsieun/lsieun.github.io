---
title: "wmic"
sequence: "wmic"
---

[UP](/windows/windows-index.html)

`wimc` 是 Windows management instrumentation 的缩写，Window管理工具，
提供从命令行接口和批处理脚本执行系统管理的支持。

`wmic` 可以通过命令行操作，获取系统信息、安装软件、启动服务、管理进程等操作。

打开 cmd，输入 `wmic` 会进入 wmic 命令模式：

```text
C:\Users\admin>wmic
wmic:root\cli>
```

输入 `quit` 或 `exit` 会退出 wmic 模式：

```text
wmic:root\cli>exit

```

## CPU

输入 `cpu get *` 命令，会获取 CPU 相关信息：

```text
wmic:root\cli>cpu get *
AddressWidth  Architecture  AssetTag  Availability  Caption                               Characteristics  ConfigManagerErrorCode  ConfigManagerUserConfig  CpuStatus  CreationClassName  CurrentClockSpeed  CurrentVoltage  DataWidth  Description                           DeviceID  ErrorCleared  ErrorDescription  ExtClock  Family  InstallDate  L2CacheSize  L2CacheSpeed  L3CacheSize  L3CacheSpeed  LastErrorCode  Level  LoadPercentage  Manufacturer  MaxClockSpeed  Name                                       NumberOfCores  NumberOfEnabledCore  NumberOfLogicalProcessors  OtherFamilyDescription  PartNumber  PNPDeviceID  PowerManagementCapabilities  PowerManagementSupported  ProcessorId       ProcessorType  Revision  Role  SecondLevelAddressTranslationExtensions  SerialNumber  SocketDesignation  Status  StatusInfo  Stepping  SystemCreationClassName  SystemName       ThreadCount  UniqueId  UpgradeMethod  Version  VirtualizationFirmwareEnabled  VMMonitorModeExtensions  VoltageCaps
64            9                       3             Intel64 Family 6 Model 79 Stepping 1  252
```

```text
# 获取 CPU 的型号
wmic:root\cli>cpu get name
Name
Intel(R) Xeon(R) CPU E5-2686 v4 @ 2.30GHz
```

```text
# 最大时钟速度
wmic:root\cli>cpu get maxclockspeed
MaxClockSpeed
2301
```

输入 `cpu get NumberOfCores` 命令，可以查询 CPU 的核数：

```text
wmic:root\cli>cpu get NumberOfCores
NumberOfCores
18
```

输入 `cpu get NumberOfLogicalProcessors` 命令，可以查询 CPU 的线程数：

```text
wmic:root\cli>cpu get NumberOfLogicalProcessors
NumberOfLogicalProcessors
36
```

经过上述查询操作，我的电脑 CPU 是 18 核 36 线程。
那么，18 核 36 线程，到底是什么意思呢？

- 18 核，代表我的电脑里面有 18 个 CPU；
- 36 线程，说明每个 CPU 存有两个逻辑线程，也称**双线程**、**超线程**。
  它可以在一个物理 CPU 内部模拟出多个逻辑 CPU，从而提高了 CPU 的并行计算能力。

## 获取操作系统信息

输入 `os` 命令，获取操作系统相关信息：

```text
wmic:root\cli>os
BootDevice               BuildNumber  BuildType            Caption                      CodeSet  CountryCode  CreationClassName      CSCreationClassName   CSDVersion  CSName           CurrentTimeZone  DataExecutionPrevention_32BitApplications  DataExecutionPrevention_Available  DataExecutionPrevention_Drivers  DataExecutionPrevention_SupportPolicy  Debug  Description  Distributed  EncryptionLevel  ForegroundApplicationBoost  FreePhysicalMemory  FreeSpaceInPagingFiles  FreeVirtualMemory  InstallDate                LargeSystemCache  LastBootUpTime             LocalDateTime              Locale  Manufacturer           MaxNumberOfProcesses  MaxProcessMemorySize  MUILanguages        Name                                                                 NumberOfLicensedUsers  NumberOfProcesses  NumberOfUsers  OperatingSystemSKU  Organization  OSArchitecture  OSLanguage  OSProductSuite  OSType  OtherTypeDescription  PAEEnabled  PlusProductID  PlusVersionNumber  PortableOperatingSystem  Primary  ProductType  RegisteredUser  SerialNumber             ServicePackMajorVersion  ServicePackMinorVersion  SizeStoredInPagingFiles  Status  SuiteMask  SystemDevice             SystemDirectory      SystemDrive  TotalSwapSpaceSize  TotalVirtualMemorySize  TotalVisibleMemorySize  Version     WindowsDirectory
\Device\HarddiskVolume1  19045        Multiprocessor Free  Microsoft Windows 10 专业版  936      86           Win32_OperatingSystem  Win32_ComputerSystem              DESKTOP-2KNPCGJ  480              TRUE                                       TRUE                               TRUE                             2                                      FALSE               FALSE        256              2                           51215476            9961472                 53483284           20231008103946.000000+480                    20231130194647.500000+480  20231201100426.960000+480  0804    Microsoft Corporation  4294967295            137438953344          {"zh-CN", "en-US"}  Microsoft Windows 10 专业版|C:\Windows|\Device\Harddisk0\Partition3                         210                2              48                                64-bit          2052        256             18                                                                          FALSE                    TRUE     1            admin           00331-10000-00001-AA873  0                        0                        9961472                  OK      272        \Device\HarddiskVolume3  C:\Windows\system32  C:                               76919748                66958276                10.0.19045  C:\Windows
```

```text
wmic:root\cli>os get version
Version
10.0.19045

wmic:root\cli>os get name
Name
Microsoft Windows 10 专业版|C:\Windows|\Device\Harddisk0\Partition3

wmic:root\cli>os get buildnumber
BuildNumber
19045

wmic:root\cli>os get caption
Caption
Microsoft Windows 10 专业版
```

```text
wmic:root\cli>os get name,version,buildnumber,caption
BuildNumber  Caption                      Name                                                                 Version  
19045        Microsoft Windows 10 专业版  Microsoft Windows 10 专业版|C:\Windows|\Device\Harddisk0\Partition3  10.0.19045
```

## 内存

```text
# 获取内存条的设备定位器
wmic:root\cli>memorychip get devicelocator
DeviceLocator
DIMM_A1
DIMM_B1
DIMM_C1
DIMM_D1

# 获取内存条的容器
wmic:root\cli>memorychip get capacity
Capacity
17179869184
17179869184
17179869184
17179869184

# 获取内存条的速度
wmic:root\cli>memorychip get speed
Speed
1600
1600
1600
1600
```

## Reference

- [Windows系统快速查看电脑CPU核数及wmic命令介绍](https://blog.csdn.net/weixin_51900414/article/details/132801466)
