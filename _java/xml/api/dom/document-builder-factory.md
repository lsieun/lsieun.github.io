---
title: "DocumentBuilderFactory"
sequence: "201"
---

The implementation class for `DocumentBuilderFactory` is pluggable.
The JAXP 1.3 API loads the implementation class for `DocumentBuilderFactory` by applying the following rules,
in order, until a rule succeeds:

1. Use the `javax.xml.parsers.DocumentBuilderFactory` system property to load an implementation class.
2. Use the properties file `lib/jaxp.properties` in the JRE directory.
   If this file exists, parse this file to check whether a property has the `javax.xml.parsers.DocumentBuilderFactory` key.
   If such a property exists, use the value of this property to load an implementation class.
3. Files in the `META-INF/services` directory within a JAR file are deemed service provider configuration files.
   Use the Services API, and obtain the factory class name from the `META-INF/services/javax.xml.parsers.DocumentBuilderFactory` file
   contained in any JAR file in the runtime classpath.
4. Use the platform default `DocumentBuilderFactory` instance, included in the J2SE platform being used by the application.


