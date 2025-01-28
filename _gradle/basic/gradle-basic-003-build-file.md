---
title: "build.gradle"
sequence: "103"
---

```text
plugins {
    id 'java'
}

group = 'lsieun'
version = '1.0-SNAPSHOT'

repositories {
    mavenCentral()
}

dependencies {
    testImplementation platform('org.junit:junit-bom:5.9.1')
    testImplementation 'org.junit.jupiter:junit-jupiter'
}

test {
    useJUnitPlatform()
}
```

## dependencies

Gradle 工程所有的 jar 包的坐标都在 `dependencies` 属性内放置。
每一个 jar 包的坐标都有三个基本元素组成：group、name、version。

```text
dependencies {
    testImplementation platform('org.junit:junit-bom:5.9.1')
    testImplementation 'org.junit.jupiter:junit-jupiter'
}
```

- `testCompile` 表示该 jar 包在测试的时候起作用，该属性为 jar 包的作用域。
