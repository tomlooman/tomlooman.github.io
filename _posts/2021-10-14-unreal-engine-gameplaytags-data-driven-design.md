---
title: "Why you should be using GameplayTags in Unreal Engine"
date: 2021-10-14
categories:
  - "C++ Programming"
tags: 
  - "C++"
  - "Data-driven Programming"
  - "GameplayTags"
  - "Action Roguelike"
coverImage: "Thumb_GameplayTags2.jpg"
sidebar:
    nav: sidebar-cpp
redirect_from:
  - /data-driven-design-gameplaytags/
---

You may or may not be familiar with GameplayTags in Unreal Engine. It's heavily used in Unreal's [Gameplay Ability System](https://www.youtube.com/watch?v=Tu5AJKNe1Ok), but can be used stand-alone in your game framework. In this article, I will introduce [GameplayTags](https://docs.unrealengine.com/en-US/ProgrammingAndScripting/Tags/index.html) and how they can be used in your game, even if you choose not to use GAS.

## What are GameplayTags?

A `FGameplayTag` is essentially an [FName](https://docs.unrealengine.com/en-US/fname-in-unreal-engine/) that is defined in the game's project settings (or natively defined in C++). A major benefit of using these tags is that they allow for easy selection in the Editor's UI and don't have to type them out each time which is prone to user error. You also don't use `TArray` with `FGameplayTag`, instead you should always use the `FGameplayTagContainer` as this has helper functions to match one or multiple tags easily.

![](/assets/images/gameplaytags_editorselection.png)
*GameplayTag selection menu for any FGameplayTag of FGameplayTagContainer variable.*

![](/assets/images/gameplaytags_configsettings.png)
*Gameplay Tag Manager in _Project Settings \> Project \> GameplayTags \> Manage Gameplay Tags_*

Another powerful feature is the hierarchy to find exact tags or match based on their parent. This lets you create a tree of tags from broad to very narrow. some examples:

- _Damage.DoT.Fire_
- _Location.Planet.Derelict_
- _Action.Primary_
- _Action.Secondary_
- _Effect.Burning_
- _Effect.UIHidden_
- _DamageType.Energy_
- _Attribute.Health_
- _Terminal.Engineering_

The above is a random selection of tags used in some of my own projects. The neat thing is you can use GameplayTags to specify something is a DamageType, and more specifically a DamageType.Fire, DamageType.Kinetic, etc.

The concept of hierarchies may become more clear once you start thinking of your content in this way and use it in some real-world scenarios. It took me a little bit before I finally understood how to use this feature properly.

## How are GameplayTags different from Actor / Component Tags?

It may be confusing that there are multiple tagging systems in Unreal. The basic system of tagging (Actor/Component Tags) works with [Strings](https://docs.unrealengine.com/en-US/fstring-in-unreal-engine/) and has none of the neat features of GameplayTags. Once your content starts to grow in the hundreds of gameplay assets you really don't want to end up with typos in your handwritten string tags or re-open assets all throughout your content folders to remember how you named that one particular tag since the basic tag systems have no central database. This system also lacks the hierarchy feature. It'll become a nightmare to manage and compare Tags using this basic system unless you implement this yourself from scratch.

![](/assets/images/gameplaytags_findreference.jpg)
*GameplayTags can be tracked in the Reference Viewer*

## Some practical use-cases

One way to think about tags is having a big library of booleans. You can easily decorate your actors (and most other types of content for that matter) with a wide range of these 'bools' for the rest of your game code to read and react to. A major benefit here is when using an ActorComponent to hold these tags is that you don't need to cast to specific Actor classes as you would with regular bool variables. It's far more dynamic than if you had to compile 100s of bools into your classes too.

I highly recommend looking into [Lyra Starter Game](https://docs.unrealengine.com/en-US/lyra-sample-game-in-unreal-engine/) (or the older [UE4 ActionRPG](https://docs.unrealengine.com/4.27/en-US/Resources/SampleGames/ARPG/)) to get some familiarity with the Gameplay Ability System and their use of GameplayTags. It uses a component added to gameplay Actors which you can load up with tags. My own [open-source project](https://github.com/tomlooman/ActionRoguelike) uses GameplayTags for a custom ability system as well.

### Start Ability by Tag

You could start an ability by GameplayTag rather than calling Start() on it directly by holding a hard reference to a specific ability class.

![](/assets/images/gameplaytags_startaction.jpg)

### Gameplay Message Router (Lyra Plugin)

Lyra has a plugin dedicated to this called _GameplayMessageRouter_ which I recommend digging into and consider for your gameplay framework. It essentially allows you to broadcast and listen for gameplay events by tag with a custom payload (struct) of choice.

![](/assets/images/gameplaytags_messagerouter.png)
*Send a message with tag Event.Module.Disabled for other game systems to listen to, with two parameters wrapped in a struct.*

![](/assets/images/gameplaytags_listenformessage.png)
*Listen for Event.Module.Disabled event, the struct used here must match the one sent earlier.*

### GameplayTag Add/Remove Events

![](/assets/images/ue_gameplaytags_taglistener.jpg)
*Adding GameplayTag "listeners" is invaluable in building an event-driven gameplay framework. Here we listen for the Pawn to go into ADS (Aim down Sights) so we can run some logic in response. _(Note: AddGameplayTagListener is a function from my own project - similar functionality can be found in [GAS](https://docs.unrealengine.com/4.27/en-US/InteractiveExperiences/GameplayAbilitySystem/))_*

You want to wrap your custom `AddTag()` and `RemoveTag()` functions so you can broadcast an event/delegate.

I'll be adding a better example of this to the Action Roguelike sample project, at which time this section will be updated.

### Markup for Loot tables

Mark up your loot tables with tags that can block specific items from dropping in the table or tags that are required in order to drop a particular item as loot. Below is an example of a TableRow struct usable in DataTables.

![](/assets/images/ue_gameplaytags_datatablerows.jpg)
*'Required Tags' can be used to filter out items from the loot table before rolling the dice. These 'Tags' can be grabbed from anywhere in your game code such as those applied to the character, the looted chest, the environment, etc.*

```cpp
USTRUCT(BlueprintType)
struct FItemTableRow : public FTableRowBase
{
  GENERATED_BODY()

public:

  UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "ItemTable")
  FPrimaryAssetId ItemId;

  /* Use -1 weight for guaranteed drop. */
  UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "ItemTable")
  float Weight;

  /* Item is only included if all tags are present when rolling.  */
  UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tags")
  FGameplayTagContainer RequiredTags;

  /* Item is excluded when the roll includes this tag. */
  UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Tags")
  FGameplayTagContainer BlockedTags;
}
```

### Lock & Keycard Video Example

An easy way to demonstrate GameplayTags and its hierarchical features is by using DOOM's locked doors and colored keycards. I have a video tutorial of that which is part of the C++ Course.

<iframe width="560" height="315" src="https://www.youtube.com/embed/eIF102RftRg?si=INDl7QRnSY5SgZ9B" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## GameplayTags as alternatives to Casting

Casting and class references won't hit you as a problem until much later in the project. You will realize any class hard reference requires the referenced asset/class to be loaded and that may cause a cascade of additional assets to be loaded such as meshes or particle effects. You can (and should) use base classes that don't reference other assets as much as possible to reduce this problem. GameplayTags can help even more by allowing you to remove direct references between your assets all together.

The best way to check for references is by using the [Reference Viewer](https://docs.unrealengine.com/5.2/en-US/finding-asset-references-in-unreal-engine/) & [Size Map](https://dev.epicgames.com/community/learning/tutorials/r4y7/unreal-engine-size-map) tool. (Both available by right-clicking your asset in the Content Browser)

![](/assets/images/ue_gameplaytags_sizemaptool.jpg)

In the example above I already see some references that shouldn't be there. We somehow end up referencing several classes such as _BaseShip_ and _TurretRotating_ class (left top) which are 30MB and 11MB in size and should have nothing to do with a Player Pawn. These problems will often occur during development, it's better to find these early as you may need to adjust your framework design or change your coding habits before it's too late in the project. This is not just for the final game product either, you are loading in these referenced assets any time you boot up the editor or load in a particular blueprint (and all its references) that you work on.

Any assets referenced here will be loaded when the asset in question is used - unless you use soft references inside said asset. This is a silent killer as you won't notice until you have already added in a decent chunk of your content at which point it's expensive to re-design your framework.

## Decorating Items with Tags

My game has a large number of "Items" which isn't just restricted to what you consider items from an Inventory. Even Points of Interest, Characters, Ships, Achievements, etc. could be considered an Item. In practice, it's a (Primary)DataAsset that holds UI information, ability data, related Actor class, **GameplayTags**, etc. The GameplayTags can be useful to generically decorate your "Item" with whatever information is desired in its context.

![](/assets/images/ue_gameplaytags_items-1.jpg)
*Some of the current item types in WARPSQUAD.*

## Networking (Replication)

GameplayTags can be replicated more efficiently by Unreal than `FName`. There are some options available in _Project Settings \> GameplayTags_. 'Fast Replication' is able to replicate tags by Index instead of the full Name, for this the tag list must be identical between client and server.

![](/assets/images/ue_gameplaytags_tagreplication.jpg)

## GameplayTag Stack Container

The default FGameplayTagContainer struct lacks one critical feature. And that's "Stacking" of tags, or keeping a count. Epic's Gameplay Ability System solves this through a `FGameplayTagCountContainer` which stores the number of instances.

Lyra has `FGameplayStackContainer` which isn't coupled to the ability system and could be transferred to your own project.

This is incredibly powerful as multiple sources might want to add/remove tags which avoid conflicts as now the tag stays on the target until it reaches zero.

Of course, you could even use this for more conventional counting of resources such as Ammo.

## Implementing GameplayTags

With all the reasons why you should be using tags covered, let's show some actual code!

### Enabling GameplayTags in your C++ project.

To enable the use of GameplayTags in C++ you must add the "GameplayTags" module to your `MyProject.build.cs`. Click [here](https://github.com/tomlooman/ActionRoguelike/blob/master/Source/ActionRoguelike/ActionRoguelike.Build.cs) for an example of \*.builds.cs with GameplayTags enabled.

Make sure the "GameplayTagsEditor" plugin is enabled (default). Otherwise, you won't have any of the useful editor windows that make this so useful.

### Using GameplayTag in C++

Below is an example of the ActionComponent and Action classes which define a container and individual tag.

ActionComponent holding container for tags:

```cpp
#include "GameplayTagContainer.h"

UCLASS()
class ACTIONROGUELIKE_API URogueActionComponent : public UActorComponent
{
  GENERATED_BODY()

  UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Tags")
  FGameplayTagContainer ActiveGameplayTags;
}
```

Action which adds tags to owner when activated and holds blocked tags which prevent the action from running if present on the owner.

```cpp
#include "GameplayTagContainer.h"

UCLASS(Blueprintable)
class ACTIONROGUELIKE_API URogueAction : public UObject
{
  GENERATED_BODY()

  /* Tags added to owning actor ActiveGameplayTags when activated, removed when action stops */
  UPROPERTY(EditDefaultsOnly, Category = "Tags")
  FGameplayTagContainer GrantsTags;

  /* Action can only start if OwningActor has none of these Tags applied */
  UPROPERTY(EditDefaultsOnly, Category = "Tags")
  FGameplayTagContainer BlockedTags;

```

Starting the action will add the tags to the owner.

```cpp
void URogueAction::StartAction_Implementation(AActor* Instigator)
{

  URogueActionComponent* Comp = GetOwningComponent();
  // AppendTags() for adding containers and AddTag() for single tags.	
  Comp->ActiveGameplayTags.AppendTags(GrantsTags);

}
```

CanStart checks for any "illegal" tags present on the owner.

```cpp
bool URogueAction::CanStart_Implementation(AActor* Instigator)
{

  URogueActionComponent* Comp = GetOwningComponent();
	
  if (Comp->ActiveGameplayTags.HasAny(BlockedTags))
  {
    return false;
  }

  return true;
}
```

### Defining Native GameplayTags

Since 4.27 it's much easier to define GameplayTags directly in C++. This can be helpful if your framework requires certain tags to be present without having to define them elsewhere in your INI files. You then don't need to use the _RequestGameplayTag()_ function from earlier so long as you defined this tag in code and not the project settings.

```cpp
// Macro in your CPP file, naming style is an example. First param is what you use to access this Tag in your C++.
UE_DEFINE_GAMEPLAY_TAG(TAG_Attribute_Health, "Attribute.Health");

// In the Header file.
UE_DECLARE_GAMEPLAY_TAG_EXTERN(TAG_Attribute_Health);

// -- Alternative Macro is available: --- //

/**
 * Defines a native gameplay tag such that it's only available to the cpp file you define it in.
 */
UE_DEFINE_GAMEPLAY_TAG_STATIC(TAG_Attribute_Health, "Attribute.Health");
```

With the tag defined above you can use the `TAG_Attribute_Health` elsewhere in your code which represents an FGameplayTag filled with "Attribute.Health".

## Project Example

Sometimes the best way to learn is by example. **My [open-source Action Roguelike](https://github.com/tomlooman/ActionRoguelike) project uses GameplayTags for Actions and Buffs.** For example, while Sprinting a tag is applied that prevents the player from attacking. You can find this in the _URogueActionComponent_ class and the _URogueAction_ class.

This project is part of my new **Unreal Engine C++ Course** where I talk more in depth about GameplayTags and tons of other essential skills for Unreal C++ Game Programming!

**[Unreal Engine C++ Pro Course (Full Details)](https://courses.tomlooman.com/p/unrealengine-cpp?coupon_code=COMMUNITY15)**

## Closing

I hope this intro helped you understand how GameplayTags may be used in your project and will trigger you to continue researching and experimenting. Sometimes you just need to be made aware something exists as you won't go looking for it yourself.

As always don't forget to follow me on [Twitter](https://twitter.com/t_looman) and subscribe to the mailing list!

## References

- [Using GameplayTags to Label and Organise Content (Official Blog)](https://www.unrealengine.com/en-US/tech-blog/using-gameplay-tags-to-label-and-organize-your-content-in-ue4)
- [GameplayTags (Official Documentation)](https://docs.unrealengine.com/en-US/gameplay-framework-in-unreal-engine)
