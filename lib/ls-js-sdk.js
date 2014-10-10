"use strict";

var cfg;
var api_url = "http://localhost:6100/v2";
var socket_url = "http://localhost:5500";

var sha1 = require("./ext/sha1");
var socket = require("./ext/socket.io-1.1.0");

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
  if (!config.api_id) {
    throw new Error("api_id is not provided");
  }
  if (!config.api_key) {
    throw new Error("api_key is not provided");
  }
  cfg = config;
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
  var timestamp = Date.now() / 1000 | 0;
  var hash;

  url = api_url + url;

  if ("withCredentials" in xhr) {
    xhr.open(method.toUpperCase(), url, true);
  } else if (typeof XDomainRequest !== "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method.toUpperCase(), url);
  } else {
    throw new Error("CORS is not supported by this browser.");
  }

  xhr.setRequestHeader("X-Auth-ApiKeyId", cfg.api_id);
  xhr.setRequestHeader("X-Auth-Timestamp", timestamp);

  if(cfg.api_user) {
    hash = new sha1(cfg.api_user + cfg.api_key + timestamp, "TEXT");
    xhr.setRequestHeader("X-Auth-User", cfg.api_user);
  } else {
    hash = new sha1(cfg.api_key + timestamp, "TEXT");
  }

  xhr.setRequestHeader("X-Auth-Signature", hash.getHash("SHA-1", "HEX"));

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

module.exports.init = init;
module.exports.api = api;
module.exports.subscribe = subscribe;