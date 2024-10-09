---
title: "Dom4j"
sequence: "143"
---

## Maven: pom.xml

```text
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <java.version>1.8</java.version>
    <maven.compiler.source>${java.version}</maven.compiler.source>
    <maven.compiler.target>${java.version}</maven.compiler.target>
    <dom4j.version>2.1.3</dom4j.version>
</properties>

<dependencies>
    <dependency>
        <groupId>org.dom4j</groupId>
        <artifactId>dom4j</artifactId>
        <version>${dom4j.version}</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <!-- Java Compiler -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>${java.version}</source>
                <target>${java.version}</target>
                <fork>true</fork>
                <compilerArgs>
                    <arg>-g</arg>
                    <arg>-parameters</arg>
                    <arg>-XDignore.symbol.file</arg>
                </compilerArgs>
            </configuration>
        </plugin>
    </plugins>
</build>
```

## Programming

### 001

```java
package lsieun.xml.dom;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.io.SAXReader;

public class DomBasic {
    public static void main(String[] args) throws DocumentException {
        String file = DomBasic.class.getResource("/children.xml").getFile();
        System.out.println(file);

        SAXReader reader = new SAXReader();
        Document doc = reader.read(file);
        System.out.println(doc);
    }
}
```

### 002

```java
package lsieun.xml.dom;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

import java.util.Iterator;

public class DomBasic {
    public static void main(String[] args) throws DocumentException {
        String file = DomBasic.class.getResource("/children.xml").getFile();

        SAXReader reader = new SAXReader();
        Document doc = reader.read(file);

        Iterator<Node> it = doc.nodeIterator();
        while (it.hasNext()) {
            Node node = it.next();
            System.out.println(node.getName());
        }
    }
}
```

### 003

```java
package lsieun.xml.dom;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

import java.util.Iterator;

public class DomBasic {
    public static void main(String[] args) throws DocumentException {
        String file = DomBasic.class.getResource("/children.xml").getFile();

        SAXReader reader = new SAXReader();
        Document doc = reader.read(file);

        Iterator<Node> it = doc.nodeIterator();
        while (it.hasNext()) {
            Node node = it.next();
            System.out.println(node.getName());

            if (node instanceof Element) {
                Element element = (Element) node;
                Iterator<Node> it2 = element.nodeIterator();
                while (it2.hasNext()) {
                    Node item = it2.next();
                    System.out.println(item.getName());
                }
            }
        }
    }
}
```

### 004

```java
package lsieun.xml.dom;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.Node;
import org.dom4j.io.SAXReader;

import java.util.Iterator;

public class DomBasic {
    public static void main(String[] args) throws DocumentException {
        String file = DomBasic.class.getResource("/children.xml").getFile();

        SAXReader reader = new SAXReader();
        Document doc = reader.read(file);

        Element root = doc.getRootElement();
        getChildNodes(root);
    }

    private static void getChildNodes(Element element) {
        System.out.println(element.getName());
        Iterator<Node> it = element.nodeIterator();
        while (it.hasNext()) {
            Node node = it.next();

            if (node instanceof Element) {
                Element item = (Element) node;
                getChildNodes(item);
            }
        }
    }
}
```

### 005

```java
package lsieun.xml.dom;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import java.util.Iterator;
import java.util.List;

public class DomBasic {
    public static void main(String[] args) throws DocumentException {
        String file = DomBasic.class.getResource("/children.xml").getFile();

        // 第一步，生成Document
        SAXReader reader = new SAXReader();
        Document doc = reader.read(file);

        // 第二步，获得root Element
        Element root = doc.getRootElement();
        String rootName = root.getName();
        System.out.println(rootName);

        // 第三步，得到当前标签下的第一个子标签
        Element child = root.element("child");
        System.out.println(child.getName());

        // 第四步，得到当前标签下指定名称的所有子标签
        Iterator<Element> it = root.elementIterator("child");
        while (it.hasNext()) {
            Element element = it.next();
            System.out.println(element.getName());
        }

        // 第五步，得到当前标签下的所有子标签
        List<Element> elements = root.elements();
        for (Element item : elements) {
            System.out.println(item.getName());
        }
    }
}
```

### Attribute

```text
           ┌─── root ────────┼─── isRootElement()
           │
           │                 ┌─── single ─────┼─── element(String name)
           │                 │
           │                 │                ┌─── elements()
           ├─── element ─────┼─── list ───────┤
           │                 │                └─── elements(String name)
Element ───┤                 │
           │                 │                ┌─── elementIterator()
           │                 └─── iterator ───┤
           │                                  └─── elementIterator(String name)
           │
           │                 ┌─── attributeValue(String name)
           │                 │
           │                 ├─── attribute(String name)
           └─── attribute ───┤
                             ├─── attributes()
                             │
                             └─── attributeIterator()
```

```java
package lsieun.xml.dom;

import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

import java.util.Iterator;
import java.util.List;

public class AttributeRead {
    public static void main(String[] args) throws DocumentException {
        String file = DomBasic.class.getResource("/children.xml").getFile();

        // 第一步，生成Document
        SAXReader reader = new SAXReader();
        Document doc = reader.read(file);

        // 第二步，获得root Element
        Element root = doc.getRootElement();
        Element element = root.element("girl");

        // 获取属性值
        String id = element.attributeValue("id");
        System.out.println(id);

        // 获取一个属性
        Attribute idAttr = element.attribute("id");
        String name = idAttr.getName();
        String value = idAttr.getValue();
        System.out.println(name);
        System.out.println(value);

        // 获取所有属性
        List<Attribute> attributes = element.attributes();
        for (Attribute item : attributes) {
            System.out.println(item.getName() + " = " + item.getValue());
        }

        // 获取所有属性迭代器
        Iterator<Attribute> it = element.attributeIterator();
        while (it.hasNext()) {
            Attribute item = it.next();
            System.out.println(item.getName() + " = " + item.getValue());
        }
    }
}
```

## Reference

- [dom4j](https://dom4j.github.io/)

