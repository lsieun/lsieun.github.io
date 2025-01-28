---
title: " Annotation Processing"
sequence: "101"
---

## two-step process

Annotation processing at compile time is a **two-step process**.

- First, you need to write a custom annotation processor.
- Second, you need to use the `javac` command-line utility tool.
  You need to specify the module path for your custom annotation processor to the `javac` compiler using the `-processor-modulepath` option.

The following command compiles the Java source file, `MySourceFile.java`:

```text
javac --processor-module-path <path> MySourceFile.java
```

Using the `-proc` option, the `javac` command lets you specify
if you want to **process the annotation** and/or **compile the source files**.
You can use the `-proc` option as `-proc:none` or `-proc:only`.
The `-proc:none` option does not perform annotation processing.
It only compiles source files.
The `-proc:only` option performs only annotation processing and skips the source file compilation.
If the `-proc:none` and the `-processor` options are specified in the same command,
the `-processor` option is ignored.

The following command processes annotations in the source file `MySourceFile.java` using custom processors:
`MyProcessor1` and `MyProcessor2`.
It does not compile the source code in the `MySourceFile.java` file:

```text
javac -proc:only --processor-module-path <path> MySourceFile.java
```

## annotation processor

To see the compile-time annotation processing in action,
you must write an **annotation processor** using the classes in the `javax.annotation.processing` package,
which is in the `java.compiler` module.

While writing a custom annotation processor,
you often need to access the elements from the source code, for example,
the name of a class and its modifiers, the name of a method and its return type, etc.
You need to use classes in the `javax.lang.model` package and its subpackages to work with the elements of the source code.

In your example, you will write an annotation processor for your `@Version` annotation.
It will validate all `@Version` annotations that are used in the source code
to make sure the `major` and `minor` values for a `Version` are always `zero` or greater than `zero`.
For example, if `@Version(major=-1, minor=0)` is used in source code,
your annotation processor will print an error message because the major value for the version is negative.

An annotation processor is an object of a class, which implements the `Processor` interface.
The `AbstractProcessor` class is an abstract annotation processor,
which provides a default implementation for all methods of the `Processor` interface,
except an implementation for the `process()` method.
The default implementation is fine in most circumstances.
To create your own processor, you need to inherit your processor class from the `AbstractProcessor` class and
provide an implementation for the `process()` method.
If the `AbstractProcessor` class does not suit your need,
you can create your own processor class,
which implements the `Processor` interface.
Let's call your processor class `VersionProcessor`, which inherits from the `AbstractProcessor` class, as shown:

```java
import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.RoundEnvironment;
import javax.lang.model.element.TypeElement;
import java.util.Set;

public class VersionProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        return false;
    }
}
```

The **annotation processor** object is instantiated by the compiler using a no-args constructor.
You must have a no-args constructor for your processor class, so that the compiler can instantiate it.
The default constructor for your `VersionProcessor` class will meet this requirement.

### @SupportedAnnotationTypes

The next step is to add **two pieces of information** to the processor class.
The first one is about **what kind of annotation processing** is supported by this processor.
You can specify the supported annotation type using the `@SupportedAnnotationTypes` annotation at the class level.
The following snippet of code shows that the `VersionProcessor` supports processing of
the `lsieun.annotation.Version` annotation type:

```java
import javax.annotation.processing.AbstractProcessor;
import javax.annotation.processing.RoundEnvironment;
import javax.annotation.processing.SupportedAnnotationTypes;
import javax.lang.model.element.TypeElement;
import java.util.Set;

@SupportedAnnotationTypes({"lsieun.annotation.Version"})
public class VersionProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        return false;
    }
}
```

You can use an asterisk (`*`) by itself or as part of the annotation name of the supported annotation types.
The asterisk works as a wildcard.
For example, “`com.jdojo.*`” means any annotation types whose names start with “`com.jdojo.`”.
An asterisk only (“`*`”) means all annotation types.
Note that when an asterisk is used as part of the name, the name must be of the form `PartialName.*`.
For example, “`com*`” and “`com.*jdojo`” are invalid uses of an asterisk in the supported annotation types.
You can pass multiple supported annotation types using the `SupportedAnnotationTypes` annotation.
The following snippet of code shows that the processor supports processing
for the `com.jdojo.Ann1` annotation and any annotations whose name begins with `com.jdojo.annotation`:

```text
@SupportedAnnotationTypes({"com.jdojo.Ann1", "com.jdojo.annotation.*"})
```

### @SupportedSourceVersion

You need to specify the latest source code version that is supported by your processor
using a `@SupportedSourceVersion` annotation.
The following snippet of code specifies the source code version 17 as the supported source code version
for the `VersionProcessor` class:

```java
@SupportedAnnotationTypes({"lsieun.annotation.Version"})
@SupportedSourceVersion(SourceVersion.RELEASE_17)
public class VersionProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        return false;
    }
}
```

### process()

