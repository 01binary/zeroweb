var gulp    = require("gulp");
var connect = require("gulp-connect");
var concat  = require("gulp-concat");
var minify  = require("gulp-minify");

/**
 * Create minified client package.
 */
gulp.task("minify", function()
{
    gulp.src(
        [
            // jQuery
            "scripts/jquery/dist/jquery.js",

            // Angular
            "scripts/angular/angular.js",

            // Application
            "scripts/app/*.js",
            "scripts/app/controllers/*.js",
            "scripts/app/directives/*.js",
            "scripts/app/services/*.js"
        ])
        .pipe(concat("zero.js"))
        .pipe(minify({
            ext: { min: ".min.js" }
        }))
        .pipe(gulp.dest("scripts"));
});

/**
 * Run web server.
 */
gulp.task("webserver", function()
{
    connect.server();
});

/**
 * Run web server by default.
 */
gulp.task("default", ["webserver"]);