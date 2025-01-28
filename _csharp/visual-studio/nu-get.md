---
title: "NuGet包管理器"
sequence: "118"
---

## NuGet

Essentially, NuGet is just a ZIP file with a `.nupkg` extension
that contains the DLLs you have created for distribution.
Included inside this package is a manifest file that contains additional information
such as the version number of the NuGet package.

## nuget.org

Packages uploaded to `nuget.org` are public and available to all developers
that use NuGet in their projects.

```text
https://www.nuget.org/
```

Developers can, however, create NuGet packages
that are exclusive to a particular organization and not available publicly.

## Using NuGet in Visual Studio

To add a NuGet package to your project, right-click the project in the **Solution Explorer**,
and click **Manage NuGet Packages** from the context menu.

