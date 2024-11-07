---
title: "Tomcat"
sequence: "107"
---

在 Spring Boot 中，支持 Tomcat、Jetty 和 Undertow 作为底层容器；
一旦引入 `spring-boot-starter-web` 模块，就默认使用 Tomcat 容器。

关注解决的问题：

- [ ] 如何将 Tomcat 替换为 Jetty 或 Undertow？
- [ ] Spring Boot 是如何启动内置 Tomcat 的？
- [ ] Spring Boot 为什么可以响应请求，它是如何配置 Spring MVC 的呢？

## Servlet 容器的使用

### 默认 Servlet 容器

在 `spring-boot-starter-web` 这个 Starter 中有什么呢？

```xml

<dependencies>
    <!-- ... -->

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-tomcat</artifactId>
    </dependency>

    <!-- ... -->

    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
    </dependency>
</dependencies>
```

核心就是引入了 tomcat 和 spring-webmvc 的依赖。

### 切换 Servlet 容器

如果想切换其它 Servlet 容器，只需要如下两步：

第 1 步，将 tomcat 依赖移除掉：

```xml

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <!-- 移除 tomcat -->
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

第 2 步，引入其它 Servlet 容器依赖：

```xml
<!-- 引入 jetty -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```

```xml
<!-- 引入 undertow -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-undertow</artifactId>
</dependency>
```

## Spring Boot 启动内置 Tomcat 流程

### 从 @SpringBootApplication 开始

第 1 步，进入 Spring Boot 启动类，点击 `@SpringBootApplication` 查看源码：

```java

@SpringBootApplication
public class DemoApplication {
    // ...
}
```

```java

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)

@SpringBootConfiguration    // 标明该类为配置类
@EnableAutoConfiguration    // 启动自动配置功能（关注点）
@ComponentScan(excludeFilters = {
        @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
        @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class)
})    // 注解扫描
public @interface SpringBootApplication {
    // ...
}
```

```java

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)

@AutoConfigurationPackage    // 自动配置包
@Import(AutoConfigurationImportSelector.class)    // 关注点
public @interface EnableAutoConfiguration {
    // ...
}
```

```java
public class AutoConfigurationImportSelector implements DeferredImportSelector,
        BeanClassLoaderAware, ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {

    protected AutoConfigurationEntry getAutoConfigurationEntry(AutoConfigurationMetadata autoConfigurationMetadata,
                                                               AnnotationMetadata annotationMetadata) {
        // ...

        // 第 1 步，通过 SpringFactoriesLoader 提供的方法加载类路径中 META-INF/spring.factories 文件中
        // 针对 EnableAutoConfiguration 的注册配置类
        List<String> configurations = getCandidateConfigurations(annotationMetadata, attributes);
    }
}
```

```text
# Auto Configure
org.springframework.boot.autoconfigure.EnableAutoConfiguration=\
...
org.springframework.boot.autoconfigure.web.servlet.ServletWebServerFactoryAutoConfiguration,\
...
```

`ServletWebServerFactoryAutoConfiguration` 就是对 Tomcat 进行自动配置的配置类：

```java

