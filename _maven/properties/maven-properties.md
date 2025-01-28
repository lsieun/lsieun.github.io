---
title: "Maven Properties"
sequence: "101"
---

[UP](/maven-index.html)


## 分类

There are **six types of properties** that you can use within a Maven application POM file:

- Built-in properties（Maven 内置）
- Project properties （项目层面）
- Local settings （Maven 本地配置）
- Java system properties （JVM 层面）
- Environmental variables （OS 层面）
- Custom properties （自定义 - 项目层面）

Maven properties are referenced using the `${property-name}` syntax.
They can be used as follows:

- Anywhere in the POM
- In all the project resources under `/src/main/resources` (and/or under any other resource directories defined in our POM)


We have to distinguish between **implicit** and **user-defined properties**.

## Implicit

The implicit properties are as follows:

**Project properties**: We can use the `${project.*}` syntax to reference the value of all elements of our effective POM.
For example, `${project.groupId}` and `${project.build.directory}` refer to
the `<project><groupId>` and `<project><build><directory>` elements of our (effective) POM, respectively.
Of course, we can only specify properties that are uniquely determined by their path.
In other words, we cannot reference a `<dependency>` or `<plugin>` element.

**Settings properties**: These are analogous to the project properties,
but they refer to the Maven settings files through the `${settings.*}` syntax.

**Environment properties**: We can refer to the environment variables through the `${env.<variable-name>}` syntax.
For example, we can reference the `JAVA_HOME` or `PATH` variable using placeholders
such as `${env.JAVA_HOME}` and `${env.PATH}`.

**System properties**: We can reference all the properties accessible via `System.getProperties()` by the Maven Java process.
Some examples are `${os.name}` and `${line.separator}`.

We have some specific properties, defined in the Maven's central POM, as follows:

### built-in

- `${basedir}`: 表示 `pom.xml` 文件所在的目录.
- `${version}`: 表示项目的版本，与 `${project.version}` 相同。

### pom.xml

Project

- `${project.version}`: 表示 `pom.xml` 中 `version` 的值。
- `${project.groupId}`: 表示 `pom.xml` 中 `groupId` 的值。
- `${project.artifactId}`: 表示 `pom.xml` 中 `artifactId` 的值。
- `${project.name}`: 表示 `pom.xml` 中 `name` 的值。
- `${project.description}`: 表示 `pom.xml` 中 `description` 的值。
- `${project.basedir}`: This refers to the path of the project's base directory
- `${project.build.finalName}`: This contains the final name of the file created when the built project is packaged.
- `${project.build.directory}`: This is a property defined in the Maven's central POM,
  containing the path of the build directory. Its default value is `target`.
- `${project.build.outputDirectory}`: This is a property defined in the Maven's central POM,
  containing the directory in which the class files are stored during the build process. Its default value is `target/classes`.


The convention for referring to the parent project's variables provides using the `${project.parent}` syntax.

**Maven links each property to a getter/setter method**.
Thus, properties such as `${project.build.directory}` will be matched with the
`getProject().getBuild().getDirectory()` method chain.

### settings.xml

In addition to the project properties, you can also read properties from the `USER_HOME/.m2/settings.xml` file.

For example, if you want to read the path to the local Maven repository,
you can use the property, `${settings.localRepository}`.

- `${settings.localRepository}`: This refers to the path of the user's local repository.

In the same way, with the same pattern,
you can read any of the configuration elements,
which are defined in the `settings.xml` file.

### Env

The environment variables defined in the system can be read using the `env` prefix within an application POM file.

- The `${env.M2_HOME}` property will return the path to Maven home,
- while `${env.java_home}` returns the path to the Java home directory.

- `${env.M2_HOME}`: This is an environment variable containing the Maven2 installation folder.

These properties will be quite useful within certain Maven plugins.

### System

- `${java.home}`: This is an environment variable specifying the path to the current `JRE_HOME` folder.

## user-defined properties

You should not scatter custom properties all over the places.
An ideal place to define them is the **parent POM file** in a multi-module Maven project,
which will then be inherited by all the other child modules.

In addition to the implicit properties,
we can define our arbitrary **user-defined properties** in the `<properties>` element of our POM, as follows:

```xml
<project>
    <!-- ... -->
    <properties>
        <my.property>myValue</my.property>
        <other.property>Other value</other.property>
        <logback.version>1.0.7</logback.version>
    </properties>

    <!-- ... -->
    <dependencies>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>${logback.version}</version>
        </dependency>
        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-core</artifactId>
            <version>${logback.version}</version>
        </dependency>
    </dependencies>
</project>
```
