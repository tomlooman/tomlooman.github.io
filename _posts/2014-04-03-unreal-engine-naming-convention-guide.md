---
title: "Unreal Engine: Naming Convention Guide"
date: 2014-04-03
coverImage: "UnrealEngine_ParentLogoUwoTagTransparentBlack.png"
layout: single
sidebar:
    title: Sample Title
    nav: sidebar-main
---

The goal of this document is to share our internal naming conventions with the community to give everyone something to start out with. Using and getting comfortable with a strict naming convention is essential before your projects grow beyond a few dozen files.

Last Revision: **April 12, 2022**

First, consider how you are accessing your content. The content browser has powerful filter features making pre-fixes and suffixes less interesting compared to older Unreal Engine editions. However, this still doesn't apply to the simpler drop-down selection UI for picking class variables, etc. The same can happen when logging asset names in which 'assetName something error' occurred, bad naming can make it difficult to track down the origin.

The most complete style guide is [available on GitHub by Allar](https://github.com/Allar/ue4-style-guide). It's a style we mostly adopted for our projects.

## Coding Standards

Epic has a [Coding Standards](https://docs.unrealengine.com/latest/INT/Programming/Development/CodingStandard/index.html) page that's worth a read.

Splash Damage has its own extension of the Epic Coding Standard on [GitHub](https://github.com/splash-damage/coding-standards). It is well laid out in [SplashDamageCodingStandard.h](https://github.com/splash-damage/coding-standards/blob/master/SplashDamageCodingStandard.h) and [SplashDamageCodingStandard.cpp](https://github.com/splash-damage/coding-standards/blob/master/SplashDamageCodingStandard.cpp). They even included some conventions on Blueprints via a plugin and webpage.

## General Naming Rules

- All names in English.
- All asset dependencies should be in the same folder. (except for shared assets)
- Asset type determines prefix.
    - _Blueprint is **BP\_**assetname\_01_
- Certain types (eg. textures) use a suffix to specify sub-types. 
    - _T\_Grass\_01**\_N** for normal maps_
- Use underscores to split type from identifier and numeric values.
    - _SM**\_**DoorHandle**\_**01_
- Use numeric values with 2 digits.
    - _SM\_Pipe\_**01**_

## Content Browser

You can add the asset type to your search query. eg. searching "ship material" will search for assets named ship that may be of type material. This is powerful to nail down specific assets within a group of similar names. (_Make sure "Search Asset Class Names" is enabled in the View Options of your Content Browser_)

Tip: Use **Ctrl+P** in the editor/viewport to quickly search for assets without using the Content Browser. This is incredibly powerful when you have properly named your assets!

### Content Directories

All game content is placed in a sub-folder. eg. Content/**MyGame**/UI/... This helps in migrating between projects and splitting your content from marketplace packs that are added like Content/**MyMarketplacePack**/...

When testing out local assets that are not ready to be used by other members of your team (or perhaps never should be) you can put them in your **Developer-folder**. You can enable this folder in the view options of the Content Browser. These assets will not show up in searches by other developers

| **Sub-Folder** | **Description** |
| --- | --- |
| Content/**MyGame** | Top-level folder for all game-specific content. All rows are relative to this folder. |
| ../AI |  |
| ../Art | Holds all art content (except for UI/FX) |
| ../Audio |  |
| ../Core |  |
| ../Characters |  |
| ../Characters/Animations |  |
| ../FX |  |
| ../FX/Flares | Contains Particle systems, materials and textures specific to all types of Flares. |
| ../Maps | Contains all levels including dev-only. |
| ../Maps/Dev/... | Dev-only maps that are not cooked/packaged. |
| ../UI |  |
| ../UI/Materials | UI-specific materials. |
| ../UI/Fonts |  |
| ../Actions | Example of Action folder that's specific to my projects. (Actions are like Abilities) |
| ../Expeditions | Example of major feature that deserves its own top-level folder. Mainly holds Blueprints. |
|  |  |

## Marketplace Importing

It's recommended to use a dedicated Marketplace content project to import the packs first. This is your staging area before migrating pieces into your main project. This lets you review and filter out unwanted content early.

## Asset Naming

### Lyra Starter Game

[Lyra Starter Game](https://docs.unrealengine.com/5.0/en-US/lyra-sample-game-in-unreal-engine/) is a new project that shipped with the release of Unreal Engine 5.0. They use the Gameplay Ability System which introduces certain asset types and their own naming. Here are some of the prefixes they use in the project.

| Prefix | Asset Type |
| --- | --- |
| GA\_ | Gameplay Abilities |
| GE\_ | Gameplay Effects |
| GCN\_ | Gameplay Cue Notifies (UGameplayCueNotify) |
| GCNL\_ | Latent Gameplay Cue Notifies (Inherits from AGameplayCueNotify\_Actor and subclasses.) |
| Phase\_ | Game Phase Abilities |
| AbilitySet\_ | Ability Set |
| IA\_ | Input Action (Enhanced Input) |
| InputData\_ | (Lyra) Input Config |
| W\_ | Widget (Blueprint) UI |
| B\_ | All other blueprints such as pawn types, item spawners, etc. |

### Prefixes

Somes tables are temporarily broken and incomplete, please check out the link above for a more complete list of naming tables.

\[table sort="asc"\] Asset Type, Prefix, Example, Comment Blueprint, BP\_, BP\_WallLight\_01, Except for derived common classes: HUD / GameMode / Character Blueprint Interface, BPI\_, BPI\_InventoryItem\_01, Material, M\_, M\_Grass\_01, Material Instance, MI\_, MI\_Grass\_01, Material Function, MF\_, MF\_CheapContrast, Not numbered Material Parameter Collection, MPC\_, MPC\_EnvironmentSettings\_01, Static Mesh, SM\_, SM\_Wall\_01, Skeletal Mesh, SK\_, SK\_Character\_01, Texture, T\_, T\_Grass\_01\_D, Has suffix for texture types. See suffixes table. Particle System, P\_, P\_Fire\_01, Physics Material, \_PhysMat, Dirt\_PhysMat, Not numbered Sound, S\_, S\_HitImpact\_Mono\_01, Include \_Mono or \_Stereo designations Sound Cue, S\_\*\_Cue, S\_HitImpact\_01\_Cue, Attenuation, \_att, Explosion\_att, Enumeration, E, EWeaponType, Not numbered. Similar to convention in code (enum EWeaponType) Render Target, RT\_, RT\_CameraCapturePoint\_01, Vector/Float/Color Curve, Curve\_, Curve\_Recoil\_AK47, Camera Shake, CamShake\_, CamShake\_Landed, User Widget, Widget\_, Widget\_EnergyBar, Font, Font\_, Font\_Roboto48, Font size is included in name. \[/table\]

### Suffixes

#### Textures

Texture types all use the T\_ prefix.

\[table sort="asc" width="300px"\] Texture type, Suffix Diffuse/Color Map, \_D Normal Map, \_N Emissive Map, \_E Mask Map, \_M Roughness Map, \_R Metallic Map, \_MT Specular, \_S Displacement, \_DP Ambient Occlusion, \_AO Height Map, \_H Flow Map, \_F Light Map (custom), \_L \[/table\]

### Animation

These types have no prefix. These names are pretty standard to how the engine automatically names them on import / creation.

| **Type** | **Suffix** |
| --- | --- |
| Animation Blueprint | \_AnimBP |
| Physics Asset | \_PhysicsAsset |
| Skeleton | \_Skeleton |
| BlendSpace | \_BlendSpace |
| AnimMontage | \_Montage |
