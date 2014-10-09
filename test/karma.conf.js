module.exports = function(config) {
  "use strict";

  config.set({
    basePath: "..",
    reporters: ["progress"],
    frameworks: ["jasmine-ajax", "jasmine", "browserify"],
    browsers: ["PhantomJS"],
    files: [
      "dist/api.min.js",
      "test/**/*-spec.js"
    ],
    preprocessors: {
      "test/**/*-spec.js": "browserify"
    }
  });
};