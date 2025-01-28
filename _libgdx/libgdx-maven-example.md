---
title: "libGDX-maven"
sequence: "101"
---

## pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>lsieun</groupId>
    <artifactId>learn-libgdx-java</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>
        <maven.compiler.source>${java.version}</maven.compiler.source>
        <maven.compiler.target>${java.version}</maven.compiler.target>
        <gdx.version>1.10.0</gdx.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.badlogicgames.gdx</groupId>
            <artifactId>gdx</artifactId>
            <version>${gdx.version}</version>
        </dependency>
        <dependency>
            <groupId>com.badlogicgames.gdx</groupId>
            <artifactId>gdx-platform</artifactId>
            <version>${gdx.version}</version>
            <classifier>natives-desktop</classifier>
        </dependency>
        <dependency>
            <groupId>com.badlogicgames.gdx</groupId>
            <artifactId>gdx-backend-lwjgl</artifactId>
            <version>${gdx.version}</version>
        </dependency>
        <dependency>
            <groupId>com.badlogicgames.gdx</groupId>
            <artifactId>gdx-box2d</artifactId>
            <version>${gdx.version}</version>
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

</project>
```

## Code

### HelloWorldImage

```java
import com.badlogic.gdx.Game;
import com.badlogic.gdx.Gdx;
import com.badlogic.gdx.files.FileHandle;
import com.badlogic.gdx.graphics.GL20;
import com.badlogic.gdx.graphics.Texture;
import com.badlogic.gdx.graphics.g2d.SpriteBatch;

public class HelloWorldImage extends Game {
    private Texture texture;
    private SpriteBatch batch;

    @Override
    public void create() {
        FileHandle worldFile = Gdx.files.internal("world.png");
        texture = new Texture(worldFile);
        batch = new SpriteBatch();
    }

    public void render() {
        Gdx.gl.glClearColor(1, 1, 1, 1);
        Gdx.gl.glClear(GL20.GL_COLOR_BUFFER_BIT);

        batch.begin();
        batch.draw(texture, 192, 112);
        batch.end();
    }
}
```

### HelloLauncher

```java
import com.badlogic.gdx.backends.lwjgl.LwjglApplication;

public class HelloLauncher {
    public static void main(String[] args) {
        HelloWorldImage myProgram = new HelloWorldImage();
        LwjglApplication launcher = new LwjglApplication(myProgram);
    }
}
```
