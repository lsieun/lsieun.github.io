---
title: "本地仓库：克隆远程仓库"
sequence: "102"
---

```java
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;

import java.io.File;

public class CloneRepo {
    public static void main(String[] args) throws GitAPIException {
        String remoteRepo = "https://github.com/lsieun/lsieun-utils";
        String localRepo = "D:\\git-tmp\\lsieun-utils";
        Git git = Git.cloneRepository()
                .setURI(remoteRepo)
                .setDirectory(new File(localRepo))
                .call();
        git.close();
    }
}
```
