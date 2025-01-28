---
title: "Policy"
sequence: "103"
---


```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <!--Runtime binding info -->
    <runtime>
        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
            <dependentAssembly>
                <assemblyIdentity name="CarLibrary" publicKeyToken="ad6d5029a777c05a" culture="neutral"/>
                <bindingRedirect oldVersion="1.4.3.2" newVersion="2.0.0.0"/>
            </dependentAssembly>
        </assemblyBinding>
    </runtime>
</configuration>
```

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <runtime>
        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
            <dependentAssembly>
                <assemblyIdentity name="CarLibrary" publicKeyToken="ad6d5029a777c05a" culture="neutral"/>
                <bindingRedirect oldVersion="1.0.0.0-1.9.0.0" newVersion="2.0.0.0"/>
            </dependentAssembly>
        </assemblyBinding>
    </runtime>
</configuration>
```

## Policy

```xml

<configuration>
    <runtime>
        <assemblyBinding xmlns="urn:schemas-microsoft-com:asm.v1">
            <dependentAssembly>
                <assemblyIdentity name="Microsoft.PowerShell.Commands.Management"
                                  publicKeyToken="31bf3856ad364e35"
                                  culture="neutral"/>
                <bindingRedirect oldVersion="1.0.0.0"
                                 newVersion="3.0.0.0"/>
            </dependentAssembly>
        </assemblyBinding>
    </runtime>
</configuration>
```


