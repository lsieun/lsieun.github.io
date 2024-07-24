---
title: "Profile"
sequence: "104"
---

The `<profiles>` element is similar to the one that we can specify in our POMs.
This element should be used very carefully
because a project should not depend too much on settings specified outside of its POM.

```xml

<profiles>
    <!-- profile
     | Specifies a set of introductions to the build process, to be activated using one or more of the
     | mechanisms described above. For inheritance purposes, and to activate profiles via <activatedProfiles/>
     | or the command line, profiles have to have an ID that is unique.
     |
     | An encouraged best practice for profile identification is to use a consistent naming convention
     | for profiles, such as 'env-dev', 'env-test', 'env-production', 'user-jdcasey', 'user-brett', etc.
     | This will make it more intuitive to understand what the set of introduced profiles is attempting
     | to accomplish, particularly when you only have a list of profile id's for debug.
     |
     | This profile example uses the JDK version to trigger activation, and provides a JDK-specific repo.
    -->
    <profile>
        <id>jdk-1.4</id>

        <activation>
            <jdk>1.4</jdk>
        </activation>

        <repositories>
            <repository>
                <id>jdk14</id>
                <name>Repository for JDK 1.4 builds</name>
                <url>http://www.myhost.com/maven/jdk14</url>
                <layout>default</layout>
                <snapshotPolicy>always</snapshotPolicy>
            </repository>
        </repositories>
    </profile>

    <!--
     | Here is another profile, activated by the system property 'target-env' with a value of 'dev',
     | which provides a specific path to the Tomcat instance. To use this, your plugin configuration
     | might hypothetically look like:
     |
     | ...
     | <plugin>
     |   <groupId>org.myco.myplugins</groupId>
     |   <artifactId>myplugin</artifactId>
     |
     |   <configuration>
     |     <tomcatLocation>${tomcatPath}</tomcatLocation>
     |   </configuration>
     | </plugin>
     | ...
     |
     | NOTE: If you just wanted to inject this configuration whenever someone set 'target-env' to
     |       anything, you could just leave off the <value/> inside the activation-property.
     |
    -->
    <profile>
        <id>env-dev</id>

        <activation>
            <property>
                <name>target-env</name>
                <value>dev</value>
            </property>
        </activation>

        <properties>
            <tomcatPath>/path/to/tomcat/instance</tomcatPath>
        </properties>
    </profile>
</profiles>
```
