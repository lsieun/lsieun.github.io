---
title: "SAXParserFactory"
sequence: "152"
---

JAXP 1.3 provides complete pluggability for the `SAXParserFactory` implementation classes.
This means the SAXParserFactory implementation class is not a fixed class.
Instead, the SAXParserFactory implementation class is obtained by JAXP,
using the following lookup procedure:

1. Use the `javax.xml.parsers.SAXParserFactory` system property to determine the factory class to load.
2. Use the `javax.xml.parsers.SAXParserFactory` property specified in the `lib/jaxp.properties` file
   under the JRE directory to determine the factory class to load.
   JAXP reads this file only once, and the property values defined in this file are cached by JAXP.
3. Files in the `META-INF/services` directory within a JAR file are deemed service provider configuration files.
   Use the Services API, and obtain the factory class name from the `META-INF/services/javax.xml.parsers.SAXParserFactory` file
   contained in any JAR file in the runtime classpath.
4. Use the default `SAXParserFactory` class, included in the J2SE platform.

```java
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParserFactory;

public class HelloWorld {
    public static void main(String[] args) throws ParserConfigurationException, SAXException {
        SAXParserFactory factory = SAXParserFactory.newInstance();
        System.out.println(factory.getClass().getName());
    }
}
```

```java
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import javax.xml.parsers.SAXParserFactory;

public class HelloWorld {
    public static void main(String[] args) throws ParserConfigurationException, SAXException {
        System.setProperty("javax.xml.parsers.SAXParserFactory", "lsieun.xml.custom.CustomSAXParserFactory");

        SAXParserFactory factory = SAXParserFactory.newInstance();
        System.out.println(factory.getClass().getName());
    }
}
```

```text
java -Djavax.xml.parsers.SAXParserFactory=lsieun.xml.custom.CustomSAXParserFactory sample.HelloWorld
```

`prepare.sh`

```text
#!/bin/bash
mkdir -p META-INF/services/
cd META-INF/services/
echo "lsieun.xml.custom.CustomSAXParserFactory" > javax.xml.parsers.SAXParserFactory
cd -
jar -cvf my.jar META-INF/
```

```text
$ java -cp my.jar\;. sample.HelloWorld
lsieun.xml.custom.CustomSAXParserFactory
```

If validation is desired, set the validating attribute on `factory` to `true`:

```text
factory.setValidating(true);
```

If the validation attribute of the `SAXParserFactory` object is set to `true`,
the parser obtained from such a factory object, by default, validates an XML document with respect to a **DTD**.
To validate the document with respect to XML Schema, you need to do more, which is covered in detail in Chapter 3.
