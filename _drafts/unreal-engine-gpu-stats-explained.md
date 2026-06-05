---
title: "Every GPU Stat Explained for Unreal Engine 5"
date: 2026-04-16
last_modified_at: 2026-04-16
categories:
  - "Performance & Optimization"
tags:
  - "Rendering"
  - "Performance"
  - "Nanite"
  - "Distance Fields"
coverImage: "Blog_MainHeroThumbnail_Logo.jpg"
---

Unreal Engine 5 has a ton of different render passes which can be difficult to reason about how it scales in performance. This article is my attempt at covering the major GPU stats for Unreal Engine 5 rendering and give some insights into what they mean, how they scale in cost, and how to optimize them or turn them off entirely as not everything needs to be enabled.

Unreal Engine does not do anything clever to know whether a certain render passes should actually run. Or at least, you cannot rely on this as I will show several examples that can often be turned off entirely depending in your content (something the engine itself wouldn't know ahead of time).


## UpdateGlobalDistanceFields

Mesh Distance Fields can be used in UE5 for a few features including:

- Lumen Software Ray-tracing (SWRT)
- Distance Field Shadowing
- Distance Field Ambient Occlusion

The engine is moving away from Lumen SWRT, focusing on a single HWRT render path which does not use Mesh Distance Fields. Besides your project is unlikely to use DF Shadows _if_ you are fully relying on Virtual Shadow Mapping. And DF AO is commonly reserved as a fallback when Lumen is not enabled. This means you might be able to distance generating Mesh DF entirely if your project does not need those features. Otherwise, there are ways to reduce the number of Global DF update triggers, explained below.

Any time a mesh with DF enabled is added, moved or removed in the scene an update is triggered. This can be expensive depending on the size of the updated mesh. Mesh Distance Fields are mostly enabled by default even if they aren't contributing to the overall scene and must be manually reviewed and turned off.

I have written more about profiling and figuring out which meshes are causing updates in my [Mesh Distance Fields article](https://tomlooman.com/unreal-engine-distance-fields/).


## SingleLayerWater

### SingleLayerWaterDepthPrepass

This pre-pass is enabled automatically when you *might* use Virtual Shadow Maps. The engine does not check whether you actually need this pre-pass, possibly wasting performance.

You can turn off the SLW DepthPrepass using `r.Water.SingleLayer.DepthPrepass`

The following is a comment directly from the engine source code:

````cpp
// Currently VSM is the only feature dependent on the depth prepass which is why we only enable it if VSM could also be enabled.
// VSM can be toggled at runtime, but we need a compile time value here, so we fall back to DoesPlatformSupportVirtualShadowMaps() to check if
// VSM *could* be enabled.
````

## Translucency Lighting Volume

The translucency lighting volume injects local light information into a volume texture for translucent materials such as particle effect sprites. You may not be using this lighting data and the engine will render each light into the volume regardless.

Check whether your Translucent Materials actually use a "Lighting Mode" under the Translucency material settings.

Turn off using `r.TranslucencyLightingVolume`.

You can read more about this on [the official docs](https://dev.epicgames.com/documentation/unreal-engine/lit-translucency-in-unreal-engine) including some CVARs to tune its performance

## Compute Volumetric Fog

The two primary variables to tune in `DefaultScalability.ini` are:

- `r.VolumetricFog.GridPixelSize` - lower is more expensive & detailed
- `r.VolumetricFog.GridSizeZ` - lower is cheaper as less detailed (depth)

### Course Lessons
- [Volumetric Fog Scalability - Case Study (The Forever Winter)](https://courses.tomlooman.com/courses/unrealperformance/lectures/63597213)

## CompositionBeforeBasePass

This will render **Deferred Decals** and Screen Space Ambient Occlusion (**SSAO**).

...

### Course Lessons
- [Deferred Decals (Component)](https://courses.tomlooman.com/courses/unrealperformance/lectures/55327738)
- [Mesh Decals (Notes & Best Practices)](https://courses.tomlooman.com/courses/unrealperformance/lectures/55327751)
- [Far Far West GPU Optimizations, Decals @ 38:08 Timestamp](https://courses.tomlooman.com/courses/unrealperformance/lectures/65604299)

## LightCompositionTasks_PreLighting

This is not a very clear name and it may be doing several things. Much like CompositionBeforeBasePass it may be rendering Deferred Decals and Screen Space Ambient Occlusion.

### DeferredDecals Emissive

If your decals have the Emissive channel connected, they will incur a second draw call during this pass. The primary rendering of Decals happens during the **Translucency** pass.

You can read more about [optimizing Deferred Decals](https://courses.tomlooman.com/courses/unrealperformance/lectures/55327738) in the Optimization Course lesson.


### ScreenSpace (AO)

When viewed in Unreal Insights, the stat as of 5.7 only shows "ScreenSpace" which is not very definitive in what is happening. the pass is rendering **Screen Space Ambient Occlusion** (this does show up when running `profilegpu` command...)