---
title: "Configuring Repositories"
sequence: "102"
---

[UP](/maven-index.html)


In addition to the Maven central repository, we can also configure other repositories
to be used for plugin and dependency downloads.
We have to remark that there are separate configuration elements for **dependencies** and **plugin** repositories,
the `<repositories>` and `<pluginRepositories>` elements.

> 这里要注意，dependency repository 和 plugin repository 要分别设置

For example, if we want to download both dependencies and plugins from the `Java.net` repository,
we should declare the following:

```text
<project>
[...]
<repositories>
  <repository>
    <id>java.net-Public</id>
    <name>Maven Java Net Snapshots and Releases</name>
    <url>https://maven.java.net/content/groups/public</url>
  </repository>
</repositories>
<pluginRepositories>
  <pluginRepository>
    <id>java.net-Public</id>
    <name>Maven Java Net Snapshots and Releases</name>
    <url>https://maven.java.net/content/groups/public</url>
  </pluginRepository>
</pluginRepositories>
[...]
```

## Enabling releases and snapshots

By default, Maven will attempt to download both **releases** and **snapshots** from the additional repositories.
If we don't want these releases or snapshots to be searched on a remote repository,
we have to disable them explicitly, as follows:

```text
<repository>
  <id>sample-release-id</id>
  <name>A release repository</name>
  <url>...</url>
  <releases>
    <enabled>true</enabled>
  </releases>
  <snapshots>
    <enabled>false</enabled>
  </snapshots
</repository>
<repository>
  <id>sample-snapshot-id</id>
  <name>A snapshot repository</name>
  <url>...</url>
  <releases>
    <enabled>false</enabled>
  </releases>
  <snapshots>
    <enabled>true</enabled>
  </snapshots
</repository>
```

If we look at the effective POM of any Maven project,
we'll see that snapshots are disabled in the Maven central repository configuration.

```xml
<project>
    <repositories>
        <repository>
            <id>central</id>
            <name>Central Repository</name>
            <url>https://repo.maven.apache.org/maven2</url>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </repository>
    </repositories>

    <pluginRepositories>
        <pluginRepository>
            <id>central</id>
            <name>Central Repository</name>
            <url>https://repo.maven.apache.org/maven2</url>
            <releases>
                <updatePolicy>never</updatePolicy>
            </releases>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
        </pluginRepository>
    </pluginRepositories>
</project>
```

## best choice

In a multimodule project, the best choice is to declare an additional repository in the parent POM
so that they will be available to all the modules of the project.
