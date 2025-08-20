---
title: "Adding Stat Traces (Stat Commands) in Unreal Engine"
date: 2018-12-25
categories: 
  - "cpp"
  - "rendering"
tags: 
  - "performance"
  - "profiling"
  - "programming"
coverImage: "StatCommands_FeaturedImage.jpg"
---

The only sane way to optimize your game is by having good profiling metrics. Unreal Engine comes packed with several good profiling tools and "stat commands" is one such feature. It allows us to measure pieces of our (C++) code in different ways. In this short article I explain how you can use this to your advantage.

While it's good to avoid pre-mature optimization in your project, it's a good practice to add metrics to certain areas of your code. As features may perform fine initially, but may degrade as content changes. Having profiling stats in place enables you to quickly understand what's going on.

## Types of available Metrics

The first metric type is a cycle counter, it tracks how much time is spent in a certain function in milliseconds. The second metric type is a counter, this can be useful to track event frequencies for example.

Check out _**Engine\\Source\\Runtime\\Core\\Public\\Stats\\Stats.h**_ for a full list of Macros available as there are some additional useful ways to track your code.

As an example, I like to keep track of how many Actors get spawned during a session, so I added a counter to the ActorSpawned delegate available in UWorld.

At the top of the .cpp file (in my case LZGameInstance.cpp) I declare the stat we wish to track. In the function that is triggered any time a new Actor is spawned we place the actual counter. Note that the **STATGROUP\_LODZERO** is defined elsewhere in my code to define a new Category that I'll explain in a later section.

```cpp
// Keep track of the amount of Actors spawned at runtime (at the top of my class file)
DECLARE_DWORD_ACCUMULATOR_STAT(TEXT("Actors Spawned"), STAT_ACTORSPAWN, STATGROUP_LODZERO);
```

```cpp
// Increment stat by 1, keeping track of total actors spawned during the play session (Placed inside the event function)
INC_DWORD_STAT(STAT_ACTORSPAWN); //Increments the counter by one each call.
```

The above example is nice to track occurances, but often you want to measure execution cost instead. For that we use cycle counters as shown below.

In the next example I'd like to measure if at some point a getter function cost becomes too large and requires optimization.

```cpp
DECLARE_CYCLE_STAT(TEXT("GetModuleByClass (Single)"), STAT_GetSingleModuleByClass, STATGROUP_LODZERO);
```

```cpp
AWSShipModule* AWSShip::GetModuleByClass(TSubclassOf<AWSShipModule> ModuleClass) const
{
	SCOPE_CYCLE_COUNTER(STAT_GetSingleModuleByClass);

	if (ModuleClass == nullptr)
	{
		return nullptr;
	}

	for (AWSShipModule* Module : ShipRootComponent->Modules)
	{
		if (Module && Module->IsA(ModuleClass))
		{
			return Module;
		}
	}

	return nullptr;
}
```

In the next section we'll go in how these stats can be displayed on-screen using the above two examples.

## Showing profiling metrics in-game

Toggling can be done per category and multiple can be on screen at once. To show a stat you open the console window (~ Tilde) and type "stat YourCategory". In my case it's "stat LODZERO" as defined by the code snippet of the next section that defines the Category as STATGROUP\_LODZERO.

**Tip:** To hide all displayed stats you can simply type: "_stat none_".

![](/assets/images/ue4_statcommands_example-900x233.jpg)

## Adding new profiling metrics to your game

As you can see it only takes a few Macros to set up your own metrics. The one missing piece is how to define your own category as used in the above examples. Here is an example of declaring a Category:

```cpp
DECLARE_STATS_GROUP(TEXT("LODZERO_Game"), STATGROUP_LODZERO, STATCAT_Advanced); 
// DisplayName, GroupName (ends up as: "LODZERO"), Third param is always Advanced.
```

> Add this to your game header so it can be easily included across your project. (eg. MyProject.h or in my case I have a single header for things like this called FrameworkZeroPCH.h)

Finally, it's important to note you can also measure just a small part of a function by using curly braces.

```cpp
void MyFunction()
{
    // This part isn't counted
   
    {
         SCOPE_CYCLE_COUNTER(STAT_GetSingleModuleByClass);
         // .. Only measures the code inside the curly braces.
    }

    // This part isn't counted either, it stops at the bracket above.
}
```

## Extending Trace Data for Unreal Insights

To add trace details for your own game code, you can easily do so using the SCOPED\_NAMED\_EVENT.

```cpp
SCOPED_NAMED_EVENT(StartActionName, FColor::Green);
SCOPED_NAMED_EVENT_FSTRING(GetClass()->GetName(), FColor::White);
```

First parameter is a custom name as it shows up in Insights, the second is the color for display in the Insights UI.

The example below has two examples, one tracing the entire function while the second variation is placed within curly braces which limits the trace to within those lines of code. The \_FSTRING variant lets us specify runtime names, but does add additional overhead so it should be used with consideration.

```cpp
bool USActionComponent::StartActionByName(AActor* Instigator, FName ActionName)
{
  // Trace the entire function below
  SCOPED_NAMED_EVENT(StartActionName, FColor::Green);

  for (USAction* Action : Actions)
  {
    if (Action && Action->ActionName == ActionName)
    {

    // Bookmark for Unreal Insights
    TRACE_BOOKMARK(TEXT("StartAction::%s"), *GetNameSafe(Action));
			
    {
      // Scoped within the curly braces. the _FSTRING variant adds additional tracing overhead due to grabbing the class name every time
      SCOPED_NAMED_EVENT_FSTRING(Action->GetClass()->GetName(), FColor::White);

      Action->StartAction(Instigator);
    }
    }
  }
}
```

## Conclusion

Stat commands are incredibly useful if used pragmatically and provide a quick insight in your game's performance. Make sure you add stats conservatively, as they are only valuable if you get actionable statistics to potentially optimize. They add a small performance hit themselves and any stat that is useless just adds to your code base and pollutes your stats view.

**Don't forget to check out** [**my other C++ Content**](https://www.tomlooman.com/unreal-engine-cpp-tutorials/) **or** [**follow me on Twitter!**](https://twitter.com/t_looman)

## References

- [Stat Commands | Unreal Docs](https://dev.epicgames.com/documentation/en-us/unreal-engine/stat-commands-in-unreal-engine)

- [Stats System Overview | Unreal Docs](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-stats-system-overview)

- [Trace Developer Guide (Insights) | Unreal Docs](https://dev.epicgames.com/documentation/en-us/unreal-engine/developer-guide-to-tracing-in-unreal-engine)
