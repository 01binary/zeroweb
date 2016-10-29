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
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var strip = require('gulp-strip-json-comments');

var source = '../../src/';
var packages = '../../node_modules/';
var intermediate = '../../build/';
var destination = '../../src/Content/';

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

  var sources = [
    packages + 'angular-loading-bar/build/loading-bar.css',
    source + 'Styles/**/*.scss'
  ];

  return gulp.src(sources)
    .pipe(strip())
    .pipe(sass({outputStyle: 'compressed'})
      .on('error', sass.logError))
    .pipe(concat('zero.min.css'))
    .pipe(gulp.dest(destination));
}

function watchStyles() {
  console.log('\tWatching styles for changes');
  gulp.watch(source + 'Styles/**/*.scss', ['sass']);
}

function buildScripts() {
  console.log('\tMinifying scripts');

  var sources = [
    packages + 'jquery/dist/jquery.js',
    packages + 'jquery-ui/ui/effect.js',

    packages + 'angular/angular.js',
    packages + 'angular-route/angular-route.js',
    packages + 'angular-resource/angular-resource.js',
    packages + 'angular-loading-bar/build/loading-bar.js',

    packages + 'markdown-it/dist/markdown-it.js',

    source + 'Scripts/**/*.js',
    '!' + source + 'Scripts/tests/*'
  ];

  return gulp.src(sources)
    .pipe(uglify())
    .pipe(concat('zero.min.js', { newLine: ';' }))
    .pipe(gulp.dest(destination));
}

function watchScripts() {
  console.log('\tWatching scripts for changes');
  gulp.watch(source + 'Scripts/**/*.js', ['uglify']);
}