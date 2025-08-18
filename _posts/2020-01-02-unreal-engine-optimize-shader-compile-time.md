---
title: "Optimize Shader Compilation & Package Sizes"
date: 2020-01-02
categories: 
  - "rendering"
  - "unreal-nugget"
tags: 
  - "materials"
  - "performance"
  - "rendering"
  - "tips-tricks"
  - "tutorial"
  - "ue4"
  - "ue5"
coverImage: "ue4_compileshaders-1.jpg"
---

![](/assets/images/ue4_compileshaders-1.jpg)

Unreal Engine **Project Settings** allow a major reduction (up to 50%) of shader permutations affecting shader compile times, package size, and load times. You can find the options under the **Engine >** **Rendering > Shader Permutation Reduction** Category. Which settings you can disable will depend on your project’s rendering requirements.

![](/assets/images/ue5_shaderpermutations-900x440.jpg)

- **Stationary Skylight** Stationary skylight requires permutations of the basepass shaders. You can disable this when never using a Stationary Skylight as the name implies.
- **Low-Quality Lightmap shader permutations** The mobile renderer requires low-quality lightmaps, disabling this setting is not recommended for mobile titles using static lighting."
- **PointLight WholeSceneShadows** requires many vertex and geometry shader permutations for cubemap rendering.
- **Atmospheric Fog** requires permutations of the basepass shaders. You can disable this if you don't use the AtmosphericFog Actor which simulates atmospheric light scattering.
- **Sky Atmosphere** requires extra samplers/textures to be bound to apply aerial perspective on transparent surfaces (and all surfaces on mobile via per-vertex evaluation).
- **Sky Atmosphere Affecting Height Fog** The sky atmosphere component can light up the height fog but it requires extra samplers/textures to be bound to apply aerial perspective on transparent surfaces (and all surfaces on mobile via per-vertex evaluation). It requires _SupportSkyAtmosphere_ to be true."

When your project is missing required shader permutations by the level it will tell you about it in the Viewport right next to the "Lighting needs to be rebuilt" message. This can be helpful to quickly realize that a level has changed such as a SkyAtmosphere actor being added later on and now requiring those permutations to be re-enabled.

These options are enabled by default, especially stylized games that don't rely on PBR/realistic lighting may benefit. But many if not most projects may find that they can delete certain settings such as _LowQualityLightmaps_ which are targeting the Mobile renderer (HoloLens and certain other VR games might use the Mobile renderer as well).

Changing any of these settings requires all shaders to be recompiled. This may take a long time depending on your project size. For teams using a shared [Derived Data Cache](https://docs.unrealengine.com/4.27/en-US/ProductionPipelines/DerivedDataCache/) I'd recommend looking into the _\-fill_ command line option to have the shaders back in the DDC more easily (without having to load each level.

Another nice effect when turning off these shader permutations is optimized package size and load times. Reducing these permutations will reduce the total size of your materials once cooked.
