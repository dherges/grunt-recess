# grunt-recess

> Lint CSS built on top of LESS with RECESS.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-recess --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-recess');
```

## The "recess" task

### Overview
In your project's Gruntfile, add a section named `recess` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  recess: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.force
Type: `Boolean`
Default value: `false`

If true, the plugin will report success even if linting errors were found.

#### options.config
Type: `String`
Default value: `''`

A path to a JSON config object for RECESS; see [RECESS options](https://github.com/twitter/recess#options) or the `recess.json` example in this repository.

#### options.mapping
Type: `String`
Default value: `''`

A path to a JSON config object for the reporter. The JSON maps RECESS incidents to reporter errors; what mapping options are available is dependent on the reporter. For example, using ```{noIDs: "info"}``` the checkstyle reporter maps RECESS' `noIDs` incident to a checkstyle `info`. See the `recess-checkstyle.json` in this repository for an example.

#### options.output
Type: `String`
Default value: `''`

A path to a directory; generated LESS files are written to that directory so that report files can reference the files and line numbers.

#### options.reporter
Type: `String`
Default value: `''`

Reporter to use; currently only `checkstyle` is available. If blank, default RECESS logging is written.


### Usage Examples

#### Default Options
In this example, the default options are used to generate a plain RECESS log. The RECESS configuration is read from ```recess.json```. The files `one.less` and `two.less` are linted. The log is written to ```tmp/recess.log```.

```js
grunt.initConfig({
  recess: {
    options: {
      config: 'recess.json'
    },
    plain: {
      files: {
        'tmp/recess.log': ['one.less', 'two.less']
      }
    }
  }
})
```

#### Checkstyle Reporting
In this example, custom options are used to generate a checkstyle report. The files `one.less` and `two.less` are linted. The checkstyle report is written to `tmp/checkstyle.xml`, referencing line numbers of output files in `tmp/recess/one.less` and `tmp/recess/two.less`. RECESS incidents are mapped to checkstyle errors according to `recess-checkstyle.json`.

```js
grunt.initConfig({
  recess: {
    checkstyle: {
      src: ['one.less', 'two.less'],
      dest: 'tmp/checkstyle.xml',
      options: {
        reporter: 'checkstyle',
        output: 'tmp/recess',
        mapping: 'recess-checkstyle.json'
      }
    }
  }
});
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

 * 2013-07-10   v0.1.0   First version.
