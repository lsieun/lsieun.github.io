---
title: "MSVC"
sequence: "104"
---

You can build C and C++ applications on the command line by using tools that are included in Visual Studio.
The **Microsoft C++** (**MSVC**) compiler toolset is also downloadable as a standalone package.
You don't need to install the Visual Studio IDE if you don't plan to use it.

This article is about how to set up an environment to use
the individual compilers, linkers, librarian, and other basic tools.
The **native project build system** in Visual Studio, based on **MSBuild**,
doesn't use the environment as described in this article.
For more information on how to use MSBuild from the command line,
see [MSBuild on the command line - C++](https://learn.microsoft.com/en-us/cpp/build/msbuild-visual-cpp?view=msvc-170).

## Download and install the tools

If you've installed Visual Studio and a C++ workload, you have all the command-line tools.
For information on how to install C++ and Visual Studio,
see [Install C++ support in Visual Studio](https://learn.microsoft.com/en-us/cpp/build/vscpp-step-0-installation?view=msvc-170).

If you only want the command-line toolset,
download the [Build Tools for Visual Studio](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022).
When you run the downloaded executable, it updates and runs the Visual Studio Installer.
To install only the tools you need for C++ development, select the **Desktop development with C++** workload.
You can select optional libraries and toolsets to include under **Installation details**.
To build code by using the **Visual Studio 2015, 2017, or 2019 toolsets**,
select the optional **MSVC v140, v141, or v142 build tools**.
When you're satisfied with your selections, choose **Install**.

## Reference

- [Use the Microsoft C++ toolset from the command line](https://learn.microsoft.com/en-us/cpp/build/building-on-the-command-line?view=msvc-170)
