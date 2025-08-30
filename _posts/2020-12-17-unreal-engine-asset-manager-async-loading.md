---
title: "Asset Manager for Data Assets & Async Loading"
date: 2020-12-17
categories: 
  - "bp"
  - "cpp"
tags: 
  - "asset-manager"
  - "blueprints"
  - "cpp"
  - "programming"
  - "tutorial"
  - "ue4"
coverImage: "Blog_Thumb_AssetManager.jpg"
---

## What is Asset Manager?

The Asset Manager in Unreal Engine lets you manage your content with more control over loading/unloading and even allows us to load only specific parts of certain assets.

I recommend reading the [documentation page](https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-management-in-unreal-engine) as I'll try not to repeat too much of what is already explained there. Instead I'll use this article to be more example-driven and from my personal experience.

Your project must define certain classes as Primary Assets (these may often be derived from [PrimaryDataAsset](https://docs.unrealengine.com/en-US/API/Runtime/Engine/Engine/UPrimaryDataAsset/index.html) but can derive from any UObject). These are the assets you will manage and the system will load/unload any referenced content (also known as 'secondary assets') such as meshes and textures. You can turn these 'secondary assets' (Everything is considered a Secondary Asset by default) into Primary Assets by overriding GetPrimaryAssetId() from UObject.h:

```cpp
/**
* Returns an Type:Name pair representing the PrimaryAssetId for this object.
* Assets that need to be globally referenced at runtime should return a valid Identifier.
* If this is valid, the object can be referenced by identifier using the AssetManager 
*/
virtual FPrimaryAssetId GetPrimaryAssetId() const;
```

An example of a _PrimaryAsset_ is an AI configuration asset that holds info about a specific monster along with which Actor to spawn for this AI, some attributes, abilities, and perhaps some UI stuff like name and icon.

Here is an example of a PrimaryAsset with [MonsterData](https://github.com/tomlooman/ActionRoguelike/blob/master/Source/ActionRoguelike/Public/SMonsterData.h) from my ActionRoguelike on GitHub. The use-case is a basic configuration for an AI to be spawned into the world. The actions are its abilities to be granted.

```cpp
UCLASS()
class ACTIONROGUELIKE_API USMonsterData : public UPrimaryDataAsset
{
 GENERATED_BODY()
public:

 UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Spawn Info")
 TSubclassOf<AActor> MonsterClass;
 
 /* Actions/buffs to grant this Monster */
 UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "Spawn Info")
 TArray<TSubclassOf<USAction>> Actions;

 UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category = "UI")
 UTexture2D* Icon;

 FPrimaryAssetId GetPrimaryAssetId() const override
 {
 return FPrimaryAssetId("Monsters", GetFName());
 }
};
```

Another example of a Primary Asset is a Weapon DataAsset that holds variables and soft references such as the weapon Actor Class, damage type, Icon texture, UI Name, Rarity, etc.

If you are looking for a hands-on look, I recommend checking out my [**Action Roguelike** project on GitHub](https://github.com/tomlooman/ActionRoguelike). It contains some **async loading** examples using **Asset Manager**. [ActionRPG](https://docs.unrealengine.com/en-US/Resources/SampleGames/ARPG/index.html) by Epic uses Asset Manager too (but with blocking loads), still useful to see more use-cases on Primary Assets.

## Primary Assets

The Asset Manager in Unreal Engine works through Primary Assets that it loads and unloads per our request. It's similar to soft references in that regard except we use FPrimaryAssetId (a struct with Type and Name) to point to specific assets we wish to load.

You can either use UPrimaryDataAsset or override GetPrimaryAssetId() in any UObject derived class as mentioned earlier to turn it into a Primary Asset. They look very similar code-wise in the MonsterData example earlier.

![](/assets/images/2020-12-04-18_26_09-WarpSquad-Unreal-Editor.jpg)
*Data Asset Examples of 'Mutations' in WARPSQUAD.*

![](/assets/images/2020-12-04-18_26_20-WarpSquad-Unreal-Editor.jpg)
*Data Asset Examples of 'Ship Configurations' in WARPSQUAD.*

### PrimaryDataAsset

DataAsset class already set up to support Asset Manager. These assets will purely hold data and no functional logic. You can include Actor classes to spawn, Abilities to grant, UI names, Icons, etc.

You can think of it as descriptors, to describe the AI minion (hitpoints, abilities to grant, actor class to spawn, behavior tree to use) rather than its actual logic and brains.

### PrimaryAssetId & PrimaryAssetType

PrimaryAsset Id & Type are both glorified FNames and categorize/identify the assets. This is how you will point to specific assets that you want to load, and is similar to soft references you may be used to.

For example, my ships are of type _ShipConfig_ and one of the Ids that point to a specific data asset could look like _ShipConfig:MyPirateShip_. (the Id combines the _Type:Name_) You won't be manually typing each Id, instead you can override the GetPrimaryAssetId on your asset in C++ to handle how you want Ids to be generated/handled. You may just want to return the name of your asset file.

Below is an example implementation of setting up the Id for a DataAsset.

```cpp
FPrimaryAssetId ULZItemData::GetPrimaryAssetId() const
{
    return FPrimaryAssetId(ItemType, GetFName());
}
```

## Asynchronous Loading

This aspect is what I could find the least information on when diving into Asset Manager. So I'd like to share some code examples (also available on [GitHub](https://github.com/tomlooman/ActionRoguelike)) on how to async load your assets.

### C++ Async Loading Example

Loading in C++ works by creating a Delegate with your own set of parameters you wish to pass along with it. In the example below I pass in the loaded Id and a vector spawn location.

```cpp
// Get the Asset Manager from anywhere
if (UAssetManager* Manager = UAssetManager::GetIfValid())
{
    // Monster Id taken from a DataTable
    FPrimaryAssetId MonsterId = SelectedMonsterRow->MonsterId;

    // Optional "bundles" like "UI"
    TArray<FName> Bundles;

    // Locations array from omitted part of code (see github)
    FVector SpawnLocation = Locations[0]; 

    // Delegate with parameters we need once the asset had been loaded such as the Id we loaded and the location to spawn at. Will call function 'OnMonsterLoaded' once it's complete.
    FStreamableDelegate Delegate = FStreamableDelegate::CreateUObject(this, &ASGameModeBase::OnMonsterLoaded, MonsterId, SpawnLocation);
    
    // The actual async load request
    Manager->LoadPrimaryAsset(MonsterId, Bundles, Delegate);
}
```

The OnMonsterLoaded Function once load has completed:

```cpp
void ASGameModeBase::OnMonsterLoaded(FPrimaryAssetId LoadedId, FVector SpawnLocation)
{
    UAssetManager* Manager = UAssetManager::GetIfValid();
    if (Manager)
    {
        USMonsterData* MonsterData = Cast<USMonsterData>(Manager->GetPrimaryAssetObject(LoadedId));

        if (MonsterData)
        {
            AActor* NewBot = GetWorld()->SpawnActor<AActor>(MonsterData->MonsterClass, SpawnLocation, FRotator::ZeroRotator);
        }
    }
}
```

[Example taken from open-source Action Roguelike.](https://github.com/tomlooman/ActionRoguelike/blob/master/Source/ActionRoguelike/Private/SGameModeBase.cpp)

### Blueprint Async Loading Example

Async loading is a bit easier in Blueprint as there is a neat little node available.

![](/assets/images/ue4_blueprintasyncload-900x394.jpg)

The downside of async loading in Blueprint is that we can't pass in additional parameters in our own Delegate as easily as we did in C++ example above where we pass in the FVector for spawn location. You can pass in variables from other pins after the load has completed, but I'm unsure about how these variable values are 'captured' and so should be used with caution as they may have changed since you started the load request a few frames ago.

### Asset Bundles

Asset Bundles can be used to categorize the soft references inside your PrimaryAsset to a specific type or use-case. eg. in-game or menu. Sometimes you only need a small part of an asset to be loaded (eg. when viewing a weapon purely in UI without the Mesh rendered anywhere). You can mark up those variables with _meta = (Asset Bundles = "UI"_) (can be any name you decide) and during the async load request, you may specify to only load 1 or more specific bundles instead of the entire asset when no bundles are specified.

```cpp
UPROPERTY(…, meta = (AssetBundles = "UI"))
TSoftObjectPtr Icon;

/* Optional Action/Ability assigned to Item. Can be used to grant abilities while this item is active/equipped or to simply run item specific functions */
UPROPERTY(…, meta = (AssetBundles = "Actions"))
TArray> ActionClasses;

/* Optional "Weapon" actor and/or world representation of this object if dropped or equipped by a player */
UPROPERTY(…, meta = (AssetBundles = "Actor"))
TSoftClassPtr ActorClass;
```

### Preloading Assets

The Asset Manager allows us to _Preload_ a set of assets before they are needed. One of the benefits of preloading these assets is so we don't end up with a visual delay due to the asynchronous load request if we need the asset to be shown right away. What's more interesting however is how this Preloading behaves compared to simply calling Load a little early. If we were to Load the assets early, and then lose the Handle to those assets, they will remain loaded indefinitely or until we explicitly unload them through the Asset Manager again (requiring that handle to do so).

Preloading on the other hand, allows to bring the assets into memory just in case we'll need it soon. And when we don't, we can simply get rid of the handle and it'll automatically be unloaded again.

- **Load** \- loads the asset and keeps it in memory until explicitly unloaded.

- **Preload** \- loads the asset and unless you later call Load on those same assets, it'll automatically become unloaded if we lose the handle.

The following is example paraphrased from Nick Darnell to explain this concept more clearly:

In the case of a Treasure Chest, you can _Preload_ all the things it would spawn when opened. If you never open it and it gets destroyed, the handle of the preloaded assets will die too. If they were _Loaded_ instead and the actor went away, it would be more difficult to decide to unload since we don't know whether something else needs those assets to still be loaded. The preload takes care of that and knows whether it can safely get rid of them by keeping those two concepts separate. If we decided not to preload nor load anything until opening of the chest, we might end up with a delay before we can visibly shoot out the loot like Fortnite does.

## Asset Manager Configuration

After configuring your Asset Manager it will automatically discover new PrimaryAssets when added. You setup this configuration in the _Project Settings > Asset Manager_.

![](/assets/images/ue4_projectsettings_assetmanager.jpg)
*Example Configuration from WARPSQUAD.*

## What about Streamable Manager?

Asset Manager wraps around the `FStreamableManager`, which is still a manager you can use for non PrimaryAssets. It's not a complete replacement, Asset Manager is just solving a specific problem and management.

## Auditing Assets

Auditing Assets gives you more insight into how your Primary Assets are setup and used.

right-click on an asset in the content browser lets you "Audit Assets...". This gives you some insight into the total size associated with an asset, how often it's used, Ids, Type, etc. Use the buttons at the top to easily filter based on certain criteria.

![](/assets/images/ue4_auditassets-900x323.jpg)
*Audit Assets Window*

## References

- [Asset Manager Documentation](https://dev.epicgames.com/documentation/en-us/unreal-engine/asset-management-in-unreal-engine)
- [Action Roguelike Code Example (GitHub)](https://github.com/tomlooman/ActionRoguelike)
