---
title: "本地仓库：初始化"
sequence: "101"
---

[UP](/jgit.html)

```java
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;

import java.io.File;

public class InitRepo {
    public static void main(String[] args) throws GitAPIException {
        String localRepo = "D:\\git-tmp\\my-repo";
        Git git = Git.init().setDirectory(new File(localRepo)).call();
        git.close();
    }
}
```
