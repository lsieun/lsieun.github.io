---
title: "JDK Distributions"
sequence: "102"
---



- [adoptium](https://adoptium.net/): [Latest releases](https://adoptium.net/temurin/releases)

## The OpenJDK project

In terms of **Java source code**, there is only one, living at the [OpenJDK project](http://openjdk.java.net/projects/jdk/) site.

This is just **source code** however, not a **distributable build**.
In theory, you and I could produce a build from that source code, and start distributing it.
But our distribution would lack certification, to be able to legally call ourselves **Java SE compatible**.

That's why in practice, there's a handful of vendors that actually create these builds,
get them certified (see [TCK](https://en.wikipedia.org/wiki/Technology_Compatibility_Kit)) and then distribute them.

And while vendors cannot, say, remove a method from the `String` class before producing a new Java build,
they can add branding or add some other (e.g. CLI, Command Line Interface) utilities they deem useful.
But other than that, **the original source code is the same for all Java distributions**.

## Distributions

### OpenJDK builds and OracleJDK builds

One of the vendors who builds Java from source is **Oracle**.
This leads to two different Java distributions, which can be very confusing at first.

- [OpenJDK builds](https://jdk.java.net/) by Oracle(!). These builds are free and unbranded, but Oracle won't release updates for older versions, say Java 15, as soon as Java 16 comes out.
- [OracleJDK](https://www.oracle.com/java/technologies/downloads/archive/), which is a branded, commercial build starting with the license change in 2019.
  Which means it can be used for free during development, but you need to pay Oracle if using it in production.
  For this, you get longer support, i.e. updates to versions and a telephone number you can call if your JVM goes crazy.

Now, historically (pre-Java 8) there were actual source differences between OpenJDK builds and OracleJDK builds,
where you could say that OracleJDK was 'better'.
But as of today, both versions are essentially the same, with minor differences.

### AdoptOpenJDK

In 2017, a group of Java User Group members, developers and vendors (Amazon, Microsoft, Pivotal, Redhat and others) started a community,
called [AdoptOpenJDK](https://adoptopenjdk.net/).

AdoptOpenJDK is moving to the Eclipse Foundation, and changing our name to become the [Eclipse Adoptium project](https://projects.eclipse.org/projects/adoptium).

They provide free, rock-solid OpenJDK builds with [longer availibility/updates](https://adoptopenjdk.net/support.html)
and even offer you the choice of two different Java virtual machines: [HotSpot](https://en.wikipedia.org/wiki/HotSpot) and [OpenJ9](https://en.wikipedia.org/wiki/OpenJ9).

**Highly recommended** if you are looking to install Java.

### Azul Zulu, Amazon Corretto, SAPMachine

You will find a complete list of OpenJDK builds at the [OpenJDK Wikipedia](https://en.wikipedia.org/wiki/OpenJDK) site.
Among them are [Azul Zulu](https://www.azul.com/products/zulu-community/),
[Amazon Corretto](https://aws.amazon.com/de/corretto/) as well as [SapMachine](https://sap.github.io/SapMachine/), to name a few.
To oversimplify it boils down to you having different support options/maintenance guarantees.

But make sure to check out the individual websites to learn about the advantages of each single distribution.

### Alibaba Dragonwell/Tencent Kona

- 阿里 OpenJDK: [Alibaba Dragonwell](https://github.com/alibaba/dragonwell8)
- 腾讯 OpenJDK: [Tencent Kona](https://github.com/Tencent/TencentKona-8)
