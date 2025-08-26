---
title: "Setting up your C++ Unreal Engine development environment"
date: 2025-05-21
last_modified_at: 2025-05-21
categories: 
  - "cpp"
  - "unreal-engine"
tags:
    - "rider"
coverImage: ""
excerpt: ""
---

Today we will install JetBrains Rider for use with Unreal Engine 5 to setup your C++ development environment. These steps are for a fresh machine, with Unreal Engine 5.6 installed. It should work with older and newer versions too, at certain moments Epic will bump the required versions of dependencies that we install today. I’ll do my best to keep these updated.

Note: The steps demonstrated are for Windows.

## Required Software

- JetBrains Rider
- Epic Games Launcher & Unreal Engine 5.0+
- Visual Studio Build Tools (MSBuild)

## Installing JetBrains Rider

Get the latest version of Rider on JetBrain’s website. (https://www.jetbrains.com/rider/download/?section=windows)

You can use the default settings during installation. The most important steps are during the **Visual Studio Build Tools** installation below.

I recommend running Unreal Engine from the Epic Games Launcher at least once so it can install any prerequisites before moving on. Simply click “Launch” on your installed version and let it do its thing. You don’t need to keep it open afterwards.

## Installing Visual Studio Build Tools

You can either install full Visual Studio IDE, but since you want to use Rider for your source code editing you are better off only installing Visual Studio Build Tools instead.

You can use this direct link to download Visual Studio Build Tools or scroll down on the page to look for Visual Studio Build Tools under “Tools for Visual Studio” (scroll down quite a bit).

https://visualstudio.microsoft.com/downloads/

https://aka.ms/vs/17/release/vs_BuildTools.exe

### Required Individual Components

**Unreal Engine C++ Build pipeline requires a very specific set of components to be installed.** So please follow the instructions below carefully. I have also listed some possible errors you may encounter if you did not select the correct components.

For recommended components to install, Epic maintains a list here. I will list all the versions below for Unreal Engine 5.6.

TODO add screenshot of installer with individual components

https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine

Go to “Individual Components” tab and select the following components:

- **Windows 11 SDK (10.0.26100.3916)** or higher
- **.NET Framework 4.8.1 SDK** or higher
- **MSVC v143 - VS 2022 C++ x64/x86 build tools (v14.38-17.8)**

The above versions are for UE 5.6, if you are using a different version check the current list on the official docs. 
https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine

## Creating a C++ Unreal Engine Project

If you don’t have a Unreal Engine C++ project yet, you can create one via the Unreal Project Browser. A blank C++ project is enough, that’s also what we will use as a starting point for the Unreal Engine C++ Course.

- Games > Blank > C++ (right panel)

![](/assets/images/cpp_setup_unrealengine-projectwizard.jpg)

## Opening your C++ Project in Rider

You can open your unreal engine MyProject.uproject file directly into Rider. Either drag-drop the .uproject file into the Rider App or Browse directly to the file from inside rider by clicking “Open” in the main window. 

Note: You don’t need to use any generated solution files (.sln) as with Visual Studio.

After opening the project, Rider will generate the  “unreal engine project model” in the background. You should give Rider some time to process and index the engine files. This may take a while and the indexing will help the autocompletion and navigation of the source files.

## Compile your project

Try to compile your project to ensure all components are installed correctly. In any error occurs, check the Troubleshooting section below.

- Main menu > Build > Build Startup Project

## Optional: Installing RiderLink

You will be prompted when launching Rider with an Unreal Engine project to install RiderLink.

I recommend Installing RiderLink plugin to the Engine. This is a super powerful tool to get information on how your project is using your C++ code such as knowing which Blueprint has changed a variable default or overrides a function.

Find the Notifications tab on the right to optionally install RiderLink to Engine (recommended)

## Optional: Windows Defender Exclusions

Ensure windows defender exclusion are used. The pop-up will appear in bottom-right on first launch. This avoids overhead from Defender constantly scanning your files. Do so at your own risk, but you should have a pretty clear control over your own build output.

## Optional: Recommended Rider Settings

The following settings are recommended personally. They are not required to compile or use Unreal Engine and you should first check to see if you like to keep any of these settings enabled.

## Errors & Troubleshooting

The following errors all require the Visual Studio Installer and selecting the correct components under “Modify”. These errors will not happen if you selected the correct version during the initial installation steps.

TODO: IMAGE OF VS INSTALLER

### Error: No valid Visual C++ toolchain was found

“No valid Visual C++ toolchain was found (minimum version 14.38.33130, preferred version 14.38.33130). Please download and install Visual Studio 2022 17.8 or later and verify that the "MSVC v143 - VS 2022 C++ x64/x86 build tools (v14.38-17.8)" component is selected in the Visual Studio 2022 installation options.”

Steps:

- Go back into your Visual Studio Installer (same name if you have installed Build Tools instead of full Visual Studio).
- Click “Modify” in the Visual Studio Installer, see screenshot above.
- Go to Individual Components
- Search for “MSVC v143 - VS 2022 C++ x64/x86 build tools (v14.38-17.8)”.
    - Read your error message, earlier or later versions of Unreal Engine might require a different version.

### Error: No available Windows SDKs found

Another error you may receive if you try to run the project is “No available Windows SDKs found”, “Windows SDK must be installed in order to build this target.”.

Steps:

- Go back into your Visual Studio Installer (same name if you have installed Build Tools instead of full Visual Studio).
- Click “Modify” in the Visual Studio Installer, see screenshot above.
- Go to Individual Components
- Search for: Windows 10 or 11 SDK (10.0.18362 or Newer)
    - See the docs page on which SDK version is required for your Unreal Engine version. https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine

## Error: Install a version of .NET Framework SDK at 4.6.0 or higher

More errors may occur if you once again try to launch already. “Install a version of .NET Framework SDK at 4.6.0 or higher”, Generating Rider project files will fail with several module errors which all mention to install the .NET Framework SDK.

Steps:

- Go back into your Visual Studio Installer (same name if you have installed Build Tools instead of full Visual Studio).
- Click “Modify” in the Visual Studio Installer, see screenshot above.
- Go to Individual Components
- Search for “.NET Framework 4.8.1 SDK”

## Optional: Installing Editor Symbols for debugging

In order to debug and use breakpoints in the engine source code you need to install the Editor Symbols for debugging in the Epic Launcher. You don’t need this to debug your own code.

Go to Unreal Engine > Library and click the arrow next to launch to select Options. From there you can enable the “editor symbols for debugging”. It takes up a large amount of disk space so you may keep this for another time.