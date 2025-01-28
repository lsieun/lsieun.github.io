---
title: "GRPCChannelManager"
sequence: "105"
---

- BootManager
- BootService
  - GRPCChannelManager
  - GRPCChannel
  - GRPCChannelListener

## GRPCChannelManager

```java
/**
 * 这个服务是 Agent 到 OAP 的大动脉，也就是网络连接
 */
@DefaultImplementor
public class GRPCChannelManager implements BootService, Runnable {
}
```

### Channel

```java
@DefaultImplementor
public class GRPCChannelManager implements BootService, Runnable {
    // 网络连接
    private volatile GRPCChannel managedChannel = null;

    public Channel getChannel() {
        return managedChannel.getChannel();
    }
}
```

### BootService

```java
@DefaultImplementor
public class GRPCChannelManager implements BootService, Runnable {
    // OAP 地址列表
    private volatile List<String> grpcServers;
    
    // 网络连接状态定时检查任务
    private volatile ScheduledFuture<?> connectCheckFuture;
    
    @Override
    public void prepare() {

    }
    
    @Override
    public void boot() {
        if (Config.Collector.BACKEND_SERVICE.trim().length() == 0) {
            LOGGER.error("Collector server addresses are not set.");
            LOGGER.error("Agent will not uplink any data.");
            return;
        }
        grpcServers = Arrays.asList(Config.Collector.BACKEND_SERVICE.split(","));
        connectCheckFuture = Executors.newSingleThreadScheduledExecutor(
            new DefaultNamedThreadFactory("GRPCChannelManager")
        ).scheduleAtFixedRate(
            new RunnableWithExceptionProtection(
                this,
                t -> LOGGER.error("unexpected exception.", t)
            ), 0, Config.Collector.GRPC_CHANNEL_CHECK_INTERVAL, TimeUnit.SECONDS // 30 秒执行一次
        );
    }
    
    @Override
    public void onComplete() {

    }
    
    @Override
    public void shutdown() {
        if (connectCheckFuture != null) {
            connectCheckFuture.cancel(true);
        }
        if (managedChannel != null) {
            managedChannel.shutdownNow();
        }
        LOGGER.debug("Selected collector grpc service shutdown.");
    }
}
```

```java
public class Config {
    public static class Collector {
        public static long GRPC_CHANNEL_CHECK_INTERVAL = 30;
        public static String BACKEND_SERVICE = "";
    }
}
```

### Listener

```java
@DefaultImplementor
public class GRPCChannelManager implements BootService, Runnable {
    private final List<GRPCChannelListener> listeners = Collections.synchronizedList(new LinkedList<>());

    public void addChannelListener(GRPCChannelListener listener) {
        listeners.add(listener);
    }
}
```

### Runnable

```java
@DefaultImplementor
public class GRPCChannelManager implements BootService, Runnable {
    @Override
    public void run() {
        LOGGER.debug("Selected collector grpc service running, reconnect:{}.", reconnect);
        // 第 1 步，获取 grpcServers 列表
        if (IS_RESOLVE_DNS_PERIODICALLY && reconnect) {
            grpcServers = Arrays.stream(Config.Collector.BACKEND_SERVICE.split(","))
                    .filter(StringUtil::isNotBlank)
                    .map(eachBackendService -> eachBackendService.split(":"))
                    .filter(domainPortPairs -> {
                        if (domainPortPairs.length < 2) {
                            LOGGER.debug("Service address [{}] format error. The expected format is IP:port", domainPortPairs[0]);
                            return false;
                        }
                        return true;
                    })
                    .flatMap(domainPortPairs -> {
                        try {
                            return Arrays.stream(InetAddress.getAllByName(domainPortPairs[0]))
                                    .map(InetAddress::getHostAddress)
                                    .map(ip -> String.format("%s:%s", ip, domainPortPairs[1]));
                        } catch (Throwable t) {
                            LOGGER.error(t, "Failed to resolve {} of backend service.", domainPortPairs[0]);
                        }
                        return Stream.empty();
                    })
                    .distinct()
                    .collect(Collectors.toList());
        }

        // 第 2 步，获取 server 和 channel
        if (reconnect) {
            if (grpcServers.size() > 0) {
                String server = "";
                try {
                    int index = Math.abs(random.nextInt()) % grpcServers.size();
                    if (index != selectedIdx) {
                        selectedIdx = index;

                        // 第 2.1 步，获取 server
                        server = grpcServers.get(index);
                        String[] ipAndPort = server.split(":");

                        if (managedChannel != null) {
                            managedChannel.shutdownNow();
                        }

                        // 第 2.2 步，获取 channel
                        managedChannel = GRPCChannel.newBuilder(ipAndPort[0], Integer.parseInt(ipAndPort[1]))
                                                    .addManagedChannelBuilder(new StandardChannelBuilder())
                                                    .addManagedChannelBuilder(new TLSChannelBuilder())
                                                    .addChannelDecorator(new AgentIDDecorator())
                                                    .addChannelDecorator(new AuthenticationDecorator())
                                                    .build();
                      
                        // 第 2.3 步，通知
                        notify(GRPCChannelStatus.CONNECTED);
                        reconnectCount = 0;
                        reconnect = false;
                    } else if (managedChannel.isConnected(++reconnectCount > Config.Agent.FORCE_RECONNECTION_PERIOD)) {
                        // Reconnect to the same server is automatically done by GRPC,
                        // therefore we are responsible to check the connectivity and
                        // set the state and notify listeners
                        reconnectCount = 0;
                        notify(GRPCChannelStatus.CONNECTED);
                        reconnect = false;
                    }

                    return;
                } catch (Throwable t) {
                    LOGGER.error(t, "Create channel to {} fail.", server);
                }
            }

            LOGGER.debug(
                "Selected collector grpc service is not available. Wait {} seconds to retry",
                Config.Collector.GRPC_CHANNEL_CHECK_INTERVAL
            );
        }
    }
    
    private void notify(GRPCChannelStatus status) {
        for (GRPCChannelListener listener : listeners) {
            try {
                listener.statusChanged(status);
            } catch (Throwable t) {
                LOGGER.error(t, "Fail to notify {} about channel connected.", listener.getClass().getName());
            }
        }
    }
}
```

## GRPCChannelListener

```java
public interface GRPCChannelListener {
    void statusChanged(GRPCChannelStatus status);
}
```
