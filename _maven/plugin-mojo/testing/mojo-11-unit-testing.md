---
title: "Mojo: Unit Test"
sequence: "109"
---

[UP](/maven-index.html)


Currently, Maven only supports **unit testing** out of the box.
This document is intended to help Maven Developers test plugins
with **unit tests**, **integration tests**, and **functional tests**.

## Testing Styles

Testing Styles: Unit Testing vs. Functional/Integration Testing

A **unit test** attempts to verify a mojo as an isolated unit, by mocking out the rest of the Maven environment.
A mojo unit test does not attempt to run your plugin in the context of a real Maven build.
**Unit tests are designed to be fast**.

A **functional/integration test** attempts to use a mojo in a real Maven build,
by launching a real instance of Maven in a real project.
Normally this requires you to construct special dummy Maven projects with real POM files.
Often this requires you to have already installed your plugin into your local repository
so it can be used in a real Maven build.
**Functional tests run much more slowly than unit tests**, but they can catch bugs that you may not catch with unit tests.

The **general wisdom** is that **your code should be mostly tested with unit tests, but should also have some functional tests**.

## Unit Tests

### Using JUnit alone

In principle, you can write a unit test of a plugin Mojo the same way you'd write any other JUnit test case,
by writing a class that extends `TestCase`.

However, most mojos need more information to work properly.
For example, you'll probably need to inject a reference to a `MavenProject`, so your mojo can query project variables.

### Using PlexusTestCase

Mojo variables are injected using Plexus,
and many Mojos are written to take specific advantage of the Plexus container
(by executing a lifecycle or having various injected dependencies).

If all you need are Plexus container services, you can write your class with extends `PlexusTestCase` instead of `TestCase`.

With that said, if you need to inject Maven objects into your mojo, you'll probably prefer to use the maven-plugin-testing-harness.

### maven-plugin-testing-harness

The `maven-plugin-testing-harness` is explicitly intended to
test the `org.apache.maven.reporting.AbstractMavenReport#execute()` implementation.

In general, you need to include `maven-plugin-testing-harness` as a dependency,
and create a `*MojoTest` (by convention) class which extends `AbstractMojoTestCase`.

```text
  <dependencies>
    ...
    <dependency>
      <groupId>org.apache.maven.plugin-testing</groupId>
      <artifactId>maven-plugin-testing-harness</artifactId>
      <version>3.3.0</version>
      <scope>test</scope>
    </dependency>
    ...
  </dependencies>
```

```text
<dependency>
    <groupId>org.apache.maven.plugin-testing</groupId>
    <artifactId>maven-plugin-testing-harness</artifactId>
    <version>3.3.0</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.apache.maven</groupId>
    <artifactId>maven-compat</artifactId>
    <version>3.8.5</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
    <version>1.7.36</version>
    <scope>test</scope>
</dependency>

<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.13.2</version>
    <scope>test</scope>
</dependency>
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>hello-maven-plugin</artifactId>
    <packaging>maven-plugin</packaging>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-plugin-api</artifactId>
            <version>3.8.5</version>
            <scope>provided</scope>
        </dependency>

        <!-- dependencies to annotations -->
        <dependency>
            <groupId>org.apache.maven.plugin-tools</groupId>
            <artifactId>maven-plugin-annotations</artifactId>
            <version>3.6.4</version>
            <scope>provided</scope>
        </dependency>

        <dependency>
            <groupId>org.apache.maven.plugin-testing</groupId>
            <artifactId>maven-plugin-testing-harness</artifactId>
            <version>3.3.0</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.apache.maven</groupId>
            <artifactId>maven-compat</artifactId>
            <version>3.8.5</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
            <version>1.7.36</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

```java
package lsieun.mojo;

import org.apache.maven.plugin.testing.AbstractMojoTestCase;

import java.io.File;

public class GreetingMojoTest extends AbstractMojoTestCase {

    @Override
    protected void setUp() throws Exception {
        super.setUp();
    }

    @Override
    protected void tearDown() throws Exception {
        super.tearDown();
    }

    public void testMojoGoal() throws Exception {
        File testFile = getTestFile("src/test/resources/unit/basic-test-plugin-config.xml");
        GreetingMojo mojo = (GreetingMojo) lookupMojo("sayhi", testFile);
        assertNotNull(mojo);

        mojo.execute();
    }
}
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>hello-world</artifactId>
    <version>1.0-SNAPSHOT</version>

    <build>
        <plugins>
            <plugin>
                <groupId>lsieun</groupId>
                <artifactId>hello-maven-plugin</artifactId>
                <version>1.0-SNAPSHOT</version>
                <configuration>
                    <message>Hello Maven</message>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```
