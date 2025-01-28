---
title: "MSBuild"
sequence: "105"
---

In general, we recommend that you use Visual Studio to set project properties and invoke the MSBuild system.
However, you can use the **MSBuild** tool directly from the command prompt.
The build process is controlled by the information in a project file (`.vcxproj`) that you can create and edit.
The project file specifies build options based on build stages, conditions, and events.
In addition, you can specify zero or more command-line options arguments.

```text
msbuild.exe [project_file] [options]
```

## Reference

- [MSBuild on the command line - C++](https://learn.microsoft.com/en-us/cpp/build/msbuild-visual-cpp?view=msvc-170)
