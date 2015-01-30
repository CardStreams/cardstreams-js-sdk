Lifestreams JS SDK
=========

JavaScript SDK provides set of methods and properties to store, manage and retrieve cards in an activity stream/timeline via Lifestreams Technologies Corporation's RESTful API.

Prerequisites
-------------
In order to be able to use the SDK and the API, Application ID and Application Key need to be generated in the Developer Portal.

Installation
-----------
To use the SDK in a browser, please add the following snippet to your HTML page. It should point to the latest, minified build distributed via CDN:

```html
<script src="https://assets.lifestreams.com/developer/js/api.min.js"></script>
```

Alternatively, it can also be bundled with provided build tools in two simple steps executed from the root directory:

1. Install all required NPM packages
```sh
npm install
```

2. Build the package using grunt
```sh
grunt install
```

When done and successful, the whole package will be bundled in */dist* directory and available in both minified and un-minified formats as a standalone browserify package.

Import the SDK on your web page where you want to use Timelines.

```html
<script src="js/ls-js-sdk/api.js"></script>
```

or for the minified version:

```html
<script src="js/ls-js-sdk/api.min.js"></script>
```

You can also use the built version of the SDK included in this repo if you do not wish to clone the repository and build it yourself. It should match the version we maintain on our CDN.

Configuration
-------------
Once the SDK is imported, it will expose a global LS namespace and it needs to be initialised. There are currently two ways to implement the SDK, depending on a usage scenario:

1. Secure implementation with access token.

```javascript
LS.init({
    app_token: "ACCESS_TOKEN"
});
```

