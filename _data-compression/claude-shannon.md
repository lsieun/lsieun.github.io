---
title: "Claude Shannon"
---

愤怒的香农

Back in the 1940s, a statistical researcher named Claude Shannon published several papers detailing research he did
while working in the military during World War II, and later at Bell Labs.

Claude was a pretty smart guy (and very good at math).
Before he left the University of Michigan in 1936,
he'd racked up bachelor's degrees in engineering and mathematics.
He then went on to do a bunch of crazy post-graduate stuff at the Massachusetts Institute of Technology,
and his master's thesis, “A Symbolic Analysis of Relay and Switching Circuits”,
became the foundation of modern electrical switch-based computing.

In 1948, Shannon published **A Mathematical Theory of Communication**,
which detailed how to best encode information that a sender wants to transmit,
thus inventing the entire field of Information Theory.
Messages can be encoded in many ways— think “alphabet” or “Morse code”—but for every message,
there is a most efficient way to encode it,
where “efficient” means using the fewest possible letters or symbols (or bits, or units of information).
What “fewest” boils down to depends on the information content of the message.
Shannon invented a way of measuring the information content of a message and called it **information entropy**.

**Data compression** is a practical application of Shannon's research,
which asks, “**How compact can we make a message before we can no longer recover it?**”

It's important to note that according to modern information theory,
there is a point at which **removing any more bits removes the ability for you to uniquely recover your data stream properly**.
So, our compression goal is to **remove as many bits as possible to get to this point, and then remove no more**.

## The Only Thing You Need to Know about Data

Data compression works via two simple ideas:

- Reduce the number of unique symbols in your data (smallest possible "alphabet").
- Encode more frequent symbols with fewer bits (fewest bits for most common "letters").

Sixty years of compression research boiled down to two bullet points.
Every single algorithm in data compression focuses on doing one of these two things.
It transforms the data to be more compressible by shuffling or reducing the number of symbols,
or it takes advantage of the fact that some symbols are more common than others,
and encodes more common symbols with fewer bits.

