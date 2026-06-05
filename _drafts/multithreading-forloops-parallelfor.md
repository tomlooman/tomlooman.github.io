---
title: "Multithreading with ParallelFor in Unreal Engine"
category: "C++ Programming"
tags:
    - "multithreading"
    - "C++"
date: 2026-01-01
last_modified_at: 01-01-2026
---

Multithreaded programming is significantly more challenging than simply running everything in a single thread (GameThread in the case of Unreal Engine). When trying to make your code run in parallel it is generally a good idea to keep it simple to minimize debug complexity.

One simple way to add concurrency to your game code is by using `ParallelFor` which lets you implement for-loops that split the work across multiple workerthreads. Like all concurrent programming, you need to strictly manage your (array) data and minimize access to other parts of your game code to ensure everything is thread-safe.

TODO: notice info about the Orion Project

## ParallelFor Batching

`ParallelFor` supports batching and it can be important to tune this to a good value to avoid too much overhead from starting these (mini) tasks on workerthreads in the first place.

In the code example, we batch per 1000, this reduces the overhead to whatever batch size the function would otherwise have used (32). This is necessary since the operation in the for-loop is nothing more than a simple Distance comparison.

TODO: code example from Orion coin pickup

TODO: direct link to the file on github

## ParallelFor Flags

TODO: explain the general purpose of the available flags