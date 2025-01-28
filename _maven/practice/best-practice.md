---
title: "Best practices"
sequence: "102"
---

[UP](/maven-index.html)


how to refactor POMs of multimodule projects
in order to avoid errors and dependency conflicts.

## Aggregate POMs

When we have a project consisting of several modules,
we will sometimes want to build only a subset of them.

If we build the parent project, all the modules will be compiled.
On the other hand, building each module separately can be tedious,
and we should remember to build the modules in the right order if they depend on each other.
To accomplish all these needs, we can use an **additional aggregate POM**.

Let's consider our transportation project example again and suppose that  
we want to clean and build not only the `transportation-acq-ear` module
but also all the other modules on which it depends.
We can create the following `transportation-acq-pom.xml` file in the project root directory
(at the same level of the parent POM):

```xml
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.packt.examples</groupId>
    <artifactId>transportation-acq</artifactId>
    <version>1.0</version>
    <packaging>pom</packaging>
    <modules>
        <module>transportation-acq-ear</module>
        <module>transportation-acq-war</module>
        <module>transportation-acq-ejb</module>
    </modules>
</project>
```

As Maven uses the `pom.xml` file present in the project directory by default,
we can build the aggregate POM instead of the parent POM using the `-f` parameter, as follows:

```text
mvn -f transportation-acq-pom.xml clean install
```

We can obtain the same result directly from the command line of the project directory, as follows:

```text
mvn -pl transportation-acq-ear -am install
```

The `-pl` parameter allows us to specify a list of modules to build,
and the `-am` parameter tells Maven to build the projects required by the list.
Without the `-am` (or `--also-make`) parameter,
only the modules of the list (in this case only the EAR module) will be built.

## Dependency management

The Maven dependency mechanism can prove to be a double-edged weapon,
especially in multimodule projects, or in case of conflicts between dependencies.  

Of course, we are speaking of conflicts regarding different versions or scopes  
of dependencies having the same groupId and artifactId.
In these cases, the default Maven behavior is as follows:

- The version/scope declared in a project overrides the version/scope of
the same dependency declared in a parent (or ancestor) POM.
- The version/scope declared in (or inherited by) our project prevails on  
the version/scope of a transitive dependency.
- If two or more conflicting transitive dependencies have different  
versions/scopes, the version/scope with the shortest path in the  
dependency tree will prevail. In the case of paths of the same length,  
the version/scope of the dependency assigned first in the POM  
will prevail.
- If a range of version is declared for a direct or transitive dependency,  
Maven will choose a version within the specified interval, but in the case  
of a conflict with other ranges of versions for the same dependency, the  
build process will exit with an error.

If we want to assure that all the modules of a project use the same dependency
versions of certain artifacts even when they are transitive dependencies,
we have to use a `<dependencyManagement>` element in our POM.
In the case of multimodule projects,
the dependency management configuration is usually specified in the parent POM.

For example, in the parent POM of our transportation project,
we can insert an element such as this:

```text
<project>
[...]
<dependencyManagement>
  <dependencies>
  <dependency>
    <groupId>javax</groupId>
    <artifactId>javaee-api</artifactId>
    <version>6.0</version>
    <scope>provided</scope>
  </dependency>
  <dependency>
    <groupId>javax</groupId>
    <artifactId>javaee-web-api</artifactId>
    <version>6.0</version>
  <scope>provided</scope>
  </dependency>
  <dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.1</version>
  </dependency>
  
[…] 
  </dependencies>
</dependencyManagement>
[...]
```

This means that the specified dependencies,
when declared directly or assigned as transitive dependencies,
will have the default versions and scopes defined in the Dependency management section.
So, we don't need to explicitly declare the versions and scopes of these dependencies,
for example, we can (or better, we should) declare the SLF4J and Java EE web API dependencies simply, as follows:

```text
<dependencies>
  [...]
  <dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
  </dependency>
  <dependency>
    <groupId>javax</groupId>
    <artifactId>javaee-web-api</artifactId>
  </dependency>
  [...]
```

Note that the **Dependency management** section does not declare the dependencies that are specified in it,
it only fixes their default version numbers and scopes.
We have to declare these dependencies (in any case) explicitly in the `<dependencies>` element if they are needed.

If we declare versions and scopes in the `<dependencies>` element for dependencies
that are declared in the dependency management section of the same POM (or of its parent POM),
the values specified in the `<dependencies>` element will override
those specified in the `<dependencyManagement>` element.
On the other hand, versions and scopes of transitive dependencies will always be overridden by
the values specified in the dependency management section.

## Plugin management

Analogous to the **dependency management configuration** is the **plugin management configuration**.
We can use a `<pluginManagement>` element under the `<build>` element to fix the plugin versions.
For example, we can introduce the following element in a parent POM:

```text
<build>
  <pluginManagement>
    <plugins>
      <plugin>
        <groupId>org.codehaus.mojo</groupId>
        <artifactId>jaxb2-maven-plugin</artifactId>
        <version>1.6</version>
    </plugin>
  </plugins>
  </pluginManagement>
```
