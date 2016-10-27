/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Watch command forwarder for Node.js integration
|  @requires child_process
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var spawn = require('child_process').spawn;

require('./projectdir');
spawn('gulp', 'watch --gulpfile ../.vscode/gulpfile.js'.split(' '), { stdio: 'inherit' });