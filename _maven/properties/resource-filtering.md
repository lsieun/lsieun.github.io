---
title: "Resource Filtering"
sequence: "102"
---

[UP](/maven-index.html)


Resource filtering 是将 resource 中的 maven properties 替换成真实的值。

**Resource filtering** is disabled by default and
can be activated in the `<resources>` child element of the `<build>` element of our POM.
We have to set the `<filtering>` flag of the desired `<resource>` element to `true`:

```xml
<project>
    [...]
    <properties>
        [...]
    </properties>
    [...]
    <build>
        <resources>
            <resource>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
            </resource>
        </resources>
    </build>
    [...]
</project>
```

This way, **all the properties** referenced in our resources will be replaced with their real values
by the **Maven Resource Plugin**.

## Filter

In addition to the Maven properties, resource filtering can also use properties
defined in further property files, which are called **filters**.
The properties contained in these files will be used only for resource filtering,
and they cannot be referred in our POM.
In the next example, we specify an additional property file, `app.properties`, to be used for resource filtering:

```xml
<build>
    <filters>
        <filter>src/main/filters/app.properties</filter>
    </filters>
    <resources>
        <resource>
            <directory>src/main/resources</directory>
            <filtering>true</filtering>
        </resource>
    </resources>
</build>
```

We can specify **multiple resource directories** with different settings for the `<filtering>` flag, as follows:

```xml
<resources>
    <resource>
        <directory>src/main/resources-alt</directory>
        <filtering>true</filtering>
    </resource>
    <resource>
        <directory>src/main/resources</directory>
    </resource>
</resources>
```

In this case, only the resources in the `src/main/resources-alt` folder will be filtered.

## 注意事项

Notice that we have to also specify the default `src/main/resources` directory
when we add further resource directories
because the `<resources>` element definition replaces the defaults completely.
