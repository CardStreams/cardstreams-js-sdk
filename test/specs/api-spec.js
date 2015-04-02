describe("CardStreams-JS-SDK", function() {
  "use strict";

  var Stream = require("../../lib/cardstreams-js-sdk");
  var TestResponses = require("../helpers/responses");

  describe("SDK package", function() {
    it("should be included as a CommonJS module", function(){
      expect(Stream).toBeDefined();
    });

    it("should expose a global CS namespace", function() {
      expect(window.CS).toBeDefined();
    });
  });

  describe("SDK#init", function() {

    it("should be a publicly available method", function() {
      spyOn(Stream, "init");

      Stream.init({
        app_id: "91312294",
        app_key: "9fce4bb6bc33d780002fda854e6aaa03"
      });

      expect(Stream.init).toHaveBeenCalled();
    });

    it("should not throw an Error when configuration object contains APP Key and APP ID", function() {

      expect(function() {
        Stream.init({
          app_id: "91312294",
          app_key: "9fce4bb6bc33d780002fda854e6aaa03"
        });
      }).not.toThrow();
    });

    it("should throw an Error when app_key is not provided", function() {

      expect(function() {
        Stream.init({
          app_id: "91312294"
        });
      }).toThrow();
    });

    it("should throw an Error when app_id is not provided", function() {

      expect(function() {
        Stream.init({
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

      Stream.init({
        app_id: "91312294",
        app_key: "9fce4bb6bc33d780002fda854e6aaa03"
      });

      Stream.api("/url", "post", data, callback);

      req = jasmine.Ajax.requests.mostRecent();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("should be a publicly available method", function() {
      spyOn(Stream, "api");
      Stream.api("/endpoint", "get", function(){});
      expect(Stream.api).toHaveBeenCalled();
    });

    it("should set request endpoint properly with a default url", function() {
      var url = "https://api.cardstreams.io/v1/url";
      expect(req.url).toBe(url);
    });

    it("should set request endpoint properly with a provided url", function() {
      var url = "https://test/t";

      Stream.init({
        app_id: "91312294",
        app_key: "9fce4bb6bc33d780002fda854e6aaa03",
        api_url: "https://test"
      });

      Stream.api("/t", "get", function(){});

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

      Stream.api("/url", "get", callback);
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

      Stream.api("/url", "get", callback);
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
      Stream.api("/test", "get", callback);

      jasmine.Ajax.requests.mostRecent().response(TestResponses.timeline.success);
      expect(callback).toHaveBeenCalledWith({});

      req = jasmine.Ajax.requests.mostRecent();
      expect(req.params).toBe(undefined);

      // four arguments
      Stream.api("/test", "post", {"test":"test"}, callback);

      jasmine.Ajax.requests.mostRecent().response(TestResponses.timeline.success);
      expect(callback).toHaveBeenCalledWith({});
      req = jasmine.Ajax.requests.mostRecent();
      expect(JSON.parse(req.params)).toEqual({test: "test"});
    });

  });

  describe("SDK#subscribe", function() {

    it("should be a publicly available method", function() {
      spyOn(Stream, "subscribe");
      Stream.subscribe("/channel", function(){});
      expect(Stream.subscribe).toHaveBeenCalled();
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

    it("should provide getStreams method", function() {
      spyOn(Stream, "getStreams").and.callThrough();
      Stream.getStreams(callback);
      expect(Stream.getStreams).toHaveBeenCalled();
      expect(Stream.getStreams).toHaveBeenCalledWith(jasmine.any(Function));
      expect(function() {
        Stream.getStreams(callback);
      }).not.toThrow();
    });

    it("should provide createStream method", function() {
      spyOn(Stream, "createStream").and.callThrough();
      Stream.createStream(data, callback);
      expect(Stream.createStream).toHaveBeenCalled();
      expect(Stream.createStream).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Stream.createStream(data, callback);
      }).not.toThrow();
    });

    it("should provide getStream method", function() {
      spyOn(Stream, "getStream").and.callThrough();
      Stream.getStream("streamid", callback);
      expect(Stream.getStream).toHaveBeenCalled();
      expect(Stream.getStream).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Stream.getStream("sreamid", callback);
      }).not.toThrow();
    });

    it("should provide deleteStream method", function() {
      spyOn(Stream, "deleteStream").and.callThrough();
      Stream.deleteStream("streamid", callback);
      expect(Stream.deleteStream).toHaveBeenCalled();
      expect(Stream.deleteStream).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Stream.deleteStream("streamid", callback);
      }).not.toThrow();
    });

    it("should provide updateStream method", function() {
      spyOn(Stream, "updateStream").and.callThrough();
      Stream.updateStream("streamid", data, callback);
      expect(Stream.updateStream).toHaveBeenCalled();
      expect(Stream.updateStream).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Stream.updateStream("streamid", data, callback);
      }).not.toThrow();
    });

    it("should provide getCard method", function() {
      spyOn(Stream, "getCard").and.callThrough();
      Stream.getCard("streamid", "cardid", callback);
      expect(Stream.getCard).toHaveBeenCalled();
      expect(Stream.getCard).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Stream.getCard("streamid", "cardid", callback);
      }).not.toThrow();
    });

    it("should provide getCards method", function() {
      spyOn(Stream, "getCards").and.callThrough();
      Stream.getCards("streamid", Date.now(), 10, "before", true, true, true, 300, callback);
      expect(Stream.getCards).toHaveBeenCalled();
      expect(Stream.getCards).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Number), jasmine.any(Number), jasmine.any(String), jasmine.any(Boolean), jasmine.any(Boolean), jasmine.any(Boolean), jasmine.any(Number),  jasmine.any(Function));
      expect(function() {
        Stream.getCards("streamid", callback);
      }).not.toThrow();
    });

    it("should provide getCardsByQuery method", function() {
      spyOn(Stream, "getCardsByQuery").and.callThrough();
      Stream.getCardsByQuery("streamid", "query", Date.now(), 10, "before", true, true, true, 300, callback);
      expect(Stream.getCardsByQuery).toHaveBeenCalled();
      expect(Stream.getCardsByQuery).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Number), jasmine.any(Number), jasmine.any(String), jasmine.any(Boolean), jasmine.any(Boolean), jasmine.any(Boolean), jasmine.any(Number),  jasmine.any(Function));
      expect(function() {
        Stream.getCardsByQuery("streamid", callback);
      }).not.toThrow();
    });

    it("should provide createCard method", function() {
      spyOn(Stream, "createCard").and.callThrough();
      Stream.createCard("streamid", data, callback);
      expect(Stream.createCard).toHaveBeenCalled();
      expect(Stream.createCard).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Stream.createCard("streamid", data, callback);
      }).not.toThrow();
    });

    it("should provide updateCard method", function() {
      spyOn(Stream, "updateCard").and.callThrough();
      Stream.updateCard("streamid", "cardid", data, callback);
      expect(Stream.updateCard).toHaveBeenCalled();
      expect(Stream.updateCard).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Stream.updateCard("streamid", "cardid", data, callback);
      }).not.toThrow();
    });

    it("should provide deleteCard method", function() {
      spyOn(Stream, "deleteCard").and.callThrough();
      Stream.deleteCard("streamid", "cardid", callback);
      expect(Stream.deleteCard).toHaveBeenCalled();
      expect(Stream.deleteCard).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Stream.deleteCard("streamid", "cardid", callback);
      }).not.toThrow();
    });

    it("should provide getComments method", function() {
      spyOn(Stream, "getComments").and.callThrough();
      Stream.getComments("streamid", "cardid", callback);
      expect(Stream.getComments).toHaveBeenCalled();
      expect(Stream.getComments).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Stream.getComments("streamid", "cardid", callback);
      }).not.toThrow();
    });

    it("should provide getComment method", function() {
      spyOn(Stream, "getComment").and.callThrough();
      Stream.getComment("streamid", "cardid", "comentId", callback);
      expect(Stream.getComment).toHaveBeenCalled();
      expect(Stream.getComment).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Stream.getComment("streamid", "cardid", "comentId", callback);
      }).not.toThrow();
    });

    it("should provide deleteComment method", function() {
      spyOn(Stream, "deleteComment").and.callThrough();
      Stream.deleteComment("streamid", "cardid", "commentId", callback);
      expect(Stream.deleteComment).toHaveBeenCalled();
      expect(Stream.deleteComment).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(String), jasmine.any(Function));
      expect(function() {
        Stream.deleteComment("streamid", "cardid", "commentId", callback);
      }).not.toThrow();
    });

    it("should provide createComment method", function() {
      spyOn(Stream, "createComment").and.callThrough();
      Stream.createComment("streamid", "cardid", data, callback);
      expect(Stream.createComment).toHaveBeenCalled();
      expect(Stream.createComment).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), jasmine.any(Object), jasmine.any(Function));
      expect(function() {
        Stream.createComment("streamid", "cardid", data, callback);
      }).not.toThrow();
    });

    it("should provide getEventsToken method", function() {
      spyOn(Stream, "getEventsToken").and.callThrough();
      Stream.getEventsToken(callback);
      expect(Stream.getEventsToken).toHaveBeenCalled();
      expect(Stream.getEventsToken).toHaveBeenCalledWith(jasmine.any(Function));
      expect(function() {
        Stream.getEventsToken(callback);
      }).not.toThrow();
    });

  });
});