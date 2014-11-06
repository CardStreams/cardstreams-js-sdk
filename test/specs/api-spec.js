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
        consumer_key: "SlNgHQlVduKKNWkezPxe0dfEHIP2dlTh"
      });

      expect(Timeline.init).toHaveBeenCalled();
    });

    it("should not throw an Error when configuration object contains Consumer Key", function() {

      expect(function() {
        Timeline.init({
          consumer_key: "SlNgHQlVduKKNWkezPxe0dfEHIP2dlTh"
        });
      }).not.toThrow();
    });

    it("should throw an Error when consumer_key is not provided", function() {

      expect(function() {
        Timeline.init({});
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
        consumer_key: "SlNgHQlVduKKNWkezPxe0dfEHIP2dlTh"
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
        consumer_key: "SlNgHQlVduKKNWkezPxe0dfEHIP2dlTh",
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

    it("should set the X-Lifestreams-ConsumerKey request header", function() {
      expect(req.requestHeaders["X-Lifestreams-ConsumerKey"]).toBe("SlNgHQlVduKKNWkezPxe0dfEHIP2dlTh");
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

    it("should provide getUsers method", function() {
      spyOn(Timeline, "getUsers").and.callThrough();
      Timeline.getUsers(callback);
      expect(Timeline.getUsers).toHaveBeenCalled();
      expect(Timeline.getUsers).toHaveBeenCalledWith(jasmine.any(Function));
      expect(function() {
        Timeline.getUsers(callback);
      }).not.toThrow();
    });

    it("should provide createUser method", function() {
      spyOn(Timeline, "createUser").and.callThrough();
      Timeline.createUser(data, callback);
      expect(Timeline.createUser).toHaveBeenCalled();
      expect(Timeline.createUser).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Timeline.createUser(data, callback);
      }).not.toThrow();
    });

    it("should provide getUser method", function() {
      spyOn(Timeline, "getUser").and.callThrough();
      Timeline.getUser("userid", callback);
      expect(Timeline.getUser).toHaveBeenCalled();
      expect(Timeline.getUser).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Timeline.getUser("userid", callback);
      }).not.toThrow();
    });

    it("should provide getMemberships method", function() {
      spyOn(Timeline, "getMemberships").and.callThrough();
      Timeline.getMemberships("userid", callback);
      expect(Timeline.getMemberships).toHaveBeenCalled();
      expect(Timeline.getMemberships).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Timeline.getMemberships("userid", callback);
      }).not.toThrow();
    });

    it("should provide getMembership method", function() {
      spyOn(Timeline, "getMembership").and.callThrough();
      Timeline.getMembership("userid", "timelineid", callback);
      expect(Timeline.getMembership).toHaveBeenCalled();
      expect(Timeline.getMembership).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Timeline.getMembership("userid", "timelineid", callback);
      }).not.toThrow();
    });

    it("should provide createMembership method", function() {
      spyOn(Timeline, "createMembership").and.callThrough();
      Timeline.createMembership("userid", data, callback);
      expect(Timeline.createMembership).toHaveBeenCalled();
      expect(Timeline.createMembership).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Timeline.createMembership("userid", data, callback);
      }).not.toThrow();
    });

    it("should provide updateMembership method", function() {
      spyOn(Timeline, "updateMembership").and.callThrough();
      Timeline.updateMembership("userid", "timelineid", data, callback);
      expect(Timeline.updateMembership).toHaveBeenCalled();
      expect(Timeline.updateMembership).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Timeline.updateMembership("userid", "timelineid", data, callback);
      }).not.toThrow();
    });

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
      Timeline.getCards("timelineid", callback);
      expect(Timeline.getCards).toHaveBeenCalled();
      expect(Timeline.getCards).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Timeline.getCards("timelineid", callback);
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

  });
});