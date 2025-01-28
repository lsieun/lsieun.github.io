---
title: "六边形架构"
sequence: "102"
---

## Introduction

关于Hexagonal Architecture的基本信息如下：

- 名称：Hexagonal Architecture
- 别名: Ports And Adapters Architecture
- 作者: [Alistar Cockburn](https://heartofagile.com/alistair-cockburn/)
- 时间: 2005年
- 文章：[Hexagonal architecture][alistair-cockburn-hexagonal-architecture]

### 什么是Architecture

认知（Cognition），就是一种思考方式。换句话说，**认知（Cognition），就是运用人内在的逻辑思维（Logic）来理解外部的世界（World）**。认知（Cognition），在不同的知识领域当中，有不同的名字。例如，在科学当中，被人们所接受的认知（Cognition）被称为“理论”（Theory），尚有待于验证的认知（Cognition）被称为“假设”（Assumption）。

![思想者](/assets/images/manga/thinker.jpg)

什么是软件架构？**软件架构是一种特殊化的思考方式，或者说是一种特殊化的认知（Cognition）。这种思考方式，就是将复杂的事物拆分成几个简单的组成部分。** 这样，人们就能很容易的学习它，学会它之后，就可以使它帮助我们解决具体的问题。

**无论是Layered Architecture，还是Hexagonal Architecture，它们都代表了看待软件系统的某一种具体思考方式，其目的都是为了理解具体的软件系统。两者的区别就是它们选择思考的视角不同。** 就比如说，“横看成岭侧成峰，远近高低各不同”，山有它原本的样子，但所站的地方不同，那么看到的风景也不同。同样的道理，软件系统有它自己的样子，但是思考的角度不同，那么总结出来的软件模型可能也不同。

### Layered Architecture

首先，我们回答一下这样的问题：本文的主题是Hexagonal Architecture，为什么我们要来谈一下Layered Architecture呢？ 是因为Layered Architecture是一个很好的参照，通过这两个Architecture的对比，我们就能更好的去理解Hexagonal Architecture。

其次，我们来说一下Layered Architecture本质。**Layered Architecture本质就是一种思考方式，就是将软件系列划分成不同的层（layer），构成了一种“从上到下”的视角。**

接着，最常使用的Layered Architecture就是三层架构。三层架构就是把软件系统中各个功能模块划分为表现层、业务逻辑层和数据访问层：

![三层架构](/assets/images/architecture/three-layer-architecture.png)

在Layered Architecture当中，注意以下两点：

- 第一点，高内聚，低耦合。每一层（layer）都有自己不同的职责，不同层（layer）之间不能耦合在一起。
- 第二点，不同层（layer）之间有严格的调用关系。这体现在两个方面：
  - 一方面，不同层（layer）之间的“沟通”（调用关系）只能向下进行：表现层能调用业务逻辑层，业务逻辑层不能调用表现层；业务逻辑层能够调用数据访问层，数据访问层不能调用业务逻辑层。
  - 另一方面，不同层（layer）之间不能跨层调用，例如表现层不能直接调用数据访问层。

### Alistar的思考

Alistar Cockburn认为，在分层架构（Layered Architecture）中，随着时间的推移，软件系统会出现这样的问题：业务逻辑（business logic）会逐渐渗透（或入侵）到表现层(presentation layer)和数据访问层(data access layer)。

> One of the great bugaboos of software applications over the years has been **infiltration of business logic into the user interface code**. [Link][alistair-cockburn-hexagonal-architecture]

![三层架构](/assets/images/architecture/three-layer-architecture-core.png)

在软件系统刚开始的时候，我们都希望：业务逻辑（business logic）只会出现在业务逻辑层（business logic layer），不会与表现层(presentation layer)和数据访问层(data access layer)的代码出现耦合。但是，分层架构（Layered Architecture）当中缺少这样一个检测机制，就是检测业务逻辑（business logic）有没有超越业务逻辑层（business logic layer）的范围。经过长时间的开发，或许几年，或许几个月，业务逻辑的代码就会逐步渗透到表现层(presentation layer)和数据访问层(data access layer)。这样，不同层之间的代码就耦合到一起。

- 从实用主义者的角度来看，管那么多干什么，代码能够运行，功能能够实现就可以了！
- 从理想主义者的角度来看，不行，代码界的“正义”由“我”来维护！！

在2005年的时候，Alistar Cockburn提出了Hexagonal Architecture。后来，他也表示Layered Architecture是一种标准的、精确的描述软件系统的思考方式。他提出Hexagonal Architecture的目的，是为了提供另外一种思考方式来理解软件系统。同时，他也想解决业务逻辑（business logic）边界渐渐模糊的问题。

### Number Six

关于Hexagonal Architecture的名字，其中“hexagon”表示“六边形”，但是这个Hexagonal Architecture与几何图形六边形没有那种强烈的关联关系。在刚开始的时候，Alistar确实是使用了几何图形六边形来表示这种软件架构，因此用Hexagonal Architecture来命名；但后来，他发现Hexagonal Architecture并不是一个好的名字，更准确的名字应该是Ports And Adapters Architecture。

但是，在现实生活当中，Hexagonal Architecture这个名字更为广泛的被人们所知到；而Ports And Adapters Architecture这个名字就相对少很多。

## Hexagonal Architecture

从本质上来讲，Ports And Adapters Architecture就是一种思考方式，它是“从内到外”的视角来理解软件架构。

在这里，我们使用三个部分来介绍Ports And Adapters Architecture。

### What It Is

**在Ports And Adapters Architecture中，我们将软件架构理解成“内部”（inside或core）和“外部”（outside）两个部分**：

![六边形架构](/assets/images/architecture/hexagonal-architecture-core-inside-outside.png)

那么，什么是“内部”（inside或core）呢？什么是“外部”（outside）呢？简单来说，“内部”（inside或core），就是指业务逻辑（business logic），其它的部分都是“外部”（outside）。更具体来说，表现层(presentation layer)和数据访问层(data access layer)，都是属于“外部”（outside）；这两者的共同点就是都想与“内部”（inside或core）进行沟通，从这一点上来看，两者没有什么区别。在这里，我们着重强调两者的共同特点，而刻意忽略两者具体的技术差异。

![六边形架构](/assets/images/architecture/hexagonal-architecture-core-ui-database.png)

那么，这样一种思考方式，能够解决业务逻辑（business logic）会逐渐渗透到其它部分的问题吗？能。它是怎么做到的呢？这种“内－外”的思考视角（inside-outside view），其实就是给予业务逻辑（business logic）一个非常重要的地位，它是处于核心（core）的位置。在编写代码的时候，我们会首先问自己：这段代码是否属于业务逻辑（business logic）？如果是，就要放到“内部”（inside或core）；如果不是，就要放到“外部”（outside）。由此，我们可以看出，**这是一种大脑思考机制（mind thinking mechanism）在起作用。**

From an even broader concept we want to differentiate the concepts of **inside** and **outside**.
**Inside** is the business logic and the application itself and **outside** is whatever we are using to connect and interact with the application.

### How It Works

接下来，一个重要的问题:“内部”（inside或core）和“外部”（outside）之间如何进行通信的呢？

如果“内部”（inside或core）和“外部”（outside）进行通信，那么“外部”（outside）传入的数据必须转换成“内部”（inside或core）可以理解的数据格式，“内部”（inside或core）发出的数据必须转换成“外部”（outside）可以理解的数据格式。这种转换就是一层transformer：

![六边形架构](/assets/images/architecture/hexagonal-architecture-core-transformer.png)

举个例子，我们的web client使用HTTP协议，而“内部”（inside或core）业务逻辑则使用Java语言来实现。当web client向“内部”（inside或core）应用发送信息的时候，transformer就需要将HTTP格式的数据转换成对Java语言的调用；反过来，也是如何，也就是说，当“内部”（inside或core）应用向web client发送信息的时候，transformer就需要将Java语言的数据转换成HTTP格式的数据。

因此，我们可以说transformer是实现“内部”（inside或core）和“外部”（outside）进行通信的“桥梁”。但是，transformer仍然是一个比较抽象的描述；再具体一点来说，transformer是由ports和adapters来组成的。为了方便理解，我们可以联系生活中电脑的USB端口（port），任何兼容的适配器（adapter，例如闪存卡、充电器）都可以连接到USB端口（port）上。

![电脑上的USB接口](/assets/images/architecture/usb-port-and-compatible-adapter.jpeg)

在Hexagonal Architecture中，port是属于“内部”（inside或core）的，而adapter是属于“外部”（outside）的：

![六边形架构](/assets/images/architecture/hexagonal-architecture-core-port-adapter.png)

> **Ports represent the boundaries of the application**. Frequently they are implemented as **interfaces** to be used by outside parties. Their implementation resides outside the application, although they share the same domain.

什么是port呢？port就是“内部”（inside或core）定义的与具体技术无关的协议（a technology-independent protocol）。在具体编程语言中，port以“接口”的形式存在。

什么是adapter呢？adapter就是符合port规定的协议，并使用某种具体技术（technology-dependent）来进行实现。

- 假如outside是一个web client，那么adapter就是一个Controller，这个adapter可以将HTTP请求转换成Java语言进行调用，也可以将Java数据转换成HTTP数据进行输出。
- 假如outside是一个command line程序，那么这个adapter就可以将具体的命令行转换成Java语言进行调用，也可以将Java语言的数据转换成命令行的输出信息。

![六边形架构](/assets/images/architecture/hexagonal-architecture-core-four-adapters.png)

正是由于port和adapter的存在，“内部”（inside或core）不需要再去考虑“外部”（outside）使用的具体技术，只需要专注的处理自己的业务逻辑（business logic）就可以了。

> The application is blissfully ignorant of the nature of the input device.  [Link][alistair-cockburn-hexagonal-architecture]

所以，我们的软件系统也可以被描述成：“内部”（inside或core）是通过各种接口与“外部”（outside）进行沟通的。

> Our system can also be described as a Core surrounded with interfaces to the outside world. [Link][madewithlove-hexagonal-architecture]

As events arrive from the outside world at a port, a technology-specific adapter converts it into a usable procedure call or message and passes it to the application.
The application is blissfully ignorant of the nature of the input device.
When the application has something to send out, it sends it out through a port to an adapter, which creates the appropriate signals needed by the receiving technology.
The application has a semantically sound interaction with the adapters on all sides of it, without actually knowing the nature of the things on the other side of the adapters.



### Asymmetry

我们可以将ports（adapters）分成两组：driving ports(adapters)和driven ports(adapters)。

![六边形架构](/assets/images/architecture/hexagonal-architecture-core-driving-driven.png)

> The way we make this distinction is based on communication with the Core. In the case of driving ports, they are the ones that are initiating the communication with our core (driving the behavior of our application), while in the case of driven ports it is our Core that initiates the communication with them.  [Link][madewithlove-hexagonal-architecture]

According to Martin Fowler, the hexagonal architecture has the benefit of using similarities between presentation layer and data source layer to create symmetric components made of a core surrounded by interfaces, but with the drawback of hiding the inherent asymmetry between a service provider and a service consumer that would better be represented as layers.[Wiki: Hexagonal architecture]()

However there is also a certain **asymmetry** to it, as well. What that means is that we can divide our **ports** into two groups: **driving ports** and **driven ports**.

**The way we make this distinction is based on communication with the Core**. In the case of **driving ports**, they are the ones that are initiating the communication with our core (driving the behavior of our application), while in the case of **driven ports** it is our Core that initiates the communication with them.

**Primary ports** are also known as **driving ports**. They are also known as **Inbound Ports**. These ports “drive” the application.

**Secondary ports** are in contrast known as **driven ports**. The application “drives” the port in order to get data. Because the application sends data to the outside, secondary ports also get called **Outbound Ports**.

- Primary ports / driving ports / Inbound Ports
- Secondary ports / driven ports / Outbound Ports

The **adapters** form the outer layer of the hexagonal architecture. They are not part of the **core** but interact with it.

An input adapter could be a web interface, for instance. When a user clicks a button in a browser, the web adapter calls a certain input port to call the corresponding use case.

## Code Examples

### The Inside

#### Domain Object

```java
package lsieun.architecture.hexagonal.inside.domain;

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
package lsieun.architecture.hexagonal.inside.port.inbound;

import lsieun.architecture.hexagonal.inside.domain.User;

import java.util.List;

public interface UserServicePort {
    boolean addUser(String name);

    List<User> getUsers();
}
```

##### Outbound Ports

```java
package lsieun.architecture.hexagonal.inside.port.outbound;

import lsieun.architecture.hexagonal.inside.domain.User;

import java.util.List;

public interface UserDaoPort {
    void addUser(User user);

    List<User> getList();
}
```

#### Business Logic

```java
package lsieun.architecture.hexagonal.inside.business;

import lsieun.architecture.hexagonal.inside.domain.User;
import lsieun.architecture.hexagonal.inside.port.inbound.UserServicePort;
import lsieun.architecture.hexagonal.inside.port.outbound.UserDaoPort;

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
package lsieun.architecture.hexagonal.outside.driving.console;

import lsieun.architecture.hexagonal.inside.domain.User;
import lsieun.architecture.hexagonal.inside.port.inbound.UserServicePort;

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
package lsieun.architecture.hexagonal.outside.driving.console;

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
package lsieun.architecture.hexagonal.outside.driven.mockdb;

import lsieun.architecture.hexagonal.inside.domain.User;
import lsieun.architecture.hexagonal.inside.port.outbound.UserDaoPort;

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
package lsieun.architecture.hexagonal.outside.driven.mockdb;

import lsieun.architecture.hexagonal.inside.domain.User;

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
package lsieun.architecture.hexagonal.run;

import lsieun.architecture.hexagonal.inside.business.UserServiceImpl;
import lsieun.architecture.hexagonal.inside.port.inbound.UserServicePort;
import lsieun.architecture.hexagonal.inside.port.outbound.UserDaoPort;
import lsieun.architecture.hexagonal.outside.driven.mockdb.UserDaoAdapter;
import lsieun.architecture.hexagonal.outside.driving.console.ConsoleApp;
import lsieun.architecture.hexagonal.outside.driving.console.UserServiceAdapter;

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

原作者文章

- [alistair.cockburn.us: Hexagonal architecture][alistair-cockburn-hexagonal-architecture]，这是原文，不过并不好理解
- [wiki.c2.com: Hexagonal Architecture](https://wiki.c2.com/?HexagonalArchitecture)
- [wiki.c2.com: Ports And Adapters Architecture](https://wiki.c2.com/?PortsAndAdaptersArchitecture)

别人写的分析文章（无代码）

- [madewithlove.com: Hexagonal Architecture demystified][madewithlove-hexagonal-architecture]，这是对Hexagonal architecture进行解读，写的很不错。只是讲理论，没有代码。

别人写的文章（有代码）

- [reflectoring.io: Hexagonal Architecture with Java and Spring](https://reflectoring.io/spring-hexagonal/)，我觉得，这个文章也不错，它提到Domain Objects、Use Cases、Input and Output Ports、Adapters。有代码，是关于从一个账户向另一个账户发送钱的例子。
- [medium.com: Hexagonal Architecture in Java](https://medium.com/swlh/hexagonal-architecture-in-java-b980bfc07366)
- [Hexagonal Architecture in Java](https://dzone.com/articles/hexagonal-architecture-in-java)

[alistair-cockburn-hexagonal-architecture]: https://alistair.cockburn.us/hexagonal-architecture/
[madewithlove-hexagonal-architecture]: https://madewithlove.com/blog/software-engineering/hexagonal-architecture-demystified/
