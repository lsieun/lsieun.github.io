---
title: "Acl 权限"
sequence: "102"
---

[UP](/java/java-io-index.html)

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.AclEntry;
import java.util.List;

public class FilePermissionAttribute_A_Acl {
    public static void main(String[] args) throws IOException {
        // path
        Path path = Path.of("D:/tmp/abc.txt");

        // owner
        Object owner = Files.getAttribute(path, "acl:owner");

        // acl
        @SuppressWarnings("unchecked")
        List<AclEntry> aclEntries = (List<AclEntry>) Files.getAttribute(path, "acl:acl");
        int size = aclEntries.size();

        // print
        String[][] matrix = new String[size + 3][2];
        matrix[0][0] = "Path";
        matrix[0][1] = String.valueOf(path);
        matrix[1][0] = "Owner";
        matrix[1][1] = String.valueOf(owner);
        matrix[2][0] = "AclEntries.size";
        matrix[2][1] = String.valueOf(size);
        for (int i = 0; i < size; i++) {
            AclEntry aclEntry = aclEntries.get(i);
            matrix[i + 3][0] = String.format("AclEntries[%d]", i);
            matrix[i + 3][1] = String.valueOf(aclEntry);
        }

        TableUtils.printTable(matrix, TableType.ONE_LINE);
    }
}
```
