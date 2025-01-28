---
title: "The SSCCE：如何让别人帮助解决编程过程当中遇到的问题？"
sequence: "103"
---

## 介绍

怎么可能不求人？

人与人之间的不同：学历、知识、经验和最近从事的工作，。很难通过两三句话，就把问题表述清楚。


**Short, Self Contained, Correct (Compilable), Example**

If you are having a problem with some code and seeking help, preparing a Short, Self Contained, Correct Example (SSCCE) is very useful.

But what is an SSCCE?

- Short (Small) - Minimise bandwidth for the example, do not bore the audience.
- Self Contained - Ensure everything is included, ready to go.
- Correct - Copy, paste, (compile,) see is the aim.
- Example - Displays the problem we are trying to solve.

## Short

This depends on the group or forum.
For a public forum, most readers will stop reading by 100 lines of code, and start complaining at 250-300 lines of code.

### Tricks for Trimming

If the GUI has 40 buttons not related to the problem, remove them.
If they are related to the problem (you remove them and the problem disappears) put one or two back in,
if the problem reappears, include only those one or two buttons.

The array or table that is causing a problem may have a hundred entries,
but again, if the problem can be seen with two or three entries, trim the example to that alone.

If the problem is a GUI layout problem, trim all the processes (JavaScript/Java methods etc.) from behind it.
On the other hand, if the app. has a GUI but the problem is the processing, trim the GUI to a minimal version.

If trimming a very large amount if code for others to see,
you might trim out a part of it early on that you think is not related to the problem, yet the problem is fixed.

### Problem Solved?

By identifying more clearly where the problem occurs,
you have just made an important step toward solving it.
**The process that highlights where a problem originates can, in itself, help to solve it.**
You might look more closely at the part cut out, and in doing so, spot the problem.

Even if you cannot see why the problem occurs, you have still made an important step:
identifying (at least part) of the code involved.

If the code being trimmed is now a concise example of the problem,
it is ready to present to others, if not, put the problem code back in and continue trimming other areas of the code until it is.

## Self Contained

> self-contained: complete and able to work without the help of anything else

It is important to ensure that the code given to others can be 'copied, pasted, compiled, run'
so that they can help quickly and with a minimum of fuss.

This means that after the code has been copied, pasted and compiled by those helping,
they can run it and see the results for themselves. It is the example of the problem.

You are much more likely to receive help if you do this.

### How to make an example self contained.

If the code performs I/O to files, replace the file I/O with dummy data structures in problems that are unrelated to input/output.

If the problem is the input and textual input can be used, prepare a short example that can be copied for the actual file data.

Should the problem happen only under load, insert code to simulate that load.
If a layout problem only occurs under particular circumstances, force those things to happen, if it is practical to do so.

Obviously there are things that cannot be included in an example that is posted to a forum,
'a database' etcetera, but many times you just need a bit of lateral thinking
to come up with a way to replace something you thought was 'vital' to demonstrate a problem.

> lateral thinking: 水平思考，横向思维（即用想象力寻求解决问题的新方法）a way of solving problems by using your imagination to find new ways of looking at the problem

One example of lateral thinking is 'images'.
Images related to code problems might seem difficult to replace.
But one trick is to link to an image available on the web, one that displays the same problem.
Try to make any web based images 'small' in bytes - if at all possible.

## Correct

If my example was correct, what would I be doing here?

(Laughs) No, that is not what 'correct' means in this context.
In this document, correct (or compilable, which particularly relates to computer source code) means ensuring that
the example fits the accepted standards and protocols.

To achieve that, it is necessary to:

- Line width Keep the width of the lines in the example to under 62 characters wide.
  (but please do not remove all line indents!) Newsreaders typically force a line wrap at around 72 characters
  (and it pays to 'play it safe by using less than that).
  Sometimes line wrap does not cause any problem with the example,
  but it usually does, and means the lines need to be rejoined or reconstructed, before they work as intended.
- Use the naming convention, if one exists.
  Most of the people willing to help will be using hints from the formatting of upper and lower case letters,
  as well as their descriptive names, to skim the code in the hope of spotting the problem quickly.
  If following the conventions the audience is used to, it helps them to do that.
- Ensure the example is correct. Either the example compiles cleanly, or causes the exact error message about which needs solving.

Further tips:

- Move all resources (CSS/JS/Java source, images etc.) to the same directory,
  so they are easier to administer, and easier to find.
- Remove package statements from Java code.
- Demote `public` Java classes to default.
  If the language specifies only a single public class per source code file, demote all the other classes to default.
  This allows the example to be compiled without being split into separate files.
- Validate the example, where a validator is available.
  - HTML validator
  - CSS validator

## Example

Make sure the posted code, displays the problem!

You have worked on the example for hours, perhaps days.
It feels like forever.
Now is a good time to take a breather, step back, stretch, perhaps go for a refreshing walk.

Refresh the computer as well. Reboot it if necessary.

Now open the pages, or program, where the problem occurs. Is it still there?

Perhaps 99% of the time it is (maybe less if using a less reliable operating system).

Now, if the problem is still there, post the example.

## Reference

- [The SSCCE](http://sscce.org/)

