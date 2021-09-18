---
title:  "Maven Lifecycle"
sequence: "102"
---

{:refdef: style="text-align: center;"}
![](/assets/images/maven/thinking-in-maven.png)
{: refdef}



## 为什么要学习Maven project lifecycle

As we start using Maven, we need to understand the Maven project lifecycle.
**Maven is implemented based around the concept of a build lifecycle.**
This means there is a clearly defined process to build and distribute artifacts with Maven.

## 三个概念：lifecycle, phase, goal

What makes up a lifecycle?
The stages of **a lifecycle** are called **phases**.
In **each phase**, one or more **goals** can be executed.

Maven has three built-in build lifecycles:

- `default`: The `default` lifecycle handles project build and deployment
- `clean`: The `clean` lifecycle cleans up the files and folders  produced by Maven
- `site`: The site lifecycle handles the creation of project documentation

You will have noticed that **you do not have to explicitly specify a lifecycle**.
Instead, **what you specify is a phase**.
Maven infers the **lifecycle** based on the **phase** specified.

```text
mvn package
```

For instance, the `package` phase indicates it is the `default` lifecycle.

When Maven is run with the `package` phase as a parameter, the `default` build lifecycle gets executed.
Maven runs all the **phases** in sequence, up to and including **the specified phase** (in our case, the `package` phase).

### lifecycle = phases

While **each lifecycle has a number of phases**, let us look at the important **phases** for each **lifecycle**:

- The `clean` lifecycle: The `clean` phase removes all the files and folders created by Maven as part of its build
- The `site` lifecycle: The `site` phase generates the project's documentation, which can be published, as well as a template that can be customized further
- The `default` lifecycle: The following are some of the important phases of the `default` lifecycle:
  - `validate`: This phase validates that all project information is available and correct
  - `process-resources`: This phase copies project resources to the destination to package
  - `compile`: This phase compiles the source code
  - `test`: This phase runs unit tests within a suitable framework
  - `package`: This phase packages the compiled code in its distribution format
  - `integration-test`: This phase processes the package in the integration test environment
  - `verify`: This phase runs checks to verify that the package is valid
  - `install`: This phase installs the package in the local repository
  - `deploy`: This phase installs the final package in the configured repository

### phase = plugin goals

**Each phase is made up of plugin goals.**
**A plugin goal** is **a specific task** that builds the project.
Some goals make sense only in specific phases
(for example, the `compile` goal of the Maven Compiler plugin makes sense in the `compile` phase,
but the `checkstyle` goal of the Maven Checkstyle plugin can potentially be run in any phase).
So some goals are bound to a specific phase of a lifecycle, while others are not.

Here is a table of **phases**, **plugins**, and **goals**:

| Phase | Plugin | Goal |
|-------|--------|------|
| clean | Maven Clean plugin | clean |
| site | Maven Site plugin | site |
| process-resources | Maven Resources plugin | resource |
| compile | Maven Compiler plugin | compile |
| test | Maven Surefire plugin | test |
| package | Varies based on the packaging; for instance, the Maven JAR plugin | jar (in the case of a Maven JAR plugin) |
| install | Maven Install plugin | install |
| deploy | Maven Deploy plugin | deploy |



