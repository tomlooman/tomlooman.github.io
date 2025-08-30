---
title: "Rendering Wounds on Characters"
date: 2017-08-14
categories: 
  - "materials"
  - "rendering"
tags: 
  - "experimental"
coverImage: "ue4_hitmask_damageexample.jpg"
---

Earlier this week I tweeted about hit-masking characters to show dynamic blood and wounds. Today I'd like to talk a little about the effect and how it came to be. I'll talk a little bit about the technical details and some alternatives. The effect is a proof of concept to try and find a cheaper alternative to texture splatting using render targets. So let's get going!

![](/assets/images/ue4_hitmask_damageexample.jpg)

[![](/assets/images/etOcKPR.gif "source: imgur.com")](http://imgur.com/etOcKPR)

We have a few decals types in our game like bullet impacts and blood splats we splat on walls behind damaged characters. These decals are attached to the component it hit, but if you were to attempt to do this on an animated mesh you'd notice the decal sliding over the surface which doesn't look too great. I noticed this kind of sliding in PlayerUnknown's Battlegrounds the other day, where they use traditional decals on characters, but a more stable solution is desirable especially for third person games where you constantly see your own characters body. It does the trick with small decals where the problem isn't as noticeable. Here is an exaggerated example of decal sliding:

[![](/assets/images/TWV2kvH.gif "source: imgur.com")](http://imgur.com/TWV2kvH)

I wanted to try and find a solution for this problem on our characters and I was inspired by Ryan Bruck's GDC demos using Render Material to RenderTarget technique to splat spheres onto a character via a render target which can be used to mask wounds into the shader. Here is Ryan's render target based damage implementation:

<iframe width="560" height="315" src="https://www.youtube.com/embed/Jz050a2OMXE?si=fuyi8Z4OhsIy1C__" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The effect is a lot more expensive than we were looking to budget however. It requires two render targets (for each character in the scene!), a mesh with unique UVs (UE4's mannequin is not uniquely UV'ed for example, and requires modification outside of the engine to work) and have spiky performance costs at runtime due to rendering of TWO calls to render targets each time we hit the character which is an expensive operation (several milliseconds worth of spikiness). If you're wondering why it requires two calls, let me explain.

The first call is straight forward, you want to render a splat into your character damage render target. To do so the material we render into this RT using a SphereMask to find the pixel we "hit", but this material has no idea of the pixel positions of the character compared to the "hit" location, so Ryan encodes the world position in each pixel for the animated character into a second render target which can be sampled while doing the sphere mask operation. The problem here being that world positions of the pixels change each frame, especially on a animated mesh, this means that on each new hit, we need to first re-render this secondary render target to update the world positions before we can splat into the final render target. This wasn't cost efficient enough for a purely visual gimmick in our case and needed to find a cheaper solution.

### Optimizing the render target approach

There is a way to optimize the technique, by using the fairly recently added [pre-skinned local position node](https://docs.unrealengine.com/latest/INT/Engine/Rendering/Materials/ExpressionReference/Vector/#pre-skinnedlocalposition). This replaces the world position we bake into the render target with the pre-skinned local position. By doing this, we only require a capture once which we can do offline (since this position never changes at runtime). To capture the reference pose locations I made a quick blueprint and modified version of Ryan's unwrap material, captured the scene and turned the RT into a static texture (You can see an animated version of what this looks like below). This eliminates the need for the second render target at run-time entirely. Each hit, we transform the hit location (world-space) into the pre-skinned local-space of the mesh before we can apply it to the character. In the next section I'll explain more how the transforming from world space to pre-skinned space works.

![](/assets/images/ue4_uvunwrap_capture.gif)

This optimization eliminates some of the cost, but still I wasn't happy about having a unique render target created for character (which can really add up if you're making a horde shooter for example) and using the costly DrawMaterialToRenderTarget operation on every hit. I measured performance hits of 1.6-4.5ms on my GTX 850M (Notebook), which is huge, especially when it's not in your control how many might happen in single frame. Remember that this effect is purely a cosmetic gimmick and shouldn't be a major cost in our rendering budget.

### Finding an alternative

So I ditched render targets entirely to try out using just SphereMasks to do the effect. This puts a limit on the number of hits, since with each sphere mask you add, you add to the constant cost of the shader. There are some optimizations to be made here, like using branching to cut out the sphere mask cost if the shader has receive no hits yet or swapping out the shader until one hit is received. For now this is not necessary as the shader is still well within our "budget". I figured anything between 3-5 hits should be fine as any additional hits would surely already have killed the enemy in the first place (unless you're talking about some kind of boss character) regardless, this was just a stepping stone to have a starting point.

Like the original RT effect, to have the sphere masks work consistently with an animated mesh we need to use the reference pose to place the sphere mask at. When hitting the character, we transform the world position of the hit into the reference pose position (using the BoneName info we get from point damage events) you can do so by first inverse transforming the hit location from the current transform of the bone we hit, and then transforming that location using the reference pose transform of that same bone.

![](/assets/images/ue4_hitmask_debuglines.jpg)

Here you can see a visualization of the transform applied to the hit location (green) with the current pose transforms and the bone that was hit. And the blue lines the matching reference pose transformation. The purple line is to help indicate the difference.

![](/assets/images/ue4_hitmask_debuglines02.jpg)

In the reference pose example (bottom of the two images), the hit location is already in the correct space, so you can see that the blue and green lines are overlapping and z-fighting even because they are at exactly the same offsets and there is no purple line because there is no difference in transforms to visualize.

In the top image you can see how I transform from the original hit location into our reference pose location. Now we have a constant position that won't animate, we push this location into the shader which also used pre-skinned position to sphere mask against. To support multiple hits, we increment the param name each time when a new hit is applied, eg. HitLocation\_1, HitLocation\_2 (these must exist in the material before hand)

### Animating the blood

The great thing about using sphere masks this way as opposed to a render target is that we can keep modifying the data as time passes without requiring continuous drawing into the RT which could add even more significant cost. For example, it's super easy to scale the sphere mask as time passes to make it appear as if blood is spreading through the clothing of the character.

<iframe width="560" height="315" src="https://www.youtube.com/embed/mgsUEFAnxzc?si=mcTA5xJAWMq1wxh1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Other cool things to add are scaling the mask based on damage received, drying out the blood over time or fading out the wound when enough time has passed to signify the wound has "healed".

### Conclusion

There is a lot of room for visual improvement, but the basic technique is solid. In the examples above I added a HeightLerp to get a more interesting looking fall-off compared to the simple spherical shape we get from the SphereMask itself.

This technique has a much more consistent cost compared to the original, with some restrictions on amount of hits to register. We don't need a render target per enemy and don't have spiky cost as we only set a few material parameters to drive this effect. Using render targets is still a viable approach, and if the run-time cost isn't an issue then it's a great way to dynamically change your character state during gameplay in extreme ways. I feel like there is a lot more to talk about, like exit wounds, mesh deforming etc! But perhaps we'll get to that another time...

I hope you found this post insightful! Leave a comment below with any questions or [follow me on Twitter](https://twitter.com/t_looman)!

#### References

- [ShaderBits' GDC Demos](https://github.com/sp0lsh/UEShaderBits-GDC-Pack) (GitHub unofficial download)
- [Left 4 Dead Wound PDF](http://www.valvesoftware.com/publications/2010/gdc2010_vlachos_l4d2wounds.pdf)
