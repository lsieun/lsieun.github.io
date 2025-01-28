---
title: "HttpURLConnection: Handling Server Responses"
sequence: "112"
---

## Response Status Line

```txt
HTTP/1.1 200 OK
```

```txt
HTTP/1.1 404 Not Found
```

```txt
HTTP/1.1 301 Moved Permanently
```

`HttpURLConnection` also has a `getResponseCode()` method to return **numeric response code** as an `int`:

```text
public int getResponseCode() throws IOException
```

The text string that follows the response code is called the **response message** and is returned by the aptly named `getResponseMessage()` method:

```text
public String getResponseMessage() throws IOException
```

HTTP 1.0 defined 16 response codes. HTTP 1.1 expanded this to 40 different codes. Although some numbers, notably 404, have become slang almost synonymous with their semantic meaning, most of them are less familiar. The `HttpURLConnection` class includes 36 named constants such as `HttpURLConnection.OK` and `HttpURLConnection.NOT_FOUND` representing the most common response codes.

```java
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class HttpURLConnRun {
    public static void main(String[] args) {
        String url = "http://httpbin.org";
        try {
            // Open the URLConnection for reading
            URL u = new URL(url);
            HttpURLConnection uc = (HttpURLConnection) u.openConnection();

            int code = uc.getResponseCode();
            String response = uc.getResponseMessage();
            System.out.println("HTTP/1.x " + code + " " + response);
            System.out.println();

            System.out.println(uc.getHeaderField(0));
            for (int j = 1; ; j++) {
                String header = uc.getHeaderField(j);
                String key = uc.getHeaderFieldKey(j);
                if (header == null || key == null) break;
                System.out.println(uc.getHeaderFieldKey(j) + ": " + header);
            }
            System.out.println();

            try (InputStream in = new BufferedInputStream(uc.getInputStream())) {
                // chain the InputStream to a Reader
                Reader r = new InputStreamReader(in);
                int c;
                while ((c = r.read()) != -1) {
                    System.out.print((char) c);
                }
            }
        } catch (MalformedURLException ex) {
            System.err.println(url + " is not a parseable URL");
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }
}
```

## Error conditions

On occasion, the server encounters an error but returns useful information in the message body nonetheless.

The `getErrorStream()` method returns an `InputStream` containing this page or `null` if no error was encountered or no data returned:

```text
public InputStream getErrorStream()
```

Generally, you'll invoke `getErrorStream()` inside a catch block after `getInputStream()` has failed.

```java
import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class HttpURLConnRun {
    public static void main(String[] args) {
        String url = "http://httpbin.org/hello";
        try {
            URL u = new URL(url);
            HttpURLConnection uc = (HttpURLConnection) u.openConnection();
            try (InputStream raw = uc.getInputStream()) {
                System.out.println("Normal");
                printFromStream(raw);
            } catch (IOException ex) {
                System.out.println("Not Normal");
                printFromStream(uc.getErrorStream());
            }
        } catch (MalformedURLException ex) {
            System.err.println(url + " is not a parseable URL");
        } catch (IOException ex) {
            System.err.println(ex);
        }
    }

    private static void printFromStream(InputStream raw) throws IOException {
        try (InputStream buffer = new BufferedInputStream(raw)) {
            Reader reader = new InputStreamReader(buffer);
            int c;
            while ((c = reader.read()) != -1) {
                System.out.print((char) c);
            }
        }
    }
}
```

## Redirects

The 300-level response codes all indicate some sort of redirect;
that is, the requested resource is no longer available at the expected location
but it may be found at some other location.
When encountering such a response, most browsers automatically load the document from its new location.
However, this can be a security risk,
because it has the potential to move the user from a trusted site to an untrusted one,
perhaps without the user even noticing.

By default, an `HttpURLConnection` follows redirects.
However, the `HttpURLConnection` class has two static methods that let you decide whether to follow redirects:

```text
public static boolean getFollowRedirects()
public static void setFollowRedirects(boolean follow)
```

The `getFollowRedirects()` method returns `true` if redirects are being followed, `false` if they aren't.
With an argument of `true`, the `setFollowRedirects()` method makes `HttpURLConnection` objects follow redirects.
With an argument of `false`, it prevents them from following redirects.
Because these are **static methods**,
they change the behavior of all `HttpURLConnection` objects constructed after the method is invoked.
The `setFollowRedirects()` method may throw a `SecurityException` if the security manager disallows the change.
Applets especially are not allowed to change this value.

Java has two methods to configure redirection on an instance-by-instance basis. These are:

```text
public boolean getInstanceFollowRedirects()
public void setInstanceFollowRedirects(boolean followRedirects)
```

If `setInstanceFollowRedirects()` is not invoked on a given `HttpURLConnection`,
that `HttpURLConnection` simply follows the default behavior
as set by the class method `HttpURLConnection.setFollowRedirects()`.

