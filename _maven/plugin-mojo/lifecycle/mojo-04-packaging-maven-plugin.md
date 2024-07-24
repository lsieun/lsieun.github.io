---
title: "Mojo: <packaging>maven-plugin</packaging>"
sequence: "104"
---

[UP](/maven-index.html)


What the `maven-plugin` packaging primarily brings to the table is that the `maven-plugin-plugin`
(that repetition is intentional; it's not a typo) is added to the lifecycle,
which in turn generates a `META-INF/maven/plugin.xml` file.

```text
mvn help:effective-pom
```

```xml
<plugin>
    <artifactId>maven-plugin-plugin</artifactId>
    <version>3.2</version>
    <executions>
        <execution>
            <id>default-addPluginArtifactMetadata</id>
            <phase>package</phase>
            <goals>
                <goal>addPluginArtifactMetadata</goal>
            </goals>
        </execution>
        <execution>
            <id>default-descriptor</id>
            <phase>process-classes</phase>
            <goals>
                <goal>descriptor</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Jar Plugin 和 Maven Plugin 两者的生命周期是比较相似的。

与 Jar Plugin 的生命周期相比，Maven Plugin 的差异主要体现在：

- process-classes: `plugin-plugin:descriptor`
- package: `plugin:addPluginArtifactMetadata`

The Maven Plugin is similar to the Jar lifecycle with two exceptions:

- `plugin:descriptor` is bound to the `process-classes` phase
- `plugin:addPluginArtifactMetadata` is added to the `package` phase

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
                    <!-- 第一处不同 -->
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
                    <!-- 第二处不同 -->
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
