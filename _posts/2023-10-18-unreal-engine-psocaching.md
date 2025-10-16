---
title: "Setting up PSO Precaching & Bundled PSOs for Unreal Engine"
date: 2023-10-18
categories: 
  - "rendering"
tags: 
  - "performance"
  - "rendering"
  - "unreal-engine"
coverImage: "Thumb_psocaching.jpg"
---

**In recent years DirectX 12 games have gotten a bad rep for shader stutters. The most common issue we see discussed at launch is due to a lack of pre-compiling _Pipeline State Objects_. These PSOs (required by the GPU) need to be compiled on the CPU if not already cached on the local machine and will cause hitches as they may cost anywhere from a few milliseconds to several hundreds of milliseconds to compile before we may continue execution.**

{: .notice--info }
**Update:** A detailed video section on PSO gathering and project configuration is available in my [**Complete Game Optimization for Unreal Engine 5 Course**](https://courses.tomlooman.com/p/unrealperformance)! Feel free to use the written article below or check out the course which covers PSOs and MANY more essential topics for good game performance.

In short, a "PSO" tells the GPU exactly what state is must set itself to before executing certain operations such as drawcalls. This PSO needs to be _compiled_ and is GPU dependent and therefore can't be done ahead of time on certain platforms such as PC. For platforms like Xbox and PlayStation this can be done during Cooking of the project as the hardware is known ahead of time. This explains why certain game releases only suffer from hitch related issues on PC and not consoles.

_"Earlier graphics APIs, such as Direct3D 11, needed to make dozens of separate calls to configure GPU parameters on the fly before issuing draw calls. More recent graphics APIs, such as Direct3D 12 (D3D12), Vulkan, and Metal, support using packages of pre-configured GPU state information, called Pipeline State Objects (PSOs), to change GPU states more quickly._

_Although this greatly improves rendering efficiency, generating a new PSO on-demand can take 100 or more milliseconds, as the application has to configure every possible parameter. This makes it necessary to generate PSOs long before they are needed for them to be efficient."_ - [Source: Docs](https://docs.unrealengine.com/en-US/optimizing-rendering-with-pso-caches-in-unreal-engine/)

## PSO Caching in Unreal Engine

**Since UE 5.1, the engine ships with two systems trying to solve the same problem. [PSO Precaching](https://docs.unrealengine.com/en-US/pso-precaching-for-unreal-engine/) (5.1+) and [Bundled PSOs](https://docs.unrealengine.com/en-US/manually-creating-bundled-pso-caches-in-unreal-engine/) (Since early UE4).** In this article I'll explain both systems and how they currently work together.

The intent as stated by Epic Games is for the new **PSO Precaching** solution to replace the manual PSO gathering (or "bundled PSOs") pipeline entirely. I did not find that coverage is sufficient as of right now (UE 5.3) for a hitchless experience even in a relatively simple test project.

**Update:** Coverage has since improved as we are now in UE 5.6 and issues that I had previously such as Decal Components now have added support for Precached PSOs.

This article will cover an [implementation using **Action Roguelike on GitHub**](https://github.com/tomlooman/ActionRoguelike) to give you the best starting position for your own project. I'll mostly skip what is already covered by the docs including things like the background information on PSOs and how other APIs and platforms handle this. So I'll be focusing on Windows DirectX 12. _You \*really\* should read the available documentation along with this article as it provides additional details on these systems._

This screenshot (Unreal Insights) shows a game running without any handling of PSOs. The result is enormous frame spikes when objects are first seen on screen as the PSO compilation steps stalls the game until the PSO is ready to be sent to the GPU. Here that PSO took 54.1ms to compile, meanwhile the game cannot continue rendering.

![](/assets/images/psocaching_hitches.jpg)
*Unreal Insights without caching, major frame spikes (top) and compilation tasks stalling the game (bottom). Insights bookmarks display when a new PSO is discovered (and its type graphics/compute)*

## PSO Precaching vs. Bundled PSO Cache

The naming of the two systems can be a bit confusing as it goes by a few names in the engine code. The "PSO Precaching" is used for the new automatic runtime "just-in-time" compilation of the PSOs. This system was introduced in 5.1 and is production ready with 5.3 and later.

The original system that shipped for years with UE4 requires manual collection of PSOs by the developer and are _bundled_ with the game executable. These bundled PSOs are then compiled when the game first launches, for example in the main menu. You can call these _Bundled PSOs_ or _Recorded PSOs_. In C++ you may often see it referenced as _ShaderPipelineCache_ in the engine source.

I'll cover the configuration settings and my discoveries for both systems below.

Note: Epic is no longer performing the manual recording step for their PSOs and rely entirely on Precaching. That said, their game has a lot of user generated content which can't use the bundled PSOs. They \*might\* still have their old recorded PSOs included with the installation (unconfirmed).

Fornite's load screen is said to be about 15 seconds longer on first load due to Precaching. Keep in mind that otherwise you would have to compile the bundled PSOs in your main menu. So the moment of compilation has simply moved with Precaching. Precaching also only compiles the PSOs used by the level being loaded where bundled PSOs just compile the entire game unless you apply _[Masking](https://docs.unrealengine.com/en-US/manually-creating-bundled-pso-caches-in-unreal-engine/#partitioningthecache)_.

## How does PSO Precaching work?

[PSO Precaching](https://docs.unrealengine.com/en-US/pso-precaching-for-unreal-engine/) attempts to compile the PSOs ahead of time during the PostLoad() of the object that supports it. This works well for loading screens where the objects won't be rendered yet. For in-game spawning and streaming this may be too late and compilation may not be finished when the object should be rendered on screen. There is a new feature for exactly this issue which can skip the draw call until the PSO is ready.

```
// Skips the draw command which is at a different stage from the Proxy Creation skip below. This may cause artifacts as part of the object could be rendered if split among different commands.
r.SkipDrawOnPSOPrecaching=0 (keep this off, it's no longer recommended by Epic)

// Primary CVAR to enable for precaching (its on component level for "best results")
r.PSOPrecache.ProxyCreationWhenPSOReady=1 (on by default)
```

There are [two modes available](https://docs.unrealengine.com/en-US/pso-precaching-for-unreal-engine/#proxycreationdelaystrategy) for late PSOs. The first is to skip rendering the mesh entirely, the second renders the mesh with the DefaultMaterial instead. It's up to the developer to decide which mode has the least visual popping.

The skip draw is my current best understanding of the system and commands (This article will be updated as I uncover this feature). Here is a quote I could find that may help clarify them.

_"There is an option to skip the draw at command list building as well (r.SkipDrawOnPSOPrecaching) but it still needs to know if the PSO is still compiling or missing. The problem is that if the low level skips the draw that this could lead to visual artifacts (for example certain passes for a geometry have their PSOs compiles while other passes don't). That's why the skip proxy creation is pushed all the way to component level because there we know the PSOs are available for all the passes it needs to correctly render the object."_ - Epic

Make sure you [read the documentation](https://docs.unrealengine.com/en-US/pso-precaching-for-unreal-engine/) as this does a good job of covering a lot of concepts new with PSO Precaching.

## Optional: Get a baseline Insights trace

It's good practice to have a baseline when doing performance testing or other forms of optimization.

Without any changes applied, run the **packaged** game with `-trace=default -clearPSODriverCache` and the Unreal Insights session browser open (_InstallFolder/Engine/Binaries/Win64/UnrealInsights.exe_).

Clearing the PSOs with the specified command is essential because otherwise, the game may load compiled PSOs from a previous session stored by the GPU driver.

If your stalls are severe enough then you may not need Insights for rough comparison testing...I still recommend it either way.

## Enabling PSO Precache

PSO Precaching is very easy to use, you simply add the following to your `DefaultEngine.ini`

```
[/Script/Engine.RendererSettings]
r.PSOPrecaching=1
```

No further preparation is required. When the packaged game loads a level for the first time, you'll notice an increase in load time where it will compile the known PSOs. A second time loading the same level should not see this same increase in load times.

### Stat PSOPrecache

You can get some in-viewport stats if you have validation enabled. You have two CVARs for this:

```
r.PSOPrecache.Validation=2
r.PSOPrecache.Validation.TrackMinimalPSOs=1
```

Display the following stats using the `stat psoprecache` console command.

This stat command is only available in builds without `WITH_EDITOR` compile flag, such as packaged builds. In-editor this command is not available.

![](/assets/images/psocaching_statpsocache.jpg)

### Precaching in Unreal Insights

You can best see the compilation steps in the game's load screen using Unreal Insights. It adds a large number of tasks on worker threads during map loading and may increase the total time it takes when its first loaded by the player. These compiled PSOs do get stored by the GPU drivers meaning the next time you load this level, you won't suffer the same penalty.

To get proper stats here you do need to enable PSO Validation mentioned earlier. Don't forget about `-clearPSODriverCache` to have a clean cache every run.

![](/assets/images/psocaching_insights.jpg)

"_PSOPrecache: Untracked_" in stats and Insights are most likely global shaders and not missed material shaders. You should be able to catch these using Bundled PSOs.

### Combining with Bundled PSOs

While the new system is a great improvement for games running on DX12, it will not catch everything just yet (tested in 5.4, more recent versions continue to improve on the system). If you have this enabled and still notice stutters and have confirmed this is due to PSOs (using Unreal Insights - simply look for the PSO bookmarks) then you can still manually gather the PSOs to fix these particular stutters.

Combining both systems is what I am currently doing in the [Action Roguelike](https://github.com/tomlooman/ActionRoguelike) sample project for the best coverage. Without bundled PSOs I could not get a hitch free experience as of 5.3 since even basic components like DecalComponent are not supported at this time. In UE 5.6 (and possibly earlier versions) they have included additional coverage including UDecalComponent. You can find out by looking in code for things such as `UDecalComponent::PrecachePSOs()`.

## How to setup Bundled PSOs?

For [bundled PSOs the official documentation](https://docs.unrealengine.com/en-US/manually-creating-bundled-pso-caches-in-unreal-engine/) does a pretty decent job to get you started. I won't be repeating many of the things they already cover there and instead just elaborate on the CVARs I discovered, suggestions for capturing PSOs manually and my findings when trying out this system. I am using the same initial set up as the official docs, and modified from there. I'm keeping it brief as I don't want too much overlap.

The configuration steps assume Precaching is **Enabled**. We'll run both systems together.

However, if you just want to confirm Bundled PSOs working properly, it may be easier to first follow along with Precaching **Disabled** as it ensures consistent stutters which is easier to confirm as "fixed" after recording PSOs.

### Setting up the CVARs

Add the following to `DefaultEngine.ini`

```
[DevOptions.Shaders]
NeedsShaderStableKeys=true

[/Script/Engine.RendererSettings]
r.ShaderPipelineCache.Enabled=1
// essentially a light mode to only capture non precachable PSOs (3 CMDs below CAN be skipped for now if you want to run purely on bundled PSOs!)
r.ShaderPipelineCache.ExcludePrecachePSO=1
// Required for ExcludePrecachePSO to know which PSOs can be skipped during recording (-logPSO)
r.PSOPrecache.Validation=2
// Above two only relevant if we want precaching enabled
r.PSOPrecaching=1
r.PSOPrecache.ProxyCreationWhenPSOReady=1
```

And `DefaultGame.ini` (may already be set)

```
[/Script/UnrealEd.ProjectPackagingSettings]
bShareMaterialShaderCode=True
bSharedMaterialNativeLibraries=True
```

### Cook content to generate ShaderStableInfo

After enabling the system, you'll need to cook the game at least once to generate the `.shk` files. They will be added in `ActionRoguelike\Saved\Cooked\Windows\ActionRoguelike\Metadata\PipelineCaches`

Copy the following two `_SM6`.shk files (if supporting SM6, we do in this example) to a folder somewhere on your PC, in the example: [ActionRoguelike/CollectionPSOs/](https://github.com/tomlooman/ActionRoguelike/tree/master/CollectedPSOs)

```
ShaderStableInfo-ActionRoguelike-PCD3D_SM6.shk
ShaderStableInfo-Global-PCD3D_SM6.shk
```

_(copying both \_SM5 and \_SM6 .shk files did crash for me when converting the recorded PSOs later in this process. Luckily we're just interested in setting up SM6 for this example)_

You may need to copy the shader stable files again if you make adjustments to the project's enabled shader permutations. Keep this in mind if you recording conversion step fails at some point in development.

### Record (Some) PSOs

Now we will record some PSOs to file which we can later inject back into our next build. For the example, don't worry about covering every possible material or shader. This process is cumulative and multiple recordings can be merged by the next step in this process.

To verify this process is working for you, remember what you did when "recording" so that you can repeat it at the end and confirm that section no longer stutters.

Launch the packaged game with `-logPSO` as a launch parameter. simplest way is to make a shortcut and add this as in the Target field. I run all my executables with `-clearPSODriverCache` so that I can consistently see stutters and not accidentally use the GPU's driver cache which may contain compiled PSOs from an earlier run.

Quit the game and find the `.rec.upipelinecache` file(s) in `Build/Windows/PipelineCaches/` each run with -logPSO will generate another file that can be copied into our `ActionRoguelike/CollectedPSOs` folder. You don't need to delete old recordings unless you want to start from scratch as they get merged together in the next step using the `ShaderPipelineCacheTools` commandlet.

### Convert Recorded PSOs

The final step in recorded PSOs is to convert the individual recordings into a single `.spc` file that will be used by the cooker whenever the game is packaged again.

You can use the following command template to convert the recorded PSOs: ([View the latest .bat on GitHub](https://github.com/tomlooman/ActionRoguelike/tree/master/CollectedPSOs))

```
E:\Epic\UE_5.3\Engine\Binaries\Win64\UnrealEditor-Cmd.exe -run=ShaderPipelineCacheTools expand E:\GitHub\ActionRoguelike\CollectedPSOs\*.rec.upipelinecache E:\GitHub\ActionRoguelike\CollectedPSOs\*.shk E:\GitHub\ActionRoguelike\CollectedPSOs\PSO_ActionRoguelike_PCD3D_SM6.spc
```

This runs the commandline version of the editor, executes the ShaderPipelineCacheTools commandlet with `expand` command and requires the .shk (shader stable files) copied from a previous step along with all the recordings. Running this commandlet generates _PSO\_ActionRoguelike\_PCD3D\_SM6.spc_ ([see the docs on naming this file](https://docs.unrealengine.com/en-US/manually-creating-bundled-pso-caches-in-unreal-engine/#convertingpsocaches))

Copy the generated _PSO\_ActionRoguelike\_PCD3D\_SM6.spc_ file to [/Build/Windows/PipelineCaches/](https://github.com/tomlooman/ActionRoguelike/tree/master/Build/Windows/PipelineCaches) so it can be used by the cooker the next time the game is packaged.

If you followed along with Precaching enabled, we run this system essentially in a "light" mode where it only captures PSOs not handled by precaching using the following CVARs:

```
r.ShaderPipelineCache.ExcludePrecachePSO=1
// Validation required to know which PSOs can be skipped during -logPSO
r.PSOPrecache.Validation=2
```

### Testing the PSOs

Package the game again, the generated .spc will be included in the build.

Can't stress this enough: When testing PSOs, ALWAYS run with `-clearPSODriverCache` as a launch parameter or you'll believe to have fixed the issue while it simply grabs cached files from the local GPU driver cache.

To confirm caching has worked run the packaged game with Insights using `-trace=default -clearPSODriverCache` or "stat unitgraph" to visualize the stutters in-viewport. Within Insights you can check the Bookmarks or Log and see if there is any new PSOs encountered.

If you load the same level and perform the same gameplay actions as the baseline before making any changes, there should no longer be any PSO related stutters.

Keep in mind that the bundled PSOs need to compile once the game first boots. This starts pretty early in the process, but if you load directly into a level from launch it may not be ready by the time the load screen is complete. Best is to boot into the main menu and confirm the log that compilation started and finished. You can verify this is happening in the log:

```
LogRHI: FShaderPipelineCache::BeginNextPrecompileCacheTask() - ActionRoguelike begining compile.
LogRHI: Display: FShaderPipelineCache starting pipeline cache 'ActionRoguelike' and enqueued 321 tasks for precompile. (cache contains 321, 321 eligible, 0 had missing shaders. 0 already compiled). BatchSize 50 and BatchTime 16.000000.
...
LogRHI: Warning: FShaderPipelineCache ActionRoguelike completed 321 tasks in 0.06s (0.91s wall time since initial open).
```

## Game Example

The full example is available as the [Action Roguelike Project](https://github.com/tomlooman/ActionRoguelike) on GitHub. I'll list the files included for reference below.

`DefaultEngine.ini`

```
[DevOptions.Shaders]
NeedsShaderStableKeys=true

[/Script/Engine.RendererSettings]
r.PSOPrecaching=1
; keep this active for validation with 'stat psocache', Insights AND required for ExcludePrecachePSO cvar
r.PSOPrecache.Validation=2
; additional detail in logging for "stat psocache"
r.PSOPrecache.Validation.TrackMinimalPSOs=1
; settings below for bundled PSO steps to combine with PSO Precache
r.ShaderPipelineCache.ExcludePrecachePSO=1
r.ShaderPipelineCache.Enabled=1
; start up background compilation mode so we can run "hitchless" in a main menu (optional)
r.ShaderPipelineCache.StartupMode=2
```

`DefaultGame.ini`

```
[/Script/UnrealEd.ProjectPackagingSettings]
bShareMaterialShaderCode=True
bSharedMaterialNativeLibraries=True
```

The `/CollectedPSOs/` folder in the project root contains the `Cmd_ConvertPSOs.bat` file to convert the collected `.rec.upipelinecache` files (can be multiple) and needs the .shk files copied from `Saved\Cooked\Windows\ActionRoguelike\Metadata\PipelineCaches` (requires at least one cook after enabling PSO CVARs)

The folder will eventually contain many `.rec.upipelinecache` files as they can be aggregated together by the commandlet. This makes capturing much easier as you need don't run the full game every capture.

The generated `PSO_ActionRoguelike_PCD3D_SM6.spc` file must be copied to `Build/Windows/PipelineCaches` every time it's generated by the commandlet.

You can of course modify your commands to properly automate this to avoid the mistakes of forgetting to place the updated files in the correct folders. I stuck with the exact workflow as suggested by Epic's documentation for this example.

## Automation Suggestions

Handling Bundled PSOs is a lot of work compared to the new PSO Precaching. Therefore we can only hope that it will eventually be replaced entirely saving everyone a ton of work. Until then I'd like to suggest some ideas for streamlining this process as implementing this falls out of the scope of this article.

- Have QA or playtesters with the game with -logPSO, this would ideally automatically upload the generated file to a server to avoid manual work. Make sure they run on different scalability settings too as these will create different PSOs.

- Create a simple spline actor in every level that can do a flythrough to visit all locations. This might not cover everything so keep cinematics and spawnables in mind. Perhaps these cinematics can be triggered as part of the automation after the fly through has completed.

- Have a custom map for PSO gathering. This can contain all your spawnables from gameplay such as items, weapons.

Don't forget to run the game on the low/medium/high/epic Scalability settings for full coverage.

## Additional Notes

The **build configuration does not affect the generated PSOs**. You can use Debug/Development/Shipping build configurations for the cooked game builds to gather the PSOs in your development pipeline.

// Use "Fast" for **loading screens**, "Background" for UI and interactive moments r.ShaderPipelineCache.SetBatchMode pause/fast/background/precompile

You can expose the number of remaining precompiles from Bundled PSOs to display some number or percentage in your main menu:

```cpp
FShaderPipelineCache::NumPrecompilesRemaining()
```

There are many **more CVARs available** in the different PSO related code files:

```
RenderCore/ShaderPipelineCache.cpp
Engine/PSOPrecache.cpp
```

**Niagara** has its own logic and control CVARs for PSOs such as `fx.Niagara.Emitter.ComputePSOPrecacheMode` but I have not worked with any of those settings at this time.

**For UE4 Developers:** Niagara lacks some support for proper PSO coverage. I've been told some users had to backport several commits to improve this PSO handling for UE4.27. For your info and further investigation here are those commits (must be logged in to view):

- [https://github.com/EpicGames/UnrealEngine/commit/15ceb1985fe60b6a0260967511223efc0392bbce](https://github.com/EpicGames/UnrealEngine/commit/15ceb1985fe60b6a0260967511223efc0392bbce)
- [https://github.com/EpicGames/UnrealEngine/commit/b6449bb472ed040924b84394d2ffc427cc407b4c](https://github.com/EpicGames/UnrealEngine/commit/b6449bb472ed040924b84394d2ffc427cc407b4c)
- [https://github.com/EpicGames/UnrealEngine/commit/343ba944233d869b11f6df057c5281f9074adf6e](https://github.com/EpicGames/UnrealEngine/commit/343ba944233d869b11f6df057c5281f9074adf6e) (non-niagara Compute PSOs)

Some further info for those with [UDN access](https://udn.unrealengine.com/s/question/0D54z00007DWBzvCAH/what-is-the-correct-way-to-configure-the-pso-user-cache).

## Important Note for Nvidia GPUs
As of 2 September 2025 - According to Epic, Nvidia driver update will change the PSO file extension which will break the `-clearPSODriverCache` command which is used for clearing your local cache to properly test PSO coverage. This is fixed in UE 5.6 but any versions prior to this will have this issue.

A possible workaround I could think of is to disable your Shader Cache in Nvidia Control Panel directly or apply Epic's fix on your engine build older than 5.6. The patch is available [here](https://github.com/EpicGames/UnrealEngine/commit/f9338b5a0d9d7275425ad08666351c585a91a154). (requires Epic connected GitHub account to view)

## Closing

This article aims to fill some of the knowledge gaps left by the docs and release notes. As Precaching was announced it took me longer than I care to admit before I had it fully working. Partially as its claims are bigger than what it delivers, as the simple project can't seem to reach full coverage with Precaching and \*needs\* the old system for a solid 100% experience. I'm confident this will be addressed and improved in future versions, until then combining both old and new seems like the way to go.

_All feedback on this post is most welcome! I'm sure I've still missed something or might confuse people with certain steps. I want this article to save the time I had to spend figuring this all out._ _(Thankfully 5.3 added more info to help get us started!)_

**Follow me on [Twitter](https://twitter.com/t_looman) and subscribe below for new content!**

## References

- [PSO Precaching](https://docs.unrealengine.com/en-US/pso-precaching-for-unreal-engine/)
- [Bundled PSO Docs](https://docs.unrealengine.com/en-US/manually-creating-bundled-pso-caches-in-unreal-engine/)
- [Example Project (GitHub)](https://github.com/tomlooman/ActionRoguelike)
- [UDN Post "PSO Precache Hitches"](https://udn.unrealengine.com/s/question/0D74z00000DxOfSCAV/detail)
- [UDN Post "Enabling PSO Precaching (Automated PSO caching)"](https://udn.unrealengine.com/s/question/0D54z00009L4IZjCAN/enabling-pso-precaching-automated-pso-caching)
