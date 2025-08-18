---
title: "New 'Action Roguelike' C++ Project on GitHub"
date: 2021-01-12
categories: 
  - "cpp"
tags: 
  - "cpp"
  - "materials"
  - "project-template"
  - "tutorial"
  - "ue4"
  - "ue5"
coverImage: "actionroguelike_ue4_combatsample-copy.jpg"
---

For the [Stanford University Fall 2020 Curriculum](https://www.tomlooman.com/stanford-cs193u/), I built a small game project using mainly C++ mixed with some Blueprint in Unreal Engine. For those interested, the entire Computer Science course (CS193U) was provided through Zoom lectures and has been recorded. I'm working on getting this published and meanwhile, this project is already [open-source through GitHub](https://github.com/tomlooman/ActionRoguelike) to be taken apart by anyone!

![](images/Course_HeroBanner_TwoSplit_Narrow_1200.jpg)

**Check out the full project [right here](https://github.com/tomlooman/ActionRoguelike)** **on GitHub!**

## Description

The game was built with a wide set of features to cover a variety of useful coding concepts to students including AI, multiplayer programming, save games, async asset loading, etc. Check out the non-exhaustive list of features below, I'm sure there is more that I forgot to include or that will drip in at a later time.

Those interested in a GAS ([Gameplay Ability System](https://docs.unrealengine.com/en-US/InteractiveExperiences/GameplayAbilitySystem/index.html)) style design might be keen to check out how we handled Abilities ([Action.h](https://github.com/tomlooman/ActionRoguelike/blob/master/Source/ActionRoguelike/Public/SAction.h)) and Buffs/Debuffs ([ActionEffect.h](https://github.com/tomlooman/ActionRoguelike/blob/master/Source/ActionRoguelike/Public/SActionEffect.h)) as this shares many similarities with GAS design, albeit its much simpler.

At the time of writing, there isn't a whole lot that makes this a real 'roguelike' with things like permadeath or proper RNG. But, I hope to extend this project later on with more relevant features to have a proper game loop to earn the name 'Action Roguelike'.

https://youtu.be/8jDCtT88bdk

https://www.youtube.com/watch?v=uSOEPkX3OtI

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

**Check out the project file [right here](https://github.com/tomlooman/ActionRoguelike)** **on GitHub!**

<figure>

![](images/ue4_actionroguelike_aisample.jpg)

<figcaption>

Spotted by Minion's sight sense.

</figcaption>

</figure>

<figure>

[![](images/assignment4_behaviortree-900x532.jpg)]()

<figcaption>

Behavior Tree for Ranged Minion AI

</figcaption>

</figure>

## What's Next?

Over time more features and improvements are actively being added to the project along with updates to the most recent Unreal Engine version. The [Readme on GitHub](https://github.com/tomlooman/ActionRoguelike) will have the most recent additions if you're interested.
