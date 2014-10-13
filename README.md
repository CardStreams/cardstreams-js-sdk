Lifestreams JS SDK
=========

JavaScript Http Wrapper provides a set of methods to interact with Lifestreams API in a browser context.

Prerequisites
-------------
In order to be able to use the SDK and the API, access key and api id need to be generated in the API Management Tool [LINK]

Installation
-----------
To use the SDK in a browser, please add the following snippet to your HTML page. It points to the latest, minified build distributed via CDN:

```html
<script src="https://XXXXXXXXXXXXX/api.min.js"></script>
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

When done and successful, the whole package will be bundled in */build* directory and available in both minified and un-minified formats.

Configuration
-------------
Once the SDK is imported, it will expose a global LS namespace and it needs to be initialised with unique *api_key* and *api_id* mentioned in the Prerequisites section of this document.

```javascript
LS.init({
    api_key: "YOUR_API_KEY",
    api_id: "YOUR_API_ID"
});
```

Additionally, initialisation method accepts the following optional parameters:

| Param name | Description |
| --- | --- |
| api_user | A user id, which, if provided informs the backend to consider the given user as logged in. |
| api_url | API endpoint URL, by default pointing to the latest production instance |
| socket_url | Socket endpoint URL, by default pointing to the latest production instance |

Usage
-----
## LS.api()
Make an api call to an existing enpoint and handle a reponse in a callback.
For available endpoints and their parameters please refer to Lifestreams Streaming API documentation.

### Parameters
name | description | required
--- | --- | ---
url | An API endpoint name | true
method | Http request method (GET, POST, PUT, DELETE) | true
data | Data object to pass to an api call | false
callback | A JavaScript callback method to handle the response | true
### Examples
Retrieve a list of timelines

```javascript
LS.api("/timeline", "get", function(response) {
    // do something with a response
    response.forEach(function(item) {
        console.log("Timeline name: " + item.name);
    }):
});
```

Create a new timeline

```javascript
LS.api("/timeline", "post", {
    "name": "My random Timeline name"
}, function(response) {
    if (response.error) {
        // handle error
        console.log(response.error + ": " + response.message);
    } else {
        // handle successful response
        console.log(response.name + " created successfuly!"
    }
});
```
## LS.subscribe()
Establish a real time socket connection to be notified about various data events in the API, depending on the channel subscribed. 

### Parameters
name | description | required
--- | --- | ---
channel | A socket endpoint name | true
callback | A JavaScript callback method to handle the response | true

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