/*
 * grunt-recess
 * https://github.com/dherges/grunt-recess
 *
 * Copyright (c) 2013 David Herges
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  var path = require('path');
  var recess = require('recess');
  var reporting = require('../lib/reporting.js');

  grunt.registerMultiTask('recess', 'Lint CSS built on top of LESS with RECESS.', function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      force: false,
      config: undefined,
      mapping: undefined,
      output: undefined,
      reporter: undefined
    });

    var done = this.async();

    // Iterate over all specified file groups.
    this.files.forEach(function (fileObj) {
      // files and directories
      var srcFiles = fileObj.src;
      var destFile = fileObj.dest;
      var output = options.output;
      var config = {};
      var mapping;
      var result;

      if (!srcFiles || !srcFiles.length) {
        grunt.log.warn('Skipping this task because no source files are given');
        return done();
      }

      // read config.json file
      if (options.config) {
        config = grunt.file.readJSON(options.config);
      }
      config.compile = false;
      config.compress = false;

      // read mapping.json file for checkstyle reporter
      if (options.mapping) {
        mapping = grunt.file.readJSON(options.mapping);
      }

      // Run the linter
      if (options.reporter) {
        // Use the recess-reporting.js add-on, require and instantiate the reporter class
        var reporter;
        var ReporterProto;

        switch (true) {
          // Checkstyle xml
          case options.reporter === 'checkstyle':
            ReporterProto = require('../lib/reporters/checkstyle.js');
            break;
          // Custom reporter
          case options.reporter !== undefined:
            ReporterProto = require(path.resolve(process.cwd(), options.reporter));
            break;
          default:
            break;
        }
        reporter = new ReporterProto(mapping);

        // Sophisticated reporting using a custom reporter
        result = reporting.run(srcFiles, config, reporter, output, function () {
          // Write report to the report file, if wanted
          if (destFile) {
            destFile = grunt.template.process(destFile);
            var destDir = path.dirname(destFile);
            if (!grunt.file.exists(destDir)) {
              grunt.file.mkdir(destDir);
            }
            grunt.file.write(destFile, reporter.report);
            grunt.log.ok('Report "' + destFile + '" created.');
          }

          done(options.force ? options.force : result);
        });
      } else {
        // Use plain RECESS, hook into stdout to capture report
        var data = '';

        if (destFile) {
          grunt.util.hooker.hook(process.stdout, 'write', {
            pre: function (out) {
              data += out;
              return grunt.util.hooker.preempt();
            }
          });
        }

        config.stripColors = true;
        config.cli = true;

        // Plain reporting by using RECESS's programmatic API
        result = recess(srcFiles, config, function (err, instances) {
          // Write recesss output to destFile if wanted
          if (destFile) {
            grunt.util.hooker.unhook(process.stdout, 'write');
            destFile = grunt.template.process(destFile);
            var destDir = path.dirname(destFile);
            if (!grunt.file.exists(destDir)) {
              grunt.file.mkdir(destDir);
            }
            grunt.file.write(destFile, data);
            grunt.log.ok('Report "' + destFile + '" created.');
          }

          done(options.force ? options.force : result);
        });
      }
    });
  });
};
