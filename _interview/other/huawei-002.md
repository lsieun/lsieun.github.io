


- D1-D5 分别对应华为 13-17 级，参考范围 10-40K

华为 OD 岗的薪资（OD 的 D1-D5 分别对应华为的 13-17 级）

- 13 级中位数在 9k-13k，
- 14 级中位数在 13k-17k，
- 15 级中位数在 17k-21k，
- 16 级中位数在 21k-25k，
- 17 级中位数在 25k-29k


## Java 基础

- [ ] Java 中的常用集合类有哪些？它们的使用方法和适用场景是什么？
- [ ] 什么是线程？什么是多线程？它们在 Java 中的应用是什么？
- [ ] 简单说说面向对象的特征以及六大原则
- [ ] 谈谈 final、finally、finalize 的区别
- [ ] Java 中 ==、equals 与 hashCode 的区别和联系
- [ ] 谈谈 Java 容器 ArrayList、LinkedList、·HashMap、HashSet 的理解，以及应用场景
- [ ] 谈谈线程的基本状态，其中的 wait() sleep() yield()方法的区别。
- [ ] JVM 性能调优的监控工具了解那些？
- [ ] 简单谈谈 JVM 内存模型，以及 volatile 关键字
- [ ] 垃圾收集器与内存分配策略
- [ ] 垃圾收集算法
- [ ] MySQL 几种常用的存储引擎区别
- [ ] 数据库的隔离级别
- [ ] 算法：5 亿整数的大文件，怎么排？
- [ ] Java 内存模型
- [ ] full gc 怎么触发
- [ ] gc 算法
- [ ] JVM 回收策略
- [ ] ClassLoader 原理和应用
- [ ] 高吞吐量的话用哪种 gc 算法
- [ ] ConcurrentHashMap 和 HashMap
- [ ] volatile 的底层如何实现，怎么就能保住可见性了？
- [ ] 有参与过开源的项目吗？
- [ ] 线程池原理，拒绝策略，核心线程数
- [ ] 1 亿个手机号码，判断重复
- [ ] 线程之间的交互方式有哪些？有没有线程交互的封装类


1.（Java 基础题 110 道）

2.（MySQL 连环问 92 道）

3.（Spring 面试题 71 道）

4.（Redis 连环问 61 道）

5.（Java 并发编程 146 道）

6.（JVM 合集 40 道）

7.（Zookeeper 面试题 14 道）

8.（一线大厂面试题 45 道）

一面：（面试均是华为的开发，每轮面试完都有反问你想了解的）
修饰符和可见性
抽象类抽象方法
synchronized，volatile
一些 java 类型相关的基础知识，比如 springbuilder 和 springbuffer 哪个线程安全
为什么要使用 spring（就是问优点吧）
spring 的依赖注入
spring 加载顺序

二面：

进程和线程的基础知识，使用场景
jvm 调优你平时使用什么工具
jsonobject,jsonarry
消息系统使用的是什么（akka），大概描述一下它的传递过程
登陆鉴权的实现（我回答的是登陆接口返回一个 jwt token，前端缓存 token，除登陆请求外的所有请求在 header 里带上 token，后端通过拦截器验证 token 进行放行至方法或者 401）
针对 5 的前端的 token 你觉得存在哪里的（我回答我司前端是 electron，应该是在浏览器缓存里的），后端的 token 你们怎么保存的（mysql）
父类静态变量，成员变量，构造器的初始化顺序
三面：
平时项目中使用到的注解和作用 Service Entity 巴拉巴拉说了一些
设计模式
spring 的注入方式
spring cloud 有使用吗（我简历上没有写，我直说了项目初期用过并且很快替换了，所以不了解）
类在 jvm 的加载顺序，用到了哪些空间
spring 的 aop 和 ioc，会深聊一下作用的实现
spring 的事务
高频考点及面试真题整理
一.数据库（29 道）
1 . 请简洁描述 MySQL 中 InnoDB 支持的四种事务隔离级别名称，以及逐级之间的区别？

SQL 标准定义的四个隔离级别为：

read uncommited ：读到未提交数据

read committed：脏读，不可重复读

repeatable read：可重读

serializable ：串行事物

2. 在 MySQL 中 ENUM 的用法是什么？

ENUM 是一个字符串对象，用于指定一组预定义的值，并可在创建表时使用。

SQL 语法如下：

