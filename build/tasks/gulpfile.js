/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Task automation.
|  @requires gulp
|  @requires gulp-sass
|  @requires gulp-rename
|  @requires gulp-uglify
|  @requires gulp-concat
|  @requires gulp-iife
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var strip = require('gulp-strip-json-comments');
var iife = require('gulp-iife');

var bundle = require('../bundle.json');
var source = '../../src';
var packages = '../../node_modules';

gulp.task('default', build);
gulp.task('watch', watch)
gulp.task('sass', buildStyles);
gulp.task('sass:watch', watchStyles);
gulp.task('uglify', buildScripts);
gulp.task('uglify:watch', watchScripts);

function build() {
  buildStyles();
  buildScripts();
}

function watch() {
  watchStyles();
  watchScripts();
}

function buildStyles() {
  console.log('\tBuilding and minifying styles');

  return gulp.src(getStyles())
    .pipe(strip())
    .pipe(sass({outputStyle: 'compressed'})
      .on('error', sass.logError))
    .pipe(concat('zero.min.css'))
    .pipe(gulp.dest(getDestination()));
}

function watchStyles() {
  console.log('\tWatching styles for changes');
  gulp.watch(getStyles(), ['sass']);
}

function buildScripts() {
  console.log('\tMinifying scripts');

  return gulp.src(getScripts())
    .pipe(iife())
    .pipe(uglify())
    .pipe(concat('zero.min.js', { newLine: ';' }))
    .pipe(gulp.dest(getDestination()));
}

function watchScripts() {
  console.log('\tWatching scripts for changes');
  gulp.watch(getScripts(), ['uglify']);
}

function getScripts() {
  return bundle.scripts.map(function(path) {
    return replaceMacros(path);
  });
}

function getStyles() {
  return bundle.styles.map(function(path) {
    return replaceMacros(path);
  });
}

function getDestination() {
  return bundle.destination.replace('$(source)', source);
}

function replaceMacros(path) {
  return path
    .replace('${packages}', packages)
    .replace('${source}', source);
}