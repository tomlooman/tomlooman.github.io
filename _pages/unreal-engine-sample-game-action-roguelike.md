---
title: "Project Orion: C++ Co-op Action Roguelike in Unreal Engine 5"
date: 2026-02-27
last_modified_at: 2026-09-08
layout: single
permalink: /unreal-engine-sample-game-action-roguelike
coverImage: "Thumb_Blog_Hero_2026_900.jpg"
excerpt: "The co-op Action Roguelike sample game is built in Unreal Engine 5 with C++ and is my most complete and advanced sample game available."
tagline: "Explore a comprehensive C++ sample game packed with gameplay systems, multiplayer support, and practical programming concepts."
header:
  og_image: "/assets/images/Thumb_Blog_Hero_2026_900.jpg"
  overlay_image: "assets/images/courses/CourseCPP_HeroBanner_2.jpg"
  actions:
    - label: "Browse Source Code"
      url: "https://github.com/tomlooman/ActionRoguelike"
    - label: "View Course Details"
      url: "/courses/unrealengine-cpp/"
  overlay_filter: 0.3
redirect_from:
    - /unreal-engine-cpp-survival-sample-game/
    - /unreal-engine-cpp-survival-sample-game/section-three/
    - /teambased-ai-in-unreal-engine-4/
    - /tutorial-multiplayer-supported-usableactor-system-in-blueprint/
    - /unreal-engine-blueprint-inventory-system/
    - /unreal-engine-cpp-action-roguelike-sample-project
    - /unreal-engine-gameplay-ability-system-action-rpg/
    - /survival-sample-game-for-ue4/
---

"**Project Orion**" is the codename for the **Co-op Action Roguelike Sample Game** built in **C++** for **Unreal Engine 5**. It's origins can be found in the [Professional Game Development in C++ and Unreal Engine 5 Course](/courses/unrealengine-cpp) and has over the years received dozens of additional features, mechanics and code samples.

The core framework is built in C++ to show off how a game can be built for Unreal Engine 5. The game uses "Risk of Rain 2" as a common point of design reference.

{: .notice--info }
**Note:** This page is a work in progress documenting all the features and code samples available. If you are looking for the **Survival Sample Game**, that has been deprecated in favor of continued support for this project.

## Source Code

