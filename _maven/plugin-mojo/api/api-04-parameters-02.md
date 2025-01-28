---
title: "Mojo Parameters：不同的数据类型（输入）"
sequence: "104"
---

[UP](/maven-index.html)


It is unlikely that a mojo will be very useful without parameters.

Parameters provide a few very important functions:

- It provides hooks to allow the user to **adjust the operation of the plugin** to suit their needs.
- It provides a means to easily **extract the value of elements from the POM** without the need to navigate the objects.

## Defining Parameters Within a Mojo

Defining a parameter is as simple as **creating an instance variable in the mojo** and **adding the proper annotations**.
Listed below is an example of a parameter for the simple mojo:

```text
/**
 * The greeting to display.
 */
@Parameter(property = "sayhi.greeting", defaultValue = "Hello World!")
private String greeting;
```

The portion before the annotations is the description of the parameter.
The `@Parameter` annotation identifies the variable as a mojo parameter.
The `defaultValue` parameter of the annotation defines the default value for the variable.
This value can include expressions which reference the project, such as "`${project.version}`"
(more can be found in the "Parameter Expressions" document).
The `property` parameter can be used to allow configuration of the mojo parameter from the command line
by referencing a system property that the user sets via the `-D` option.

```text
mvn hello:sayhi -Dsayhi.greeting=GoodByte
```

## Configuring Parameters in a Project

Configuring the parameter values for a plugin is done in a Maven project within the `pom.xml` file
as part of defining the plugin in the project.
An example of configuring a plugin:

```xml
<plugin>
    <groupId>sample.plugin</groupId>
    <artifactId>hello-maven-plugin</artifactId>
    <version>1.0-SNAPSHOT</version>
    <configuration>
        <greeting>Welcome</greeting>
    </configuration>
</plugin>
```

In the configuration section, the element name ("`greeting`") is the parameter name and
the contents of the element ("`Welcome`") is the value to be assigned to the parameter.

## Parameter Types With One Value

Listed below are the various types of **simple variables**
which can be used as parameters in your mojos, along with any rules on how the values in the POM are interpreted.

### Boolean

This includes variables typed `boolean` and `Boolean`.
When reading the configuration, the text "true" causes the parameter to be set to `true`
and all other text causes the parameter to be set to `false`. Example:

```text
    /**
     * My boolean.
     */
    @Parameter
    private boolean myBoolean;
```

```text
<myBoolean>true</myBoolean>
```

### Integer Numbers

This includes variables typed `byte`, `Byte`, `int`, `Integer`, `long`, `Long`, `short`, and `Short`.
When reading the configuration, the text in the XML file is converted to an integer value
using either `Integer.parseInt()` or the `valueOf()` method of the appropriate class.
This means that the strings must be valid decimal integer values,
consisting only of the digits 0 to 9 with an optional - in front for a negative value. Example:

```text
    /**
     * My Integer.
     */
    @Parameter
    private Integer myInteger;
```

```text
<myInteger>10</myInteger>
```

### Floating-Point Numbers

This includes variables typed `double`, `Double`, `float`, and `Float`.
When reading the configuration,
the text in the XML file is converted to binary form using the `valueOf()` method for the appropriate class.
This means that the strings can take on any format specified in section 3.10.2 of the Java Language Specification.
Some samples of valid values are `1.0` and `6.02E+23`.

```text
    /**
     * My Double.
     */
    @Parameter
    private Double myDouble;
```

```text
<myDouble>1.0</myDouble>
```

### Dates

This includes variables typed `Date`.
When reading the configuration, the text in the XML file is converted using one of the following date formats:
"`yyyy-MM-dd HH:mm:ss.S a`" (a sample date is "2005-10-06 2:22:55.1 PM") or
"`yyyy-MM-dd HH:mm:ssa`" (a sample date is "2005-10-06 2:22:55PM").
Note that parsing is done using `DateFormat.parse()` which allows some leniency in formatting.
If the method can parse a date and time out of what is specified it will do so
even if it doesn't exactly match the patterns above. Example:

