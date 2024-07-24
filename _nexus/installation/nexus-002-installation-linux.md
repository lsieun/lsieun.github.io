---
title: "Nexus Installation (Linux)"
sequence: "102"
---

The downloaded GZip'd TAR archive can be extracted with the command `tar xvzf`.

**For production, it is not recommend that nexus be run from a users home directory, a common practice is to use `/opt`.**

## Running Repository Manager in the Foreground

To start the repository manager from application directory in the `bin` folder on a Unix-like platform like Linux use:

```text
./nexus run
```

Starting the repository manager with the `run` command will
leave it running in the current shell and display the log output.
The running application can be stopped using `CTRL+C` at the appropriate console.

The application can be accessed once the log shows the message "**Started Sonatype Nexus.**"

## Running Repository Manager in the Background

The `nexus` script can be used to manage the repository manager as a background application on OSX and Unix
with the `start`, `stop`, `restart`, `force-reload` and `status` commands.

To start repository manager and run it in the background:

```text
./nexus start
```

While running in the background, all logging will go to the application log file.

To stop repository manager running in the background:

```text
./nexus stop
```

## 其它

```text
jar -uvf license-bundle-1.6.0.jar org/sonatype/licensing/trial/internal/DefaultTrialLicenseManager.class
```

```text
jar -uvf nexus-bootstrap-3.40.1-01.jar org/sonatype/nexus/bootstrap/osgi/BootstrapListener.class
```

替换Jar包：

```text
nexus-3.xx.x/system/com/sonatype/licensing/license-bundle/1.6.0/license-bundle-1.6.0.jar
```

To downgrade a Nexus Repository Manager (NXRM) 3 PRO instance to OSS:

- Gracefully stop NXRM.
- Open the file `<data-dir>/etc/nexus.properties` in a text editor.
- Add a new line to the file containing:

```text
nexus.loadAsOSS=true
```

```text
nexus.loadAsOSS=false
```

## Reference

- [Installation Methods](https://help.sonatype.com/repomanager3/installation-and-upgrades/installation-methods)
- [Run as a Service](https://help.sonatype.com/repomanager3/installation-and-upgrades/run-as-a-service)
