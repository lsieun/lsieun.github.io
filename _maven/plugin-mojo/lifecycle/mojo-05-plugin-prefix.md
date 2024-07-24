---
title: "Mojo: Plugin Prefix"
sequence: "105"
---

[UP](/maven-index.html)


```text
mvn groupId:artifactId:version:goal
```


Tips: `version` is not required to run a standalone goal.

## Shortening the Command Line

There are several ways to reduce the amount of required typing:

- If you need to run the latest version of a plugin installed in your local repository, you can omit its `version` number.
  So just use `mvn sample.plugin:hello-maven-plugin:sayhi` to run your plugin.
- You can assign a shortened prefix to your plugin, such as `mvn hello:sayhi`.
  This is done automatically if you follow the convention of using `${prefix}-maven-plugin`
  (or `maven-${prefix}-plugin` if the plugin is part of the Apache Maven project).
  You may also assign one through additional configuration.
- Finally, you can also add your plugin's `groupId` to the list of groupIds searched by default.
  To do this, you need to add the following to your `${user.home}/.m2/settings.xml` file:

```text
<pluginGroups>
    <pluginGroup>sample.plugin</pluginGroup>
</pluginGroups>
```

Because this is a lot of typing on the command line,
Maven has an option to shorten this that uses so-called plugin groups and goal prefixes.
The way this works is that for a specific number of group IDs,
Maven allows you to omit the **group ID**,
and instead of using the full **artifact ID** you can use the shorter **goal prefix**.
The plugin groups that Maven checks can be specified in a `settings.xml` file (such as `~/.m2/settings.xml`):

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
  <pluginGroups>
    <pluginGroup>org.omnifaces.example</pluginGroup>
  </pluginGroups>
</settings>
```

Specifying the `groupId`, `artifactId`, `version`, and `goal` on the command-line is cumbersome.


To address this, Maven assigns a plugin a `prefix`. Instead of typing:

```text
mvn org.apache.maven.plugins:maven-jar-plugin:3.2.2:jar
```

You can use the plugin prefix `jar` and turn that command-line into

```text
mvn jar:jar
```

## Built-in Two Groups

How does Maven resolve something like `jar:jar` to `org.apache.mven.plugins:maven-jar:3.2.2`?
Maven looks at a file in the Maven repository to obtain a list of plugins for a specific `groupId`.
By default, Maven is configured to look for plugins in two groups:
`org.apache.maven.plugins` and `org.codehaus.mojo`.

When you specify a new plugin prefix like `mvn hibernate3:hbm2ddl`,
Maven is going to scan the repository metadata for the appropriate plugin prefix.
First, Maven is going to scan the `org.apache.maven.plugins` group for the plugin prefix `hibernate3`.
If it doesn't find the plugin prefix `hibernate3` in the `org.apache.maven.plugins` group
it will scan the metadata for the `org.codehaus.mojo` group.

When Maven scans the metadata for a particular `groupId`,
it is retrieving an XML file from the Maven repository
which captures metadata about the artifacts contained in a group.
This XML file is specific for each repository referenced,
if you are not using a custom Maven repository,
you will be able to see the Maven metadata for the `org.apache.maven.plugins` group
in your local Maven repository (`~/.m2/repository`) under `org/apache/maven/plugins/maven-metadata-central.xml`.

A snippet of the `maven-metadata-central.xml` file from the `org.apache.maven.plugin` group:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<metadata>
    <plugins>
        <plugin>
            <name>Maven Clean Plugin</name>
            <prefix>clean</prefix>
            <artifactId>maven-clean-plugin</artifactId>
        </plugin>
        <plugin>
            <name>Maven Compiler Plugin</name>
            <prefix>compiler</prefix>
            <artifactId>maven-compiler-plugin</artifactId>
        </plugin>
        <plugin>
            <name>Maven Surefire Plugin</name>
            <prefix>surefire</prefix>
            <artifactId>maven-surefire-plugin</artifactId>
        </plugin>
        <!-- ... -->
    </plugins>
</metadata>
```

Maven scans `org.apache.maven.plugins` and `org.codehaus.mojo`:
plugins from `org.apache.maven.plugins` are considered core Maven plugins and
plugins from `org.codehaus.mojo` are considered extra plugins.

The Apache Maven project manages the `org.apache.maven.plugins` group,
and a separate independent open source community manages the Codehaus Mojo project.

## settings: pluginGroups

If you would like to start publishing plugins to your own `groupId`,
and you would like Maven to automatically scan your own `groupId` for plugin prefixes,
you can customize the groups that Maven scans for plugins in your Maven Settings.

If you wanted to be able to run the `first-maven-plugin`'s echo goal by running `first:echo`,
add the `org.sonatype.mavenbook.plugins` groupId to your  `~/.m2/settings.xml`,
“Customizing the Plugin Groups in Maven Settings”.
This will prepend the `org.sonatype.mavenbook.plugins` to the list of groups
which Maven scans for Maven plugins.

