---
title: "本地仓库：打开"
sequence: "103"
---

```java
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.lib.Repository;

import java.io.File;
import java.io.IOException;

public class LocalRepo {
    public static void main(String[] args) throws IOException {
        String localRepo = "D:\\git-tmp\\my-repo";

        // 第 1 步，打开 Git 和 Repository
        Git git = Git.open(new File(localRepo));
        Repository repository = git.getRepository();

        // 第 2 步，获取分支信息
        String branch = repository.getBranch();
        System.out.println("branch = " + branch);

        // 第 3 步，关闭 Repository 和 Git
        repository.close();
        git.close();
    }
}
```
