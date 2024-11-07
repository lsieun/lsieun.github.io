---
title: "MapStruct + Maven"
sequence: "102"
---

## Apache Maven

For Maven based projects add the following to your POM file in order to use MapStruct:

```xml
<properties>
    <org.mapstruct.version>1.5.5.Final</org.mapstruct.version>
</properties>
```

```xml
<dependencies>
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${org.mapstruct.version}</version>
    </dependency>
</dependencies>
```

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.8.1</version>
            <configuration>
                <source>1.8</source>
                <target>1.8</target>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>${org.mapstruct.version}</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
    </plugins>
</build>
```

## Configuration options

The MapStruct code generator can be configured using annotation processor options.

When invoking javac directly, these options are passed to the compiler in the form:

```text
-Akey=value
```

When using MapStruct via Maven, any processor options can be passed
using `compilerArgs` within the `configuration` of the Maven processor plug-in like this:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.5.1</version>
    <configuration>
        <source>1.8</source>
        <target>1.8</target>
        <annotationProcessorPaths>
            <path>
                <groupId>org.mapstruct</groupId>
                <artifactId>mapstruct-processor</artifactId>
                <version>${org.mapstruct.version}</version>
            </path>
        </annotationProcessorPaths>
        <!-- due to problem in maven-compiler-plugin, for verbose mode add showWarnings -->
        <showWarnings>true</showWarnings>
        <compilerArgs>
            <arg>
                -Amapstruct.suppressGeneratorTimestamp=true
            </arg>
            <arg>
                -Amapstruct.suppressGeneratorVersionInfoComment=true
            </arg>
            <arg>
                -Amapstruct.verbose=true
            </arg>
        </compilerArgs>
    </configuration>
</plugin>
```

MapStruct processor options


