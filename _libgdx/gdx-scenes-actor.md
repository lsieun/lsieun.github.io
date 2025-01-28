---
title: "Actor"
sequence: "104"
---

The LibGDX libraries provide a few different classes that can be used to manage the data associated with a game object;
you will use the LibGDX class `Actor` as a foundation.
This class stores data such as position, size (width and height), rotation, scaling factors, and more.
However, it does not include a variable to store an image.
This seeming "omission" in fact gives you greater flexibility in allowing you to specify how the object will be represented.
You can extend the `Actor` class and include any additional information you need in your game,
such as collision shapes, one or more images or animations, custom rendering methods, and more.

There are a few additional features of the default `Actor` class that should be mentioned here.
- First, in addition to a `draw` method, the `Actor` class has an `act` method that can serve to update or modify the state of an `Actor`.
- Second, the `Actor` class was designed to be used in concert with a class called `Stage`.

The main role of the `Stage` class is to store a list of `Actor` instances;
it also contains methods (named `act` and `draw`) that call the `act` and `draw` methods of every `Actor` that has been added to it,
which frees you from having to remember to draw every individual `Actor` instance yourself.
The `Stage` class also creates and handles a `Batch` object,
which reduces the amount of code that you need to write.
