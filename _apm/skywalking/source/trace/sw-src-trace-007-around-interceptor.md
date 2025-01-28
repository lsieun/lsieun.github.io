---
title: "MethodsAroundInterceptor"
sequence: "107"
---

## Tomcat

### TomcatInvokeInterceptor

- project: `apm-sniffer/apm-sdk-plugin/tomcat-7.x-8.x-plugin`
- package: `org.apache.skywalking.apm.plugin.tomcat78x`

```java
public class TomcatInvokeInterceptor implements InstanceMethodsAroundInterceptor {
    @Override
    public void beforeMethod(EnhancedInstance objInst, Method method, Object[] allArguments, Class<?>[] argumentsTypes,
                             MethodInterceptResult result) throws Throwable {
        Request request = (Request) allArguments[0];
        ContextCarrier contextCarrier = new ContextCarrier();

        CarrierItem next = contextCarrier.items();
        while (next.hasNext()) {
            next = next.next();
            next.setHeadValue(request.getHeader(next.getHeadKey()));
        }
        String operationName =  String.join(":", request.getMethod(), request.getRequestURI());
        
        
        // A. 创建新的 EntrySpan
        AbstractSpan span = ContextManager.createEntrySpan(operationName, contextCarrier);
        
        // B. 设置 tag、component、layer
        Tags.URL.set(span, request.getRequestURL().toString());
        Tags.HTTP.METHOD.set(span, request.getMethod());
        span.setComponent(ComponentsDefine.TOMCAT);
        SpanLayer.asHttp(span);

        if (TomcatPluginConfig.Plugin.Tomcat.COLLECT_HTTP_PARAMS) {
            collectHttpParam(request, span);
        }
    }

    @Override
    public Object afterMethod(EnhancedInstance objInst, Method method, Object[] allArguments, Class<?>[] argumentsTypes,
                              Object ret) throws Throwable {
        Request request = (Request) allArguments[0];
        HttpServletResponse response = (HttpServletResponse) allArguments[1];

        // C. 获取 Span
        AbstractSpan span = ContextManager.activeSpan();
        if (IS_SERVLET_GET_STATUS_METHOD_EXIST && response.getStatus() >= 400) {
            span.errorOccurred();
            Tags.HTTP_RESPONSE_STATUS_CODE.set(span, response.getStatus());
        }
        // Active HTTP parameter collection automatically in the profiling context.
        if (!TomcatPluginConfig.Plugin.Tomcat.COLLECT_HTTP_PARAMS && span.isProfiling()) {
            collectHttpParam(request, span);
        }
        ContextManager.getRuntimeContext().remove(Constants.FORWARD_REQUEST_FLAG);
        
        // D. 停止 Span
        ContextManager.stopSpan();
        return ret;
    }
}
```

### Spring

### AbstractMethodInterceptor

- project: `apm-sniffer/apm-sdk-plugin/spring-plugins/mvc-annotation-commons`
- package: `org.apache.skywalking.apm.plugin.spring.mvc.commons.interceptor`

