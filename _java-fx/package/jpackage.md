---
title: "jpackage"
sequence: "101"
---

## Intro

When invoked, `jpackage` creates a native application
based on provided code, dependencies, and resources.
It bundles a Java runtime with the native application,
and when the application is executed, the packaged Java runtime will execute the Java code.

```text
Java runtime + (code + dependencies + resources) ---> jpackage ---> native application 
```

### three application types

The `jpackage` tool supports three application types:

- Non-modular applications that run on the classpath, from one or more jar files
- Modular applications with one or more modular jar files or jmod files
- Modular applications that have been jlinked into a custom runtime image

Note that for the first two cases, `jpackage` runs `jlink` to create a Java runtime for the application and
bundles that into the final image.
In the third case, you provide a custom runtime that is bundled into the image.

> 前两者，需要使用jlink；而第三种，不需要使用jlink

### output

The output of jpackage is a self-contained application image.

This image can include the following:

- Native application launcher (generated by jpackage)
- Application resources (like jar, icns, ico, png)
- Configuration files (like plist, cfg, properties)
- Helper libraries for the launcher
- The Java runtime image, which includes the files needed to execute Java bytecode

### in the middle

The `jpackage` can be considered in the middle of the platform-independent Java bytecode and
the platform-dependent native executable.

```text
platform-independent Java bytecode ---> jpackage ---> platform-dependent native executable
```

Since `jpackage` is capable of building an executable for the current platform,
you must run `jpackage` on all platforms you want to support.
Cross-compiling a Java application from one platform into native executables for other platforms is not supported.

## Jpackage Usage

The `jpackage` usage is as follows:

```text
jpackage <options>
```

### generic options

- `@<filename>`: read options and/or mode from a file. this option can be used multiple times.
- `--type` or `-t <type string>`: the type of package to create.
  Valid values are {"app-image", "exe", "msi", "rpm", "deb", "pkg", "dmg"}.
  If this option is not specified, a platform-dependent default type will be created.
- `--app-version <version>`: Version of the application and/or package.
- `--copyright <copyright string>`: Copyright for the application.
- `--description <description string>`: Description of the application.
- `--help` or `-h`: print the usage text with a list and description of each valid option
  for the current platform to the output stream and exit.
- `--name` or `-n <name>`: name of the application and/or package.
- `--dest` or `-d <output path>`: path where the generated output file is placed
  (absolute path or relative to the current directory). Defaults to the current working directory.
- `--temp <file path>`: path of a new or empty directory used to create temporary files
  (absolute path or relative to the current directory).
  If specified, the temp dir will not be removed upon the task completion and must be removed manually.
  If not specified, a temporary directory will be created and removed upon the task completion.
- `--vendor <vendor string>`: Vendor of the application.
- `--verbose`: enables verbose output.
- `--version`: print the product version to the output stream and exit.

### options for creating the runtime image

- `--add-modules <module name>[,<module name>...]`: a comma (",")-separated list of modules to add.
  This module list, along with the main module (if specified), will be passed to `jlink` as the  
  `--add-module` argument.
  If not specified, either just the main module (if `--module` is specified) or the default set of modules
  (if `--main-jar` is specified) are used. This option can be used multiple times.
- `--module-path or -p <module path>...`: Each path is either a directory of modules or the path to a modular jar and
  is absolute or relative to the current directory.
  For more than one path, separate the paths with a colon (:) on Linux and macos or a semicolon (;) on Windows,
  or use multiple instances of the `--module-path` option. This option can be used multiple times.
- `--jlink-options <jlink options>`: a space-separated list of options to pass to `jlink`.
  If not specified, defaults to "—strip-native-commands –strip-debug –no-man-pages –no-header-files".
  This option can be used multiple times.
- `--runtime-image <file paths>`: Path of the predefined runtime image that will be copied into the
  application image (absolute path or relative to the current directory).
  If `--runtime-image` is not specified, `jpackage` will run `jlink` to create the runtime image
  using options `--strip-debug`, `--no-header-files`, `--no-man-pages`, and `--strip-native-commands`.

### options for creating the application image