<table>
    <caption>MapStruct processor options</caption>
    <thead>
    <tr>
        <th>Option</th>
        <th>Purpose</th>
        <th>Default</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td><p><code>mapstruct.suppressGeneratorTimestamp</code></p></td>
        <td>
            <div>
                <div>
                    <p>
                        If set to <code>true</code>, the creation of a time stamp in the <code>@Generated</code>
                        annotation in the generated mapper classes is suppressed.
                    </p>
                </div>
            </div>
        </td>
        <td><p><code>false</code></p></td>
    </tr>
    <tr>
        <td><p><code>mapstruct.verbose</code></p></td>
        <td>
            <div>
                <div>
                    <p>
                        If set to <code>true</code>, MapStruct in which MapStruct logs its major decisions.
                        Note, at the moment of writing in Maven, also <code>showWarnings</code> needs to be added
                        due to a problem in the maven-compiler-plugin configuration.
                    </p>
                </div>
            </div>
        </td>
        <td><p><code>false</code></p></td>
    </tr>
    <tr>
        <td><p><code>mapstruct.suppressGeneratorVersionInfoComment</code></p></td>
        <td>
            <div>
                <div>
                    <p>
                        If set to <code>true</code>, the creation of the <code>comment</code> attribute
                        in the <code>@Generated</code>annotation in the generated mapper classes is suppressed.
                        The comment contains information about
                        the version of MapStruct and about the compiler used for the annotation processing.
                    </p>
                </div>
            </div>
        </td>
        <td><p><code>false</code></p></td>
    </tr>
    <tr>
        <td><p><code>mapstruct.defaultComponentModel</code>
        </p></td>
        <td>
            <div>
                <div>
                    <p>
                        The name of the component model based on which mappers should be generated.
                    </p>
                </div>
                <div>
                    <p>Supported values are:</p>
                </div>
                <div>
                    <ul>
                        <li>
                            <p>
                                <code>default</code>:
                                the mapper uses no component model, instances are typically
                                retrieved via <code>Mappers#getMapper(Class)</code>
                            </p>
                        </li>
                        <li>
                            <p>
                                <code>cdi</code>:
                                the generated mapper is an application-scoped (from
                                javax.enterprise.context or jakarta.enterprise.context,
                                depending on which one is available with javax.inject having priority)
                                CDI bean and can be retrieved via <code>@Inject</code>
                            </p>
                        </li>
                        <li>
                            <p>
                                <code>spring</code>:
                                the generated mapper is a singleton-scoped Spring bean and can be
                                retrieved via <code>@Autowired</code>
                            </p>
                        </li>
                        <li>
                            <p>
                                <code>jsr330</code>:
                                the generated mapper is annotated with {@code @Named} and can be
                                retrieved via <code>@Inject</code>
                                (from javax.inject or jakarta.inject, depending which
                                one is available with javax.inject having priority), e.g. using Spring
                            </p>
                        </li>
                        <li>
                            <p>
                                <code>jakarta</code>:
                                the generated mapper is annotated with {@code @Named} and can be
                                retrieved via <code>@Inject</code> (from jakarta.inject), e.g. using Spring
                            </p>
                        </li>
                        <li>
                            <p>
                                <code>jakarta-cdi</code>:
                                the generated mapper is an application-scoped
                                (from jakarta.enterprise.context) CDI bean and can be retrieved via <code>@Inject</code>
                            </p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p>
                        If a component model is given for a specific mapper
                        via <code>@Mapper#componentModel()</code>,
                        the value from the annotation takes precedence.
                    </p>
                </div>
            </div>
        </td>
        <td><p><code>default</code></p></td>
    </tr>
    <tr>
        <td><p>
            <code>mapstruct.defaultInjectionStrategy</code></p></td>
        <td>
            <div>
                <div>
                    <p>The type of the injection in mapper via parameter <code>uses</code>. This is only used on
                        annotated based component models
                        such as CDI, Spring and JSR 330.</p>
                </div>
                <div>
                    <p>Supported values are:</p>
                </div>
                <div>
                    <ul>
                        <li>
                            <p><code>field</code>: dependencies will be injected in fields</p>
                        </li>
                        <li>
                            <p><code>constructor</code>: will be generated constructor. Dependencies will be injected
                                via constructor.</p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p>When CDI <code>componentModel</code> a default constructor will also be generated.
                        If a injection strategy is given for a specific mapper via
                        <code>@Mapper#injectionStrategy()</code>, the value from the annotation takes precedence over
                        the option.</p>
                </div>
            </div>
        </td>
        <td><p><code>field</code></p></td>
    </tr>
    <tr>
        <td><p><code>mapstruct.unmappedTargetPolicy</code>
        </p></td>
        <td>
            <div>
                <div>
                    <p>The default reporting policy to be applied in case an attribute of the target object of a mapping
                        method is not populated with a source value.</p>
                </div>
                <div>
                    <p>Supported values are:</p>
                </div>
                <div>
                    <ul>
                        <li>
                            <p><code>ERROR</code>: any unmapped target property will cause the mapping code generation
                                to fail</p>
                        </li>
                        <li>
                            <p><code>WARN</code>: any unmapped target property will cause a warning at build time</p>
                        </li>
                        <li>
                            <p><code>IGNORE</code>: unmapped target properties are ignored</p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p>If a policy is given for a specific mapper via <code>@Mapper#unmappedTargetPolicy()</code>, the
                        value from the annotation takes precedence.
                        If a policy is given for a specific bean mapping via
                        <code>@BeanMapping#unmappedTargetPolicy()</code>, it takes precedence over both <code>@Mapper#unmappedTargetPolicy()</code>
                        and the option.</p>
                </div>
            </div>
        </td>
        <td><p><code>WARN</code></p></td>
    </tr>
    <tr>
        <td><p><code>mapstruct.unmappedSourcePolicy</code>
        </p></td>
        <td>
            <div>
                <div>
                    <p>The default reporting policy to be applied in case an attribute of the source object of a mapping
                        method is not populated with a target value.</p>
                </div>
                <div>
                    <p>Supported values are:</p>
                </div>
                <div>
                    <ul>
                        <li>
                            <p><code>ERROR</code>: any unmapped source property will cause the mapping code generation
                                to fail</p>
                        </li>
                        <li>
                            <p><code>WARN</code>: any unmapped source property will cause a warning at build time</p>
                        </li>
                        <li>
                            <p><code>IGNORE</code>: unmapped source properties are ignored</p>
                        </li>
                    </ul>
                </div>
                <div>
                    <p>If a policy is given for a specific mapper via <code>@Mapper#unmappedSourcePolicy()</code>, the
                        value from the annotation takes precedence.
                        If a policy is given for a specific bean mapping via <code>@BeanMapping#ignoreUnmappedSourceProperties()</code>,
                        it takes precedence over both <code>@Mapper#unmappedSourcePolicy()</code> and the option.</p>
                </div>
            </div>
        </td>
        <td><p><code>WARN</code></p></td>
    </tr>
    <tr>
        <td><p><code>mapstruct.disableBuilders</code></p></td>
        <td>
            <div>
                <div>
                    <p>
                        If set to <code>true</code>, then MapStruct will not use builder patterns when doing the mapping.
                        This is equivalent to doing <code>@Mapper( builder = @Builder( disableBuilder = true ) )</code>
                        for all of your mappers.
                    </p>
                </div>
            </div>
        </td>
        <td><p><code>false</code></p></td>
    </tr>
    </tbody>
</table>

- `mapstruct.suppressGeneratorTimestamp`: If set to `true`, the creation of a time stamp in the `@Generated`
  annotation in the generated mapper classes is suppressed.
- `mapstruct.suppressGeneratorVersionInfoComment`: If set to `true`,
  the creation of the `comment` attribute in the `@Generated` annotation in the generated mapper classes is suppressed.
  The `comment` contains information about
  the version of MapStruct and about the compiler used for the annotation processing.

![](/assets/images/java/mapstruct/mapstruct-generated-source-code-suppress-xxx.png)


- `mapstruct.verbose`: If set to `true`, MapStruct in which MapStruct logs its major decisions.
  Note, at the moment of writing in Maven, also `showWarnings` needs to be added
  due to a problem in the `maven-compiler-plugin` configuration.

![](/assets/images/java/mapstruct/maven-compiler-plugin-jar-show-warnings.png)