```java
public abstract class AbstractMethodInterceptor implements InstanceMethodsAroundInterceptor {
    @Override
    public void beforeMethod(EnhancedInstance objInst, Method method, Object[] allArguments, Class<?>[] argumentsTypes,
                             MethodInterceptResult result) throws Throwable {

        Boolean forwardRequestFlag = (Boolean) ContextManager.getRuntimeContext().get(FORWARD_REQUEST_FLAG);
        /**
         * Spring MVC plugin do nothing if current request is forward request.
         * Ref: https://github.com/apache/skywalking/pull/1325
         */
        if (forwardRequestFlag != null && forwardRequestFlag) {
            return;
        }

        Object request = ContextManager.getRuntimeContext().get(REQUEST_KEY_IN_RUNTIME_CONTEXT);

        if (request != null) {
            StackDepth stackDepth = (StackDepth) ContextManager.getRuntimeContext().get(CONTROLLER_METHOD_STACK_DEPTH);

            if (stackDepth == null) {
                final ContextCarrier contextCarrier = new ContextCarrier();

                if (IN_SERVLET_CONTAINER && HttpServletRequest.class.isAssignableFrom(request.getClass())) {
                    final HttpServletRequest httpServletRequest = (HttpServletRequest) request;
                    CarrierItem next = contextCarrier.items();
                    while (next.hasNext()) {
                        next = next.next();
                        next.setHeadValue(httpServletRequest.getHeader(next.getHeadKey()));
                    }

                    String operationName = this.buildOperationName(method, httpServletRequest.getMethod(),
                            (EnhanceRequireObjectCache) objInst.getSkyWalkingDynamicField());

                    // A. 创建新的 EntrySpan
                    AbstractSpan span = ContextManager.createEntrySpan(operationName, contextCarrier);

                    // B. 设置 tag、component、layer
                    Tags.URL.set(span, httpServletRequest.getRequestURL().toString());
                    Tags.HTTP.METHOD.set(span, httpServletRequest.getMethod());
                    span.setComponent(ComponentsDefine.SPRING_MVC_ANNOTATION);
                    SpanLayer.asHttp(span);

                    if (SpringMVCPluginConfig.Plugin.SpringMVC.COLLECT_HTTP_PARAMS) {
                        RequestUtil.collectHttpParam(httpServletRequest, span);
                    }

                    if (!CollectionUtil.isEmpty(SpringMVCPluginConfig.Plugin.Http.INCLUDE_HTTP_HEADERS)) {
                        RequestUtil.collectHttpHeaders(httpServletRequest, span);
                    }
                } else if (ServerHttpRequest.class.isAssignableFrom(request.getClass())) {
                    final ServerHttpRequest serverHttpRequest = (ServerHttpRequest) request;
                    CarrierItem next = contextCarrier.items();
                    while (next.hasNext()) {
                        next = next.next();
                        next.setHeadValue(serverHttpRequest.getHeaders().getFirst(next.getHeadKey()));
                    }

                    String operationName = this.buildOperationName(method, serverHttpRequest.getMethodValue(),
                            (EnhanceRequireObjectCache) objInst.getSkyWalkingDynamicField());
                    AbstractSpan span = ContextManager.createEntrySpan(operationName, contextCarrier);
                    Tags.URL.set(span, serverHttpRequest.getURI().toString());
                    Tags.HTTP.METHOD.set(span, serverHttpRequest.getMethodValue());
                    span.setComponent(ComponentsDefine.SPRING_MVC_ANNOTATION);
                    SpanLayer.asHttp(span);

                    if (SpringMVCPluginConfig.Plugin.SpringMVC.COLLECT_HTTP_PARAMS) {
                        RequestUtil.collectHttpParam(serverHttpRequest, span);
                    }

                    if (!CollectionUtil.isEmpty(SpringMVCPluginConfig.Plugin.Http.INCLUDE_HTTP_HEADERS)) {
                        RequestUtil.collectHttpHeaders(serverHttpRequest, span);
                    }
                } else {
                    throw new IllegalStateException("this line should not be reached");
                }

                stackDepth = new StackDepth();
                ContextManager.getRuntimeContext().put(CONTROLLER_METHOD_STACK_DEPTH, stackDepth);
            } else {
                AbstractSpan span = ContextManager.createLocalSpan(buildOperationName(objInst, method));
                span.setComponent(ComponentsDefine.SPRING_MVC_ANNOTATION);
            }

            stackDepth.increment();
        }
    }

    @Override
    public Object afterMethod(EnhancedInstance objInst, Method method, Object[] allArguments, Class<?>[] argumentsTypes,
                              Object ret) throws Throwable {
        final RuntimeContext runtimeContext = ContextManager.getRuntimeContext();
        Boolean forwardRequestFlag = (Boolean) runtimeContext.get(FORWARD_REQUEST_FLAG);
        /**
         * Spring MVC plugin do nothing if current request is forward request.
         * Ref: https://github.com/apache/skywalking/pull/1325
         */
        if (forwardRequestFlag != null && forwardRequestFlag) {
            return ret;
        }

        Object request = runtimeContext.get(REQUEST_KEY_IN_RUNTIME_CONTEXT);

        if (request != null) {
            try {
                StackDepth stackDepth = (StackDepth) runtimeContext.get(CONTROLLER_METHOD_STACK_DEPTH);
                if (stackDepth == null) {
                    throw new IllegalMethodStackDepthException();
                } else {
                    stackDepth.decrement();
                }

                // C. 获取 Span
                AbstractSpan span = ContextManager.activeSpan();

                if (stackDepth.depth() == 0) {
                    Object response = runtimeContext.get(RESPONSE_KEY_IN_RUNTIME_CONTEXT);
                    if (response == null) {
                        throw new ServletResponseNotFoundException();
                    }

                    Integer statusCode = null;

                    if (IS_SERVLET_GET_STATUS_METHOD_EXIST && HttpServletResponse.class.isAssignableFrom(response.getClass())) {
                        statusCode = ((HttpServletResponse) response).getStatus();
                    } else if (ServerHttpResponse.class.isAssignableFrom(response.getClass())) {
                        if (IS_SERVLET_GET_STATUS_METHOD_EXIST) {
                            statusCode = ((ServerHttpResponse) response).getRawStatusCode();
                        }
                        Object context = runtimeContext.get(REACTIVE_ASYNC_SPAN_IN_RUNTIME_CONTEXT);
                        if (context != null) {
                            ((AbstractSpan[]) context)[0] = span.prepareForAsync();
                        }
                    }

                    if (statusCode != null && statusCode >= 400) {
                        span.errorOccurred();
                        Tags.HTTP_RESPONSE_STATUS_CODE.set(span, statusCode);
                    }

                    runtimeContext.remove(REACTIVE_ASYNC_SPAN_IN_RUNTIME_CONTEXT);
                    runtimeContext.remove(REQUEST_KEY_IN_RUNTIME_CONTEXT);
                    runtimeContext.remove(RESPONSE_KEY_IN_RUNTIME_CONTEXT);
                    runtimeContext.remove(CONTROLLER_METHOD_STACK_DEPTH);
                }

                // Active HTTP parameter collection automatically in the profiling context.
                if (!SpringMVCPluginConfig.Plugin.SpringMVC.COLLECT_HTTP_PARAMS && span.isProfiling()) {
                    if (HttpServletRequest.class.isAssignableFrom(request.getClass())) {
                        RequestUtil.collectHttpParam((HttpServletRequest) request, span);
                    } else if (ServerHttpRequest.class.isAssignableFrom(request.getClass())) {
                        RequestUtil.collectHttpParam((ServerHttpRequest) request, span);
                    }
                }
            } finally {
                // D. 停止 Span
                ContextManager.stopSpan();
            }
        }

        return ret;
    }
}
```


