/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Configures Protractor functional tests for Chrome.
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

exports.config = {

    allScriptsTimeout: 11000,
    directConnect: true,

    specs: [
        "../*.functional.tests.js"
    ],

    capabilities: {
        "browserName": "chrome"
    },

    baseUrl: "https://localhost:5001",

    framework: "jasmine",

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    }
};