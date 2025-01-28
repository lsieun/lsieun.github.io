---
title: "CORS跨域问题"
sequence: "102"
---

## Global Filter

```java
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CorsFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        response.setHeader("Access-Control-Max-Age", "3600");
        response.setHeader("Access-Control-Allow-Headers", "*");

        chain.doFilter(req, res);

    }

    @Override
    public void destroy() {

    }
}
```

## Global Configuration

In addition to fine-grained, controller method level configuration,
you probably want to define some global CORS configuration, too.
You can set URL-based `CorsConfiguration` mappings individually on any HandlerMapping.

Most applications, however, use the MVC Java configuration or the MVC XML namespace to do that.

By default, global configuration enables the following:

- All origins.
- All headers.
- `GET`, `HEAD`, and `POST` methods.

`allowCredentials` is not enabled by default,
since that establishes a trust level that exposes sensitive user-specific information
(such as cookies and CSRF tokens) and should only be used where appropriate.
When it is enabled either `allowOrigins` must be set to one or more specific domain
(but not the special value "*") or
alternatively the `allowOriginPatterns` property may be used to match to a dynamic set of origins.

`maxAge` is set to 30 minutes.

### Java Configuration

To enable CORS in the MVC Java config, we can use the `CorsRegistry` callback, as the following example shows:

```java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/**")
            .allowedOrigins("https://domain2.com")
            .allowedMethods("PUT", "DELETE")
            .allowedHeaders("header1", "header2", "header3")
            .exposedHeaders("header1", "header2")
            .allowCredentials(true).maxAge(3600);

        // Add more mappings...
    }
}
```

```java
package lsieun.boot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println("hello registry");
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowCredentials(true)
                .allowedMethods("DELETE", "GET", "OPTIONS", "PATCH", "POST", "PUT")
                .maxAge(3600);
    }
}
```

### XML Configuration

## CORS Filter

You can apply CORS support through the built-in `CorsFilter`.

To configure the filter, pass a `CorsConfigurationSource` to its constructor, as the following example shows:

```text
CorsConfiguration config = new CorsConfiguration();

// Possibly...
// config.applyPermitDefaultValues()

config.setAllowCredentials(true);
config.addAllowedOrigin("https://domain1.com");
config.addAllowedHeader("*");
config.addAllowedMethod("*");

UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
source.registerCorsConfiguration("/**", config);

CorsFilter filter = new CorsFilter(source);
```

## Reference

mozilla:

- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

Spring:

- [CORS](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc-cors)


- [【springboot解决跨域问题】 Access-Control-Allow-Origin](https://blog.csdn.net/sgd985437/article/details/124345385)
