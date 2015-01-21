describe("LS-JS-SDK", function() {
  "use strict";

  var Timeline = require("../../lib/ls-js-sdk");
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
        app_id: "91312294",
        app_key: "9fce4bb6bc33d780002fda854e6aaa03"
      });

      expect(Timeline.init).toHaveBeenCalled();
    });

    it("should not throw an Error when configuration object contains APP Key and APP ID", function() {

      expect(function() {
        Timeline.init({
          app_id: "91312294",
          app_key: "9fce4bb6bc33d780002fda854e6aaa03"
        });
      }).not.toThrow();
    });

    it("should throw an Error when app_key is not provided", function() {

      expect(function() {
        Timeline.init({
          app_id: "91312294"
        });
      }).toThrow();
    });

    it("should throw an Error when app_id is not provided", function() {

      expect(function() {
        Timeline.init({
          app_key: "9fce4bb6bc33d780002fda854e6aaa03"
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
        app_id: "91312294",
        app_key: "9fce4bb6bc33d780002fda854e6aaa03"
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
      var url = "https://api.lifestreams.com/beta1/url";
      expect(req.url).toBe(url);
    });

    it("should set request endpoint properly with a provided url", function() {
      var url = "https://test/t";

      Timeline.init({
        app_id: "91312294",
        app_key: "9fce4bb6bc33d780002fda854e6aaa03",
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

    it("should set the X-Lifestreams-3scale-AppId request header", function() {
      expect(req.requestHeaders["X-Lifestreams-3scale-AppId"]).toBe("91312294");
    });

    it("should set the X-Lifestreams-3scale-AppKey request header", function() {
      expect(req.requestHeaders["X-Lifestreams-3scale-AppKey"]).toBe("9fce4bb6bc33d780002fda854e6aaa03");
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

  describe("Glucose mixins", function() {

    var callback = function(err, data) {
      if (!err) {
        return data
      } else {
        throw err;
      }
    };

    var data = {};

    it("should provide getTimelines method", function() {
      spyOn(Timeline, "getTimelines").and.callThrough();
      Timeline.getTimelines(callback);
      expect(Timeline.getTimelines).toHaveBeenCalled();
      expect(Timeline.getTimelines).toHaveBeenCalledWith(jasmine.any(Function));
      expect(function() {
        Timeline.getTimelines(callback);
      }).not.toThrow();
    });

    it("should provide createTimeline method", function() {
      spyOn(Timeline, "createTimeline").and.callThrough();
      Timeline.createTimeline(data, callback);
      expect(Timeline.createTimeline).toHaveBeenCalled();
      expect(Timeline.createTimeline).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Timeline.createTimeline(data, callback);
      }).not.toThrow();
    });

    it("should provide getTimeline method", function() {
      spyOn(Timeline, "getTimeline").and.callThrough();
      Timeline.getTimeline("timelineid", callback);
      expect(Timeline.getTimeline).toHaveBeenCalled();
      expect(Timeline.getTimeline).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Timeline.getTimeline("timelineid", callback);
      }).not.toThrow();
    });

    it("should provide deleteTimeline method", function() {
      spyOn(Timeline, "deleteTimeline").and.callThrough();
      Timeline.deleteTimeline("timelineid", callback);
      expect(Timeline.deleteTimeline).toHaveBeenCalled();
      expect(Timeline.deleteTimeline).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Timeline.deleteTimeline("timelineid", callback);
      }).not.toThrow();
    });

    it("should provide updateTimeline method", function() {
      spyOn(Timeline, "updateTimeline").and.callThrough();
      Timeline.updateTimeline("timelineid", data, callback);
      expect(Timeline.updateTimeline).toHaveBeenCalled();
      expect(Timeline.updateTimeline).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Timeline.updateTimeline("timelineid", data, callback);
      }).not.toThrow();
    });

    it("should provide getCard method", function() {
      spyOn(Timeline, "getCard").and.callThrough();
      Timeline.getCard("timelineid", "cardid", callback);
      expect(Timeline.getCard).toHaveBeenCalled();
      expect(Timeline.getCard).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Timeline.getCard("timelineid", "cardid", callback);
      }).not.toThrow();
    });

    it("should provide getCards method", function() {
      spyOn(Timeline, "getCards").and.callThrough();
      Timeline.getCards("timelineId", Date.now(), 10, "before", true, true, true, 300, callback);
      expect(Timeline.getCards).toHaveBeenCalled();
      expect(Timeline.getCards).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Number), jasmine.any(Number), jasmine.any(String), jasmine.any(Boolean), jasmine.any(Boolean), jasmine.any(Boolean), jasmine.any(Number),  jasmine.any(Function));
      expect(function() {
        Timeline.getCards("timelineId", callback);
      }).not.toThrow();
    });

    it("should provide getCardsByQuery method", function() {
      spyOn(Timeline, "getCardsByQuery").and.callThrough();
      Timeline.getCardsByQuery("timelineId", "query", Date.now(), 10, "before", true, true, true, 300, callback);
      expect(Timeline.getCardsByQuery).toHaveBeenCalled();
      expect(Timeline.getCardsByQuery).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Number), jasmine.any(Number), jasmine.any(String), jasmine.any(Boolean), jasmine.any(Boolean), jasmine.any(Boolean), jasmine.any(Number),  jasmine.any(Function));
      expect(function() {
        Timeline.getCardsByQuery("timelineId", callback);
      }).not.toThrow();
    });

    it("should provide createCard method", function() {
      spyOn(Timeline, "createCard").and.callThrough();
      Timeline.createCard("timelineid", data, callback);
      expect(Timeline.createCard).toHaveBeenCalled();
      expect(Timeline.createCard).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Timeline.createCard("timelineid", data, callback);
      }).not.toThrow();
    });

    it("should provide updateCard method", function() {
      spyOn(Timeline, "updateCard").and.callThrough();
      Timeline.updateCard("timelineid", "cardid", data, callback);
      expect(Timeline.updateCard).toHaveBeenCalled();
      expect(Timeline.updateCard).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Timeline.updateCard("timelineid", "cardid", data, callback);
      }).not.toThrow();
    });

    it("should provide deleteCard method", function() {
      spyOn(Timeline, "deleteCard").and.callThrough();
      Timeline.deleteCard("timelineid", "cardid", callback);
      expect(Timeline.deleteCard).toHaveBeenCalled();
      expect(Timeline.deleteCard).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Timeline.deleteCard("timelineid", "cardid", callback);
      }).not.toThrow();
    });

    it("should provide getComments method", function() {
      spyOn(Timeline, "getComments").and.callThrough();
      Timeline.getComments("timelineid", "cardid", callback);
      expect(Timeline.getComments).toHaveBeenCalled();
      expect(Timeline.getComments).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Timeline.getComments("timelineid", "cardid", callback);
      }).not.toThrow();
    });

    it("should provide getComment method", function() {
      spyOn(Timeline, "getComment").and.callThrough();
      Timeline.getComment("timelineid", "cardid", "comentId", callback);
      expect(Timeline.getComment).toHaveBeenCalled();
      expect(Timeline.getComment).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Timeline.getComment("timelineid", "cardid", "comentId", callback);
      }).not.toThrow();
    });

    it("should provide deleteComment method", function() {
      spyOn(Timeline, "deleteComment").and.callThrough();
      Timeline.deleteComment("timelineid", "cardid", "comentId", callback);
      expect(Timeline.deleteComment).toHaveBeenCalled();
      expect(Timeline.deleteComment).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Timeline.deleteComment("timelineid", "cardid", "comentId", callback);
      }).not.toThrow();
    });

    it("should provide createComment method", function() {
      spyOn(Timeline, "createComment").and.callThrough();
      Timeline.createComment("timelineid", "cardid", data, callback);
      expect(Timeline.createComment).toHaveBeenCalled();
      expect(Timeline.createComment).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Timeline.createComment("timelineid", "cardid", data, callback);
      }).not.toThrow();
    });

    it("should provide getEventsToken method", function() {
      spyOn(Timeline, "getEventsToken").and.callThrough();
      Timeline.getEventsToken(callback);
      expect(Timeline.getEventsToken).toHaveBeenCalled();
      expect(Timeline.getEventsToken).toHaveBeenCalledWith(jasmine.any(Function));
      expect(function() {
        Timeline.getEventsToken(callback);
      }).not.toThrow();
    });

  });
});