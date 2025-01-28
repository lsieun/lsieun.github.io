---
title: "常见问题"
sequence: "121"
---

## Memory overcommit

```text
WARNING Memory overcommit must be enabled! Without it, a background save or replication may fail under low memory condition.
```

If you see a warning like this, you have to enable overcommit on your host machine (outside docker).

Solution
- `echo "vm.overcommit_memory = 1" | sudo tee /etc/sysctl.d/nextcloud-aio-memory-overcommit.conf` should be set,
  to enable Memory overcommit on reboot, change will apply after reboot
- `sysctl "vm.overcommit_memory=1"` enables Memory overcommit on-the-fly temporary