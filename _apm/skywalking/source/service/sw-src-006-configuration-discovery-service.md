---
title: "ConfigurationDiscoveryService"
sequence: "106"
---

```java
@DefaultImplementor
public class ConfigurationDiscoveryService implements BootService, GRPCChannelListener {
    // ...
}
```

## ConfigurationDiscoveryService

### BootService

```java
@DefaultImplementor
public class ConfigurationDiscoveryService implements BootService, GRPCChannelListener {
    private volatile ScheduledFuture<?> getDynamicConfigurationFuture;
    
    @Override
    public void prepare() throws Throwable {
        ServiceManager.INSTANCE.findService(GRPCChannelManager.class).addChannelListener(this);
    }

    @Override
    public void boot() throws Throwable {
        getDynamicConfigurationFuture = Executors.newSingleThreadScheduledExecutor(
                new DefaultNamedThreadFactory("ConfigurationDiscoveryService")
        ).scheduleAtFixedRate(
                new RunnableWithExceptionProtection(
                        this::getAgentDynamicConfig,
                        t -> LOGGER.error("Sync config from OAP error.", t)
                ),
                Config.Collector.GET_AGENT_DYNAMIC_CONFIG_INTERVAL,    // initialDelay
                Config.Collector.GET_AGENT_DYNAMIC_CONFIG_INTERVAL,    // period
                TimeUnit.SECONDS
        );
    }

    @Override
    public void onComplete() throws Throwable {

    }

    @Override
    public void shutdown() throws Throwable {
        if (getDynamicConfigurationFuture != null) {
            getDynamicConfigurationFuture.cancel(true);
        }
    }
}
```

```java
public class Config {
    public static class Collector {
        public static int GET_AGENT_DYNAMIC_CONFIG_INTERVAL = 20;
    }
}
```

### AgentDynamicConfig

```java
@DefaultImplementor
public class ConfigurationDiscoveryService implements BootService, GRPCChannelListener {
    /**
     * get agent dynamic config through gRPC.
     */
    private void getAgentDynamicConfig() {
        LOGGER.debug("ConfigurationDiscoveryService running, status:{}.", status);

        if (GRPCChannelStatus.CONNECTED.equals(status)) {
            try {
                // 第 1 步，使用 builder 构建对象
                ConfigurationSyncRequest.Builder builder = ConfigurationSyncRequest.newBuilder();
                builder.setService(Config.Agent.SERVICE_NAME);

                // Some plugin will register watcher later.
                final int size = register.keys().size();
                if (lastRegisterWatcherSize != size) {
                    // reset uuid, avoid the same uuid causing the configuration not to be updated.
                    uuid = null;
                    lastRegisterWatcherSize = size;
                }

                if (null != uuid) {
                    builder.setUuid(uuid);
                }

                // 第 2 步，发送和接收
                if (configurationDiscoveryServiceBlockingStub != null) {
                    final Commands commands = configurationDiscoveryServiceBlockingStub.withDeadlineAfter(
                            GRPC_UPSTREAM_TIMEOUT, TimeUnit.SECONDS
                    ).fetchConfigurations(builder.build());
                    ServiceManager.INSTANCE.findService(CommandService.class).receiveCommand(commands);
                }
            } catch (Throwable t) {
                LOGGER.error(t, "ConfigurationDiscoveryService execute fail.");
                ServiceManager.INSTANCE.findService(GRPCChannelManager.class).reportError(t);
            }
        }
    }
}
```

