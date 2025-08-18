---
title: "Using C++ Timers in Unreal Engine"
date: 2015-04-09
categories: 
  - "cpp"
  - "gameplay"
coverImage: "Thumb_CPPTimers.jpg"
---

Timers are incredibly helpful for gameplay programming in Unreal Engine. However, the syntax can be a little tricky if you're unfamiliar with C++. This blog post will cover all the essential features and syntax for using C++ timers effectively in your game.

For a code example of timers, check out my [C++ Action Roguelike](https://github.com/tomlooman/ActionRoguelike/blob/master/Source/ActionRoguelike/Private/SAction_ProjectileAttack.cpp) (delegate with parameters). Timers as part of game performance are covered in my game optimization course. More on that later.

## Set Timer

You set timers through the global timer manager which is available through `GetWorld()->GetTimerManager()` or the shorthand available in any Actor, `GetWorldTimerManager()` which returns the same timer manager. There are a couple of overloads (function variations) available to pass the function to execute, the interval between triggers (if looped), a flag to enable looping, and the optional first delay. You can also set a timer to run the next frame by calling `SetTimerForNextTick()`.

Code sample from my [Survival Game](https://github.com/tomlooman/EpicSurvivalGame/blob/master/SurvivalGame/Source/SurvivalGame/Private/Items/SBombActor.cpp) _BombActor_ where we set a timer for a delayed explosion:

```
/* Activate the fuze to explode the bomb after several seconds */
void ASBombActor::OnUsed(APawn* InstigatorPawn)
{
  GetWorld()->GetTimerManager().SetTimer(
    FuzeTimerHandle, // handle to cancel timer at a later time
    this, // the owning object
    &ASBombActor::OnExplode, // function to call on elapsed
    MaxFuzeTime, // float delay until elapsed
    false); // looping?
}
```

The `FTimerHandle` is in the header file. Although you are not required to keep a reference to the handle, it's recommended to put this in your header to properly clear or pause your timer instance.

```
/* Handle to manage the timer */
FTimerHandle FuzeTimerHandle;
```

The function `OnExplode()` has no parameters in this example. To pass along parameters on timer elapsed, there is a different way to bind the function...

## Using SetTimer() on a Function with Parameters

It's possible to pass parameters into timer functions (delegates). The example is from [Action Roguelike's Projectile Attack](https://github.com/tomlooman/ActionRoguelike/blob/master/Source/ActionRoguelike/Private/SAction_ProjectileAttack.cpp). In this case, we bind the function by name instead.

```
FTimerHandle TimerHandle_AttackDelay;
FTimerDelegate Delegate; // Delegate to bind function with parameters
Delegate.BindUFunction(this, "AttackDelay_Elapsed", Character); // Character is the parameter we wish to pass with the function.

GetWorld()->GetTimerManager().SetTimer(TimerHandle_AttackDelay, Delegate, AttackAnimDelay, false);
```

To bind functions _with parameters_ to a timer, it must be specified in the header with `UFUNCTION()`. You can remember this since the `FTimerDelegate` from the above example calls a function literally named `.BindUFunction()`.

```
UFUNCTION()
void AttackDelay_Elapsed(ACharacter* InstigatorCharacter);
```

## Clearing Timer(s)

When destroying or deactivating objects, make sure you clear any active timers. There are two ways of dealing with timer removal. You don't need to do this for timers that have elapsed and aren't looping.

```
void ASBombActor::EndPlay(const EEndPlayReason::Type EndPlayReason)
{
	Super::EndPlay(EndPlayReason);

	// Ensure the fuze timer is cleared by using the timer handle
	GetWorld()->GetTimerManager().ClearTimer(FuzeTimerHandle);

	// Alternatively you can clear ALL timers that belong to this (Actor) instance.
	GetWorld()->GetTimerManager().ClearAllTimersForObject(this);
}
```

## Debugging & Profiling

You can dump the currently active timers by using the `listtimers` console command. You can also dump expensive timer functions to the log by setting `TimerManager.DumpTimerLogsThreshold` to anything higher than 0 (where the number is the time threshold in seconds)

## When does it Tick?

The TickManager itself ticks between [TickGroups](https://docs.unrealengine.com/en-US/actor-ticking-in-unreal-engine/#tickgroups). Specifically, between **PostPhysics** and **PostUpdateWork**. That's relatively late in the GameThread frame. Keep this in mind for any potential dependencies as you might introduce a one-frame delay if implicit dependent objects have already ticked that frame.

## Advanced Considerations

There are a couple of things to consider that aren't immediately obvious and/or are more relevant once you are optimizing your game.

### High-Frequency Timers

It's important to note that while you can run very high-frequency timers, these do not actually run asynchronously or on a higher 'real' framerate than your game. Let's say your game runs on 60 FPS and you have a timer on 0.005 looping intervals. That's about 200 times per second, internally it will still run approx. 200 times per second even at 60 frames per second! It's important to realize though that this will execute multiple times in a loop, immediately after each other, and NOT spaced out smoothly every 0.005.

It will instead run about 3 times per frame in a burst, which is just a waste of execution and could be done 1 time per frame with a higher DeltaTime to compensate.

**New in 5.4:** 'Max Once Per Frame' to avoid the catch-up behavior where the timer may be called multiple times per frame.

![](/assets/images/GNDq-lMXIAAckpr.png)

In C++ this is available too of course, but is a bit more hidden inside `FTimerManagerTimerParameters` with `bMaxOncePerFrame`. Here is the example usage I could find in the engine:

```
// Example found in UKismetSystemLibrary::K2_SetTimerDelegate
TimerManager.SetTimer(Handle, Delegate, Time, 
FTimerManagerTimerParameters { .bLoop = bLooping, .bMaxOncePerFrame = bMaxOncePerFrame }); // Creates the FTimerManagerTimerParameters struct inline
```

### Frame Pacing

You should never use TickManager as an excuse to not optimize badly performing code or naturally expensive operations. Running them as timer functions on a lower frequency may cause an instable framerate rather than smooth performance which hinders player experience. There are a couple of alternatives such as time slicing (spreading the workload across multiple frames) or running the entire function asynchronous using [Unreal's Task System](https://docs.unrealengine.com/en-US/tasks-systems-in-unreal-engine/).

### (Lack of) CPU Cache

If you are updating many of the same objects using the TickManager using individual timers, you have no control over their execution order. Much like Unreal's standard Ticking system. There are enormous performance benefits to maximizing the CPU instruction and data cache. While this is out of the scope of this article, the most relevant resource to learn more is [UnrealFest's Aggregating Ticks to Manage Scale in Sea of Thieves](https://www.youtube.com/watch?v=CBP5bpwkO54). Consider combining many small timer functions into a single manager to maximize performance.

## Closing

Timers are great for triggering delayed events and handling other time-based events that you may be inclined to put in your Tick() function instead. Be mindful to not abuse this convenient solution in places where you really need a more well considered system.

Interested to learn more in-depth about **performance & optimization** concepts like **timers, tickgroups, frame pacing, cpu cache**, and many more? I just launched my [**Complete Game Optimization Course for Unreal Engine 5**](https://courses.tomlooman.com/p/unrealperformance)!

Check out the API for [FTimerManager](https://docs.unrealengine.com/latest/INT/API/Runtime/Engine/FTimerManager/index.html) API Documentation for more useful functions on timers. Including time remaining, finding the tick rate, active timers, pause/continue, etc.

## References

- [Gameplay Timers (Official Documentation)](https://docs.unrealengine.com/4.27/en-US/ProgrammingAndScripting/ProgrammingWithCPP/UnrealArchitecture/Timers/)
