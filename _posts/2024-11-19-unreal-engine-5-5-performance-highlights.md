---
title: "Unreal Engine 5.5 Performance Highlights"
date: 2024-11-19
categories: 
  - "performance-optimization"
tags:
  - "performance"
  - "performance-highlights"
  - "unreal-engine"
coverImage: "Blog_UE55ReleaseNotes.jpg"
---

The following Highlights are taken from the [Unreal Engine 5.5 Release Notes](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5.5-release-notes) and focus primarily on real-time game performance on PC and consoles. My personal highlights have some commentary on them and at the bottom you'll find a raw list of changes that I found notable. There were so many changes that even at the bottom I choose not to include everything, especially if the release notes were vague on their benefit or actual improvement.

I will include a lot of the amazing new features and improvements in my [Game Optimization Course](https://courses.tomlooman.com/p/unrealperformance)!

To kick off I'm starting with some lesser known changes which include some awesome additions like batched ticks and better profiling of input latency!

## Unreal Insights

- Preset for "light" memory tracing. In certain scenarios it can be useful to trace detailed allocations, but without paying the cost of recording callstacks and instead rely on tags for analysis. Enable light memory tracing by starting the process with `-trace=memory_light`.
    - Memory tracing add a lot of overhead and data, this light mode seems to be the answer for many scenarios where you are not digging too deep but want some high level info about memory.
- Added Trace.RegionBegin & Trace.RegionEnd commands
    - These commands allow developers to manually tag regions of insights traces with custom names.
    - These are now available as Blueprint nodes too which is great to add context to profiling your game code that runs across multiple frames. As an example Garbage Collection start/end is a timing region. Level streaming spread across multiple frames is also added to insights as a timing region.
- Add 'Copy Name To Clipboard' context menu option.
- Trace Screenshot now has a Blueprint Node
- Introduced `_CONDITIONAL` variants to `TRACE_CPUPROFILER` and `UE_TRACE` macros.

## Core/Foundation

- Add StaticLoadAsset, LoadAssetAsync, and FSoftObjectPath::LoadAsync functions to make it easier to asynchronously load objects from C++.
- Changes the trace marker used for denoting GameThread async flushes to now clarify if a flush of all in-flight async loads is being performed or if the game thread is flushing only a subset of all loads. The "Flush All Async Loads GT" marker makes it easier to detect and fix bad behavior since, except for a few special cases, we should never wait for all loads and instead should be specifying a subset.

## Gameplay

- Add a new **Tick Batching system** for actors and components which can be enabled by setting the `tick.AllowBatchedTicks` cvar. When enabled, this will group together the execution of similar actor and component ticks which improves game thread performance. Also added options like ForEachNestedTick to TickFunction to better support manual tick batching (which can be faster than the new automated batching)
    - This is awesome and overdue for years. This can greatly improve GT performance by better using the CPU cache by ticking all actors/components of the same class together.
    - The ForEachNestedTick can further reduce individual tick overhead by letting you run through a simple loop and run your tick logic for all objects directly in the single function.

## Rendering

- **Input latency stat computation** enabled for DX11/DX12 using IDXGISwapChain::GetFrameStatistics and correlate the input reading timestamp to when the frame is handed to the display
    - New command line option `r.VsyncInformationInsights` that will show **bookmark in Unreal Insight** for when the input sampling happen and when the Vsync event happen in the timeline.
    - This is excellent to make input latency testing more easy.
- Added support for asynchronous pipeline state caching, which is enabled by default. It can be disabled to restore the old behavior with a console variable (`r.pso.EnableAsyncCacheConsolidation`).
- D3D12: Add mode to **set stable power state on device creation instead of only during profiling** This can be useful for in-editor benchmarking on PC by reducing the influence of adaptive GPU clock rate on the frame time.
- AlwaysVisible: Return the latest time for components with scene proxies that are marked as always visible rather than updating the component time for each one. Saves multiple ms of CPU time in CitySample. _(Not mentioned in Release Notes, but here is the [Commit on GitHub](https://github.com/EpicGames/UnrealEngine/commit/c660d47ed1afbecf764831964fc9220f0b62a340))_

## MegaLights (Experimental)

_“MegaLights is a new Experimental feature that allows artists to add hundreds of dynamic shadow-casting lights to their scenes. Artists can now light scenes playfully without constraints or impact on performance. With MegaLights, lighting artists, for the first time, can use textured area lights with soft shadows, lighting functions, media texture playback, and volumetric shadows on consoles and PC.”_

This is very exciting and will explore this in detail in a _future_ release since it’s still so early in development. At first glance it \*might\* be their own implementation of ReSTIR by Nvidia and relies on ray tracing (although HWRT does seem to be optional, but recommended). Check out the [MegaLights documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/megalights-in-unreal-engine) as this already explains a lot more than I could here right now.

## More Render Parallelization

In 5.4 we already saw major improvements to render threads, 5.5 continues this trend with further improvements described as follows:

_“For 5.5 there are improvements to parallel translation, which issues RHI (Render Hardware Interface) tasks to translate RHI command lists into platform command lists. The impact of this change is a dramatic performance increase of up to 2x (dropping by 7ms on some platforms), reducing the number of stalls, and offering a minor reduction in drawcalls as well as small improvements to platform dynamic res and render thread time."_

_"Release 5.5 also includes improvements to asynchronous RDG (Render Dependency Graph) execute tasks which benefits both critical path rendering thread time on the order of 0.4ms, as well as allowing asynchronous execution of approximately half of slate rendering.”_

This is a very welcome improvement as RenderThread and RHI Thread optimizations were historically quite difficult compared to GameThread optimizations. We don’t need to do anything to get these enabled which is even better. Previously we often saw many stalls and idle waits on these threads, I hope we will see meaningful improvements here but I have yet to try this out in production.

## Lumen Improvements

As with nearly every release, we see further Lumen performance improvements. Their target appears (60hz) **hardware ray tracing** on consoles, which previously wasn’t viable unless you were targeting 30hz. So most games often opted for software ray tracing on consoles. Allowing HWRT is especially great for visual quality as software ray tracing is notoriously unstable visually in my experience.

## Hardware Raytracing

HWRT in general has seen major improvements. Besides better translucency rendering, we can see performance improvements thanks to better caching and use of acceleration structures. All these improvements will affect a variety of rendering features including Lumen, MegaLights and even light baking.

## Light Function Atlas

Light Function Atlas is an improvement over the traditional light functions which were relatively costly (See below as to why), with this baked 'light function atlas' should see significant rendering improvements. There is some extensive documentation on this which is worth a read if you’re intending on using [light functions](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-light-functions-in-unreal-engine) in your project.

_"Light functions can only be applied to lights with their mobility set to Movable or Stationary and cannot be baked into lightmaps. Light functions follow the same expensive rendering passes as lights that cast dynamic shadows, because the light function contribution needs to be accumulated in screen space first. The light function's second pass then evaluates the lighting in screen space. This is a sequential operation that happens on the GPU, and it takes more time due to resource synchronizations and cache flushes that happen."_ - The Docs.

## Niagara Lightweight Emitters (Beta)

[Niagara Lightweight Emitters](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-lightweight-emitters). A more limited particle (stateless) emitter which should significantly reduce overhead when running many simple emitters. These should be very interesting for simple VFX such as light flares or other ambient effects such as dust or sparks. I will absolutely cover these in my Optimization course in the future, for now they are still in Beta.

Check out the docs as they explain some of their limitations including which modules can be used.

## Niagara Data Channels

[Niagara Data Channels](https://dev.epicgames.com/documentation/en-us/unreal-engine/niagara-data-channels) allow for events to run Niagara logic which can be great for improving impact FX. This can easily instance impact decals and spawn multiple impact sparks at multiple places using a single Niagara system. These are now production ready in 5.5 and well worth a try if you are looking to manage more short lived FX, meshes or decals.

Some immediate benefits include much cheaper to spawn/destroy these impacts and it lets us more easily instance certain meshes such as (Mesh) Decals. We'll create far fewer short lived components to reduce cost of instantiation and eventual Garbage Collection.

If you're looking for an example, Lyra has an example of this where they manage one Niagara System per weapon to handle impact VFX through these Data Channels. You can see how they easily instance their (Mesh) decals.

## World Partition - Static Lighting (Experimental)

Seems like light baking isn’t dead yet! Lumen is still expensive and not always viable. Allowing baked lighting into world partition levels is a very interesting improvement. It requires `r.AllowStaticLightingInWorldPartitionMaps=1` to be enabled in `DefaultEngine.ini`

## Instanced Actors

_“Instanced Actors is a new feature designed to reduce the overhead of having too many actors in your game world. It does so by replacing actors with Mass entities and converts on-the-fly between actors and entities (called hydration/dehydration), providing a lot more performance out of densely populated open world environments. The conversion is controlled by the Mass LOD system using distance to viewer logic, and physics traces can be used to trigger hydration as well."_

_"This works best when you have many actors using the same mesh, for example rocks and trees in large environments.”_

Instanced Actors feature is potentially huge for many as high Actor counts in your level has all sorts of bad side effects (including the infamous traversal stutters during level streaming - I \*hope\* this can help reduce those but have yet to try this in production).

In my understanding, this will (eventually) replace the [LightWeightActor](https://x.com/t_looman/status/1814216353374490895) which never got much attention since it was introduced in 5.0.

## Mutable - Customizable Characters and Meshes (Beta)

Another excellent new feature is the merging of skeletal meshes at runtime in a significantly better way than what was previously possible. **Mutable** generates dynamic skeletal meshes, materials and textures at runtime for creating character customization systems and dynamic content.

- Mesh and texture merging to reduce draw calls.
- Morph baking to reduce GPU load.
- Baked texture effects such as layering and decal projection to reduce GPU load.

## Nanite Mesh Texture Color Painting

We are finally getting an alternative to **Vertex Painting for Nanite**! It's not directly a performance improvement, but a potentially significant workflow improvement that will affect rendering optimization possibilities.

Where previously you needed to rely on Decals to get variation back into your levels after moving to a Nanite workflow, you can now opt for painting into textures (rather than direct into vertices as was how we used to add variation through Vertex Painting) to get this traditional workflow back with Nanite!

## Misc. Changes

There are so many more improvements and optimizations that I can't all be commenting on. Some of these are still very exciting improvements such as the improvements to task system, removing the random spikes or the improved async load flushing which I've seen is so often an issue with projects.

### Core/Foundation

- **Fix potential deadlock and reduce latency spikes in the task system**
- Changed `UWorld::BlockTillLevelStreamingCompleted` implementation to **no longer flush all in-flight async loads globally and instead only flush outstanding streaming level async requests.** In large projects this can save significant amounts of time entering PIE. Specifically,
    - ULevelStreaming now provides a protected member AsyncRequestIDs to keep track of async loads issues when loading a level. During OnLoadingFinished AsyncRequestIDs will be cleared.
    - If a child class of `ULevelStreaming` has not recorded any async loads in AsyncRequestIDs, we fallback to flushing all async loads as before since we can't know if implementers are relying on the past behaviour of a forced flush of all async loads.  
    - CVar `s.World.ForceFlushAllAsyncLoadsDuringLevelStreaming` has been added allowing one to revert back to old flushing behavior temporarily while work to track necessary loads can be done.
- Add a RunCommandlet console command. Allows for faster iteration when debugging commandlets in the editor (e.g via hot reload)
- Add a thread-safe ref-counting mechanism to UObjects. Make TStrongObjectPtr more light-weight and usable on any thread by using ref-count instead of FGCObject. Add a pinning API to WeakObjectPtr so they can be converted safely to StrongObjectPtr from any thread. Make delegate broadcast thread-safe when used with UObjects by pinning during broadcast for non game-thread.
- The old task graph API now uses the new task system under the hood to improve scheduling behavior.
- Provide better API for AssetManager and StreamableManager to allow additional performance optimizations. Let the user pass TArray instead of the TSet into GetPrimaryAssetLoadList which let them avoid creating of unnecessary array copy when passing the list to AsyncLoading.
- Replaced persistent auxilary memory with a new Persistent Linear Allocator. Some persistent UObject allocations were moved to it to save memory.
- Expose GC time interval parameters inside UEngine. Allow override GC frame budget.
- Replace busy wait APIs with oversubscription to fix common deadlocks and reduce CPU usage.
- UnrealMathSSE cleanups enabled by having SSE4.2 min spec; also some UnrealMathNEON cleanups.
- Improved performance of FMallocBinned2 and FMallocBinned3
- Optimized memory footprint of FMallocBinned2 and FMallocBinned3
- Fix -execcmd parsing to allow multiple instances
- Added a -setby= option to DumpCVars, to filter on how they were set, like "DumpCVars r. -setby=DeviceProfile" will show all rendering (r. prefix) that were last set by a DeviceProfile
- Add cvars VeryLargePageAllocator.MaxCommittedPageCountDefault and VeryLargePageAllocator.MaxCommittedPageCountSmallPool to limit the number of large pages committed for each pool. Since VLPA very rarely releases pages, this avoids the situation where VLPA permanently holds too much memory, leaving less for other large allocations or rendering etc.
- Added optimized single element TArray Remove\* overloads which don't take a count.
- Improves DoesPackageExistEx by enabling it to use the AssetRegistry when available, avoiding costly OS call
- Compilation: Add support for the OptimizationLevel param for Clang-CL (so -Oz is used for OptimizeForSize etc). This includes optimal flags for PGO, since -Os tends to be the fastest option there (in addition to being smaller)

### Gameplay

A variety of tick related improvements, including the Batched ticking mentioned earlier in this post which are fantastic additions.
- Deprecated `FTickableObjectBase::IsAllowedToTick` because it was slow and redundant with the existing IsTickable function. The new SetTickableTickType function is a more efficient and safer way to dynamically disable tick
- As part of the performance improvements to world ticking, static level collections will no longer be created by default. These were only used by the disabled client world duplication feature (but they can be created by setting s.World.CreateStaticLevelCollection)
- Several performance improvements to world ticking, especially when using world partition

### Rendering

- Added ECVF\_Scalability flag to r.Shadow.NaniteLODBias
- Add the EVCF\_Scalability flag to foliage.LODDistanceScale
- DirectionalLight : Add a setter for AtmosphereSunDiskColorScale on the proxy so we don't need to fully recreate the renderstate each time it changes. This avoids 20ms spikes on the render thread
- Cleaned up and reduced tonemap shader permutations for faster compilation.
- Added DumpMaterialInfo commandlet, which writes a CSV with properties of all matching materials to disk.
- Added a project setting, r.GPUSkin.AlwaysUseDeformerForUnlimitedBoneInfluences, that allows you to enable Unlimited Bone Influences in a project without compiling extra shader permutations for GPU skinning. This saves runtime memory, disk space and shader compilation time. When the setting is enabled, any mesh LODs using Unlimited Bone Influences that don't have a deformer assigned will use the DeformerGraph plugin's default deformer. This ensures that UBI meshes are always rendered with a deformer, and therefore the GPU skinning permutations for UBI aren't needed. Also added a per-LOD setting that allows users to disable mesh deformers on a specific LOD, which could be useful for controlling performance, e.g. disabling an expensive deformer on lower LODs. Some changes to functions on USkinnedMeshComponent lay the foundations for having different deformers on different LODs as well.
- Cleanup r.MinScreenRadiusForCSMDepth which is not used anymore, r.Shadow.RadiusThreshold is now used for culling shadow casters.
- Add basic DX12 Work Graph support. For this first pass there is no exposed RHI functionality for directly dispatching a work graph. Instead shader bundles have been extended to support a work graph based implementation. Nanite compute materials now can use work graph shader bundles on D3D12 when r.Nanite.AllowWorkGraphMaterials and r.Nanite.Bundle.Shading are both set. Both of these default to off at the moment.
- Add instance culling for decal passes so that HISM decals now work instead of only the first decal instance being visible.
- Implement a faster batched path for translucency lighting volume injection. Added a more accurate RectLight integration for translucency light volume (to both paths).

### Shadows

- \[VSM\] Added counters to Unreal Insights tracing. Requires both VSM stats and Insights counters to be enabled. (r.Shadow.Virtual.ShowStats 1 and trace.enable counters)
- Perform PresizeSubjectPrimitiveArrays of whole scene shadows once per task instead of redundantly per packet for improved performance. Thanks to CDPR for this contribution.
- Add a separate cvar to control how long unreferenced VSM lights live - r.Shadow.Virtual.Cache.MaxLightAgeSinceLastRequest - separate from the per-page ages. Keeping VSM lights around too long can cause too much bloat in the page table sizes and processing, reducing performance in various page-table-related passes (clearing, etc).
- \[VSM\] Adapted debug viewmodes to better show local lights. Visualization modes now show a composite of all lights by default, and change to showing individual lights when one is selected in editor or by name. With r.shadow.virtual.visualize.nextlight, you can select the next light for visualization. When VSM visualization is enabled, one pass projection is now turned off, as it is incompatible with the debug output in the projection shader.
- Refactor virtual shadow map invalidations to improve instance culling performance.
- Changes to how WPO distance disable is handled in the virtual shadow map pass.
    - See r.Shadow.Virtual.Clipmap.WPODisableDistance.LodBias and associated notes for the difference in WPO handling in shadow passes.

### Lumen

Lumen received a lot of performance changes, they are pretty technical and mostly automatic. But I’ve included them here as they do mention specific passes you should see improvements for.

- Added foliage specific cutoff for screen probe importance sampled specular. This can improve perf on consoles depending on the settings, scene and resolution.
- Move hit velocity calculations a bit further in the shader in order to optimize number of VGPR. This improves shader occupancy % in the LumenScreenProbeHardwareRaytracing pass.
- New Lumen Refection denoiser. It's sharper, faster, has less noise and has less ghosting.
- Don't build the ray tracing light grid if it's not used by Lumen. Saves performance when HWRT is used with Lumen.
- Implement inline AHS support for Lumen on certain platforms. This speeds up AHS handling in Lumen.
- Run AHS only for meshes with some sections casting shadows. Fully disabled shadows can be filtered out at an instance level, but GI and reflection passes still need to run AHS on those sections.
- Overlap Radiance Cache updates (opaque and translucent). Those two passes have low GPU utilization, so it's a pretty good optimization where translucent cache traces become almost free.
- Optimize ray tracing performance by pulling out Surface Cache Alpha Masking code to a permutation, which saves some VGPRs in tracing passes.

### Materials

- Added the "Automatically set Material usage flags in editor default" project setting to enable/disable making new Materials automatically set usage flags.
- The various recent improvements to the shader compilation pipeline means that there are a number of transformations that shader code undergoes before making it to the runtime (deduplication, deadstripping, comment stripping, removal of line directives, etc.). As such it’s not always obvious when looking at a shader in a capture (RenderDoc or similar) what it is and how it was generated. To improve this a DebugHash\_ comment is now added to the top of the final shader code passed to the compiler, as well as exporting a DebugHash\_.txt file alongside ShaderDebugInfo for any compiled permutation. With both of these changes it's now possible to quickly find the dumped debug info for whatever shader you are looking at in a capture by pasting the contents of the above comment into Everything (or whatever other file search mechanism you prefer). Note that this requires both symbol and debug info export to be enabled
- Updated DirectXShaderCompiler (DXC) to version release-1.8.2403.

### Nanite

- The Nanite streaming pool is now allocated as a reserved resources (r.Nanite.Streaming.ReservedResources) on RHIs that support it. This allows it to resize without a large memory spike from temporarily having two version of the buffer in memory.
- Added the ability for the streaming pool size (r.Nanite.Streaming.StreamingPoolSize) to be adjusted at runtime, for instance in game graphics settings.
- The Nanite streamer now adjusts the global quality target dynamically when the streaming pool is being overcommitted. This makes it converge to more uniform quality across the screen in those scenarios.
- Disable async rasterization for Lumen Mesh Card pass and Nanite custom depth pass as it was causing large stalls while waiting for previously scheduled work in the async queue to finish.
- Improved performance of Nanite tessellation patch splitter and rasterization shaders on console platforms.
- Optimization: Added sorting of Nanite rasterizers (r.Nanite.RasterSort) to increase depth rejection rates for masked and PDO materials.

### Niagara

- Some improvements to the HWRT async traces within Niagara. Adds support for inline HW traces, where supported, through a compute shader (in some artificial tests it results in 50% performance improvement, but results will vary). Also fixes up collision group masking.
- Don’t forget to check out the Niagara lightweight emitters & Data Channels!

### Post Processing

- Adding ECVF\_Scalability to r.LUT.Size. Default remains the same = 32.
- Add Medium-High TAA mode (3) Equivalent filtering quality to Medium, adds anti-ghosting Slightly slower than Medium (1), much faster than High (2)
- \[Engine Content\] Set bloom kernel to default to 512 px. This comes up often as a opportunity for optimization.

### Animation

- Small performance improvements for motion matching

### Landscape

- Added system to invalidate VSM pages when using (non-Nanite) landscape, to hide shadow artifacts induced by the vertex morphing system of standard landscape : Relies on pre-computing max height delas from mip-to-mip for every landscape component Invalidation occurs when the evaluated max delta between the heights at the LOD value that was active when VSM was last cached is different enough from the heights at the current LOD value (for a given persistent view), based on a height threshold that is tweakable per landscape and overridable per landscape proxy Invalidation doesn't occur when Nanite landscape is used The invalidation rate is decreased as the LOD value goes up, controlled by a screen size parameter in the landscape actor (overridable per proxy), under which no invalidation will occur. This avoids over-invalidating VSM on higher LOD values, since they tend to occupy less real estate and therefore don't need to have perfect shadows
- Added per landscape (overridable per-proxy) shadow map bias to help with this problem too
- Added 3 non-shipping CVars to help tweak those 3 parameters in-game (landscape.OverrideNonNaniteVirtualShadowMapConstantDepthBiasOverride, landscape.OverrideNonNaniteVirtualShadowMapInvalidationHeightErrorThreshold, landscape.OverrideNonNaniteVirtualShadowMapInvalidationScreenSizeLimit)
    - The whole invalidation system can be enabled/disabled via CVar landscape.AllowNonNaniteVirtualShadowMapInvalidation
    - Added another CVar (landscape.NonNaniteVirtualShadowMapInvalidationLODAttenuationExponent) to tweak the screen-size-dependent invalidation rate curve shape
- Fixed landscape.DumpLODs command : now works without parameter and can be used several times
- Removed redundant calls to SupportsLandscapeEditing when ticking landscape proxies for grass. This is to avoid O(N^2) complexity when iterating on landscape proxies for ticking grass.
- Made landscape collision settings overridable per-proxy

### Networking

- Added CSV Profiling Stat tracking for
    - Average Jitter (milliseconds)
    - Packet Loss Percentage (In/Out)
- Added CSV profiling markers to Oodle
    - when processing incoming & outgoing packets

### NavInvokers

- Avoid reserving local containers every frame.
- Now using a map instead of an array to avoid high cost as invoker usage scale up.

### Chaos

- Chaos::add CVar for joint simd in scene simulation. Use "p.Chaos.Solver.Joint.UseSimd" to control if joint solver uses SimD. It might improve performance of the solver up to 15%.
- Implemented Quality Level Min Lod for Chaos Cloth Assets, which can be enabled via the Engine.ini file. This matches how Quality Level Min Lod works for Static Meshes and Skeletal Meshes. The cvar p.ClothAsset.MinLodQualityLevel can be set in per platform ini files to manage MinLodQualityLevel on a per-platform basis.
- Reduced Geometry Collection physics proxy runtime memory footprint by better packing data structures.

**Note**: There are even more release notes available that would fall under the performance or optimization umbrella but that lacked proper context and/or are too niche to be notable.

And finally, be sure to check out my [Game Optimization Course](https://courses.tomlooman.com/p/unrealperformance) for a huge list of lessons on optimization tricks while guiding you through the process of profiling and optimizing your game projects! There I will have a change to go into much greater detail on all these improvements and features in video lessons and detailed text explanations...
