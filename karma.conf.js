/**
 * @file Configures Karma unit tests for Chrome.
 */

module.exports = function(config) {
    config.set({

        basePath: "./scripts",

        files: [
            "bower_components/angular/angular.js",
            "bower_components/angular-mocks/angular-mocks.js",
            "*.js"
        ],

        autoWatch: true,

        frameworks: ["jasmine"],

        browsers: ["Chrome"],

        plugins: [
            "karma-chrome-launcher",
            "karma-jasmine"
        ]
    });
};