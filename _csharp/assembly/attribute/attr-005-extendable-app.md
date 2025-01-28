---
title: "Extendable Application"
sequence: "105"
---

To serve as a road map, the extendable application entails the following assemblies:

- `CommonSnappableTypes.dll`: This assembly contains type definitions
  that will be used by each snap-in object and will be directly referenced by the Windows Forms application.
- `CSharpSnapIn.dll`: A snap-in written in C#, which leverages the types of `CommonSnappableTypes.dll`.
- `VbSnapIn.dll`: A snap-in written in Visual Basic, which leverages the types of `CommonSnappableTypes.dll`.
- `MyExtendableApp.exe`: A console application that may be extended by the functionality of each snap-in.

## CommonSnappableType

```csharp
using System;

namespace CommonSnappableTypes
{
    public interface IAppFunctionality
    {
        void DoIt();
    }

    [AttributeUsage(AttributeTargets.Class)]
    public sealed class CompanyInfoAttribute : Attribute
    {
        public string CompanyName { get; set; }
        public string CompanyUrl { get; set; }
    }
}
```

## CSharp Module

```csharp
using System;
using CommonSnappableTypes;

namespace CSharpSnapIn
{
    [CompanyInfo(CompanyName = "FooBar", CompanyUrl = "www.FooBar.com")]
    public class CSharpModule : IAppFunctionality
    {
        public void DoIt()
        {
            Console.WriteLine("You have just used the C# snap-in!");
        }
    }
}
```

## Visual Basic Snap-In

```vb
Imports CommonSnappableTypes

<CompanyInfo(CompanyName:="Chucky's Software", CompanyUrl:="www.ChuckySoft.com")>
Public Class VbSnapIn
    Implements IAppFunctionality
    Public Sub DoIt() Implements IAppFunctionality.DoIt
        Console.WriteLine("You have just used the VB snap in!")
    End Sub

End Class
```

## Extendable Console Application

The `STAThread` attribute is required for the Open File dialog;
all Windows GUI applications are single-threaded (for the user interface).

```csharp
using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Windows.Forms;
using CommonSnappableTypes;

namespace MyExtendableApp
{
    internal class Program
    {
        [STAThread]
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Welcome to MyTypeViewer *****");
            do
            {
                Console.WriteLine("\nWould you like to load a snapin? [Y,N]");

                // Get name of type.
                string answer = Console.ReadLine();

                // Does user want to quit?
                if (!answer.Equals("Y", StringComparison.OrdinalIgnoreCase))
                {
                    break;
                }

                // Try to display type.
                try
                {
                    LoadSnapin();
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Sorry, can't find snapin");
                }
            } while (true);
        }


        static void LoadSnapin()
        {
            // Allow user to select an assembly to load.
            OpenFileDialog dlg = new OpenFileDialog
            {
                // set the initial directory to the path of this project
                InitialDirectory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location),
                Filter = "assemblies (*.dll)|*.dll|All files (*.*)|*.*",
                FilterIndex = 1
            };

            if (dlg.ShowDialog() != DialogResult.OK)
            {
                Console.WriteLine("User cancelled out of the open file dialog.");
                return;
            }

            if (dlg.FileName.Contains("CommonSnappableTypes"))
            {
                Console.WriteLine("CommonSnappableTypes has no snap-ins!");
            }
            else if (!LoadExternalModule(dlg.FileName))
            {
                Console.WriteLine("Nothing implements IAppFunctionality!");
            }
        }


        private static bool LoadExternalModule(string path)
        {
            bool foundSnapIn = false;
            Assembly theSnapInAsm = null;
            try
            {
                // Dynamically load the selected assembly.
                theSnapInAsm = Assembly.LoadFrom(path);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred loading the snapin: {ex.Message}");
                return foundSnapIn;
            }

            // Get all IAppFunctionality compatible classes in assembly.
            var theClassTypes = from t in theSnapInAsm.GetTypes()
                where t.IsClass && (t.GetInterface("IAppFunctionality") != null)
                select t;
            
            // Now, create the object and call DoIt() method.
            foreach (Type t in theClassTypes)
            {
                foundSnapIn = true;

                // Use late binding to create the type.
                IAppFunctionality itfApp = (IAppFunctionality)theSnapInAsm.CreateInstance(t.FullName, true);
                itfApp?.DoIt();

                // lstLoadedSnapIns.Items.Add(t.FullName);

                // Show company info.
                DisplayCompanyData(t);
            }

            return foundSnapIn;
        }


        private static void DisplayCompanyData(Type t)
        {
            // Get [CompanyInfo] data.
            var compInfo = from ci in t.GetCustomAttributes(false)
                where (ci is CompanyInfoAttribute)
                select ci;

            // Show data.
            foreach (CompanyInfoAttribute c in compInfo)
            {
                Console.WriteLine($"More info about {c.CompanyName} can be found at {c.CompanyUrl}");
            }
        }
    }
}
```

## Summary

In the world of .NET, the keys to reflection services revolve around
the `System.Type` class and the `System.Reflection` namespace.

**Late binding** is the process of creating an instance of a type and
invoking its members without prior knowledge of the specific names of said members.

**Late binding** is often a direct result of **dynamic loading**,
which allows you to load a .NET assembly into memory programmatically.
