'use strict';
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sort = require('./');
var expect = require('chai').expect;
var nodePromise = require("node-promise");
var Promise = nodePromise.Promise;
var all = nodePromise.all;

describe('gulp-js-sort plugin', function () {

  var cwd = process.cwd();

  beforeEach(function () {
    if (!fs.existsSync('tmp')) {
      fs.mkdirSync('tmp');
    }
  });

  afterEach(function () {
    _rmdir('tmp');
  });

  function _rmdir(path) {
    var files = [];
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path);
      for (var i = 0, il = files.length; i < il; i++) {
        var curPath = path + "/" + files[i];
        if (fs.lstatSync(curPath).isDirectory()) {
          _rmdir(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      }
      fs.rmdirSync(path);
    }
  }

  function _writeFile(path, text) {
    var promise = new Promise();
    fs.writeFile(path, text, function () {
      promise.resolve(path);
    });
    return promise;
  }

  it('resolves function calls', function (done) {
    var t1 = 'function a() {console.log("a")}';
    var t2 = 'function b() {a();}';
    var t3 = 'function c() {b();}';
    var p1 = _writeFile('tmp/a.js', t1);
    var p2 = _writeFile('tmp/b.js', t2);
    var p3 = _writeFile('tmp/c.js', t3);
    all(p1, p2, p3).then(function () {
      gulp.src('tmp/**/*.js')
        .pipe(sort())
        .pipe(concat('out.js'))
        .pipe(gulp.dest('tmp'))
        .on('end', function () {
          fs.readFile('tmp/out.js', function(err, fileContent) {
            if (err) {
              console.error('Failed to read file.');
              done();
              return;
            }
            var result = fileContent.toString();
            expect(result === (t3 + t2 + t1)).to.be.true;
            done();
          });
        });
    },
    function () {
      console.error('Failed to write files.');
      done();
    });
  });

  it('resolves variable references', function (done) {
    var t1 = 'var a = 1 + b;';
    var t2 = 'var b = 2 + c';
    var t3 = 'var c = 3';
    var p1 = _writeFile('tmp/a.js', t1);
    var p2 = _writeFile('tmp/b.js', t2);
    var p3 = _writeFile('tmp/c.js', t3);
    all(p1, p2, p3).then(function () {
      gulp.src('tmp/**/*.js')
        .pipe(sort())
        .pipe(concat('out.js'))
        .pipe(gulp.dest('tmp'))
        .on('end', function () {
          fs.readFile('tmp/out.js', function(err, fileContent) {
            if (err) {
              console.error('Failed to read file.');
              done();
              return;
            }
            var result = fileContent.toString();
            console.log(result);
            expect(result === (t3 + t2 + t1)).to.be.true;
            done();
          });
        });
    },
    function () {
      console.error('Failed to write files.');
      done();
    });
  });
});