To get instructions on how to generate an access token, please refer to [API Documentation link](https://developer.lifestreams.com/docs#!/Lifestreams/oauthGetToken)

2. Implementation with App ID and App Key exposed.

There are times when a securely authenticated implementation is not required, for example when in an intranet or development environment. In those cases, instead of providing a token, the SDK can be initialised by passing an *app_id* and *app_key* directly to the initialisation object:

```javascript
LS.init({
    app_id: "YOUR_3SCALE_APP_ID",
    app_key: "YOUR_3SCALE_APP_KEY"
});
```

Important thing to remember is, when in browser context, that those credentials will be exposed in the application code. It is highly recommended to not follow this approach for public facing solutions.

Additionally, initialisation method accepts the following optional parameters:

| param name | description | type
| --- | --- | --- |
| api_url | API endpoint URL, by default pointing to the latest production instance | String |
| socket_url | Socket endpoint URL, by default pointing to the latest production instance | String |


Usage
-----
## LS.api()
Make an api call to an existing endpoint and handle a response in a callback.
For available endpoints and their parameters please refer to Lifestreams Streaming API documentation.

### Parameters
name | description | type | required
--- | --- | --- | ---
url | An API endpoint name | String | true
method | Http request method | ENUM: GET, POST, PATCH, DELETE | true
data | Data object to pass to an api call | Object | false
callback | A JavaScript callback method to handle the response | Function | true
### Examples
Retrieve a list of timelines

```javascript
LS.api("/timelines", "get", function(response) {
    // do something with a response
    response.forEach(function(item) {
        console.log("Timeline name: " + item.name);
    }):
});
```

Create a new timeline

```javascript
LS.api("/timelines", "post", {
    "name": "My random Timeline name"
}, function(response) {
    if (response.error) {
        // handle error
        console.log(response.error + ": " + response.message);
    } else {
        // handle successful response
        console.log(response.name + " created successfully!"
    }
});
```

## LS.getTimelines()
Retrieve a list of timelines available for authenticated user.

### Parameters
name | description | type | required
--- | --- | --- | ---
callback | A callback to handle errors and response data | Function | true

## LS.getTimeline()
Retrieve information about a timeline.

### Parameters
name | description | type | required
--- | --- | --- | ---
timelineID | A timeline ID string | String | true
callback | A callback to handle errors and response data | Function | true

## LS.createTimeline()
Create a new timeline.

### Parameters
name | description | type | required
--- | --- | --- | ---
data | Create a new timeline. The request body should contain the following properties: *name*: A name or title (not necessarily unique) for the timeline (required); *description*: (optional) A description of the timeline | Object | true
callback | A callback to handle errors and response data | Function | true

## LS.deleteTimeline()
Delete a timeline.

### Parameters
name | description | type | required
--- | --- | --- | ---
timelineID | A timeline ID string | String | true
callback | A callback to handle errors and response data | Function | true

## LS.updateTimeline()
Update a timeline.

### Parameters
name | description | type | required
--- | --- | --- | ---
timelineID | A timeline ID string | String | true
data | The request body can contain the following properties: *name*: A name or title (not necessarily unique) for the timeline; *description*: A description of the timeline | Object | true
callback | A callback to handle errors and response data | Function | true

## LS.getCards()
Obtain cards from a given timeline.

Example:
```javascript
LS.getCards("timelineId", Date.now(), 20, "before", true, true, true, 300, function(response){
    if(!response.error){
        console.log(response);
    }else{
        console.log("error", error);
    }
});
```

### Parameters
name | description | type | required | default
--- | --- | --- | --- | ---
timelineID | A timeline ID string | String | true | -
ts | Timestamp to use as a reference starting point within the timeline. By default, this takes the value of the current timestamp. | Number | false | now() 
limit | Maximum amount of cards to return as a result of the streaming call. | Number | false | 20
direction | Direction to take from the provided starting timestamp. This parameter controls whether to fetch cards from the past, from the future or around the given timestamp. | ENUM: around, before, after | false | around
media_urls | Whether the response should contain publicly accessible URLs to media attached in the cards. Also note the parameter urls_ttl | Boolean | false | false 
preview_urls | Whether the response should contain publicly accessible URLs to media previews in the cards. Also note the parameter urls_ttl | Boolean | false | false 
thumb_urls | Whether the response should contain publicly accessible URLs to media thumbnails in the cards. Also note the parameter urls_ttl | Boolean | false | false 
urls_ttl | Only has effect when media_urls or preview_urls are enabled. This parameter allows to specify for how many seconds the publicly accessible URLs to attached media should remain valid. The TTL counter is independent for each response to a streaming request and starts counting down as soon as the response is produced. The maximum allowable value for this parameter is 86400 (equivalent to 24 hours) | Number | false | 300 |
callback | A callback to handle errors and response data | Function | true | -

## LS.getCardsByQuery()
Obtain cards from a given timeline, based on a query.

Example:
```javascript
LS.getCardsByQuery("timelineId", "query", Date.now(), 20, "before", true, true, true, 300, function(response){
    if(!response.error){
        console.log(response);
    }else{
        console.log("error", error);
    }
});
```

### Parameters
name | description | type | required | default
--- | --- | --- | --- | ---
timelineID | A timeline ID string | String | true | -
query | Query string used to filter through the timeline. This allows for textual search and other filtering. | String | false | -
ts | Timestamp to use as a reference starting point within the timeline. By default, this takes the value of the current timestamp. | Number | false | now()
limit | Maximum amount of cards to return as a result of the streaming call. | Number | false | 20
direction | Direction to take from the provided starting timestamp. This parameter controls whether to fetch cards from the past, from the future or around the given timestamp. | ENUM: around, before, after | false | around
media_urls | Whether the response should contain publicly accessible URLs to media attached in the cards. Also note the parameter urls_ttl | Boolean | false | false
preview_urls | Whether the response should contain publicly accessible URLs to media previews in the cards. Also note the parameter urls_ttl | Boolean | false | false
thumb_urls | Whether the response should contain publicly accessible URLs to media thumbnails in the cards. Also note the parameter urls_ttl | Boolean | false | false
urls_ttl | Only has effect when media_urls or preview_urls are enabled. This parameter allows to specify for how many seconds the publicly accessible URLs to attached media should remain valid. The TTL counter is independent for each response to a streaming request and starts counting down as soon as the response is produced. The maximum allowable value for this parameter is 86400 (equivalent to 24 hours) | Number | false | 300 |
callback | A callback to handle errors and response data | Function | true | -


## LS.getCard()
Retrieve contents of a card.

### Parameters
name | description | type | required
--- | --- | --- | ---
timelineID | A timeline ID string | String | true
cardID | A card ID string | String | true
callback | A callback to handle errors and response data | Function | true

## LS.createCard()
Add card to a timeline.

### Parameters
name | description | type | required
--- | --- | --- | ---
timelineID | A timeline ID string | String | true
data | A data object containing information about a card. | Object | true
callback | A callback to handle errors and response data | Function | true

## LS.updateCard()
Modify contents of a card.

### Parameters
name | description | type | required
--- | --- | --- | ---
timelineID | A timeline ID string | String | true
cardId | A cardID string | String | true
data | A data object containing modified information about a card. | Object | true 
callback | A callback to handle errors and response data | Function | true

## LS.getComments()
Retrieve comments for a given card.

### Parameters
name | description | type | required
--- | --- | --- | ---
timelineID | A timeline ID string | String | true
cardID | A card ID string | String | true
callback | A callback to handle errors and response data | Function | true

## LS.getComment()
Retrieve a single comment.

### Parameters
name | description | type | required
--- | --- | --- | ---
timelineID | A timeline ID string | String | true
cardID | A card ID string | String | true
commentID | A comment ID string | String | true
callback | A callback to handle errors and response data | Function | true

## LS.deleteComment()
Delete a comment.

### Parameters
name | description | type | required
--- | --- | --- | ---
timelineID | A timeline ID string | String | true
cardID | A card ID string | String | true
commentID | A comment ID string | String | true
callback | A callback to handle errors and response data | Function | true

## LS.createComment()
Create a comment and attach it to a given card.
### Parameters
name | description | type | required
--- | --- | --- | ---
timelineID | A timeline ID string | String | true
cardID | A card ID string | String | true
data | A data object containing modified information about a card. | Object | true 
callback | A callback to handle errors and response data | Function | true

## LS.subscribe()
Establish a real time socket connection to be notified about various data events in the API, depending on the channel subscribed. 

### Parameters
name | description | type | required
--- | --- | --- | ---
channel | A socket endpoint name | String | true
callback | A JavaScript callback method to handle the response | Function | true

### Channels and Events
### /cards channel
#### created

Indicates a new card has been created for a given timeline, providing a full JSON object with the card data (see API docs)

Response 200 (application/json)

    [
        {
            "type": "created",
            "data": {
                "_id": "...",
                "groupId": "",
                "createdBy": "",
                "description": "",
                [...]
            }
        }
    ]
    
#### updated

Notifies that a card has been updated. The response contains a full json representation of an updated card, similar to "created" event.

Response 200 (application/json)

        [
            {
                "type": "updated",
                "data": {
                    "_id": "...",
                    "groupId": "",
                    "createdBy": "",
                    "description": "",
                    [...]
                }
            }
        ]
        
#### deleted

Notifies about a deleted card.

Response 200 (application/json)

        [
            {
                "type": "deleted",
                "data": {
                    "cardId": "..."
                }
            }
        ]
        
#### commented

Indicates a new comment has been added to the card. Useful for updating comment counters, read/unread indicators etc

Response 200 (application/json)

        [
            {
                "type": "commented",
                "data": {
                    "commentCount": "",
                    "card": {
                        [...],
                        "comments": [
                            {
                                "createdBy": "",
                                "parentId": "",
                                "content": "",
                                "createdAt": "",
                                "deletedAt": ""
                            }
                        ]
                    }
                }
                
            }
        ]
        
#### commentDeleted

Notifies about a deleted comment, returning card details and a new comment count

Response 200 (application/json)

        [
            {
                "type": "commentDeleted",
                "data": {
                    "commentId": "...",
                    "commentCount": "...",
                    "card": "[...]"
                }
            }
        ]
        
#### liked
When a card is like or disliked, the event informs on the actual number of likes for a given card

Response 200 (application/json)

        [
            {
                "type": "liked",
                "data": {
                    "cardId": "...",
                    "likes": "..."
                }
                
            }
        ]

### Examples
Get notified about new cards.

```javascript
LS.subscribe("/cards/53ea722eecb5669c1d000013", function(ev) {
    // we're only interested in *created* event in this example
    if (ev.type === "created") {
      console.log(ev.data)
    }
});
```

Testing
-------
### Test suite
The SDK comes with a test suite (Jasmine) with a configured Karma runner.
In order to run it in a headless PhantomJS browser, simple run the following grunt task from the root directory:

```sh
grunt test
```

Please modify the karma.conf.js file should you wish to include more runners.

### Coverage
TODO
