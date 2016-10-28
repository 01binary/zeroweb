/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Test commands.
|  @requires child_process
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var spawn = require('child_process').spawn;
var arg = process.argv[2];

require('./projectdir');

if (arg && arg[0] === 'f') {
    spawn('protractor', [ 'Tests/protractor.conf.js' ], { stdio: 'inherit' });
} else {
    spawn('karma', [ 'start', 'Tests/karma.conf.js' ], { stdio: 'inherit' });
}
