---
title: "Win10 + CMake + Visual Studio 17 2022"
sequence: "204"
---

## 下载

### Build Tools for Visual Studio 2022 下载

第 1 步，打开网页：

```text
https://visualstudio.microsoft.com/downloads/
```

第 2 步，**All Downloads** --> **Tools for Visual Studio** --> **Build Tools for Visual Studio 2022** --> **Download**:

![](/assets/images/epanet/compile/msbuild-visual-studio-2022-download.png)

## 安装

### Build Tools 安装

第 1 步，进入安装向导：

![](/assets/images/epanet/compile/vs-2022-001.png)

等待下载完成：

![](/assets/images/epanet/compile/vs-2022-002.png)

第 2 步，勾选**使用C++的桌面开发**，再进一步选择：

- MSVC v143 - VS 2022 C++ x64/x86 生成工具
- Windows 11 SDK
- 用于 Windows 的 C++ CMake 工具

![](/assets/images/epanet/compile/vs-2022-003.png)

点击**安装**，进入下载界面：

![](/assets/images/epanet/compile/vs-2022-004.png)

下载了一半：

![](/assets/images/epanet/compile/vs-2022-005.png)

下载和安装完成：

![](/assets/images/epanet/compile/vs-2022-006.png)

### CMake 安装

略

### EPANET 编译

第 1 步，添加 `EPANET-2.2/build` 文件夹

第 2 步，在 `EPANET-2.2/build` 文件夹中，执行 `cmd` 命令：

```text
cmake .. -A x64
cmake --build . --config Release
```

![](/assets/images/epanet/compile/epanet-win10-compile-008.png)

![](/assets/images/epanet/compile/epanet-win10-compile-009.png)

第 3 步，在 `EPANET-2.2/build/bin/Release` 目录中，查看生成的文件：

![](/assets/images/epanet/compile/epanet-win10-compile-010.png)


## 拓展

### Platform Selection

The default target platform name (architecture) is that of the host and
is provided in the `CMAKE_VS_PLATFORM_NAME_DEFAULT` variable.

The `CMAKE_GENERATOR_PLATFORM` variable may be set, perhaps via the `cmake -A` option,
to specify a target platform name (architecture). For example:

```text
cmake -G "Visual Studio 17 2022" -A Win32

cmake -G "Visual Studio 17 2022" -A x64

cmake -G "Visual Studio 17 2022" -A ARM

cmake -G "Visual Studio 17 2022" -A ARM64
```

```text
cmake -G "Visual Studio 16 2019" -A Win32

cmake -G "Visual Studio 16 2019" -A x64

cmake -G "Visual Studio 16 2019" -A ARM

cmake -G "Visual Studio 16 2019" -A ARM64
```

```text
cmake .. -A x64
cmake --build . --config Release
```

## Reference

- [CMake: Visual Studio 17 2022](https://cmake.org/cmake/help/latest/generator/Visual%20Studio%2017%202022.html)
- [CMake: Visual Studio 16 2019](https://cmake.org/cmake/help/latest/generator/Visual%20Studio%2016%202019.html)
