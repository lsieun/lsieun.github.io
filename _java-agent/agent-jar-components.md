---
title:  "Agent Jar的组成部分"
sequence: "102"
---

{:refdef: style="text-align: center;"}
![Agent Jar中的三个组成部分](/assets/images/java/agent/main-content-of-agent-jar.jpg)
{: refdef}


## Manifest Attributes

The following manifest attributes are defined for an agent JAR file:(内容摘抄自[这里](https://docs.oracle.com/javase/8/docs/api/java/lang/instrument/package-summary.html))

- `Premain-Class`: When an agent is specified at JVM launch time this attribute specifies the agent class. That is, the class containing the `premain` method. When an agent is specified at JVM launch time this attribute is required. If the attribute is not present the JVM will abort. Note: this is a class name, not a file name or path.
- `Agent-Class`: If an implementation supports a mechanism to start agents sometime after the VM has started then this attribute specifies the agent class. That is, the class containing the `agentmain` method. This attribute is required, if it is not present the agent will not be started. Note: this is a class name, not a file name or path.
- `Boot-Class-Path`: A list of paths to be searched by the bootstrap class loader. Paths represent directories or libraries (commonly referred to as JAR or zip libraries on many platforms). These paths are searched by the bootstrap class loader after the platform specific mechanisms of locating a class have failed. Paths are searched in the order listed. Paths in the list are separated by one or more spaces. A path takes the syntax of the path component of a hierarchical URI. The path is absolute if it begins with a slash character (`/`), otherwise it is relative. A relative path is resolved against the absolute path of the agent JAR file. Malformed and non-existent paths are ignored. When an agent is started sometime after the VM has started then paths that do not represent a JAR file are ignored. This attribute is optional.
- `Can-Redefine-Classes`: Boolean (`true` or `false`, case irrelevant). Is the ability to redefine classes needed by this agent. Values other than `true` are considered `false`. This attribute is optional, the default is `false`.
- `Can-Retransform-Classes`: Boolean (`true` or `false`, case irrelevant). Is the ability to retransform classes needed by this agent. Values other than `true` are considered `false`. This attribute is optional, the default is `false`.
- `Can-Set-Native-Method-Prefix`: Boolean (`true` or `false`, case irrelevant). Is the ability to set native method prefix needed by this agent. Values other `than` true are considered `false`. This attribute is optional, the default is `false`.

An agent JAR file may have both the `Premain-Class` and `Agent-Class` attributes present in the manifest.

- When the agent is started on the command-line using the `-javaagent` option then the `Premain-Class` attribute specifies the name of the agent class and the `Agent-Class` attribute is ignored.
- Similarly, if the agent is started sometime after the VM has started, then the `Agent-Class` attribute specifies the name of the agent class (the value of `Premain-Class` attribute is ignored).