The next step is to provide the implementation for the `process()` method in the processor class.
Annotation processing is performed in rounds.
An instance of the `RoundEnvironment` interface represents a round.
The `javac` compiler calls the `process()` method of your processor
by passing all annotations that the processor declares to support and a `RoundEnvironment` object.
The return type of the `process()` method is `boolean`.

If it returns `true`, the annotations passed to it are considered to be claimed by the processor.
The claimed annotations are not passed to other processors.

If it returns `false`, the annotations passed to it are considered as not claimed,
and other processors will be asked to process them.

The code you write inside the `process()` method depends on your requirements.
In your case, you want to look at the `major` and `minor` values for each `@Version` annotation in the source code.
If either of them is less than zero, you want to print an error message.
To process each `Version` annotation,
you will iterate through all `Version` annotation instances passed to the `process()` method as follows:

```java
@SupportedAnnotationTypes({"lsieun.annotation.Version"})
@SupportedSourceVersion(SourceVersion.RELEASE_17)
public class VersionProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        for (TypeElement currentAnnotation : annotations) {
            // Code to validate each Version annotation goes here
        }
        return false;
    }
}
```

You can get the fully qualified name of an annotation
using the `getQualifiedName()` method of the `TypeElement` interface:

```java
@SupportedAnnotationTypes({"lsieun.annotation.Version"})
@SupportedSourceVersion(SourceVersion.RELEASE_17)
public class VersionProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        for (TypeElement currentAnnotation : annotations) {
            Name qualifiedName = currentAnnotation.getQualifiedName();
            // Check if it is a Version annotation
            if (qualifiedName.contentEquals("lsieun.annotation.Version")) {
                // Get Version annotation values to validate
            }
        }
        return false;
    }
}
```

To get information from the source code, you need to use the `RoundEnvironment` object.
The following snippet of code will get all elements of the source code
(e.g., classes, methods, constructors, etc.) that are annotated with a `Version` annotation:

```java
@SupportedAnnotationTypes({"lsieun.annotation.Version"})
@SupportedSourceVersion(SourceVersion.RELEASE_17)
public class VersionProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        for (TypeElement currentAnnotation : annotations) {
            Name qualifiedName = currentAnnotation.getQualifiedName();
            // Check if it is a Version annotation
            if (qualifiedName.contentEquals("lsieun.annotation.Version")) {
                Set<? extends Element> annotatedElements = roundEnv.getElementsAnnotatedWith(currentAnnotation);
                for (Element element : annotatedElements) {
                    Version v = element.getAnnotation(Version.class);
                    int major = v.major();
                    int minor = v.minor();
                    if (major < 0 || minor < 0) {
                        // Print the error message here
                    }
                }
            }
        }
        return false;
    }
}
```

You can print the error message using the `printMessage()` method of the `Messager`.
The `processingEnv` is an instance variable defined in the `AbstractProcessor` class
that you can use inside your processor to get the `Messager` object reference, as shown next.
If you pass the source code element's reference to the `printMessage()` method,
your message will be formatted to include **the source code file name** and **the line number**
in the source code for that element.
The first argument to the `printMessage()` method indicates the type of the message.
You can use `Kind.NOTE` and `Kind.WARNING` as the first argument to print a note and warning, respectively.

```java
@SupportedAnnotationTypes({"lsieun.annotation.Version"})
@SupportedSourceVersion(SourceVersion.RELEASE_17)
public class VersionProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set<? extends TypeElement> annotations, RoundEnvironment roundEnv) {
        for (TypeElement currentAnnotation : annotations) {
            Name qualifiedName = currentAnnotation.getQualifiedName();
            // Check if it is a Version annotation
            if (qualifiedName.contentEquals("lsieun.annotation.Version")) {
                Set<? extends Element> annotatedElements = roundEnv.getElementsAnnotatedWith(currentAnnotation);
                for (Element element : annotatedElements) {
                    Version v = element.getAnnotation(Version.class);
                    int major = v.major();
                    int minor = v.minor();
                    if (major < 0 || minor < 0) {
                        String errorMsg = "Version cannot be negative. major=" + major + " minor=" + minor;
                        Messager messager = this.processingEnv.getMessager();
                        messager.printMessage(Diagnostic.Kind.ERROR, errorMsg, element);
                    }
                }
            }
        }
        return false;
    }
}
```

Finally, you need to return `true` or `false` from the `process()` method.
If a processor returns `true`, it means it claimed all the annotations that were passed to it.
Otherwise, those annotations are considered unclaimed,
and they will be passed to other processors.

Typically, your annotation processors should be packaged in a separate module.


## Reference

- [The Checker Framework](https://checkerframework.org/)

The University of Washington developed a [Checker Framework](https://checkerframework.org/)
that contains a lot of annotations to be used in programs.
It also ships with many annotation processors.
It contains a tutorial for using different types of processors and a tutorial on how to create your own processor.
