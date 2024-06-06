---
title: "Simple Timing Wheel"
sequence: "102"
---

The concept behind a hashed wheel timer is relatively simple:
imagine a rotating wheel with multiple buckets (or slots),
where each bucket corresponds to a time slot.
Timer tasks are hashed into these buckets according to their timeout values.
As the wheel rotates (with the passage of time), the tasks in the current bucket are executed.
