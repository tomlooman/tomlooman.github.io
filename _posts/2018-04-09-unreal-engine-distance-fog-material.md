---
title: "Distance Fog Post-Process Material"
date: 2018-04-09
categories: 
  - "Rendering"
tags: 
  - "materials"
  - "post-process"
  - "Rendering"
  - "unreal-engine"
coverImage: "Thumb_DepthFog.jpg"
sidebar:
    nav: sidebar-optimization
---

In this post I will discuss depth (or distance) fog and the things I did to improve on the original basic effect while keeping this simple and light-weight. It's not a step-by-step tutorial, but explains the core concepts behind the effect including a download link at the end.

Back in the forward rendering days you would get distance fog basically for free in your standard materials (specifically referring to XNA) and now in the age of deferred renderers we have all sorts of different - more advanced - fog types built-in to Unreal (eg. Atmospheric, Exponential Height fog) While those are great for certain types of scenery, I still find myself needing the classic fog style to not only add atmosphere but hide distance gameplay objects or simply focus the players vision more on the near range rather than the horizon. This is there the built-in fog types fail, luckily it's really easy to build your own.

![](/assets/images/Thumb_DepthFog.jpg)

This type of dense fog can be helpful in optimizing view distances too, where beyond a certain range you cull out objects and no one will notice (I'd suggest to keep the big pieces like towers, terrain etc. that define the fog's rough horizon) The core implementation of this effect is actually really simple. You check the Scene Depth in your post process and based on that value you interpolate between your original Scene Color and a Fog Color. You now already have your fog material basics completed. The next thing you could do is to add more control over the fall-off by adding Power-node into the graph or adding an offset to the Scene Depth to start the fog beyond the first unit of distance from the camera's view.

### Depth Sampling

There is one problem with this simple implementation however, and that will be apparent when rotating the camera in a scene as near the edges of the camera the fog value is different than the screen center! I've seen this happen in older games and was especially apparent in classic World of Warcraft where they had a similar issue with their far plane culling. If you wanted to see what was in the distance, you would simply rotate your camera a bit so you could see the more distant objects near the left or right edge of your screen, which is kind of an useful exploit sometimes, but not desirable in our own games! I've added some images with exaggerated fog falloff to clearly demonstrate this edge issue.

![](/assets/images/depthfog_original01.jpg)
*incorrect depth, straight line that rotates with camera angle.*

![](/assets/images/depthfog_original02.jpg)
*(rotated camera, no translation) bus and building in the bottom right no longer inside fog (incorrect)*

![](/assets/images/depthfog_corrected01.jpg)
*'correct' depth sampling, circular shape - not affected by camera angle.*

![](/assets/images/depthfog_correct02.jpg)
*'correct' depth sampling, rotated camera, the objects are still equally affected by the fog.*

For our little fog effect we need something more than a straight forward Scene Depth comparison as the same problem occurs. Instead we use the following:

![](/assets/images/ue4_depthfog_materialnodes01.jpg)
*By using the above we get a consistent density in the fog regardless of the view rotation.*

### Dynamic Fog Clouds

Now finally I wanted to make the effect slightly more dynamic, by adding clouds. These are not actual volumetric clouds, as that is more expensive and complex to calculate, instead it's a 3D Perlin noise texture that pans through world-space and is blended into the fog material. The effect doesn't hold up too well at close range, so it's only added on the distant pixels of the scene where it looks more believable as 'volumetric' clouds.

![](/assets/images/ue4_depthfog_clouds.gif)

The clouds are a 'cheap trick' and might not work for every style of game. But I think it adds a nice dynamic layer on top of the static distance fog by slightly altering the perceived density at a distance. I'd like to do more experimentation with these clouds as in the current implementation they are barely noticeable and require more work.

I've added a download link to the effect, you'll have to tweak the material to get something that fits your own game the best.

[Get Free Access](https://courses.tomlooman.com/p/unreal-materials-bundle) to this fog material and the full Materials Bundle.

## Closing

As always you can **[follow me on Twitter](https://twitter.com/t_looman)** where I post about game dev, or subscribe to **get updated by new blog posts, tutorials and downloads**!
