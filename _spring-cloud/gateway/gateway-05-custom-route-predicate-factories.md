---
title: "自定义路由断言工厂"
sequence: "105"
---

## 自定义路由断言工厂

自定义路由断言工厂需要继承`AbstractRoutePredicateFactory`类，重写`apply`方法的逻辑。

在`apply`方法中，可以通过`exchange.getRequest()`拿到`ServletHttpRequest`对象，
从而可以获取到请求的参数、请求方式、请求头等信息。

要遵循四点：

- 1、必须是Spring的组件Bean。
- 2、类必须加上`RoutePredicateFactory`作为结尾。
- 3、必须继承`AbstractRoutePredicateFactory`。
- 4、必须声明静态内部类`Config`，声明属性来接收配置文件中对应的断言的信息。
- 5、需要结合`shortCutFieldOrder`进行绑定。
- 6、通过apply进行逻辑判断：`true`表示匹配成功，`false`表示匹配失败。

注意：命名需要以`RoutePredicateFactory`结尾。

```java
import org.springframework.cloud.gateway.handler.predicate.AbstractRoutePredicateFactory;
import org.springframework.cloud.gateway.handler.predicate.GatewayPredicate;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import java.util.Collections;
import java.util.List;
import java.util.function.Predicate;

@Component
public class CheckAuthRoutePredicateFactory extends AbstractRoutePredicateFactory<CheckAuthRoutePredicateFactory.Config> {

    public CheckAuthRoutePredicateFactory(Class<Config> configClass) {
        super(configClass);
    }

    @Override
    public Predicate<ServerWebExchange> apply(Config config) {
        return new GatewayPredicate() {
            @Override
            public boolean test(ServerWebExchange serverWebExchange) {
                System.out.println("调用CheckAuthRoutePredicateFactory: " + config.getName());
                if (config.getName().equals("fox")) {
                    return true;
                }
                return false;
            }
        };
    }

    /**
     * 快捷配置
     * @return
     */
    @Override
    public List<String> shortcutFieldOrder() {
        return Collections.singletonList("name");
    }

    public static class Config {
        private String name;
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}
```
