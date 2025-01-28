---
title: "Mojo Intro"
sequence: "101"
---

[UP](/maven-index.html)


**What is a Mojo**? A mojo is a **Maven plain Old Java Object**.

Each mojo is an executable goal in Maven,
and a plugin is a distribution of one or more related mojos.

## Plugin Naming Convention

Important Notice: Plugin Naming Convention and Apache Maven Trademark
[Link](https://maven.apache.org/guides/plugin/guide-java-plugin-development.html)

You will typically name your plugin `<yourplugin>-maven-plugin`.

Calling it `maven-<yourplugin>-plugin` (note "Maven" is at the beginning of the plugin name) is strongly discouraged
since it's a reserved naming pattern for official Apache Maven plugins
maintained by the Apache Maven team with groupId `org.apache.maven.plugins`.
Using this naming pattern is an infringement of the Apache Maven Trademark.



In order to implement a Mojo, we need to extend the `AbstractMojo` abstract class.
This class provides some common utility methods.

The first inherited method that we will see is `getLog()`.
This method returns a logger of type `org.apache.maven.plugin.logging.Log`.
Such a logger allows you to write on output of the plugin's execution.

The plugin logger provides **three different levels** of output: **info**, **error**, and **debug**.

Another inherited method is `getPluginContext()`.
This method returns `java.util.Map` containing all the property mappings defined in Mojo's context.  
These mappings contain all the properties explained before, that are visible from Mojo's POM.
We can access the basedir property using the following notation:

```text
String baseDir = (String) getPluginContext("basedir");
```

Using the setter method, we set a custom plugin context to our Mojo, as follows:

```text
public void setPluginContext(Map pluginContext)
```

We can get the plugin context map using getPluginContext, add some parameters,
and set the new map with setPluginContext.
