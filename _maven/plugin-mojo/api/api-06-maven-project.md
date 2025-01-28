---
title: "Mojo: Maven Project"
sequence: "106"
---

[UP](/maven-index.html)


## pom.xml

### packaging

```xml
<packaging>maven-plugin</packaging>
```

### properties

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <java.version>8</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
</properties>
```

### dependencies

```xml
<dependencies>
    <dependency>
        <!-- plugin interfaces and base classes -->
        <groupId>org.apache.maven</groupId>
        <artifactId>maven-plugin-api</artifactId>
        <version>3.8.5</version>
        <scope>provided</scope>
    </dependency>

    <dependency>
        <!-- annotations used to describe the plugin meta-data -->
        <groupId>org.apache.maven.plugin-tools</groupId>
        <artifactId>maven-plugin-annotations</artifactId>
        <version>3.6.4</version>
        <scope>provided</scope>
    </dependency>


    <dependency>
        <!-- needed when injecting the Maven Project into a plugin  -->
        <groupId>org.apache.maven</groupId>
        <artifactId>maven-core</artifactId>
        <version>3.8.5</version>
        <scope>provided</scope>
    </dependency>
</dependencies>
```

### 完整 pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>hello-examples-maven-plugin</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>maven-plugin</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>8</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <!-- plugin interfaces and base classes -->
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-plugin-api</artifactId>
            <version>3.8.5</version>
            <scope>provided</scope>
        </dependency>

        <dependency>
            <!-- annotations used to describe the plugin meta-data -->
            <groupId>org.apache.maven.plugin-tools</groupId>
            <artifactId>maven-plugin-annotations</artifactId>
            <version>3.6.4</version>
            <scope>provided</scope>
        </dependency>


        <dependency>
            <!-- needed when injecting the Maven Project into a plugin  -->
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-core</artifactId>
            <version>3.8.5</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

</project>
```

## MavenProject

在 `maven-core-3.8.5.jar` 中有一个 `org.apache.maven.project.MavenProject` 类

```java
package lsieun.mojo;

import org.apache.maven.artifact.Artifact;
import org.apache.maven.artifact.DependencyResolutionRequiredException;
import org.apache.maven.model.Dependency;
import org.apache.maven.model.Prerequisites;
import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.apache.maven.project.MavenProject;

import java.util.List;
import java.util.Properties;

@Mojo(name = "project")
public class ProjectMojo extends AbstractMojo {
    @Parameter(property = "basedir")
    private String basedir;

    @Parameter(property = "project", required = true, readonly = true)
    private MavenProject project;

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info("Hello MavenProject");
        getLog().info("========= ========= =========");

        getLog().info("Basic");
        getLog().info("    project.name: " + project.getName());
        getLog().info("    project.description: " + project.getDescription());
        getLog().info("========= ========= =========");

        getLog().info("File and Directory");
        getLog().info("    basedir: " + basedir);
        getLog().info("    project.getBasedir().getPath(): " + project.getBasedir().getPath());
        getLog().info("    pom.xml: " + project.getFile().getPath());
        getLog().info("    project.build.directory: " + project.getBuild().getDirectory());
        getLog().info("    project.build.outputDirectory: " + project.getBuild().getOutputDirectory());
        getLog().info("========= ========= =========");

        getLog().info("Project Coordinate");
        getLog().info("    project.groupId: " + project.getGroupId());
        getLog().info("    project.artifactId: " + project.getArtifactId());
        getLog().info("    project.version: " + project.getVersion());
        getLog().info("========= ========= =========");

        Properties properties = project.getProperties();
        getLog().info("Properties");
        getLog().info("    properties: " + properties.toString());
        getLog().info("========= ========= =========");


        List<Dependency> dependencies = project.getDependencies();
        getLog().info("dependencies");
        for (Dependency dependency : dependencies) {
            getLog().info("    dependency: " + dependency.toString());
        }
        getLog().info("========= ========= =========");

        Prerequisites prerequisites = project.getPrerequisites();
        getLog().info("Prerequisites");
        getLog().info("    maven: " + prerequisites.getMaven());
        getLog().info("========= ========= =========");

        Artifact artifact = project.getArtifact();
        getLog().info("Artifact");
        getLog().info("    Id: " + artifact.getId());
        getLog().info("    GroupId: " + artifact.getGroupId());
        getLog().info("    ArtifactId: " + artifact.getArtifactId());
        getLog().info("    Version: " + artifact.getVersion());
        getLog().info("    isRelease: " + artifact.isRelease());
        getLog().info("    isSnapshot: " + artifact.isSnapshot());
        getLog().info("========= ========= =========");

        List<String> compileSourceRoots = project.getCompileSourceRoots();
        getLog().info("CompileSourceRoots");
        for (String item : compileSourceRoots) {
            getLog().info("    source root: " + item);
        }
        getLog().info("========= ========= =========");

        try {
            List<String> compileClasspathElements = project.getCompileClasspathElements();
            getLog().info("CompileClasspathElements");
            for (String item : compileClasspathElements) {
                getLog().info("    element: " + item);
            }
            getLog().info("========= ========= =========");
        }
        catch (DependencyResolutionRequiredException e) {
            throw new RuntimeException(e);
        }
    }
}
```

## Settings

在 `maven-settings-3.8.5.jar` 中有一个 `org.apache.maven.settings.Settings` 类

```java
package lsieun.mojo;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;
import org.apache.maven.settings.Settings;

@Mojo(name = "settings")
public class SettingsMojo extends AbstractMojo {
    @Parameter(property = "settings", readonly = true)
    private Settings settings;

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info("settings.localRepository: " + settings.getLocalRepository());
        getLog().info("settings.sourceLevel: " + settings.getSourceLevel());
    }
}
```

## 测试

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>hello-world</artifactId>
    <version>1.0-SNAPSHOT</version>

    <name>hello-world-name</name>
    <description>this is hello world description</description>

    <prerequisites>
        <maven>3.5</maven>
    </prerequisites>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
        <java.version>8</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-lang3</artifactId>
            <version>3.12.0</version>
        </dependency>
        <dependency>
            <groupId>org.ow2.asm</groupId>
            <artifactId>asm</artifactId>
            <version>9.0</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>lsieun</groupId>
                <artifactId>hello-project-maven-plugin</artifactId>
                <version>1.0-SNAPSHOT</version>
            </plugin>
        </plugins>
    </build>

</project>
```
