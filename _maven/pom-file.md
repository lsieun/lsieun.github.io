---
title: "Pom file"
sequence: "103"
---

[UP](/maven-index.html)


Every Maven project has **a pom file** that defines **what the project is all about** and **how it should be built**.

**Pom** is an acronym for **project object model**.

A pom file is an XML file that is based on a specific schema, as specified at the t op of the file:

```text
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
```

There is also a `modelVersion` element that defines the version of this schema:

```text
<modelVersion>4.0.0</modelVersion>
```

These are the basic elements of a pom file.

The `groupId` element is a unique identifier of the organization to which the project belongs.
For our sample project, it is `org.example.cookbook`.
It is a good practice to follow the reverse domain name notation to specify this:

```text
<groupId>...</groupId>
```

The `artifactId` element is the name of the project.
For our sample project, it is simple-project:

```text
<artifactId>...</artifactId>
```

The `version` element is the specific instance of the project,
corresponding to the source code at a particular instance of time.
In our case, it is `1.0-SNAPSHOT`, which is a default version during development:

```text
<version>...</version>
```

The combination of `groupId`, `artifactId`, and `version` uniquely identifies the project.
In this sense, they are **the coordinates of the project**.

The `packaging` element indicates the artifact type of the project.
This is typically a `jar`, `war`, `zip`, or in some cases, a `pom`:

```text
<packaging>...</packaging>
```

The `dependencies` element section of the pom file defines all the dependent projects of this project.
This would typically be third-party libraries required to build, test, and run the project:

```text
<dependencies>...</dependencies>
```

The `parent` section is used to indicate a relationship, specifically a parent-child relationship.
If the project is part of a multi-module project or inherits project information from another project,
then the details are specified in this section:

```text
<parent>...</parent>
```

Maven properties are **placeholders**.
Their values are accessible anywhere in the pom file by using `${key}`, where `key` is the property name:

```text
<properties>...</properties>
```

A project with modules is known as a **multi-module** or **aggregator project**.
Modules are projects that this pom file lists and are executed as a group:

```text
<modules>...</modules>
```
