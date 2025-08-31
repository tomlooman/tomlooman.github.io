---
title: "Textured Shadows Trick in Unreal Engine"
date: 2017-03-12
categories: 
  - "materials"
  - "rendering"
tags: 
  - "experimental"
coverImage: "disney_shadowman_ue4_small.jpg"
redirect_from:
  - /unreal-engine-shadows-outline/
---

This weekend I stumbled upon a [reddit post](https://www.reddit.com/r/movies/comments/5yvf23/in_disneys_the_princess_and_the_frog_the_shadow/) about Dr. Facilier's interesting shadow in The Princess and the Frog and it inspired me to experiment with Forward shading in Unreal Engine 4 to re-create a similar effect in real-time shading. OP pointed out that The Shadow Man's shadow changes the wallpaper his shadow is cast on. A subtle but quite interesting effect!

![](/assets/images/disney_theshadowman.jpg)

With Forward rendering enabled we have a different shading pipeline to play with instead of UE4's default deferred pipeline, the one I was interested in is the LightAttenuation buffer. The exact available data with Epic's new Forward rendering is still mostly unknown to me, a good reason to try this new shading pipeline as a Sunday tech-doodle!

This trick was made possible due to a graphics binding bug where the LightAttenuationTexture was available in a pass it should not have been. This has since been fixed making this original implementation no longer possible. I have not looked into an alternative method for this trick.

**The result, note the skull texture only rendered within the shadow bounds:**

![](/assets/images/ue4_shadowman_disney.gif)

The implementation is really quite basic, I used the LightAttenuationTexture available only in Forward-rendering of the engine to find which part of affected by light. To access this buffer you need to use the Custom-node in the material editor, and apply the following code:

```CPP
return Square(Texture2DSampleLevel(LightAttenuationTexture, LightAttenuationTextureSampler, UV, 0));
```

"UV" is an input parameter (so make sure it's added to the param list of the custom node) in which we feed the ScreenAlignedUVs node output.

For those interested, I found this snippet in the engine's shader folder at .../4.14/Engine/Shaders/Common.usf and contains the function  GetPerPixelLightAttenuation(float2 UV);

Below is the crude sample of the material used in the GIF:

![](/assets/images/ue4_shadowman_materialgraph.png)

There is not a whole lot going on, simply blending between the wallpaper and the skull pattern based on the light attenuation value of that pixel is screenspace. The texture samplers use my WorldUVs material function which I've posted about some time ago.

**The effect visualized with two-tone instead of textures:**

![](/assets/images/ue4_lightattenuation_visalized.jpg)

This LightAttenuationTexture may not be the perfect source for detailed lighting information, but did the trick for this simple effect recreation. Baked light for example needs to sample the lightmap data (as light attenuation is available from dynamic lights only) But this proved good enough for my specific case of the shadowed wallpaper.

## Outlined Shadows

I’ve done multiple blog posts about rendering [outlines in Unreal Engine](https://www.tomlooman.com/multi-color-outline-post-process-in-unreal-engine-4/) in the past. So when I had this idea of **outlining shadows** instead of objects, I figured it would be fun to build it as a quick experiment.

To figure out where to draw the outline I use an approach very similar to my prior outline implementation, instead I sample the LightAttenuation buffer instead of the CustomDepth buffer and compare it to the light attenuation value or nearby pixel. This effect does NOT work in Deferred rendering!

![](/assets/images/ue4_shadowedoutlines_01.gif)
