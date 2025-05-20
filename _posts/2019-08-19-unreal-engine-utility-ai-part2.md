---
title: "Journey into Utility AI for Unreal Engine (Part Two)"
date: 2019-08-19
categories: 
  - "bp"
  - "ai"
tags: 
  - "ai"
  - "behavior-trees"
  - "blueprints"
  - "unreal-engine"
  - "utility-ai"
  - "utility-systems"
coverImage: "UtilityAI_FeaturedImage_Part2.jpg"
---

Since the last time I wrote about Utility AI for Unreal Engine 4, it has been stream-lined and so has the Action System it's built on. The Action System is quite similar to Unreal's Gameplay Ability System for those familiar. Towards the end I'll tease a few other AI related concepts I've been working on. [Here is part one in case you missed it.](https://www.tomlooman.com/journey-into-utility-ai-ue4/)

This post is mainly going to be a walkthrough of what I've been experimenting with and how the overall structure is shaping up. I'd like to add more practical guides in future parts including some more gameplay footage of the AI in action.

![](images/UtilityAI_FeaturedImage_Part2_Thin.jpg)

## System Breakdown

_Let me try to break it down:_ The AIController has an ActionComponent filled with the utility actions. These actions contain a scoring function and an execute function. The execution function is often basic as they often just trigger abilities on the Pawn they control.

This controller contains a custom blackboard too, allowing run-time adding/modifying of keys and values. This in particular is a little more powerful than the built-in blackboard which doesn't let you add runtime keys unfortunately. Replication and SaveGame support are other neat bonuses. You can store the current target or any other runtime data for AI to make decisions and perform actions.

While scoring actions, you may need to keep track of which location or target was 'best'. You simply score this inside the action itself as a regular ol' variable. This way no other action interferes with this until you are ready to execute and set the new target in the controller's blackboard.

Multiple tasks can now run at the same time, using _resource locking_ to prevent incompatible tasks from running at the same time.

## Resource Locking

A pretty interesting feature from AITasks in Unreal's GAS is the concept of _claiming resources_. Such as claiming the _legs_ of a character. So that you don't attempt to run another task that requires the legs/movement. With the action system you assign which GameplayTags to apply to the owner on activation.

_Example:_ A melee attack taking several seconds and locking the movement of the character. The action claims the resource _Movement_. A Dodge-roll task can no longer execute, as its set to require Movement to NOT exist on the AIController.

## Runtime Blackboard

While Unreal comes with a Blackboard feature built-in for its Behavior Trees it lacks a few things I really want such as adding keys at runtime. Some other things I wanted: GameplayTags as keys (avoid typo's, forgetting key names) Save Game support and possibly replication support. Replication is only relevant if Blackboards are used for things besides AI which I am still experimenting with.

![](images/ue4_blackboard_setfloat-900x246.jpg)

The AIController contains a Blackboard and can be used as a data bank. This easily lets tasks share these variables such as _TargetActor_ which might only be set by one task but used by many. Each _key_ can be listened to for value changes.

Blackboards can be used for more than just AI. In games like _Firewatch_ blackboards are used to store global story/game state that can be queried by quests, dialog etc. [They spoke about their dialog system during GDC 2017](https://www.youtube.com/watch?v=wj-2vbiyHnI).

## Utility Query System

Some time ago I made a small [EQS](https://docs.unrealengine.com/en-us/Engine/AI/EnvironmentQuerySystem) variation I dubbed _UtilityQuery._ It doesn't have the fancy editor of EQS, but it's simpler, and a lot easier to extend. A system like this (and EQS) is fantastic for spatial queries such as finding a spawn location for players, enemies, or treasure.

The query has a gather-step followed by a scoring-step similar to Utility-systems (and EQS for that matter). Again, this deserves its own post some time in the future. Here is what that could look like if applied as Perception replacement.

https://www.youtube.com/watch?v=fCAhGqtjjGc&feature=youtu.be

## Bonus: Auto-matching Task name with Scoring Function.

For a while I used a C++ function that was able to run any Blueprint function by FName. This made it easy to setup tasks in Blueprint by name and match it to a scorer function in AIController. For example, my AI task _LaunchMissile_ would match to the Blueprint function named _Score\_LaunchMissile_ automatically.

<figure>

![](images/UtilityAI_ScoringFunc-900x294.jpg)

<figcaption>

Can call Blueprint functions like Score\_MyTaskName and return the function return value (BP function must return one float)

</figcaption>

</figure>

I used the following code. _(disclaimer: I can't guarantee the memory allocations used here are optimal or 100% safe - it's the best I could find when looking around)_

```
float ALZAIController::CallScoreFunctionByName(FName InFunctionName)
{
	UFunction* Func = FindFunction(InFunctionName);
	if (ensure(Func))
	{
		// Buffer is required to fetch the return value from
		uint8 *Buffer = (uint8*)FMemory_Alloca(Func->ParmsSize);
		FMemory::Memzero(Buffer, Func->ParmsSize);

		ProcessEvent(Func, Buffer);

		for (TFieldIterator<UProperty> PropIt(Func, EFieldIteratorFlags::ExcludeSuper); PropIt; ++PropIt)
		{
			// The "Score" return param was not marked as returnparm for unknown reason, the OutParm does work though so I am sticking with that one
			UProperty* Property = *PropIt;
			if (Property->HasAnyPropertyFlags(CPF_ReturnParm | CPF_OutParm))
			{
				uint8* outValueAddr = Property->ContainerPtrToValuePtr<uint8>(Buffer);
				float* pReturn = (float*)outValueAddr;
				return *pReturn;
			}
		}
	}

	UE_LOG(LogAI, Warning, TEXT("Failed to find and/or run scoring function by name '%s' for Actor '%s'. Check name and/or add return float parameter."), *InFunctionName.ToString(), *GetName());
	return 0;
}
```

Since then I moved over to embedding the scoring functions in the AI tasks themselves, making this feature redundant. I wanted to share it here regardless since I think it still has utility for others.

## What's Next?

AI is somewhat on the back-burner for my project as it's working as intended. Providing decent gameplay challenges for the player as-is. I do eventually require 3D Pathfinding & Spatial Reasoning. I intend to completely replace all aspects of Unreal's AI Module eventually (including navigation mesh).

**As always, be sure to** [**follow me on Twitter**](https://twitter.com/t_looman) **or check out my** [**previous posts on AI**](https://www.tomlooman.com/ue4/ai/)**.**

## References

- [Firewatch Talk on Blackboards](https://www.youtube.com/watch?v=wj-2vbiyHnI)
