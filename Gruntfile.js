module.exports = function (grunt) {
  "use strict";

  var pkg = grunt.file.readJSON("package.json");
  grunt.loadNpmTasks("grunt-bump");

  grunt.initConfig({
    bump: {
      options:{
        files: ["bower.json", "package.json"],
        updateConfigs: [],
        commit: true,
        commitFiles: ["bower.json", "package.json"],
        commitMessage: "Release v%VERSION%",
        createTag: true,
        tagName: "v%VERSION%",
        tagMessage: "Version %VERSION%",
        push: false,
        pushTo: "origin",
        gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d",
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    },
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
          "dist/cs-api.min.js": ["dist/cs-api.js"]
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
          "dist/cs-api.js": [
            "lib/cardstreams-js-sdk.js"
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
            standalone: "CS"
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
          { expand: true, cwd: "dist/", src: "cs-api.min.js", dest: "developer/js/", action: "upload" },
          { expand: true, cwd: "dist/", src: "cs-api.js", dest: "developer/js/", action: "upload" },
          {
            expand: true,
            cwd: "dist/",
            src: "cs-api*.js",
            dest: "developer/js/",
            action: "upload",
            rename: function(dest, src) {
              var pkg_now = grunt.file.readJSON("package.json");
              return dest + src.replace("cs-api", "cs-api-" + pkg_now.version);
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
    "bump",
    "aws_s3:assets"
  ]);

};
