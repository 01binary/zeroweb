/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Watch command forwarder for Node.js integration.
|  @requires child_process
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var spawn = require('child_process').spawn;

var gulpOptions = '--gulpfile ../build/tasks/gulpfile.js ';

require('./projectdir');

if (process.argv.length > 2 && process.argv[2] === 'sass') {
    // sass:watch
    spawn('gulp', (gulpOptions + 'sass:watch').split(' '), { stdio: 'inherit' });
} else if (process.argv.length > 2 && process.argv[2] == 'uglify') {
    // uglify:watch
    spawn('gulp', (gulpOptions + 'uglify:watch').split(' '), { stdio: 'inherit' });
} else {
    // sass:watch, uglify:watch
    spawn('gulp', (gulpOptions + 'watch').split(' '), { stdio: 'inherit' });
};