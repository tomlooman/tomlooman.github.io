---
title: "Auto-apply optimal Scalability Settings for Unreal Engine"
date: 2020-04-26
categories: 
  - "rendering"
  - "unreal-nugget"
tags: 
  - "performance"
  - "profiling"
  - "rendering"
  - "tutorial"
  - "ue4"
  - "unreal-engine"
coverImage: "ue4_runhardwarebenchmark.jpg"
---

Unreal Engine can auto-detect 'optimal' (graphical) settings per player based on a quick CPU and GPU benchmark. The functions are available in Blueprint to hook up into your game's options menu.

![](/assets/images/ue4_runhardwarebenchmark.jpg)

Behind the scenes, the benchmark returns a performance index for CPU and GPU with a reference of 100.0 for "average good CPU/GPU". These values are then used to apply a series of scalability options like shadow resolution, texture quality, SSR quality etc.

You can see your own performance index by running the **`SynthBenchmark`** console command. `scalability auto` runs the hardware benchmark and logs the resulting scalability and CPU/GPU scores.

```cpp
// Run benchmark, will freeze game for a bit. Higher workscale increases time it takes to run tests (10 is default and should be used for shipping builds)
UGameUserSettings::RunHardwareBenchmark(int32 WorkScale, float CPUMultiplier, float GPUMultiplier);

// Call after the benchmark to apply settings to running game
UGameUserSettings::ApplyHardwareBenchmarkResults()
```

Settings are applied in _**../MyProject/Saved/Config/Windows/GameUserSettings.ini**_ (ScalabilityGroups)

**Advanced:** (Base)**Scalability**.ini has **PerfIndexThresholds\_**\* under \[**ScalabilitySettings**\] to customize index vs. quality-level per Group.

This should be adjusted (towards the end of the project) to match your project's CPU/GPU demands vs. each of the Quality Settings (Low to Epic). It may require the help of QA with a variety of machines and configurations and retrieve their respective performance scores to match their targetted scalability. (eg. the min-spec machine's score should match the Low scalability threshold)

## References

- [Mathew Wadstein has a video](https://www.youtube.com/watch?v=Czp4g3AFP_k) this benchmark utility.
- [Intel has a Plugin](https://software.intel.com/en-us/articles/cpu-capability-detect-using-unreal-engine-4-19) for more detailed CPU benchmarking using SynthBenchmark