@Configuration(proxyBeanMethods = false)
@AutoConfigureOrder(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnClass(ServletRequest.class)                 // classpath 上有 ServletRequest 类
@ConditionalOnWebApplication(type = Type.SERVLET)         // 是 SERVLET 环境
@EnableConfigurationProperties(ServerProperties.class)    //
@Import({
        ServletWebServerFactoryAutoConfiguration.BeanPostProcessorsRegistrar.class,
        ServletWebServerFactoryConfiguration.EmbeddedTomcat.class,
        ServletWebServerFactoryConfiguration.EmbeddedJetty.class,
        ServletWebServerFactoryConfiguration.EmbeddedUndertow.class
})
public class ServletWebServerFactoryAutoConfiguration {

}
```

```java

@ConfigurationProperties(prefix = "server", ignoreUnknownFields = true)
public class ServerProperties {
    private Integer port;

    // ...
}
```

```java

@Configuration(proxyBeanMethods = false)
class ServletWebServerFactoryConfiguration {

    @Configuration(proxyBeanMethods = false)
    @ConditionalOnClass({Servlet.class, Tomcat.class, UpgradeProtocol.class})
    @ConditionalOnMissingBean(value = ServletWebServerFactory.class, search = SearchStrategy.CURRENT)
    static class EmbeddedTomcat {

        // step 1.
        @Bean
        TomcatServletWebServerFactory tomcatServletWebServerFactory(
                ObjectProvider<TomcatConnectorCustomizer> connectorCustomizers,
                ObjectProvider<TomcatContextCustomizer> contextCustomizers,
                ObjectProvider<TomcatProtocolHandlerCustomizer<?>> protocolHandlerCustomizers) {
            // step 2.
            TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
            factory.getTomcatConnectorCustomizers()
                    .addAll(connectorCustomizers.orderedStream().collect(Collectors.toList()));
            factory.getTomcatContextCustomizers()
                    .addAll(contextCustomizers.orderedStream().collect(Collectors.toList()));
            factory.getTomcatProtocolHandlerCustomizers()
                    .addAll(protocolHandlerCustomizers.orderedStream().collect(Collectors.toList()));
            return factory;
        }

    }


    @Configuration(proxyBeanMethods = false)
    @ConditionalOnClass({Servlet.class, Server.class, Loader.class, WebAppContext.class})
    @ConditionalOnMissingBean(value = ServletWebServerFactory.class, search = SearchStrategy.CURRENT)
    static class EmbeddedJetty {

        @Bean
        JettyServletWebServerFactory JettyServletWebServerFactory(
                ObjectProvider<JettyServerCustomizer> serverCustomizers) {
            JettyServletWebServerFactory factory = new JettyServletWebServerFactory();
            factory.getServerCustomizers().addAll(serverCustomizers.orderedStream().collect(Collectors.toList()));
            return factory;
        }

    }


    @Configuration(proxyBeanMethods = false)
    @ConditionalOnClass({Servlet.class, Undertow.class, SslClientAuthMode.class})
    @ConditionalOnMissingBean(value = ServletWebServerFactory.class, search = SearchStrategy.CURRENT)
    static class EmbeddedUndertow {

        @Bean
        UndertowServletWebServerFactory undertowServletWebServerFactory(
                ObjectProvider<UndertowDeploymentInfoCustomizer> deploymentInfoCustomizers,
                ObjectProvider<UndertowBuilderCustomizer> builderCustomizers) {
            UndertowServletWebServerFactory factory = new UndertowServletWebServerFactory();
            factory.getDeploymentInfoCustomizers()
                    .addAll(deploymentInfoCustomizers.orderedStream().collect(Collectors.toList()));
            factory.getBuilderCustomizers().addAll(builderCustomizers.orderedStream().collect(Collectors.toList()));
            return factory;
        }

    }
}
```

```java
public class TomcatServletWebServerFactory extends AbstractServletWebServerFactory
        implements ConfigurableTomcatWebServerFactory, ResourceLoaderAware {

    public TomcatServletWebServerFactory() {
    }

    // step 1.
    @Override
    public WebServer getWebServer(ServletContextInitializer... initializers) {
        if (this.disableMBeanRegistry) {
            Registry.disableRegistry();
        }
        // 实例化一个 Tomcat
        Tomcat tomcat = new Tomcat();
        File baseDir = (this.baseDirectory != null) ? this.baseDirectory : createTempDir("tomcat");
        // 设置 Tomcat 的工作临时目录
        tomcat.setBaseDir(baseDir.getAbsolutePath());
        // 默认使用 Http11NioProtocol 实例化 Connector
        Connector connector = new Connector(this.protocol);
        connector.setThrowOnFailure(true);
        // 给 Service 添加 Connector
        tomcat.getService().addConnector(connector);
        customizeConnector(connector);
        tomcat.setConnector(connector);
        // 关闭热部署
        tomcat.getHost().setAutoDeploy(false);
        // 配置 Engine
        configureEngine(tomcat.getEngine());
        for (Connector additionalConnector : this.additionalTomcatConnectors) {
            tomcat.getService().addConnector(additionalConnector);
        }
        prepareContext(tomcat.getHost(), initializers);

        // 启动 Tomcat
        // 实例化 TomcatWebServer 时，会将 DispatcherServlet 以及一些 Filter 添加到 Tomcat 中

        // step 2.
        return getTomcatWebServer(tomcat);
    }

    // step 2.
    protected TomcatWebServer getTomcatWebServer(Tomcat tomcat) {
        // step 3.
        return new TomcatWebServer(tomcat, getPort() >= 0);
    }
}
```

```java
public class TomcatWebServer implements WebServer {
    // step 1.
    public TomcatWebServer(Tomcat tomcat, boolean autoStart) {
        Assert.notNull(tomcat, "Tomcat Server must not be null");
        this.tomcat = tomcat;
        this.autoStart = autoStart;

        // step 2. Tomcat 启动
        initialize();
    }

    // step 2.
    private void initialize() throws WebServerException {
        logger.info("Tomcat initialized with port(s): " + getPortsDescription(false));
        synchronized (this.monitor) {
            try {
                addInstanceIdToEngineName();

                Context context = findContext();
                context.addLifecycleListener((event) -> {
                    if (context.equals(event.getSource()) && Lifecycle.START_EVENT.equals(event.getType())) {
                        // Remove service connectors so that protocol binding doesn't
                        // happen when the service is started.
                        removeServiceConnectors();
                    }
                });

                // step 3. Tomcat 启动
                // Start the server to trigger initialization listeners
                this.tomcat.start();

                // We can re-throw failure exception directly in the main thread
                rethrowDeferredStartupExceptions();

                try {
                    ContextBindings.bindClassLoader(context, context.getNamingToken(), getClass().getClassLoader());
                } catch (NamingException ex) {
                    // Naming is not enabled. Continue
                }

                // Unlike Jetty, all Tomcat threads are daemon threads. We create a
                // blocking non-daemon to stop immediate shutdown
                startDaemonAwaitThread();
            } catch (Exception ex) {
                stopSilently();
                destroySilently();
                throw new WebServerException("Unable to start embedded Tomcat", ex);
            }
        }
    }
}
```

### 启动类开始

```text
- AbstractApplicationContext
    - refresh()
        - onRefresh()
            - createWebServer()
                - tomcat.start()       # tomcat
        - finishRefresh()
            - startWebServer()
                - webServer.start()    # web server 是一个较大的概念，它包括 tomcat、jetty、netty 等。
```

```java
/**
 * Simple interface that represents a fully configured web server (for example Tomcat, Jetty, Netty).
 */
public interface WebServer {
    void start() throws WebServerException;
    void stop() throws WebServerException;
    int getPort();
}
```

第 1 步，在启动中有代码：

```text
SpringApplication.run(DemoApplication.class, args);
```

第 2 步，找到 `SpringApplication` 中的 `ConfigurableApplicationContext run(String... args)` 方法：

```java
public class SpringApplication {
    public ConfigurableApplicationContext run(String... args) {
        // StopWatch 用来统计 Spring Boot 启动使用的时间
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        // ConfigurableApplicationContext Spring 的上下文
        ConfigurableApplicationContext context = null;
        Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList<>();
        configureHeadlessProperty();

        // 第 1 步，获取并启动监听器
        // 通过加载 META-INF/spring.factories 完成 SpringApplicationRunListener 实例化工作
        SpringApplicationRunListeners listeners = getRunListeners(args);
        // 发布“容器开始启动”事件
        // 实际上是调用了 EventPublishingRunListener 类的 starting() 方法
        listeners.starting();

        try {
            ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);

            // 第 2 步，构造容器环境。
            // 简而言之，就是加载 OS层面的环境变量、JVM层面的属性、main方法的args、application.properties 配置文件
            ConfigurableEnvironment environment = prepareEnvironment(listeners, applicationArguments);
            // 设置需要忽略的 Bean
            configureIgnoreBeanInfo(environment);
            // 打印 banner
            Banner printedBanner = printBanner(environment);

            // 第 3 步，实例化 ApplicationContext：创建 IoC 容器
            context = createApplicationContext();

            // 实例化 SpringBootExceptionReporter.class，用来支持报告关于启动的错误
            exceptionReporters = getSpringFactoriesInstances(
                    SpringBootExceptionReporter.class,
                    new Class[]{ConfigurableApplicationContext.class},
                    context
            );

            // 第 4 步，刷新应用上下文前的准备阶段。
            // 1. 完成属性的设置：为 context 的 environment 赋值；为 beanFactory 的 conversionService 赋值
            // 2. 调用 ApplicationContextInitializer
            // 3. 完成一些 Bean 对象的创建。一个关键的操作：将启动类注入容器，为后续开启自动化配置奠定基础。
            prepareContext(context, environment, listeners, applicationArguments, printedBanner);

            // 第 5 步，刷新应用上下文。Spring Boot 相关的工作已经结束，接下来的工作交给 Spring。
            // 内部调用 Spring 的 refresh 方法；refresh 方法在 Spring 整个源码体系中举足轻重，是实现 IoC 和 AOP 的关键。
            // 1. 处理 @ComponentScan
            // 2. 处理 @EnableAutoConfiguration
            // 3. 启动 Tomcat
            refreshContext(context);

            // 第 6 步，刷新应用上下文的扩展接口。设计模式中的模板方法，默认为空实现。
            // 如果有自定义需求，可以重写该方法，比如打印些启动结束日志，或者一些其它后置处理。
            afterRefresh(context, applicationArguments);

            // 时间记录停止
            stopWatch.stop();
            if (this.logStartupInfo) {
                new StartupInfoLogger(this.mainApplicationClass).logStarted(getApplicationLog(), stopWatch);
            }

            // 发布“容器启动完成”事件
            listeners.started(context);

            // 遍历所有注册的 ApplicationRunner 和 CommandLineRunner，并执行其 run() 方法
            // 我们可以实现自己的 ApplicationRunner 或 CommandLineRunner，来对 Spring Boot 的启动过程进行扩展
            callRunners(context, applicationArguments);
        } catch (Throwable ex) {
            handleRunFailure(context, ex, exceptionReporters, listeners);
            throw new IllegalStateException(ex);
        }

        try {
            listeners.running(context);
        } catch (Throwable ex) {
            handleRunFailure(context, ex, exceptionReporters, null);
            throw new IllegalStateException(ex);
        }
        return context;
    }
}
```

这个方法大概做了以下几件事：

- 1、获取并启动监听器
- 2、构造容器环境
- 3、创建容器
- 4、准备容器
- 5、刷新容器
- 6、刷新容器后的扩展接口

内置 Tomcat 启动源码，就隐藏在上述第 5 步 `refreshContext` 方法里面，
该方法最终会调用 `AbstractApplicationContext.refresh()` 方法：

```java
public abstract class AbstractApplicationContext extends DefaultResourceLoader
        implements ConfigurableApplicationContext {

    @Override
    public void refresh() throws BeansException, IllegalStateException {
        synchronized (this.startupShutdownMonitor) {
            // Prepare this context for refreshing.
            prepareRefresh();

            // Tell the subclass to refresh the internal bean factory.
            ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

            // Prepare the bean factory for use in this context.
            prepareBeanFactory(beanFactory);

            try {
                // Allows post-processing of the bean factory in context subclasses.
                postProcessBeanFactory(beanFactory);

                // Invoke factory processors registered as beans in the context.
                invokeBeanFactoryPostProcessors(beanFactory);

                // Register bean processors that intercept bean creation.
                registerBeanPostProcessors(beanFactory);

                // Initialize message source for this context.
                initMessageSource();

                // Initialize event multicaster for this context.
                initApplicationEventMulticaster();

                // step 1. [Tomcat]
                // Initialize other special beans in specific context subclasses.
                onRefresh();

                // Check for listener beans and register them.
                registerListeners();

                // Instantiate all remaining (non-lazy-init) singletons.
                finishBeanFactoryInitialization(beanFactory);

                // step 2. [Tomcat]
                // Last step: publish corresponding event.
                finishRefresh();
            } catch (BeansException ex) {
                if (logger.isWarnEnabled()) {
                    logger.warn("Exception encountered during context initialization - " +
                            "cancelling refresh attempt: " + ex);
                }

                // Destroy already created singletons to avoid dangling resources.
                destroyBeans();

                // Reset 'active' flag.
                cancelRefresh(ex);

                // Propagate exception to caller.
                throw ex;
            } finally {
                // Reset common introspection caches in Spring's core, since we
                // might not ever need metadata for singleton beans anymore...
                resetCommonCaches();
            }
        }
    }

    // step 1.
    @Override
    protected void onRefresh() {
        super.onRefresh();
        try {
            // 启动 Tomcat
            createWebServer();
        } catch (Throwable ex) {
            throw new ApplicationContextException("Unable to start web server", ex);
        }
    }

    // step 2.
    @Override
    protected void finishRefresh() {
        super.finishRefresh();
        // 在 Tomcat 启动时，要完成 Servlet 的注册，检查 Connector 是否都启动完成，打印最终启动完成日志
        WebServer webServer = startWebServer();
        if (webServer != null) {
            publishEvent(new ServletWebServerInitializedEvent(webServer, this));
        }
    }
}
```

### onRefresh

`createWebServer()` 就是启动 Web 服务，但是还没有真正启动 Tomcat。

`WebServer` 是通过 `ServletWebServerFactory` 来获取的。

```java
public class ServletWebServerApplicationContext extends GenericWebApplicationContext
        implements ConfigurableWebServerApplicationContext {

    // step 1.
    @Override
    protected void onRefresh() {
        super.onRefresh();
        try {
            // step 2. 启动 Tomcat
            createWebServer();
        } catch (Throwable ex) {
            throw new ApplicationContextException("Unable to start web server", ex);
        }
    }

    // step 2.
    private void createWebServer() {
        WebServer webServer = this.webServer;
        ServletContext servletContext = getServletContext();
        if (webServer == null && servletContext == null) {
            // step 3.
            // 第 1 步，判断 Factory 类型：选择 Tomcat，还是Jetty，还是 Undertow？
            ServletWebServerFactory factory = getWebServerFactory();
            // 第 2 步，创建 Web Server 具体对象
            this.webServer = factory.getWebServer(getSelfInitializer());
        } else if (servletContext != null) {
            try {
                getSelfInitializer().onStartup(servletContext);
            } catch (ServletException ex) {
                throw new ApplicationContextException("Cannot initialize servlet context", ex);
            }
        }
        initPropertySources();
    }

    // step 3.
    protected ServletWebServerFactory getWebServerFactory() {
        // Use bean names so that we don't consider the hierarchy
        // 第 1 步，获取配置中 ServletWebServerFactory 的类有哪些？
        // 代码技巧：获取字符串的“表现形式”，不直接创建 Bean 对象；因为下面有判断，会抛出异常，如果抛出异常，创建 Bean 也是多余的操作
        // 断点调试：beanNames[0] = "tomcatServletWebServerFactory";
        String[] beanNames = getBeanFactory().getBeanNamesForType(ServletWebServerFactory.class);

        // 第 2 步，进行两个条件判断：不能为 0，也不能大于 1，那只能是 1；只能配置一个 ServletWebServerFactory
        // 条件判断一：不能为 0
        if (beanNames.length == 0) {
            throw new ApplicationContextException("Unable to start ServletWebServerApplicationContext due to missing "
                    + "ServletWebServerFactory bean.");
        }
        // 条件判断二：不能大于 1
        if (beanNames.length > 1) {
            throw new ApplicationContextException("Unable to start ServletWebServerApplicationContext due to multiple "
                    + "ServletWebServerFactory beans : " + StringUtils.arrayToCommaDelimitedString(beanNames));
        }

        // 第 3 步，创建 Bean
        return getBeanFactory().getBean(beanNames[0], ServletWebServerFactory.class);
    }
}
```

### finishRefresh

```java
public class ServletWebServerApplicationContext extends GenericWebApplicationContext
        implements ConfigurableWebServerApplicationContext {

    // step 1.
    @Override
    protected void finishRefresh() {
        super.finishRefresh();

        // step 2.
        WebServer webServer = startWebServer();
        if (webServer != null) {
            publishEvent(new ServletWebServerInitializedEvent(webServer, this));
        }
    }

    // step 2.
    private WebServer startWebServer() {
        WebServer webServer = this.webServer;
        if (webServer != null) {
            // step 3.
            webServer.start();
        }
        return webServer;
    }
}
```

```java
public class TomcatWebServer implements WebServer {

