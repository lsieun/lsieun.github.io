---
title: "Cyclic Redundancy Check"
---

## What is a Cyclic Redundancy Check?

The mathematics behind CRCs initially appears daunting, but it doesn't have to be.
The idea is given a block of N bits, let's compute a checksum of a sort to see if the N bits were damaged in some way,
for instance by transit over a network.
The extra data we transmit with this checksum is the “**Redundancy**” part of CRC,
and the second C just means this is a “**Check**” to see if the data are corrupted
(as opposed to an ECC code, which both detects and corrects errors).
The **Cyclic** part means it uses cyclic codes, which is where people tend to get lost in the math.
If you look at the Wikipedia page for cyclic codes, it starts by discussing Galois field arithmetic and goes uphill from there.

## How does CRC Work?

Error correction goes way back in computing.
One of the first things I ran into while understanding the ASCII character set was **parity**.
The seven-bit ASCII character set in some computers used the 8th bit as a check bit to see if the character had been transmitted correctly.
If the character had an odd number of ones in the lower 7 bits, the 8th bit was set to a 1, otherwise 0.

So if the receiving device (modem, computer terminal, etc.) got an 8-bit quantity where the number of ones in it was not even,
it knew that character had been corrupted.
This is a simplistic scheme, but some important concepts shared with the CRC are here:

- We added the check data to the transmitted data (a redundancy), and
- It isn't perfect — it only detects certain errors that it was designed to check. (Specifically, the parity bit successfully detects all one-bit errors in each 7-bit block of data, but potentially can fail if worse data corruption occurs.)

## References

[★★★ CRC32.java](https://introcs.cs.princeton.edu/java/61data/CRC32.java.html)

[★★★ UNDERSTANDING THE CYCLIC REDUNDANCY CHECK](https://www.cardinalpeak.com/blog/understanding-the-cyclic-redundancy-check)

[What Is CRC?](https://info.support.huawei.com/info-finder/encyclopedia/en/CRC.html)
