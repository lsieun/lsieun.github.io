---
title: "API: event"
sequence: "125"
---

## Evented

```text
           ┌─── Map
Evented ───┤
           └─── Layer ───┼─── Marker
```

A set of methods shared between event-powered classes (like `Map` and `Marker`).
Generally, events allow you to execute some function
when something happens with an object (e.g. the user clicks on the map, causing the map to fire 'click' event).

```text
map.on('click', function(e) {
    alert(e.latlng);
});
```

### 添加和移除事件

Leaflet deals with event listeners by reference,
so if you want to add a listener and then remove it, define it as a function:

```text
function onClick(e) { ... }

map.on('click', onClick);
map.off('click', onClick);
```

### Methods

- `on(<String> type, <Function> fn, <Object> context?)`:
  Adds a listener function (`fn`) to a particular event `type` of the object.
  You can optionally specify the context of the listener (object the `this` keyword will point to).
  You can also pass several space-separated types (e.g. 'click dblclick').
- `on(<Object> eventMap)`:
  Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
- `off(<String> type, <Function> fn?, <Object> context?)`
- `off(<Object> eventMap)`
- `off()`: Removes all listeners to all events on the object. This includes implicitly attached events.

## Event objects

Whenever a class inheriting from `Evented` fires an event,
a **listener function** will be called with **an event argument**,
which is a plain object containing information about the event. For example:

```text
map.on('click', function(ev) {
    alert(ev.latlng); // ev is an event object (MouseEvent in this case)
});
```

The information available depends on the event type:

### Event

The base event object. All other event objects contain these properties too.

- `type`: The event type (e.g. 'click').
- `target`: The object that fired the event.
  For propagated events, the last object in the propagation chain that fired the event.
- `sourceTarget`: The object that originally fired the event.
  For non-propagated events, this will be the same as the target.
- `propagatedFrom`: For propagated events, the last object that propagated the event to its event parent.

```text
         ┌─── KeyboardEvent
         │
         ├─── MouseEvent ───────────┼─── latlng
         │
         ├─── LocationEvent
         │
         ├─── ErrorEvent
         │
         ├─── LayerEvent ───────────┼─── layer
         │
         ├─── LayersControlEvent
         │
         │                          ┌─── tile
         ├─── TileEvent ────────────┤
         │                          └─── coords
         │
         ├─── TileErrorEvent
Event ───┤
         ├─── ResizeEvent
         │
         │                          ┌─── layer
         │                          │
         │                          ├─── properties
         ├─── GeoJSONEvent ─────────┤
         │                          ├─── geometryType
         │                          │
         │                          └─── id
         │
         ├─── PopupEvent
         │
         ├─── TooltipEvent
         │
         ├─── DragEndEvent
         │
         └─── ZoomAnimEvent
```

## Reference

- [Event objects](https://leafletjs.com/reference.html#event-objects)
