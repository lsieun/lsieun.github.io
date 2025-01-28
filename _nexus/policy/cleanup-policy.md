---
title: "Cleanup Policies"
sequence: "103"
---

If you are not cleaning out old and unused components, your repositories will grow quickly;
over time, this will present risks to your deployment:

- Storage costs will increase
- Performance is impacted
- Artifact discovery will take longer
- Consuming all available storage will result in server failure

You can create **cleanup policies** and assign them to one or more **proxy or hosted repositories**
so that a scheduled cleanup task (**Admin - Cleanup repositories** using their associated policies)
will automatically **soft delete** artifacts from the repository.
A soft delete means that artifacts are only marked for removal and not yet deleted from the disk.
Disk space is not reclaimed until the **Admin - Compact blob store** task runs.

```text
cleanup policies --> repositories --> soft delete --> compact blob store --> delete from disk
```

## Reference

- [Cleanup Policies](https://help.sonatype.com/repomanager3/nexus-repository-administration/repository-management/cleanup-policies)
