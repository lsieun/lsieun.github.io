---
title: "Developing an RMI Application"
sequence: "103"
---

[UP]({% link _java-theme/java-rmi-index.md %})

## Developing an RMI Application

The following steps are involved in writing an RMI application:

- Writing a **remote interface**.
- Implementing the **remote interface** in a class. An object of this class serves as the **remote object**.
- Writing a server program. It creates an object of the class that implements the **remote interface** and registers it with the RMI registry.
- Writing a client program that accesses the **remote object** on the server.

### Writing the Remote Interface

A **remote interface** is like any other Java interface
whose methods are meant to be called from a remote client running in a different JVM.

It has four special requirements:

- It must extend the marker `java.rmi.Remote` interface.
- All methods in a **remote interface** must throw a `RemoteException` or an exception,
  which is its superclass such as `IOException` or `Exception`.
  The `RemoteException` is a checked exception.
  A remote method can also throw any number of other application-specific exceptions.
- A remote method may accept the reference of a **remote object** as a parameter.
  It may also return the reference of a **remote object** as its return value.
  If a method in a remote interface accepts or returns a remote object reference,
  the parameter or return type must be declared of the type `Remote`
  rather than of the type of the class that implements the `Remote` interface.
- A remote interface may only use **three data types** in its method's parameters or return value.
  It could be a **primitive type**, a **remote object**, or **a serializable non-remote object**.
  A remote object is passed by reference,
  whereas a non-remote serializable object is passed by copy.
  An object is serializable if its class implements the `java.io.Serializable` interface.

```java
package lsieun.rmi.common;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.time.ZonedDateTime;

public interface RemoteUtility extends Remote {
    // Echoes a string message back to the client
    String echo(String msg) throws RemoteException;

    // Returns the current date and time to the client
    ZonedDateTime getServerTime() throws RemoteException;

    // Adds two integers and returns the result to the client
    int add(int n1, int n2) throws RemoteException;
}
```

### Implementing the Remote Interface

If you define methods in this class other than those defined in the remote interface,
those methods are not available for remote method invocations.

```java
package lsieun.rmi.server;

import lsieun.rmi.common.RemoteUtility;

import java.time.ZonedDateTime;

public class RemoteUtilityImpl implements RemoteUtility {
    public RemoteUtilityImpl() {
    }

    @Override
    public String echo(String msg) {
        return msg;
    }

    @Override
    public ZonedDateTime getServerTime() {
        return ZonedDateTime.now();
    }

    @Override
    public int add(int n1, int n2) {
        return n1 + n2;
    }
}
```

Note that these methods in the `RemoteUtilityImpl` class do not declare that they throw a `RemoteException`.
The requirement to declare that all remote methods throw a `RemoteException` is for the remote interface,
not the class implementing the **remote interface**.

There are two ways to write your implementation class for a **remote interface**.
One way is to inherit it from the `java.rmi.server.UnicastRemoteObject` class.
Another way is to inherit it from no class or any class other than the `UnicastRemoteObject` class.

What difference does it make if the implementation class for a **remote interface**
inherits from the `UnicastRemoteObject` class or some other class?
The implementation class of a remote interface is used to create **remote objects**
whose methods are invoked remotely.
The object of this class must go through an **export** process,
which makes it suitable for a remote method invocation.

The constructors for the `UnicastRemoteObject` class export the object automatically for you.
So, if your implementation class inherits from the `UnicastRemoteObject` class,
it will save you one step in the entire process later.

Sometimes, your implementation class must inherit from another class,
and that will force you not to inherit it from the `UnicastRemoteObject` class.

One thing you need to note is that the constructors for the `UnicastRemoteObject` class throw a `RemoteException`.
If you inherit the remote object implementation class from the `UnicastRemoteObject` class,
the implementation class's constructor must throw a `RemoteException` in its declaration.

There are two new things in this implementation—it uses the `extends` clause in the class declaration,
and it uses a `throws` clause in the constructor declaration. Everything else remains the same.

```java
package lsieun.rmi.server;

import lsieun.rmi.common.RemoteUtility;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.time.ZonedDateTime;

public class RemoteUtilityImpl extends UnicastRemoteObject implements RemoteUtility {
    // Must throw the RemoteException
    public RemoteUtilityImpl() throws RemoteException {
    }

    @Override
    public String echo(String msg) {
        return msg;
    }

    @Override
    public ZonedDateTime getServerTime() {
        return ZonedDateTime.now();
    }

    @Override
    public int add(int n1, int n2) {
        return n1 + n2;
    }
}
```

### Writing the RMI Server Program

The responsibility of a server program is to create the **remote object** and
make it accessible to remote clients.

A server program performs the following things:

- Installs the **security manager**
- Creates and exports the **remote object**
- Registers the **remote object** with the RMI registry application

You need to make sure that the server code is running under a **security manager**.
An RMI program cannot download Java classes from remote locations
if it is not running with a **security manager**.
Without a **security manager**, it can only use local Java classes.
In both RMI servers and RMI clients, programs may need to download class files from remote locations.
You will look at examples of downloading Java classes from remote locations shortly.
When you run a Java program under a **security manager**,
you must also control access to the privileged resources through a Java policy file.
The following snippet of code shows how to install a security manager
if it is not already installed.
You can use an object of the `java.lang.SecurityManager` class or
`java.rmi.RMISecurityManager` class to install a security manager.

