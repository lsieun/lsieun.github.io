---
title: "不重启 AutoCAD （使用 Json）"
sequence: "104"
---

## Lsieun.Cad.Bridge

### 添加引用

第 1 步，在 `Lsieun.Cad.Bridge` 的 `References` 上右键选择 `Manage Nuget Packages...`：

![](/assets/images/cad/csharp/quick/dev-035-manage-nuget-packages.png)

第 2 步，搜索和安装 `Newtonsoft.Json`：

![](/assets/images/cad/csharp/quick/dev-036-nuget-newtonsoft-json.png)

第 3 步，点击 OK：

![](/assets/images/cad/csharp/quick/dev-037-nuget-preview-newtonsoft-json.png)


### 编写代码

```csharp
namespace Lsieun.Cad.Bridge
{
    public class CmdInfo
    {
        public string DllName { get; set; }
        public string ClassName { get; set; }
        public string MethodName { get; set; }
    }
}
```

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Reflection;

namespace Lsieun.Cad.Bridge
{
    public class SimpleBridge
    {
        [CommandMethod("LSIEUN")]
        public void WalkThrough()
        {
            // 第 1 步，准备参数
            CmdInfo cmdInfo = new CmdInfo();
            string jsonFile = @"D:\autocad-plugin.json";
            using (StreamReader file = File.OpenText(jsonFile))
            {
                using (JsonTextReader reader = new JsonTextReader(file))
                {
                    JObject obj = (JObject)JToken.ReadFrom(reader);
                    cmdInfo.DllName = obj["DllName"].ToString();
                    cmdInfo.ClassName = obj["ClassName"].ToString();
                    cmdInfo.MethodName = obj["MethodName"].ToString();
                }
            }
            string dllName = cmdInfo.DllName;
            string className = cmdInfo.ClassName;
            string methodName = cmdInfo.MethodName;

            // 第 2 步，进行反射
            var adapterFileInfo = new FileInfo(Assembly.GetExecutingAssembly().Location);
            var targetFilePath = Path.Combine(adapterFileInfo.DirectoryName, dllName);
            var targetAssembly = Assembly.Load(File.ReadAllBytes(targetFilePath));
            var targetType = targetAssembly.GetType(className);
            var targetMethod = targetType.GetMethod(methodName);
            var targetObject = Activator.CreateInstance(targetType);

            Action cmd = () => targetMethod.Invoke(targetObject, null);

            try
            {
                cmd?.Invoke();
            }
            catch (System.Exception ex)
            {
                string msg = ex.Message;
                Editor editor = Application.DocumentManager.MdiActiveDocument.Editor;
                editor.WriteMessage(msg);
            }
        }
    }
}
```

## Lsieun.Cad.Basic

```csharp
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;

namespace Lsieun.Cad.Basic
{
    public class QuickStart
    {
        [CommandMethod("CmdHello")]
        public void CmdHello()
        {
            Editor editor = Application.DocumentManager.MdiActiveDocument.Editor;
            editor.WriteMessage("Hello AutoCAD 二次开发");
        }

        [CommandMethod("CmdSum")]
        public void CmdSum() 
        {
            int n = 100;
            int sum = 0;
            for (int i = 1; i <= n; i++) {
                sum += i;
            }

            string msg = "从 1 到 " + n + " 的和是 " + sum;

            Editor editor = Application.DocumentManager.MdiActiveDocument.Editor;
            editor.WriteMessage(msg);
        }
    }
}
```

## autocad-plugin.json

第 1 次的内容：

```json
{
    "DllName": "Lsieun.Cad.Basic.dll",
    "ClassName": "Lsieun.Cad.Basic.QuickStart",
    "MethodName": "CmdHello"
}
```

第 2 次的内容：

```json
{
    "DllName": "Lsieun.Cad.Basic.dll",
    "ClassName": "Lsieun.Cad.Basic.QuickStart",
    "MethodName": "CmdSum"
}
```

## AutoCAD 测试

在 AutoCAD 中，输入 `NETLOAD` 命令，然后选择 `Lsieun.Cad.Bridge.dll` 文件进行测试。