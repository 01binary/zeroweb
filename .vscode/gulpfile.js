/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Task automation
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
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var source = '../src/';
var packages = '../node_modules/';
var intermediate = '../src/Build/';
var destination = '../src/Content/';

gulp.task('default', startup);
gulp.task('sass', buildStyles);
gulp.task('sass:watch', watchStyles);
gulp.task('uglify', buildScripts);
gulp.task('uglify:watch', watchScripts);

function startup() {
  build();
  watch();
}

function build() {
  buildStyles();
  buildScripts();
}

function watch() {
  watchStyles();
  watchScripts();
}

function buildStyles() {
  console.log('\t\tBuilding and minifying styles');

  return gulp.src(source + 'Styles/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('zero.min.css'))
    .pipe(gulp.dest(destination));
}

function watchStyles() {
  console.log('\t\tWatching styles for changes');
  gulp.watch(source + 'Styles/**/*.scss', ['sass']);
}

function buildScripts() {
  console.log('\t\tMinifying scripts');

  var sources = [
    packages + 'angular/angular.js',
    packages + 'angular-route/angular-route.js',
    packages + 'angular-resource/angular-resource.js',
    packages + 'angular-loading-bar/src/loading-bar.js',

    packages + 'jquery/dist/jquery.js',
    packages + 'jquery-ui/ui/effect.js',

    source + 'Scripts/**/*.js'
  ];

  return gulp.src(sources)
    .pipe(concat('zero.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(destination));
}

function watchScripts() {
  console.log('\t\tWatching scripts for changes');
  gulp.watch(source + 'Scripts/**/*.js', ['uglify']);
}