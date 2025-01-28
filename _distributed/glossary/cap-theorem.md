---
title: "CAP theorem"
sequence: "cap"
---

The [CAP Theorem](http://en.wikipedia.org/wiki/CAP_theorem) is a fundamental theorem in distributed systems
that states any distributed system can have at most two of the following three properties.

- Consistency
- Availability
- Partition tolerance

Have you ever seen an advertisement for a landscaper, house painter, or some other tradesperson
that starts with the headline, “Cheap, Fast, and Good: Pick Two”?

The CAP theorem applies a similar type of logic to distributed systems—namely,
that **a distributed system can deliver only two of three desired characteristics**:
**consistency**, **availability**, and **partition tolerance** (the `C`, `A` and `P` in `CAP`).

A distributed system is a network
that stores data on more than one node (physical or virtual machines) at the same time.
Because all cloud applications are distributed systems,
it's essential to understand the CAP theorem when designing a cloud app
so that you can choose a data management system that delivers the characteristics your application needs most.

The CAP theorem is also called Brewer's Theorem,
because it was first advanced by Professor Eric A. Brewer during a talk he gave on distributed computing in 2000.
Two years later, MIT professors Seth Gilbert and Nancy Lynch published a proof of “Brewer's Conjecture.”

Let's take a detailed look at the three distributed system characteristics to which the CAP theorem refers.

## CAP

### Consistency

Consistency means that **all clients see the same data at the same time**, no matter which node they connect to.
For this to happen, whenever data is written to one node,
it must be instantly forwarded or replicated to all the other nodes in the system
before the write is deemed 'successful.'

Ideally, the read operation should return the exact data for all users,
while the write operations should replicate any new data across all nodes.

### Availability

Availability means that **any client making a request for data gets a response**, even if one or more nodes are down.
Another way to state this—all working nodes in the distributed system
return a valid response for any request, without exception.

### Partition tolerance

A partition is a communications break within a distributed system—a lost or temporarily delayed connection between two nodes.
Partition tolerance means that the **cluster must continue to work
despite any number of communication breakdowns between nodes in the system.**

## Reference

- [What is the CAP theorem?](https://www.ibm.com/topics/cap-theorem)
- [An Illustrated Proof of the CAP Theorem](https://mwhittaker.github.io/blog/an_illustrated_proof_of_the_cap_theorem/)
