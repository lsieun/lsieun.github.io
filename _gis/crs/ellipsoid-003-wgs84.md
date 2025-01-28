---
title: "Ellipsoid: WGS84"
sequence: "ellipsoid-003-wgs84"
---

You might have read about **WGS84 ellipsoid** and **WGS84 datum**.
What is the difference between the two?

In general, **a datum** represents **an ellipsoid** and **the position of its center**.
**While the definition of WGS84 ellipsoid hasn't changed,
the location of its center has changed slightly**
because it is intended to coincide with the center of mass of the Earth.
As more and more precise measurements become available the datum changes.
To denote the different flavors of the same datum (called **realizations**),
it is customary to add a year or some other number to distinguish between them.

The original WGS 84 realization essentially agrees with NAD83 (1986).
Subsequent WGS84 realizations, however, approximate certain ITRS realizations.
Because GPS satellites broadcast the predicted WGS84 orbits,
people who use this broadcast information for positioning points
automatically obtain coordinates that are consistent with WGS84.

The US Department of Defense (DoD) established the original WGS84 reference frame
in 1987 using Doppler observations from the Navy Navigation Satellite System (NNSS) or TRANSIT.
In 1994, DoD introduced a realization of WGS 84 that is based completely on GPS observations,
instead of Doppler observations.
This new realization is officially known as WGS84 (G730)
where the letter `G` stands for "GPS" and "730" denotes the GPS week number (starting at 0h UTC, 2 January 1994)
when NIMA started expressing their derived GPS orbits in this frame.
Another WGS84 realization, called WGS84 (G873), is also based completely on GPS observations.
Again, the letter `G` reflects this fact, and "873" refers to the GPS week number
starting at 0h UTC, 29 September 1996.

The current WGS84 realization is called WGS84(G1150).

