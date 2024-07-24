---
title: "The super and the effective POMs"
sequence: "105"
---

[UP](/maven-index.html)


## The Super POM

Even when a Maven POM does not refer to a parent project,
it inherits implicitly from a parent POM that is embedded in the Maven core libraries.
This parent POM is called the **super POM**.

The super POM is located in the `maven-model-builder-3.x.x.jar` archive
under the `/lib` folder of the Maven installation directory.

Browsing the `model-builder-3.x.x.jar` archive,
we can find a `pom-4.0.0.xml` file under the `org.apache.maven.model` package, which is the **super POM**.
This POM basically contains the definitions of the sources, resources, test sources, test resources, and output directories,
and the declaration of the Maven central repository (but no project-default dependencies).
Thanks to the super POM, Maven expects to find Java sources under `/src/main/java`,
builds the project output in the `/target` directory,
and searches for dependencies in the Maven central repository at `http://repo.maven.apache.org/maven2`.
Remember the concept of **convention over configuration**!

```xml
<!-- START SNIPPET: superpom -->
<project>
    <modelVersion>4.0.0</modelVersion>

    <repositories>
        <repository>
            <id>central</id>
            <name>Central Repository</name>
            <url>https://repo.maven.apache.org/maven2</url>
            <layout>default</layout>
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
            <layout>default</layout>
            <snapshots>
                <enabled>false</enabled>
            </snapshots>
            <releases>
                <updatePolicy>never</updatePolicy>
            </releases>
        </pluginRepository>
    </pluginRepositories>

    <build>
        <finalName>${project.artifactId}-${project.version}</finalName>

        
        <sourceDirectory>${project.basedir}/src/main/java</sourceDirectory>
        <scriptSourceDirectory>${project.basedir}/src/main/scripts</scriptSourceDirectory>
        <resources>
            <resource>
                <directory>${project.basedir}/src/main/resources</directory>
            </resource>
        </resources>
        
        
        <testSourceDirectory>${project.basedir}/src/test/java</testSourceDirectory>
        <testResources>
            <testResource>
                <directory>${project.basedir}/src/test/resources</directory>
            </testResource>
        </testResources>

        
        <directory>${project.basedir}/target</directory>
        <outputDirectory>${project.build.directory}/classes</outputDirectory>
        <testOutputDirectory>${project.build.directory}/test-classes</testOutputDirectory>
        
        
        <pluginManagement>
            <!-- NOTE: These plugins will be removed from future versions of the super POM -->
            <!-- They are kept for the moment as they are very unlikely to conflict with lifecycle mappings (MNG-4453) -->
            <plugins>
                <plugin>
                    <artifactId>maven-antrun-plugin</artifactId>
                    <version>1.3</version>
                </plugin>
                <plugin>
                    <artifactId>maven-assembly-plugin</artifactId>
                    <version>2.2-beta-5</version>
                </plugin>
                <plugin>
                    <artifactId>maven-dependency-plugin</artifactId>
                    <version>2.8</version>
                </plugin>
                <plugin>
                    <artifactId>maven-release-plugin</artifactId>
                    <version>2.5.3</version>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>

    <reporting>
        <outputDirectory>${project.build.directory}/site</outputDirectory>
    </reporting>

    <profiles>
        <!-- NOTE: The release profile will be removed from future versions of the super POM -->
        <profile>
            <id>release-profile</id>

            <activation>
                <property>
                    <name>performRelease</name>
                    <value>true</value>
                </property>
            </activation>

            <build>
                <plugins>
                    <plugin>
                        <inherited>true</inherited>
                        <artifactId>maven-source-plugin</artifactId>
                        <executions>
                            <execution>
                                <id>attach-sources</id>
                                <goals>
                                    <goal>jar-no-fork</goal>
                                </goals>
                            </execution>
                        </executions>
                    </plugin>
                    <plugin>
                        <inherited>true</inherited>
                        <artifactId>maven-javadoc-plugin</artifactId>
                        <executions>
                            <execution>
                                <id>attach-javadocs</id>
                                <goals>
                                    <goal>jar</goal>
                                </goals>
                            </execution>
                        </executions>
                    </plugin>
                    <plugin>
                        <inherited>true</inherited>
                        <artifactId>maven-deploy-plugin</artifactId>
                        <configuration>
                            <updateReleaseInfo>true</updateReleaseInfo>
                        </configuration>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>

</project>
<!-- END SNIPPET: superpom -->
```

## The Effective POM

We can be interested in the result of merging our project POM with its ancestors up to the super POM.
This is provided by the `help:effective-pom` plugin goal.

```text
mvn help:effective-pom
```

As we can see, our project POM is merged with the super POM and with **the built-in lifecycle `default` bindings**.
For example, we can see the bindings of the compiler plugin with the `compile` and `test-compile` phases,
even if these bindings aren't declared in any of the module's POMs or the super POM.
Notice that **transitive dependencies** are not merged — to see them, we have to invoke the `dependency:tree` goal.
