describe("LS-JS-SDK", function() {
  "use strict";

  var Timeline = require("../../lib/ls-js-sdk");
  var sha1 = require("../../lib/ext/sha1");

  describe("SDK#init", function() {
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

  describe("SDK#api", function(){

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
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("should have a callable api method", function() {
      spyOn(Timeline, "api");
      Timeline.api("/endpoint", "get", function(){});
      expect(Timeline.api).toHaveBeenCalled();
    });

    it("should set request endpoint properly", function() {
      var url = "http://localhost:6100/v2/url";
      var req = jasmine.Ajax.requests.mostRecent();
      expect(req.url).toBe(url);
    });

    it("should set request method properly", function() {
      var req = jasmine.Ajax.requests.mostRecent();
      expect(req.method).toBe("POST");
    });

    it("should pass data object to HTTP request", function() {
      var req = jasmine.Ajax.requests.mostRecent();
      expect(JSON.parse(req.params)).toEqual({test: "test"});
    });

    it("should set Content-type to application/json", function() {
      var req = jasmine.Ajax.requests.mostRecent();
      expect(req.requestHeaders["Content-Type"]).toBe("application/json;charset=UTF-8");
    });

    it("should set the X-Auth-ApiKeyId request header", function() {
      var req = jasmine.Ajax.requests.mostRecent();
      expect(req.requestHeaders["X-Auth-ApiKeyId"]).toBe("53e21090dd574893d4000024");
    });

    it("should set the X-Auth-Timestamp request header", function() {
      var req = jasmine.Ajax.requests.mostRecent();
      expect(req.requestHeaders["X-Auth-Timestamp"]).toBe(Date.now() / 1000 | 0);
    });

    it("should set the signature hash correctly", function() {
      var req = jasmine.Ajax.requests.mostRecent();
      var timestamp = Date.now() / 1000 | 0
      var hash = new sha1("53298519-5d13-454d-99be-4c0fe22ced88" + timestamp, "TEXT");
      expect(req.requestHeaders["X-Auth-Signature"]).toBe(hash.getHash("SHA-1", "HEX"));
    });
  });
});