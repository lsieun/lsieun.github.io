---
title: "Shared Assemblies"
sequence: "106"
---

Like a private assembly, a shared assembly is a collection of types intended for reuse among projects.
The most obvious difference between shared and private assemblies is that
**a single copy of a shared assembly can be used by several applications on the same machine.**

Consider the fact that all the applications created in this text required access to `mscorlib.dll`.
If you were to look in the application directory of each of these clients,
you would not find a private copy of this .NET assembly.
The reason is that `mscorlib.dll` has been deployed as a shared assembly.
Clearly, if you need to create a machine-wide class library, this is the way to go.

```text
举个例子：mscorlib.dll
```

Deciding whether a code library should be deployed as a private or shared library
is yet another design issue to contend with, and this will be based on many project-specific details.
As a rule of thumb, when you are building libraries that need to be used by a wide variety of applications,
shared assemblies can be quite helpful in that they can be updated to new versions easily.

```text
关于 private 和 shared library 的选择
```

## The Global Assembly Cache

```text
GAC = Global Assembly Cache
```

**Shared assemblies are installed into the GAC.**
However, the exact location of the GAC will depend on
which versions of the .NET platform you installed on the target computer.

### .NET 4.0 以前

Machines that have not installed .NET 4.0 or higher will find the GAC is located in a subdirectory of your
Windows directory named assembly (e.g., `C:\Windows\assembly`). These days, you might consider this the
“historical GAC,” as it can only contain .NET libraries compiled on versions 1.0, 2.0, 3.0, or 3.5.

```text
C:\Windows\assembly
```

### .NET 4.0 以后

With the release of .NET 4.0, Microsoft decided to isolate .NET 4.0 and higher libraries to a separate location,
specifically, `C:\Windows\Microsoft.NET\assembly\GAC_MSIL`.

```text
C:\Windows\Microsoft.NET\assembly\GAC_MSIL
```

Under this new folder, you will find a set of subdirectories, each of which is named identically to the
friendly name of a particular code library (for example, `\System.Windows.Forms`, `\System.Core`, and so on).
Beneath a given friendly name folder, you'll find yet another subdirectory
that always takes the following naming convention:

```text
v4.0_major.minor.build.revision__publicKeyTokenValue
```

```text
v4.0 + single underscore + version number + double underscore + public key token
```

```text
C:\Windows\Microsoft.NET\assembly\GAC_MSIL\System.Core\v4.0_4.0.0.0__b77a5c561934e089\System.Core.dll
C:\Windows\Microsoft.NET\assembly\GAC_MSIL\System.Windows.Forms\v4.0_4.0.0.0__b77a5c561934e089\System.Windows.Forms.dll
```

The v4.0 prefix denotes that the library compiled under .NET version 4.0 or higher.
That prefix is followed by a single underscore and then the version of the library in question (for example, 1.0.0.0).
After a pair of underscores, you'll see another number termed the public key token value.
The public key value is part of the assembly's “strong name.”
Finally, under this folder, you will find a copy of the `*.dll` in question.

### 注意事项

You cannot install executable assemblies (`*.exe`) into the GAC.
Only assemblies that take the `*.dll` file extension can be deployed as a shared assembly.

## Understanding Strong Names

Before you can deploy an assembly to the GAC, you must assign it a **strong name**,
which is used to uniquely identify the publisher of a given .NET binary.
Understand that a “publisher” can be an individual programmer (such as yourself),
a department within a given company, or an entire company itself.

In some ways, a **strong name** is the modern-day .NET equivalent of
the COM globally unique identifier (GUID) identification scheme.
If you have a COM background, you might recall that AppIDs are GUIDs
that identify a particular COM application.
Unlike COM GUID values (which are nothing more than 128-bit numbers),
strong names are based (in part) on two cryptographically related keys (public keys and private keys),
which are much more unique and resistant to tampering than a simple GUID.

```text
strong name 与 COM GUID 的关系
```

### 组成部分

Formally, a **strong name** is composed of a set of related data,
much of which is specified using the following assembly-level attributes:

- The friendly name of the assembly (which, you recall, is the name of the assembly minus the file extension)
- The version number of the assembly (assigned using the `[AssemblyVersion]` attribute)
- The public key value (assigned using the `[AssemblyKeyFile]` attribute)
- An optional culture identity value for localization purposes (assigned using the `[AssemblyCulture]` attribute)
- An embedded **digital signature**, created using a hash of the assembly's contents and the private key value


