// Karma configuration
// Generated on Fri Dec 05 2014 16:49:29 GMT-0500 (EST)
var isparta = require('isparta');
var paths = require('./build/paths');
var babelOptions = require('./build/babel-options');

module.exports = function(config) {
  var configuration = {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jspm', 'jasmine'],

    jspm: {
      // Edit this to your needs
      loadFiles: ['test/unit/setup.js', 'test/unit/**/*.js'],
      serveFiles: ['src/**/*.js'],
      paths: {
        '*': '*',
        'github:*': 'jspm_packages/github/*',
        'npm:*': 'jspm_packages/npm/*'
      }
    },

    // list of files / patterns to load in the browser
    files: [
      "http://cdn.robotwebtools.org/EaselJS/current/easeljs.min.js",
      "http://cdn.robotwebtools.org/EventEmitter2/current/eventemitter2.min.js",
      "http://cdn.robotwebtools.org/roslibjs/current/roslib.min.js",
      "http://cdn.robotwebtools.org/ros2djs/current/ros2d.min.js",
      "http://cdn.robotwebtools.org/nav2djs/current/nav2d.min.js",
      "http://cdn.leafletjs.com/leaflet/v1.0.0-rc.1/leaflet.js",
      "https://cdn.rawgit.com/Leaflet/Leaflet.Editable/gh-pages/src/Leaflet.Editable.js"
    ],

    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/**/*.js': ['babel'],
      'src/**/*.js': ['babel', 'sourcemap'],
      'src/!(lib)/**/*.js': ['coverage']
    },
    'babelPreprocessor': {
      options: {
        sourceMap: 'inline',
        presets: [ 'es2015-loose', 'stage-1'],
        plugins: [
          'syntax-flow',
          'transform-decorators-legacy',
          'transform-flow-strip-types'
        ]
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['coverage', 'progress'],
    coverageReporter: {
      instrumenters: {
        isparta: isparta
      },

      instrumenter: {
        [paths.source]: 'isparta'
      },

      dir: 'build/reports/coverage/',

      reporters: [{
        type: 'text-summary'
      }, {
        type: 'html',
        subdir: 'html'
      }, {
        type: 'lcovonly',
        subdir: 'lcov',
        file: 'report-lcovonly.txt'
      }]
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci', 'Firefox'];
  }

  config.set(configuration);
};
