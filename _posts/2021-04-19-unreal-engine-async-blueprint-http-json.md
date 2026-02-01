---
title: "Creating Latent Blueprint Nodes"
date: 2021-04-19
categories: 
  - "C++ Programming"
tags: 
  - "blueprints"
  - "cpp"
  - "unreal-engine"
coverImage: "ws_mainmenu_motd.jpg"
sidebar:
    nav: sidebar-cpp
---

For my upcoming game [_WARPSQUAD_](https://store.steampowered.com/app/764710), I was curious how easy it is to fetch data from a web service to be displayed in-game. The initial use case is a simple Message of the Day (MOTD) to be displayed in the main menu. Allowing for easy communication with players during playtests or (service) issues. You could use such web interfacing for posting in-game feedback too or whatever data you want to keep outside of the game executable to update on the fly.

![](/assets/images/ws_mainmenu_motd.jpg)

![](/assets/images/ws_asyncblueprintnode_motd.jpg)

This short tutorial will hit on two main subjects that you can use separately. First, how to set up async (latent) Blueprint Nodes in C++ that can be used for any number of things that may run over multiple frames such as web services (A built-in use case is async loading of assets) Secondly I'll show a simple HTTP Request to "GET" JSON data from a web page.

## Prepare your JSON Data

Here is an example JSON in the simplest format, a single key-value pair.

```cpp
{
   "MOTD" : "Message of the day!\nYou could insert all sorts of markup and use UMG RichTextBox for detailed formatting."
}
```

This should be hosted somewhere on your web service such as "_https://tomlooman.com/games/YourGame.json_". Use the same URL in-game to retrieve the data.

## Prepare your Project

In your _MyProject.build.cs_ file add the following modules: _"HTTP", "Json"_ to your _PublicDependencyModuleNames_

Create a new C++ Class derived from **UBlueprintAsyncActionBase** this allows us to easily create simple latent nodes.

For the HTTP request you'll need the following #includes in your newly created .cpp file:

```cpp
#include "Runtime/Online/HTTP/Public/HttpModule.h"
#include "Interfaces/IHttpRequest.h"
#include "Interfaces/IHttpResponse.h"
```

## The Code

The node requires a few elements to function, with Unreal converting it to the complex node automatically. The _Activate()_ function performs the request and sets up the callback once our request has completed. The static function is the Blueprint node and instantiates a new _Action_ that handles the logic. Finally, the event delegate is required to create the async output wire in the blueprint node along with the data pins (in the example below its _FString MOTD_ and _bool bSuccess_ that are both created as output data pins)

Header:

```cpp
// Event that will be the 'Completed' exec wire in the blueprint node along with all parameters as output pins.
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnHttpRequestCompleted, const FString&, MOTD, bool, bSuccess);

UCLASS() // Change the _API to match your project
class MYPROJECT_API ULZAsyncAction_RequestHttpMessage : public UBlueprintAsyncActionBase
{
	GENERATED_BODY()

protected:

	void HandleRequestCompleted(FString ResponseString, bool bSuccess);

public:

	/** Execute the actual load */
	virtual void Activate() override;

	UFUNCTION(BlueprintCallable, meta = (BlueprintInternalUseOnly = "true", Category = "HTTP", WorldContext = "WorldContextObject"))
	static ULZAsyncAction_RequestHttpMessage* AsyncRequestHTTP(UObject* WorldContextObject, FString URL);

	UPROPERTY(BlueprintAssignable)
	FOnHttpRequestCompleted Completed;

	/* URL to send GET request to */
	FString URL;
};
```

Class:

```cpp
void ULZAsyncAction_RequestHttpMessage::Activate()
{
	// Create HTTP Request
	TSharedRef<IHttpRequest, ESPMode::ThreadSafe> HttpRequest = FHttpModule::Get().CreateRequest();
	HttpRequest->SetVerb("GET");
	HttpRequest->SetHeader("Content-Type", "application/json");
	HttpRequest->SetURL(URL);

	// Setup Async response
	HttpRequest->OnProcessRequestComplete().BindLambda([this](FHttpRequestPtr Request, FHttpResponsePtr Response, bool bSuccess)
		{
			FString ResponseString = "";
			if (bSuccess)
			{
				ResponseString = Response->GetContentAsString();
			}

			this->HandleRequestCompleted(ResponseString, bSuccess);
		});

	// Handle actual request
	HttpRequest->ProcessRequest();
}

void ULZAsyncAction_RequestHttpMessage::HandleRequestCompleted(FString ResponseString, bool bSuccess)
{
	FString OutString;
	if (bSuccess)
	{
		/* Deserialize object */
		TSharedPtr<FJsonObject> JsonObject = MakeShareable(new FJsonObject());
		TSharedRef<TJsonReader<TCHAR>> JsonReader = TJsonReaderFactory<>::Create(ResponseString);
		FJsonSerializer::Deserialize(JsonReader, JsonObject);

		// The simplest example parsing of the plain JSON.
		// Here you can expand to fetch your specific layout of values and objects and return
		// it via a UStruct or separate params in the Completed.Broadcast()
		if (!JsonObject->TryGetStringField("MOTD", OutString))
		{
			// While response may be successful, we failed to retrieve the string field
			bSuccess = false;
		}
	}

	Completed.Broadcast(OutString, bSuccess);
}

ULZAsyncAction_RequestHttpMessage* ULZAsyncAction_RequestHttpMessage::AsyncRequestHTTP(UObject* WorldContextObject, FString URL)
{
	// Create Action Instance for Blueprint System
	ULZAsyncAction_RequestHttpMessage* Action = NewObject<ULZAsyncAction_RequestHttpMessage>();
	Action->URL = URL;
	Action->RegisterWithGameInstance(WorldContextObject);

	return Action;
}
```

Blueprint Result:

![](/assets/images/ws_asyncblueprintnode_motd.jpg)

## Closing

That's it! This short tutorial is a bit of a two-in-one as both concepts (latent node, and HTTP/JSON communication) are entirely separate and can be used in many different ways.

JSON is not Blueprint exposed by default in Unreal Engine, there are some (free) Plugins available ([here](https://www.unrealengine.com/marketplace/en-US/product/varest-plugin) and [here](https://www.unrealengine.com/marketplace/en-US/product/json-blueprint)) which can handle everything we just created and much more.

On a localization side note: If you want to localize the (MOTD) text you can provide multiple Keys in your JSON for all supported languages and use the [active language](https://docs.unrealengine.com/en-US/BlueprintAPI/Utilities/Internationalization/GetCurrentLanguage/index.html) in the game to provide to grab the specific language string from the JSON.

For more Unreal Engine Tutorials, [follow me on Twitter](https://twitter.com/t_looman) and subscribe below!
