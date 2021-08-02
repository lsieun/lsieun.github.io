---
title:  "Hexagonal Architecture"
sequence: "102"
---

## Intro

- Alias: Ports And Adapters Architecture
- Author: [Alistar Cockburn](https://heartofagile.com/alistair-cockburn/)
- Date: 2005

The hexagonal architecture principle was created by [Alistair Cockburn](https://heartofagile.com/alistair-cockburn/) in 2005. It is also known as **Ports and Adapters Architecture**.

### Name

The hexagon concept isn't related to a six side architecture nor does it have anything to do with the geometrical form. A hexagon has six sides indeed, but the idea is to illustrate concept of many ports.

## Layered Architecture

我们知道，Layered Architecture是将软件系统分成不同的层（layer），最常使用的就是三层架构。

三层架构就是把软件系统中各个功能模块划分为表现层、业务逻辑层和数据访问层：

{:refdef: style="text-align: center;"}
![三层架构](/assets/images/architecture/three-layer-architecture.png)
{: refdef}

在Layered Architecture当中，不同层（layer）之间的“沟通”（调用关系）只能向下进行：表现层能调用业务逻辑层，业务逻辑层不能调用表现层；业务逻辑层能够调用数据访问层，数据访问层不能调用业务逻辑层。另外，不同层（layer）之间不能跨层调用，例如表现层不能直接调用数据访问层。

## Alistar的思考

Alistar Cockburn认为，在分层架构（Layered Architecture）中，随着时间的推移，软件系统会出现这样的问题：业务逻辑（business logic）会逐渐渗透（或入侵）到表现层(presentation layer)和数据访问层(data access layer)。

> One of the great bugaboos of software applications over the years has been **infiltration of business logic into the user interface code**. [Link][alistair-cockburn-hexagonal-architecture]

在软件系统刚开始的时候，我们都希望：业务逻辑（business logic）只会出现在业务逻辑层（business logic layer），不会与表现层(presentation layer)和数据访问层(data access layer)的代码出现耦合。但是，分层架构（Layered Architecture）当中缺少这样一个检测机制，就是检测业务逻辑（business logic）有没有超越业务逻辑层（business logic layer）的范围。经过长时间的开发，或许几年，或许几个月，业务逻辑的代码就会逐步渗透到表现层(presentation layer)和数据访问层(data access layer)。

{:refdef: style="text-align: center;"}
![三层架构](/assets/images/architecture/three-layer-architecture-core.png)
{: refdef}

Alistar Cockburn开始思考，是不是可以换一种不同的思考方式来理解软件系统的架构呢？在这种新的思考方式下，他将软件架构理解成“内部”（inside或core）和“外部”（outside）两个部分：

{:refdef: style="text-align: center;"}
![六边形架构](/assets/images/architecture/hexagonal-architecture-core-inside-outside.png)
{: refdef}

所谓的“内部”（inside或core）就是指业务逻辑（business logic），其它的部分都是“外部”（outside）。

{:refdef: style="text-align: center;"}
![六边形架构](/assets/images/architecture/hexagonal-architecture-core-ui-database.png)
{: refdef}

在Alistar Cockburn看来，表现层(presentation layer)和数据访问层(data access layer)两者没有什么区别，都是属于“外部”（outside）。

那么，这样一种思考方式，能够解决业务逻辑（business logic）会逐渐渗透到其它部分的问题吗？能。它是怎么做到的呢？这种思考方式，其实就是给予业务逻辑（business logic）一个非常重要的地位，它是处于核心（core）的位置。在编写代码的时候，我们要首先问自己：这段代码是否属于业务逻辑（business logic）？如果是，就要放到“内部”（inside或core）；如果不是，就要放到“外部”（outside）。

接下来，一个重要的问题就是“内部”（inside或core）和“外部”（outside）之间如何进行通信的呢？

## Ports And Adapters Architecture

其实，六边形架构（Hexagonal Architecture）是一个不太准确的名字，它准确的名字应该是Ports And Adapters Architecture。

### Transformer

在这种架构中，如果“内部”（inside或core）和“外部”（outside）进行通信，那么“外部”（outside）传入的数据必须转换成“内部”（inside或core）可以理解的方式，“内部”（inside或core）发出的数据必须转换成“外部”（outside）可以理解的方式。这种转换就是transformer：

{:refdef: style="text-align: center;"}
![六边形架构](/assets/images/architecture/hexagonal-architecture-core-transformer.png)
{: refdef}

例如，我们的web client使用HTTP协议，而“内部”（inside或core）应用则使用Java语言来实现，当web client向“内部”（inside或core）应用发送信息的时候，transformer就需要将HTTP转换成对Java语言的调用；当“内部”（inside或core）应用向web client发送信息的时候，transformer就需要将Java语言的数据转换成HTTP格式的数据。

因此，我们可以说transformer是实现“内部”（inside或core）和“外部”（outside）进行通信的关键。但是，transformer是一个抽象的描述；从具体的实现来说，它是由ports和adapters来组成的。

### Ports And Adapters

为了方便理解，我们可以联系生活中电脑的USB端口（port），任何兼容的适配器（adapter，例如闪存卡、充电器）都可以连接到USB端口（port）上。

{:refdef: style="text-align: center;"}
![电脑上的USB接口](/assets/images/architecture/usb-port-and-compatible-adapter.jpeg)
{: refdef}

在这个架构中，port是属于“内部”（inside或core）的，而adapter是属于“外部”（outside）的：

{:refdef: style="text-align: center;"}
![六边形架构](/assets/images/architecture/hexagonal-architecture-core-port-adapter.png)
{: refdef}

什么是port呢？port就是“内部”（inside或core）定义的与具体技术无关的协议（a technology-independent protocol）。在具体编程语言中，port以“接口”的形式存在。

什么是adapter呢？adapter就是符合port规定的协议，并使用某种具体技术来进行实现。同时，之所以取名为adapter就是它符合GOF的adapter模式。

- 假如outside是一个web client，那么adapter就是一个Controller，这个adapter可以将HTTP请求转换成Java语言进行调用，也可以将Java数据转换成HTTP数据进行输出。
- 假如outside是一个command line程序，那么这个adapter就可以将具体的命令行转换成Java语言进行调用，也可以将Java语言的数据转换成命令行的输出信息。

{:refdef: style="text-align: center;"}
![六边形架构](/assets/images/architecture/hexagonal-architecture-core-four-adapters.png)
{: refdef}

正是由于port和adapter的存在，“内部”（inside或core）不需要再去考虑“外部”（outside）使用的具体技术，只需要专注的处理自己的业务逻辑（business logic）就可以了。

> The application is blissfully ignorant of the nature of the input device.  [Link][alistair-cockburn-hexagonal-architecture]

所以，我们的软件系统也可以被描述成：“内部”（inside或core）是通过各种接口与“外部”（outside）进行沟通的。

> Our system can also be described as a Core surrounded with interfaces to the outside world. [Link][madewithlove-hexagonal-architecture]

### Driving and Driven

我们可以将ports（adapters）分成两组：driving ports(adapters)和driven ports(adapters)。

{:refdef: style="text-align: center;"}
![六边形架构](/assets/images/architecture/hexagonal-architecture-core-driving-driven.png)
{: refdef}

> The way we make this distinction is based on communication with the Core. In the case of driving ports, they are the ones that are initiating the communication with our core (driving the behavior of our application), while in the case of driven ports it is our Core that initiates the communication with them.  [Link][madewithlove-hexagonal-architecture]

## Intent

Allow an application

- to equally be driven by users, programs, automated test or batch scripts, and
- to be developed and tested in isolation from its eventual run-time devices and databases.

As events arrive from the outside world at a port, a technology-specific adapter converts it into a usable procedure call or message and passes it to the application.
The application is blissfully ignorant of the nature of the input device.
When the application has something to send out, it sends it out through a port to an adapter, which creates the appropriate signals needed by the receiving technology.
The application has a semantically sound interaction with the adapters on all sides of it, without actually knowing the nature of the things on the other side of the adapters.

## Motivation

One of the great bugaboos of software applications over the years has been infiltration of business logic into the user interface code. The problem this causes is threefold:

### Goal

The main goal of this architecture is to avoid knows structural pitfalls in software design. Such as the pollution of UI code with business logic or undesired dependencies between layers.[medium.com]()

## Main Content

### inside and outside

From an even broader concept we want to differentiate the concepts of **inside** and **outside**.
**Inside** is the business logic and the application itself and **outside** is whatever we are using to connect and interact with the application.

### Components

## similarities

According to Martin Fowler, the hexagonal architecture has the benefit of using similarities between presentation layer and data source layer to create symmetric components made of a core surrounded by interfaces, but with the drawback of hiding the inherent asymmetry between a service provider and a service consumer that would better be represented as layers.[Wiki: Hexagonal architecture]()

#### ports

Ports represent the boundaries of the application. Frequently they are implemented as **interfaces** to be used by outside parties. Their implementation resides outside the application, although they share the same domain.

#### driving ports and driven ports

However there is also a certain **asymmetry** to it, as well. What that means is that we can divide our **ports** into two groups: **driving ports** and **driven ports**.

**The way we make this distinction is based on communication with the Core**. In the case of **driving ports**, they are the ones that are initiating the communication with our core (driving the behavior of our application), while in the case of **driven ports** it is our Core that initiates the communication with them.

**Primary ports** are also known as **driving ports**. They are also known as **Inbound Ports**. These ports “drive” the application.

**Secondary ports** are in contrast known as **driven ports**. The application “drives” the port in order to get data. Because the application sends data to the outside, secondary ports also get called **Outbound Ports**.

- Primary ports / driving ports / Inbound Ports
- Secondary ports / driven ports / Outbound Ports

### adapters

The **adapters** form the outer layer of the hexagonal architecture. They are not part of the **core** but interact with it.

An input adapter could be a web interface, for instance. When a user clicks a button in a browser, the web adapter calls a certain input port to call the corresponding use case.

## Benefits

## Code Examples

### The Inside

#### Domain Object

```java
package com.lsieun.hexagonal.inside.domain;

public class User {
    private final int id;
    private final String name;

    public User(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return String.format("User {id=%d, name='%s'}", id, name);
    }
}
```

#### Ports

##### Inbound Ports

```java
package com.lsieun.hexagonal.inside.port.inbound;

import com.lsieun.hexagonal.inside.domain.User;

import java.util.List;

public interface UserServicePort {
    boolean addUser(String name);

    List<User> getUsers();
}
```

##### Outbound Ports

```java
package com.lsieun.hexagonal.inside.port.outbound;

import com.lsieun.hexagonal.inside.domain.User;

import java.util.List;

public interface UserDaoPort {
    void addUser(User user);

    List<User> getList();
}
```

#### Business Logic

```java
package com.lsieun.hexagonal.inside.business;

import com.lsieun.hexagonal.inside.domain.User;
import com.lsieun.hexagonal.inside.port.inbound.UserServicePort;
import com.lsieun.hexagonal.inside.port.outbound.UserDaoPort;

import java.util.List;

public class UserServiceImpl implements UserServicePort {
    private final UserDaoPort userDao;

    public UserServiceImpl(UserDaoPort userDao) {
        this.userDao = userDao;
    }

    @Override
    public boolean addUser(String name) {
        if (name == null || "".equals(name)) return false;

        List<User> userList = userDao.getList();
        for (User user : userList) {
            if (name.equals(user.getName())) {
                return false;
            }
        }

        int maxUserId = 0;
        for (User user : userList) {
            if (user.getId() > maxUserId) {
                maxUserId = user.getId();
            }
        }

        int newUserId = maxUserId + 1;
        User newUser = new User(newUserId, name);
        userDao.addUser(newUser);
        return true;
    }

    @Override
    public List<User> getUsers() {
        return userDao.getList();
    }
}
```

### The Outside

#### Console Client

driving adapter

```java
package com.lsieun.hexagonal.outside.driving.console;

import com.lsieun.hexagonal.inside.domain.User;
import com.lsieun.hexagonal.inside.port.inbound.UserServicePort;

import java.util.Formatter;
import java.util.List;

public class UserServiceAdapter {
    private final UserServicePort userService;

    public UserServiceAdapter(UserServicePort userService) {
        this.userService = userService;
    }

    public String process(String commandLine) {
        if (commandLine == null || "".equals(commandLine)) {
            return "invalid command line";
        }

        if ("list".equalsIgnoreCase(commandLine)) {
            List<User> userList = userService.getUsers();
            StringBuilder sb = new StringBuilder();
            Formatter fm = new Formatter(sb);
            fm.format("User List:%n");
            for (User user : userList) {
                fm.format("- %s%n", user);
            }
            return sb.toString();
        }

        String[] array = commandLine.split(" ");
        if (array.length == 2 && "add".equals(array[0])) {
            String name = array[1];
            boolean flag = userService.addUser(name);
            return flag ? "add user success" : "add user failed";
        }

        return "command line is not supported";
    }
}
```

```java
package com.lsieun.hexagonal.outside.driving.console;

import java.util.Formatter;
import java.util.Scanner;

public class ConsoleApp {
    private final UserServiceAdapter adapter;

    public ConsoleApp(UserServiceAdapter adapter) {
        this.adapter = adapter;
    }

    public void run() {
        printUsage();
        Scanner in = new Scanner(System.in);
        while (true) {
            System.out.print("> ");
            String line = in.nextLine();
            if ("help".equalsIgnoreCase(line)) {
                printUsage();
            }
            else if ("quit".equalsIgnoreCase(line)) {
                break;
            }
            else {
                String response = adapter.process(line);
                System.out.println(response);
            }
        }
    }

    public static void printUsage() {
        StringBuilder sb = new StringBuilder();
        Formatter fm = new Formatter(sb);
        fm.format("Welcome to our User Service Console%n");
        fm.format("Usage:%n");
        fm.format("- add <username>: add new user%n");
        fm.format("- help: print usage%n");
        fm.format("- list: list all users%n");
        fm.format("- quit: exit user service%n");
        System.out.println(sb);
    }
}
```

#### Mock Database

Driven Adapter

```java
package com.lsieun.hexagonal.outside.driven.mockdb;

import com.lsieun.hexagonal.inside.domain.User;
import com.lsieun.hexagonal.inside.port.outbound.UserDaoPort;

import java.util.List;

public class UserDaoAdapter implements UserDaoPort {
    @Override
    public void addUser(User user) {
        MockRepository.saveUser(user);
    }

    @Override
    public List<User> getList() {
        return MockRepository.getUserList();
    }
}
```

```java
package com.lsieun.hexagonal.outside.driven.mockdb;

import com.lsieun.hexagonal.inside.domain.User;

import java.util.ArrayList;
import java.util.List;

public class MockRepository {
    private static final List<User> userList = new ArrayList<>();

    static {
        User user1 = new User(1, "Lucy");
        User user2 = new User(2, "Lily");
        User user3 = new User(3, "Tom");

        userList.add(user1);
        userList.add(user2);
        userList.add(user3);
    }

    public static void saveUser(User user) {
        userList.add(user);
    }

    public static List<User> getUserList() {
        return userList;
    }
}
```

### Run

```java
package com.lsieun.hexagonal.run;

import com.lsieun.hexagonal.inside.business.UserServiceImpl;
import com.lsieun.hexagonal.inside.port.inbound.UserServicePort;
import com.lsieun.hexagonal.inside.port.outbound.UserDaoPort;
import com.lsieun.hexagonal.outside.driven.mockdb.UserDaoAdapter;
import com.lsieun.hexagonal.outside.driving.console.ConsoleApp;
import com.lsieun.hexagonal.outside.driving.console.UserServiceAdapter;

public class ConsoleWithMockRepository {
    public static void main(String[] args) {
        UserDaoPort userDao = new UserDaoAdapter();
        UserServicePort userService = new UserServiceImpl(userDao);
        UserServiceAdapter adapter = new UserServiceAdapter(userService);

        ConsoleApp app = new ConsoleApp(adapter);
        app.run();
    }
}
```

## References

- [alistair.cockburn.us: Hexagonal architecture](https://alistair.cockburn.us/hexagonal-architecture/)，这是原文，不过并不好理解
- [wiki.c2.com: Hexagonal Architecture](https://wiki.c2.com/?HexagonalArchitecture)
- [wiki.c2.com: Ports And Adapters Architecture](https://wiki.c2.com/?PortsAndAdaptersArchitecture)
- [madewithlove.com: Hexagonal Architecture demystified](https://madewithlove.com/blog/software-engineering/hexagonal-architecture-demystified/)，这是对Hexagonal architecture进行解读，写的很不错。只是讲理论，没有代码。
- [reflectoring.io: Hexagonal Architecture with Java and Spring](https://reflectoring.io/spring-hexagonal/)，我觉得，这个文章也不错，它提到Domain Objects、Use Cases、Input and Output Ports、Adapters。有代码，是关于从一个账户向另一个账户发送钱的例子。
- [medium.com: Hexagonal Architecture in Java](https://medium.com/swlh/hexagonal-architecture-in-java-b980bfc07366)
- [Hexagonal Architecture in Java](https://dzone.com/articles/hexagonal-architecture-in-java)

[alistair-cockburn-hexagonal-architecture]: https://alistair.cockburn.us/hexagonal-architecture/
[madewithlove-hexagonal-architecture]: https://madewithlove.com/blog/software-engineering/hexagonal-architecture-demystified/
