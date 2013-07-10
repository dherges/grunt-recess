/*
 * grunt-recess
 * https://github.com/dherges/grunt-recess
 *
 * Copyright (c) 2013 David Herges
 * Licensed under the MIT license.
 */

'use strict';

var recess = require('recess')
  , fs = require('fs')
  , path = require('path')
  , mapping = {}
  , options
  , outputFile
  , defaults


defaults = {
  'output': null
}

module.exports = {

  /**
   * Run RECESS linter using a custom reporter
   * @param {String|Array} paths Less source file(s)
   * @param {Object} options RECESS options
   * @param {Object} reporter Instance of a reporter
   * @param {String} lessOutputDirectory A path to a directory where on-the-fly generated less files are stored
   * @param {Function} callback <code>function(reporter)</code>
   */
  run: function (paths, options, reporter, lessOutputDirectory, callback) {

    // recess must be run with these options so that .css and .xml are valid
    options.compile = false;
    options.compress = false;
    options.cli = false;
    options.stripColors = true;

    // run recess, generate report, write compiled .css somewhere to disk and invoke callback
    recess(paths, options, function (err, instances) {
      if (err) throw err;
      reporter.startReport();

      if (!instances.length) {
        instances = [instances];
      }

      // for each file, we get one instance
      instances
        && instances.length
        && instances.forEach(function (instance) {

          // write compiled css code to output directory
          if (lessOutputDirectory
            && fs.existsSync(lessOutputDirectory)
            && fs.statSync(lessOutputDirectory).isDirectory()) {

            outputFile = path.resolve(path.normalize(lessOutputDirectory + '/' + path.basename(instance.path)));
            fs.writeFileSync(outputFile, instance.data);
          }

          // start <file> tag in checkstyle.xml
          reporter.startFile((lessOutputDirectory) ? outputFile : instance.path);

          // loop over definitions to get errors
          instance.definitions
            && instance.definitions.length
            && instance.definitions.forEach(function (def) {

              // report that error
              def.errors
                && def.errors.length
                && def.errors.forEach(function (err) {

                  // log an <error> tag in checkstyle.xml
                  reporter.logError(err);
                });
            });

          // end a </file> tag in checkstyle.xml
          reporter.endFile();
        });

      reporter.endReport();
      callback && callback(reporter);
    });

  }

}
