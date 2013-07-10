'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.recess = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  plain: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/recess.log');
    var expected = grunt.file.read('test/expected/recess.log');
    test.equal(actual, expected, 'should be the plain RECESS log file.');

    test.done();
  },
  checkstyle: function(test) {
    test.expect(3);

    var actual = grunt.file.read('tmp/one.less');
    var expected = grunt.file.read('test/expected/one.less');
    test.equal(actual, expected, 'should be the resulting stylesheet of "one.less".');

    var actual = grunt.file.read('tmp/two.less');
    var expected = grunt.file.read('test/expected/two.less');
    test.equal(actual, expected, 'should be the resulting stylesheet of "two.less".');

    var actual = grunt.file.read('tmp/checkstyle.xml');
    var expected = grunt.file.read('test/expected/checkstyle.xml');
    test.equal(actual, expected, 'should be the resulting checkstyle report.');

    test.done();
  },
};
