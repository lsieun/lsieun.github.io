---
title: "用户查询服务"
sequence: "101"
---

```java
import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.attribute.GroupPrincipal;
import java.nio.file.attribute.UserPrincipal;
import java.nio.file.attribute.UserPrincipalLookupService;

public class UserLookupServiceRun {
    public static void main(String[] args) throws IOException {
        // filesystem
        FileSystem fileSystem = FileSystems.getDefault();

        // service
        UserPrincipalLookupService service = fileSystem.getUserPrincipalLookupService();

        // lookup
        UserPrincipal userPrincipal = service.lookupPrincipalByName("Guest");
        GroupPrincipal groupPrincipal = service.lookupPrincipalByGroupName("Administrators");

        // print
        String[][] matrix = {
                {"fileSystem", String.valueOf(fileSystem)},
                {"getUserPrincipalLookupService()", String.valueOf(service)},
                {"lookupPrincipalByName()", String.valueOf(userPrincipal)},
                {"lookupPrincipalByGroupName()", String.valueOf(groupPrincipal)},
        };
        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```

```text
┌─────────────────────────────────┬───────────────────────────────────────────────────────┐
│           fileSystem            │         sun.nio.fs.WindowsFileSystem@7b23ec81         │
├─────────────────────────────────┼───────────────────────────────────────────────────────┤
│ getUserPrincipalLookupService() │ sun.nio.fs.WindowsFileSystem$LookupService$1@6acbcfc0 │
├─────────────────────────────────┼───────────────────────────────────────────────────────┤
│     lookupPrincipalByName()     │             DESKTOP-LBJA2CC\Guest (User)              │
├─────────────────────────────────┼───────────────────────────────────────────────────────┤
│  lookupPrincipalByGroupName()   │            BUILTIN\Administrators (Alias)             │
└─────────────────────────────────┴───────────────────────────────────────────────────────┘
```
