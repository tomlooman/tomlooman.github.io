---
title: "Circular Progress Bar for UMG"
date: 2015-08-19
categories: 
  - "User Interface"
tags:
  - "materials"
  - "UMG"
coverImage: "circularprogress_header.jpg"
sidebar:
    nav: sidebar-optimization
redirect_from:
  - /circular-progress-bar-for-umg/
---

We recently added a new locking feature to Switch for which we needed to have progress feedback. For this I built a circular progress bar in UMG. I'm giving away the material to use in your own projects. The download link is at the bottom. If you wish to learn more about the effect, keep reading - otherwise you can simply scroll down and download the material outright and explore it on your own. Enjoy!

![](/assets/images/circularprogressbar_overview.gif)

In the example above you may notice the circle starts at around 25% instead of at 0, that's because in UMG I only enable visibility if the key is held for \> ~0.2 seconds, to prevent showing the circle when a user is simply clicking. How you deal with this in your own projects is up to you.

## Material Breakdown

The material progress is controlled by a single scalar parameter ("Alpha") moving from 0 to 1. This parameter determines the cut-off in the radial gradient. With two sphere gradient Material Functions (comes built-in with the engine) we can clip the radial gradient into a nice circular shape. You can tweak the thickness by changing the size of the two spheres.

![](/assets/images/circularprogress_materialoverview.jpg)

## Texture Setup

An important setting to know about when dealing with grey-scale textures is to uncheck the **sRGB** setting inside the texture settings. This will give you an uncorrected gamma version which is recommended when dealing with grey-scale textures. Keep in mind that any material node that samples the texture needs to be updated to **Linear Color** instead of the default Color (the material compiler will complain about it automatically)

## UMG Example

You don't have to implement the material exactly like I did for Switch, the only required component is converting any kind of progress value to a 0 to 1 range. In the character class of Switch (C++) we set the time the key was pressed (LockActorHoldKeyTime in the sample below). From this we derive our progress to set in our material (after converting any progress to the 0-1 range) Have a look at an example of how I used the material in UMG.

![](/assets/images/circularprogress_umgoverview.jpg)

[Get Free Access](https://courses.tomlooman.com/p/unreal-materials-bundle) to this and the full Materials Bundle.

**Follow me on** [**Twitter @t\_looman**](https://twitter.com/t_looman) **for Unreal Engine tutorials and samples!**
