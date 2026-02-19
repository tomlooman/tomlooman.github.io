---
title: "Unreal Engine Learning Resources"
date: 2020-07-28
last_modified_at: 12-09-2025
permalink: unreal-engine-bookmarks
coverImage: "epicparty_dannyoakes_01.jpg"
layout: resourcecollection
redirect_from:
   - /unreal-engine-resources/
---

You've stumbled upon my collection of Unreal Engine resources and tutorials created by people from the Unreal Engine community. These are resources I sought out and stumbled upon while learning and creating with Unreal for the past few years.

{: .notice--info }
Check out the [Game Development Resource](/game-development-resources) Page!

## Getting Started

- [Unreal Engine Dev Community Tutorials](https://dev.epicgames.com/community/unreal-engine/learning)  
   Dev Community
- [BeginPlay (Tutorial Series)](https://dev.epicgames.com/community/learning/paths/0w/beginplay)  
   Begin Play is a series of videos designed for experienced developers who are transitioning from other engines like Unity to Unreal Engine 5. Each video gives a high-level overview of the various features of the engine and how they connect together.

## Programming (C++)

- [C++ Complete Guide](/unreal-engine-cpp-guide)  
   Comprehensive reference guide for Unreal Engine C++.
- [Professional Game Development in C++ and Unreal Engine](https://courses.tomlooman.com/p/unrealengine-cpp?coupon_code=COMMUNITY15)  
   My Unreal Engine C++ Course for those looking to start or improve their C++ skills. Taught at Stanford University
- [Laura's C++ Speedrun](https://landelare.github.io/2023/01/07/cpp-speedrun.html) (NEW)  
   Good list of things to be aware of when starting out in Unreal's C++ environment. Assumes C++ knowledge, just touching on the Unreal specifics.
- [Why C++ In Unreal Engine Isn't That Scary?](https://dev.epicgames.com/community/learning/tutorials/Ml0p/why-c-in-unreal-engine-isn-t-that-scary)  
   "Working with C++ in Unreal Engine might be much easier than you think. It's halfway to the simplicity of custom scripting language."_
- [Epic Coding Standard](https://docs.unrealengine.com/4.27/en-US/ProductionPipelines/DevelopmentSetup/CodingStandard/)  
   Standards and conventions used by Epic Games in the Unreal Engine 4 codebase.
- [Balancing C++ & Blueprint](https://dev.epicgames.com/community/learning/courses/bY/unreal-engine-balancing-blueprint-and-c-in-game-development/LdK/introduction-to-the-course)  
   Epic's take on combining C++ and Blueprint into your project architecture.
- [Unreal Engine Build Tool Guide](https://www.youtube.com/watch?v=j4Sq0FpsmIU)  
   Reuben Ward on "UBT" and how Unreal sits on top of C++. Great to get a deeper understanding of how C++ & Unreal work together.
- [Modules In-depth (Plugins)](https://www.notion.so/Modules-024fcf3439c34c7085faada2ebf52b14)  
   The most in-depth video I've seen about Modules.
- [A Better UE\_LOG](https://landelare.github.io/2022/04/28/better-ue_log.html)  
   A neat blog on improving the workflow for logging in C++.

## Blueprint

- [Blueprints vs. C++: How They Fit Together and Why You Should Use Both](https://www.youtube.com/watch?v=VMZftEVDuCE)  
   Finally a good look at comparing Blueprint and C++ and how they work together.
   

## Gameplay Framework

- [The Unreal Engine Game Framework: From int main() to BeginPlay](https://www.youtube.com/watch?v=IaU2Hue-ApI)  
   Very insightful video, will greatly improve your understanding of how and when the game framework runs.
- [Unreal Gameplay Framework Guide for C++](/unreal-engine-gameplay-framework)  
   Primer to understanding Unreal's gameplay classes such as Pawn, Components, GameMode, etc.
- [Actor's Lifecycle](https://docs.unrealengine.com/en-US/ProgrammingAndScripting/ProgrammingWithCPP/UnrealArchitecture/Actors/ActorLifecycle/index.html)  
   A look into how and when Actors get created and which functions get called to make that happen.
- [C++ Save System](/unreal-engine-cpp-save-system)  
   Eventually you'll need to store player progress. This tutorial will get you started writing your own powerful savegame framework.

## For Unity Developers

- [So You're moving to Unreal](https://impromptugames.com/movingtounreal.html)  
   Joe Wintergreen's page dedicated to converting from Unity to Unreal.
- [Unreal Engine for Unity Developers](https://docs.unrealengine.com/en-US/unreal-engine-for-unity-developers/) - Epic Games  
   Absolutely worth a read to understand the differences and similarities before heading out on your own.
- [C++ Complete Guide](/unreal-engine-cpp-guide) - Tom Looman  
   Comprehensive reference guide for Unreal Engine C++. Read it, Bookmark it and use as reference.
- [Unreal Gameplay Framework Guide for C++](/unreal-engine-gameplay-framework) - Tom Looman  
   Unreal has a built-in Gameplay Framework which you really should be using. It's important to understand the core classes and their intended usage.
- [Things I wish I knew coming to Unreal from Unity](https://benui.ca/unreal/unreal-from-unity/) - BenUI  
   Some transition tips from BenUI.

## Performance & Profiling

- [Unreal Art Optimization](https://unrealartoptimization.github.io/book/)  
   Many chapters on profiling and optimizing your game.
- [Aggregating Ticks to Manage Scale in Sea of Thieves](https://www.youtube.com/watch?v=CBP5bpwkO54)  
   One of my favorites from Unreal Fest, show-casing techniques to improve CPU performance.
- [Asset Reduction Tools and Optimization Tips for Load Times and GC](https://bebylon.dev/ue4guide/performance-optimization/asset-size-loading/)  
   Written form of the [Unreal Fest 2018 presentation](https://www.youtube.com/watch?v=Ln8PCZfO18Y) showing off many useful tips and tricks for optimizing your assets.
- [Shader Performance Measurement (why Instruction Count is unreliable)](https://www.youtube.com/watch?v=E82XxlXMJs4)  
   Ben Cloward explains why Unreal's Shader Instruction Count is an unreliable way to measure shader performance.
- [Optimizing The Medieval Game Environment](https://dev.epicgames.com/community/learning/talks-and-demos/585Y/optimizing-the-medieval-game-environment)  
   "Take a look back at Matt Oztalay's series of talks on how he and the team at Quixel optimized the Medieval Game Environment."
- [Expert's Guide To Unreal Engine Performance](https://dev.epicgames.com/community/learning/tutorials/3o6/expert-s-guide-to-unreal-engine-performance)  
   List style article with brief insights into different considerations to make to reach your target framerates.

## Collision & Physics

- [Tech Artist Playbook for Chaos Performance](https://dev.epicgames.com/community/learning/tutorials/KWeX/unreal-engine-a-tech-artist-s-playbook-for-chaos-performance)
   Valuable and practical insight into optimizing Collision & Physics.

## Performance Fun Reads

- [Speeding up the Unreal Editor launch by not spawning 38000 tooltips?](https://larstofus.com/2025/09/02/speeding-up-the-unreal-editor-launch-by-not-spawning-38000-tooltips/)  
   The Editor & Project settings menus may slow down editor starts. An interesting read about the editor performance.

## Materials (Shaders)

- [Shader Performance Measurement (Instruction Count)](https://www.youtube.com/watch?v=E82XxlXMJs4)  
   Ben Cloward explains 3 reasons why instruction count is an unreliable method of judging the performance of a shader.
- [Understanding Shader Permutations](https://udn.unrealengine.com/s/article/Understanding-Shader-Permutations)  
   UDN Article (Licensees only) Understanding shader permutations is essential for workflow and runtime performance.
- [Your Guide to Texture Compression](https://www.techarthub.com/your-guide-to-texture-compression-in-unreal-engine/)  
   It's important to know some basics about texture compression and how it affects performance and visuals, this guide with help you with exactly that.
- [Understanding BCn Texture Compression Formats](https://www.reedbeta.com/blog/understanding-bcn-texture-compression-formats/)  
   I absolutely love this insight into BC texture formats as it helps demystify their differences.

## Tech Art

- [Unreal's Rendering Passes](https://unrealartoptimization.github.io/book/profiling/passes/)  
   A deep dive into how and when a frame is rendered in Unreal's Deferred Rendering pipeline.
- [Creating Portals in Unreal for Psychonauts 2](https://www.youtube.com/watch?v=w-Z1Fx0LvDc)  
   Fantastic talk about the detailed implementation and obstacles of portal rendering.
- [Creating the Art of ABZU](https://www.youtube.com/watch?v=l9NX06mvp2E)  
   Insightful tech talk on underwater (rendering) tricks used for fish, kelp, level design, etc.

## Gameplay Ability System

- [The Truth of The Gameplay Ability System](https://vorixo.github.io/devtricks/gas/)  
   A good read to demystify some of the pros and cons of GAS.
- [KaosSpectrum's Blog on GAS](https://www.thegames.dev/?cat=4)  
    Bunch of articles related to GAS.
- [Why you should be using GameplayTags](/unreal-engine-gameplaytags-data-driven-design/)  
   GameplayTags are heavily used by GAS, but can be used on their own and provide a powerful tagging and context framework.

## Multiplayer

- [Unreal Engine Multiplayer Tips and Tricks](https://wizardcell.com/unreal/multiplayer-tips-and-tricks/)  
   "Good practices to adopt, and bad habits to avoid when doing online multiplayer in Unreal Engine"
- [Networking Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/networking-and-multiplayer-in-unreal-engine)  
   Overview page to tons of important networking replication concepts.
- [How to Understand Network Replication](https://www.youtube.com/watch?v=JOJP0CvpB8w)  
   Alex has some of the best videos, this one is about essential concepts for Multiplayer Programming.
- [Accurately syncing Unreal’s network clock](https://medium.com/@invicticide/accurately-syncing-unreals-network-clock-87a3f9262594)  
   Explains and attempts to reduce the inherit 'desync' of the server time clock due to latency.
- [Reliable vs. Unreliable RPC performance and ordering](https://dev.epicgames.com/documentation/en-us/unreal-engine/replicated-object-execution-order-in-unreal-engine)  
   Just one of those things that's good to know about.
- [Network Emulation - Bad Pings & Packet Loss](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-network-emulation-in-unreal-engine)  
   Playing locally can mislead you into thinking the game is well implemented. Network emulation simulates real world connections with higher pings and packet loss.

## UMG & Slate

- [Common UI Introduction](https://benui.ca/unreal/common-ui-intro/)  
   "Common UI" is a new built-in framework containing common functionality for UI extending basic widgets like Buttons, Text, etc.
- [Connect C++ to UMG Blueprints with BindWidget](https://benui.ca/unreal/ui-bindwidget/)  
   Bindwidget is useful for C++ base widget classes to extend in UMG.
- [Advanced Text Styling with Rich Text Block](https://www.unrealengine.com/en-US/tech-blog/advanced-text-styling-with-rich-text-block)  
   Official blog on the power of Rich Text Block.

## Loading, Saving & Streaming

- [Asset Manager for Data Assets & Async Loading](/unreal-engine-asset-manager-async-loading)  
   Asset Manager provides additional control to loading your content on-demand.
- [Persistent Data Compendium](https://wizardcell.com/unreal/persistent-data/)  
   "Compendium for traveling, disconnecting, and persisting data across such scenarios"

## Editor Extensions

- [GenericGraph - Data structure Plugin](https://github.com/jinyuliao/GenericGraph)  
   Extend the editor for things like quests, dialogue, and progression systems. Provides starting point to build your own.
- [Adding New Asset Types](https://gmpreussner.com/reference/adding-new-asset-types-to-ue4)  
   Extend your pipeline by supporting custom asset types.
- [Custom Details Panels in Unreal Engine (FPropertyEditorModule)](https://codekittah.medium.com/custom-details-panels-in-unreal-engine-fpropertyeditormodule-6fe41ba7c339)  
   Introductory tutorial on setting up a button and details panel.
- [Plugin Creation Resources](https://github.com/Sythenz/UE4-Plugin-Resources)  
   Collection of tutorials on creating plugins, modules, and slate.
- [Editor Visualization Helpers](https://www.stevestreeting.com/2021/09/14/ue4-editor-visualisation-helper/)  
   C++ Tutorial on implementing editor-time helpers to visualize your Actors in the world.

## Sample Projects

- [Action Roguelike](https://github.com/tomlooman/ActionRoguelike)  
   Comprehensive C++ action rpg/roguelike game. Project source for my Unreal Engine C++ Course.

## Localization

- [Unreal UIs and Localization](https://benui.ca/unreal/ui-localization/) \- Ben UI  
   Ben prepares you for localizing your game to prevent future headaches.
- [Industries of Titan Localization Lessons](https://benui.ca/unreal/industries-titan-localization/) - Ben UI  
   Lessons learned from Titan of Industries localization efforts.

## Niagara Particles

- [Particle Sorting Mini Tutorial](https://realtimevfx.com/t/niagara-5-3-sorting-mini-tutorial/24380)  
   Niels explains how Sorting works with Niagara

## Unreal Editor

- [Content Browser 'Search' Syntax Cheat Sheet](https://www.unrealdirective.com/unreal-search-syntax/)  
   The Context Browser allows for complex filtering in the search box.

## People Blogging about Unreal Engine

- [Dr. Elliot](https://www.dr-elliot.com/)  
   C++ and technical articles.

## Misc.

- [UE Tips & Best Practices](https://flassari.notion.site/UE-Tips-Best-Practices-3ff4c3297b414a66886c969ff741c5ba)  
   Collection of Tips & Tricks from Ari, AAA Unreal Dev & Unreal Engine Evangelist.
- [Lessons Learned from a Year of UE4 AAA Development](https://www.youtube.com/watch?v=SGPleVfrPyo)  
   Ari Arnbjörnsson from Housemarque talks us through lessons learned.
- [Classic Tools Retrospective: Tim Sweeney on the first version of the Unreal Editor](https://www.gamasutra.com/blogs/DavidLightbown/20180109/309414/Classic_Tools_Retrospective_Tim_Sweeney_on_the_first_version_of_the_Unreal_Editor.php)  
   Fun throwback to the origins of the Unreal Editor.
- [Async Loading Screens and Transition Levels](https://www.youtube.com/watch?v=ON1_dEHoNDg)  
   Practical talk on asset loading and transitions (Unreal Fest 2019)
- [Six ingredients for a dynamic third-person camera](https://www.unrealengine.com/en-US/tech-blog/six-ingredients-for-a-dynamic-third-person-camera)  
   Daedalic Entertainment shows off their camera system and how it's implemented in Unreal.
- [Pause Game When Window Loses Focus](https://benui.ca/unreal/window-focus-change/)  
   Super easy way to pause your game when alt-tabbed.

## Some Super Niche Tricks

- [How to fix Motion Blur for RTS Games in Unreal](https://haukethiessen.com/how-to-fix-motion-blur-for-rts-games-in-unreal/)  
   Some camera modes might have problems with motion blur, this might be what you need.
- [SteamDeck Plugin](https://github.com/FeralCatDen/SteamDeckPlatform)  
   Make SteamDeck its own 'Platform' to easily configure platform settings & apply scalability quality settings