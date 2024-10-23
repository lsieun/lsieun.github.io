---
title: "Java Preferences"
sequence: "101"
---

## 使用场景

The `java.util.prefs` package in Java provides a simple and platform-independent way
to store and retrieve user preferences.
It allows developers to save configuration settings, user preferences, and other small pieces of data persistently.

Preferences 类可以用在项目中做一个本地小存储，比如小型的一些软件配置项目，内部存储时会以key/value的形式存储。
在不同的系统下Preferences有其不同的实现。

## Preferences写入的数据在哪里

Preferences本身是个抽象类，它有三个不同的工厂类，可以根据不同平台生产对应的Preferences类。Java源码如下

```text
// 3. Use platform-specific system-wide default
String osName = System.getProperty("os.name");
String platformFactory;
if (osName.startsWith("Windows")) {
    platformFactory = "java.util.prefs.WindowsPreferencesFactory";
} else if (osName.contains("OS X")) {
    platformFactory = "java.util.prefs.MacOSXPreferencesFactory";
} else {
    platformFactory = "java.util.prefs.FileSystemPreferencesFactory";
}
```

源码可以看出Preferences支持：windows、os x、和其他类unix平台

### Windows

在windows下，Preferences类最终将数据保存在系统的注册表中。通常我们使用Preferences会使用userNodeForPackage方法获取，而不会获取系统的节点

例如如下的代码：

```text
Preferences preferences = Preferences.userNodeForPackage(LicenseVerify.class);
```

这样获取到的 Preferences 最终会写入 `HKEY_LOCAL_MACHINE\SOFTWARE\JavaSoft\Prefs` 这个注册表节点，
写入的节点层级是 `LicenseVerify` 所在的包路径。
假设 `LicenseVerify` 在 `com.abc` 包路径下，则完整的注册表层级为：
`HKEY_LOCAL_MACHINE\SOFTWARE\JavaSoft\Prefs\com.abc` 这个节点下。

### Linux

在 Linux 平台因为并没有注册表的存在，Java使用文件系统做存储。存储的路径是在：

```text
new File(System.getProperty("java.util.prefs.userRoot",System.getProperty("user.home")), ".java/.userPrefs");
```

如果 `user.home` 指向 `app` 用户的家目录，则存储的完整路径为：`/home/app/.java/userPrefs/com/abc`。
在 Linux 上存储直接被存为 XML 文件，可以打开查看。而windows下需要程序读取导出xml。

## Reference

- [A Guide to Java Preferences API: Storing User Preferences](https://delta-dev-software.fr/a-guide-to-java-preferences-api-storing-user-preferences)
- [Java Preferences类做本地存储](https://www.cnblogs.com/leemz-coding/p/16009323.html)
