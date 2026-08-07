---
title: "Unreal Engine 5.8 Performance Highlights"
date: 05-08-2026
last_modified_at: 05-08-2026
layout: single
categories: 
  - "Performance & Optimization"
tags: 
  - "Performance"
  - "performance-highlights"
coverImage: "Thumb_Blog_58Highlights.jpg"
og_image: "/assets/images/Thumb_Blog_58Highlights.jpg"
excerpt: "Discover the most important Unreal Engine 5.8 performance and optimization improvements, including MegaLights, Lumen Lite, shader reductions, and rendering enhancements."
---

It is time again for possibly the last **Performance Highlights overview for Unreal Engine 5**. The release of UE 5.8 marks the final release before Epic Games is moving development efforts to Unreal Engine 6.

That brings the focus of 5.8 to stabilize and optimize existing features. Although new experimental features such as Mesh Terrain have still been added. A couple of major performance oriented improvements include MegaLights turning production ready and Lumen receiving a new Lite-mode for better scalability across devices. You can find the full release notes [here](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes), but let's first dive into the most interesting improvements made that focus on Performance & Optimization. As usual I add my own remarks to the release notes and clarify the changes where necessary.

Some other optimization trends you see across rendering features include overall **image quality and stability** (Lumen, VSM, MegaLights), and **reduced shader permutations** across many shaders used in a variety of passes (Volumetric fog, VSM, Substrate, MegaLights, Lumen, etc.). These are mostly automatic wins for your project, sometimes with CVARs to control behavior or exclusions.

**Share this article with everyone on your team!** This way everyone is informed on the most important changes to 5.8 without having to spend hours digging through the exceedingly long release notes.

