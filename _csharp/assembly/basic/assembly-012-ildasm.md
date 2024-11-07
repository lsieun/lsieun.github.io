---
title: "ildasm.exe"
sequence: "112"
---

在 x64 Native Tools Command Prompt for VS 2019 中输入：

```text
ildasm.exe
```

## MANIFEST

第 1 步，打开 `CarLibrary.dll` 文件，并点击 `MANIFEST` 图标：


![](/assets/images/csharp/ildasm/ildasm-car-lib-dll-manifest.png)

The first code block in a manifest specifies all external assemblies
required by the current assembly to function correctly.
As you recall, `CarLibrary.dll` made use of types within `mscorlib.dll` and `System.Windows.Forms.dll`,
both of which are listed in the manifest using the `.assembly extern` token, as shown here:

![](/assets/images/csharp/ildasm/ildasm-car-lib-dll-manifest-details.png)

在 `.assembly extern` block 中，由 `.publickeytoken` 和 `.ver` 两条 directives 组成：

- The `.publickeytoken` instruction is present only if the assembly has been configured with a strong name.
- The `.ver` token defines (of course) the numerical version identifier of the referenced assembly.

After the external references, you will find a number of `.custom` tokens that identify assembly-level
attributes (copyright information, company name, assembly version, etc.).

### Assembly Information

Typically, these settings are established visually using the **Properties** window of your current project.
Now, switching back to Visual Studio, if you click the **Properties** icon within **Solution Explorer**,
you can click the **Assembly Information** button located on the (automatically selected) **Application** tab.

![](/assets/images/csharp/vs/vs-project-application-assembly-information.png)

![](/assets/images/csharp/vs/vs-project-application-assembly-information-details.png)

### AssemblyInfo.cs

When you save your changes, the GUI editor updates your project's `AssemblyInfo.cs` file.

![](/assets/images/csharp/vs/vs-solution-explorer-project-properties-assembly-info.png)

```csharp
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

// General Information about an assembly is controlled through the following
// set of attributes. Change these attribute values to modify the information
// associated with an assembly.
[assembly: AssemblyTitle("CarLibrary")]
[assembly: AssemblyDescription("")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany("")]
[assembly: AssemblyProduct("CarLibrary")]
[assembly: AssemblyCopyright("Copyright ©  2023")]
[assembly: AssemblyTrademark("")]
[assembly: AssemblyCulture("")]

// Setting ComVisible to false makes the types in this assembly not visible
// to COM components.  If you need to access a type in this assembly from
// COM, set the ComVisible attribute to true on that type.
[assembly: ComVisible(false)]

// The following GUID is for the ID of the typelib if this project is exposed to COM
[assembly: Guid("fca32228-7297-4e28-abaa-e94094a224ad")]

// Version information for an assembly consists of the following four values:
//
//      Major Version
//      Minor Version
//      Build Number
//      Revision
//
// You can specify all the values or you can default the Build and Revision Numbers
// by using the '*' as shown below:
// [assembly: AssemblyVersion("1.0.*")]
[assembly: AssemblyVersion("1.0.0.0")]
[assembly: AssemblyFileVersion("1.0.0.0")]
```

A majority of the attributes in `AssemblyInfo.cs` will be used to update the `.custom` token
values within an assembly manifest.

## CIL

Recall that an assembly does not contain platform-specific instructions;
rather, it contains platform-agnostic Common Intermediate Language (CIL) instructions.
When the .NET runtime loads an assembly into memory,
the underlying CIL is compiled (using the JIT compiler) into instructions
that can be understood by the target platform.

For example, back in `ildasm.exe`, if you double-click the `TurboBoost()` method of the `SportsCar` class,
`ildasm.exe` will open a new window showing the CIL tokens that implement this method.

![](/assets/images/csharp/ildasm/ildasm-car-lib-dll-sports-car-turbo-boost.png)

![](/assets/images/csharp/ildasm/ildasm-car-lib-dll-sports-car-turbo-boost-details.png)

```csharp
public class SportsCar : Car
{
    public SportsCar() { }

    public SportsCar(string name, int maxSp, int currSp) : base(name, maxSp, currSp)
    {
    }

    public override void TurboBoost()
    {
        MessageBox.Show("Ramming speed!", "Faster is better...");
    }
}
```

## Type Metadata

Before you build some applications that use your custom .NET library,
if you press the `Ctrl+M` keystroke combination in `ildasm.exe`,
you can see the metadata for each type within the `CarLibrary.dll` assembly.

![](/assets/images/csharp/ildasm/ildasm-car-lib-dll-meta-info.png)

An assembly's metadata is an important element of the .NET platform
and serves as the backbone for numerous technologies
(object serialization, late binding, extendable applications, etc.).


