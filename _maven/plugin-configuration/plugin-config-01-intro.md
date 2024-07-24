---
title: "Configuring Plug-ins"
sequence: "101"
---

[UP](/maven-index.html)


In Maven, there are two kinds of plugins, **build** and **reporting**:

- **Build plugins** are executed during the build and configured in the `<build/>` element.
- **Reporting plugins** are executed during the site generation and configured in the `<reporting/>` element.

All plugins should have minimal required information: `groupId`, `artifactId` and `version`.

## two options

In most cases where you need to configure a plugin, there are two options that work well:

- plugin-level configuration
- execution-level configuration

```text
                        ┌─── plugin-level configuration
plugin configuration ───┤
                        └─── execution-level configuration
```

```text
mvn myqyeryplugin:queryMojo@execution1
```

### Plugin-level configuration

**Plugin-level configuration** is the most common method for

- configuring plugins that will be used from the command line,
- are defined as part of the default lifecycle,
- or that use a common configuration across all invocations.

### execution-level configuration

On the other hand, in cases where a more advanced build process
requires the execution of mojos - sometimes the same mojos, sometimes different ones - from a single plugin
that use different configurations,
the **execution-level configuration** is most commonly used.
These cases normally involve plugins that are introduced as part of the standard build process,
but which aren't present in the default lifecycle mapping for that particular packaging.
In these cases, **common settings shared between executions** are still normally specified in the **plugin-level configuration**.

However, these two options leave out a few important configuration use cases:

- Mojos run from the command line and during the build, when the CLI-driven invocation requires its own configuration.
- Mojo executions that are bound to the lifecycle as part of the default mapping for a particular packaging,
  especially in cases where the same mojos need to be added to a second execution with different configuration.
- Groups of mojos from the same plugin that are bound to the lifecycle
  as part of the default mapping for a particular packaging, but require separate configurations.

## Default executionIds for Implied Executions

When you consider the fact that the aforementioned configuration use cases are for mojos
that are not explicitly mentioned in the POM,
it's reasonable to refer to them as **implied executions**.

But if they're implied, how can Maven allow users to provide configuration for them?
The solution we've implemented is rather simple and low-tech,
but should be more than adequate to handle even advanced use cases.
Starting in Maven 2.2.0, **each mojo invoked directly from the command line**
will have an execution Id of `default-cli` assigned to it,
which will allow the configuration of that execution from the POM by using this default execution Id.

Likewise, **each mojo bound to the build lifecycle** via the default lifecycle mapping for the specified POM packaging
will have an execution Id of `default-<goalName>` assigned to it,
to allow configuration of each default mojo execution independently.


## Reference

- [Guide to Configuring Plug-ins](https://maven.apache.org/guides/mini/guide-configuring-plugins.html)
- [Guide to Configuring Default Mojo Executions](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)
