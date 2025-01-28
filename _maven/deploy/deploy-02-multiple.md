---
title: "Deploy Advanced"
sequence: "102"
---

[UP](/maven-index.html)


## pom.xml

```xml
<distributionManagement>
    <repository>
        <id>${releases.id}</id>
        <name>${releases.name}</name>
        <url>${releases.url}</url>
    </repository>
    <snapshotRepository>
        <id>${snapshots.id}</id>
        <name>${snapshots.name}</name>
        <url>${snapshots.url}</url>
    </snapshotRepository>
</distributionManagement>
```

### settings.xml

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0
           http://maven.apache.org/xsd/settings-1.2.0.xsd">
    <!-- servers -->
    <servers>
        <server>
            <id>private-nexus-releases</id>
            <username>java-developer</username>
            <password>123456</password>
        </server>
        <server>
            <id>private-nexus-snapshots</id>
            <username>java-developer</username>
            <password>123456</password>
        </server>
        <server>
            <id>cloud-nexus-releases</id>
            <username>java-developer</username>
            <password>123456</password>
        </server>
        <server>
            <id>cloud-nexus-snapshots</id>
            <username>java-developer</username>
            <password>123456</password>
        </server>
    </servers>

    <!-- mirrors -->
    <mirrors>
        <mirror>
            <id>JMNexus</id>
            <name>Private Nexus Repository</name>
            <mirrorOf>*</mirrorOf>
            <url>http://192.168.1.22:8081/repository/maven-public/</url>
        </mirror>
    </mirrors>


    <!-- profiles -->
    <profiles>
        <profile>
            <id>dev</id>

            <properties>
                <releases.id>private-nexus-releases</releases.id>
                <releases.name>Private Releases Repository</releases.name>
                <releases.url>http://192.168.1.22:8081/repository/maven-releases/</releases.url>

                <snapshots.id>private-nexus-snapshots</snapshots.id>
                <snapshots.name>Private Snapshots Repository</snapshots.name>
                <snapshots.url>http://192.168.1.22:8081/repository/maven-snapshots/</snapshots.url>
            </properties>

            <repositories>
                <repository>
                    <id>private-nexus</id>
                    <name>Private Nexus</name>
                    <url>http://192.168.1.22:8081/repository/maven-public/</url>
                    <releases>
                        <enabled>true</enabled>
                        <updatePolicy>always</updatePolicy>
                        <checksumPolicy>warn</checksumPolicy>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                        <updatePolicy>always</updatePolicy>
                        <checksumPolicy>warn</checksumPolicy>
                    </snapshots>
                </repository>
            </repositories>

            <pluginRepositories>
                <pluginRepository>
                    <id>private-nexus</id>
                    <name>Private Nexus</name>
                    <url>http://192.168.1.22:8081/repository/maven-public/</url>
                    <releases>
                        <enabled>true</enabled>
                        <updatePolicy>always</updatePolicy>
                        <checksumPolicy>warn</checksumPolicy>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                        <updatePolicy>always</updatePolicy>
                        <checksumPolicy>warn</checksumPolicy>
                    </snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>

        <profile>
            <id>prod</id>

            <properties>
                <releases.id>cloud-nexus-releases</releases.id>
                <releases.name>Cloud Releases Repository</releases.name>
                <releases.url>http://36.138.170.6:14581/nexus/content/repositories/jm-r/</releases.url>

                <snapshots.id>cloud-nexus-snapshots</snapshots.id>
                <snapshots.name>Cloud Snapshots Repository</snapshots.name>
                <snapshots.url>http://36.138.170.6:14581/nexus/content/repositories/jm-s/</snapshots.url>
            </properties>

            <repositories>
                <repository>
                    <id>cloud-nexus</id>
                    <name>Cloud Nexus</name>
                    <url>http://36.138.170.6:14581/nexus/content/groups/nexus/</url>
                    <releases>
                        <enabled>true</enabled>
                        <updatePolicy>always</updatePolicy>
                        <checksumPolicy>warn</checksumPolicy>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                        <updatePolicy>always</updatePolicy>
                        <checksumPolicy>warn</checksumPolicy>
                    </snapshots>
                </repository>
            </repositories>

            <pluginRepositories>
                <pluginRepository>
                    <id>cloud-nexus</id>
                    <name>Cloud Nexus</name>
                    <url>http://36.138.170.6:14581/nexus/content/groups/nexus/</url>
                    <releases>
                        <enabled>true</enabled>
                        <updatePolicy>always</updatePolicy>
                        <checksumPolicy>warn</checksumPolicy>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                        <updatePolicy>always</updatePolicy>
                        <checksumPolicy>warn</checksumPolicy>
                    </snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>
    </profiles>

    <!-- activeProfiles -->
    <activeProfiles>
        <activeProfile>dev</activeProfile>
    </activeProfiles>
</settings>
```

## deploy

默认情况下，使用 `dev`：

```text
mvn clean deploy -DskipTests
```

使用 `prod`：

```text
mvn clean deploy -DskipTests -Pprod
```
