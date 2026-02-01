---
title: "Distance Fields in Unreal Engine"
date: 2014-10-10
categories: 
  - "Rendering"
tags:
  - "Rendering"
  - "distance-fields"
coverImage: "DF_featured_03.jpg"
sidebar:
    nav: sidebar-optimization
---

Unreal Engine leverages the power of Signed Distance Fields for Ambient Occlusion and more recently added Ray Traced Distance Field Soft Shadows. I will briefly discuss and demonstrate both effects as a result of some early research to consider using these techniques for our game. Since the core of Switch's design hinges on fully dynamic levels, we simply cannot bake down any lighting. As a result we have to look out for a better approach to create scene definition and toning that is both fully dynamic and lightweight enough to run on a wide range of PCs.

## Distance Field Ambient Occlusion

The Unreal 4.3 release introduced [Distance Field Ambient Occlusion](https://docs.unrealengine.com/latest/INT/Engine/Rendering/LightingAndShadows/DistanceFieldAmbientOcclusion/index.html) using a Signed Distance Field. The basic principle of a distance field is that it represents the distance from the object to the point in the the grid. [ByteWrangler](http://bytewrangler.blogspot.nl/2011/10/signed-distance-fields.html) has a nice and simple explanation on distance field in 2d if you'd like to know more. To better understand how DFAO can be of use for my games, I did some setup & research using the Unreal examples and some of the meshes we currently have available for our project.

###### Unreal 4 Mobile Demo Scene

\[gallery link="file" type="slideshow" ids="976,977,978,979"\]

###### DFAO In Switch

A quick test on the meshes we use in Switch revealed mixed results, mostly due to open mesh hulls which the documentation pages do mention may cause issues. Our test wall which is completely triangle sealed did provide much better results.

\[gallery link="file" type="slideshow" ids="1002,1001,1003"\]

###### Issues & Performance

At it stands the effect is quite a burden on the GPU (See documentation for [performance measurements](https://docs.unrealengine.com/latest/INT/Engine/Rendering/LightingAndShadows/DistanceFieldAmbientOcclusion/index.html#performance)) and the impact was very noticable when first using this in a full level. I will keep an eye out for upcoming updates to Epic's DFAO and revisit this in the future once we got our new art. Until then SSAO and baked self-occlusion maps are a good alternative for us.

## Ray Traced Distance Field Soft Shadows

The preview release of 4.5 introduced [Ray Traced Distance Field Soft Shadows](https://www.unrealengine.com/blog/unreal-engine-45-preview-notes) to the Unreal Engine, while I am not aware of the full implementation details, I can show you the practical effect in-game using the Sun Temple & Effects Cave examples from Unreal.

The image below illustrates the basic goal of the soft shadowing technique, hard shadows near the caster that slowly soften as they get further away. This adds an incredible amount of shadow quality using a simple checkbox and can work wonders on your long normally low detailed directional shadows too when using high frequency details like rails.

![unreal 4.5 ray traced distance field soft shadows](/assets/images/ue45_softshadows_01.jpg)

###### Sun Temple

\[gallery type="slideshow" ids="973,974"\]

One thing that stands out in the Sun Temple demo is the increased quality of the pillars on the right side, using soft shadows you get a much more accurate result.

###### Effects Cave

\[gallery type="slideshow" ids="961,962"\]

In the final test I enabled soft shadows in the Landscape Demo and did not encounter a huge difference there. Primarily more accurate shadows on the rocks and bridges so I left it out.

#### Visualizing Distance Fields

The editor supports some cool visualizations, be sure to check the "_Mesh DistanceFields_" (shown below) when working with DFAO or soft shadows. The "_DistanceField AO_" visualizer only displays the generated AO as seen in the test wall comparison image above (under "DFAO in Switch")

![DF_Menuoptions](/assets/images/DF_Menuoptions.jpg)

#### Limitations

The official documentation lists several [limitations](https://docs.unrealengine.com/latest/INT/Engine/Rendering/LightingAndShadows/DistanceFieldAmbientOcclusion/index.html#limitations) and future improvements for DFAO. What struck me the most is the current GPU cost of the technique, 4.5ms vs. 0.6 ms of SSAO on a 7970 at 1080p. This is fairly high and I did notice an immediate drop in performance when doing some initial tests on Switch. With the effect being used in Epic's very own Fortnite I hope they will continue to improve upon the technique and hopefully find some performance gains along the way.

The Ambient Occlusion technique does not work flawlessly for all situations and models, I recommend giving it a try when you have a good representation of your final geometric style and see if this technique is well-suited. The same seems true for Soft Shadows and I've found a few cases that yielded undesirable results. The angel figure in the Mobile demo is a good example where Soft Shadows did not yield the expected results. Skeletal Meshes do not work with soft shadows and as a result don't display a shadow at all (You may notice that they will not show up in the Mesh DistanceField visualizer either)

![SoftShadows_Artifacts_Comparison](/assets/images/SoftShadows_Artifacts_Comparison.jpg)

**Update: To resolve the shadowing issues above the distance field resolution map should be increased. More info on the [official docs page](https://docs.unrealengine.com/latest/INT/Engine/Rendering/LightingAndShadows/DistanceFieldAmbientOcclusion/index.html#limitations).**

###### Further Reading

- [ByteWrangler](http://bytewrangler.blogspot.nl/2011/10/signed-distance-fields.html) has a nice and simple explanation of Signed Distance Fields (2D) with text rendering as example.
- [Unreal Engine - Distance Field Ambient Occlusion](https://docs.unrealengine.com/latest/INT/Engine/Rendering/LightingAndShadows/DistanceFieldAmbientOcclusion/index.html) details on setup, performance and limitations.