```text
<settings>
  ...
  <pluginGroups>
    <pluginGroup>org.sonatype.mavenbook.plugins</pluginGroup>
  </pluginGroups>
</settings>
```

```xml
<pluginGroups>
    <!-- pluginGroup
     | Specifies a further group identifier to use for plugin lookup.
     -->
    <pluginGroup>com.your.plugins</pluginGroup>
</pluginGroups>
```

## pom

```xml
<build>
    <plugins>
        <plugin>
            <groupId>lsieun</groupId>
            <artifactId>hello-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
        </plugin>
    </plugins>
</build>
```

```text
mvn hello:sayhi
```

## Naming Convention

You can now run `mvn first:echo` from any directory and see that
Maven will properly resolve the goal prefix to the appropriate plugin identifiers.
This worked because our project adhered to a **naming convention** for Maven plugins.

If your plugin project has an artifactId which follows the pattern `maven-first-plugin` or `first-maven-plugin`.
Maven will automatically assign a plugin goal prefix of `first` to your plugin.
In other words, when the Maven Plugin Plugin is generating the Plugin descriptor for your plugin and
you have not explicitly set the `goalPrefix` in your project,
the `plugin:descriptor` goal will extract the prefix from your plugin's `artifactId` when it matches the following patterns:

- `${prefix}-maven-plugin`
- `maven-${prefix}-plugin`

## 自定义 prefix

If you would like to set an explicit plugin prefix, you'll need to configure the **Maven Plugin Plugin**.
The Maven Plugin Plugin is a plugin that is responsible for building the Plugin descriptor and
performing plugin specific tasks during the package and load phases.

The Maven Plugin Plugin can be configured just like any other plugin in the build element.
To set the plugin prefix for your plugin,
add the following build element to the `first-maven-plugin` project's `pom.xml`.

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-plugin-plugin</artifactId>
            <version>3.6.4</version>
            <configuration>
                <goalPrefix>good</goalPrefix>
            </configuration>
        </plugin>
    </plugins>
</build>
```

```text
<?xml version="1.0" encoding="UTF-8"?><project>
  <modelVersion>4.0.0</modelVersion>
  <groupId>org.sonatype.mavenbook.plugins</groupId>
  <artifactId>first-maven-plugin</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>maven-plugin</packaging>
  <name>first-maven-plugin Maven Mojo</name>
  <url>http://maven.apache.org</url>
  <build>
    <plugins>
      <plugin>
        <artifactId>maven-plugin-plugin</artifactId>
        <version>2.3</version>
        <configuration>
          <goalPrefix>blah</goalPrefix>
        </configuration>
      </plugin>
    </plugins>
  </build>
  <dependencies>
    <dependency>
      <groupId>org.apache.maven</groupId>
      <artifactId>maven-plugin-api</artifactId>
      <version>2.0</version>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>3.8.1</version>
      <scope>test</scope>
    </dependency>
  </dependencies>
</project>
```

```text
[INFO] --- maven-plugin-plugin:3.6.4:descriptor (default-descriptor) @ hello-maven-plugin ---
[WARNING] 

Goal prefix is specified as: 'good'. Maven currently expects it to be 'hello'.
```

在 `maven-plugin-plugin` 插件当中，`

```java
public abstract class AbstractGeneratorMojo extends AbstractMojo {
    @Parameter
    private String goalPrefix;

    @Override
    public void execute() throws MojoExecutionException {
        // ...
        String defaultGoalPrefix = getDefaultGoalPrefix(project);

        if (goalPrefix == null) {
            goalPrefix = defaultGoalPrefix;
        }
        else if (!goalPrefix.equals(defaultGoalPrefix)) {
            getLog().warn("Goal prefix is specified as: '" + goalPrefix + "'. " + "Maven currently expects it to be '"
                            + defaultGoalPrefix + "'.");
        }
        // ...
    }

    static String getDefaultGoalPrefix(MavenProject project) {
        String defaultGoalPrefix;
        if ("maven-plugin".equalsIgnoreCase(project.getArtifactId())) {
            defaultGoalPrefix = project.getGroupId().substring(project.getGroupId().lastIndexOf('.') + 1);
        }
        else {
            defaultGoalPrefix = PluginDescriptor.getGoalPrefixFromArtifactId(project.getArtifactId());
        }
        return defaultGoalPrefix;
    }
}
```



在 `maven-plugin-api-3.8.5.jar` 包当中，`org.apache.maven.plugin.descriptor.PluginDescriptor` 类
有 `getGoalPrefixFromArtifactId()` 方法的定义：

```java
public class PluginDescriptor extends ComponentSetDescriptor implements Cloneable {
    public static String getGoalPrefixFromArtifactId(String artifactId) {
        if ("maven-plugin-plugin".equals(artifactId)) {
            return "plugin";
        }
        else {
            return artifactId.replaceAll("-?maven-?", "").replaceAll("-?plugin-?", "");
        }
    }
}
```
