---
title: "Java Logging in Containers"
sequence: "101"
---

[UP](/java/java-logging-index.html)


Think about the environment your application is going to be running in.
There is a difference in logging configuration

- when you are running your Java code in a VM or on a bare-metal machine,
- it is different when running it in a containerized environment, and of course,
- it is different when you run your Java or Kotlin code on an Android device.

To set up logging in a containerized environment you need to choose the approach you want to take.
You can use one of the provided logging drivers – like the journald, logagent, Syslog, or JSON file.
To do that, **remember that your application shouldn't write the log file to the container ephemeral storage,**
**but to the standard output.**
That can be easily done by configuring your logging framework to write the log to the console.


## Reference

- [Java Logging Best Practices: 10+ Tips You Should Know to Get the Most Out of Your Logs](https://sematext.com/blog/java-logging-best-practices/)
