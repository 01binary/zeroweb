/**
 * @file Configures Protractor functional tests for Chrome.
 */

//jshint strict: false

exports.config = {

    allScriptsTimeout: 11000,
    directConnect: true,

    specs: [
        "scripts/*scenarios.js"
    ],

    capabilities: {
        "browserName": "chrome"
    },

    baseUrl: "http://localhost:8000/index.htm",

    framework: "jasmine",

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};