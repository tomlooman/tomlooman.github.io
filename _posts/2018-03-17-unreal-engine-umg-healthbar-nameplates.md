---
title: "Healthbars and Nameplate Widgets with UMG"
date: 2018-03-17
categories: 
  - "C++ Programming"
  - "User Interface"
tags: 
  - "C++"
  - "UMG"
coverImage: "Thumb_WorldWidgets-copy.jpg"
sidebar:
    nav: sidebar-optimization
---

Today I'd like to quickly show how you can add UI for things like **health bars, nameplates, interaction prompts and more in Unreal Engine**. It's quite simple to do, and I hear a lot of questions about this, so today I'll share you some tricks to make this even easier. The sample code is done in **C++**, but keep reading as I show you a quick **and** easy **Blueprint**\-only trick too! The following guide explains the concept of how to be able to fetch the information you desire for your in-world widgets such as health, player names, etc., you don't need to follow this to the letter, so long as you understand the concept, and implement what suits your own projects best.

To make it easy to get information on what the widget is attached to, we need to help it out a little. By default the UMG Widget has no context on what is it being drawn on top of (it doesn't know which [WidgetComponent](https://docs.unrealengine.com/latest/INT/Engine/Components/Widget/) it belongs to either) this is a problem for us as we have no way to find out what health the actor is at, or what name to display for that specific Actor (in the image below: "Spy" or "Soldier" based on a variable inside the player's Pawn)

In the C++ Implementation below our custom widget component sets the Owner (an Actor) of the WidgetComponent as variable inside our custom UserWidget class so that we have instant access to the owning actor when working on the UI element. This is great for retrieving the health of the Actor we are attached to for example. The C++ snippets below show you how that's done. But first, let's look at the simplest Blueprint implementation to get an understanding of what we're trying to solve in the most basic way.

![](/assets/images/ue4_umg_widgets01.jpg)

## The Simplest Implementation in Blueprint

Not everyone wants to touch C++, and it's not really required. You may also not like the idea of the custom UserWidget base class for your UI elements moving forward (those are will be drawn in the world at least). You could do this in Blueprint too, just a little different. Here is the basic principle of how you could achieve the same result in your Blueprint project in a quick and straight forward manner.

I created a fresh Widget Blueprint, added a variable called OwningActor of type Actor. Now I access the Widget Component on the Actor that will own the Widget (eg. the Player pawn Blueprint from the image above) during BeginPlay, and we get the "User Widget Object" which we need to cast to the correct type. Finally we fill in the OwningActor variable with the Actor "self" and we're done!

![](/assets/images/ue4_itemwidgetsbp03.jpg)

![](/assets/images/ue4_umg_widgets02.jpg)

In the above example we added the widget blueprint to a grenade actor so it can display the information on mouse-over when the player sees it in the world. Look at the end of the post for some more context screenshots in case you're not quite following this yet.

## Preparing your C++ Project

Besides the super easy implementation for Blueprint, you could do the exact same in C++ or you could opt to make your own user widget and WidgetComponent classes, I'll quickly show you how that's done. For C++ to extend UMG, which is what we'll be doing, you will have to prepare your project first. The user "WCode" has Epic Wiki page for exactly that:

**[Required: Extend UserWidget for UMG Widgets](https://nerivec.github.io/old-ue4-wiki/pages/extend-userwidget-for-umg-widgets.html)**

Make sure your project is prepared using the link above, it shouldn't take too long. If you're just interested in the concept and will us Blueprint you don't need to do this.

## The implementation in C++

The following is the code for SActorWidgetComponent and derives from Unreal's WidgetComponent class. The functionality we add here is to set the owning Actor on the SActorWidget class (will be covered in a bit) which is an exposed variable to Blueprint for use in the UMG Editor.

```cpp
URogueActorWidgetComponent::URogueActorWidgetComponent()
{
	// Set common defaults when using widgets on Actors
	SetDrawAtDesiredSize(true);
	SetWidgetSpace(EWidgetSpace::Screen);
	SetCollisionEnabled(ECollisionEnabled::NoCollision);
}

void URogueActorWidgetComponent::InitWidget()
{
	// Base implementation creates the 'Widget' instance
	Super::InitWidget();

	if (Widget)
	{
#if !UE_BUILD_SHIPPING
		if (!Widget->IsA(URogueActorWidget::StaticClass()))
		{
			// Suggest deriving from actor widget (not strictly required, but you lose the benefit of auto-assigning the Actor this way)
			UE_LOG(LogGame, Warning, TEXT("WidgetClass for %s does not derive from SActorWidget"), *GetNameSafe(GetOwner()));
		}
#endif
		URogueActorWidget* WidgetInst = Cast<URogueActorWidget>(Widget);
		if (WidgetInst)
		{
			// Assign the owner, now we have easy access in the widget itself
			WidgetInst->SetOwningActor(GetOwner());
		}
	}
}
```

Here is the header file:

```cpp
/**
 * Extension of the WidgetComponent to make it easy to have owning Actor context to the Widget. Commonly used to display health bars, names, and interaction panels above Actors.
	Automatically calls SetOwningActor on the widget if the correct type of widget is used (ActorAttachWidget)
 */
UCLASS(ClassGroup = (LODZERO), meta = (BlueprintSpawnableComponent))
class LZFRAMEWORK_API URogueActorWidgetComponent : public UWidgetComponent
{
	GENERATED_BODY()
	
public:

	virtual void InitWidget() override;
	
	URogueActorWidgetComponent();
	
};

```

That covers part one, the main element however is the variable we add to the Widget class, which looks like this:

```cpp
void URogueActorWidget::SetOwningActor(AActor* NewOwner)
{
	if (OwningActor == NewOwner)
	{
		// Skip repeated calls
		return;
	}

	OwningActor = NewOwner;

	OnOwningActorChanged.Broadcast(NewOwner);
}
```

And the header:

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnOwningActorChanged, AActor*, NewOwner);

/**
 * Base class for UMG Widgets that belong to a single Actor in the world via a WidgetComponent, eg. for 3D health-bars, nameplate, interaction tooltip.
 */
UCLASS(Abstract)
class LZFRAMEWORK_API URogueActorWidget : public UUserWidget
{
 GENERATED_BODY()

protected:

 /* Actor that widget is attached to via WidgetComponent */
 UPROPERTY(BlueprintReadOnly, Category = "ActorWidget")
 AActor* OwningActor;
 
public:

 /* Set the owning actor so widgets have access to whatever is, broadcasting OnOwningActorChanged event */
 UFUNCTION(BlueprintCallable, Category = "LODZERO|UI")
 void SetOwningActor(AActor* NewOwner);

 UPROPERTY(BlueprintAssignable, Category = "LODZERO|UI")
 FOnOwningActorChanged OnOwningActorChanged;
};
```

That's all the code required to use this in your game project. The main thing to keep in mind is that your in-world widgets should use both these classes for this to work. When you create a new Blueprint class now that derives from SActorWidget you will have the following variable available:

![](/assets/images/ue4_itemwidgets01.jpg)

If you're following along, make sure the Actor has the SActorWidgetComponent instead of the built-in WidgetComponent and assigned your UMG Widget class as your normally would with [WidgetComponents](https://docs.unrealengine.com/latest/INT/Engine/Components/Widget/).

![](/assets/images/ue4_itemwidgets02.jpg)

That's it! This quick little trick should make it a lot easier to display in-world information on Actors. Both a quick and easy Blueprint implementation and a C++ alternative to 'bake this down' if your project so desires.

As always, you can [follow me on Twitter](https://twitter.com/t_looman) and if you have questions or comments you can leave them below!

## References

- [Documentation: Widget Components](https://docs.unrealengine.com/latest/INT/Engine/Components/Widget/)
- [Extend UserWidget for UMG Widgets (Epic Wiki)](https://nerivec.github.io/old-ue4-wiki/pages/extend-userwidget-for-umg-widgets.html)