```text
SecurityManager secManager = System.getSecurityManager();
if (secManager == null) {
    System.setSecurityManager(new SecurityManager());
}
```

A **security manager** controls the access to privileged resources through a **policy file**.
You will need to set appropriate permissions to access the resources used in a Java RMI application.
For this example, you will give all permissions to all code.
However, you should use a properly controlled policy file in a production environment.
The entry that you need to make in the policy file to grant all permissions is as follows:

```text
grant {
    permission java.security.AllPermission;
};
```

Typically, a Java policy file resides in the user's home directory on a computer,
and it is named `.java.policy`. Note that the file name starts with a dot.

The next step the RMI server program performs is to create an object of the class
that implements the remote interface, which will serve as a remote object.
In your case, you will create an object of the `RemoteUtilityImpl` class:

```text
RemoteUtilityImpl remoteUtility = new RemoteUtilityImpl();
```

You need to export the remote object, so remote clients can invoke its remote methods.
If your remote object class (`RemoteUtility` class in this case) inherits from the `UnicastRemoteObject` class,
you do not need to export it.
It is exported automatically when you create it.
If your remote object's class does not inherit from the `UnicastRemoteObject` class,
you need to export it explicitly using one of the `exportObject()` static methods of the `UnicastRemoteObject` class.
When you export a remote object, you can specify a **port number** where it can listen for a remote method invocation.
By default, it listens at port 0, which is an anonymous port.
The following statement exports a remote object:

```text
int port = 0;
RemoteUtility remoteUtilityStub = (RemoteUtility) UnicastRemoteObject.exportObject(remoteUtility, port);
```

The `exportObject()` method returns the reference of the exported remote object,
which is also called a **stub** or a remote reference.
You need to keep the reference of the stub, so you can register it with an RMI registry.

The final step that the server program performs is to register (or bind) the remote object reference with an RMI registry using a name.
An RMI registry is a separate application that provides a name service.
To register a remote reference with an RMI registry, you must first locate it.

An RMI registry runs on a machine at a specific port.
By default, it runs on port `1099`.
Once you locate the registry, you need to call its `bind()` method to bind the remote reference.
You can also use its `rebind()` method, which will replace an old binding if it already exists for the specified name.
The `name` used is a `String`.
You will use the name `MyRemoteUtility` as the name for your remote reference.
It is better to follow a naming convention for binding a reference object in the RMI registry to avoid name collisions.

```text
Registry registry = LocateRegistry.getRegistry("localhost", 1099);
String name = "MyRemoteUtility";
registry.rebind(name, remoteUtilityStub);
```

```java
package lsieun.rmi.server;

import lsieun.rmi.common.RemoteUtility;

import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.UnicastRemoteObject;

public class RemoteServer {
    public static void main(String[] args) {
        SecurityManager secManager = System.getSecurityManager();
        if (secManager == null) {
            System.setSecurityManager(new SecurityManager());
        }

        try {
            RemoteUtilityImpl remoteUtility = new RemoteUtilityImpl();
            // Export the object as a remote object
            int port = 0; // An anonymous port
            RemoteUtility remoteUtilityStub = (RemoteUtility) UnicastRemoteObject.exportObject(remoteUtility, port);

            // Locate the registry
            Registry registry = LocateRegistry.getRegistry("localhost", 1099);

            // Bind the exported remote reference in the registry
            String name = "MyRemoteUtility";
            registry.rebind(name, remoteUtilityStub);
            System.out.println("Remote server is ready...");
        } catch (RemoteException e) {
            e.printStackTrace();
        }
    }
}
```

For **security reasons**, you can bind a remote reference to an RMI registry
only from the RMI server program that is running on the same machine as the RMI registry.
Otherwise, a hacker may be able to bind any arbitrary and potentially harmful remote references to your RMI registry.

By default, the `getRegistry()` static method of the `LocateRegistry` class returns a stub for a registry
that runs on the same machine at port `1099`.
You may just use the following code to locate a registry in the server program:

```text
// Get a registry stub for a local machine at port 1099
Registry registry = LocateRegistry.getRegistry();
```

Note that the call to the `LocateRegistry.getRegistry()` method does not try to connect to a registry application.
It just returns a stub for the registry.
It is the subsequent call on this stub, `bind()`, `rebind()`, or any other method call
that attempts to connect to the registry application.

### Writing the RMI Client Program

Typically, the RMI client program performs the following:

- It makes sure that it is running under a security manager.
- It locates the registry where the remote reference has been bound by the server.
- It performs the lookup in the registry using the `lookup()` method of the `Registry` interface.
- It calls methods on the remote reference (or **stub**).

## Running the RMI Application

You need to start all programs involved in an RMI application in the following specific sequence:

- Run the RMI registry.
- Run the RMI server program.
- Run the RMI client program.

