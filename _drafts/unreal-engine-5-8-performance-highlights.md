---
title: "Unreal Engine 5.8 Performance Highlights"
date: 18-06-2026
last_modified_at: 18-06-2026
categories: 
  - "Performance & Optimization"
tags: 
  - "Performance"
  - "performance-highlights"
coverImage: ""
excerpt: ""
---

It is time again for possibly the last Performance Highlights overview for Unreal Engine 5. The release of UE 5.8 marks the final release before Epic Games is moving development efforts to Unreal Engine 6.

That brings the focus of 5.8 to stabilize and optimize existing features. Although new experimental features such as Mesh Terrain have still been added. A couple of major performance oriented improvements include MegaLights turning production ready and Lumen receiving a new Lite-mode for better scalability across devices. You can find the full release notes [here](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes), but let's first dive into the most interesting improvements made that focus on Performance & Optimization. As usual I add my own remarks to the release notes and clarify changes where necessary.


{: .notice--info }
This article is part of my efforts of keeping Unreal Engine developers informed about Game Optimization! For that I have a in-depth [Game Optimization Course for Unreal Engine 5](https://tomlooman.com/courses/unrealengine-optimization/) to train engineers and tech artists everything they need for profiling, optimizations and understanding performance in UE5. 

Unreal Directive has a [Console Variables page](https://unrealdirective.com/resources/console-variables/?version=5.8&new=1) that shows **new CVARs added in 5.8** which is a good way to find out new ways to tune new or existing features. For example, you can see many `a.budget.*` CVARs are new and worth exploring if you use that feature.

## MegaLights

MegaLights is now production ready. They greatly reduced the noise, overall performance to use this at 60hz. [View Docs](https://dev.epicgames.com/documentation/unreal-engine/megalights-in-unreal-engine)

## Lumen Lite

"Lumen Lite is a new medium-quality setting for Global Illumination using Irradiance Fields with Probe Occlusion supported by Lumen. It's twice as fast as Lumen high quality - which targets 60fps on PlayStation 5, while maintaining the art direction for games that rely on Global Illumination. This path is the new default for current-generation handheld consoles, where it can be used at 60fps, and it is supported on PC as well."

This new mode allows for better scalability which has been a problem to maintain with Lumen. The docs have been updated with [Lumen Lite](https://dev.epicgames.com/documentation/unreal-engine/lumen-performance-guide-for-unreal-engine). Epic still labels this as Beta.


## Lumen

Enabled Lumen applying height fog to reflection ray hits by default (`r.Lumen.HeightFog 1`).
- Cost is about.03ms on High GI settings on 2080 at 1080p.

Deprecated SSGI (Screen Space Global Illumination). SSGI is superseded by Lumen GI. // The intend is most likely to just use Lumen Lite now instead of SSGI as this relied too much on screen space information and was not a full solution in itself.

## Rendering

Reduced the CPU cost of `CreateCommittedResource` and reducing memory pressure by keeping unreferenced resources out of **VRAM**. Controlled by read-only CVar `D3D12.ResourcesStartResident`, by default Off.

If it is desired, a licensee can enable mimalloc via `UE_APPLE_USE_MIMALLOC_MIN_FREE_RAM_MB` project define at a cost of a significant memory footprint. The define sets a minimal free RAM threshold that is checked on startup and if the device has free memory above that limit, it will instantiate mimalloc.

## Lighting

### Distance Fields

Allow distance fields to run on `GRHIDeviceIsIntegrated`. This check was added a decade ago to prevent issues on some outdated drivers, but nowadays it prevents some pretty capable SM5 GPUs to run distance field features. // This seems great for integrated GPUs that can now use SDFs for lighting features such as DF shadows, DF ambient occlusion or even Lumen's Software Raytracing.

Distance Fields: Remove distance field shader permutations when distance fields are disabled in project settings. // more projects are able to disable SDFs entirely, this helps reducing the overall shader permutations which is always a win.

Fixed pooled buffer and texture memory leaks in GlobalDistanceField when changing global distance field resolution at runtime.

## Variable Rate Shading

Fixed an issue where Variable Rate Shading was not properly applied to the ReflectionEnvironmentAndSky pass even when r.VRS.ReflectionEnvironmentSky was enabled.

## Mutable

...production ready

"We made performance improvements across the board, including parallel updates to boost generation throughput for crowds, reduced game thread workload, and optimized mesh and texture operations."

## MetaHuman Crowd (Experimental)

A new experimental plugin to use MetaHumans in crowds that should scale to thousands of characters.

https://dev.epicgames.com/documentation/metahuman/metahuman-crowds-in-unreal-engine

## Fast Geometry Streaming Plugin

Fast Geometry Streaming is still marked Experimental in 5.8 but continues to receive wider support ("Added decal, point, spot and rect lights components support.") to make this more valuable to avoid any streaming related hitches.


## World Partition

Unreal Insights: "We added world partition streaming debugging tools to Unreal Insights and Unreal Editor, making possible per-cell analysis and sessions playback."

## Mass Framework Refactor

Mass Framework received a major overhaul.

"Mass Signals are now part of the core engine, and entities can be created off the game thread thanks to archetype-based, lock-free scheduling. A new sparse/virtual fragment system reduces memory use and allows optional fragments and tags to be added or removed without triggering costly archetype changes."

"We completely overhauled Mass processor execution and dependency resolution to better take advantage of multi-core CPUs, resulting in safer and faster execution on modern hardware. This is supported by more granular scheduling and thread-safe observer notifications."

https://dev.epicgames.com/documentation/unreal-engine/mass-entity-in-unreal-engine

## Horde - Performance Reporting (Experimental)

"Improvements to Horde Analytics tooling continues in UE 5.8 as an Experimental feature with improvements to dashboard UX for job steps (CPU, memory usage) and job health observability."

"We've also introduced a new view in Horde which shows runtime trends outputted from the Automated Performance Tests framework (APT) and the Perf Report Tool (csvprofilers), highlighting key metrics such as GPU/CPU times, peak memory usage and hitch reports so regressions can be spotted. This currently relies on users having their own database store model."

link to Matt's talk abouts this recently?

## Mobile Renderer

- Multi-pass deferred rendering as the default path across mobile platforms (with forward rendering still available as an opt-in).
- Mobile support for SSAO, SSR, deferred decals, contact shadows, and higher-quality water rendering.

In UE 5.8 introduces half-precision (FP16) shader usage in targeted materials and global shader passes, improving performance while preserving visual quality.

## FBX Importer

uFBX library (Experimental) noticeably reduces import import times especially on heavy `.fbx` files containing large meshes. Users with multi-core CPUs will also notice improvement for files with a large number of meshes.

## Sandboxes

Sandboxes provide an isolated workspace where you can experiment without affecting the main project. Open a sandbox, create and edit freely, and persist only what you want to keep

- You no longer need to spin up a side branch, copy assets to a WIP folder, or worry about polluting your revision control just because you want to try something out.
- Create a sandbox and work inside it without affecting the project content Browse, switch, and see changes in sandboxes from a dedicated browser
- Persist only the changes you want to keep in your project
- Export a sandbox to share with a teammate, or import one to pick up where they left off

// notice info
While not directly performance related, it is an very interesting workflow improvement to experiment with changes to the world, materials, etc that affect performance in unknown ways.

## Chaos Visual Debugger

The Chaos Visual Debugger (CVD) provides Unreal Engine users with a way to effectively observe and debug their physics simulations, either directly in the Unreal Editor or from a standalone CVD instance. UE 5.8 updates include:

- A camera tracking system.
- The geometry visualization panel.
- Multi-select support.
- A trimesh complexity view.

I love this cool to get insights into how the collision/physics scene is constructed as it's such a common cause of performance issues. Bloated physics scenes affect streaming performance and memory cost. On top of more expensive collision/trace queries for all your game code.

## Chaos Caching

The Caching framework project focuses on extending the existing system for storing and replaying simulation data efficiently across Chaos-based features like Cloth, Fluids, Destruction, and Flesh. UE 5.8 updates include:

Per-component caching in sequencer.

Supports both editor-side baking and runtime playback.

## Compile Time Improvements

Reduced linking time on clang with LTO (Link-Time Optimization) by disabling debug info upgrading, since we build everything with the same toolchain.

Not specified by how much, but faster is always a win.

## Unreal Insights

Added "UObject Count" trace counter. // use 'counters' trace channel. This is helpful to keep an eye on your total objects count which directly affects garbage collection performance (and memory in general).

Add bandwidth and percent value types for graphs and counter stats.

### Add Annotations inside a trace

Unreal Insights users can now create time, time range, and event-based annotations in Unreal Insight traces. The annotation data is saved in a sidecar.ini file that can be shared. This feature is to help individuals and teams with the performance analysis of trace files.

## hitch snapshots

Added "snapshot hitches" feature. This feature relies on the stats system to detect hitches. When a hitch is detected a trace snapshot and screenshot is written to the Saved/Profiling/Hitches directory. Frames are dumped into a directory for each process instance. Start tracking hitches by using in-game console command `snapshothitches -start` and disable by using `snapshothitches -stop`. Requires some stat group to be active, like `stat default`.




## Garbage Collection

GC: Add the option to GC based on pending actors to unload (in addition to existing mechanism that uses number of levels) for finer control (disabled by default). Number of levels can be inaccurate given the discrepancies between level counts and memory impact. across main grid / data layers Add the option to GC based on pending actors to unload (in addition to existing mechanism that uses number of levels) for finer control (disabled by default). 

Controlled via `s.ContinuouslyIncrementalGCWhileActorsPendingPurge`/ `s.LevelStreamingLowMemoryActorsPendingPurgeCount` and `wp.Runtime.LevelStreamingContinuouslyIncrementalGCWhileActorsPendingPurgeForWP` (for partitioned worlds).

## Oodle

Oodle updated to 2.9.16.

https://www.radgametools.com/oodlehist.htm

## Core

Changed MallocBinned3 max small bin config to 14kb by default as it offers better performance\memory in our testing.

Added IsLockedByCurrentThread() to the recursive mutex types.

Asset registry cache will now memory-map its tag data storage, reducing RAM footprint by GBs in large projects.

## Streamable Manager

Streamable Manager:

Added a mechanism to just-in-time trickle async load requests on a streamable handle.

Added a mechanism to batch/trickle async load requests on a streamable handle.

Opt-in (enabled via UE_ENABLE_STREAMABLE_JIT_ASYNC_LOADING=1) and by setting bUseJustInTimeAsyncLoader=true or if batching is enabled globally (s.StreamableEnableJITAsyncLoadingGlobally).

The initial batch size is set as per s.StreamableJITAsyncLoadingInitialBatchingFactor which is a factor of the total number of requests queued for a streamable handle (default is 0.25).

This can be used to cancel or queue subsequent async load requests at updated priorities (see FStreamableHandle::SetPriority) which would get picked up when subsequent requests are queued.

Opt-in by setting bUseJustInTimeAsyncLoader=true or if batching is enabled globally (s.StreamableEnableJITAsyncLoadingGlobally).

Added FrameNum and UTC time to `stat unit` so we have a way to match up video captures with logs, etc. Requires setting "stats.UnitTimestamp" cvar to enable.



// I STOPPED AT "FRAMEWORK" header just below the "INSIGHTS" header. first line start with "level streaming persistence".

## Framework

LightWeightInstances code marked as deprecated. // This was supposed to be a static swap-in replacement for the full functionality Actors but never took off.

## Nav Mesh

Optimized Detour navmesh link memory by sizing the base link pool to actual usage (~30 MB savings on large maps); exposed bMinimizeLinkPoolSize and added link utilization stats to DumpNavMeshMemory.

Optimized navmesh vertex storage by packing vertices as tile-local float offsets (~50% memory reduction on vertex data); navmesh version bumped to 28 with automatic legacy-format upgrade on load.

Optimized FRecastNavMeshGenerator::RemoveTiles to reduce a hang when many tiles are dirty simultaneously.

## Blueprint

Added simple counter to ensure if too many Blueprint async actions are created. The number of allowed actions can be set using the console variable `bp.MaxAsyncActionCount`. Set the number to <= 0 to disable the ensure.

## Mass

### Mass Trace

Add missing trace events for archetype creation and entity moves during archetype splitting in MassEntity Introduce a batch UE_TRACE_MASS_ENTITIES_MOVED macro to trace multiple entity handles in a single call.

## Iris Networking

Added API for network HandlerComponents to indicate support for being run in parallel. Enabled `NET_ANALYTICS_MULTITHREADING` so that `OodleNetworkAnalytics` can run in parallel Network HandlerComponents can indicate support for running in parallel per-connection. Enabled `NET_ANALYTICS_MULTITHREADING` by default.

## PCG

- Added GPU execution time for nodes to the Profiling window.
- Added GPU memory created for GPU nodes to Profiling window.

Optimized runtime generation scheduler to reduce per frame game thread cost by up to 30%.

PCGBasePointData Octree move to lazy allocated unique ptr (Empty octree is ~4kb). PCGBasePointData can easily be in the hundreds of thousands meaning ~400mb per 100k point data saved.

Optimization: Add `pcg.RuntimeGeneration.TimeBetweenRuntimeGenSchedulerTicks` CVar to sleep scheduling and reduce Game Thread cost of runtime generation.

Several other optimizations were found for PCG but these are the most clear wins and some that you can use in your workflow like the profiling info and CVAR.

## World Partition & HLOD

Allow `wp.Runtime.HLOD.ForceDisableShadows` to be toggled anytime.

Editor: Optimized HLOD in editor visibility updates For large worlds containing lots of HLOD, the HLOD visibility update in the editor was very costly. This update is only triggered on editor camera movements, but this still means moving around the world was not as smooth as it should have been. Cost during camera movement, before vs after: → CitySample - BigCity (6061 HLOD actors): 25.1ms vs. 0.18ms (139x) → Engine Test - Test Scene (32161 HLOD actors): 144ms vs 1.06ms (136x)

New perceptual diff feature to avoid HLOD rebuilds when no significant visual changes are detected. Added concept of HLOD Rebuild Policies. One of the HLOD rebuild policies is a "Image Compare": Fuzzy image comparison (using SSIM) → Takes screen captures of the SOURCE actors of an HLOD, over multiple angles (and for different GBuffer properties) → It will then perform an SSIM evaluation in order to assess if there is a significant visual change between the old and new data set.

Editor: HLOD Setup and actor-deletion steps now batch their source control operations, significantly reducing source-control overhead during HLOD builds.

SimpleStreamableAssetManager - SSAM is now fully thread-safe. // is this at all related to hlod?

World Streaming Insights (Experimental): Added an Unreal Insights workflow for analyzing World Partition streaming behavior over time. Placed in a new "Spatial Profiler" tab in Unreal Insights. // Looks like the trace channel for this is `WorldStreaming`

A new `wp.Editor.ExportMinimapForInsights` editor console command - exports the current World Partition minimap as a PNG plus sidecar JSON of world bounds. Load the PNG as the Spatial Profiler background to give the spatial view geographic context. A new wp.Editor.ExportMinimapForInsights editor console command - exports the current World Partition minimap as a PNG plus sidecar JSON of world bounds. Load the PNG as the Spatial Profiler background to give the spatial view geographic context. 

## Editor

Asset Size Map: Added support for displaying external packages (editor) and generated packages (cook).

## Mobile

Added CVar `r.Mobile.Upscale.Quality` by merging Add control over mobile upscaling method.

Added the `stat thermals` command to display the thermal state of the device. Currently only available on Android/iOS. (Exposed CPUTemp and ThermalStatus CSV metrics to other platforms than Android)

## Platforms

Enabled MallocBinned3 by default for Windows for improved speed over MallocBinned2.

## XR

Disable chunked PSO cache on Quest devices. The chunked PSO cache has the following tradeoffs: Pro: Drivers which fully serialize access to their PSO caches get better concurrency Pro: Drivers which don't scale well to large PSO caches get faster lookups Con: Drivers which can reuse cached information for pipelines which are different but similar may have cache misses due to the pipelines being in different chunks Con: Drivers which can reuse cached information for pipelines which are different but similar may use extra memory storing multiple copies of this information in different chunks On Quest devices, the driver doesn't benefit much from the Pros, and is hindered by the Cons. It's better to turn this feature off.

## Rendering

### Virtual Shadow Mapping

- Added throttle for the invalidation triggered from `r.Nanite.VSMInvalidateOnLODDelta` such that it can be turned on without causing large performance regressions. The budget is set via `r.Shadow.Virtual.DeferredInvalidationBudget` (defaults to infinite).

- "Prefiltered Distant" experimental implementation. This adds support for drawing distant shadow casters into the clipmap at much lower resolution, while using prefiltering and temporal reprojection to produce a smooth result that often matched ground truth better than SMRT.

- Added `r.Shadow.Virtual.PrefilteredDistant.ProjectEnable` to gate the pre-filtered distant feature (shaders in particular) behind.

## Depth of Field

Added `r.DOF.PreferLowerBitDepth`. When enabled, the bit depth of intermediary buffers in DOF is lowered. This improves performance at the cost of quality on platforms that are bandwidth constrained, such as handhelds. This optimization was previously only available when the scenecolor format was set to r11g11b10. This change only works when the recombine and accumulator quality are set to low.

## Variable Rate Shading

Significantly improved performance of the CreateShadingRateImage pass. (That is the texture created each frame for "Tier 2 VRS").

## Nanite

Implemented the following Nanite- and WPO-related features for skinned meshes to match their Static Mesh counterparts:
- World Position Offset Disable Distance.
- Evaluate World Position Offset.
- Disallow Nanite.

## Single Layer Warer

Move velocity write from base pass to depth prepass Move Single Layer Water velocity output from the SLW base pass (via GBL_ForceVelocity GBuffer layout) to the SLW depth prepass (via velocity shaders).

A new CVar is added `r.Water.SingleLayer.VelocityOutputPass` to control the fallback. it has also been added to project setting. When `r.Water.SingleLayer.VelocityOutputPass=0`, no velocity written. When `r.Water.SingleLayer.VelocityOutputPass=1` (default), all SLW materials use velocity shaders in the depth prepass. The base pass uses GBL_Default (no velocity RT). MVWO (Motion Vector World Offset) is only supported when PrepassVelocity=0. When `r.Water.SingleLayer.VelocityOutputPass=2` (fallback), legacy behavior is preserved: Base pass writes velocity via GBL_ForceVelocity, prepass is depth-only. This CVar deprecates `r.Water.SingleLayer.ForceVelocity`.

## Misc

Optimized reflection capture updates for deferred shading.

Fixed spikes when loading maps with large HISMs that were introduced as part of a fix for a different issue. This new fix is narrower in scope and should only cause rebuilds when ApplyComponentInstanceData is called.

Exposed StaticMesh accessor methods GetNumTexCoords, GetNumNaniteVertices, and GetNumNaniteTriangles to Blueprint.

Added detailed Insights trace to FRuntimeVirtualTextureFinalizer::RenderFinalize in order to better assess RVT perf (useful in case of large page invalidations in particular).

Deprecated and disabled the r.SkipRedundantTransformUpdate feature and associated API as it leads to inconsistencies, ASAN warnings and is of doubtful performance value (possibly detriment).

Enabled Reserved Resources for GPU Scene to reduce hitches on resize and peak GPU memory use by eliminating the need to double buffer during the copy.

Implemented hierarchical CPU Instance Culling for non-Nanite ISM and similar. Controlled by `r.SceneCulling.HierarchicalCPUCulling` (runtime, default off) and `r.SceneCulling.HierarchicalCPUCulling.ProjectEnabled` (offline, default on).

"Mask material only in early Z-pass" renderer setting is now enabled by default.

Removed inline allocation for dynamic RT meshes, saving up to ~2k bytes per SM proxy (reducing size by 2/3).

Added OverrideVirtualTextureThrottle option to scene capture component. That allows to remove all sorts of throttling on the RVT system for the duration of the capture. This has a performance cost but can ensure that textures are not blurry if the scene capture renders a region that requires a lot of RVT pages to be locked or rendered to. This does *not* perform any kind of warmup, though, so only the existing RVT page requests will be processed during the capture when this option is on. Another capture has to be performed prior to this in order to generate the appropriate requests.

Workaround for incorrect view distance scale being captured in the GPU scene primitive data for InstanceDrawDistance, InstanceWorldPositionOffsetDisableDistance and PixelProgrammableDistance. The GPU scene now tracks the value of `r.ViewDistanceScale` and triggers a full upload if it changes. This behavior can be disabled by `r.GPUScene.ViewDistanceScaleWorkaround`.

Fix incorrect culling of hidden line in ShaderPrint when `r.ShaderPrint.DrawOccludedLines` is enabled.