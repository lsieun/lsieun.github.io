---
title: "Win10 + CMake + MingW"
sequence: "203"
---

## 下载

### EPANET 源码下载

第 1 步，打开网页：

```text
https://github.com/OpenWaterAnalytics/EPANET/releases/tag/v2.2
```

第 2 步，下载 **Source code (zip)**：

![](/assets/images/epanet/compile/epanet-2-2-source-code-zip-github.png)

### CMake 下载

第 1 步，打开网页：

```text
https://cmake.org/download/
```

第 2 步，下载 **cmake-3.26.3-windows-x86_64.msi**：

![](/assets/images/epanet/compile/cmake-3.26.3-windows-x86_64-msi.png)

### w64devkit 下载

[w64devkit](https://github.com/skeeto/w64devkit)：Portable C and C++ Development Kit for x64 Windows

第 1 步，打开网页：

```text
https://github.com/skeeto/w64devkit/releases/tag/v1.18.0
```

第 2 步，下载 **w64devkit-1.18.0.zip**:

![](/assets/images/epanet/compile/w64devkit-1.18.0-zip.png)

### 汇总

至此，我们有了这三个文件：

- cmake-3.26.3-windows-x86_64.msi
- EPANET-2.2.zip
- w64devkit-1.18.0.zip

![](/assets/images/epanet/compile/win10-cmake-epanet-w64devkit.png)

## 编译 EPANET

### CMake 安装

第 1 步，进入安装向导：

![](/assets/images/epanet/compile/cmake-setup-001.png)

第 2 步，勾选协议：

![](/assets/images/epanet/compile/cmake-setup-002.png)

第 3 步，添加 `PATH` 并创建桌面图标：

![](/assets/images/epanet/compile/cmake-setup-003.png)

第 4 步，选择安装路径：

![](/assets/images/epanet/compile/cmake-setup-004.png)

第 5 步，开始安装

![](/assets/images/epanet/compile/cmake-setup-005.png)

等待一会儿：

![](/assets/images/epanet/compile/cmake-setup-006.png)

第 6 步，安装完成

![](/assets/images/epanet/compile/cmake-setup-007.png)

第 7 步，测试 `cmake` 安装成功：

```text
cmake --version
```

![](/assets/images/epanet/compile/cmake-setup-008.png)

### w64devkit 安装

第 1 步，解压 `w64devkit-1.18.0.zip` 文件：

![](/assets/images/epanet/compile/w64devkit-setup-001.png)

第 2 步，将 `w64devkit\bin` 的绝对路径添加到 `PATH` 环境变量中：

![](/assets/images/epanet/compile/w64devkit-setup-002.png)

### 编译 EPANET

第 1 步，解压 `EPANET-2.2.zip`：

![](/assets/images/epanet/compile/epanet-win10-compile-001.png)

第 2 步，在 `EPANET-2.2` 文件夹添加 `build` 子文件夹，并进入 `build` 子文件夹：

![](/assets/images/epanet/compile/epanet-win10-compile-002.png)

第 3 步，在 `EPANET-2.2/build` 文件夹内，运行 `cmd`，并输入如下命令：

```text
cmake .. -G "MinGW Makefiles"
cmake --build . --config Release
```

![](/assets/images/epanet/compile/epanet-win10-compile-003.png)

![](/assets/images/epanet/compile/epanet-win10-compile-004.png)

第 4 步，在 `EPANET-2.2/build/bin` 文件夹内，可以看到生成的 `libepanet2.dll` 和 `runepanet.exe` 文件：

![](/assets/images/epanet/compile/epanet-win10-compile-005.png)

第 5 步，复制一个 `.inp` 文件到 `EPANET-2.2/build/bin` 文件夹内：

![](/assets/images/epanet/compile/epanet-win10-compile-006.png)

第 6 步，对 `runepanet.exe` 进行测试：

```text
runepanet.exe Net1.inp Net1.rpt
```

![](/assets/images/epanet/compile/epanet-win10-compile-007.png)
