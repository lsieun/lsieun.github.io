---
title: "Maven Lifecycle"
sequence: "102"
---

[UP](/maven-index.html)


![](/assets/images/maven/thinking-in-maven.png)



## 为什么要学习 Maven project lifecycle

As we start using Maven, we need to understand the Maven project lifecycle.
**Maven is implemented based around the concept of a build lifecycle.**
This means there is a clearly defined process to build and distribute artifacts with Maven.

## Built-in LifeCycle

### Clean

The clean lifecycle is responsible for cleaning the build output.
Its phases are as follows:

- Preclean
- Clean
- Postclean

```text
                       ┌─── Preclean
                       │
The clean lifecycle ───┼─── Clean
                       │
                       └─── Postclean
```

## 三个概念：lifecycle, phase, goal

What makes up a lifecycle?
The stages of **a lifecycle** are called **phases**.
In **each phase**, one or more **goals** can be executed.

```text
lifecycle ---> phase ---> task(goal)
```

Maven has three built-in build lifecycles:

- `default`: The `default` lifecycle handles project build and deployment
- `clean`: The `clean` lifecycle cleans up the files and folders  produced by Maven
- `site`: The `site` lifecycle handles the creation of project documentation

You will have noticed that **you do not have to explicitly specify a lifecycle**.
Instead, **what you specify is a phase**.
Maven infers the **lifecycle** based on the **phase** specified.

```text
mvn package
```

For instance, the `package` phase indicates it is the `default` lifecycle.

When Maven is run with the `package` phase as a parameter, the `default` build lifecycle gets executed.
Maven runs all the **phases** in sequence, up to and including **the specified phase** (in our case, the `package` phase).

When we invoke one phase from the command line,
Maven executes all the phases of the lifecycle from the beginning up to the specified phase (included).
In fact, one of the most common ways to run Maven is just to use the following syntax:

```text
$ mvn <phase>
```

It will run all the portions of the respective lifecycle, ending with this phase.

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

| Phase             | Plugin                                                            | Goal                                    |
|-------------------|-------------------------------------------------------------------|-----------------------------------------|
| clean             | Maven Clean plugin                                                | clean                                   |
| site              | Maven Site plugin                                                 | site                                    |
| process-resources | Maven Resources plugin                                            | resource                                |
| compile           | Maven Compiler plugin                                             | compile                                 |
| test              | Maven Surefire plugin                                             | test                                    |
| package           | Varies based on the packaging; for instance, the Maven JAR plugin | jar (in the case of a Maven JAR plugin) |
| install           | Maven Install plugin                                              | install                                 |
| deploy            | Maven Deploy plugin                                               | deploy                                  |


## Lifecycle Binding

### Jar

```xml
<!--
 | JAR
 |-->
<component>
    <role>org.apache.maven.lifecycle.mapping.LifecycleMapping</role>
    <role-hint>jar</role-hint>
    <implementation>org.apache.maven.lifecycle.mapping.DefaultLifecycleMapping</implementation>
    <configuration>
        <lifecycles>
            <lifecycle>
                <id>default</id>
                <!-- START SNIPPET: jar-lifecycle -->
                <phases>
                    <process-resources>
                        org.apache.maven.plugins:maven-resources-plugin:2.6:resources
                    </process-resources>
                    <compile>
                        org.apache.maven.plugins:maven-compiler-plugin:3.1:compile
                    </compile>
                    <process-test-resources>
                        org.apache.maven.plugins:maven-resources-plugin:2.6:testResources
                    </process-test-resources>
                    <test-compile>
                        org.apache.maven.plugins:maven-compiler-plugin:3.1:testCompile
                    </test-compile>
                    <test>
                        org.apache.maven.plugins:maven-surefire-plugin:2.12.4:test
                    </test>
                    <package>
                        org.apache.maven.plugins:maven-jar-plugin:2.4:jar
                    </package>
                    <install>
                        org.apache.maven.plugins:maven-install-plugin:2.4:install
                    </install>
                    <deploy>
                        org.apache.maven.plugins:maven-deploy-plugin:2.7:deploy
                    </deploy>
                </phases>
                <!-- END SNIPPET: jar-lifecycle -->
            </lifecycle>
        </lifecycles>
    </configuration>
</component>
```

### maven-plugin

```xml
<!--
 | MAVEN PLUGIN
 |-->
<component>
    <role>org.apache.maven.lifecycle.mapping.LifecycleMapping</role>
    <role-hint>maven-plugin</role-hint>
    <implementation>org.apache.maven.lifecycle.mapping.DefaultLifecycleMapping</implementation>
    <configuration>
        <lifecycles>
            <lifecycle>
                <id>default</id>
                <!-- START SNIPPET: maven-plugin-lifecycle -->
                <phases>
                    <process-resources>
                        org.apache.maven.plugins:maven-resources-plugin:2.6:resources
                    </process-resources>
                    <compile>
                        org.apache.maven.plugins:maven-compiler-plugin:3.1:compile
                    </compile>
                    <process-classes>
                        org.apache.maven.plugins:maven-plugin-plugin:3.2:descriptor
                    </process-classes>
                    <process-test-resources>
                        org.apache.maven.plugins:maven-resources-plugin:2.6:testResources
                    </process-test-resources>
                    <test-compile>
                        org.apache.maven.plugins:maven-compiler-plugin:3.1:testCompile
                    </test-compile>
                    <test>
                        org.apache.maven.plugins:maven-surefire-plugin:2.12.4:test
                    </test>
                    <package>
                        org.apache.maven.plugins:maven-jar-plugin:2.4:jar,
                        org.apache.maven.plugins:maven-plugin-plugin:3.2:addPluginArtifactMetadata
                    </package>
                    <install>
                        org.apache.maven.plugins:maven-install-plugin:2.4:install
                    </install>
                    <deploy>
                        org.apache.maven.plugins:maven-deploy-plugin:2.7:deploy
                    </deploy>
                </phases>
                <!-- END SNIPPET: maven-plugin-lifecycle -->
            </lifecycle>
        </lifecycles>
    </configuration>
</component>
```
