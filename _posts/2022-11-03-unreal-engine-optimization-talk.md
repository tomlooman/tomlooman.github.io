---
title: "Unreal Engine Game Optimization on a Budget"
date: 2022-11-03
last_modified_at: 30-08-2025
categories: 
  - "Performance & Optimization"
tags: 
  - "Profiling"
  - "Performance"
  - "Rendering"
  - "Nanite"
  - "Console Commands"
  - "Tech Talk"
coverImage: "Thumb_JetBrainsPerfTalk-1.jpg"
last-modified-at: 18-08-2025
sidebar:
    nav: sidebar-optimization
---

For the JetBrains GameDev Day, I was invited to give a talk about Unreal Engine. I decided to create one for game optimization in Unreal Engine. It's a topic I've been spending a lot of time with recently and wanted to share some tips and tricks. The slot of 45 minutes had only room for so much...so expect more performance-oriented blog posts from me soon!

{: .notice--info }
Certain rendering features are not supported by Unreal Engine 5's Nanite Virtualized Geometry. These limitations are called out in the individual sections.

## Talk Motivation and Contents

"on a budget" from the title of the talk refers to cheap and easy-to-apply optimizations for a wide range of projects. I won't be talking about highly complex custom systems or engine modifications.

**I recommend you watch the full presentation**, the summarized version contains only brief notes with each slide.

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/G51QWcitCII?si=srQyyCvQVci00QPP" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Profiling Preparations

Before you can start profiling make sure you are set up. Here is a brief checklist of things to keep in mind when profiling. Disabling `vsync` and other framerate features. Having unbaked lights can drastically influence performance and muddy your results while profiling as slower render paths are used.

Ideally, when profiling with tools such as Unreal Insights you package your game rather than running from within the editor. Besides getting very different memory usage and more hitching level streaming, your frame timings may be quite different in an editor build as well. Running the game in 'Standalone' is still very convenient, make sure your Editor viewport has 'Realtime' disabled and is minimized.

- `r.vsync 0`
- `t.maxfps 0`
- SmoothFrameRate = false (Project Settings)
- Lighting Built & MapCheck Errors resolved
- Packaged Game build
    - Editor 'Standalone' is convenient (however memory and certain timings may be inaccurate)

## Find the Bottleneck

You should not be blindly optimizing code in your project. Instead, make sure you measure and find your bottleneck. With Game, Render, and GPU all running asynchronously from each other, it's important to know which is your bottleneck or you are not going to see any meaningful performance gains.

- Game Thread / Render Thread / GPU
    - Unreal Insights
    - ProfileGPU + `r.RHISetGPUCaptureOptions 1`
    - `stat unitgraph`    
    - `stat detailed`  
    - `r.screenpercentage 20`    
    - `pause` (Freeze Game Thread)
- Memory & Loading
    - Unreal Insights (`-trace=memory,loadtime,file`)
    - `memreport -full`
    - `loadtimes.dumpreport`

## Unreal Insights

Unreal Insights is the new flagship profiling tool that came in late Unreal Engine 4 and is still seeing major improvements in 5.0 with more advanced Memory profiling for example.

- Detailed Insights into the frame timings:
    - CPU/GPU  
    - Memory  
    - File Loading    
    - Threading
- Drill down on a single frame or session

![](/assets/images/insights_overview.png)

### Trace Channels

Some common trace channels to use on your game executable or in Standalone. `statnamedevents` argument provides more detailed information on object names.

- `-trace=log,cpu,gpu,frame,bookmark,loadtime,file,memory,net`
- `-statnamedevents`

