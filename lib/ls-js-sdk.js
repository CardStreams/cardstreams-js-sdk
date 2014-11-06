"use strict";

//TODO: Re-think how configs are organised
var consumer_key, api_url, api_user, socket_url;

var socket = require("./ext/socket.io-1.1.0");
var glucose = require("ls-glucose");

/**
  * (Public) Function that initialises the SDK setting the configuration object
  * @param config {Object} Configuration object, which accepts following properties:
  *   api_id {String} An API ID (required)
  *   api_key {String} An API Key (required)
  *   api_user {String} User ID (optional)
  *
  * @throws {Error} When any of required config properties is not provided
*/

function init(config) {
  if (!config.consumer_key) {
    throw new Error("consumer_key is not provided");
  } else {
    consumer_key = config.consumer_key;
  }

  // Default URLs to production servers
  api_url = config.api_url || "https://api.lifestreams.com/beta1";
  socket_url = config.socket_url || "https://api.lifestreams.com:5500";
  api_user = config.api_user || null;
}

/**
  * (Public) Calls a Stream Engine API endpoint
  * @param url {String} Endpoint url
  * @param method {String} HTTP request method, enum: POST, GET, PATCH, DELETE
  * @param data {Object} Data to pass with the HTTP request (optional)
  * @param callback {Function} Callback to handle the request response
  *
  * Success:
  * @returns {Function} Callback with response data object
  *
  * Failure:
  * @returns {Function} Callback with object containing error information:
  *   error: XHR Status
  *   message: XHR Status Text
*/
function api(url, method, data, callback) {
  if (typeof data === "function") {
    callback = data;
  }

  var xhr = new XMLHttpRequest();

  url = api_url + url;

  if ("withCredentials" in xhr) {
    xhr.open(method.toUpperCase(), url, true);
  } else if (typeof XDomainRequest !== "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method.toUpperCase(), url);
  } else {
    throw new Error("CORS is not supported by this browser.");
  }

  xhr.setRequestHeader("X-Lifestreams-ConsumerKey", consumer_key);

  if (typeof data !== "function") {
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(JSON.parse(xhr.responseText));
      } else {
        callback({
          error: xhr.status,
          message: xhr.statusText
        });
      }
    }
  };

  xhr.send(JSON.stringify(data));

}

/**
* (Public) Establishes a Socket.io connection with a Realtime Stream
* @param channel {String} Stream channel to connect to
* @param callback {Function} Callback to handle incoming event data
*
* @return {Function} Callback with a stringified JSON request data for a given channel
*/
function subscribe(channel, callback) {
  var io = socket(socket_url, {query: "token=Lifestreams4U"});
  io.on("connect", function() {
    io.emit("join", channel);
    io.on("cardEvent", function(room, data) {
      if (room !== channel) {
        return false;
      }

      callback(data);
    });
  });
}

/**
 * (Private) Create a proxy for syntactic sugar API route methods.
 * @param err {Error} Errback in case of an error
 * @param url {String} Endpoint url
 * @param method {String} HTTP request method, enum: POST, GET, PATCH, DELETE
 * @param data {Object} Data to pass with the HTTP request (optional)
 * @param callback {Function} Callback to handle the request response
 */

function _api(err, url, method, data, callback) {

  if (err) return callback(err);

  api(url, method, data, callback);
}

// Mixin ls-glucose generated methods
var routes = glucose.digest(require("./routes"), _api);

for (var property in routes) {
  if (routes.hasOwnProperty(property)) {
    module.exports[property] = routes[property];
  }
}

// Expose publicly available methods
module.exports.init = init;
module.exports.api = api;
module.exports.subscribe = subscribe;

// Assign module to global "LS" namespace
global.LS = module.exports;