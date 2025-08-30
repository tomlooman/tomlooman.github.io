---
title: "Exploring DLSS 2.0 in Unreal Engine"
date: 2021-02-01
categories: 
  - "rendering"
tags: 
  - "performance"
  - "rendering"
  - "ue4"
  - "unreal-engine"
coverImage: "ue4_survivalgame_dlss_header2.jpg"
---

Last year Nvidia announced DLSS 2.0 with the ability to open this new anti-aliasing solution for all games. The game-specific deep learning is no longer required as it was with prior iterations. For an indie dev that is especially exciting as the chance of getting onto Nvidia's SuperComputer was pretty slim. It's now easier than ever to add DLSS support to your Unreal Engine title!

Besides the new game agnostic algorithm, we also get much-improved anti-aliasing results which honestly looks pretty fantastic and somewhat unbelievable in games like Control (See [Digital Foundry's DLSS Comparison](https://www.youtube.com/watch?v=YWIKzRhYZm4)). You'll get a chance to see how DLSS performs in Unreal Engine through my own experiments below.

**Update: Since this article was posted it has become much easier to access the [DLSS Plugin for UE4](https://developer.nvidia.com/dlss/unreal-engine-4.26-plugin).**

For testing, I used my open-source [SurvivalGame](https://github.com/tomlooman/EpicSurvivalGameSeries) (available on GitHub) and [Dekogon Studios' City Subway Train](https://www.unrealengine.com/marketplace/en-US/product/city-subway-train-modular) asset.

[![](/assets/images/ue4_survivalgame_dlss_overview-900x422.jpg)]()
*SurvivalGame on GitHub received a graphical refresh for this DLSS Test.*

## What is DLSS?

DLSS stands for [Deep Learning Super Sampling](https://www.nvidia.com/en-us/geforce/technologies/dlss/) and in the 2.0 iteration it can use the Nvidia RTX cards' Tensor Cores to upscale lower resolution render buffers to the desired 'native' scale much better than any [existing upscale algorithm inside UE4](https://docs.unrealengine.com/en-US/RenderingAndGraphics/ScreenPercentage/index.html) currently. At the same time that DLSS upscales, it is performing anti-aliasing effectively gaining performance from rendering the scene and post-processing at reduced input resolution. This AA solution replaces TAA and so dithered materials don't seem to render the same with DLSS currently (where TAA would soften the dither pattern).

Remember that aliasing itself occurs from rasterizing a scene to pixels. Fewer pixels will cause higher aliasing, so the fact that DLSS actually fixes most aliasing while we provide it a much lower input than native is pretty amazing if you ask me.

[![](/assets/images/scenebaked_TXAAvsDLSS_Zoomed-900x356.jpg)]()
*DLSS used an internal resolution of 720p, upscaled to 1440p. Even Zoomed-in you can barely see the difference. (but there is a big gain in performance, some numbers further down)*

One title using DLSS to improve performance while maintaining visual fidelity is Deliver Us The Moon, built using UE4.

<iframe width="560" height="315" src="https://www.youtube.com/embed/via-LSKo_q4?si=6aekugn5p4lPaoFe" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Getting Started

For this article, Nvidia hooked me up with an RTX graphics card and access to the [Unreal Engine RTX/DLSS Branch on Github](https://developer.nvidia.com/unrealengine). With the new graphics card, I got to play with ray-tracing for things like shadows, reflections, ambient occlusion, and even full Path Tracing that is now available. But what excited me most in practical terms is DLSS 2.0 and it has been the least covered in the context of Unreal Engine.

**Update:** It's now much easier to get access to the DLSS Plugin! [Download it directly from Nvidia](https://developer.nvidia.com/dlss/unreal-engine-4.26-plugin) without an AppId! The .zip includes detailed setup instructions too. (original instructions posted here removed)

The internal resolution is downscaled automatically based on the DLSS quality-setting. You can choose between 5 modes from _Ultra Performance, Performance, Balanced, Quality,_ and _Ultra Quality_ (Although this last mode was '_not supported_' for my setup). Finally, you have the option to sharpen the output.

![](/assets/images/survival_dlss_perf_sharpen_ngxsettings.jpg)
*Helpful (UMG) Widget to display and test DLSS. (from Nvidia Branch)*

In my tests, the internal resolution can go down to 33% (in _Ultra Performance_, meant for 4K Displays) which is a huge saving in screen-space operations such as pixel shaders, post-processing, and ray-tracing in particular. Even at 50% for Performance & Quality modes it's still x4 fewer pixels to process. Judging from the provided UI the internal resolution can change on the fly between a predefined range (eg. from 50% to 69% in Quality-Mode) I'm not sure at this time how DLSS decides which exact internal resolution to use.

![](/assets/images/survival_sp50_noaa_zoomed-900x584.jpg)
*Zoomed view of 1440p at 50% (r.ScreenPercentage 50, no AA), this is the input data that DLSS has to work with.*

## Anti-Aliasing Quality (DLSS vs. TAA)

The default anti-aliasing solution for Unreal Engine is [Temporal AA](https://docs.unrealengine.com/en-US/Resources/ContentExamples/PostProcessing/1_14/index.html) (TAA) and so this is the main competitor for Nvidia's DLSS in the engine.

Since DLSS is using a lower internal resolution, the real test is whether it can maintain final image quality while improving performance. A second major benefit is how it scales to 4K Displays (unfortunately my monitor is only 1440p) as it can enable 4K Gaming on mid-range graphics cards by using a more reasonable internal resolution.

It's telling that often I had to double-check the screenshots to make sure I had the correct one between TAA and DLSS. Below you'll see a few zoomed-in comparisons so that image resizing can't interfere and honestly it's necessary in order to see the difference.

![](/assets/images/survival_zoom_txaa_cropbox.png)![](/assets/images/survival_zoom_dlss_quality_cropbox.png)
*Trees even look crisper on DLSS than native TAA. Cables hold up incredibly well, slightly harsh in places, mainly noticeable due to zoom-level.*

![](/assets/images/metro_test_fullres_35fps.png)![](/assets/images/metro_test_dlss_quality_64fps.png)
*Left: 1440p TAA, Right: DLSS Quality-mode (Zoomed)*

Nearly identical quality, slight error in the ceiling lights where a white line in the original texture got blown out by the upscaling algorithm causing a noticable stripe. I reckon this should be 'fixed' in the source texture instead.

![](/assets/images/subway_raster_zoom_txaa.jpg)![](/assets/images/subway_raster_zoom_dlss_quality.jpg)
*Left: TAA 1440p, Right: DLSS Quality-mode. (Zoomed)*

Reflections look ever so slightly different, this scene used ray-traced reflections on highly reflective materials.

## DLSS vs. TAA Performance

For the quality and performance comparison I've made a quick video toggling between the 3 different AA modes (TAA, DLSS Quality & Performance) to see the difference. As you'll notice the visual quality is often difficult to see while the framerate takes a big leap at the same time. I would even argue that Quality-mode can conjure a higher quality image in some cases (I found that my foliage scene 'felt' crisper with DLSS enabled).

<iframe width="560" height="315" src="https://www.youtube.com/embed/JSub3PQz76M?si=KTfDdDfnC40zt5Ti" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

_(Make sure to watch in 1440p and fullscreen.)_

### The Numbers

Please keep in mind these numbers were taken from my unoptimized scenes, running in standalone-mode (outside the editor) but not a cooked build. Several RT features were turned on to strain the system (including ray-traced reflections).

#### Forest Scene (RTX On 2560x1440)

[![](/assets/images/survival_dlss_quality_downscaled-900x506.jpg)]()
*Forest Scene (Note: Downscaled JPG from 1440p source)*

This scene was likely bottlenecked by the ray-traced reflections and so you'll see a huge gain in framerate as the internal resolution is reduced.

- TAA Baseline ~35 FPS
- DLSS Quality ~56 FPS (+60%)
- ... Balanced ~65 FPS (+85%)
- ... Performance ~75 FPS (+114%)
- ... Ultra Performance ~98 FPS (+180%?! - Noticeably blurry on 1440p, intended for 4K)

#### Subway Train (RTX On 2560x1024)

[![](/assets/images/ue4_subway_raster_dlss_quality_downscaled-900x506.jpg)]()
*Subway RTX On (Note: Downscaled JPG from 1440p source)*

The camera used a cinematic aspect ratio hence the 1024p height. This scene used similar RTX settings and even ray-traced ambient occlusion on top.

- TAA Baseline ~38 FPS
- DLSS Quality ~69 FPS (+82%)
- ... Performance ~100 FPS (+163%)

#### Subway Train (RTX Off 2560x1024)

[![](/assets/images/subway_raster_dlss_quality-900x496.jpg)]()
*Subway non-RTX (Note: Downscaled JPG from 1440p source)*

Without any further RT-options enabled the difference in performance between internal resolutions appears to diminish somewhat. Although this was just a single test and your mileage may vary (as with all performance metrics, GPUs are a complicated beast)

- TAA Baseline ~99 FPS
- DLSS Quality ~158 FPS (+60%)
- ... Performance ~164 FPS (+65%)

### Render Pass (DLSS)

The extra renderpass occurs during Post Processing much like traditional AA solutions. On my _Nvidia RTX 2080 Ti_ the cost to upscale to 1440p was about 0.8-1.2ms. This number seems to be consistent regardless of which quality mode is used. For reference, TAA at full 1440p costs about 0.22ms on my machine.

![](/assets/images/ue4_profilegpu_dlss-1-900x363.jpg)
*ProfileGPU Output Window.*

You can measure performance of individual render passes by either using "ProfileGPU" or "stat GPU" console commands.

### Performance Conclusions

The performance potential of DLSS is huge depending on your game's rendering bottleneck. Reducing internal resolution by 50% has an especially large benefit on RTX-enabled games with ray-tracing cost highly dependent on resolution.

Ray-tracing features appear to be working better with DLSS enabled from a visual standpoint too. RTAO (Ray-traced Ambient Occlusion) specifically causes wavy patterns almost like a scrolling water texture when combined with TAA. However, Enabling DLSS above Performance-mode completely eliminates these issues and provides a stable ambient occlusion.

## Conclusion

Throughout my experiments, I've been super impressed with the results of DLSS 2.0. The fact that this magically works on any game out of the box without Nvidia SuperComputer pre-processing is impressive.

The image quality remains high and sometimes even managed to be crisper than TAA. There are some artifacts I ran into, that were overall small compared to the large performance gains we saw across the board. I'd love to test this on a 4K Display which is where the tech can shine even more.

If you want to see more, [follow me on Twitter](https://twitter.com/t_looman) and **Subscribe below** to receive new articles straight to your inbox!

## References

- [Nvidia RTX/DLSS Unreal Engine Branches](https://developer.nvidia.com/unrealengine)
- [A Hands-on Look at Using Ray Tracing in Unreal Engine (GDC 2019)](https://www.youtube.com/watch?v=EekCn4wed1E)
- [Ray Tracing Unreal Documentation](https://docs.unrealengine.com/en-US/RenderingAndGraphics/RayTracing/index.html)
- [StorageHouse Set (Demo Scene)](https://www.unrealengine.com/marketplace/en-US/product/storage-house-set)
- [DLSS 2.0 tested: why you should finally turn on Nvidia's AI-powered upscaling](https://www.pcgamer.com/nvidia-dlss-2-performance-benchmarks-control-wolfenstein-youngblood/)
- [Death Stranding PC DLSS 2.0 vs PS4 Pro Checkerboarding](https://www.youtube.com/watch?v=9ggro8CyZK4)