Create table size (name ENUM ( ' Smail , ' Medium ' , ' Large ' ) ;

3. CHAR 和 VARCHAR 的区别？

CHAR 和 VARCHAR 类型在存储和检索方面有所不同。

CHAR 列长度固定为创建表时声明的长度，长度值范围是 1 到 255。

当 CHAR 值被存储时，它们被用空格填充到特定长度，检索 CHAR 值时需删除尾随 空格。

4. 列的字符串类型可以是什么？

字符串类型是：

SET

BLOB

ENUM

CHAR

TEXT

VARCHAR

5. MySQL 中使用什么存储引擎？

存储引擎称为表类型，数据使用各种技术存储在文件中。

技术涉及：

Storage mechanism

Locking levels

Indexing

Capabilities and functions.

二.Java 基础（34 道）
1 .面向对象和面向过程的区别
面向过程

优点： 性能比面向对象高，因为类调用时需要实例化，开销比较大，比较消耗 资源 ; 比如单片机、嵌入式开发、 Linux/Unix 等一般采用面向过程开发，性能是 最重要的因素。

缺点： 没有面向对象易维护、易复用、易扩展

面向对象

优点： 易维护、易复用、易扩展，由于面向对象有封装、继承、多态性的特 性，可以设计出低耦合的系统，使系统更加灵活、更加易于维护

缺点： 性能比面向过程低

2. Java 语言有哪些特点
   1 . 简单易学；

2. 面向对象（封装，继承，多态）；

3. 平台无关性（ Java 虚拟机实现平台无关性）；

4. 可靠性；

5. 安全性；

6. 支持多线程（ C+ + 语言没有内置的多线程机制，因此必须调用操作系 统的多线程功能来进行多线程程序设计，而 Java 语言却提供了多线程 支持）；

7. 支持网络编程并且很方便（ Java 语言诞生本身就是为简化网络编程设 计的，因此 Java 语言不仅支持网络编程而且很方便）；

8. 编译与解释并存；

3. 关于 JVM JDK 和 JRE 最详细通俗的解答
   JVM

Java 虚拟机（JVM）是运行 Java 字节码的虚拟机。 JVM 有针对不同系统的特 定实现（Windows， Linux， macOS），目的是使用相同的字节码，它们都会给 出相同的结果。

什么是字节码 ? 采用字节码的好处是什么 ?

在 Java 中， JVM 可以理解的代码就叫做字节码（即扩展名为 . class 的文 件），它不面向任何特定的处理器，只面向虚拟机。 Java 语言通过字节码的方 式，在一定程度上解决了传统解释型语言执行效率低的问题，同时又保留了解 释型语言可移植的特点。所以 Java 程序运行时比较高效，而且，由于字节码 并不专对一种特定的机器，因此， Java 程序无须重新编译便可在多种不同的计 算机上运行。

Java 程序从源代码到运行一般有下面 3 步：

我们需要格外注意的是 .class->机器码 这一步。在这一步 jvm 类加载器首先 加载字节码文件，然后通过解释器逐行解释执行，这种方式的执行速度会相对 比较慢。而且，有些方法和代码块是经常需要被调用的，也就是所谓的热点代 码，所以后面引进了 JIT 编译器， JIT 属于运行时编译。当 JIT 编译器完成第 一次编译后，其会将字节码对应的机器码保存下来，下次可以直接使用。而我 们知道，机器码的运行效率肯定是高于 Java 解释器的。这也解释了我们为什 么经常会说 Java 是编译与解释共存的语言。

HotSpot 采用了惰性评估(Lazy Evaluation)的做法，根据二八定律，消耗大部分 系统资源的只有那一小部分的代码（热点代码），而这也就是 JIT 所需要编译 的部分。 JVM 会根据代码每次被执行的情况收集信息并相应地做出一些优化， 因此执行的次数越多，它的速度就越快。 JDK 9 引入了一种新的编译模式

AOT(Ahead of Time Compilation)，它是直接将字节码编译成机器码，这样就 避免了 JIT 预热等各方面的开销。 JDK 支持分层编译和 AOT 协作使用。但是 ，

AOT 编译器的编译质量是肯定比不上 JIT 编译器的。

总结： Java 虚拟机（JVM）是运行 Java 字节码的虚拟机。 JVM 有针对不同系 统的特定实现（Windows， Linux， macOS），目的是使用相同的字节码，它们 都会给出相同的结果。字节码和不同系统的 JVM 实现是 Java 语言“一次编 译，随处可以运行”的关键所在。

三.MySQL（55 道）
1、一张表，里面有 ID 自增主键，当 insert 了 17 条记录之后，删除了第 15,16,17 条记录， 再把 Mysql 重启，再 insert 一条记录，这条记录的 ID 是 18 还是 15 ？

(1)如果表的类型是 MyISAM，那么是 18 ，因为 MyISAM 表会把自增主键的最大 ID 记录到数据文件里，重启 MySQL 自增主键的最大 ID 也不会丢失

（2）如果表的类型是 InnoDB，那么是 15 InnoDB 表只是把自增主键的最大 ID 记录到内存中，所以重启数据库或者是对表进行 OPTIMIZE 操作，都会导致最大 ID 丢失

2、 Mysql 的技术特点是什么？

Mysql 数据库软件是一个客户端或服务器系统，其中包括：支持各种客户端程序和库的多 线程 SQL 服务器、不同的后端、广泛的应用程序编程接口和管理工具。

3、 Heap 表是什么？

HEAP 表存在于内存中，用于临时高速存储。 BLOB 或 TEXT 字段是不允许的 ，只能使用比较运算符 =， <， >， =>， = < HEAP 表不支持 AUTO_INCREMENT ，索引不可为 NULL

4、 Mysql 服务器默认端口是什么？

Mysql 服务器的默认端口是 3306。

5、与 Oracle 相比， Mysql 有什么优势？

Mysql 是开源软件，随时可用，无需付费。 Mysql 是便携式的 ，带有命令提示符的 GUI。 使用 Mysql 查询浏览器支持管理 。

6、如何区分 FLOAT 和 DOUBLE？

以下是 FLOAT 和 DOUBLE 的区别：

浮点数以 8 位精度存储在 FLOAT 中，并且有四个字节。

浮点数存储在 DOUBLE 中，精度为 18 位，有八个字节。

MyBatis（36 道）
1、什么是 MyBatis？

答： MyBatis 是一个可以自定义 SQL、存储过程和高级映射的持久层框架。

2、讲下 MyBatis 的缓存

答： MyBatis 的缓存分为一级缓存和二级缓存,一级缓存放在 session 里面,默认就有,二级缓存 放在它的命名空间里,默认是不打开的,使用二级缓存属性类需要实现 Serializable 序列化接口 (可用来保存对象的状态),可在它的映射文件中配置

3、 Mybatis 是如何进行分页的？分页插件的原理是什么？

答： 1）Mybatis 使用 RowBounds 对象进行分页，也可以直接编写 sql 实现分页，也可以使用 Mybatis 的分页插件。

2）分页插件的原理：实现 Mybatis 提供的接口，实现自定义插件，在插件的拦截方法内拦 截待执行的 sql，然后重写 sql。 举例： select * from student，拦截 sql 后重写为： select t.* from （select * from student） t limit 0， 10

4、简述 Mybatis 的插件运行原理，以及如何编写一个插件？

答： 1） Mybatis 仅可以编写针对 ParameterHandler、 ResultSetHandler、 StatementHandler、 Executor 这 4 种接口的插件， Mybatis 通过动态代理，为需要拦截的接口生成代理对象以实现接口方 法拦截功能，每当执行这 4 种接口对象的方法时，就会进入拦截方法，具体就是 InvocationHandler 的 invoke()方法，当然，只会拦截那些你指定需要拦截的方法。

2）实现 Mybatis 的 Interceptor 接口并复写 intercept()方法，然后在给插件编写注解，指定要 拦截哪

Linux（23 道）
1) Linux 中主要有哪几种内核锁 ?

Linux 的同步机制从 2.0 到 2.6 以来不断发展完善。从最初的原子操作,到后来的信号量,从 大内核锁到今天的自旋锁。这些同步机制的发展伴随 Linux 从单处理器到对称多处理器的 过渡 ;

伴随着从非抢占内核到抢占内核的过度。 Linux 的锁机制越来越有效,也越来越复杂。

Linux 的内核锁主要是自旋锁和信号量。

自旋锁最多只能被一个可执行线程持有,如果一个执行线程试图请求一个已被争用(已经被 持有)的自旋锁,那么这个线程就会一直进行忙循环——旋转——等待锁重新可用。要是锁 未被争用 ,请求它的执行线程便能立刻得到它并且继续进行。自旋锁可以在任何时刻防止多 于一个的执行线程同时进入临界区。

Linux 中的信号量是一种睡眠锁。如果有一个任务试图获得一个已被持有的信号量时,信号 量会将其推入等待队列,然后让其睡眠。这时处理器获得自由去执行其它代码。当持有信号 量的进程将信号量释放后,在等待队列中的一个任务将被唤醒,从而便可以获得这个信号 量。

信号量的睡眠特性,使得信号量适用于锁会被长时间持有的情况 ; 只能在进程上下文中使用 ,

因为中断上下文中是不能被调度的 ; 另外当代码持有信号量时,不可以再持有自旋锁。

Linux 内核中的同步机制:原子操作、信号量、读写信号量和自旋锁的 API,另外一些同步机 制,包括大内核锁、读写锁、大读者锁、 RCU (Read-Copy Update,顾名思义就是读 - 拷贝修 改),和顺序锁。

2) Linux 中的用户模式和内核模式是什么含意 ?