To provide a strong name for an assembly, your first step is to generate public/private key data using
the .NET Framework `sn.exe` utility.
The `sn.exe` utility generates a file (typically ending with the `*.snk` `[Strong Name Key]` file extension)
that contains data for two distinct but mathematically related keys, the public key and the private key.
Once the C# compiler is made aware of the location of your `*.snk` file,
it will record the full public key value in the assembly manifest
using the `.publickey` token at the time of compilation.

```text
sn.exe --> *.snk (strong name key) --> public key + private key
```

The C# compiler will also generate a hash code based on the contents of the entire assembly (CIL code,
metadata, and so forth).
A hash code is a numerical value that is statistically unique for a fixed input.
Thus, if you modify any aspect of a .NET assembly (even a single character in a string literal),
the compiler yields a different hash code.
This **hash code** is combined with the **private key data** within the `*.snk` file to yield a **digital signature**
embedded within the assembly's CLR header data.

```text
content of the entire assembly --> hash code + private key --> digital singature
```

![](/assets/images/csharp/car-lib-dll-with-digital-signature.png)

## Generating Strong Names at the Command Line

The first order of business is to generate the required key data using the `sn.exe` utility.
Although this tool has numerous command-line options,
all you need to concern yourself with for the moment is the `-k` flag,
which instructs the tool to generate a new file containing the public/private key information.

```text
sn -k MyTestKeyPair.snk
```

![](/assets/images/csharp/cmd/sn-generate-snk-file.png)

![](/assets/images/csharp/cmd/sn-generate-snk-file-explorer.png)

Now that you have your key data, you need to inform the C# compiler exactly where `MyTestKeyPair.snk` is located.
The `AssemblyInfo.cs` file contains a number of attributes that describe the assembly itself.
The `[AssemblyKeyFile]` assembly-level attribute can be added to your `AssemblyInfo.cs` file
to inform the compiler of the location of a valid `*.snk` file.
Simply specify the path as a string parameter.

```text
[assembly: AssemblyKeyFile(@"C:\MyTestKeyPair\MyTestKeyPair.snk")]
```

```text
[assembly: AssemblyKeyFile(@"D:\tmp\abc\MyTestKeyPair\MyTestKeyPair.snk")]
```

Because the version of a shared assembly is one aspect of a strong name,
selecting a version number for `CarLibrary.dll` is a necessary detail.
In the `AssemblyInfo.cs` file, you will find another attribute named `[AssemblyVersion]`.
Initially, the value is set to `1.0.0.0`.

```text
[assembly: AssemblyVersion("1.0.0.0")]
```

A .NET version number is composed of the four parts (`<major>.<minor>.<build>.<revision>`).
While specifying a version number is entirely up to you,
you can instruct Visual Studio to automatically increment the build and revision numbers
as part of each compilation using the **wildcard** token,
rather than with a specific build and revision value.
You have no need to do so for this example; however, consider the following:

```text
// Format: <Major number>.<Minor number>.<Build number>.<Revision number>
// Valid values for each part of the version number are between 0 and 65535.
[assembly: AssemblyVersion("1.0.*")]
```

At this point, the C# compiler has all the information needed to generate strong name data (as you are
not specifying a unique culture value via the `[AssemblyCulture]` attribute,
you “inherit” the culture of your current machine, which in my case would be U.S. English).

Compile your `CarLibrary.dll` code library, open your assembly into `ildasm.exe`, and check the manifest.
You will now see that a new `.publickey` tag is used to document the full public key information,
while the `.ver` token records the version specified via the `[AssemblyVersion]` attribute.

![](/assets/images/csharp/ildasm/ildasm-car-lib-dll-public-key-and-token.png)

Great! At this point, you could deploy your shared `CarLibrary.dll` assembly to the **GAC**.
However, remember that these days .NET developers can use Visual Studio to create strongly named assemblies
using a friendly user interface rather than the cryptic `sn.exe` command-line tool.
Before seeing how to do so, be sure you delete (or comment out) the following line of code
from your `AssemblyInfo.cs` file (assuming you manually added this line during this section of the text):

```text
// [assembly: AssemblyKeyFile(@"C:\MyTestKeyPair\MyTestKeyPair.snk")]
```

## Generating Strong Names Using Visual Studio

Visual Studio allows you to specify the location of **an existing `*.snk` file** using the project's Properties window
as well as **generate a new `*.snk` file**.

To make a new `*.snk` file for the `CarLibrary` project,
first double-click the Properties icon of the Solution Explorer and select the **Signing** tab.
Next, select the "**Sign the assembly**" check box, and choose the `<New…>` option from the drop-down list.