```text
    /**
     * My Date.
     */
    @Parameter
    private Date myDate;
```

```text
<myDate>2005-10-06 2:22:55.1 PM</myDate>
```

### Files and Directories

This includes variables typed `File`.

When reading the configuration, the text in the XML file is used as the path to the desired file or directory.
**If the path is relative** (does not start with / or a drive letter like C:),
the path is relative to the directory containing the POM.

Example:

```text
    /**
     * My File.
     */
    @Parameter
    private File myFile;
```

```text
<myFile>c:\temp</myFile>
```

### URLs

This includes variables typed `URL`.

When reading the configuration, the text in the XML file is used as the URL.
The format must follow the RFC 2396 guidelines,
and looks like any web browser URL (`scheme://host:port/path/to/file`).
No restrictions are placed on the content of any of the parts of the URL while converting the URL.

```text
    /**
     * My URL.
     */
    @Parameter
    private URL myURL;
```

```text
<myURL>http://maven.apache.org</myURL>
```

### Plain Text

This includes variables typed `char`, `Character`, `StringBuffer`, and `String`.

When reading the configuration, the text in the XML file is used as the value to be assigned to the parameter.
For `char` and `Character` parameters, only the first character of the text is used.

### Enums

Enumeration type parameters can also be used.
First you need to define your enumeration type and afterwards you can use the enumeration type in the parameter definition:

```text
public enum Color {
  GREEN,
  RED,
  BLUE
}

/**
 * My Enum
 */
@Parameter
private Color myColor;
```

So lets have a look like you can use such enumeration in your pom configuration:

```text
<myColor>GREEN</myColor>
```

You can also use elements from the enumeration type as `defaultValues` like the following:

```text
public enum Color {
  GREEN,
  RED,
  BLUE
}

/**
 * My Enum
 */
@Parameter(defaultValue = "GREEN")
private Color myColor;
```

## Parameter Types With Multiple Values

Listed below are the various types of composite objects
which can be used as parameters in your mojos, along with any rules on how the values in the POM are interpreted.
In general, the class of the object created to hold the parameter value
(as well as the class for each element within the parameter value)
is determined as follows (the first step which yields a valid class is used):

- If the XML element contains an `implementation` hint attribute, that is used
- If the XML tag contains a `.`, try that as a fully qualified class name
- Try the XML tag (with capitalized first letter) as a class in the same package as the mojo/object being configured
- For **arrays**, use the component type of the array (for example, use `String` for a `String[]` parameter);
  for **collections** and **maps**, use the class specified in the mojo configuration for the collection or map;
  use `String` for entries in a collection and values in a map

Once the type for the element is defined, the text in the XML file is converted to the appropriate type of object

### Arrays

Array type parameters are configured by specifying the parameter multiple times. Example:

```text
/**
 * My Array.
 */
@Parameter
private String[] myArray;
```

```text
<myArray>
  <param>value1</param>
  <param>value2</param>
</myArray>
```

```java
package lsieun.mojo;

import org.apache.maven.plugin.AbstractMojo;
import org.apache.maven.plugin.MojoExecutionException;
import org.apache.maven.plugin.MojoFailureException;
import org.apache.maven.plugins.annotations.Mojo;
import org.apache.maven.plugins.annotations.Parameter;

@Mojo(name = "sayhi")
public class GreetingMojo extends AbstractMojo {
    @Parameter(property = "my.message", defaultValue = "Hello ${user.name}")
    private String message;

    @Parameter(alias = "includes")
    private String[] mIncludes;

    @Parameter(alias = "excludes")
    private String[] mExcludes;

    public void setExcludes(String[] excludes) {
        mExcludes = excludes;
    }

    public void setIncludes(String[] includes) {
        mIncludes = includes;
    }

    @Override
    public void execute() throws MojoExecutionException, MojoFailureException {
        getLog().info(message);
        if (mIncludes != null) {
            getLog().info("includes:");
            for (String item : mIncludes) {
                getLog().info("    " + item);
            }
        }

        if (mExcludes != null) {
            getLog().info("excludes:");
            for (String item : mExcludes) {
                getLog().info("    " + item);
            }
        }
    }
}
```

