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

Deprecate SSGI (Screen Space Global Illumination). SSGI is superseded by Lumen GI. // The intend is most likely to just use Lumen Lite now instead of SSGI.

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

## Fast Geometry Plugin

...

## World Partition

Unreal Insights: "We added world partition streaming debugging tools to Unreal Insights and Unreal Editor, making possible per-cell analysis and sessions playback."

