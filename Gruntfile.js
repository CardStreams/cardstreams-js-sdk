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
            "lib/ls-js-sdk.js"
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
          ],
          browserifyOptions: {
            standalone: "LS"
          }
        }
      }
    },
    aws_s3: {
      options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucket: "assets.lifestreams.com",
        access: "public-read",
        params: { CacheControl: "max-age=300" }
      },
      assets: {
        files: [
          { expand: true, cwd: "dist/", src: "api.min.js", dest: "developer/js/", action: "upload" },
          {
            expand: true,
            cwd: "dist/",
            src: "api.min.js",
            dest: "developer/js/",
            action: "upload",
            rename: function(dest, src) {
              return dest + src.replace("api", "api-" + pkg.version);
            }
          }
        ]
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

  grunt.registerTask("publish", [
    "install",
    "aws_s3:assets"
  ]);

};