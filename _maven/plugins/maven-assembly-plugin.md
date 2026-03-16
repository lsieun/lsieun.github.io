---
title: "Maven Assembly Plugin"
sequence: "302"
---

[UP](/maven/index.html)


- [Apache Maven Assembly Plugin](https://maven.apache.org/plugins/maven-assembly-plugin/index.html)

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-assembly-plugin</artifactId>
            <version>3.8.0</version>
            <configuration>
                <archive>
                    <manifest>
                        <mainClass>lsieun.mcp.stdio.server.MyMcpStdioServer</mainClass>
                        <addDefaultEntries>false</addDefaultEntries>
                    </manifest>
                </archive>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
            <executions>
                <execution>
                    <id>make-assembly</id>
                    <phase>package</phase>
                    <goals>
                        <goal>single</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.8.0</version>
    <configuration>
        <archive>
            <manifest>
                <mainClass>lsieun.Main</mainClass>
                <addDefaultEntries>false</addDefaultEntries>
            </manifest>
            <manifestEntries>
                <Premain-Class>lsieun.agent.LoadTimeAgent</Premain-Class>
                <Agent-Class>lsieun.agent.DynamicAgent</Agent-Class>
                <Launcher-Agent-Class>lsieun.agent.LauncherAgent</Launcher-Agent-Class>
                <Can-Redefine-Classes>true</Can-Redefine-Classes>
                <Can-Retransform-Classes>true</Can-Retransform-Classes>
                <Can-Set-Native-Method-Prefix>true</Can-Set-Native-Method-Prefix>
            </manifestEntries>
        </archive>
        <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>
        </descriptorRefs>
    </configuration>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals>
                <goal>single</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```
