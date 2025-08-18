---
title: "Simple C++ FPS Template for Unreal Engine"
date: 2017-09-28
categories: 
  - "cpp"
tags: 
  - "cpp"
  - "downloads"
  - "project-template"
  - "ue4"
  - "unreal-engine"
coverImage: "Thumb_FPSTemplate2_small.jpg"
---

As I have been preparing some Unreal Engine C++ tutorials, I wanted to use the Built-in C++ FPS Template that ships with the engine as a base project and found it has VR and Touch-input code in the character class which don't serve any purpose unless you are interested in VR and/or mobile. Since I needed a super simple C++ template to not scare people away from learning this language, I decided to create a simplified version with only the essentials for non-VR projects (That's what you have the [VR Template](https://www.tomlooman.com/vrtemplate/) for these days) and make it available to all on [GitHub](https://github.com/tomlooman/SimpleFPSTemplate).

To give you an idea of the changes I made, the Character class is about 1/3 the size in code compared to the built-in FPS Template with the same functionality and several unnecessary coding concepts stripped out (such as a few UPROPERTY meta keywords you don't need to know as a newbie). The purpose of all this is to make it less intimidating to start using C++ with Unreal Engine.

[**Project Source at GitHub**](https://github.com/tomlooman/SimpleFPSTemplate)

You may also be interested in some of my other [C++ Tutorials](https://www.tomlooman.com/unreal-engine-cpp-tutorials/) such as [Using Timers in C++](https://www.tomlooman.com/unreal-engine-cpp-timers/) or my [C++ Complete Guide](https://www.tomlooman.com/unreal-engine-cpp-guide/)!

[![](/assets/images/Thumb_FPSTemplate2.jpg)](https://github.com/tomlooman/SimpleFPSTemplate)
