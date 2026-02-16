---
title: "Rendering Soft outlines in Unreal Engine"
date: 2017-09-23
categories:
  - "Rendering"
tags: 
  - "custom-depth"
  - "materials"
  - "outlines"
  - "post-process"
coverImage: "Thumb_SoftOutlines_small.jpg"
sidebar:
    nav: sidebar-optimization
---

Ever since I first wrote about creating mesh outlines in Unreal Engine I have wondered if it was possible to render them as soft outlines instead of harsh binary lines. A good example of soft outlines can be found in Valve's games like Left 4 Dead or CS:GO.

I have several tutorials on different approaches to rendering outlines. There is one for [multi-color using a post processing](/unreal-engine-outline-multi-color-post-process) and another using a translucent mesh material to [locally render the outline](/unreal-engine-mesh-outline-material/). The latter can improve performance as a much smaller area on screen runs the material shader. As a bit of a joke I even wrote one blog on [rendering outlines for shadows](/unreal-engine-shadows-outline/). In this article however I'll focus on the experiment to create blurred soft-edge outlines.

The basis for all these effects rely on [Custom Depth](/unreal-engine-custom-depth), which is a special depth render buffer where we selectively render meshes into. We use this scene depth data to then figure out mesh edges.

## Blurring the Outline

There wasn't an easy way to blur the pixels at the time nor a decent way to down-sample the render target containing the outlined objects in order to make this blur operation cheaper. Overall it came to be too costly to come with a decent solution and so I stuck with the binary outlines you may have been in several of my earlier posts. Recently I decided to revisit this issue by doing a quick experiment using a modified version of _SpiralBlur_, a material node that's available in Unreal Engine, that is using some custom (HLSL) shader code to blur the pixels using a spiral blur method.

![](/assets/images/unreal_outlines_blurred.jpg)

![](/assets/images/unreal_outlines_blurred_wide.jpg)

Looks pretty decent, right? The effect is more expensive than the binary outlines since we must perform several blur steps in the SpiralBlur-node to get to look decently smooth. Without going the custom engine route there is no way to downsample the post-process step where we sample and blur the information from the Custom Depth buffer. Later in this article I will talk about the performance of the effect itself.

## The Material Graph

Unfortunately, I couldn't find any official UE4 documentation on the Spiral Blur node, there is a [wiki page on how to use the material node](https://wiki.unrealengine.com/How_To_Use_The_Spiral_Blur_Material_Node). The built-in implementation takes the scene textures and over several iterations creates....a spiral blur. The default settings are at about 128 iterations, which is pretty heavy! I've used this node as a reference to create my own, which samples the [Custom Depth](/unreal-engine-custom-depth) buffer instead of the scene color.

The node graph for it is reasonably simple and most of the logic happens inside the custom node which I added as a code sample below.

![](/assets/images/softoutlines_matgraph.jpg)

![](/assets/images/softoutlines_MF-graph.jpg)

## Outline Custom Node (HLSL)

```cpp
float3 CurColor=0;
float2 NewUV = UV;
int i=0;
float StepSize = Distance / (int) DistanceSteps;
float CurDistance=0;
float2 CurOffset=0;
float SubOffset = 0;
float TwoPi = 6.283185;
float accumdist=0;

if (DistanceSteps < 1)
{
  return Texture2DSample(CustomDepthTexture,CustomDepthTextureSampler,UV);
}
else
{
  while (i < (int) DistanceSteps)
  { 
    CurDistance += StepSize; 
    for (int j = 0; j < (int) RadialSteps; j++) 
    {
      SubOffset +=1;
      CurOffset.x = cos(TwoPi*(SubOffset / RadialSteps));
      CurOffset.y = sin(TwoPi*(SubOffset / RadialSteps)); 
      NewUV.x = UV.x + CurOffset.x * CurDistance; 
      NewUV.y = UV.y + CurOffset.y * CurDistance; 
      float distpow = pow(CurDistance, KernelPower); 
      CurColor += ceil(Texture2DSample(CustomDepthTexture,CustomDepthTextureSampler,NewUV))*distpow; 
      accumdist += distpow; 
    }
    SubOffset +=RadialOffset;
    i++;
  }
  CurColor = CurColor;
  CurColor /=accumdist;
  return CurColor;
}
```

## Performance

Performance was recorded on a 850M mobile GPU at 1280x720 with ~1.5ms measured and on my GTX 980 Ti it runs at 1920x1080 with 0.8ms for the post process material. It's heavily depending on the amount of iterations in the spiral blur. You will want to keep the DistanceSteps and RadialSteps as low as possible while maintaining a smooth edge. In the demo I settled on 4 DistanceSteps and 8 RadialSteps which is 32 iterations.

[![](/assets/images/7sUn0Cx.jpg "source: imgur.com")](https://imgur.com/7sUn0Cx)

## Conclusion

To conclude, the answer is yes! It's entirely possible to make soft outlines in Unreal Engine. I imagine there may be more efficient ways of blurring the custom depth buffer to get similar results, I simply leveraged the available shader code to quickly get to a proof of concept. It's important to note that being far away from the object with an outline can make it look slightly less smooth, a thinner outline helps and is a matter of tweaking.

## References

- [Custom Depth in Unreal Engine](/unreal-engine-custom-depth)
- [Multi-color outline material](/unreal-engine-outline-multi-color-post-process)
