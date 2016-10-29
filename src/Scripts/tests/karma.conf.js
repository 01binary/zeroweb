/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Configures Karma unit tests for Chrome.
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

module.exports = function(config) {
    config.set({
        basePath: "..",

        files: [
            "../../node_modules/angular/angular.js",
            "../../node_modules/angular-mocks/angular-mocks.js",
            "*.unit.tests.js"
        ],

        autoWatch: true,

        frameworks: [ "jasmine" ],

        browsers: [ "Chrome" ],

        plugins: [
            "karma-chrome-launcher",
            "karma-jasmine"
        ]
    });
};
