---
title: "New 'Action Roguelike' C++ Project on GitHub"
date: 2021-01-12
last_modified_at: 09-09-2025
categories: 
  - "C++ Programming"
  - "Sample Projects"
tags: 
  - "C++"
  - "Sample Project"
  - "GameplayTags"
  - "Action Roguelike"
coverImage: "actionroguelike_ue4_combatsample-copy.jpg"
sidebar:
    nav: sidebar-cpp
---

For the [Stanford University Fall Curriculum](https://courses.tomlooman.com/p/unrealengine-cpp?coupon_code=COMMUNITY15), I built a small game project using C++ mixed with some Blueprint in Unreal Engine. It has since been converted into an online course that anyone can participate in. It has been used by dozens of industry leading game studios to train their employees for C++ with Unreal Engine on top of thousands of indie developers.

![](/assets/images/Course_HeroBanner_TwoSplit_Narrow_1200.jpg)

**Check out the full project [right here](https://github.com/tomlooman/ActionRoguelike)** **on GitHub!**

## Description

The game was built with a wide set of features to cover a variety of useful coding concepts to students including AI, multiplayer programming, save games, async asset loading, etc. Check out the list of features below, I'm sure there is more that I forgot to include or that will drip in at a later time. Over the years I have continued to expand the project and keep it up to date with new Unreal Engine 5 releases and features.

Those interested in a GAS ([Gameplay Ability System](https://dev.epicgames.com/documentation/en-us/unreal-engine/gameplay-ability-system-for-unreal-engine)) style design might be keen to check out how we handled Abilities ([Action.h](https://github.com/tomlooman/ActionRoguelike/blob/master/Source/ActionRoguelike/ActionSystem/RogueAction.h)) and Buffs/Debuffs ([ActionEffect.h](https://github.com/tomlooman/ActionRoguelike/blob/master/Source/ActionRoguelike/ActionSystem/RogueActionEffect.h)) as this shares many similarities with GAS design, although its much simpler.

At the time of writing, there isn't a whole lot that makes this a real 'rogue-like' with things like permadeath gameflow or proper randomized gameplay through levels and powerups. However it has laid the groundwork in support of all those features and work will continue on this project as it has for the past few years. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/8jDCtT88bdk?si=xYnswyOyk4r28874" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<br>

<iframe width="560" height="315" src="https://www.youtube.com/embed/uSOEPkX3OtI?si=LleA_jih1OosPaeW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Features

Below I've listed some of the more relevant features included in the project. I think these code samples can be invaluable in getting an idea on how to use them in the Unreal Engine eco-system. Especially things like Asset Manager have limited public examples, which is one of the benefits of this open-source project.

- Third-person Action Character Movement

- **Action System** (Gameplay Ability System-lite)
    - Dash Ability (Teleporting via projectile)
    - Blackhole Ability
    - Magic Projectile Attack
    - "Thorns" buff (reflecting damage)
    - Burning Damage-over-time effect
- AttributeComponent (Health, Rage etc.)
- **SaveGame System** for persisting progress of character and world state.
- Heavy use of Events to drive UI and gameplay reactions.
- Mix of C++ & Blueprint and how to combine these effectively.
- **GameplayTags** to mark-up Actors, Buffs, Actions.
- **Multiplayer support** for all features
- GameMode Logic
    - EQS for binding bot/powerup spawn locations.
    - Bot spawning system (bots cost points to spawn, gamemode gains points over time to spend)
    - DataTable holds bot information
    - DataAssets to hold enemy configurations
- **Asset Manager:** Async loading of data assets
- Async loading of UI icons
- AI (Ranged Shooter style)
    - Minion AI with Behavior Trees (Roam, See, Chase, Attack, Flee/Heal)
    - C++ Custom Behavior Trees Nodes
    - EQS for attack/cover locations by AI Powerups
- Powerup pickups to heal, gain credits/actions (UMG)
- Main menu to host/join game (UMG)
- UI elements for player attributes and projected widgets for powerups and enemy health.
- C++ Localized Text Example

![](/assets/images/ue4_actionroguelike_aisample.jpg)
*Spotted by Minion's sight sense.*

![](/assets/images/assignment4_behaviortree.jpg)
*Behavior Tree for Ranged Minion AI*

## What's Next?

Over time more features and improvements are actively being added to the project along with updates to the most recent Unreal Engine version. The [Readme on GitHub](https://github.com/tomlooman/ActionRoguelike) will have the most recent additions if you're interested.
