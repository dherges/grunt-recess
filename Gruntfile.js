/*
 * grunt-recess
 * https://github.com/dherges/grunt-recess
 *
 * Copyright (c) 2013 David Herges
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true
      },
      all: {
        src: ['Gruntfile.js', 'lib/**/*.js', 'tasks/*.js', '<%= nodeunit.tests %>']
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    recess: {
      options: {
        config: 'recess.json'
      },
      plain: {
        files: {
          'tmp/recess.log': ['test/fixtures/one.less', 'test/fixtures/two.less']
        }
      },
      checkstyle: {
        src: ['test/fixtures/one.less', 'test/fixtures/two.less'],
        dest: 'tmp/checkstyle.xml',
        options: {
          reporter: 'checkstyle',
          output: 'tmp',
          mapping: 'recess-checkstyle.json'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'recess', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
