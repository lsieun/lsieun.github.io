---
title: "Private Assemblies"
sequence: "105"
---

**Private assemblies** must be located within the same directory as the client application
that's using them (the application directory) or a subdirectory thereof.

## The Identity of a Private Assembly

The full identity of a private assembly consists of the **friendly name** and **numerical version**,
both of which are recorded in the assembly manifest.
The friendly name is simply the name of the module
that contains the assembly's manifest minus the file extension.

```text
identity of private assembly = friendly name + numerical version
```

```text
.assembly CarLibrary
{
  // ...
  .ver 1:0:0:0
}
```

Given the isolated nature of a private assembly,
it should make sense that **the CLR does not bother to use the version number when resolving its location.**
The assumption is that private assemblies do not need to have any elaborate version checking,
as the client application is the only entity that “knows” of its existence.
Because of this, it is possible for a single machine to have multiple copies of the same private
assembly in various application directories.

```text
CLR 在查找 private assembly 时，不使用 version number。
```

## Understanding the Probing Process

The .NET runtime resolves the location of a private assembly using a technique called **probing**,
which is much less invasive than it sounds.
**Probing is the process of mapping an external assembly request to the location of the requested binary file.**


```text
Probing = external assembly request --> location of the requested binary file
```

### 两种请求方式

Strictly speaking, a request to load an assembly may be either **implicit** or **explicit**.

```text
request = implicit + explicit
```

#### implicit

An **implicit load request** occurs when the CLR consults the manifest to resolve the location of an
assembly defined using the `.assembly extern` tokens.

使用 `ildasm.exe` 打开 `CSharpCarClient.exe` 文件，查看 `MANIFEST` 部分：

```text
.assembly extern CarLibrary
{
  .ver 1:0:0:0
}
```

#### explicit

An **explicit load request** occurs programmatically
using the `Load()` or `LoadFrom()` method of the `System.Reflection.Assembly` class type,
typically for the purposes of late binding and dynamic invocation of type members. 

```text
// An explicit load request based on a friendly name.
Assembly asm = Assembly.Load("CarLibrary");
```

### 查找过程

In either case, the CLR extracts the friendly name of the assembly and begins probing the client's
application directory for a file named `CarLibrary.dll`.
If this file cannot be located, an attempt is made to
locate an executable assembly based on the same friendly name (for example, `CarLibrary.exe`).
If neither file can be located in the application directory,
the runtime gives up and throws a `FileNotFoundException` exception at runtime.

```text
第 1 步，尝试查找 CarLibrary.dll
第 2 步，尝试查找 CarLibrary.exe
第 3 步，抛出 FileNotFoundException 异常
```

Technically speaking, if a copy of the requested assembly cannot be found
within the client's application directory,
the CLR will also attempt to locate a client subdirectory with the same name as the assembly's friendly name
(e.g., `C:\MyClient\CarLibrary`).
If the requested assembly resides within this subdirectory, the CLR will load the assembly into memory.

```text
更细节的探索
```

## Configuring Private Assemblies

While it is possible to deploy a .NET application
by simply copying all required assemblies to a single folder on the user's hard drive,
**you will most likely want to define a number of subdirectories to group related content.**

For example, assume you have an application directory named `C:\MyApp`
that contains `CSharpCarClient.exe`.
Under this folder might be a subfolder named `MyLibraries` that contains `CarLibrary.dll`.

```text
C:\MyApp\CSharpCarClient.exe
C:\MyApp\MyLibraries\CarLibrary.dll
```

Regardless of the intended relationship between these two directories,
the CLR will not probe the `MyLibraries` subdirectory unless you supply a configuration file.

```text
引出“配置文件”
```

Configuration files contain various XML elements that allow you to influence the probing process.
Configuration files must have the same name as the launching application and take a `*.config` file extension,
and they must be deployed in the client's application directory.

```text
配置文件的命名规则和位置
```

- 文件名称：`*.config`
- 文件位置：application directory
- 内容格式：XML

Thus, if you want to create a configuration file for `CSharpCarClient.exe`,
it must be named `CSharpCarClient.exe.config` and be located (for this example) in the `C:\MyApp` directory.

```text
C:\MyApp\CSharpCarClient.exe.config
```

内容如下：

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <runtime>
        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
            <probing privatePath="MyLibraries"/>
        </assemblyBinding>
    </runtime>
</configuration>
```

.NET *.config files always open with a root element named `<configuration>`.
The nested `<runtime>` element may specify an `<assemblyBinding>` element,
which nests a further element named `<probing>`.  
The `privatePath` attribute is the key point in this example,
as it is used to specify the subdirectories relative
to the application directory where the CLR should probe.

```text
对 XML 内容进行解释
```

### 文件目录

Do note that the `<probing>` element does not specify which assembly is located under a given subdirectory.
In other words, you cannot say, "`CarLibrary` is located under the `MyLibraries` subdirectory,
but `MathLibrary` is located under the `OtherStuff` subdirectory."
The `<probing>` element simply instructs the CLR to investigate all specified subdirectories
for the requested assembly until the first match is encountered.

```text
probing 指定的是文件夹，而不是具体的 dll 文件
```

Be aware that the `privatePath` attribute cannot be used to specify
an absolute (`C:\SomeFolder\SomeSubFolder`) or relative (`..\SomeFolder\AnotherFolder`) path!
If you need to specify a directory outside the client's application directory,
you will need to use a completely different XMl element named `<codeBase>`.

```text
<probing> 的 privatePath 不支持绝对路径，也不支持相对路径。

<codeBase> 可以
```

### 多个目录

Multiple subdirectories can be assigned to the `privatePath` attribute using a semicolon-delimited list.
You have no need to do so at this time, but here is an example that informs the CLR to consult the
`MyLibraries` and `MyLibraries\Tests` client subdirectories:

```text
<probing> 的 privatePath 支持多个文件夹
```

```text
<probing privatePath="MyLibraries;MyLibraries\Tests"/>
```

### 优先级

Understand that the CLR will load the first assembly it finds during the probing process.
For example, if the `C:\MyApp` folder did contain a copy of `CarLibrary.dll`, it will be loaded into memory,
while the copy in `MyLibraries` is effectively ignored.

```text
加载优先级的问题
```

### 注意事项

Next, for testing purposes, change the name of your configuration file (in one way or another) and
attempt to run the program once again. The client application should now fail.
Remember that `*.config` files must be prefixed with the same name as the related client application.

By way of a final test, open your configuration file for editing and capitalize any of the XML elements.
Once the file is saved, your client should fail to run once again (as XML is case-sensitive).

- 文件名（`CSharpCarClient.exe.config`）不对时，不能正确执行
- 文件内容里，出现大小写错误、字符错误，都不能执行成功

## The Role of the App.Config File

While you are always able to create XML configuration files by hand using your text editor of choice,
Visual Studio allows you to create a configuration file during the development of the client program.

By default, a new Visual Studio project will contain a configuration file for editing.
If you ever need to add one manually, you may do so via the Project ➤ Add New Item menu option.
Notice, you have left the name of this file as the suggested `App.config`.

![](/assets/images/csharp/vs/vs-add-app-config.png)

If you open this file for viewing, you'll see a minimal set of instructions,
to which you will add additional elements.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <startup> 
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.7.2" />
    </startup>
</configuration>
```

Each time you compile your project, Visual Studio will automatically copy
the data in `App.config` to a new file in the `\bin\Debug` directory
using the proper naming convention (such as `CSharpCarClient.exe.config`).
However, this behavior will happen only if your configuration file is indeed named `App.config`.

