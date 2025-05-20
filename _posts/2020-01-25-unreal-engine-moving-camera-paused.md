---
title: "Moving Unreal Engine Camera While Game Is Paused"
date: 2020-01-25
categories: 
  - "rendering"
  - "unreal-nugget"
tags: 
  - "cpp"
  - "gameplay-framework"
  - "tips-tricks"
  - "tutorial"
  - "ue4"
coverImage: "ue4_pausedscreen.jpg"
---

You can continue to move/rotate your camera while game logic is PAUSED in Unreal Engine. Unfortunately, it's a little obscure to set up so here is a quick overview with C++.

```
PlayerController::bShouldPerformFullTickWhenPaused (true) //  Allows Camera Updates during PlayerController Tick. 
```

```
UWorld::bIsCameraMoveableWhenPaused (true) // Fixes TXAA/MotionBlur glitches.
```

_bIsCameraMoveableWhenPaused_ doesn't actually allow rotation itself but fixes TAA and MotionBlur while paused.

Here is an example of exposing this to Blueprint:

```
void ULZGameplayStatics::SetCameraMoveableWhenPaused(const UObject* WorldContextObject, bool bNewIsMoveable)
 {
     if (ensure(WorldContextObject))
     {
         WorldContextObject->GetWorld()->bIsCameraMoveableWhenPaused = bNewIsMoveable;
     }
 }
```

Finally, make sure your InputEvent related to camera input executes while paused using **ExecuteWhenPaused** checkbox.

![](images/ue4_executewhenpaused-1.jpg)

This checkbox isn't necessary when used inside PlayerController since the FullTick checkbox enables **full** processing of input! (which may be an undesirable side effect, make sure your other PlayerController input is manually blocked as needed using **IsGamePaused**\-node)

That's it! You may need to enable **TickEvenWhilePaused** in whatever Pawn/Actor is performing logic related to your camera input in its Tick function.
