'use strict';
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
 
gulp.task('sass', function () {
  return gulp.src('./Styles/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename('zero.min.css'))
    .pipe(gulp.dest('./wwwroot'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./Styles/**/*.scss', ['sass']);
});