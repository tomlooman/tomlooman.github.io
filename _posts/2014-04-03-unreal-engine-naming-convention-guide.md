---
title: "Unreal Engine Naming Convention Guide"
date: 2014-04-03
last_modified_at: 30-08-2025
coverImage: "UnrealEngine_ParentLogoUwoTagTransparentBlack.png"
layout: single
---

The goal of this document is to share my internal naming conventions with the community as used by the [Action Roguelike GitHub](https://github.com/tomlooman/ActionRoguelike) project and the [Unreal Engine C++ Course](https://courses.tomlooman.com/p/unrealengine-cpp) to give everyone something to start out with. Using and getting comfortable with a naming convention is essential before your projects grow beyond thousands of files.

First, consider how you are accessing your assets. The Content Browser in Unreal Engine has powerful filter features making pre-fixes and suffixes less critical compared to older Unreal Engine editions. However, this same level of filtering doesn't apply to the simpler drop-down selection UI for picking class variables, etc. The same can happen when logging asset names in which 'assetName something error' occurred, bad naming can make it difficult to track down the origin.

Note: The most complete style guide is [available on GitHub by Allar](https://github.com/Allar/ue4-style-guide). Allar's guide has a ton of depth and additional information you can apply if you see fit.

## C++ Coding Standards

Epic has an official [C++ Coding Standards](https://dev.epicgames.com/documentation/en-us/unreal-engine/epic-cplusplus-coding-standard-for-unreal-engine) page that's worth a read.

Splash Damage has its own extension of the Epic C++ Coding Standard on [GitHub](https://github.com/splash-damage/coding-standards). It is well laid out in [SplashDamageCodingStandard.h](https://github.com/splash-damage/coding-standards/blob/master/SplashDamageCodingStandard.h) and [SplashDamageCodingStandard.cpp](https://github.com/splash-damage/coding-standards/blob/master/SplashDamageCodingStandard.cpp).

## General Naming Rules

- All names in English.
- Basic asset dependencies should be in the same folder. (except for shared assets)
    - This primarily applies to simple structures such as Meshes, Materials and Textures
    - Folder names such as Meshes, Textures are redundant and require more navigation.
- Asset type determines prefix.
    - Blueprint is BP_assetname
- Certain types (eg. textures) use a suffix to specify sub-types.
    - T_Grass_N for normal maps
- Use underscores to split type from identifier and numeric values.
    - SM_DoorHandle
- Use numeric values with 2 digits for generic variants.
    - SM_Pipe_01

Assets generally follow the following file structure as described on [Epic's own naming convention doc](https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects):

[TypePrefix]\_[BaseName]\_[Descriptor]\_[OptionalVariant]

### Naming Examples
- SM_Pipe_Short
- SM_Pipe_Long
- T_Pipe_Long_D
- T_Pipe_Long_N

## Content Browser Tips

You can include the asset type to your search query. eg. searching "player material" will search for assets named "ship" that may be of type material. This is powerful to nail down specific assets within a group of similar names. (Make sure "Search Asset Class Names" is enabled in the View Options of your Content Browser).

Use **Ctrl+P** in the editor/viewport to open the Asset Panel to quickly search for assets without using the Content Browser. This is incredibly powerful when you have properly named your assets! So long as I roughly remember the asset name or partial name, I use this more often than the content browser.

### Content Directories

All game content is placed in a sub-folder. eg. Content/**MyGame**/UI/... This helps in migrating between projects and splitting your content from marketplace packs that are added like Content/**MyMarketplacePack**/...

When testing out local assets that are not ready to be used by other members of your team (and never should be) you can put them in your **Developer-folder**. You can enable this folder in the view options of the Content Browser. These assets will not show up in searches by other developers.

| **Sub-Folder** | **Description** |
| --- | --- |
| Content/**MyGame** | Top-level folder for all game-specific content. All rows are relative to this folder. |
| ../AI |  |
| ../Art | All art content such as meshes, textures, materials (except for UI/FX) |
| ../Audio |  |
| ../Core |  |
| ../Input | Enhanced Input |
| ../Characters |  |
| ../Characters/Animations |  |
| ../Effects |  |
| ../Effects/Flares | Example: Systems, materials and textures specific to all types of Flares. |
| ../Maps | Contains all levels including dev-only. |
| ../Maps/Dev/... | Shared Dev-only maps that are not cooked/packaged. |
| ../UI |  |
| ../UI/Materials | UI-specific materials. |
| ../UI/Fonts |  |
| ../Actions | Example of Actions, similar to GAS Abilities. |
| ../Expeditions | Example of major feature that deserves its own top-level folder. Mainly holds Blueprints. |
|  |  |

## Asset Naming

### Common Types

For this list I stick mainly to the commonly used types and those that are used in the C++ Course material and my open-source projects on GitHub. They don't suffer much from [Epic's own Naming Convention Document](https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects). 

| Asset Type | Prefix | Comment |
| --- | --- | ---|
 Blueprint | BP_  | 
 Blueprint Interface |  BPI_ |  
 Enumeration |  E |  Same as in C++ (enum EWeaponType) 
 |
 Material |  M_ |  
 Material Instance |  MI_|  
 Material Function |  MF_ | 
 Material Parameter Collection |  MPC_ |  
 Texture |  T_ |  Has suffix/variants for texture types. See suffixes table below. 
|
 Static Mesh |  SM_ |  
 Skeletal Mesh |  SK_ |  
 Niagara System |  NS_ |  
 Vector/Float/Color Curve |  Curve_|  
 Camera Shake |  CamShake_ |  
 UMG Widget |  Widget_| 

### Physics

| Asset Type | Prefix | Comment |
| --- | --- | --- |
 Physics Material |  _PhysMat |
 Physics Asset | PHYS_ |

### Animation

| Asset Type | Prefix | Comment |
| --- | --- | --- |
 Animation Blueprint | _AnimBP |
 AnimMontage | _Montage |
 Skeleton | _SKEL |
 BlendSpace | BS_ |

 ### Audio

| Asset Type | Prefix | Comment |
| --- | --- | --- |
 Sound Wave |  S_ | Include sub-category like S_UI_ or S_Combat_
 MetaSound Source | MSS_ | |
 Attenuation |  Att_ |  |  

### Suffixes & Variants

#### Textures

Texture types all use the T_ prefix.

Texture type, Suffix Diffuse/Color Map, _D Normal Map, _N Emissive Map, _E Mask Map, _M Roughness Map, _R Metallic Map, _MT Specular, _S Displacement, _DP Ambient Occlusion, _AO Height Map, _H Flow Map, _F Light Map (custom), _L

### Animation

These types have no prefix. These names are pretty standard to how the engine automatically names them on import / creation.

| **Type** | **Suffix** |
| --- | --- |


### Example: Lyra Starter Game

[Lyra Starter Game](https://docs.unrealengine.com/5.0/en-US/lyra-sample-game-in-unreal-engine/) is an official sample project that shipped with the release of Unreal Engine 5.0. They use the Gameplay Ability System which introduces certain asset types and their own naming. Here are some of the prefixes they use in the project.

| Prefix | Asset Type |
| --- | --- |
| GA_ | Gameplay Abilities |
| GE_ | Gameplay Effects |
| GCN_ | Gameplay Cue Notifies (UGameplayCueNotify) |
| AbilitySet_ | Ability Set |
| IA_ | Input Action (Enhanced Input) |
| InputData_ | (Lyra) Input Config |
| W_ | Widget (Blueprint) UI |
| B_ | All other blueprints such as pawn types, item spawners, etc. |

## References
- [Recommended Asset Naming Conventions | Unreal Docs](https://dev.epicgames.com/documentation/en-us/unreal-engine/recommended-asset-naming-conventions-in-unreal-engine-projects)