---
title: "Understanding .NET Application Domains"
sequence: "101"
---

Under the .NET platform, executables are not hosted directly within a **Windows process**,
as is the case in traditional unmanaged applications.
Rather, a .NET executable is hosted by a logical partition within a process called an **application domain**.
As you will see, a single process may contain multiple application domains,
each of which is hosting a .NET executable.

```text
Windows process --> application domain --> .Net executable
```

As mentioned, a single process can host any number of AppDomains,
each of which is fully and completely isolated from other AppDomains within this process (or any other process).
Given this fact, be aware that an application running in one AppDomain is unable to obtain data of any kind
(global variables or static fields) within another AppDomain,
unless they use a distributed programming protocol (such as Windows Communication Foundation).

While a single process may host multiple AppDomains, this is not typically the case.
At the least, an OS process will host what is termed the **default application domain**.
This specific application domain is automatically created by the CLR at the time the process launches.
After this point, the CLR creates additional application domains on an as-needed basis.




