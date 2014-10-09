module.exports = function (grunt) {
  "use strict";

  var pkg = grunt.file.readJSON("package.json");

  grunt.initConfig({
    pkg: pkg,
    watch: {
      js: {
        files: ["lib/**/*.js"],
        tasks: ["browserify"]
      }
    },
    jshint: {
      all: ["Gruntfile.js", "lib/*.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    clean: {
      build: "dist/"
    },
    uglify: {
      my_target: {
        files: {
          "dist/api.min.js": ["dist/api.js"]
        }
      }
    },
    karma: {
      unit: {
        configFile: "test/karma.conf.js"
      }
    },
    browserify: {
      dist: {
        files: {
          "dist/api.js": [
            "lib/*.js"
          ]
        },
        options: {
          debug: true,
          aliasMappings: [
            {
              expand: true,
              cwd: "lib/",
              src: ["*.js", "**/*.js"],
              dest: ""
            }
          ]
        }
      }
    }
  });

  Object.keys(pkg.dependencies).filter(function (name) {
    return !name.indexOf("grunt-");
  }).forEach(grunt.loadNpmTasks);

  grunt.registerTask("dev", [
    "jshint",
    "clean:build",
    "browserify",
    "uglify",
    "watch"
  ]);

  grunt.registerTask("install", [
    "clean:build",
    "browserify",
    "uglify"
  ]);

  grunt.registerTask("test", [
    "jshint",
    "browserify",
    "uglify",
    "karma:unit"
  ]);
};