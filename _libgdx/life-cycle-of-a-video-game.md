---
title: "The Life Cycle of a Video Game"
sequence: "102"
---

Before jumping into the programming aspect of game development,
it is important to understand the overall structure of a game program:
- **the major stages** that a game program progresses through
- **the tasks** that a game program must perform in **each stage**

The stages are as follows:

- **Startup**: During this stage, any files needed (such as images or sounds) are loaded, game objects are created, and values are initialized.
- The **game loop**: A stage that repeats continuously while the game is running and that consists of the following three sub-stages:
  - **Process input**: The program checks to see if the user has performed any action that sends data to the computer
    - pressing keyboard keys,
    - moving the mouse or clicking mouse buttons,
    - touching or swiping on a touchscreen,
    - or pressing joysticks or buttons on a game pad.
  - **Update**: Performs tasks that involve the state of the game world and the entities within it. This could include
    - changing the positions of entities based on user input or physics simulations,
    - performing collision detection to determine when two entities come in contact with each other and what action to perform in response,
    - or selecting actions for non-player characters.
  - **Render**: Draws all graphics on the screen, such as background images, game-world entities, and the user interface (which typically overlays the game world).
- **Shutdown**: This stage begins when the player provides input to the computer indicating that he is finished using the software (for example, by clicking a Quit button) and may involve
  - removing images or data from memory,
  - saving player data or the game state,
  - signaling the computer to stop monitoring hardware devices for user input,
  - and closing any windows that were created by the game.

![The stages of a game program](/assets/images/libgdx/the-stages-of-a-game-program.png)

Most of these stages are handled by a corresponding method in LibGDX.
For example, the **startup stage** is carried out by a method named `create`,
the **update** and **render stages** are both handled by the `render` method,
and any **shutdown actions** are performed by a method named `dispose`.

## ApplicationListener

An application in LibGDX requires user-created classes to implement the `ApplicationListener` interface
so that it can handle all stages of a game program's life cycle.

In fact, the `ApplicationListener` interface requires a total of six methods:
`create`, `render`, `resize`, `pause`, `resume`, and `dispose`.

The `Game` class implements the `ApplicationListener` class and includes "empty" versions of the functions.

