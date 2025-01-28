---
title: "add + commit"
sequence: "101"
---

```java
import org.eclipse.jgit.api.AddCommand;
import org.eclipse.jgit.api.CommitCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;

import java.io.File;
import java.io.IOException;

public class GitCommitRun {
    public static void main(String[] args) {
        File localRepo = PathManager.getLocalRepo();

        try (
                Git git = Git.open(localRepo)
        ) {
            // git add
            AddCommand add = git.add();
            add.addFilepattern(".").call();

            // git commit
            CommitCommand commit = git.commit();
            commit.setMessage("initial commit").call();
        } catch (IOException | GitAPIException e) {
            throw new RuntimeException(e);
        }
    }
}
```
