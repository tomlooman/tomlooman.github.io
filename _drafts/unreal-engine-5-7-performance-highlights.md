---
title: "Unreal Engine 5.7 Performance Highlights"
date: 2025-11-12
last_modified_at: 12-11-2025
categories: 
  - "performance-optimization"
tags: 
  - "performance"
  - "unreal-engine"
  - "performance-highlights"
coverImage: "placeholder.jpg"
sidebar:
    nav: sidebar-optimization
---

It is time for another Unreal Engine 5.7 Performance Highlights post! I have compiled a list of most impactful changes which make it worthwhile to upgrade to 5.7. I trimmed the list more substantially this time around to make it more digestible and really highlight the most interesting areas while keeping the more minor changes out. **I have included annotations and clarifications not found in the original release notes.**

As usual I approached this list from the game development perspective. Focusing on runtime performance of the game, profiling capabilities, bugs that affected performance, new CVARs for quality/performance tuning and some of the editor iteration performance as those have some notable changes.

Overall the performance improvements are not as strong as in 5.6, but there are some major systems like a new Nanite Foliage system using Voxels which is a game changer and a much needed improvement. Lumen is clearly moving away from Software ray-tracing (SWRT) by deprecating their "SWRT detail traces" render path already in 5.6. The good thing about this is a unified lighting pipeline that we can work against rather than having to pick one and hoping for the best or spending the extra time supporting both. Their continued performance improvements to Lumen Hardware Raytracing (HWRT) should allow higher quality and more stable lighting that no longer relies of any simplified Distance Field representations.

There are other important changes and improvements hidden in the incredibly long list of changes, so let's dive in!

Read the original full release notes here (https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-7-release-notes)