```xml
<build>
    <plugins>
        <plugin>
            <groupId>lsieun</groupId>
            <artifactId>hello-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
            <configuration>
                <includes>
                    <item>first</item>
                    <item>second</item>
                </includes>
                <excludes>
                    <item>third</item>
                    <item>fourth</item>
                </excludes>
            </configuration>
        </plugin>
    </plugins>
</build>
```

```xml
<build>
    <plugins>
        <plugin>
            <groupId>lsieun</groupId>
            <artifactId>hello-maven-plugin</artifactId>
            <version>1.0-SNAPSHOT</version>
            <configuration>
                <includes>
                    <a>first</a>
                    <b>second</b>
                </includes>
                <excludes>
                    <c>third</c>
                    <d>fourth</d>
                </excludes>
            </configuration>
        </plugin>
    </plugins>
</build>
```

```text
mvn hello:sayhi
```

```text
[INFO] --- hello-maven-plugin:1.0-SNAPSHOT:sayhi (default-cli) @ hello-world ---
[INFO] Message From Properties
[INFO] includes:
[INFO]     first
[INFO]     second
[INFO] excludes:
[INFO]     third
[INFO]     fourth
```

### Collections

This category covers any class which implements `java.util.Collection` such as `ArrayList` or `HashSet`.
These parameters are configured by specifying the parameter multiple times just like an array. Example:

```text
/**
 * My List.
 */
@Parameter
private List myList;
```

```text
<myList>
  <param>value1</param>
  <param>value2</param>
</myList>
```

### Maps

This category covers any class which implements `java.util.Map` such as `HashMap` but does not implement `java.util.Properties`.
These parameters are configured by including XML tags in the form `<key>value</key>` in the parameter configuration.

Example:

```text
/**
 * My Map.
 */
@Parameter
private Map myMap;
```

```text
<myMap>
  <key1>value1</key1>
  <key2>value2</key2>
</myMap>
```

### Properties

This category covers any map which implements `java.util.Properties`.
These parameters are configured by including XML tags
in the form `<property><name>myName</name> <value>myValue</value> </property>` in the parameter configuration.

Example:

```text
/**
 * My Properties.
 */
@Parameter
private Properties myProperties;
```

```text
<myProperties>
  <property>
    <name>propertyName1</name>
    <value>propertyValue1</value>
  </property>
  <property>
    <name>propertyName2</name>
    <value>propertyValue2</value>
  </property>
</myProperties>
```

### Other Object Classes

This category covers any class which does not implement `java.util.Map`, `java.util.Collection`, or `java.util.Dictionary`.

Example:

```text
/**
 * My Object.
 */
@Parameter
private MyObject myObject;
```

```text
<myObject>
  <myField>test</myField>
</myObject>
```

## Using Setters

You are not restricted to using **private field mapping** which is good
if you are trying to make you Mojos resuable outside the context of Maven.

Using the example above we could name our private fields using the underscore convention and
provide setters that the configuration mapping mechanism can use.
So our Mojo would look like the following:

```text
public class MyQueryMojo
    extends AbstractMojo
{
    @Parameter(property="url")
    private String _url;
 
    @Parameter(property="timeout")
    private int _timeout;
 
    @Parameter(property="options")
    private String[] _options;
 
    public void setUrl( String url )
    {
        _url = url;
    }
 
    public void setTimeout( int timeout )
    {
        _timeout = timeout;
    }
 
    public void setOptions( String[] options )
    {
        _options = options;
    }
 
    public void execute()
        throws MojoExecutionException
    {
        ...
    }
}
```

Note the specification of the `property` name for each parameter
which tells Maven what setter and getter to use
when **the field's name** does not match the intended name of the parameter in the plugin configuration.
