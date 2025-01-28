---
title: "Animation"
sequence: "201"
---

Two types of animation:
- **value-based animation**, which uses a single image and continuously changes associated values (such as position or rotation).
- **image-based animation**, which displays a sequence of images in rapid succession.

## Value-Based Animations

Many visual effects can be achieved by continuously changing values associated with a game entity, such as the following:
- A movement effect can be created by changing the position-coordinate values.
- A spinning effect can be created by changing the rotation value.
- A growing or shrinking effect can be created by changing the scale factors.
- A color-cycling effect can be created by changing the color red/green/blue (RGB) component values.
- A fading in/out effect can be created by changing the alpha (transparency) value.

These effects can easily be added to your game by using LibGDX's `Action` class.
An `Action` is an object that can be added to an `Actor` to automatically change
the values of various fields (position, rotation, scale, color) over time.
The code that processes actions is contained within the `act` method of the `Actor` class.
To create an `Action`, it is easiest to use the static methods available in the `Actions` class.

### single

For example, an `Action` named `spin` that rotates an actor by 180 degrees over the course of two seconds
can be created and attached to an `Actor` named `starfish` with the following code:

```text
Action spin = Actions.rotateBy(180, 2);
starfish.addAction(spin);
```

Similarly, an `Action` named `shift` that moves an actor 50 pixels horizontally (to the right) and 0 pixels
vertically over the course of one second can be created with the following code:

```text
Action shift = Actions.moveBy(50, 0, 1);
```

### compound