{: .notice--info }
This article is part of my efforts of keeping Unreal Engine developers informed about Performance & Optimization! For that I have a in-depth [Complete Game Optimization Course for Unreal Engine 5](https://tomlooman.com/courses/unrealengine-optimization/) to train engineers and tech artists everything they need for profiling, optimizations and understanding performance in UE5. 

**Note:** Unreal Directive has a [Console Variables page](https://unrealdirective.com/resources/console-variables/?version=5.8&new=1) that shows **new CVARs added in 5.8** which is a good way to find out new ways to tune new or existing features. For example, you can see many `a.budget.*` CVARs (**Animation Budgeter Plugin**) are new and worth exploring if you use that feature. These new CVARs are often not called out in the release notes.

## Unreal Insights

Added "UObject Count" trace counter. // use 'counters' trace channel. This is helpful to keep an eye on your total objects count which directly affects garbage collection performance (and memory in general).

Add bandwidth and percent value types for graphs and counter stats.

### Add Annotations inside a trace

Unreal Insights users can now create time, time range, and event-based annotations in Unreal Insight traces. The annotation data is saved in a sidecar.ini file that can be shared. This feature is to help individuals and teams with the performance analysis of trace files.

I have found Annotations immediately very valuable as I often return to traces later and this helps locating previous findings and adding context that you would otherwise forget.

## Hitch snapshots

Added "snapshot hitches" feature. This feature relies on the stats system to detect hitches. When a hitch is detected a trace snapshot and screenshot is written to the Saved/Profiling/Hitches directory. Frames are dumped into a directory for each process instance. Start tracking hitches by using in-game console command `snapshothitches -start` and disable by using `snapshothitches -stop`. Requires some stat group to be active, like `stat default`.

### World Partition Insights (Experimental)

"We added world partition streaming debugging tools to Unreal Insights and Unreal Editor, making possible per-cell analysis and sessions playback." 

Added an Unreal Insights workflow for analyzing World Partition streaming behavior over time. Placed in a new "Spatial Profiler" tab in Unreal Insights.

Adds a 2D view of your world with valuable insights! Worth checking out right away if your project relies on World Partition. The trace channel to enable this should be under `WorldStreaming` (not mentioned anywhere in the release notes)

### Mass Trace

Add missing trace events for archetype creation and entity moves during archetype splitting in MassEntity Introduce a batch `UE_TRACE_MASS_ENTITIES_MOVED` macro to trace multiple entity handles in a single call.

## Profiling Tools

**ProfileGPU** log output now includes Graphics pipe wait times, which greatly improves Frame GPU time accuracy with async compute, and shows where on the graphics pipe the waits were.

More compact log formatting option for **ProfileGPU**.
- Added `r.ProfileGPU.TableFormatting`, which can be disabled to get indentation based formatting that's easier to read. 
- Fixed `r.profilegpu.thresholdpercent` being relative to the current root, it's supposed to be relative to the total frame time.

- `stat unit` console command shows **GPU VRam Used** and Budget debug information on discrete GPUs.
- Added FrameNum and UTC time to `stat unit` so we have a way to match up video captures with logs, etc. Requires setting "stats.UnitTimestamp" cvar to enable.
- Added `stat thermals` command to display the thermal state of the device. Currently only available on Android/iOS. (Exposed CPUTemp and ThermalStatus CSV metrics to other platforms than Android)
- Asset Size Map: Added support for displaying external packages (editor) and generated packages (cook).

## Lumen

Lumen gets a lot of improvements this release. The most important being **Lumen Lite** which is enabled on "Medium" Scalability for Global Illumination. Standard Lumen is also receiving many improvements including better disocclussion, denoising and quality during motion. Less memory usage, fewer shader permutations. Too many to copy over, so look for the [Lumen section](](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes#lumen)) in the full release notes if you want to read the rest. Below are some highlights that are relevant for most people to know.

New BP function on `AGameUserSettings: IsGlobalIlluminationAllowed` which can be used by a game's Blueprints to set the PPVolume depending on whether GI is enabled.

### Lumen Lite (The New "Medium")

![](https://dev.epicgames.com/community/api/documentation/image/92725b02-d1f1-43d7-89ad-91c26fc1bcce)

"Lumen Lite is a new medium-quality setting for Global Illumination using Irradiance Fields with Probe Occlusion supported by Lumen. It's twice as fast as Lumen high quality - which targets 60fps on PlayStation 5, while maintaining the art direction for games that rely on Global Illumination. This path is the new default for current-generation handheld consoles, where it can be used at 60fps, and it is supported on PC as well."

This new mode allows for better scalability which has been a problem to maintain with Lumen. The docs have been updated with [Lumen Lite](https://dev.epicgames.com/documentation/unreal-engine/lumen-performance-guide-for-unreal-engine). Epic still labels this as Beta.

New Lumen Medium Quality, which is 2x faster than Lumen on High Quality, while maintaining art direction for lighting. Lumen Medium Quality is targeted at low end PC and handhelds.
- Enabled by setting GI and Reflection Quality to Medium (`sg.globalilluminationquality 1` + `sg.reflectionquality 1` console commands in game).
- Lumen Medium Quality is 4 components: Faster opaque GI through Irradiance Field Gather, faster reflections, faster GI on transparency / fog and faster Lumen Scene.

Some CVARs mentioned in the release notes to play around with:
- Remove `r.Lumen.ScreenProbeGather.IntegrateDownsampleFactor 2` from High scalability as it was generating too much noise and softening normals. This has to be now manually tweaked per title for a more explicit tradeoff.
- Less aggressive culling of small objects from Lumen Scene on Epic and Cinematic GI quality. Reduces pops in emissive lighting and black spots in reflections from small objects.
- Reduced `r.LumenScene.SurfaceCache.CardMinResolution` from 4 to 2.
- Added `r.Lumen.ScreenProbeGather.ScreenTraces.HZBTraversal.SkipUnlitHits`, which allows to skip unlit shading model hits. This allows to work around GI noise from tiny emissives.

Enabled Lumen **applying height fog to reflection ray hits** by default (`r.Lumen.HeightFog 1`).
- Reduces the mismatch between screen traces and other trace types in heavily fogged scenes (but screen traces are still fogged incorrectly).
- However `r.Lumen.HeightFogOnGI` is still 0 to save a little perf (missing out on fog inscattering in heavily fogged scenes).

## Lighting

### Distance Fields

Allow distance fields to run on `GRHIDeviceIsIntegrated`. This check was added a decade ago to prevent issues on some outdated drivers, but nowadays it prevents some pretty capable SM5 GPUs to run distance field features. // This seems great for integrated GPUs that can now use SDFs for lighting features such as DF shadows, DF ambient occlusion or even Lumen's Software Raytracing.

Distance Fields: Remove distance field shader permutations when distance fields are disabled in project settings. // more projects are able to disable SDFs entirely, this helps reducing the overall shader permutations which is always a win. We see shader permutation reductions across many rendering features in 5.8

Fixed pooled buffer and texture memory leaks in GlobalDistanceField when changing global distance field resolution at runtime.

## MegaLights

MegaLights is now production ready. They greatly reduced the noise, overall performance to use this at 60hz. [View Docs](https://dev.epicgames.com/documentation/unreal-engine/megalights-in-unreal-engine) and see the [MegaLights section](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes#megalights-2) of the release notes for the full list. There are many improvements surrounding quality, and below are some of the most meaningful performance changes:

No longer traces multiple rays towards the same light if it's not in a penumbra. This greatly improves performance (0.3-1ms on console, depending on the scene).

Early cull lights by light power and falloff. This allows it to quickly skip lights, which don't contribute to the final pixels and reduces light sampling by ~20% in Firefly without adding any measurable cost to light grid culling. This heuristic isn't entirely correct, as it assumes a pure diffuse surface. For example, light specular (shape) is visible infinitely far away in a perfect mirror, but this change will cut it off. Still in practice it works really well and it's hard to spot any missing energy. r.MegaLights.LightAttenuationFalloff 0 can be used to disable it.

Added `r.MegaLights.ScreenTraces.Quality` which allows to tweak screen space trace quality for scalability.

Added `r.MegaLights.Supported` which allows to remove all MegaLights shader compilation overhead if it's not used in project.

Deprecated **SSGI (Screen Space Global Illumination)**. SSGI is superseded by Lumen GI. // The intend is most likely to just use Lumen Lite now instead of SSGI as this relied too much on screen space information and was not a full solution in itself.

## Garbage Collection

GC: Add the option to GC based on pending actors to unload (in addition to existing mechanism that uses number of levels) for finer control (disabled by default). Number of levels can be inaccurate given the discrepancies between level counts and memory impact. across main grid / data layers Add the option to GC based on pending actors to unload (in addition to existing mechanism that uses number of levels) for finer control (disabled by default). 

Controlled via `s.ContinuouslyIncrementalGCWhileActorsPendingPurge`/ `s.LevelStreamingLowMemoryActorsPendingPurgeCount` and `wp.Runtime.LevelStreamingContinuouslyIncrementalGCWhileActorsPendingPurgeForWP` (for partitioned worlds).

## Core

- Enabled **MallocBinned3** by default for Windows for improved speed over MallocBinned2.
- Changed **MallocBinned3** max small bin config to 14kb by default as it offers better performance\memory in our testing.
- Asset registry cache will now memory-map its tag data storage, **reducing RAM footprint by GBs** in large projects (in editor).
- **LightWeightInstances** code marked as deprecated. // This was supposed to be a static swap-in replacement for the full functionality Actors but never took off.

## Fast Geometry Streaming Plugin

Fast Geometry Streaming is still marked Experimental in 5.8 but continues to receive wider support ("Added decal, point, spot and rect lights components support.") to make this more valuable to avoid any streaming related hitches.

## Horde - Performance Reporting (Experimental)

"Improvements to Horde Analytics tooling continues in UE 5.8 as an Experimental feature with improvements to dashboard UX for job steps (CPU, memory usage) and job health observability."

"We've also introduced a new view in Horde which shows runtime trends outputted from the Automated Performance Tests framework (APT) and the Perf Report Tool (csvprofilers), highlighting key metrics such as GPU/CPU times, peak memory usage and hitch reports so regressions can be spotted. This currently relies on users having their own database store model."

## Sandboxes

Sandboxes provide an isolated workspace where you can experiment without affecting the main project. Open a sandbox, create and edit freely, and persist only what you want to keep

- You no longer need to spin up a side branch, copy assets to a WIP folder, or worry about polluting your revision control just because you want to try something out.
- Create a sandbox and work inside it without affecting the project content Browse, switch, and see changes in sandboxes from a dedicated browser
- Persist only the changes you want to keep in your project
- Export a sandbox to share with a teammate, or import one to pick up where they left off

{: .notice--info }
While not directly performance related, it is an very interesting workflow improvement to experiment with changes to the world, materials, etc that affect performance in unknown ways.

## Mass Framework Refactor

[Mass Framework](https://dev.epicgames.com/documentation/unreal-engine/mass-entity-in-unreal-engine) received a major overhaul.

"Mass Signals are now part of the core engine, and entities can be created off the game thread thanks to archetype-based, lock-free scheduling. A new sparse/virtual fragment system reduces memory use and allows optional fragments and tags to be added or removed without triggering costly archetype changes."

"We completely overhauled Mass processor execution and dependency resolution to better take advantage of multi-core CPUs, resulting in safer and faster execution on modern hardware. This is supported by more granular scheduling and thread-safe observer notifications."

## Chaos Visual Debugger

The Chaos Visual Debugger (CVD) provides Unreal Engine users with a way to effectively observe and debug their physics simulations, either directly in the Unreal Editor or from a standalone CVD instance. UE 5.8 updates include:

- A camera tracking system.
- The geometry visualization panel.
- Multi-select support.
- A triangle mesh complexity view.

I love this cool to get insights into how the collision/physics scene is constructed as it's such a common cause of performance issues. Bloated physics scenes affect streaming performance and memory cost. On top of more expensive collision/trace queries for all your game code.

## Chaos Caching

The Caching framework project focuses on extending the existing system for storing and replaying simulation data efficiently across Chaos-based features like Cloth, Fluids, Destruction, and Flesh. UE 5.8 updates include:

Per-component caching in sequencer.

Supports both editor-side baking and runtime playback.

## Compile Time Improvements

Reduced linking time on clang with LTO (Link-Time Optimization) by disabling debug info upgrading, since we build everything with the same toolchain.

Not specified by how much, but faster is always a win.

## Mobile Renderer

- Added CVar `r.Mobile.Upscale.Quality` by merging Add control over mobile upscaling method.
- Multi-pass deferred rendering as the default path across mobile platforms (with forward rendering still available as an opt-in).
- Mobile support for SSAO, SSR, deferred decals, contact shadows, and higher-quality water rendering.

In UE 5.8 introduces half-precision (FP16) shader usage in targeted materials and global shader passes, improving performance while preserving visual quality.

## Blueprint

Added simple counter to ensure if too many Blueprint async actions are created. The number of allowed actions can be set using the console variable `bp.MaxAsyncActionCount`. Set the number to <= 0 to disable the ensure.

## Streamable Manager

- Added a mechanism to just-in-time trickle async load requests on a streamable handle.
- Added a mechanism to batch/trickle async load requests on a streamable handle.
- Opt-in (enabled via UE_ENABLE_STREAMABLE_JIT_ASYNC_LOADING=1) and by setting bUseJustInTimeAsyncLoader=true or if batching is enabled globally (s.StreamableEnableJITAsyncLoadingGlobally).
- The initial batch size is set as per s.StreamableJITAsyncLoadingInitialBatchingFactor which is a factor of the total number of requests queued for a streamable handle (default is 0.25).
- This can be used to cancel or queue subsequent async load requests at updated priorities (see FStreamableHandle::SetPriority) which would get picked up when subsequent requests are queued.
- Opt-in by setting bUseJustInTimeAsyncLoader=true or if batching is enabled globally (s.StreamableEnableJITAsyncLoadingGlobally).

## Nav Mesh

- Optimized Detour navmesh link memory by sizing the base link pool to actual usage (~30 MB savings on large maps); exposed `bMinimizeLinkPoolSize` and added link utilization stats to DumpNavMeshMemory.
- Optimized navmesh vertex storage by packing vertices as tile-local float offsets (~50% memory reduction on vertex data).
- Optimized `FRecastNavMeshGenerator::RemoveTiles` to reduce a hang when many tiles are dirty simultaneously.

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

A new `wp.Editor.ExportMinimapForInsights` editor console command - exports the current World Partition minimap as a PNG plus sidecar JSON of world bounds. Load the PNG as the Spatial Profiler background to give the spatial view geographic context. A new wp.Editor.ExportMinimapForInsights editor console command - exports the current World Partition minimap as a PNG plus sidecar JSON of world bounds. Load the PNG as the Spatial Profiler background to give the spatial view geographic context. 

## Virtual Shadow Mapping

- Added throttle for the invalidation triggered from `r.Nanite.VSMInvalidateOnLODDelta` such that it can be turned on without causing large performance regressions. The budget is set via `r.Shadow.Virtual.DeferredInvalidationBudget` (defaults to infinite).
- "Prefiltered Distant" experimental implementation. This adds support for drawing distant shadow casters into the clipmap at much lower resolution, while using prefiltering and temporal reprojection to produce a smooth result that often matched ground truth better than SMRT.
- Added `r.Shadow.Virtual.PrefilteredDistant.ProjectEnable` to gate the pre-filtered distant feature (shaders in particular) behind.

## Depth of Field

Added `r.DOF.PreferLowerBitDepth`. When enabled, the bit depth of intermediary buffers in DOF is lowered. This improves performance at the cost of quality on platforms that are bandwidth constrained, such as handhelds. This optimization was previously only available when the scenecolor format was set to r11g11b10. This change only works when the recombine and accumulator quality are set to low.

## Variable Rate Shading

Significantly improved performance of the `CreateShadingRateImage` pass. // That is the texture created each frame for "Tier 2 VRS" to determine which pixels to render are a reduced shading rate.

Fixed an issue where Variable Rate Shading was not properly applied to the ReflectionEnvironmentAndSky pass even when `r.VRS.ReflectionEnvironmentSky` was enabled.

## Nanite

- Significantly improved performance of Nanite rasterization & culling on handheld platforms.
- Reuse Nanite readback buffers to avoid reallocation.

Added new console variables for the ability to disable **Nanite Tessellation in Virtual Shadow Maps** at run time for scalability/performance reasons:
- `r.Shadow.Virtual.Nanite.AllowTessellationDirectional` can be used to toggle Nanite Tessellation in directional light shadows.
- `r.Shadow.Virtual.Nanite.AllowTessellationLocal` can be used to toggle Nanite Tessellation in local light shadows.

Added "Nanite Pixel Programmable Distance" property to **foliage types**. // This is excellent and something I was missing in the [Unreal GPU Optimization video](https://www.youtube.com/watch?v=3qgd4glfIR0) I made for Far Far West.

Implemented the following Nanite- and WPO-related features for skinned meshes to match their Static Mesh counterparts:
- World Position Offset Disable Distance.
- Evaluate World Position Offset.
- Disallow Nanite.

- Fixed bug resulting in Nanite HZB occlusion not working when `r.HZB.BuildUseCompute` was disabled.
- Fixed culling bug when running with `r.Nanite.Culling.MinLOD` and reenabled it.

## Niagara

Add GPU Bitonic Sort algorithm for **Particles sorting**, the default (configurable) heuristic will choose Bitonic over Radix for particle count under a certain threshold for better GPU performance.

## TSR (Temporal Super Resolution) & Postprocessing

TSR adds several Thin Geometry optimizations that are worth diving into if you are using that in your project. Read it [here](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes#postprocessing).

Set Early translucency velocity pass to after volumetric cloud reconstruction (`r.Translucency.EarlyVelocityPass 2`) by default. TSR async pass can now overlap with passes after volumetric cloud reconstruction. The more complex those passes the more saving. The default location is after volumetric fog. Other locations are after deferred lighting, and before translucency.

Moved CombineLUTs to async compute.

TSR: Fix memory spike at camera cut and teleport. It is caused by the texture 2d array size mismatch of history color at the time. A new texture needs to be allocated while the old one still exists.

## Materials & Shaders

The release of 5.8 made a lot of improvements for reducing shader counts and permutations. You can find mentions of this spread throughout the release notes. This is good news as this will reduce the impact of PSO shader compilation for everyone.

Shader layout is now determined using translation output, instead of conservative Material Asset based heuristics. This leads to a decrease in shader counts and can be toggled using `r.Material.UseShaderCompilationParameters`.

**Default Textures Memory Optimization**. Even if referenced by the base Material, all default material textures which are not used for rendering are now not loaded at runtime. This can be toggled using `r.Material.StripUnusedDefaultTextures`. // This is great and a very old problem. Any texture you referenced in your Master Material would still be loaded into memory even if all Material Instances changed those textures to something else. A workaround was using very small default materials (like a tiny solid white texture, and mini normal map, etc.)

Add permutation count to the `recompileshaders listtypes` command Looks like this: 
  `ShaderTypeName, Filename, PermutationCount FBufferTextureMappedCopyCS, /NNEDenoiserShaders/NNEDenoiserShadersMappedCopy.usf, 125 FTextureBufferMappedCopyCS, /NNEDenoiserShaders/NNEDenoiserShadersMappedCopy.usf, 125 FStochasticLightingTileClassificationMarkCS, /Engine/Private/StochasticLighting/StochasticLightingTileClassification.usf, 3072`

**Display Total Shaders** as a SNotificationBackground as an overlay in the bottom right hand corner of the **Material Editor and Material Instance Editor** Viewport.
  The goal here is prominently display the number of shaders that this material has. That way as a user modifies the material they can see live the impact of their changes when changing usage flags, or plugging in WPO.
  // This can be valuable to better understand how your material changes impact the total shader count of your project. And more easily see materials that historically are bloating your project.

Added **UMaterialEditingLibrary::ListShaders** which will return an array of all shaders that material will compile.

Fix translucent materials not showing up in shader complexity view mode.

## Rendering

**Dynamic Resolution support** is enabled for PC on both DX12 and Vulkan RHIs.

"Mask material only in early Z-pass" renderer setting is now enabled by default.

Reduced the CPU cost of `CreateCommittedResource` and reducing memory pressure by keeping unreferenced resources out of **VRAM**. Controlled by read-only CVar `D3D12.ResourcesStartResident`, by default Off.

If it is desired, a licensee can enable mimalloc via `UE_APPLE_USE_MIMALLOC_MIN_FREE_RAM_MB` project define at a cost of a significant memory footprint. The define sets a minimal free RAM threshold that is checked on startup and if the device has free memory above that limit, it will instantiate mimalloc.

Optimized reflection capture updates for deferred shading.

Fixed spikes when loading maps with large HISMs that were introduced as part of a fix for a different issue. This new fix is narrower in scope and should only cause rebuilds when ApplyComponentInstanceData is called.

Added detailed Insights trace to `FRuntimeVirtualTextureFinalizer::RenderFinalize` in order to better assess RVT perf (useful in case of large page invalidations in particular).

Deprecated and disabled the `r.SkipRedundantTransformUpdate` feature and associated API as it leads to inconsistencies, ASAN warnings and is of doubtful performance value (possibly detriment).

Enabled Reserved Resources for GPU Scene to reduce hitches on resize and peak GPU memory use by eliminating the need to double buffer during the copy.

Implemented hierarchical CPU Instance Culling for non-Nanite ISM and similar. Controlled by `r.SceneCulling.HierarchicalCPUCulling` (runtime, default off) and `r.SceneCulling.HierarchicalCPUCulling.ProjectEnabled` (offline, default on).

Removed inline allocation for dynamic RT meshes, saving up to ~2k bytes per SM proxy (reducing size by 2/3).

Added `OverrideVirtualTextureThrottle` option to scene capture component. That allows to remove all sorts of throttling on the RVT system for the duration of the capture. This has a performance cost but can ensure that textures are not blurry if the scene capture renders a region that requires a lot of RVT pages to be locked or rendered to. This does *not* perform any kind of warmup, though, so only the existing RVT page requests will be processed during the capture when this option is on. Another capture has to be performed prior to this in order to generate the appropriate requests.

Workaround for incorrect view distance scale being captured in the GPU scene primitive data for InstanceDrawDistance, InstanceWorldPositionOffsetDisableDistance and PixelProgrammableDistance. The GPU scene now tracks the value of `r.ViewDistanceScale` and triggers a full upload if it changes. This behavior can be disabled by `r.GPUScene.ViewDistanceScaleWorkaround`.

Now **DumpGPUViewer** can inspect the referenced uniform buffer if `r.RHI.UniformBufferContentMap.Enable` is set to true.

Dump GPU: Add CVar `r.DumpGPU.RedumpInputs` (0, default off) to enable re-dump of inputs at each pass. This fixes the lost of input resource's intermediate update if it was already dumped previously but the intermediate passes written to it was filtered out. Enable it will increase the memory footage.

Added `r.MeshSortingMethodWithoutEarlyZ` to allow sorting meshes front to back to reduce overdraw even when not using the mobile renderer.

Replaced CVar `r.TextureGroup.OptionalQualityLevel` with new device profile property `UTextureLODSettings::TextureGroupOptionalQualityLevel` to specify the value for Windows without propagating to other platforms just because the cooking editor runs on Windows.

Allow Shader PSO precache to fail gracefully if shader data is not available yet.

Additional asynchronous pool allocation strategy for **D3D12 buffer allocators** (Upload heap and Default buffer pools). The implementation pre-allocates "Overflow" pools on a background thread in order to reduce allocation hitches on the critical path that occur when existing pools become full and new pools must be created synchronously.

## Substrate

Not a lot of improvements called out explicitly for Substrate, but I could find the following:

Enable Substrate's classification stencil writing during the indirect lighting pass for better performance.

## Single Layer Water

Move velocity write from base pass to depth prepass Move Single Layer Water velocity output from the SLW base pass (via GBL_ForceVelocity GBuffer layout) to the SLW depth prepass (via velocity shaders).

A new CVar is added `r.Water.SingleLayer.VelocityOutputPass` to control the fallback. it has also been added to project setting. When `r.Water.SingleLayer.VelocityOutputPass=0`, no velocity written. When `r.Water.SingleLayer.VelocityOutputPass=1` (default), all SLW materials use velocity shaders in the depth prepass. The base pass uses GBL_Default (no velocity RT). MVWO (Motion Vector World Offset) is only supported when PrepassVelocity=0. When `r.Water.SingleLayer.VelocityOutputPass=2` (fallback), legacy behavior is preserved: Base pass writes velocity via GBL_ForceVelocity, prepass is depth-only. This CVar deprecates `r.Water.SingleLayer.ForceVelocity`.

## Ray Tracing

Adding support for Linear Swept Spheres (LSS) for ray tracing of hair strands Raytracing of hair strands will take advantage of LSS primitives on nVidia Blackwell GPUs, reducing memory usage and improving performance compared to the intersection shader based implementation.

## Iris Networking

Added API for network HandlerComponents to indicate support for being run in parallel. Enabled `NET_ANALYTICS_MULTITHREADING` so that `OodleNetworkAnalytics` can run in parallel Network HandlerComponents can indicate support for running in parallel per-connection. Enabled `NET_ANALYTICS_MULTITHREADING` by default.

## Networked Physics

There are more [networked physics optimizations](https://dev.epicgames.com/documentation/unreal-engine/unreal-engine-5-8-release-notes#networkedphysics) but mainly for those already deep into the subject.

Optimize network overhead for replicated Input and State properties via the "legacy" RepGraph or Iris Last Resort replication in NetworkPhysicsComponent.
- Remove Owner* replication (24+8 reduced to 0 bits).
- Replace DeltaSourceFrame with DeltaSourceIndex (16 or 24 reduced to 2 bits).
- Clamp NumFrames (8 reduced to 4 bits).
- Send data array ordered to improve ServerFrame delta serialization (18 bits reduced to 1 bit on arrays larger than 1).

## Mutable

Mutable is now considered Production Ready: "We made performance improvements across the board, including parallel updates to boost generation throughput for crowds, reduced game thread workload, and optimized mesh and texture operations."

## MetaHuman Crowd (Experimental)

A new experimental plugin to use [MetaHumans in crowds](https://dev.epicgames.com/documentation/metahuman/metahuman-crowds-in-unreal-engine) that should scale to thousands of characters.

## XR

Disable chunked PSO cache on Quest devices. The chunked PSO cache has the following tradeoffs: Pro: Drivers which fully serialize access to their PSO caches get better concurrency Pro: Drivers which don't scale well to large PSO caches get faster lookups Con: Drivers which can reuse cached information for pipelines which are different but similar may have cache misses due to the pipelines being in different chunks Con: Drivers which can reuse cached information for pipelines which are different but similar may use extra memory storing multiple copies of this information in different chunks On Quest devices, the driver doesn't benefit much from the Pros, and is hindered by the Cons. It's better to turn this feature off.

## FBX Importer

uFBX library (Experimental) noticeably reduces import import times especially on heavy `.fbx` files containing large meshes. Users with multi-core CPUs will also notice improvement for files with a large number of meshes.

## Oodle

Oodle Compression updated to [2.9.16](https://www.radgametools.com/oodlehist.htm). 

## Closing

There were *many* more interesting optimizations implemented for the release of UE 5.8. But I did my best to trim the list to the most broadly relevant or interesting changes that may directly impact your project.

**Please consider sharing this article with a colleague!** Keeping everyone on your team informed about the latest improvements when it's time to upgrade to UE5.8.

You can subscribe to my newsletter below to stay informed about Unreal Engine 5 and beyond.
