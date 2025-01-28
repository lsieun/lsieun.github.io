---
title: "Spring Boot Web"
sequence: "102"
---

要解决的问题：

- 导入静态资源
- 首页
- JSP、模板引擎
- 装配扩展Spring MVC
- 增删改查
- 拦截器
- 国际化

## 静态资源

在Spring Boot中，使用以下方式处理静态资源：

- webjars: `localhost:8080/webjars/`
- public, static, `/**`, resources: `localhost:8080/` 

优先级：resource > static（默认） > public

```java
public class WebMvcAutoConfiguration {
    public static class WebMvcAutoConfigurationAdapter implements WebMvcConfigurer, ServletContextAware {
        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {
            if (!this.resourceProperties.isAddMappings()) {
                logger.debug("Default resource handling disabled");
                return;
            }
            addResourceHandler(registry, "/webjars/**", "classpath:/META-INF/resources/webjars/");
            addResourceHandler(registry, this.mvcProperties.getStaticPathPattern(), (registration) -> {
                registration.addResourceLocations(this.resourceProperties.getStaticLocations());
                if (this.servletContext != null) {
                    ServletContextResource resource = new ServletContextResource(this.servletContext, SERVLET_LOCATION);
                    registration.addResourceLocations(resource);
                }
            });
        }
    }
}
```

## 首页和图标定制

```java
public class WebMvcAutoConfiguration {
    public static class EnableWebMvcConfiguration extends DelegatingWebMvcConfiguration implements ResourceLoaderAware {
        @Bean
        public WelcomePageHandlerMapping welcomePageHandlerMapping(ApplicationContext applicationContext,
                                                                   FormattingConversionService mvcConversionService,
                                                                   ResourceUrlProvider mvcResourceUrlProvider) {
            WelcomePageHandlerMapping welcomePageHandlerMapping = new WelcomePageHandlerMapping(
                    new TemplateAvailabilityProviders(applicationContext), applicationContext, getWelcomePage(),
                    this.mvcProperties.getStaticPathPattern());
            welcomePageHandlerMapping.setInterceptors(getInterceptors(mvcConversionService, mvcResourceUrlProvider));
            welcomePageHandlerMapping.setCorsConfigurations(getCorsConfigurations());
            return welcomePageHandlerMapping;
        }
    }
}
```

## Thymeleaf

- 引入依赖
- Thymeleaf语法

## 扩展Spring MVC

如何写自己的starter？因为Spring Boot提供了许多starter，我们自己该怎样写一个starter呢？

