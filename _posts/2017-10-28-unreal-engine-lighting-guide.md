---
title: "Unreal Engine Lighting Masterclass"
date: 2017-10-28
categories: 
  - "materials"
  - "rendering"
coverImage: "ue4_lightingexample_thumb.jpg"
---

Unreal Engine posted an excellent MasterClass talk by Jerome Platteaux on Lighting during **[Unreal Dev Day Montreal 2017](https://www.unrealengine.com/en-US/blog/unreal-dev-day-montreal-presentations-released)**. The video is worth a full watch, it contains tons of interesting practical tips and explains many of the **[Lightmass](https://docs.unrealengine.com/latest/INT/Engine/Rendering/LightingAndShadows/Lightmass/index.html)** features of Unreal Engine 4. I am writing this post to create a personal reference of all the useful data contained in this video without having to scroll through the video every time I am looking for some information. I mostly focused on the Lightmass information given during the talk, there is a lot more information that's worthwhile, so I recommend watching the whole thing. I hope this helps you too, let's dive in!

https://www.youtube.com/watch?v=ihg4uirMcec

### Post-processing Setup (Pre-lighting)

Before you start lighting your scene, there are a couple of post processing settings to change to get consistent results in reviewing your light bakes. (**10:00 video timestamp**)

- Deactivate **Auto Exposure**
- Deactivate **SSAO and SSR**
- Keep **default tone mapper**
- **Vignetting** = off
- **Bloom** = off

To properly test your lighting set up reference spheres to visualize the lighting results in the map. Here are the material settings:

- Chrome Sphere
    - Base Color 1
    - Metallic 1
    - Roughness 0
- Grey Sphere (50% Grey, sRGB)
    - Base Color 0.18 (Linear)
    - Roughness 1
    - Metallic 0

With a Directional Light set at 3.14 in your scene that should give you the same intensity of 0.50 Grey (which you can check with a Color Picker either in-engine or on your screenshot via Photoshop)

### Setting up Lightmaps

Check out the Static Mesh Editor to let Unreal Engine generate lightmaps for you. By specifying the Min Lightmap Resolution you define the space between each UV island (Padding) By keeping this the same as the actual lightmap sizes used on the asset you get the best padding on the lightmaps and thereby better shadows in the same resolution. (**16:36 video timestamp**)

[![](images/ue4_lightmapresolution.jpg)]()

### Lighting Quality Settings

Jerome provides us with a great comparison of some of the most important Lightmass settings, the effect on quality and bake times for each. I've compiled the list below to easily review their individual effects.

#### Num Indirect Lighting Bounce (19:27)

Users tend to go crazy and bounce up to 100 times, this doesn't affect the build time much fortunately. However, it also doesn't increase the end light quality much either. About 3 to 5 bounces should be enough. Check out the screenshots for his comparison of bounce count below.

- Bounce 0 (2 minutes 54 seconds)
- Bounce 1 (3 minutes 41 seconds)
- Bounce 2 (3 minutes 35 seconds)
- Bounce 3 (3 minutes 46 seconds)
- Bounce 100 (3 minutes 31 seconds)

[![](images/ue4_lightbounce_1.jpg)]()

[![](images/ue4_lightbounce_2.jpg)]()

[![](images/ue4_lightbounce_3.jpg)]()

[![](images/ue4_lightbounce_4.jpg)]()

[![](images/ue4_lightbounce_5.jpg)]()

#### Static Lighting Level Scale (20:20)

Changes the scale of the level for lightmass, where lower scales results in more light evaluation detail. With fine details you will see them influence the scene more with a lower level-scale.

[![](images/ue4_lightlevelscale_1.jpg)]()

[![](images/ue4_lightlevelscale_2.jpg)]()

[![](images/ue4_lightlevelscale_3.jpg)]()

[![](images/ue4_lightlevelscale_4.jpg)]()

#### Indirect Lighting Smoothness (**21:00**)

Increasing the smoothness value above 1 reduces the noise in the indirect lighting, at the cost of increased build times. This noise would for example originate from the Level Scale value tweaked before.

[![](images/ue4_indirectlightingsmoothness_05.jpg)]()

[![](images/ue4_indirectlightingsmoothness_08.jpg)]()

[![](images/ue4_indirectlightingsmoothness_1.jpg)]()

[![](images/ue4_indirectlightingsmoothness_2.jpg)]()

#### Indirect Lighting Quality (**21:51**)

Increases the number of rays for the final gathering. Ranges between 1 and 10, with a high impact on lighting build times. Reduces the noise in the indirect light bounces.

- Indirect Lighting Quality 1 (7 minutes 48 seconds)
- Indirect Lighting Quality 2 (12 minutes 55 seconds)
- Indirect Lighting Quality 5 (29 minutes 46 seconds)
- Indirect Lighting Quality 10 (1 hour 5 minutes 24 seconds)

[![](images/ue4_indirectlightingquality_1.jpg)]()

[![](images/ue4_indirectlightingquality_2.jpg)]()

[![](images/ue4_indirectlightingquality_5.jpg)]()

[![](images/ue4_indirectlightingquality_10.jpg)]()

#### Lighting Build Quality (22:10)

The biggest setting before building light. Especially jumping from High to Production has a huge impact on build times.

- Preview (2 minutes 16 seconds)
- Medium (7 minutes 48 seconds)
- High (13 minutes 58 seconds)
- Production (30 minutes 22 seconds)

#### Lighting Level Scale vs. Indirect Lighting Quality

With lighting quality set to Production-level, you can use the below formula for as a reference to get good lighting results. The formula works in that since with a low level scale, you will introduce a lot of noise, increasing indirect lighting quality can offset this to reduce the artifacts.

_Static Lighting Level Scale X Indirect Lighting Quality = 1_

- 0.1 x 10
- 0.2 x 5
- 0.5 x 2

Artifacts can be reduced to an acceptable level when the above multiplication results in 1.0.

#### Impact of settings on build times

- Static Lighting Level Scale - Details of Lightmass (**Medium**)
- Num Indirect Lighting Bounces - Brightness of Scene (**Low**)
- Indirect Lighting Quality - Decreases Artifact Noise (**High**)
- Indirect Lighting Smoothness - Blurs indirect light component in Lightmap (**Low**)

Example of the scene used during the demo with a few high-end quality settings:

[![](images/ue4_lightingexample.jpg)]()

#### Directional Light Stationary Area Shadow (41:42)

Broadens the shadow of the directional light for overcast like lighting scenarios. Range is between 1 and 10.

[![](images/ue4_areashadow.jpg)]()

[![](images/ue4_areashadow_example.jpg)]()

[![](images/ue4_areashadow_overcast.jpg)]()

#### Contact Shadows

Contact Shadows add shadows for little details on bigger geometry such as the lamps below. This feature is a little heavy (numbers missing) and personally (Tom, not Jerome), as of 4.17, I found it had some artifacts for these small objects in a distance and haven't used it much because of it. The value here is small, so start off with 0.1 and go from there.

[![](images/ue4_contactshadowlength.jpg)]()

#### Conclusion

As I stated at the start, I recommend at least one full sitting of the entire Masterclass video by Jerome. It has many more interesting bits of information, but not all belong in this excerpt as I am keeping this specific to light baking, stats and numbers for future reference. For example, the full talk has more information on the available features like Portals, Cascaded Shadow Maps, etc., this knowledge does not need to be refreshed as there are no numbers involved.

**Hope you found this useful! As always you can follow me on** [**Twitter**](https://twitter.com/t_looman) **or subscribe to the blog for future updates!**

#### Further Reading

- [Lighting Troubleshooting Guide](https://wiki.unrealengine.com/LightingTroubleshootingGuide) (UE4 Wiki)
- [Lightmass Global Illumination](https://docs.unrealengine.com/latest/INT/Engine/Rendering/LightingAndShadows/Lightmass/)
