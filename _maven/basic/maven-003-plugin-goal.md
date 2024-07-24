---
title: "Maven Goals"
sequence: "103"
---

[UP](/maven-index.html)


A **goal** is a **task** contained in a **Maven plugin**.
It can be invoked by directly running the following command:

```text
mvn <plugin-prefix>:<goal-name>
```

A **plugin prefix** is a shortcut
that allows us to refer to the plugin without having to specify
its Maven coordinates `groupId`, `artifactId`, and `version`.

```text
mvn compiler:compile
```

We can see that, in this case, Maven just compiles the Java sources.
So, we can invoke the Maven executable by specifying **a phase**, **a goal**, or **both**.
In fact, if we ask for help on the command line, we obtain the following output:

```text
$ mvn -h
usage: mvn [options] [<goal(s)>] [<phase(s)>]
```

## Getting help on plugin goals and parameters

We can list the available goals of a certain plugin through the Maven Help Plugin.

For example, we can type on the command line:

```text
$ mvn help:describe -Dplugin=compiler
```

With the `-Ddetail` parameter, we'll get information about the available parameters
that can be specified through the `-D<parameter name>` syntax in case of direct invocation of the plugin goals.
We can also try the following command:

```text
mvn help:describe -Dplugin=help
```

This way, we'll obtain help on the Maven Help Plugin!

## Built-in lifecycles and default bindings

We can wonder where these lifecycles and default bindings are actually defined.
All these definitions are in the Maven core library, `maven-core-<Maven version>.jar`,
under the `/lib` subdirectory of the Maven installation.  

For example, in `maven-core-3.2.1.jar`, under the `META-INF/plexus` folder,
we can find the `components.xml` and `default-bindings.xml` descriptors.
These two descriptors contain the lifecycle definitions and their default bindings, respectively.

Looking at the `components.xml` descriptor, we can see the following elements:

```text
<!-- 'default' lifecycle, without any binding since it is dependent on packaging -->
<component>
    <role>org.apache.maven.lifecycle.Lifecycle</role>
    <implementation>org.apache.maven.lifecycle.Lifecycle</implementation>
    <role-hint>default</role-hint>
    <configuration>
        <id>default</id>
        <!-- START SNIPPET: lifecycle -->
        <phases>
            <phase>validate</phase>
            <phase>initialize</phase>
            <phase>generate-sources</phase>
            <phase>process-sources</phase>
            <phase>generate-resources</phase>
            <phase>process-resources</phase>
            <phase>compile</phase>
            <phase>process-classes</phase>
            <phase>generate-test-sources</phase>
            <phase>process-test-sources</phase>
            <phase>generate-test-resources</phase>
            <phase>process-test-resources</phase>
            <phase>test-compile</phase>
            <phase>process-test-classes</phase>
            <phase>test</phase>
            <phase>prepare-package</phase>
            <phase>package</phase>
            <phase>pre-integration-test</phase>
            <phase>integration-test</phase>
            <phase>post-integration-test</phase>
            <phase>verify</phase>
            <phase>install</phase>
            <phase>deploy</phase>
        </phases>
        <!-- END SNIPPET: lifecycle -->
    </configuration>
</component>
```

These are all the phases of the `default` lifecycle.
