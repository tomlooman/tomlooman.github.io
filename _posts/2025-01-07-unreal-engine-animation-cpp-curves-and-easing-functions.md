---
title: "Animating in C++: Curves and Easing Functions"
date: 2025-01-07
categories: 
  - "cpp"
  - "gameplay"
tags: 
  - "animation"
  - "cpp"
coverImage: "Blog_AnimatingCurves_Small.jpg"
permalink: unreal-engine-animating-cpp-curves-easing-functions
excerpt: TODO
---

There are plenty of ways to animate or interpolate things in Unreal Engine. The skeletal animation tools for example are incredibly powerful, but none of the available tools in Unreal are very lightweight or easy to use in C++. Especially for things that are not even skeletal meshes to begin with such as animating the radius of some gameplay ability, opening a treasure chest, or any other kind of value interpolation to use in your game code.

For a simple use case like opening of a treasure chest, we don't want to use advanced animation tools such as Sequencer, Control Rig, skeletal mesh animations etc. We just want to interpolate between two values, ideally non-linear. For example, with a little bounce and the end or easing in/out of the transition. _(The wobble at the end may be a little subtle in the recording, but it does add a nice touch in-game)_

TODO ADD MISSING VIDEO

In this article I demonstrate a simple animation system implementation that you can expand on with additional features. The source code is available in my [Action Roguelike project](https://github.com/tomlooman/ActionRoguelike) on GitHub ([Direct Link to Implementation Example](https://github.com/tomlooman/ActionRoguelike/blob/89d1e3c5fd9915c3739f944c6fffd744ffc5758a/Source/ActionRoguelike/World/RogueTreasureChest.cpp#L62)). This project is part of my [Unreal Engine C++ Course](https://courses.tomlooman.com/p/unrealengine-cpp?coupon_code=COMMUNITY15), however its source code is open to everyone.

{: .notice--info }
**Note:** This is not a step-by-step tutorial to code along. Instead this article explains the problem of animating in C++, proposes a solution and provides a walkthrough of the source code.

## Problems with Animating in C++

The main issue with animating in C++ is there is no lightweight and simple API to set this up. You will need to do something like tick your Actor or Component every frame. Then apply either some math based animation or a curve asset to sample the next value. There is a lot of boilerplate to set up, especially if you want to disable this tick conditionally (eg. only tick when the animation is active, much like TimelineComponent does).

## What about TimelineComponent?

The TimelineComponent is a pretty cool implementation with a unique Blueprint Node that makes it very easy to setup curve animations in Blueprint. It is not nearly as nice to use in C++, but more importantly it has other issues which we can improve upon. A couple of problems:

- ActorComponent based which adds memory overhead, spawn/initialization cost, and additional garbage collection pressure if you use these a lot
- Registers one new tick per component
- Much better UX for Blueprint usage than C++
- Not available in every context, with it being an ActorComponent (eg. if you want to animate something inside an non-Actor class like a gameplay ability)

![](/assets/images/anim_timeline.png)

The TimelineComponent also doesn't support any math-based animations (easing functions) which we could easily add to our own animation system.

## Writing our Animation Subsystem

Luckily, it is pretty straightforward to create a simple C++ animation system in a Subsystem in Unreal Engine. You could expand the provided sample to include additional easing functions and other math based animations such as spring damping, etc.

All we need to do is have the (tickable) subsystem play the animation for us, pass in some data such as a curve asset or easing function to use along with a callback function (lambda) to call every animation tick. This lambda receives the current animation value that we can apply to whatever we need such as the rotation of the treasure chest lid mesh.

## Animating with Curves

Using Curve Assets lets us trigger and control the animation logic in C++ while allowing a designer in the Unreal Editor to fine-tune the animation. Below is an usage example in the [RogueTreasureChest](https://github.com/tomlooman/ActionRoguelike/blob/master/Source/ActionRoguelike/World/RogueTreasureChest.cpp) to open the "LidMesh" based on the curve animation.

```cpp
URogueCurveAnimSubsystem* AnimSubsystem = GetWorld()->GetSubsystem<URogueCurveAnimSubsystem>();

// Curve Asset, playback rate, lambda to call each animation tick
AnimSubsystem->PlayCurveAnim(LidAnimCurve, 1.f, [&](float CurrValue)
{
    LidMesh->SetRelativeRotation(FRotator(CurrValue, 0, 0));
});
```

If you are unfamiliar with [lambdas](https://en.cppreference.com/w/cpp/language/lambda), they work a little bit like this:

- **\[&\]** captures the values outside the function so they can be accessed inside the lambda. The ampersand captures is the "default capture by reference" for the data used inside the lambda. In our example it is the LidMesh that must be "captured". This can also specify specific variables, which will capture them as a copy instead of by-reference.
- **(float CurrValue)** optional parameter(s), in our case the CurrValue is the value we got out of the curve asset. We use this value to drive the animation.
- **{ ... }** the body, it is the code that runs when calling the lambda inside the animation system.

The Curve Asset would look a little something like this to create a slight wobble at the end.

![](/assets/images/anims_externalcurve.png)

You can create a Curve Asset by right-clicking your Content Browser and selecting the Curve under Miscellaneous. You'll be prompted for the curve type, the system currently supports only float curves.

![](/assets/images/anims_createcurveasset.png)

To edit the curve, use middle mouse click to add new Keys.

The animation subsystem will manage the updates and removes the animation once finished. This alleviates some manual bookkeeping headaches. If you wish to manually Tick the animation anyway, it’s very easy to do so with the following code snippet as an example (taken from [RogueTreasureChest.cpp](https://github.com/tomlooman/ActionRoguelike/blob/master/Source/ActionRoguelike/World/RogueTreasureChest.cpp)):

```cpp
// For manual ticking, you create the struct directly and keep it around, in FActiveCurveAnim* CurveAnimInst;
CurveAnimInst = new FActiveCurveAnim(LidAnimCurve, [&](float CurrValue)
{
   LidMesh->SetRelativeRotation(FRotator(CurrValue, 0, 0));
}, 1.0f);

void ARogueTreasureChest::Tick(float DeltaSeconds)
{
    Super::Tick(DeltaSeconds);

    // Example of manually ticking the animation, may be useful if you need the control and/or manually batch the specific anims
    if (CurveAnimInst && CurveAnimInst->IsValid())
    {
        CurveAnimInst->Tick(DeltaSeconds);
    }
}
```

## Animating with Math (Easing Functions)

Alternatively to Curves, you can animate using math instead. The most common way to animate this way is with easing functions. This provides an even easier way to set up simple animations as you don't even need to create or assign a curve asset in the editor.

Check out this excellent [Easing Functions Cheat Sheet](https://easings.net/) to help visualize the available easing functions.

Easing functions work simply by modifying how the Alpha value in the linear interpolation evolves over time so that it is no longer a linear function. (eg. if you would simply apply DeltaTime to the Alpha every frame).

```cpp
// Example of linear
Alpha += DeltaTime;
FMath::Lerp(A, B, Alpha);
// Example of Ease Out
Alpha += DeltaTime;
float const ModifiedAlpha = 1.f - Pow(1.f - Alpha, Exp);
FMath::Lerp(A, B, ModifiedAlpha);
```

There is a lot to say about easing functions, but I'll instead link to this excellent talk on the subject of animating with math... [Math for Game Programmers: Fast and Funky 1D Nonlinear Transformations](https://www.youtube.com/watch?v=mr5xkf6zSzk)

## Additional Tips & Tricks

### Normalizing Curves

A quick tip is to _consider_ setting up your Curves as normalized between 0.0-1.0 and apply any multiplication in the lambda/callback instead. This lets you re-use curves more easily and gives you a single value to set/tweak rather than shuffling around keys in the curve asset. Make sure that multiplication is exposed to Blueprint in case it needs to be fine tuned.

### Math-based Animations

Unreal's FMath has many more built-in functions to help animate in C++. The implementation example uses `FMath::InterpEaseInOut`, so check out that class (`UnrealMathUtility.h`) for more options or search for `EEasingFunc` as that's the blueprint enum used to access the available easing functions.

### Runtime Curves (FRuntimeFloatCurve)

There is another great curve type available if you don't want to have many individual curve assets in your content folders. The `FRuntimeFloatCurve` type lets you set up the curve data straight inside the details panel! You still have the flexibility to assign a curve asset if you change your mind later.

![](assets/images/anims_runtimefloatcurve.png)

Keep in mind that you'll need to change the animation system slightly as it currently does not accept this type of curve. You could either overload the Play() function on the subsystem to support that type (and may require a new struct to hold its data). Alternatively you could try to store the animations using `FRichCurve*` instead as that's the type inside of these curve classes that actually holds the keyframe data including `FRuntimeFloatCurve`, `UCurveFloat`, `UCurveVector`, `UCurveLinearColor`.

## Closing

There is a lot more to implement in this current version such as looping, ping-pong playback, different value types (such as supporting Vectors and Colors). I will leave that up to you for now, maybe if you see this article in the future the subsystem will have be expanded already! The subsystem is good enough to handle my use case which is to animate the opening of a treasure chest using C++. I've applied it to a few other places as well to test it further such as growing and shrinking the black hole projectile's radius of influence.

Be sure to checkout the [Action Roguelike project on GitHub](https://github.com/tomlooman/ActionRoguelike) as it contains a lot more interesting C++ based systems to explore! If you’re interested to learn C++ game programming from me, check out my [Unreal Engine C++ Course](https://courses.tomlooman.com/p/unrealengine-cpp?coupon_code=COMMUNITY15)! And don’t forget to subscribe to my newsletter below for more Unreal Engine articles.

## References

- [Implementation Example Source Code](https://github.com/tomlooman/ActionRoguelike/blob/89d1e3c5fd9915c3739f944c6fffd744ffc5758a/Source/ActionRoguelike/World/RogueTreasureChest.cpp#L62) available on GitHub
- [Math for Game Programmers: Fast and Funky 1D Nonlinear Transformations](https://www.youtube.com/watch?v=mr5xkf6zSzk) Love talks by Squirrel, this one gives a lot of insight of using curves from math for animating stuff in game
- [Easing Functions Cheat Sheet](https://easings.net/) It helps to visualize those easing functions
- [Huge resource on Easing function implementations](https://github.com/Michaelangel007/easing) if you wish to deep dive easing functions
- [Fresh Cooked Tweens - GitHub project by Jared Cook](https://github.com/jdcook/fresh_cooked_tweens) Excellent resource to look for a more complete implementation
