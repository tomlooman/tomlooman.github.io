---
title: "Mesh Distance Fields in Unreal Engine 5"
date: 2014-10-10
last_modified_at: 13-04-2026
categories: 
  - "Rendering"
tags:
  - "Rendering"
  - "Distance Fields"
coverImage: "DF_featured_03.jpg"
sidebar:
    nav: sidebar-optimization
---

Unreal Engine leverages the power of Signed Distance Fields for Ambient Occlusion and more recently added Ray Traced Distance Field Soft Shadows. I will briefly discuss and demonstrate both effects as a result of some early research to consider using these techniques for our game. Since the core of Switch's design hinges on fully dynamic levels, we simply cannot bake down any lighting. As a result we have to look out for a better approach to create scene definition and toning that is both fully dynamic and lightweight enough to run on a wide range of PCs.


## GPU Stat: UpdateGlobalDistanceFields

You may be seeing the **Update Global Distance Fields** (GPU) stat show up during profiling and want to figure out which components are causing those updates. Luckily this is very easy to dump and debug draw straight in your log and viewport.

- `r.globaldistancefield.debug.showstats 1`
- `r.globaldistancefield.debug.drawmodifiedprimitives 1`
- `r.globaldistancefield.debug.logmodifiedprimitives 1`

This will render boxes around modified primitives or log names to the output window. If the component name doesn't make much sense (it doesn't always seem to print the display name), you can **Search the name in the Scene Outliner** and it will still find a match to a component name that makes more sense to you.


## Distance Field Ambient Occlusion

The Unreal 4.3 release introduced [Distance Field Ambient Occlusion](https://docs.unrealengine.com/latest/INT/Engine/Rendering/LightingAndShadows/DistanceFieldAmbientOcclusion/index.html) using a Signed Distance Field. The basic principle of a distance field is that it represents the distance from the object to the point in the the grid. [ByteWrangler](https://bytewrangler.blogspot.nl/2011/10/signed-distance-fields.html) has a nice and simple explanation on distance field in 2d if you'd like to know more.

## Ray Traced Distance Field Soft Shadows

The preview release of 4.5 introduced [Ray Traced Distance Field Soft Shadows](https://www.unrealengine.com/blog/unreal-engine-45-preview-notes) to the Unreal Engine, while I am not aware of the full implementation details, I can show you the practical effect in-game using the Sun Temple & Effects Cave examples from Unreal.

The image below illustrates the basic goal of the soft shadowing technique, hard shadows near the caster that slowly soften as they get further away. This adds an incredible amount of shadow quality using a simple checkbox and can work wonders on your long normally low detailed directional shadows too when using high frequency details like rails.

![unreal 4.5 ray traced distance field soft shadows](/assets/images/ue45_softshadows_01.jpg)


#### Visualizing Distance Fields

The editor supports some cool visualizations, be sure to check the "_Mesh DistanceFields_" (shown below) when working with DFAO or soft shadows. The "_DistanceField AO_" visualizer only displays the generated AO as seen in the test wall comparison image above (under "DFAO in Switch")

![DF_Menuoptions](/assets/images/DF_Menuoptions.jpg)

## Further Reading

- [ByteWrangler](https://bytewrangler.blogspot.nl/2011/10/signed-distance-fields.html) has a nice and simple explanation of Signed Distance Fields (2D) with text rendering as example.
- [Unreal Engine - Distance Field Ambient Occlusion](https://docs.unrealengine.com/latest/INT/Engine/Rendering/LightingAndShadows/DistanceFieldAmbientOcclusion/index.html) details on setup, performance and limitations.
