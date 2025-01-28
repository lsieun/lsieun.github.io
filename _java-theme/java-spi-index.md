---
title: "Java SPI"
sequence: "spi"
---

[learn-java-spi](https://github.com/lsieun/learn-java-spi)

{%
assign filtered_posts = site.java-theme |
where_exp: "item", "item.url contains '/java-theme/spi/'" |
sort: "sequence"
%}
<ol>
    {% for post in filtered_posts %}
    {% assign num = post.sequence | abs %}
    <li>
        <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
    {% endfor %}
</ol>

service provider-configuration files: META-INF/services/xxx.yyy.zzz

## Overview

Java 6 has introduced a feature for discovering and loading implementations matching a given interface: **Service Provider Interface** (**SPI**).

The **Service Provider Interface** was introduced to make applications more extensible.

It gives us a way to enhance specific parts of a product without modifying the core application.
All we need to do is provide a new implementation of the service that follows certain rules and plug it into the application.
Using the SPI mechanism, the application will load the new implementation and work with it.

## Terms and Definitions of Java SPI

Java SPI defines four main components

### Service

A well-known set of programming interfaces and classes that provide access to some specific application functionality or feature.

### Service Provider Interface

An interface or abstract class that acts as a proxy or an endpoint to the service.

If the service is one interface, then it is the same as a service provider interface.

Service and SPI together are well-known in the Java Ecosystem as API.

### Service Provider

A specific implementation of the SPI.
The Service Provider contains one or more concrete classes that implement or extend the service type.

A Service Provider is configured and identified through a provider configuration file
which we put in the resource directory `META-INF/services`.
The file name is the fully-qualified name of the SPI and its content is the fully-qualified name of the SPI implementation.

The Service Provider is installed in the form of extensions,
a jar file which we place in the application classpath,
the Java extension classpath or the user-defined classpath.

### ServiceLoader

At the heart of the SPI is the `ServiceLoader` class.
This has the role of discovering and loading implementations lazily.
It uses the context classpath to locate provider implementations and put them in an internal cache.

## Reference

- [lsieun/learn-java-spi](https://github.com/lsieun/learn-java-spi)

Oracle:

- [Introduction to the Service Provider Interfaces](https://docs.oracle.com/javase/tutorial/sound/SPI-intro.html)
- [java.util.ServiceLoader](https://docs.oracle.com/javase/8/docs/api/java/util/ServiceLoader.html)

Other:

- [Java SPI (Service Provider Interface) and ServiceLoader](https://www.journaldev.com/31602/java-spi-service-provider-interface-and-serviceloader)
- [Implementing Plugins with Java's Service Provider Interface](https://reflectoring.io/service-provider-interface/)
- [baeldung: Java Service Provider Interface](https://www.baeldung.com/java-spi)
