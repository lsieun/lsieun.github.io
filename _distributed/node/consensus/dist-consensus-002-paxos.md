---
title: "Paxos"
sequence: "102"
---

**Paxos** is named after the Greek island and
stands as one of the most prominent consensus algorithms.
Introduced by Leslie Lamport in the late 1980s,
**Paxos's primary aim was to ensure system consistency in the face of node failures**.

The protocol operates in a series of rounds and
involves roles such as proposers, acceptors, and learners.
Key phases include proposing a value, collecting responses, and finally reaching an agreement.
The formality of Paxos often leads to challenges in its implementation,
but its endurance declares its foundational nature.

- roles
    - proposers
    - acceptors
    - learners
- phases
    - proposing a value
    - collecting responses
    - finally reaching an agreement
