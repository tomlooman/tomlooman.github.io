---
title: "Setting up Rider for C++ and Unreal Engine"
date: 2026-02-13
last_modified_at: 2026-02-13
categories: 
  - "C++ Programming"
tags:
    - "C++"
    - "Tutorial"
    - "JetBrains Rider"
    - "Courses"
    - "Getting Started"
    - "Beginner"
coverImage: "Thumb_Blog_SetupCPPRider.jpg"
excerpt: "Installing and configuring JetBrains Rider for Unreal Engine C++ programming requires a very specific set of components. This guide will help you make this setup process go smoothly."
---

In this article we will install **JetBrains Rider** for use with **Unreal Engine 5** to setup your **C++ development environment**. These steps are for a fresh machine, with Unreal Engine 5.6 installed. It should work with older and newer versions too, at certain moments Epic will bump the required versions of dependencies that we install today.

{: .notice--info }
**Note:** The steps demonstrated are for Windows & JetBrains Rider. **Please read this article carefully** as each component requires specific versions depending on the Unreal Engine version you are using. Any wrong version or missing component and the code will fail to compile.

![](/assets/images/jetbrains_rider_logo_250.png){: .align-right }

## Required Software

- [JetBrains Rider](https://www.jetbrains.com/rider/download/?section=windows)
- [Epic Games Launcher](https://www.unrealengine.com/en-US/download) and Unreal Engine 5.0+ installed
- [Visual Studio Build Tools (MSBuild)](https://visualstudio.microsoft.com/downloads/) or [direct link to vs_BuildTools.exe](https://aka.ms/vs/17/release/vs_BuildTools.exe)

## Installing JetBrains Rider

Get the latest version of [Rider for Windows](https://www.jetbrains.com/rider/download/?section=windows) on JetBrains website. You can use the **default settings** during installation. The most important steps are during the **Visual Studio Build Tools** installation below.

If you are installing JetBrains Rider to follow along with my [Unreal Engine C++ Course](https://courses.tomlooman.com/p/unrealengine-cpp?coupon_code=COMMUNITY15), you can select the Free license ("Rider Non-commercial") as you are a student using it for educational purposes.

{: .notice--info }
I recommend **running Unreal Engine** from the Epic Games Launcher **at least once so it can install any prerequisites** before moving on. Simply click "Launch" on your installed version and let it do its thing. You don't need to keep it open afterwards.

## Installing Visual Studio Build Tools

You can either install full Visual Studio IDE, but since you want to use Rider for your source code editing you are better off only installing **Visual Studio Build Tools** instead.

You can use this [direct link to download Visual Studio Build Tools](
https://aka.ms/vs/17/release/vs_BuildTools.exe) or scroll down on the page to look for [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/) under "Tools for Visual Studio" (scroll down quite a bit).

### Required Individual Components

Unreal Engine C++ build pipeline **requires a very specific set of components to be installed.** Please follow the instructions below carefully. I have also listed some possible errors you may encounter if you did not select the correct components.

For a list of recommended components to install, Epic maintains a list [here](https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine). I will list all the versions below for Unreal Engine 5.6.

![](/assets/images/visualstudioinstaller_individualcomponents.png)
*A very specific set of components in their correct version must be selected for Unreal Engine to compile correctly.*

Go to "Individual Components" tab in the Visual Studio Installer and select the following components:

- **Windows 11 SDK (10.0.26100.3916)** or higher
- **.NET Framework 4.8.1 SDK** or higher
- **MSVC v143 - VS 2022 C++ x64/x86 build tools (v14.38-17.8)**

The above versions are for UE 5.6, if you are using a different version check the [current list](https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine) on the official docs. 

## Creating a C++ Unreal Engine Project

If you don't have a Unreal Engine C++ project yet, you can create one via the **Unreal Project Browser**. A blank C++ project is enough, that is what we will use as a starting point for the [Unreal Engine C++ Course](https://courses.tomlooman.com/p/unrealengine-cpp?coupon_code=COMMUNITY15). Try compiling the blank project inside Rider to see if everything is set up correctly.

- **Games > Blank > C++ (right panel)**

![](/assets/images/cpp_setup_unrealengine-projectwizard.jpg)

## Opening your C++ Project in Rider

You can open your unreal engine `MyProject.uproject` file directly into Rider. Either drag-drop the `.uproject` file into the Rider App or Browse directly to the file from inside rider by clicking "Open" in the main window. 

{: .notice--info }
**Note:** You don't need to use any generated solution files (.sln) as with Visual Studio. It is recommended to only use the uproject file for Rider as this causes fewer issues and automatically syncs any changes made to project structure.

After opening the project, Rider will generate the  "Unreal Engine Project Model" in the background. You should give Rider some time to process and index the engine files. This may take a while and the indexing will help the autocompletion and navigation of the source files.

## Compile your project

Try to compile your project to ensure all components are installed correctly. In any error occurs, check the **Troubleshooting section** below.

- **Main menu > Build > Build Startup Project**

![](/assets/images/jetbrains_hamburger_mainmenu.png)
*Access the main menu in the top-left*

![](/assets/images/jetbrainsrider_mainmenu_buildproject.png)
*Select Build Startup Project (which should be your game project) to verify the installation has succeeded.*

## Errors & Troubleshooting

The following errors all require the **Visual Studio Installer** and selecting the specified components under "Modify". These errors will not happen if you selected the correct component versions during the initial installation steps.

![](/assets/images/visualstudioinstaller.png)
*Even when installing JetBrains Rider, the Visual Studio installer is still an important part of the overall setup.*

### Error: No valid Visual C++ toolchain was found

Error message: *"No valid Visual C++ toolchain was found (minimum version 14.38.33130, preferred version 14.38.33130). Please download and install Visual Studio 2022 17.8 or later and verify that the "MSVC v143 - VS 2022 C++ x64/x86 build tools (v14.38-17.8)" component is selected in the Visual Studio 2022 installation options."*

**Steps:**

- Go back into your Visual Studio Installer (same name if you have installed Build Tools instead of full Visual Studio).
- Click "Modify" in the Visual Studio Installer, see screenshot above.
- Go to Individual Components
- Search for "MSVC v143 - VS 2022 C++ x64/x86 build tools (v14.38-17.8)".
    - Read your error message, earlier or later versions of Unreal Engine might require a different version.

### Error: No available Windows SDKs found

Another error you may receive if you try to run the project is "No available Windows SDKs found", "Windows SDK must be installed in order to build this target.".

**Steps:**

- Go back into your Visual Studio Installer (same name if you have installed Build Tools instead of full Visual Studio).
- Click "Modify" in the Visual Studio Installer, see screenshot above.
- Go to 'Individual Components'
- Search for: Windows 10 or 11 SDK (10.0.18362 or Newer)
    - See the [documentation page on which SDK version](https://dev.epicgames.com/documentation/en-us/unreal-engine/setting-up-visual-studio-development-environment-for-cplusplus-projects-in-unreal-engine) is required for your Unreal Engine version.

### Error: Install a version of .NET Framework SDK at 4.6.0 or higher

More errors may occur if you once again try to launch already. "Install a version of .NET Framework SDK at 4.6.0 or higher", Generating Rider project files will fail with several module errors which all mention to install the .NET Framework SDK.

**Steps:**

- Go back into your Visual Studio Installer (same name if you have installed Build Tools instead of full Visual Studio).
- Click "Modify" in the Visual Studio Installer, see screenshot above.
- Go to Individual Components
- Search for ".NET Framework 4.8.1 SDK"

## Installing RiderLink

You will be prompted when launching Rider with an Unreal Engine project to install RiderLink.

I recommend Installing RiderLink plugin to the Engine. This is a super powerful tool to view information on how your project and Blueprint is using your C++ code such as knowing which Blueprint has changed a variable default or overrides a function.

Find the Notifications tab on the top-right to install RiderLink to Engine (recommended)

## Windows Defender Exclusions

Ensure windows defender exclusion are used. The pop-up will appear in bottom-right on first launch. This avoids overhead from Defender constantly scanning your files. Do so at your own risk, but you should have clear control over your own build output.

![](/assets/images/jetbrainsrider_exclusionrules.jpg)
*If you previously ignored the pop-up, you can still find it inside the Notifications Tab in the top-right.*

## Installing Editor Symbols for debugging (Optional)

In order to debug and use breakpoints in the **engine source code** (You don't need this to debug your own game code) you need to install the **Editor Symbols for debugging in the Epic Games Launcher**.

In the Epic Games Launcher, go to `Unreal Engine > Library` and click the arrow next to launch to select Options. From there you can enable the "Editor symbols for debugging". It takes up a large amount of disk space so you may keep this for another time.

![](/assets/images/epicgameslauncher_installationoptions.png)
*The options can be used to modify your engine installation.*

![](/assets/images/epicgameslauncher_installationoptions_editorsymbols.png)
*Debugging Symbols can take up to 50GB of disk space (download size is significantly less).*

## Optional: Recommended Rider Settings

The following settings are recommended personally. They are not required to compile or use Unreal Engine and you should first check to see if you like to keep any of these settings enabled.

Settings can be accessed in the top-left under **File > Settings**.

### Indexing Plugins

By default "Plugins" may not be indexed. Once you get deeper into the engine source I would recommend to enable this or they won't show up in searches either. I find myself often browsing the engine source code, and even modules such as Niagara particle system is a Plugin and therefore not indexed by default. This does add processing overhead, but it should be worthwhile.

![](/assets/images/jetbrainsrider_indexplugins.png)
*Enable indexing of Plugins for have better coverage of the engine source code.*

![](/assets/images/jetbrainsrider_nonindexplugins.png)
*Without Plugin indexing, certain parts of the engine won't have any highlighting and do not show up in searches.*

### Preference: Reduce Parameter Popup Delay

By default the function parameter info popup is delayed by 1000ms. I find this too slow and can actually be changed. Tune this to something that feels more responsive.

![](/assets/images/jetbrains_functionparameterinfo.png)
*The parameter info popup is this little window when you start typing function parameters.*

![](/assets/images/jetbrainsrider_parameterinfodelay.png)
*Change it to something less than 1000ms. All the way down to 0ms if you prefer no delay at all.*

### Preference: Turn off "Reader Mode"

Reader Mode enables "rendered comments" which does provide much nicer looking function comments in header files. The problem is they can take a bit of time to actually render as intended, showing the standard comments when first opening the file. I prefer this off, keeping it consistent and not popping halfway through reading a comment. For Unreal Engine this applies only to the engine source, your own code does not apply the reader mode.

![](/assets/images/jetbrainsrider_readermode_renderedcomments.png)

### Preference: Turn off "Code Folding" on Imports

Code folding can automatically **collapse the list of #includes** ("Imports") at the top of the file. You may like it, but I prefer to see this at all times. Especially to make sure its visible during the course lessons to students, but also to keep an eye on no longer used includes so I can remove them (Rider will render them as Grey when nothing uses the include).

**Editor > General > Code Folding > "Imports"**

### Preference: Turn off Full Line completion suggestions

Full line code completions could be very useful, but personally I prefer not to have added cognitive load of checking the suggestions constantly and reasoning whether that's what I intended. More so to avoid any distractions for recording tutorial/course content. Try it out and see whether you like it. Otherwise, you can easily disable it in Rider.

**Editor > General > Inline Completion > "Enable local Full Line completion suggestions"**

![](/assets/images/jetbrainsrider_inlinecodesuggestions.jpg)

### Preference: Turn off Hard Wrap Visual Guide

You can turn off the white line in the text editor that is called the Hard Wrap. This is where code will wrap during formatting and code generation. You can turn off the visual style under **Editor > General > Appearance > "show hard wrap and visual guides"**. To actually disable the hard wrap behavior itself, it can be found in the Code Style as "Hard Wrap".

### Preference: Removing buttons from the Toolbar

To keep a clean an minimalist UI I prefer to remove any buttons I won't be using. In my case that includes things like JetBrains AI and Code with Me. But you may of course wish to keep those and remove some others. You can simply **right-click the toolbar and click "Customize Toolbar".**

### Setting your HotKeys & Theme

During my tutorials and courses I use the **Visual Assist keymap** and visual theme. You are of course free to pick whatever you are most comfortable with coming from any particular source code editor prior to using Rider.

## Closing

{: .notice--danger }
**Having Trouble?** If you had any issues during the setup process that were unclear or not covered in this article. Let me know through my [contact form](/contact) and I will see if I can update the article.

If you are one of my students, you are now ready to follow along with my [Unreal Engine C++ course](https://courses.tomlooman.com/p/unrealengine-cpp?coupon_code=COMMUNITY15)! You might also be interested in checking out my [Complete Guide to Unreal Engine C++](/unreal-engine-cpp-guide) article as a companion reference and introductory guide to many of the important concepts to programming within Unreal Engine 5.