{: .notice--info }
This article is part of my efforts of keeping Unreal Engine developers informed about Game Optimization! For that I have a in-depth [Game Optimization Course for Unreal Engine 5](https://courses.tomlooman.com/p/unrealperformance?coupon_code=COMMUNITY15) to train engineers and tech artists everything they need for profiling, optimizations and understanding performance in UE5. 

## Nanite

Added a new culling check that can improve Nanite culling speed and reduce the amount of memory needed for candidate clusters (`r.Nanite.Culling.MinLOD` enabled by default, turn off for testing only).
My understanding of this culling is that it can skip child clusters during culling, simply put, we get faster culling that's enabled by default.

Added experimental and optional passes to **prime the HZB** before VisBuffer rendering if the HZB is missing (e.g., due to a camera cut), see cvar `r.Nanite.PrimeHZB` et al.
- The main idea is to draw a lower resolution (HZB or lower) and lower detail (by using LOD bias and/or drawing only ray tracing far field scene geometry).
- This new render is then used to build a HZB with some depth bias that is then used to render the full scene, greatly improving the cost in many cases.

Epic has talked about priming the HZB for culling during camera cuts in [The Witcher 4 Unreal Fest talk](https://youtu.be/ji0Hfiswcjo?si=IwZEI_b9tJChoJSk&t=2692), that will best explain this optimization.

Exposed `NanitePixelProgrammableDistance` for Nanite skinned meshes to enable forcibly disabling pixel programmable rasterization of Nanite when the mesh is further than a given distance from the camera.


## Nanite Foliage and Skinning (Experimental)

Nanite Foliage is a huge step forward for performant foliage rendering with Nanite. You will now build foliage from building blocks (like a variety of branch meshes to build a tree) instead of importing a single tree or chunk of grass.

This foliage is now animated using Skinning rather than WPO (world position offset) which has poor Nanite support (WPO is generally not suitable for Nanite due to its increased rendering cost).

This primarily added the following features:

- **Nanite Assemblies**, for building foliage assets using instanced parts to keep asset sizes small.
- **Skeletal Mesh-driven dynamic wind**, trees are skeletal meshes and the new Dynamic Wind plugin enables procedural wind to affect their bones.
- **Nanite Voxels**, for efficiently rendering foliage geometry in the distance.
- **TSR Thin Geometry** detection to better handle foliage.

Again Epic demo'd this during [The Witcher 4 talk here](https://youtu.be/ji0Hfiswcjo?si=4TYyZ4ZbUXO70FVl&t=1371).

## Lumen

Lumen Continues to move toward a single rendering path with HWRT (Hardware raytracing) at 60hz. Epic already deprecated the SWRT detail tracing in 5.6 and continues their efforts on the HWRT side.

Enabled half res integration on High scalability (`r.Lumen.ScreenProbeGather.StochasticInterpolation 2`).
- This can soften normals in indirect lighting, and make GI a bit more noisy.
- On the other hand it saves ~0.5ms on console at 1080p, which feels like a right tradeoff for High scalability intended for 60hz on console.

`r.LumenScene.DumpStats 3` will now dump primitive culling information. This is useful, as it merges instances into a single entry making it easier to read the log.

Tweaked default settings:
- `r.Lumen.TraceMeshSDFs 0` - SWRT detail traces (mesh SDF tracing) is now a deprecated path (Note: deprecated since 5.6), which won't be worked on much. For scaling quality beyond SWRT global traces it is recommended to use HWRT path instead.
- `r.Lumen.ScreenProbeGather.MaxRayIntensity 10` - firefly filtering is now more aggressive by default. This removes some interesting GI features, but also reduces noise, especially from things like small bright emissives

Moved GBuffer tile classification out into a single pass, which is also storing opaque history for the next frame. This pass is reused across Lumen and MegaLights for better performance.

Screen tile marking optimizations, which speed up reflections, GI, and water reflections.

## MegaLights

MegaLights has now entered Beta, instead of Experimental. From the release notes this appears to mostly mean reduction in noise and overall performance improvements.

## Custom HLODs

When using the provided automatic HLOD generation methods, the output may not always meet the project's requirements and is bound to mesh components. Custom HLODs support addresses this limitation by giving you the ability to provide your own custom HLOD representations for individual actors or groups of actors.

You can use the new World Partition Custom HLOD actor class in two ways:

- **Inject custom representation directly:** You can inject the custom representation as-is into the HLOD runtime partition and optionally use it as input for parent HLOD Layers.
- **Provide a custom source only:** You can use the custom representation as input to the HLOD generation process without adding it to the world itself.

Custom HLOD support:

- Added `WorldPartitionCustomHLODActor`, an actor you can place in the world to provide a custom HLOD representation (using static mesh component).
- Added a new HLOD Layer type: "Custom HLOD Actor".
- Custom HLOD actors assigned to "Custom HLOD Actor" layer are injected as-is into the HLOD runtime partition.
- The "Custom HLOD Actor" layer can specify a parent layer. In that case custom HLOD actors are also used to generate parent layer's HLOD representation.
- Custom HLOD actors can also be assigned to other (non-Custom) HLOD Layers. In that case they are used only during HLOD generation and are not pulled into the HLOD partition themselves.
- Adds a new LinkedLayer property to UHLODLayer, visible only when LayerType is set to Custom HLOD Actor
- LinkedLayer is used to control the visibility of Custom HLOD Actors. They become visible when actors from the LinkedLayer are unloaded.
- If LinkedLayer is not specified, Main Partition is used to control the visibility.

## Windows (Mouse/Cursor)

This release fixed some issues with mouse/cursor handling on high poll-rate mice which is scattered across the release notes. It boils down to removing some cpu stalls and moving it onto a workerthread.

- Updated mouse capture and high precision mode handling on Windows to save up to .5ms on redundant API calls
- Reduced mouse input overhead on Windows by processing raw mouse moves on a separate FRunnable thread in the WindowsApplication.
- Moved Win32 calls for mouse cursors off of the game thread and onto the task graph to reduce stalls on the game thread from internal lock contention that occasionally occurs.
- Moved processing of mouse inputs to a dedicated thread to reduce overhead on the game thread for Windows. This is useful for mice with high polling rates, e.g. 8000 Hz. 

This behavior is enabled by default, but you can go back to processing only on the main game thread with this console variable:
 
`[ConsoleVariables]` 
`WindowsApplication.UseWorkerThreadForRawInput=false`

## SMAA (Experimental)

Mobile and desktop renderers now support Subpixel Morphological Anti-Aliasing (SMAA). You can enable it with the mobile renderer using the CVar `r.Mobile.AntiAliasing=5`, and with the desktop renderer using the CVar `r.AntiAliasingMethod=5`.

This feature improves visual fidelity by providing high-quality edge smoothing with minimal performance impact, it is an efficient technique for mobile games.

- SMAA anti-aliasing is enabled on all platforms.
- Adjust quality settings using `r.SMAA.Quality`
- Adjust edge detection between color or luminance using `r.SMAA.EdgeMode`
- Improve edge smoothness without heavy GPU cost.

Currently an experimental feature. The quality settings provide for tuning tradeoffs between performance or visual fidelity.

## Chaos Physics

- Simulation performance improvements:
    - More parallel simulation stages.
    - We added the Experimental Partial Sleeping feature for improved performance of large unstructured piles.
      Note: there are a variety of CVARs available to tune this, check the full release notes for a list and explanation.
- Query performance improvements:
    - Improvements to sphere and capsule narrow-phase.
    - Improvements to the general query layer transform and scale handling.

Added a new `p.Chaos.MinParallelTaskSize` cvar and `CVarMinParallelTaskSize` function to set a threshold of tasks to run in parallel, which can improve performance on low-core platforms.

Enabled some `p.Chaos` cvars (like `p.Chaos.MaxNumWorkers`) in Shipping so they can be used to tweak game-specific performance.

## Chaos Cloth

Optimizations: Epic implemented optimizations to the cloth game thread and interactor tick.

## Chaos Visual Debugger

They improved the editor performance of this tool, I wanted to highlight it here because it is a powerful tool to inspect your collision and physics configuration on the map. You can inspect where and how often you are performing queries and you might be surprised how much unnecessary collision data you have loaded in your maps!

Performance improvements: In this release, we continued working on improving CVD's performance. CVD files with a large amount of data (specifically over 2 GB of collision geometry data) now loads up to 30% faster.

Improved batching of TEDS operations performed when new physics body data is loaded in the scene. This change, combined with some other improvements made in TEDS itself, resulted in ~75% reduction in the processing time when the first frame of a large CVD recording (+90.000 objects) is loaded. The stall in this particular case went down from ~12 seconds to ~3 seconds.

Improved tracing performance by removing the need for locks (and reduced the contention of ones we could not remove) in some heavily multi threaded paths. Mostly in collision geometry and physics body metadata serialization paths.
- I assume the mean "profile tracing" performance here and not any kind of collision traces...

## Slate UI

Slate drawing optimization: fixed float comparison of the alpha that could send an invisible element to the renderer, for negative or small alpha values.

CommonUI:
- Updated CommonWidgetCarousel to be more consistent in its widget caching.
- Added an option to determine whether or not to cache widgets at all
- Old behavior was to cache widgets in the carousel's RebuildWidget, but widgets added at runtime via AddChild would never be cached.
- Currently caching is enabled by default to match the behavior when children were added at design-time, though this could result in increased memory usage in use cases where all widgets were added dynamically.

Optimized the font shaping process when using complex shaping (typically for Arabic).

Added a CVar `Slate.UseSharedBreakIterator` to support shared ICU Break Iterators to reduce CPU usage. False by default. 
  - Note: These iterators are used to find line ends, sentences etc. in text.

## Garbage Collection

Improved accuracy of GC time limit by setting object destroy granularity to 10 (instead of 100) and provide a way for it to be tweaked per project with `gc.IncrementalBeginDestroyGranularity`.

Fixed a bug in GC timing where if it destroyed exactly 100 objects in a frame it could cause a large stall.

Extended `gc.PerformGCWhileAsyncLoading` to provide the option to garbage collect while async loading, only when low memory is detected (based on `gc.LowMemory.MemoryThresholdMB`).

Made `-VerifyGC` and `-NoVerifyGC` take all verification cvars into account.
- Note: Previously we needed to still specify several CVARs to fully disable all verification in certain GC passes. These included: `gc.VerifyAssumptionsOnFullPurge`, `s.VerifyUnreachableObjects`, `s.VerifyObjectLoadFlags`

## Multi-threading

Epic made many improvements for multi-threading concepts such as mutexes. I have compiled a few here that may be of interest, but there are more in the full release notes. You can find them under the "Core" sections.

- Added `Async.ParallelFor.DisableOversubscription` which if enabled will only use existing threads which can be faster when cores are saturated.
- Fix potential deadlock in the scheduler if a foreground task is scheduling a background one.
- Fix potential deadlock in object annotations because of 2 different locks used in different order.
- Use Yield() instead of YieldThread() when spinning in mutexes to improve performance under heavy system load.

## Gameplay

Added `QueueWorkFunction` and `SendQueuedWork` to the `TaskSyncManager` which can be used to queue a batch of function pointers to execute as a simple tick task. This can be used with `RegisterTickGroupWorkHandle` to safely schedule batched gameplay thread work from any worker thread.
- This system was added in 5.6: "Added a new (experimental) TaskSyncManager to the engine which allows registration of globally accessible tick functions that can be used to synchronize different runtime systems and efficiently batch per-frame updates."

Implemented `SlideAlongNavMesh` option for Character Movement Component NavWalking mode. This means pawns in NavWalking mode can move along a navigation mesh rather than just moving towards a projected point on the navmesh.

## Core

Upgraded to **Oodle 2.9.14** (Compression)
some interesting changes I found include:
- Bugfix: Detect Intel 13th/14th gen Core CPUs and work around instruction sequences implicated in high crash rates w/o microcode patches. Can be up to 20% slower on affected machines for certain rare inputs, but typical decoder slow-downs are around 0.5%. No perf impact on other machines.
  - Note: This fix may be significant for your game as even when not explicitly using this for compressing your packages it may affect shader compression and be causing crashes if you have a live game with UE5.
- Substantially improved **Kraken** "Fast" compression for large input blocks (much faster for binary data and typically smaller), slightly faster Kraken "Normal" compression (~5% higher throughput is common).
- **Leviathan** "Fast" compression for large input blocks is typically faster and higher ratio.

Added `UE_REWRITE`, a replacement for `FORCEINLINE` intended to be used on macro-like functions (rather than for optimization) by 'rewriting' a function call as a different expression.

Introduced a mechanism for render asset updates to be abandoned by owning `UStreamableRenderAssets` so `UStreamableRenderAssets` can be garbage collected independently (See `r.Streaming.EnableAssetUpdateAbandons`). Abandoned render assets are ticked during GC or every streaming update if `r.Streaming.TickAbandonedRenderAssetUpdatesOnStreamingUpdate` is true (defaults to true).

Developers can change the default behavior of TArray<> and related containers to behave more like traditional C++ containers, so that they will only compact when Shrink() is explicitly called. Use the `FNonshrinkingAllocator` as your array allocator to request this behavior. This can also be passed as the secondary allocator for TInlineAllocator.

## World Building

FastGeo: Moved FastGeoContainer PSO Precaching from PostLoad (GameThread) to be asynchronous.
- FastGeo is Epic's new 5.6+ static geometry streaming solution by avoiding actor/components altogether in an effort to greatly improve streaming performance.

## Windows

Changed thread priorities for Game, Render, and RHI threads from Normal to AboveNormal on Windows.

## Lighting

Enabled VSM receiver masks for directional lights by default.
- ~10MB memory overhead (depending on settings/scalability).
- Often fairly significant performance improvements in uncached cases with lots of dynamic geometry.

Epic showcases these VSM improvements in their [Witcher 4 talk at Unreal Fest](https://youtu.be/ji0Hfiswcjo?si=JkSCTm4libT-JnPe&t=2240).

Scale the light fade range by `GLightMaxDrawDistanceScale` to avoid lights becoming too dim at lower scales. (previously Epic only scaled the `MaxDrawDistance`, not the `MaxDrawFadeRange`)

Added and immediately deprecated `r.LightMaxDrawDistanceScale.UseLegacyFadeBehavior_WillBeRemoved` to temporarily restore previous behavior. 
This CVAR relates back to the change with light fade range above to keep/compare original fading behavior.

Exposed `Max Draw Distance` and `Max Distance Fade Range` to Blueprint.
- These properties exist to blend out lights at a distance as a way of culling. Now you can more easily configure them in Blueprint such as during Construct scripts which is potentially very helpful

Added TexCreate_3DTiling flag to volume textures in TranslucentLighting to reduce memory and boost performance on some platforms.

Marked `r.UseClusteredDeferredShading` and `r.Mobile.UseClusteredDeferredShading` as deprecated and added notification about future removal. Clustered deferred shading will be removed in a future release due to lack of utility to reduce maintenance burden.


## Materials and Shaders

Added an asset registry tag to **find material instances causing shader permutations**.
- This one is best explained by the Unreal Fest talk which discusses changes to Materials in 5.7 named: [Unreal Materials: New Features & Productivity Enhancements | Unreal Fest Stockholm 2025](https://youtu.be/KYmd_LNlw2c?si=qmCh89qkrIU3mcOI&t=1470)

Added platform cached ini value to determine whether to compile 128 bit base pass pixel shader variations on platforms which require them. These are infrequently needed and **turning them off can save 50k shaders / 15 MiB** at runtime `r.128BitBPPSCompilation.Allow` **(default is true, for backwards compatibility)**.
Note:
- Worthwhile to check if you can disable this in your project.
- Used for Pixel Formats on RenderTargets that require: `PF_A32B32G32R32F` (32-bit per channel, 4 channels)
- Check for water rendering, scene capture targets, or search for functions such as `PlatformRequires128bitRT` in source.

All the notes below regarding Temporal responsiveness and TSR are best explained through the [Unreal Fest Material Enhancements talk](https://youtu.be/KYmd_LNlw2c?si=zQ7osFNxh0WVP8CZ&t=877) which discusses these changes.

Material Editor: Added two experimental custom output nodes `Motion Vector World Offset (Per-Pixel)` and `Temporal Responsiveness` to give users a way to modify per pixel motion vectors and set how responsive the temporal history is.
- Temporal Responsiveness: Describes how temporal history will be rejected for different velocity mismatch levels.
  - Default :0
  - Medium [0,0.5]
  - Full [0.5, 1.0].
  - Now, it will be used by TSR to change rejection heuristics. Translucency material can also use it to request higher responsiveness if depth is written (r.Velocity.TemporalResponsiveness.Supported=1) or clipped away (r.Velocity.OutputTranslucentClippedDepth.Supported=1).
  - The translucency mask generated improves TSR thin geometry quality.
- Motion Vector World Offset (Per-Pixel): Works similar to the `Previous Frame` input of `Previous Frame Switch` but in the pixel shader. Regions with invalid velocity will be approximated with the current frame's offset.
  - This function currently supports non-nanite meshes only in non-basepass velocity write and is implemented in two passes. Use r.Velocity.PixelShaderMotionVectorWorldOffset.Supported to enable it.

TSR:
- Added an option to allow all shading models to use TSR thin geometry detection when r.TSR.ThinGeometryDetection.Coverage.ShadingRange=2.
- Added exposure offset (r.TSR.ShadingRejection.ExposureOffset) back so global darkening ghosting can be improved. The value behaves a little differently and is now used to adjust the exposure offset for the reject shading moire luma and guide history. Any legacy project before UE5.5 using the old CVar should consider adjusting the value.

Added a new debug artifact (`ShaderTypeStats.csv`), dumped by default for all cooks to the ShaderDebugInfo folder for each shader format.
- This CSV file contains permutation counts/code sizes for all shaders in the shader library, grouped by shader type.
- Note that this is not directly representative of final shader memory usage since it doesn't account for potential duplication of bytecode introduced by the pak chunking step (where shaders used in multiple pakfiles will have a copy in each).
- This is only intended to be used as a tool for tracking and comparing shader growth over time or between cooks.

## MegaLights

Implemented MegaLights-driven Virtual Shadow Mapping marking to only mark VSM pages that MegaLights has selected samples for.

Added the `r.MegaLights.DownsampleCheckerboard`, which can run sampling/tracing at half res (every other pixel). It's a good middle ground between default quarter res sampling and option full resolution sampling.

Merged downsample factor / checkerboard CVars into a single `r.MegaLights.DownsampleMode` CVar.

Exposed `r.MegaLights.HardwareRayTracing.ForceTwoSided`, which allows to flip between matching raster behavior and forcing two-sided on all geometries in order to speedup tracing.

Now always vectorize shading samples. This saves on average 0.1-0.2ms in complex content on current gen consoles.

Now uses downsampled neighborhood for temporal accumulation. Interpolated pixels don't add much to neighborhood stats, so we can skip them, improving quality by effectively using a wider neighborhood filter. This also improves performance of the temporal accumulation pass, as it now can load less data into LDS.

Now merge identical rays in order to avoid overhead of duplicated traces. Duplicated rays happen with strong point lights, where we may send a few identical rays to the same light doing unnecessary work.

Now require ray tracing platform support, in order to skip compiling and cooking MegaLights shaders on certain platforms.

## Niagara

Removed UNiagaraEmitter from stateless emitter on cook. (Also known as Lightweight Emitters)
- The cooked build does not require them, various parts of the UI still make assumptions and will be cleaned up.
- This saves ~4k per stateless emitter.

Use the component transform for local space vs the simulation one - When disabling requires current frame data (for performance) these could be out of sync, which mismatches other renderers on the RT (i.e. sprites & meshes)
- Disabling RequiresCurrentFrameData is an optimization checkbox that allows for better scheduling of the Niagara emitter ticks.

## PCG - FastGeometry

PCG GPU now leverages FastGeometry components to further improve on game thread performances when using the framework to generate and spawn a high density of static meshes, such as ground scatter and grass. It removes the need for any partition actors and creates local PCG components on the fly.

To benefit from the improvement, enable the **PCG FastGeo Interop plugin** in your project and set the CVAR `pcg.RuntimeGeneration.ISM.ComponentlessPrimitives` to 1.

## Mass Runtime

This update includes a series of low-level optimizations and architectural refinements to the Mass framework, aimed at improving overall performance, memory efficiency, and system stability in real-time scenarios.

The most notable addition is Processor Time-Slicing, which means long-running processors can be split across multiple frames. This helps reduce performance spikes and enables better distribution of heavy workloads, particularly useful in large-scale or simulation-heavy environments.

## Rendering

Release/Recycle Virtual Texture spaces after they are unused for some time.
- We don't release immediately to avoid cases during loading where this might trigger unnecessary Recreate/Resize work.
- The old behavior was to never Release/Recycle unless we ran out of space slots.
- Added `r.VT.SpaceReleaseFrames` to control this. The default is to release after 150 frames. Setting to -1 will return to the old behavior.

## FBIK and Retargeting Performance

We added performance improvements and control in Full Body IK and IK Retargeter. This provides a way for you to have performant retargeting at runtime.

- Improve posing with FBIK without a heavy performance cost (~20% speed increase).
- Use the stretch limb solver in IK Rig for performant runtime retargets.
- Use the FK rotation mode Copy Local for faster rotation transfer per chain.
- Enable performance profiling on the retarget stack.
- Add a LOD threshold per retarget operator.

## State Tree Runtime

Memory Optimization for Static Bindings: Delegate dispatchers, listeners, and property references are now stored outside of instance data, reducing per-node memory overhead.

## AI Navigation

AsyncNavWalkingMode can use navmesh normal instead of physics hit normal.
- Now always take the highest hit location in z when searching for ground location.
- Note: AsyncNavWalkingMode is a movement mode part of the new Mover 2.0 component and not available in the Character Movement Component.

NavMesh: Added a navmesh tile building optimization when using CompositeNavModifiers with lots of data.

## Audio

Made memory improvements for MetaSounds in the Operator Cache.

Added a new Virtualization Mode: Seek Restart. This mode will virtualize, but keep track of playback time and, when realized, seek to that time as if it was playing the whole time. It's a less accurate, but more performant alternative to Play When Silent.

Added an option to only support Vorbis decoding, not encoding, for memory-constrained targets.

## Blueprint Runtime

Fixed a memory leak when using containers with types that allocate memory by default.

## Mass

Added time-slicing with FMassEntityQuery::FExecutionLimiter to limit execution to a set entity count.

Added observers locking to commands flushing. This change results in batching observers calls, significantly reducing the number of individual observers executions (~20 times in CitySample).

## Iris Networking

Iris will eventually replace Epic's current Replication system. For those already using it in their projects, they made some more improvements.

Cleaner API Boundaries: We removed the Iris UReplicationBridge base class to reduce virtual call overhead and simplify code navigation. Most Iris systems already depend on UObjectReplicationBridge directly, so this change streamlines the inheritance model and avoids unnecessary indirection.

Implemented seamless travel support. If seamless travel support is not needed for a project the cvar net.Iris.AlwaysCreateLevelFilteringGroupsForPersistentLevels can be set to false to avoid unnecessary overhead of filtering objects in the persistent level.

Optimized polling to only poll objects/properties that are marked dirty.

NetEmulation:

- Added netEmulation setting to simulate buffer bloat on game traffic.
- Set PktBufferBloatInMS for outgoing packets and PktIncomingBufferBloatInMS for incoming packets.
  - Ex: 'netEmulation.PktBufferBloatInMS 1000' will apply 1sec of buffer bloat on outgoing traffic.
- netEmulation.BufferBloatCooldownTimeInMS can also be used to set a cooldown period between each buffer bloat occurrence.
  - Ex: 'netEmulation.BufferBloatCooldownTimeInMS 2000' means buffer bloat is not applied for 2secs after a buffer flush.
- Added a "BufferBloat" emulation profile that enables buffer bloat of 400ms (in and out) over an 'average' emulation profile.

Added metrics to measure the performance and behavior of the multi-server proxy.

Multithreaded Iris Polling Step:

- FObjectPoller can now kick off multiple FReplicationPollTasks, each of which processes a subset of the ObjectsConsideredForPolling array.
- This is set to process cache line sized Chunks in an interleaved pattern so that each task gets a roughly balanced amount of work, and we avoid false sharing the same cache line.
- Added capability for Networking Iris Polling phase to be run in parallel. This can be enabled by adding bAllowParallelTasks=true to the ReplicationSystemConfig

## Procedural

Fixed multiple performance bugs where GPU-resident data is unnecessarily read back when passing through Change Grid Size nodes.

Added LLM tags for tracking memory allocations.

Added a debug feature that repeatedly dispatches the compute graph to enable profiling, compiled out by default (`PCG_GPU_KERNEL_PROFILING`).

Added specific graph cache enabled and budget CVars for editor worlds vs game worlds.

## Platform Android

Added `-FastIterate` flag to Visual Studio/Rider/Quick Launch, to have libUnreal.so outside the APK, and made build iteration faster in general.

Now starts loading libUnreal dependencies early for faster startup time

## Landscape Editing

Landscape optimization for the editor: No longer inspects materials for finding mobile layer names when generating mobile weightmap allocations while there's no weightmap allocations in a given landscape component in the first place.

Performance optimization when undoing landscape edits.

Improved `landscape.DumpLODs` command: Now it only displays the landscape LOD information by default and -detailed needs to be used to get the verbose mip-to-mip delta information.

Remove redundant and unsafe non-blocking landscape Nanite build from PreSave. No longer builds Nanite at all on auto-saves.

## Dev Tools

Improved the summary outputs of UnrealPak. The units of memory now scale with the number of bytes making it easier to read for both smaller and larger containers.

## Build

Prevented Clang builds for Windows from launching multiple link jobs simultaneously to avoid memory exhaustion.

ThinLTO is now enabled by default for Clang based toolchains.
- Note: "LTO (Link Time Optimization) achieves better runtime performance through whole-program analysis and cross-module optimization. However, monolithic LTO implements this by merging all input into a single module, which is not scalable in time or memory, and also prevents fast incremental compiles." - [Clang docs](https://clang.llvm.org/docs/ThinLTO.html)

Added support for AVX10.

## Interchange (Asset Importing)

Reduced memory usage when importing static meshes & skeletal meshes.

Textures imported with non-power-of-2 dimensions or non-multiple-of-4 dimensions were previously automatically set to NeverStream and Uncompressed. This can now be toggled with a config setting :TextureImportSettings::bDoAutomaticTextureSettingsForNonPow2Textures .

Also when textures initially imported as nonpow2 are re-imported as pow2, they now get their settings automatically fixed to the defaults for pow2 textures.

Implemented a Nanite triangle threshold value on the Interchange generic asset pipeline, in order to enable Nanite only for meshes past a triangle count size.

## UI

Significantly improved the Content Browser column sort performance for large search results.

## Incremental Cooking

Incremental Cooking is now beta, but not immediately clear what improvements made it into this release.

## Build Health Tracking and Visualization (Experimental)

https://dev.epicgames.com/community/api/documentation/image/7a3307ca-81a8-42b0-ae1d-2500533774cf

As part of the Horde analytics tooling, we've introduced a new Build Health dashboard experimental feature that gives teams a way to monitor and inspect which BuildGraph steps across the projects change lists are completing as expected, and/or reporting errors.

This is part of an ongoing development to provide built-in functionality in Horde to help teams better understand the most common cause of build failures, monitor pressure on agent pools and other useful build performance metrics that impede your iteration times.

## Closing

This time around I omitted a lot more of the smaller performance wins to keep it a bit shorter and focus on the most impactful changes and the changes you should be aware of when upgrading engine versions.

If you are you interesting in learning more about game performance optimization, I have a professional training course used by dozens of AAA studios. Get more information [HERE](https://courses.tomlooman.com/p/unrealperformance?coupon_code=COMMUNITY15) or [reach out directly](https://www.tomlooman.com/contact/) for more information about team enrollment and studio training.


As always, follow me on [Twitter/X](https://x.com/t_looman), or [LinkedIn](https://www.linkedin.com/in/tomlooman/) for everything UE5 performance related!