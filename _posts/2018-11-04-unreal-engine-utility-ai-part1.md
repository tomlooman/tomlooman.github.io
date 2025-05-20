---
title: "Journey into Utility AI with Unreal Engine"
date: 2018-11-04
categories: 
  - "bp"
  - "ai"
tags: 
  - "ai"
  - "behavior-trees"
  - "unreal-engine"
  - "utility-ai"
  - "utility-systems"
coverImage: "UtilityAI_FeaturedImage_01.jpg"
---

Unreal Engine comes with several AI features built-in ([Behavior Trees, Blackboards](https://www.youtube.com/watch?v=tq-ULFuNyig), Navigation Mesh and Environment Query System) but hasn't seen many improvements in this area since the launch of 4.0 several years ago. With mixed results in our projects using Behavior Trees we decided to look at alternatives. [Oz](https://twitter.com/ozmant) pointed me to Utility AI as a system for setting up AI behaviors, I have since been fascinated by the simplicity of the concept to replace Behavior Trees in our projects.

Jakob Rasmussen has published '[Are Behavior Trees a thing of the past?](https://www.gamasutra.com/blogs/JakobRasmussen/20160427/271188/Are_Behavior_Trees_a_Thing_of_the_Past.php)' on Gamasutra which is a good read and suggests Utility AI as the next evolutionary step. In this article I explore the concept of Utility AI and how it can be integrated into Unreal Engine 4. This post is intended as a series where I continue to explore and show my results within Unreal Engine 4.

## What is Utility AI?

The concept of **Utility AI** has been around around for years, and the great [Dave Mark](https://twitter.com/iadavemark?lang=en) has been talking about it on platforms such as _Game Developers Conference_ several times. He calls it 'Infinite Axis Utility System' and I highly recommend watching some of his talks about the subject.

- [Improving AI Decision Modeling Through Utility Theory](https://www.gdcvault.com/play/1012410/Improving-AI-Decision-Modeling-Through)
- [Building a Better Centaur: AI at Massive Scale](https://www.gdcvault.com/play/1021848/Building-a-Better-Centaur-AI)

The core of the system is elegantly simple. You give an AI agent a set of possible Tasks to execute (eg. Seek Enemy, Attack Enemy, Flee, Jump, etc.) and on an interval you score each tasks between 0.0 and 1.0 where higher is better and 0.0 means the Task didn't pass and shouldn't be considered. You pick the highest scored and run that task. It's that simple. Each score evaluation can be basic (eg. only check if we have something to attack, yes is 1.0, no is 0.0) or complex with many different variables to evaluate. Distance to target, hitpoints of the enemy, amount of enemies in the area, your own hitpoints, which weapon the target has, etc. You can keep going deeper and deeper to endlessly fine-tune your score evaluation.

Tasks can be given priority weights so that an agent is more likely to flee from an incoming grenade rather than hunt for food. While both may have a base weight or near 1.0 as this agent may be starving of hunger, fleeing the grenade is still the more immediate threat.

## Why not Unreal Engine's Behavior Tree?

As mentioned in the intro we had some issues with using Behavior Trees once the number of available tasks per Agent increased. Every new task could influence the other parts of the tree without this clearly showing up until you ran the tree through some actual playing. It requires a certain way of thinking to create effective trees and allow for easy extension which can be hard to get into. We also found it can be difficult to get back into a tree you haven't touched in a while.

<figure>

[![](images/ue4_behaviortrees_example.png)](https://www.tomlooman.com/ue4-cpp-multiplayer-course/)

<figcaption>

Behavior Tree example from AI in my Unreal Engine course.

</figcaption>

</figure>

Furthermore, custom Decorators, Services, Tasks are all individual assets. This can blow up your asset count and jumping between assets cost mental effort and time. I find it reduces my productivity when jumping between asset files a lot. Utility AI still generated some assets such as Tasks, but the overall amount is much lower. Most is of the logic is happening inside the AI Controller class after all. The assets below are from a folder related to a still rather simple stealth game AI. It's a decent number of assets and will continue to grow.

![](images/ue4_behaviortrees_assets.jpg)

There is also a performance consideration to be made, but I currently don't have comparative numbers to claim either to be faster. From what I have heard, this favors Utility.

And finally, stability of the AI systems in Unreal Engine is another factor. We've encountered many crashes in EQS, Navigation Meshes & Volumes. Certain features of the engine keep improving at a rapid pace such as the Animation Tools, but AI doesn't nearly have the same velocity. It's easy to see if you keep up with the release notes of each engine version. Encountering AI bugs or crashes is therefor a bigger issue as you can't expect a fix in the next few releases.

The AI Tools do come with some powerful behavior debugging tools such as [Gameplay Debugger](https://docs.unrealengine.com/en-us/Gameplay/Tools/GameplayDebugger) and [Visual Logger](https://docs.unrealengine.com/en-us/Gameplay/Tools/VisualLogger). I recommend checking these out and apply them to your projects. These tools aren't limited to AI or Behavior Trees either and can be used for any kind of gameplay event.

![](images/visuallogger_example.png)

## Implementation Basics in Unreal Engine 4

So how should we go about implementing this system in Unreal Engine? In [Dave Mark's talk for Guild Wars 2](https://www.gdcvault.com/play/1021848/Building-a-Better-Centaur-AI) they use many C++ written evaluators that can be stacked together to create complex evaluations for each task. Having tried something similar, it proved to be too cumbersome for my specific needs and required a similar amount of jumping around like with the Behavior Tree assets. Blueprint graphs are incredibly powerful, so I implemented this in bespoke graphs and functions. After-all, it's unlikely Guild Wars has such a powerful tool as Blueprint.

Unreal ships with a [Gameplay Framework](https://www.tomlooman.com/ue4-gameplay-framework/) which implores you to put any AI logic inside [AIController](https://www.tomlooman.com/ue4-gameplay-framework/#AIController) derived classes. The custom AIController has a set of functions that calculate the score for each of the available tasks given. A _Task_ in this context is an UObject that will make the AI Pawn do things like moving to a location or firing at a target much like _GameplayTasks_.

All tasks are evaluated every few seconds in the AIController and the highest scoring task is selected and executed. Only if the running task can be cancelled and aren't already running that task. A Task can start and complete in a single frame or run for however long it needs (eg. a MoveTo task will keep running until the destination is reached)

<figure>

![](images/ue4_utilityai_basicgraph.jpg)

<figcaption>

Earlier implementation prototype showing the task selection part of the concept. (later prototype looks slightly different to better handle inheritance and AI variations, but core principles remain)

</figcaption>

</figure>

Scoring can be quite simple. In the example below we give the task a score of 0.5 if the TargetActor is set. Otherwise it's zero meaning we don't want the AI to consider this Task. The talks of Dave Mark go more in detail on implementing more complex scoring functions.

<figure>

![](images/ue4_utilityai_scoreexample.jpg)

<figcaption>

Example of a basic 'scoring function' in Utility AI

</figcaption>

</figure>

## Other Uses for Utility Scoring

The core concept of utility scoring can be used for other features too, for example to determine the 'best' object for the character to look at with its head (see video below). We've also successfully used this as an alternative to Unreal's Environment Query System where queries score a collection of actors or locations based on unique scoring functions to select best move-to location, spawn area, etc.

https://youtu.be/WKS2RyR90V8

## What's Next?

The next major step is to try out more AI variations to mature the implementation. I'm excited to see how far Utility AI will go and if it's a long term replacement for Behavior Trees in our projects. Dave Mark's explorations so far have proven the system works, along with several successful commercial titles. So it's a matter of finding a smooth integration into Unreal Engine without over-engineering a big framework around it. With that, I hope to share my future explorations in this area with more concrete gameplay examples and code.

**If you've enjoyed this read, be sure to** [**check out part two!**](https://www.tomlooman.com/utility-ai-ue4-2/)

## References & Additional Reading

- [Video Introduction into UE4 Behavior Trees](https://www.youtube.com/watch?v=tq-ULFuNyig)
- [42 Tips from Halo's AI](http://aigamedev.com/open/review/halo-ai/)
- [Gameplay Framework Primer (Guide)](https://www.tomlooman.com/ue4-gameplay-framework)