The game is open-source and you can browse or download the project on the [GitHub Repository](https://github.com/tomlooman/ActionRoguelike).

{: .notice--info }
**Enabling Experimental Optimizations:** <br>The project contains work in progress features/optimizations such as **Data-oriented Design** for Projectiles or **Deferred Tasks** for improved frame pacing and others. 
<br>You can enable these in `ActionRoguelike.h` and turn them on by setting the `#define NAME_OF_FEATURE 1`. You must then recompile the C++ to use the enabled code.

## Action System (Abilities, Buffs, Attributes)

The game features a custom Ability System (dubbed the "Action System") with support for RPG-style Attributes, Abilities and Buffs/Debuffs.

### Actions

Actions represent the Abilities/Skills of Actors such as the Players & enemy Monsters. Sprinting, projectile attacks, teleporting, etc. all is handled through Actions.

### ActionEffect

ActionEffects also often referred to as Buffs/Debuffs are temporary effects on gameplay actors. These may drive certain attributes, deal damage to the afflicted actor or apply any number of temporary modifiers.


### Attributes

Attributes represent all sorts of values for the gameplay actors such as health, stamina, movement speed and can be modified through Actions and ActionEffects. They contain a Base and Modifier values where Base is the permanent value such as changes to the maximum health when leveling up and Modifier is where you applied temporary changes such as those received from buffs/debuffs.

## Melee Combat

The enemy monsters can perform melee attacks as part of their AI Behaviors. The melee system builds on the Action System (similar to GAS) and uses Behavior Trees to initiate the logic to run up and perform the attack.

### Monster Melee Behavior Flow

The Enemy BehaviorTree checks if target (player) is within certain distance, and initiate melee attack sequence (run closer then attack when in attack range)

- `RogueAction_MinionMeleeAttack` (Action) handles the start/stop of the attack. Runs an AnimMontage with the attack animation.
- `RogueAnimationInstance` (AnimBlueprint) contains OnMeleeOverlap which the Melee Attack Action listens for.
- `RogueAnimNotifyState_Melee` (AnimNotify) broadcasts OnMeleeOverlap event when an melee overlap is found by running OverlapMultiByChannel collision query while the AnimNotify is active.
- `OnMeleeOverlap` is handled by the Melee Attack Action to apply Damage to the hit target.

Apply console variable `game.drawdebugmelee 1` to visualize the overlap shape during a melee attack.

**Note:** The AnimMontage holds a Melee Attack animation and requires the custom AnimNotify in order to handle the overlap checks.

## Save Game System

The game includes the core implementation of a save game system storing the world state and player information such as their current location, earned credits etc. You can [read a full breakdown of the Save Game system](/unreal-engine-cpp-save-system) on my blog.

## Performance & Optimization

### Data-oriented Programming

The game has several examples of performance oriented Data-oriented design. The projectiles are implemented both as Actors and using DoD principles with simple arrays of structs. The second example is a credit loot system which spawns a thousand little coins when killing an enemy.

#### Thousands of Projectiles

With DoD you can easily manage thousands of projectiles, which becomes a major challenge with a full fat Actor design. To explore this feature look at the `URogueProjectileSubsystem`.

As the time of writing the projectiles are experimental and can be enabled by defining `USE_DATA_ORIENTED_PROJECTILES 1` (defaults to `0`) and re-compiling the project. When enabled, both the player and enemies will use these struct-based projectiles instead of Actors.

#### Thousands of Lootables

When killing an enemy, a thousand little coins spawn around the corpse. These are entirely implemented using data-oriented principles instead of Actors. They render using a single `InstancedStaticMeshComponent` (Alternatively could be driven using Niagara). You can find more about this feature in `URoguePickupSubsystem`.

### Object Pooling

The project support **Object Pooling** which is a common optimization to avoid creating and destroying objects such as Actors and instead make them dormant and invisible until they are requested again. An example implementation can be found with the Monster Corpses (`ARogueMonsterCorpse`). A fixed amount of instances are spawned during the load screen and immediately parked for later use. Game code can request a pooled Actor instead of spawning new instances. This improves CPU performance as spawning is generally expensive, helps against memory fragmentation (and allocations) and reduces the CPU cost of destroying objects together with performing garbage collection.

The code can be found inside `URogueActorPoolingSubsystem` and is at this time built specifically for Actors. The functions `ReleaseToPool` and `AcquireFromPool` manage the state of the pooled Actor.

### Deferred Tasks (frame pacing)

To balance out the workload between frames the game uses `RogueDeferredTaskSystem` to schedule tasks to happen so long as CPU frame budget is available. This can mean that certain functions are run the next frame or even later. It can help reduce spikes and hitches. This can only be used for things that don't need frame perfect execution. You may use it for things like spawning an enemy and updating or triggering low priority changes in the world.

### Asynchronous Collision Queries

By default any collision queries (line traces, sweeps, etc.) as performed synchronously. You don't always require instant feedback and can request something this frame, and use the results the next frame once it has been completed on a Worker Thread rather than blocking the GameThread.

Examples can be found in `ARoguePlayerCharacter::FindCrosshairTarget()` where `AsyncSweepByChannel` is used to find a target under the crosshair. Keep in mind that for you game, this specific type of query may be undesirable to delay by one frame as it may increase any perceived input latency. In a future example, the Data-oriented projectiles can be pretty trivially moved to become asynchronous, you can find the current update logic inside `URogueProjectilesSubsystem::Tick`.

### Significance Manager

The Significance Manager is a framework to help **throttle and cull gameplay logic and related systems such as animations and VFX** to keep performance consistent regardless of how much is happening on or off screen. It can group Actors and other instances into "Buckets" with a maximum capacity, allowing only X number of something to execute at the highest fidelity, throttling other "less significant" Actors.

An example from Fornite is to use a maximum number of players running at "full fidelity" while forcing lower LODs and VFX on the remaining players that are less significant. Fortnite will prioritize your squadmembers and nearby players in view, while throttling any player that is offscreen and/or further away. Each platform, such as Mobile can have their own "bucket" size limits each defining how many players can be in a "bucket".

The project contains an implementation example using the Enemy Monsters (Look for 'MinionRangedBP') to throttle their animations and VFX based on a significance value.

Optimization Course Lesson: [Culling & Throttling Game Logic with Significance Manager](https://courses.tomlooman.com/courses/unrealperformance/lectures/60495611).
I talk about this system briefly in my [Game Optimization on a Budget Talk](https://tomlooman.com/unreal-engine-optimization-talk/#significance-manager).

### Animation Budget Allocator
 
Animation Budget Allocator plugin is used for the Enemy Monsters. The plugin attempts to keep total frame time spent on Animation systems below a certain threshold. It can use several mechanisms including animation throttling (only running once every few frames) or forcing lower LODs on Skeletal Meshes to stay within this budget.

You can define the allocated animation budget using scalability CVAR (`a.Budget.BudgetMs`) inside **DefaultScalability.ini**. View the budgeting debug and profiling information using `a.Budget.Debug.Enabled` and `stat AnimationBudgetAllocator`. 

The `ARogueAICharacter` class includes the optional `OnReduceAnimationWork` callback to allow custom logic to further throttle anim quality when necessary.

You can get a quick overview by checking out the [initial commit](https://github.com/tomlooman/ActionRoguelike/commit/bbf4ea3f1af05d2b3acdbcc3d2312137015d5789) on GitHub. Read more on the [Animation Budget Allocator Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-budget-allocator-in-unreal-engine) which contains all the steps to implement this in your own project.

## Explore Project Orion

Project Orion is an ongoing Unreal Engine C++ sample project, built to demonstrate practical gameplay systems, multiplayer features, Enemy AI, optimization techniques, and production-ready programming patterns.

You can download the complete project, explore the source code, and adapt its systems for your own Unreal Engine projects. If you find it useful, consider starring the repository to follow future updates.

[Explore 'Project Orion' on GitHub](https://github.com/tomlooman/ActionRoguelike)

**Want to learn how these systems are designed and built from the ground up?** Project Orion began as the central project in my 'Professional Game Development in C++ and Unreal Engine 5' course.

[Learn More About the C++ Course](/courses/unrealengine-cpp/)