    // step 3.
    @Override
    public void start() throws WebServerException {
        synchronized (this.monitor) {
            if (this.started) {
                return;
            }
            try {
                addPreviouslyRemovedConnectors();
                Connector connector = this.tomcat.getConnector();
                if (connector != null && this.autoStart) {
                    // 在 Tomcat 启动时，注册（不需要延时加载的） Servlet
                    performDeferredLoadOnStartup();
                }

                // 检查 Connector 是否都启动
                checkThatConnectorsHaveStarted();
                this.started = true;

                // 打印最终启动完成日志
                // Tomcat started on port(s): 9999 (http) with context path ''
                logger.info("Tomcat started on port(s): " + getPortsDescription(true) + " with context path '"
                        + getContextPath() + "'");
            } catch (ConnectorStartFailedException ex) {
                stopSilently();
                throw ex;
            } catch (Exception ex) {
                PortInUseException.throwIfPortBindingException(ex, () -> this.tomcat.getConnector().getPort());
                throw new WebServerException("Unable to start embedded Tomcat server", ex);
            } finally {
                Context context = findContext();
                ContextBindings.unbindClassLoader(context, context.getNamingToken(), getClass().getClassLoader());
            }
        }
    }
}
```

### 小结

![](/assets/images/spring-boot/src/how-tomcat-is-created.png)

Spring Boot 的内部通过 `new Tomcat()` 的方式启动一个内置 Tomcat。
但是，这里还有一个问题，这里只是启动了 Tomcat，但是我们的 Spring MVC 是如何加载的呢？

## server.port 是如何生效的？

- [ ] 好像与 `BeanPostProcessor` 有关
- [ ] ServletWebServerFactoryAutoConfiguration

```java
public class WebServerFactoryCustomizerBeanPostProcessor implements BeanPostProcessor, BeanFactoryAware {

}
```