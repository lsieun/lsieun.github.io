---
title: "Maven Dependency Plugin"
sequence: "302"
---

[UP](/maven-index.html)


```xml

<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-dependency-plugin</artifactId>
    <version>3.2.0</version>
    <executions>
        <execution>
            <id>lib-copy-dependencies</id>
            <phase>package</phase>
            <goals>
                <goal>copy-dependencies</goal>
            </goals>
            <configuration>
                <excludeGroupIds>org.openjfx</excludeGroupIds>
                <excludeArtifactIds>javafx-base,javafx-controls,javafx-fxml</excludeArtifactIds>
                <outputDirectory>${project.build.directory}/libs</outputDirectory>
                <overWriteReleases>false</overWriteReleases>
                <overWriteSnapshots>false</overWriteSnapshots>
                <overWriteIfNewer>true</overWriteIfNewer>
            </configuration>
        </execution>
    </executions>
</plugin>
```
