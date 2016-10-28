/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Build command forwarder for Node.js integration.
|  @requires child_process
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var spawn = require('child_process').spawn;
var rimraf = require('../../node_modules/rimraf').sync;

var gulpOptions = '--gulpfile ../build/tasks/gulpfile.js';

require('./projectdir');

if (process.argv.length > 2 && process.argv[2] === 'sass') {
    // sass
    spawn('gulp', (gulpOptions + ' sass').split(' '), { stdio: 'inherit' });
} else if (process.argv.length > 2 && process.argv[2] === 'uglify') {
    // uglify
    spawn('gulp', (gulpOptions + ' uglify').split(' '), { stdio: 'inherit' });
} else if (process.argv.length > 2 && process.argv[2] === 'dotnet') {
    // dotnet
    spawn('dotnet', 'build -f netcoreapp1.0 -b ../build -o ../build/output'.split(' '), { stdio: 'inherit' });
} else if (process.argv.length > 2 && process.argv[2] === 'clean') {
    // clean
    rimraf('../build/output');
    rimraf('../build/src');
} else {
    // dotnet, sass, uglify
    spawn('dotnet', 'build -f netcoreapp1.0 -b ../build -o ../build/output'.split(' '), { stdio: 'inherit' });
    spawn('gulp', gulpOptions.split(' '), { stdio: 'inherit' });
}