- `--icon <icon file path>`: Path of the icon of the application bundle
  (absolute path or relative to the current directory).
- `--input` or `-i <input path>`: Path of the input directory that contains the files to be packaged
  (absolute path or relative to the current directory).
  All files in the input directory will be packaged into the application image.

### options for creating the application launcher(s)

- `--add-launcher <launcher name>=<file path>`: Name of the launcher and a path to a properties file
  that contains a list of key-value pairs (absolute path or relative to the current directory).
  The keys "module," "add-modules," "main-jar," "main-class," "arguments," "java-options,"
  "app-version," "icon," and "win-console" can be used.
  These options are added to, or used to overwrite, the original command-line options to build an
  additional alternative launcher.
  The main application launcher will be built from the command-line options.
  Additional alternative launchers may be built using this option,
  and this option can be used multiple times to build multiple additional launchers.
- `--arguments <main class arguments>`: Command-line arguments to pass to the main class
  if no command-line arguments are given to the launcher. This option can be used multiple times.
- `--java-options <java options>`: Options to pass to the Java runtime. this option can be used multiple times.
- `--main-class <class name>`: Qualified name of the application main class to execute.
  This option can only be used if `--main-jar` is specified.
- `--main-jar <main jar file>`: The main Jar of the application, containing the main class
  (specified as a path relative to the input path).
  Either the `--module` or `--main-jar` option can be specified but not both.
- `--module` or `-m <module name>[/<main class>]`: The main module (and optionally main class) of the application.
  This module must be located on the module path.
  When this option is specified, the main module will be linked in the Java runtime image.
  Either the `--module` or `--main-jar` option can be specified but not both.


### platform-dependent options for creating the application launcher

- `--win-console`: Creates a console launcher for the application.
  Should be specified for the application that requires console interactions.
  This option is available only when running on Windows.
- `--mac-package-identifier <ID string>`: An identifier that uniquely identifies the application for macOS.
  Defaults to the main class name. May only use alphanumeric (a–Z, a–z, 0–9), hyphen (-), and period (.) characters.
  This option is available only when running on macOS.
- `--mac-package-name <name string>`: Name of the application as it appears in the menu bar.
  This can be different from the application name.
  This name must be shorter than 16 characters and be suitable for display in the menu bar and the application info window.
  Defaults to the application name. This option is available only when running on macos.
- `--mac-bundle-signing-prefix <prefix string>`: When signing the application bundle,
  this value is prefixed to all components that need to be signed that don't have an existing bundle identifier.
  This option is available only when running on macOS.
- `--mac-sign`: Request that the bundle be signed. This option is available only when running on macOS.
- `--mac-signing-keychain <file path>`: Path of the keychain to use
  (absolute path or relative to the current directory).
  If not specified, the standard keychains are used. This option is available only when running on macOS.
- `--mac-signing-key-user-name <team name>`: Team name portion in apple signing identities' names.
  For example, "Developer ID application: <team name>".
  This option is available only when running on macOS.

### options for creating the application package

- `--app-image <file path>`: Location of the predefined application image
  that is used to build an installable package (absolute path or relative to the current directory).
  See `create-app-image` mode options to create the application image.
- `--file-associations <file path>`: Path to a properties file that contains a list of key-value pairs
  (absolute path or relative to the current directory).
  The keys "extension," "mime-type," "icon," and "description" can be used to describe the association.
  This option can be used multiple times.
- `--install-dir <file path>`: Absolute path of the installation directory of the application on macOS or Linux.
  Relative sub-path of the installation location of the application such as "Program Files" or "AppData" on Windows.
- `--license-file <file path>`: Path to the license file (absolute path or relative to the current directory).
- `--resource-dir <path>`: Path to override `jpackage` resources (absolute path or relative to the current directory).
  Icons, template files, and other resources of jpackage can be overridden
  by adding replacement resources to this directory.
- `--runtime-image <file-path>`: Path of the predefined runtime image to install
  (absolute path or relative to the current directory). Option is required when creating a runtime installer.

### platform-dependent options for creating the application package

- `--win-dir-chooser`: Adds a dialog to enable the user to choose a directory in which the product is installed.
  This option is available only when running on Windows.