Your server and client programs use **security managers**.
You must have your Java policy file properly configured before you can run the RMI application successfully.
You can grant all security permissions to an RMI application for learning purposes.
You can do so by creating a text file named `rmi.policy` (you can use any other file name you want)
and entering the following content, which grants all permissions to all code:

```text
grant {
    permission java.security.AllPermission;
};
```

When you run the RMI client or server program,
you need to set the `rmi.policy` file as your Java security policy file using the `java.security.policy` JVM option.
It is assumed that you have saved the `rmi.policy` file in the `C:\mypolicy` folder on Windows:

```text
java -Djava.security.policy=^
file:///C:/mypolicy/rmi.policy <other-options>
```

This approach of setting a Java policy file has a temporary effect.
It should be used only for learning purposes.
You will need to set a fine-grained security in a production environment.

```java
package lsieun.rmi.client;

import lsieun.rmi.common.RemoteUtility;

import java.rmi.NotBoundException;
import java.rmi.RemoteException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class RemoteClient {
    public static void main(String[] args) {
        SecurityManager secManager = System.getSecurityManager();
        if (secManager == null) {
            System.setSecurityManager(new SecurityManager());
        }

        try {
            // Locate the registry
            Registry registry = LocateRegistry.getRegistry("localhost", 1099);

            String name = "MyRemoteUtility";
            RemoteUtility remoteUtilStub = (RemoteUtility) registry.lookup(name);

            // Call the echo() method
            String reply = remoteUtilStub.echo("Hello from the RMI client.");
            System.out.println("Reply: " + reply);
        } catch (RemoteException | NotBoundException e) {
            e.printStackTrace();
        }
    }
}
```

### Running the RMI Registry

The RMI registry application is supplied with the JDK/JRE installation.
It is copied in the `bin` subfolder of the respective installation main folder.
On the Windows platform, it is the `rmiregistry.exe` executable file.
You can run the RMI registry by starting the `rmiregistry` application using a command prompt.
It accepts a port number on which it will run.
By default, it runs on port `1099`.
The following command starts it at port `1099` using a command prompt on Windows:

```text
C:\java9\bin> rmiregistry
```

The following command starts the RMI registry at port `8967`:

```text
C:\java9\bin> rmiregistry 8967
```

The `rmiregistry` application does not print any startup message on the prompt.
Usually, it is started as a background process.

Most likely, the command is not going to work on your machine.
Using this command, you will be able to start the `rmiregistry` successfully.
However, you will get `ClassNotFoundException` when you run the RMI server application in the next section.
The `rmiregistry` application needs access to some of the classes (the registered ones)
used in the RMI server application.
There are three ways to make the classes available to `rmiregistry`:

- Set the `CLASSPATH` appropriately.
- Set the `java.rmi.server.codebase` JVM property to the URL that contains the classes needed by the `rmiregistry`.
- Set the JVM property named `java.rmi.server.useCodebaseOnly` to `false`.
  This property is set to `true` by default.
  If this property is set to `false`, the `rmiregistry` can download the needed class files from the server.

The following command adds the JARs containing the server classes and common interfaces to the `CLASSPATH`,
before starting the `rmiregistry`:

```text
C:\java9\bin> SET CLASSPATH=^
C:\Java9APIsAndModules\dist\jdojo.rmi.common.jar;^
C:\Java9APIsAndModules\dist\jdojo.rmi.server.jar
C:\java9\bin> rmiregistry
```

Instead of setting the `CLASSPATH` to make classes available to the `rmiregistry`,
you can also set the `java.rmi.server.codebase` JVM property that is a space-separated list of URLs, as shown:

```text
C:\java9\bin> rmiregistry ^
-J-Djava.rmi.server.codebase=^
file:///C:/Java9APIsAndModules/dist/jdojo.rmi.common.jar ^
file:///C:/Java9APIsAndModules/dist/jdojo.rmi.server.jar
```

The following command resets the `CLASSPATH` and
sets the `java.rmi.server.useCodebaseOnly` property for the JVM to `false`
so the `rmiregistry` will download any class files needed from the RMI server.
Your example will work using this command:

```text
C:\java9\bin> SET CLASSPATH=
C:\java9\bin> rmiregistry ^
-J-Djava.rmi.server.useCodebaseOnly=false
```

在Windows操作系统下：

```text
SET CLASSPATH=D:\git-repo\learn-java-rmi\target\classes
rmiregistry 
```

### Running the RMI Server

```text
java -cp ./target/classes/ -Djava.security.policy=file:///D:/git-repo/learn-java-rmi/rmi.policy lsieun.rmi.server.RemoteServer
java -cp ./target/classes/ -Djava.security.policy=D:/git-repo/learn-java-rmi/rmi.policy lsieun.rmi.server.RemoteServer

java -cp ./target/classes/ -Djava.security.policy=file:///D:/git-repo/learn-java-rmi/rmi.policy lsieun.rmi.client.RemoteClient
java -cp ./target/classes/ -Djava.security.policy=D:/git-repo/learn-java-rmi/rmi.policy lsieun.rmi.client.RemoteClient
```