[Full list of Trace Channels](http://docs.unrealengine.com/5.0/en-US/unreal-insights-reference-in-unreal-engine-5)

![](/assets/images/pie_standalone_arguments.png)

### Bookmarks

Bookmarks add contextual information about changes and transitions that happens during the profiling session. This includes streaming in new levels, executing console commands, starting a cinematic sequence, etc. You can easily add new bookmarks to your own game code to add more context. While profiling use `bookmark` trace channel.

Bookmarks for context and transitions
- GC (Garbage Collection)  
- Sequencer Start  
- Level streaming (Start/Complete) 
- Console Commands

C++: `TRACE_BOOKMARK(Format, Args)`

![](/assets/images/insights_bookmarks.png)

### Add new 'stat' profiling

For your C++ game code, it can be valuable to include additional profiling details by adding your own stat tracing. By default your blueprint functions will only show up as 'Blueprint Time', adding custom profiling will add more details on where this time is spent if that Blueprint called into your C++ game code. This is relatively straightforward to do and is detailed in my blog post below.

- Add profiling detail to your game code
- Track as “stat _YourCategory_” in the viewport or via Insights.

I previously wrote about this topic before in [Profiling Stats (Stat Commands)](/unreal-engine-profiling-stat-commands/).

![](/assets/images/insight_statcyclecounter.png)

![](/assets/images/insights_customstats.png)

### Unreal Insight Tips

It may prove valuable to run some commands during a profiling session to see how this affects your frame in great detail. Especially as some features are first processed on the Game Thread, and may then get handled by the Render Thread later that frame such as Skeletal Meshes.

- Run commands to compare during the session (Shows as Bookmark)
    - `r.ScreenPercentage 20`
    - `pause`
- Use only necessary Trace Channels for lower overhead
- Add custom Bookmarks for gameplay context

## Memreport -full

`memreport -full` provides a great insight into your memory usage and whether assets are loaded unintentionally. Drilling down into a specific asset type with `obj list class=` will provide further details on the most expensive assets. You can use this information to know which assets to optimize and review whether they should be in memory at this point at all.

- `memreport -full`
    - Runs a number of individual commands for memory profiling
- `obj list class=`
    - Example: `obj list class=AnimSequence`
- Only in Packaged Builds for accurate results
    - Example: `AnimSequence` is twice as large in editor builds.

![](/assets/images/memreport.png)

## DumpTicks

`DumpTicks` is a great first step to optimizing Game Thread performance. Dump all ticking objects to review what should be ticking or whether they can be disabled.

- `dumpticks` / `dumpticks grouped`
    - Outputs all Actor and Component Ticks
- `listtimers`
    - Run on low frequency
    - avoid heavy load (stuttering)
- `stat uobjects`
- Disable/Reduce further with _Significance Manager_
    - _More on that later…_

## Collision & Physics

By default meshes in your scenes will have both physics and collision enabled. This can be wasteful if you don't use physics and especially if a lot of them are moving around. Player movement only requires 'QueryOnly' on objects and so it's possible you are wasting CPU and memory on loading and maintaining physics bodies that remain unused.

- Unreal configured to just work out of the box.
    - “Collision Enabled” => Physics + Query    
    - Most things require just ‘QueryOnly’
- Disable Components that players can’t reach or interact with.
- Profiling
    - `stat physics`  
    - `stat collision` 
    - `obj list class=BodySetup` 
    - `show CollisionPawn` 
    - `show CollisionVisibility`

{: .notice--info }
Tip: Landscape Components may use lower collision MIPs to reduce memory overhead and collision complexity.

## Moving SceneComponents

Moving game objects with a lot of `SceneComponents` is far from free. Especially if you use default settings. There are some easy optimizations to apply which can greatly reduce CPU cost.

- Move/Rotate only once per frame
- Disable Collision & GenerateOverlaps=False
- AutoManageAttachment
    - Audio & Niagara
- Profiling
    - `stat component`

![](/assets/images/insights_movecomponents.png)
*two large yellow 'MoveComponent' sections due to SetActorLocation, and SetActorRotation separate calls.*

### Component Bounds

While not expensive on a per-component basis, with tons of `PrimitiveComponents` in a single Blueprint this can add up. Be considerate when re-using the parent's bounds as the child may be outside the bounds when animating the object which will cause render popping as the camera starts to look away.

- `UseAttachParentBound=True`
    - Skips “CalcBounds”
- `show Bounds` or `showflag.bounds 1`

![](/assets/images/boundsmadness_cropped.jpg)

![](/assets/images/insights_example_calcbounds.png)

## Significance Manager

[Significance Manager](https://docs.unrealengine.com/4.27/en-US/TestingAndOptimization/PerformanceAndProfiling/SignificanceManager/) provides a bare-bones framework to calculate a 'significance' value for gameplay objects and scale down their features on the fly. You might reduce the tickrate on distant AI agents, or disable animation entirely until they get close enough. This system will be highly specific to your game and will be especially helpful for non-linear experiences where you can't rely on trigger volumes to disable these gameplay objects.

Significance Manager is often only briefly mentioned but can be challenging to get started with. I'm currently writing a blog post and have some example code on my GitHub. The implementation can be pretty straightforward depending on your needs, so it's a worthwhile system to explore!

- Scale down fidelity based on game-specific logic
    - Distance To
    - Max number of objects in full fidelity (‘buckets’)
- Calculates ‘significance value’ to scale-down game objects.
    - Examples: NPCs, puzzle Actors, Vehicles, other Players
- Reduce/Cull:
    - Tick rate 
    - Traces / Queries 
    - Animation updates (SKs) 
    - Audio/Particle playback or update rate
- Profiling
    - ShowDebug SignificanceManager
        - `sigman.filtertag <name>`
    - `stat significancemanager`
- Examples
    - **[GitHub.com/tomlooman/ActionRoguelike](https://github.com/tomlooman/ActionRoguelike)**
    - USSignificanceComponent.h

## Occlusion Culling

Occlusion Culling is often a costly part of your frame and something that may be difficult to tackle without knowing what's adding this cost and the tools available to optimize. The easiest is to reduce the number of considered primitives. This is where level streaming, [HLOD](https://docs.unrealengine.com/4.27/en-US/BuildingWorlds/HLOD/), and distance culling can be a great help.

{: .notice--info }
Note: Nanite in UE5 has an entirely different occlusion culling system (Two-pass HZB) running on the GPU. This no longer queries the GPU occlusion queries on the N+1 frame. Non-nanite geometry in UE5 can still use this 'old' behavior.

- Frustum Culling and Occlusion Queries
- GPU query results polled in next frame
- **HLOD** can greatly reduce occlusion cost (See below)
- Profiling
    - `r.visualizeoccludedprimitives 1` 
    - `stat initviews`

![](/assets/images/occlusion_HLOD_1.jpg)
*modular mesh building, many occluded parts*

![](/assets/images/occlusion_HLOD_2.jpg)
*Single HLOD generated for static geometry.*

## RenderDoc: Occlusion Query Results

[RenderDoc](https://renderdoc.org/) is a fantastic tool to help dissect and understand how Unreal is rendering your frame. In this example, I use the DepthTest to visualize the occlusion query result. You may find you are sending hundreds of queries with boxes of only a few pixels in size that had no chance of ever succeeding or the tiny mesh even being relevant to the frame once rendered.

- `DepthTest` Overlay in RenderDoc
- Easily find ‘wasteful’ queries on tiny/far objects

{: .notice--info }
Note: As mentioned in the previous section. Nanite does not issue individual GPU occlusion queries. This visualization can still be used for non-Nanite meshes.

![](/assets/images/renderdoc_depthtest.png)

## Distance Culling

Distance Culling is an effective way to reduce the cost of occlusion. Small props can be distance culled using a per-instance setting or using [Distance Cull Volume](https://docs.unrealengine.com/4.27/en-US/RenderingAndGraphics/VisibilityCulling/CullDistanceVolume/) to map an object Size with cull Distance. Objects culled this way don't need GPU occlusion queries, which can significantly cut cost.

Distance Culling is not supported for Nanite. Non-nanite geometry such as translucent meshes still do.

- PrimitiveComponent: Max/Min Draw Distance
    - Light Cones, Fog Volumes, Blueprint Components
- Distance Cull Volume
    - Maps object “Size” with “CullDistance” 
    - Reduce Occlusion Query cost
- Profiling
    - `showflag.distanceculledprimitives 1` 
    - `stat initviews`

## Min/Max Draw Distance

MinDrawDistance may be useful to cull up-close translucent surfaces that cause a lot of overdraw and don't necessarily contribute a lot to your scene (eg. it might even fade out when near the camera in the material, this still requires the pixel to be evaluated).

- Example: Light Cones
- Vis: Shader Complexity
    - Pixel Overdraw
- DistanceCullFade
    - Blends 0-1, 1-0

Min/Max Draw Distance is not supported for Nanite.

![](/assets/images/minmaxdrawdistance_1.png)()
*Default scene with many overlapping surfaces*

![](/assets/images/minmaxdrawdistance_2.png)()
*Min+Max Draw distance Set*

![](/assets/images/culldistancenode_2.png)()

## FreezeRendering

Freeze the occlusion culling to see whether your scene is properly occluded or if certain Actors are still rendered unexpectedly.

FreezeRendering does not work with Nanite.

- ‘FreezeRendering’ + **;** (semi-colon) to fly with DebugCamera
- Verify occlusion is working as expected

![](/assets/images/ue_freezerendering_1.jpg)()
*Player looking toward building*

![](/assets/images/ue_freezerendering_2.jpg)
*FreezeRendering enabled*

## Light Culling (Stationary & Movable)

Lights can still add considerable cost to your render thread even if they aren't contributing much or anything at all. Fading them out at range can help, make sure they don't more or change unless they absolutely have to. Avoid overlapping too many stationary lights (Max 4) or one will be forced Movable, adding considerable cost to your frame.

- Automatic ScreenSize culling is not strict enough
    - MinScreenRadiusForLights (0.03)
- Cull earlier case-by-case
    - MaxDrawDistance
    - MaxDistanceFadeRange
- Profiling
    - Show \> LightComplexity (Alt+7)
    - Show \> StationaryLightOverlap
    - ToggleLight \<partialname\>

![](/assets/images/lightcomplexity.png)
*Too many overlapping stationary lights*

## Level Streaming

[Level Streaming](https://docs.unrealengine.com/4.27/en-US/BuildingWorlds/LevelStreaming/) should be considered early in the level design to avoid headaches later. This includes splitting up level sections into sublevels and thinking about good moments to load/unload these levels.

Besides reducing the memory load potentially significantly, it can help occlusion cost a lot by keeping more levels hidden (or unloaded entirely) for as long as possible. `bShouldBeVisible` can be used in C++/Blueprint to hide the level. This keeps it in memory but out of consideration for occlusion etc.

- Streaming Volumes vs. Manual Load/Unload
    - Camera Location based (caution: third person view and cinematic shots)
    - Cannot combine both on a specific sublevel, can mix within the game
- Profiling
    - `stat levels`    
    - `Loadtimes.dumpreport` (+ loadtimes.reset) 
    - Unreal Insight
        - Look for level load & “GC” bookmarks     
        - `loadtime,file` trace channels
- Performance Impacts
    - Initial level load time 
    - Occlusion cost 
    - Memory
- Options: Load, LoadNotVisible, LoadVisible
    - Keep in memory while hiding to aid the renderer
- Consider streaming early in Level Design!
    - Splitting into multiple ULevels    
    - Line of sight, natural corridors and points of no return

## Animation

The following [Animation Optimization](https://docs.unrealengine.com/5.0/en-US/animation-optimization-in-unreal-engine/) doc page contains more information about the tips presented in the talk.

![](/assets/images/warnaboutblueprintusage.png)

![](/assets/images/anim_fastpathenabed.png)

### Fast Path

- Allow ‘Fast Path’ by moving Computations out of AnimGraph (into EventGraph)
    - Use WarnAboutBlueprintUsage to get warnings in AnimGraph
- Profiling
    - `stat anim`

### Quick Wins

Skeletal Meshes add a chunky amount of processing to your CPU threads, there are some easy wins to look into when you have many SKs alive at a time, especially if they don't always contribute to the frame.

- Update Rate Optimization (URO) for distant SkelMeshes
- VisibilityBasedAnimTickOption (per-class and config variable in DefaultEngine.ini)
    - OnlyTickPoseWhenRendered 
    - AlwaysTickPoseAndRefreshBones 
    - …
- More Bools!
    - `bRenderAsStatic`
    - `bPauseAnims`
    - `bNoSkeletonUpdate`

### Animation Compression Library (ACL)

This animation compression library has cut the memory size for animations in half in the most recent title I worked with. Far greater decompression speeds can improve loading times as well. It works independently from Oodle (below).

The ACL plugin is built in with Unreal Engine 5.3+. Existing projects that migrated (to 5.3+) may still need to manually update their animations to compress using ACL.

- [ACL Plugin](https://docs.unrealengine.com/5.3/en-US/animation-compression-library-in-unreal-engine/) (by Nicholas Frechette)
- Compression speed-up (from minutes to seconds!, 56x faster)
- Decompression Speed (8.4x faster)
- Memory Size (cut in half across the game)
- Used in _Fortnite_ and other AAA titles

## Oodle Data & Oodle Texture

[Oodle](https://docs.unrealengine.com/4.27/en-US/TestingAndOptimization/Oodle/) has been providing incredible compression for years, and more recently ships with Unreal out of the box. It can greatly improve game packaged sizes and with faster decompression, it can improve load times as well!

- RDO (Rate Distortion Optimization) Compression
    - Significant gains in compression compared to the default 
    - Takes longer to compress (off by default in-editor)
- RDO Works with Oodle Data by ‘preparing’ the texture data

![](/assets/images/oodledata_config.png)

## SynthBenchmark

Scalability is a critical concept to allow your game to run on a wide range of devices. The hardware benchmark tool helps you evaluate the power of the machine the game is running on and apply a base layer of scalability (Low to Epic in the available categories such as Shadow Rendering, View Distance, etc.).

I wrote a blog post about applying [Hardware Benchmark for default scalability](/unreal-engine-optimal-graphics-settings/).

- Run CPU/GPU benchmark and apply Scalability Settings
- Returns “score” with 100 baseline for Avg. CPU/GPU

## Shadow Proxies

Using Shadow Proxies is a manual process to reduce the often significant shadow rendering cost in your scene. You might have beautiful and modular buildings that cause a ton of draw calls and potentially millions of triangles for just shadow depth rendering. A big downside of this system is the manual and destructive workflow. I wanted to point this trick out regardless and with UE5's geometry script, it may be only a few nodes away from generating simplified mesh proxies on the fly!

Your Mileage may very greatly for Nanite geometry. Requires additional testing is this is still a viable trick for certain Nanite geometry such as Foliage.

- Single low-poly silhouette mesh
    - RenderMainPass=False
- Bespoke mesh or using built-in Mesh Tools
    - ‘Merge Actors’ (Right-Click assets in level) 
    - UE5 Geometry Script
- Profiling
    - ‘ShadowDepths’ in Insights &    
    - ProfileGPU + r.RHISetGPUCaptureOptions 1

![](/assets/images/ue_modularbuilding.jpg)

![](/assets/images/mergeactors_panel.png)

## SizeMap (Disk & Memory)

SizeMap is a valuable tool to quickly find and address hard references in your content. This is an often hidden danger that can add considerable development cost and the end of your project once you're struggling with memory and load times.

- Find unexpected references and bloated content
- Use on Blueprints and (sub)Levels early and often

Check out Mark Craig's recent talk on [the hidden danger of Asset Dependency Chains](https://www.youtube.com/watch?v=4-oRyDLfo7M).

![](/assets/images/sizemap.jpg)

## Statistics Window

I found myself often using this panel to investigate opportunities for memory and total map sizes. Especially Landscape assets will show up as huge bloated assets. Reducing collision complexity and deleting unseen Landscape Components can help a lot here. You may find certain asset variants used only once in the level, and can consider swapping these out to keep them out of memory and your load screen entirely!

- Stats on current level
    - Primitive Stats 
    - Texture Stats
- Tip: Shift-click for _secondary_ sort.
    - Sort ‘Count’ + ‘Tris’ or ‘Size’ (Find large assets used only once)

![](/assets/images/statistics_panel.png)

## Useful Console Commands

- `ToggleForceDefaultMaterial` _(Non-Nanite)_
    - Will show significant changes to BasePass cost as everything can render with the same shader. You can use this to compare your scene and see how your shaders are affecting it.
- `stat Dumphitches`
    - profiling hitches can be problematic, this is a first step in finding expensive function calls when a hitch does occur
- `stat none` (clear all categories on screen)
- `r.ForceLODShadow X` (CSM & Non-Nanite) or `r.Shadow.NaniteLODBias` (VSM + Nanite)
    - For low-end platforms, the forced shadow LOD can be one of those easy to do tricks to significantly cut down on triangles rendered for shadows with cascaded shadow mapping. Make sure you have good LODs! Virtual Shadow Mapping (VSM) has a better LOD Bias (`r.Shadow.NaniteLODBias`) option available instead of a forced LOD when using Nanite as well.

## Closing

**Eager to learn more about [Game Optimization in Unreal Engine](https://courses.tomlooman.com/p/unrealperformance)?** I got you covered with a complete course to guide you and your team through the entire process of performance optimization for games. It coveres a wide range of topics including Unreal Insights and specific CPU, GPU and memory optimizations.

To stay up-to-date with any new optimization articles sign up for my Newsletter below and [follow me on Twitter](https://twitter.com/t_looman)!
