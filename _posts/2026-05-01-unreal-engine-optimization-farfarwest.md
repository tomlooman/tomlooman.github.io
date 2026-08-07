---
title: "GPU Profiling in Unreal Engine 5.7 for Far Far West"
date: 2026-04-30
last_modified_at: 30-04-2026
categories:
  - "Performance & Optimization"
tags:
  - "Rendering"
  - "Performance"
  - "Nanite"
  - "Distance Fields"
  - "Tutorial"
coverImage: "Thumb_YT_FarFarWestOptims_600.jpg"
---

This is the written Companion Guide to "Optimizing GPU Performance for “Far Far West". We go through the project in Unreal Engine 5.7 and explore opportunities for improving the GPU performance, especially for lower spec PCs.

<iframe width="560" height="315" src="https://www.youtube.com/embed/3qgd4glfIR0?si=EIetDNavVYiMWzUr" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

{: .notice--info }
Certain links in this article redirect to my paid [Complete Game Optimization for Unreal Engine 5](https://tomlooman.com/courses/unrealengine-optimization) course. These lessons provide additional detail on specific topics that we covered during the video. All info and CVARs mentioned during the video are included in this article directly.

## Hardware Used
- RTX 3060 (The GPU is the focus of this video)
- Ryzen 3950X
- 32GB RAM

## Relevant Profiling CVARs
- `stat gpu`
- `stat none`
- `stat unitgraph`
- `stat fps`
- `r.showmaterialdrawevents`
- `r.Nanite.Visualize.PixelProgrammableVisMode`

## Nanite (Masked Foliage)

The game is using Masked Foliage (for now) which requires some effort to get performant for Nanite. During the lesson we already make some improvements to the Material and by applying Foliage/Grass Density Scaling. 

The future is [Nanite Foliage](https://dev.epicgames.com/documentation/unreal-engine/nanite-foliage) with voxelization and fully modelled meshes, but this is still Experimental and Far Far West just released into Early Access and should avoid any instability risks.

### Blending WPO Disable Distance

The built-in toggle is can be jarring and so we should implement a blend in the foliage Material. I followed the [Smooth Fade WPO](https://raphaelgarcia.dev/lab/smooth-wpo-fade-ue5/) article and made some adjustments. The GetPrimitiveData did not function for the ISMs and decided to use a plain old Material Parameter instead that needs to be kept in sync.

### Foliage Scalability

- `sg.FoliageQuality` Controls the following CVARs:
    - `grass.DensityScale`
    - `foliage.DensityScale`

***Note:** We can't expect the engine to improve the Foliage and Grass systems as they will eventually **deprecate these two systems in favor of a single "[PCG](https://dev.epicgames.com/documentation/unreal-engine/procedural-content-generation-overview)" Pipeline** which was introduced for UE5. If you still rely on Masked Foliage, you could modify the engine and add a Pixel Programmable distance to Foliage and Grass to link up into Primitive Components. Look at the **WPO Disable Distance** which is present in these assets on how that can be done.


## Decals

We looked at the cost of decals specifically their size (projection cost), culling and whether they can be turned off entirely using [DetailModes (Lesson)](https://courses.tomlooman.com/courses/unrealperformance/lectures/55959889) for low-spec. The cost of decals are under both `CompositionBeforeBasePass` and `LightCompositionTasks_PreLighting`.

There is more details about [Deferred Decals (Lesson)](https://courses.tomlooman.com/courses/unrealperformance/lectures/55327738) in the Complete Game Optimization Course. [Mesh Decals (Lesson)](https://courses.tomlooman.com/courses/unrealperformance/lectures/55327751) are available as an alternative which can provide some benefits such as instanced rendering as part of Niagara Particle systems and better culling as they are essentially just Static Meshes rather than Decal Components but they do lack the same projection capabilities as Deferred/DBuffer Decals.

**Note:** After the recording I found out that the level contains two world-sized Decals to blend Sand material layer and Water Caustics across the entire region. This would be another reason why the total Decals cost is high beyond Decals found inside the town area. These are now turned off for the lowest spec to save on GPU cost while only slightly reducing visual fidelity.

### Relevant Commands
- `r.Decal.FadeScreenSizeMult 1`
- `r.DetailMode <0-3>`

## Distance Field (Shadows)

As the project is (going to) support DX11 on top of DX12, they will rely on DistanceField Shadows for low-spec/DX11 mode. This was conflicting settings together with Virtual Shadow Maps which does not require DF Shadows for distant shadows.

### Relevant Commands
- `r.DistanceFieldShadowing 0`

## Single Layer Water

Single Layer Water looks beautiful in Far Far West, we have some options to control the cost for low-spec PCs. We can explore whether to swap out the material completely for Low-Scalability settings.

### Relevant CVARs
- `r.water.SingleLayer.DepthPrepass`
- `r.Water.SingleLayer.DistanceFieldShadow`
- `r.water.SingleLayer.Reflections`
- `r.water.SingleLayer.DownSampleFactor`

## Additional Reading

Throughout the video I mention certain concepts you may not be familiar with such as Async Compute. I recommend checking out these references to learn more.

For questions or comments, feel free to [reach out to me](https://tomlooman.com/contact/)!

- [Async Compute](https://dev.epicgames.com/documentation/unreal-engine/asynccompute-in-unreal-engine)
- [Nvidia NSight Profiler](https://developer.nvidia.com/nsight-systems)
- [Custom Primitive Data](https://dev.epicgames.com/documentation/unreal-engine/storing-custom-data-in-unreal-engine-materials-per-primitive)