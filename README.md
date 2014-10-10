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
Once the SDK is imported, it has to be assigned to a namespace.

```js
var Timeline = require("ls-js-sdk");
```

The above sample imports the SDK bundled with browserify and exposes a public api within that namespace. Before it can be used, it needs to be initialised with unique *api_key* and *api_id* mentioned in the Prerequisites section of this document.

```js
Timeline.init({
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