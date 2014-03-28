'use strict';
var path = require('path');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-sort-deps';

function gulpSortJS() {

  if (false) {
    throw PluginError(PLUGIN_NAME, "Unexpected error happened.");
  }

  // Creating a stream through which each file will pass
  var stream = through.obj(function(file, enc, cb) {
    if (file.isNull()) {
       // Do nothing if no contents
    }
    if (file.isBuffer()) {
        //console.log(file.contents.toString(enc));
        console.log(file.path);
    }

    if (file.isStream()) {
       // Do nothing if stream
    }

    this.push(file);
    return cb();

  });

  return stream;
};

// Exporting the plugin main function
module.exports = gulpSortJS;
