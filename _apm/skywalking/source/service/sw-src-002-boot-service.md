---
title: "Boot Service"
sequence: "102"
---

## BootService

- project: `apm-sniffer/apm-agent-core`
- package: `org.apache.skywalking.apm.agent.core.boot`

```java
public interface BootService {
    void prepare() throws Throwable;

    void boot() throws Throwable;

    void onComplete() throws Throwable;

    void shutdown() throws Throwable;

    default int priority() {
        return 0;
    }
}
```

### 子类

不带有任何注解：

```java
public class ContextManager implements BootService {
}
```

带有 `DefaultImplementor` 注解：

```java
@DefaultImplementor
public class SamplingService implements BootService {
}
```

带有 `OverrideImplementor` 注解：

```java
@OverrideImplementor(SamplingService.class)
public class TraceIgnoreExtendService extends SamplingService {
}
```

## ServiceManager

### 启动和关闭

```java
public enum ServiceManager {
    INSTANCE;

    private Map<Class, BootService> bootedServices = Collections.emptyMap();

    // 第 1 步，启动
    public void boot() {
        bootedServices = loadAllServices();

        prepare();
        startup();
        onComplete();
    }

    // 第 2 步，关闭
    public void shutdown() {
        bootedServices.values().stream().sorted(
            Comparator.comparingInt(BootService::priority).reversed() // 按优先级级的“倒序”排序
        ).forEach(service -> {
            try {
                service.shutdown();
            } catch (Throwable e) {
                LOGGER.error(e, "ServiceManager try to shutdown [{}] fail.", service.getClass().getName());
            }
        });
    }
}
```

### loadAllServices

```java
public enum ServiceManager {
    ;
    
    private Map<Class, BootService> loadAllServices() {
        // 第 1 步，定义两个变量
        Map<Class, BootService> bootedServices = new LinkedHashMap<>();
        List<BootService> allServices = new LinkedList<>();

        // 第 2 步，拿到所有 Services，放到 allSerivces 中
        load(allServices);
        
        // 第 3 步，将 service，从 allServices 中拿出来，放到 bootedServices 中。
        for (final BootService bootService : allServices) {
            Class<? extends BootService> bootServiceClass = bootService.getClass();
            
            // 第 3.1 步，判断是否有 DefaultImplementor 注解
            boolean isDefaultImplementor = bootServiceClass.isAnnotationPresent(DefaultImplementor.class);
            if (isDefaultImplementor) {
                if (!bootedServices.containsKey(bootServiceClass)) {
                    // 如果不存在，就添加
                    bootedServices.put(bootServiceClass, bootService);
                } else {
                    // ignore the default service
                    // 如果已经存在，就忽略
                }
            } else {
                // 第 3.2 步，判断是否有 OverrideImplementor 注解
                OverrideImplementor overrideImplementor = bootServiceClass.getAnnotation(OverrideImplementor.class);
                if (overrideImplementor == null) {
                    if (!bootedServices.containsKey(bootServiceClass)) {
                        bootedServices.put(bootServiceClass, bootService);
                    } else {
                        throw new ServiceConflictException("Duplicate service define for :" + bootServiceClass);
                    }
                } else {
                    Class<? extends BootService> targetService = overrideImplementor.value();
                    if (bootedServices.containsKey(targetService)) {
                        boolean presentDefault = bootedServices.get(targetService)
                                .getClass()
                                .isAnnotationPresent(DefaultImplementor.class);
                        if (presentDefault) {
                            bootedServices.put(targetService, bootService);
                        } else {
                            throw new ServiceConflictException(
                                    "Service " + bootServiceClass + " overrides conflict, " +
                                    "exist more than one service want to override :" + targetService
                            );
                        }
                    } else {
                        bootedServices.put(targetService, bootService);
                    }
                }
            }

        }
        return bootedServices;
    }

    void load(List<BootService> allServices) {
        for (final BootService bootService : ServiceLoader.load(BootService.class, AgentClassLoader.getDefault())) {
            allServices.add(bootService);
        }
    }

    public <T extends BootService> T findService(Class<T> serviceClass) {
        return (T) bootedServices.get(serviceClass);
    }
}
```

### prepare/startup/onComplete

```java
public enum ServiceManager {
    ;

    private void prepare() {
        bootedServices.values().stream().sorted(
                Comparator.comparingInt(BootService::priority) // 优先级：从小到大
        ).forEach(service -> {
            try {
                service.prepare();
            } catch (Throwable e) {
                LOGGER.error(e, "ServiceManager try to pre-start [{}] fail.", service.getClass().getName());
            }
        });
    }

    private void startup() {
        bootedServices.values().stream().sorted(
                Comparator.comparingInt(BootService::priority) // 优先级：从小到大
        ).forEach(service -> {
            try {
                service.boot();
            } catch (Throwable e) {
                LOGGER.error(e, "ServiceManager try to start [{}] fail.", service.getClass().getName());
            }
        });
    }

    private void onComplete() {
        for (BootService service : bootedServices.values()) {
            try {
                service.onComplete();
            } catch (Throwable e) {
                LOGGER.error(e, "Service [{}] AfterBoot process fails.", service.getClass().getName());
            }
        }
    }
}
```
