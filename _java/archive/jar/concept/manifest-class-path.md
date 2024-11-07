---
title: "Jar Manifest: Class-Path"
sequence: "111"
---


## Class-Path

```text
Class-Path: lib/asm-9.2.jar lib/asm-util-9.2.jar lib/asm-commons-9.2.j
 ar lib/asm-tree-9.2.jar lib/asm-analysis-9.2.jar
```

在`URLClassLoader`类当中，用到就是`URLClassPath`类。

```java
public class URLClassPath {
    public URL findResource(String name, boolean check) {
        Loader loader;
        for (int i = 0; (loader = getLoader(i)) != null; i++) {  // 第一步，关注getLoader(i)方法
            URL url = loader.findResource(name, check);
            if (url != null) {
                return url;
            }
        }
        return null;
    }

    private synchronized Loader getLoader(int index) {
        if (closed) {
            return null;
        }
        // Expand URL search path until the request can be satisfied
        // or the URL stack is empty.
        while (loaders.size() < index + 1) {
            // Pop the next URL from the URL stack
            URL url;
            synchronized (urls) {
                if (urls.empty()) {
                    return null;
                }
                else {
                    url = urls.pop();
                }
            }
            // Skip this URL if it already has a Loader. (Loader
            // may be null in the case where URL has not been opened
            // but is referenced by a JAR index.)
            String urlNoFragString = URLUtil.urlNoFragString(url);
            if (lmap.containsKey(urlNoFragString)) {
                continue;
            }
            // Otherwise, create a new Loader for the URL.
            Loader loader;
            try {
                loader = getLoader(url);
                // If the loader defines a local class path then add the
                // URLs to the list of URLs to be opened.
                URL[] urls = loader.getClassPath();  // 第二步，关注loader.getClassPath()方法
                if (urls != null) {
                    push(urls);
                }
            } catch (IOException e) {
                // Silently ignore for now...
                continue;
            }
            // Finally, add the Loader to the search path.
            loaders.add(loader);
            lmap.put(urlNoFragString, loader);
        }
        return loaders.get(index);
    }
}
```

```java
class Loader implements Closeable {
    URL[] getClassPath() throws IOException {    // 第三步，Loader的getClassPath()默认实现是返回null值
        return null;                             // 但是，在子类当中有具体实现
    }
}
```

```java
class JarLoader extends Loader {
    /*
     * Returns the JAR file local class path, or null if none.
     */
    URL[] getClassPath() throws IOException {
        // ...
        if (SharedSecrets.javaUtilJarAccess().jarFileHasClassPathAttribute(jar)) { // Only get manifest when necessary
            Manifest man = jar.getManifest();
            if (man != null) {
                Attributes attr = man.getMainAttributes();
                if (attr != null) {
                    String value = attr.getValue(Attributes.Name.CLASS_PATH);    // 第四步，这里就是"Class-Path"属性
                    if (value != null) {
                        return parseClassPath(code_source_url, value);
                    }
                }
            }
        }
        return null;
    }

    /*
     * Parses value of the Class-Path manifest attribute and
     *  returns an array of URLs relative to the specified base URL.
     */
    private URL[] parseClassPath(URL base, String value) throws MalformedURLException {
        StringTokenizer st = new StringTokenizer(value);
        URL[] urls = new URL[st.countTokens()];
        int i = 0;
        while (st.hasMoreTokens()) {
            String path = st.nextToken();
            urls[i] = new URL(base, path);
            i++;
        }
        return urls;
    }
}
```

## Example

```java
import java.io.IOException;
import java.net.JarURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.StringTokenizer;
import java.util.jar.Attributes;
import java.util.jar.JarFile;
import java.util.jar.Manifest;

public class HelloWorld {
    public static void main(String[] args) throws IOException {
        URL url = new URL("file:/D:/git-repo/learn-java-agent/target/TheAgent.jar");
        JarFile jar = getJarFile(url);
        Manifest manifest = jar.getManifest();

        if (manifest == null) {
            System.out.println("No Manifest");
            return;
        }

        Attributes attr = manifest.getMainAttributes();
        if (attr == null) {
            System.out.println("No MainAttributes");
            return;
        }
        
        String value = attr.getValue(Attributes.Name.CLASS_PATH);
        if (value == null) {
            System.out.println("No Class-Path");
            return;
        }
        
        URL[] urls = parseClassPath(url, value);
        for (URL u : urls) {
            System.out.println(u);
        }
    }

    private static JarFile getJarFile(URL url) throws IOException {
        URL baseURL = new URL("jar", "", -1, url + "!/", null);
        URLConnection uc = baseURL.openConnection();
        JarFile jarFile = ((JarURLConnection) uc).getJarFile();
        return jarFile;
    }

    private static URL[] parseClassPath(URL base, String value) throws MalformedURLException {
        StringTokenizer st = new StringTokenizer(value);
        URL[] urls = new URL[st.countTokens()];
        int i = 0;
        while (st.hasMoreTokens()) {
            String path = st.nextToken();
            urls[i] = new URL(base, path);
            i++;
        }
        return urls;
    }
}
```

Output:

```text
file:/D:/git-repo/learn-java-agent/target/lib/asm-9.2.jar
file:/D:/git-repo/learn-java-agent/target/lib/asm-util-9.2.jar
file:/D:/git-repo/learn-java-agent/target/lib/asm-commons-9.2.jar
file:/D:/git-repo/learn-java-agent/target/lib/asm-tree-9.2.jar
file:/D:/git-repo/learn-java-agent/target/lib/asm-analysis-9.2.jar
```
