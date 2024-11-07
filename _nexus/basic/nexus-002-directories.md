---
title: "Directories"
sequence: "102"
---

## Directories

After you extract the repository manager archive, two directories will appear:

![](/assets/images/nexus3/nexus-install-dir.png)

- `$install-dir`: `nexus-3.xx.x`, contains the **Nexus Repository Manager application** and
  all the required additional components
  such as Java libraries and configuration files.
- `$data-dir`: `sonatype-work/nexus3`, contains all the **repositories**, **components** and
  other data that are stored and managed by the repository manager.

## Installation directory

- `LICENSE.txt`, `NOTICE.txt`: These are files that contain legal details about the license and copyright notices
- `bin/`: This directory contains the `nexus` startup script itself as well as startup-related configuration files
- `etc/`: This directory contains configuration files
- `lib/`: This directory contains binary libraries related to Apache Karaf
- `public/`: This directory contains public resources of the application
- `system/`: This directory contains all components and plugins that constitute the application

![](/assets/images/nexus3/nexus-install-dir-files.png)

## Data directory

![](/assets/images/nexus3/nexus-data-dir-files.png)

Files and directories under the data directory include:

- `blobs/`: The parent directory of all file system based blob stores
  that are not defined with an absolute storage path.
  For example, the **default blob** store will live at `sonatype-work/nexus3/blobs/default`.
- `cache/`: This directory contains information on currently cached Karaf bundles
- `db/`: This directory contains the OrientDB databases
  which are the primary storage for your repository manager's metadata
- `elasticsearch/`: This directory contains the currently configured state of Elasticsearch
- `etc/`: This directory contains the main runtime configuration and customization of the repository manager.
- `health-check/`: This directory contains cached reports from the Repository Health Check feature
- `keystores/`: This contains the automatically generated key used to identify your repository manager
- `log/`: This directory and sub-directories contain active and archived application log files.
- `tmp/`: This directory is used for temporary storage

### log

You can choose to delete old log files from the logs directory to reclaim disk.
Only 90 days of rotated logs are automatically kept.

- `nexus.log`: **The main repository manager application log, rotated and compressed daily.**
  Log messages contain standard log output fields including date/time, log level,
  the associated thread, class and message.
- `request.log`: Inbound HTTP request log, rotated and compressed daily.
  Log messages include information such as date/time, client IP, authenticated user id, user-agent header value,
  response status code, bytes sents, and total response time.
- `jvm.log`: Contains JVM stdout, stderr and full thread dumps when explicitly triggered.
  This log file is normally only relevant when thread dumps need to be extracted from it.
  This file is not rotated because it should not grow very large. On each application start,
  the entire contents of this file will be replaced.
- `karaf.log`: This is the Apache Karaf container log file
  which contains messages specific to the repository manager startup
- `audit.log`: The active log file is named `audit.log`. Audit logs are rotated and compressed daily.
- `log/audit/`: When Auditing is enabled, audit logs are written to this directory.
- `log/tasks/`: Tasks can generate logs for each execution so that one can better examine what that task did.
  These log files include messages that would typically be too noisy to put into the main application log.
  Logs are named by task internal name and a timestamp. See Task Logging for more details about these files.

![](/assets/images/nexus3/nexus-data-log-files.png)

## Reference

- [Directories](https://help.sonatype.com/repomanager3/installation-and-upgrades/directories)