![](/assets/images/csharp/vs/vs-project-properties-signing-new.png)

After you have done so, you will be asked to provide a name for your new `*.snk` file (such as `myKeyPair.snk`),
and you'll have the option to password-protect your file (which is not required for this example)

![](/assets/images/csharp/vs/vs-create-strong-name-key.png)

At this point, you will see your `*.snk` file within Solution Explorer.
Every time you build your application, this data will be used to assign a proper strong name to the assembly.

![](/assets/images/csharp/vs/vs-solution-explorer-my-key-pair-snk.png)

## Installing Strongly Named Assemblies to the GAC

The final step is to install the (now strongly named) `CarLibrary.dll` into the GAC.
While the preferred way to deploy assemblies to the GAC in a production setting is to create an installer package,
the .NET Framework SDK ships with a command-line tool named `gacutil.exe`, which can be useful for quick tests.

```text
gacutil.exe
```

You must have administrator rights to interact with the GAC on your machine.
Be sure to run your command window using the as administrator option.

```text
用管理员身份运行
```

查看帮助：

```text
gacutil.exe /?
```

- `/i`: Installs a strongly named assembly into the GAC
- `/u`: Uninstalls an assembly from the GAC
- `/l`: Displays the assemblies (or a specific assembly) in the GAC

安装：

```text
gacutil /i CarLibrary.dll
```

```text
>gacutil /i CarLibrary.dll
Microsoft (R) .NET Global Assembly Cache Utility.  Version 4.0.30319.0
Copyright (c) Microsoft Corporation.  All rights reserved.

Assembly successfully added to the cache
```

![](/assets/images/csharp/cmd/gacutil-install-car-lib-dll-explorer.png)


查看：

```text
gacutil /l CarLibrary
```

If all is well, you should see the following output to the Console window
(you will find a unique `PublicKeyToken` value, as expected):

```text
> gacutil /l CarLibrary

Microsoft (R) .NET Global Assembly Cache Utility.  Version 4.0.30319.0
Copyright (c) Microsoft Corporation.  All rights reserved.

The Global Assembly Cache contains the following assemblies:
  CarLibrary, Version=1.4.3.2, Culture=neutral, PublicKeyToken=ad6d5029a777c05a, processorArchitecture=MSIL
  CarLibrary, Version=2.0.0.0, Culture=neutral, PublicKeyToken=ad6d5029a777c05a, processorArchitecture=MSIL

Number of items = 2
```

卸载：

```text
gacutil /u CarLibrary
```

```text
>gacutil /u CarLibrary
Microsoft (R) .NET Global Assembly Cache Utility.  Version 4.0.30319.0
Copyright (c) Microsoft Corporation.  All rights reserved.


Assembly: CarLibrary, Version=1.4.3.2, Culture=neutral, PublicKeyToken=ad6d5029a777c05a, processorArchitecture=MSIL
Uninstalled: CarLibrary, Version=1.4.3.2, Culture=neutral, PublicKeyToken=ad6d5029a777c05a, processorArchitecture=MSIL

Assembly: CarLibrary, Version=2.0.0.0, Culture=neutral, PublicKeyToken=ad6d5029a777c05a, processorArchitecture=MSIL
Uninstalled: CarLibrary, Version=2.0.0.0, Culture=neutral, PublicKeyToken=ad6d5029a777c05a, processorArchitecture=MSIL
Number of assemblies uninstalled = 2
Number of failures = 0
```

```text
>gacutil /u CarLibrary,Version=3.0.0.0
Microsoft (R) .NET Global Assembly Cache Utility.  Version 4.0.30319.0
Copyright (c) Microsoft Corporation.  All rights reserved.


Assembly: CarLibrary, Version=3.0.0.0, Culture=neutral, PublicKeyToken=0154117be54bfa1a, processorArchitecture=MSIL
Uninstalled: CarLibrary, Version=3.0.0.0, Culture=neutral, PublicKeyToken=0154117be54bfa1a, processorArchitecture=MSIL
Number of assemblies uninstalled = 1
Number of failures = 0
```

## 使用 Shared Assembly

### 添加引用

Even though Visual Studio finds a strongly named library,
by default it will still copy the library to the output folder of the client application.
To change this behavior, right-click the icon for the referenced file in
the **Reference** folder, select **Properties**, and change **Copy Local** to `False`.

### 编写代码

```csharp
using System;
using CarLibrary;

namespace SharedCarLibClient
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Shared Assembly Client *****");

            SportsCar c = new SportsCar();
            c.TurboBoost();

            Console.ReadLine();
        }
    }
}
```