- `--win-menu`: Adds the application to the system menu. This option is available only when running on Windows.
- `--win-menu-group <menu group name>`: Start Menu group in which this application is placed.
  This option is available only when running on Windows.
- `--win-per-user-install`: Request to perform an install on a per-user basis.
  This option is available only when running on Windows.
- `--win-shortcut`: Creates a desktop shortcut for the application.
  This option is available only when running on Windows.
- `--win-upgrade-uuid <id string>`: UUID associated with upgrades for this package.
  This option is available only when running on Windows.

#### Linux

- `--linux-package-name <package name>`: Name for the Linux package. Defaults to the application name.
  This option is available only when running on Linux.
- `--linux-deb-maintainer <email address>`: Maintainer for `.deb` bundle. 
  This option is available only when running on Linux.
- `--linux-menu-group <menu-group-name>`: Menu group in which this application is placed.
  This option is available only when running on Linux.
- `--linux-package-deps`: Required packages or capabilities for the application.
  This option is available only when running on Linux.
- `--linux-rpm-license-type <type string>`: Type of the license ("License: <value>" of the RpM <name>.spec).
  This option is available only when running on Linux.
- `--linux-app-release <release string>`: Release value of the RPM `<name>.spec` file or
  Debian revision value of the DEB control file.
  This option is available only when running on Linux.
- `--linux-app-category <category string>`: Group value of the RPM `<name>.spec` file or
  section value of the DEB control file.
  This option is available only when running on Linux.
- `--linux-shortcut`: Creates a shortcut for the application.
  This option is available only when running on Linux.

## Requirements

The images created by `jpackage` are not different from other applications developers
create for native platforms.
Therefore, the same tools that are used to generate native applications for
a specific operating system are used by `jpackage` as well.

For Windows, in order to generate native packages, developers need to install:

- WiX Toolset, a free third-party tool that generates exe and msi installers

### WiX Setup

Download WiX Toolset from [https://wixtoolset.org/releases/](https://wixtoolset.org/releases/).
The current version is 3.11.2.
Once downloaded, process with the installer, and when finished, add it to the path, running from the command line

```text
setx /M PATH "%PATH%;C:\Program Files (x86)\WiX Toolset v3.11\bin"
```

## Samples

```text
set PATH_TO_FX="D:\Software\jdk\javafx-sdk-18.0.1\lib"
set PATH_TO_FX_MODS="D:\Software\jdk\javafx-jmods-18.0.1"
```

```text
dir /s /b src\*.java > sources.txt & javac --module-path %PATH_TO_FX% --add-modules javafx.controls,javafx.fxml -d out @sources.txt & del sources.txt
copy src\org\modernclients\scene.fxml out\org\modernclients\ & copy src\org\modernclients\styles.css out\org\modernclients\
```

```text
java --module-path %PATH_TO_FX% --add-modules javafx.controls,javafx.fxml -cp out org.modernclients.Main
```

```text
mkdir libs
jar --create --file=libs\sample1.jar --main-class=org.modernclients.Main -C out .
```

```text
jpackage --type exe -d installer -i libs --main-jar sample1.jar -n Sample1 --module-path %PATH_TO_FX_MODS% --add-modules javafx.controls,javafx.fxml --main-class org.modernclients.Main
```

```text
jpackage --type exe -d installer -i libs --main-jar sample1.jar -n Sample1 --module-path %PATH_TO_FX_MODS% --add-modules javafx.controls,javafx.fxml --main-class org.modernclients.Main --verbose
```

```text
jpackage --type exe -d installer -i libs --main-jar sample1.jar -n Sample1 --module-path %PATH_TO_FX_MODS% --add-modules javafx.controls,javafx.fxml --main-class org.modernclients.Main --win-menu --win-menu-group 天道第一 --win-shortcut --win-dir-chooser --icon assets\win\openduke.ico
```

## Reference

- [JEP 392: Packaging Tool](https://openjdk.org/jeps/392)
- [Use jpackage to Create Native Java App Installers](https://www.devdungeon.com/content/use-jpackage-create-native-java-app-installers)
