---
title: "Reflecting on Attributes"
sequence: "104"
---

Remember that an attribute is quite useless until another piece of software reflects over its values.

## Reflecting on Attributes Using Early Binding

```csharp
using System;
using AttributedCarLibrary;

namespace VehicleDescriptionAttributeReader
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Value of VehicleDescriptionAttribute *****\n");
            ReflectOnAttributesUsingEarlyBinding();
            Console.ReadLine();
        }
        
        private static void ReflectOnAttributesUsingEarlyBinding()
        {
            // Get a Type representing the Winnebago.
            Type t = typeof(Winnebago);
            
            // Get all attributes on the Winnebago.
            object[] customAtts = t.GetCustomAttributes(false);
            
            // Print the description.
            foreach (VehicleDescriptionAttribute v in customAtts)
            {
                Console.WriteLine("-> {0}\n", v.Description);
            }
        }
    }
}
```

## Reflecting on Attributes Using Late Binding

```csharp
using System;
using System.Reflection;

namespace VehicleDescriptionAttributeReaderLateBinding
{
    internal class Program
    {
        public static void Main(string[] args)
        {
            Console.WriteLine("***** Value of VehicleDescriptionAttribute *****\n");
            ReflectAttributesUsingLateBinding();
            Console.ReadLine();
        }

        private static void ReflectAttributesUsingLateBinding()
        {
            try
            {
                // Load the local copy of AttributedCarLibrary.
                Assembly asm = Assembly.Load("AttributedCarLibrary");

                // Get type info of VehicleDescriptionAttribute.
                Type vehicleDesc = asm.GetType("AttributedCarLibrary.VehicleDescriptionAttribute");

                // Get type info of the Description property.
                PropertyInfo propDesc = vehicleDesc.GetProperty("Description");

                // Get all types in the assembly.
                Type[] types = asm.GetTypes();

                // Iterate over each type and obtain any VehicleDescriptionAttributes.
                foreach (Type t in types)
                {
                    object[] objs = t.GetCustomAttributes(vehicleDesc, false);

                    // Iterate over each VehicleDescriptionAttribute and print
                    // the description using late binding.
                    foreach (object o in objs)
                    {
                        Console.WriteLine("-> {0}: {1}\n", t.Name, propDesc.GetValue(o, null));
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }
    }
}
```

```text
***** Value of VehicleDescriptionAttribute *****

-> Motorcycle: My rocking Harley

-> HorseAndBuggy: The old gray mare, she ain't what she used to be...

-> Winnebago: A very long, slow, but feature-rich auto
```
