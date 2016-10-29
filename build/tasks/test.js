/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Unit and functional test tasks.
|  @requires helpers
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var helpers = require('./helpers');

helpers.changeToProjectDir();

if (helpers.operation.startsWith('f')) {
    helpers.run('protractor Tests/protractor.conf.js');
} else {
    helpers.run('karma start Tests/karma.conf.js');
}
