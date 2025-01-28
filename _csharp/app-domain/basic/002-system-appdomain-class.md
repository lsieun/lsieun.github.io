---
title: "The System.AppDomain Class"
sequence: "102"
---

The .NET platform allows you to programmatically monitor AppDomains,
create new AppDomains (or unload them) at runtime, load assemblies into AppDomains,
and perform a whole slew of additional tasks, using the `System.AppDomain` class
in the `System` namespace of `mscorlib.dll`.

- DLL: `mscorlib.dll`
- Class: `System.AppDomain`


## Select Methods of AppDomain

- `CreateDomain()`: This static method allows you to create a new `AppDomain` in the current process.
- `CreateInstance()`: This creates an instance of a type in an external assembly,
  after loading assembly into the calling application domain.
- `ExecuteAssembly()`: This method executes an `*.exe` assembly within an application domain, given its file name.
- `GetAssemblies()`: This method gets the set of .NET assemblies that have been loaded into this
  application domain (COM-based or C-based binaries are ignored).
- `GetCurrentThreadId()`: This static method returns the ID of the active thread in the current application domain.
- `Load()`: This method is used to dynamically load an assembly into the current application domain.
- `Unload()`: This is another static method that allows you to unload a specified AppDomain within a given process.

## Select Properties of AppDomain

- `BaseDirectory`: This gets the directory path that the assembly resolver uses to probe for assemblies.
- `CurrentDomain`: This static property gets the application domain for the currently executing thread.
- `FriendlyName`: This gets the friendly name of the current application domain.
- `MonitoringIsEnabled`: This gets or sets a value that indicates whether CPU and memory monitoring
  of application domains is enabled for the current process. Once monitoring is
  enabled for a process, it cannot be disabled.
- `SetupInformation`: This gets the configuration details for a given application domain, represented
  by an `AppDomainSetup` object.

## Select Events of the AppDomain Type

- `AssemblyLoad`: This occurs when an assembly is loaded into memory.
- `AssemblyResolve`: This event will fire when the assembly resolver cannot find the location of a required assembly.
- `DomainUnload`: This occurs when an AppDomain is about to be unloaded from the hosting process.
- `FirstChanceException`: This event allows you to be notified that an exception has been thrown from
  the application domain, before the CLR will begin looking for a fitting catch statement.
- `ProcessExit`: This occurs on the default application domain when the default application domain's parent process exits.
- `UnhandledException`: This occurs when an exception is not caught by an exception handler.

