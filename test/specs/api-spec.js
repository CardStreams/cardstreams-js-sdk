describe("LS-JS-SDK", function() {
  "use strict";

  var Timeline = require("../../lib/ls-js-sdk");
  var sha1 = require("../../lib/ext/sha1");
  var TestResponses = require("../helpers/responses");

  describe("SDK package", function() {
    it("should be included as a CommonJS module", function(){
      expect(Timeline).toBeDefined();
    });

    it("should expose a global LS namespace", function() {
      expect(window.LS).toBeDefined();
    });
  });

  describe("SDK#init", function() {

    it("should be a publicly available method", function() {
      spyOn(Timeline, "init");

      Timeline.init({
        api_id: "53e21090dd574893d4000024",
        api_key: "53298519-5d13-454d-99be-4c0fe22ced88"
      });

      expect(Timeline.init).toHaveBeenCalled();
    });

    it("should not throw an Error when configuration object contains API KEY and API ID", function() {

      expect(function() {
        Timeline.init({
          api_id: "53e21090dd574893d4000024",
          api_key: "53298519-5d13-454d-99be-4c0fe22ced88"
        });
      }).not.toThrow();
    });

    it("should throw an Error when api_key is not provided", function() {

      expect(function() {
        Timeline.init({
          api_id: "53e21090dd574893d4000024"
        });
      }).toThrow();
    });

    it("should throw an Error when api_id is not provided", function() {

      expect(function() {
        Timeline.init({
          api_key: "53298519-5d13-454d-99be-4c0fe22ced88"
        });
      }).toThrow();
    });

  });

  describe("SDK#api", function() {

    var req;

    beforeEach(function() {
      jasmine.Ajax.install();

      var callback = function(data) {
        return data;
      };

      var data = {
        "test": "test"
      };

      Timeline.init({
        api_id: "53e21090dd574893d4000024",
        api_key: "53298519-5d13-454d-99be-4c0fe22ced88"
      });

      Timeline.api("/url", "post", data, callback);

      req = jasmine.Ajax.requests.mostRecent();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("should be a publicly available method", function() {
      spyOn(Timeline, "api");
      Timeline.api("/endpoint", "get", function(){});
      expect(Timeline.api).toHaveBeenCalled();
    });

    it("should set request endpoint properly with a default url", function() {
      var url = "https://api.lifestreams.com/v2/url";
      expect(req.url).toBe(url);
    });

    it("should set request endpoint properly with a provided url", function() {
      var url = "https://test/t";

      Timeline.init({
        api_id: "53e21090dd574893d4000024",
        api_key: "53298519-5d13-454d-99be-4c0fe22ced88",
        api_url: "https://test"
      });

      Timeline.api("/t", "get", function(){});

      req = jasmine.Ajax.requests.mostRecent();
      expect(req.url).toBe(url);
    });

    it("should set request method properly", function() {
      expect(req.method).toBe("POST");
    });

    it("should pass data object to HTTP request", function() {
      expect(JSON.parse(req.params)).toEqual({test: "test"});
    });

    it("should pass data as a JSON string", function() {
      expect(function() {
        JSON.parse(req.params)
      }).not.toThrow();
    });

    it("should set Content-type to application/json", function() {
      expect(req.requestHeaders["Content-Type"]).toBe("application/json;charset=UTF-8");
    });

    it("should set the X-Auth-ApiKeyId request header", function() {
      expect(req.requestHeaders["X-Auth-ApiKeyId"]).toBe("53e21090dd574893d4000024");
    });

    it("should set the X-Auth-Timestamp request header", function() {
      expect(req.requestHeaders["X-Auth-Timestamp"]).toBe(Date.now() / 1000 | 0);
    });

    it("should set the signature hash correctly", function() {
      var timestamp = Date.now() / 1000 | 0
      var hash = new sha1("53298519-5d13-454d-99be-4c0fe22ced88" + timestamp, "TEXT");
      expect(req.requestHeaders["X-Auth-Signature"]).toBe(hash.getHash("SHA-1", "HEX"));
    });

    it("should define an onreadystatechange handler", function() {
      var req = jasmine.Ajax.requests.mostRecent();
      expect(typeof req.onreadystatechange).toBe("function");
      expect(req.onreadystatechange).not.toBeNull();
    });

    it("should receive a stringified object on successful response", function() {
      spyOn(req, "onreadystatechange");
      req.response(TestResponses.timeline.success);

      expect(req.onreadystatechange).toHaveBeenCalled();
      expect(req.status).toBe(200);
      expect(req.responseText).toBe("{}");
    });

    it("should pass responseText to a callback", function() {
      var callback = jasmine.createSpy("callback");
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
          callback(this.responseText);
        }
      };

      Timeline.api("/url", "get", callback);
      expect(callback).not.toHaveBeenCalled();

      jasmine.Ajax.requests.mostRecent().response(TestResponses.timeline.success);
      expect(callback).toHaveBeenCalledWith({});
    });

    it("should receive an error object on failed response", function() {
      spyOn(req, "onreadystatechange");
      req.response(TestResponses.timeline.fail);

      expect(req.onreadystatechange).toHaveBeenCalled();
      expect(req.status).toBe(500);
      expect(req.statusText).toBe("Error!");
    });

    it("should pass status and statusText to callback on error", function() {
      var callback = jasmine.createSpy("callback");
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
          callback(this.responseText);
        }
      };

      Timeline.api("/url", "get", callback);
      expect(callback).not.toHaveBeenCalled();

      jasmine.Ajax.requests.mostRecent().response(TestResponses.timeline.fail);
      expect(callback).toHaveBeenCalledWith({error: 500, message: "Error!"});
    });

    it("should overload optional data argument", function() {
      var callback = jasmine.createSpy("callback");
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if (this.readyState === this.DONE) {
          callback(this.responseText);
        }
      };

      // three arguments - data overloaded
      Timeline.api("/test", "get", callback);

      jasmine.Ajax.requests.mostRecent().response(TestResponses.timeline.success);
      expect(callback).toHaveBeenCalledWith({});

      req = jasmine.Ajax.requests.mostRecent();
      expect(req.params).toBe(undefined);

      // four arguments
      Timeline.api("/test", "post", {"test":"test"}, callback);

      jasmine.Ajax.requests.mostRecent().response(TestResponses.timeline.success);
      expect(callback).toHaveBeenCalledWith({});
      req = jasmine.Ajax.requests.mostRecent();
      expect(JSON.parse(req.params)).toEqual({test: "test"});
    });

  });

  describe("SDK#subscribe", function() {

    it("should be a publicly available method", function() {
      spyOn(Timeline, "subscribe");
      Timeline.subscribe("/channel", function(){});
      expect(Timeline.subscribe).toHaveBeenCalled();
    });

  });
});