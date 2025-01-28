---
title: "Event Handling"
sequence: "113"
---

The `ApplicationContext` publishes certain types of events when loading the beans.
For example, a `ContextStartedEvent` is published when the context is started
and `ContextStoppedEvent` is published when the context is stopped.
We can have our beans receive these events
if we wish to do some processing on our side based on these events.
We can also publish our own events, too.

## Listening to Context Events

In order to listen to the context events, our bean should implement the `ApplicationListener` interface.
This interface has just one method: `onApplicationEvent(ApplicationEvent event)`.

Spring context publishes the following types of events:
- `ContextStartedEvent`: This event is published when the `ApplicationContext` is started.
  The beans receive a start signal once the `ApplicationContext` is started.
  The activities such as polling to database or observing a file system can be started once you receive this type of event.
- `ContextStoppedEvent`: This is the opposite of the start event.
  This event is published when the `ApplicationContext` is stopped.
  Your bean receives a stop signal from the framework so you can do housekeeping if you wish.
- `ContextRefreshedEvent`: A refresh event is emitted when the context is either refreshed or initialized.
- `ContextClosedEvent`: This event occurs when the `ApplicationContext` is closed.
- `RequestHandledEvent`: This is a web-specific event informing the receivers that a web request has been received.

## Custom Events

### Publishing Custom Events

It's a fairly simple task to publish custom events.
First you have to create your event by extending `ApplicationEvent`.

The `TradePersistor` should implement an interface called `ApplicationEventPublisherAware`.
This interface lets the framework set the `ApplicationEventPublisher` instance on the class
by calling the `setApplicationEventPublisher` method.
The `ApplicationEventPublisher` has one method—`publish(ApplicationEvent event)`—which is used to publish events.

```java
public interface ApplicationEventPublisherAware extends Aware {
    void setApplicationEventPublisher(ApplicationEventPublisher applicationEventPublisher);
}
```

```java
@FunctionalInterface
public interface ApplicationEventPublisher {
    default void publishEvent(ApplicationEvent event) {
        publishEvent((Object) event);
    }

    void publishEvent(Object event);
}
```

### Receiving Custom Events

Create a class that extends the `ApplicationListener` and handle the `onApplicationEvent` method
that receives `TradePersistedEvent` object.

```java
@FunctionalInterface
public interface ApplicationListener<E extends ApplicationEvent> extends EventListener {
    void onApplicationEvent(E event);

    static <T> ApplicationListener<PayloadApplicationEvent<T>> forPayload(Consumer<T> consumer) {
        return event -> consumer.accept(event.getPayload());
    }    
}
```

## Single Threaded Event Model

One important thing to keep in mind when working with Spring events handling is that
Spring's event handling is **single-threaded**.
It is primarily synchronous in nature.
That is, if an event is published, until and unless all the receivers get the message,
the processes are blocked and the flow will not continue.
This proves to be disadvantageous if you have multiple listeners listening for an event.
So the single-thread model hampers the performance of the application.
Hence, care should be taken when designing your application if event handling is to be used.