MS-DOS 等操作系统在单一的 CPU 模式下运行,但是一些类 Unix 的操作系统则使用了双 模式,可以有效地实现时间共享。在 Linux 机器上,CPU 要么处于受信任的内核模式,要么处 于受限制的用户模式。除了内核本身处于内核模式以外,所有的用户进程都运行在用户模式 之中。

内核模式的代码可以无限制地访问所有处理器指令集以及全部内存和 I/O 空间。如果用户 模式的进程要享有此特权,它必须通过系统调用向设备驱动程序或其他内核模式的代码发出 请求。另外,用户模式的代码允许发生缺页,而内核模式的代码则不允许。

在 2.4 和更早的内核中,仅仅用户模式的进程可以被上下文切换出局,由其他进程抢占。除非 发生以下两种情况,否则内核模式代码可以一直独占 CPU:

(1 ) 它自愿放弃 CPU;

(2) 发生中断或异常。

2.6 内核引入了内核抢占,大多数内核模式的代码也可以被抢占。

3) 怎样申请大块内核内存 ?

在 Linux 内核环境下,申请大块内存的成功率随着系统运行时间的增加而减少,虽然可以通过

vmalloc 系列调用申请物理不连续但虚拟地址连续的内存,但毕竟其使用效率不高且在 32 位 系统上 vmalloc 的内存地址空间有限。所以,一般的建议是在系统启动阶段申请大块内存,但 是其成功的概率也只是比较高而已,而不是 1 00%。如果程序真的比较在意这个申请的成功 与否,只能退用“启动内存”(Boot Memory)。下面就是申请并导出启动内存的一段示例代码:

void* x_bootmem = NULL;

EXPORT_SYMBOL(x_bootmem);

unsigned long x_bootmem_size = 0;

EXPORT_SYMBOL(x_bootmem_size);

static int __init x_bootmem_setup(char *str)

{

x_bootmem_size = memparse(str, &str);

x_bootmem = alloc_bootmem(x_bootmem_size);

printk(“Reserved %lu bytes from %p for x\n”, x_bootmem_size, x_bootmem);

return 1 ;

}

__setup(“x-bootmem=”, x_bootmem_setup);

可见其应用还是比较简单的,不过利弊总是共生的,它不可避免也有其自身的限制:

内存申请代码只能连接进内核,不能在模块中使用。

被申请的内存不会被页分配器和 slab 分配器所使用和统计,也就是说它处于系统的可见内 存之外,即使在将来的某个地方你释放了它。

一般用户只会申请一大块内存,如果需要在其上实现复杂的内存管理则需要自己实现。

在不允许内存分配失败的场合,通过启动内存预留内存空间将是我们唯一的选择。

篇幅有限，就不在这里全部展示了，需要完整版本的小伙伴，点击传送门即可！

总结
面试体验还是蛮好的，面试官都很和蔼，技术面问的都很基础（简单），手撕代码应该蛮重要的，同学简单题没写出来直接挂了。主管面会对着你的回答往下深究，面完主管面感觉很多问题都答的不太好。应该把自己手里面经上的题都事先多刷几遍的，不过庆幸的是最终斩获了华为 offer，我应该算是比较幸运的人吧！

然后下面是小编为准备华为面试前自己刷过很多次的面试题，希望可以给还在求职跳槽的程序员朋友带来帮助。
