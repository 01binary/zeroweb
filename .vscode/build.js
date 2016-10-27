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

var gulpOptions = '--gulpfile ../.vscode/gulpfile.js';

require('./projectdir');

if (process.argv.length > 2 && process.argv[2] === 'sass') {
    // sass
    spawn('gulp', (gulpOptions + ' sass').split(' '), { stdio: 'inherit' });
} else if (process.argv.length > 2 && process.argv[2] === 'uglify') {
    // uglify
    spawn('gulp', (gulpOptions + ' uglify').split(' '), { stdio: 'inherit' });
} else if (process.argv.length > 2 && process.argv[2] === 'dotnet') {
    // dotnet
    spawn('dotnet', 'build -f netcoreapp1.0 -b Build -o Build/Output'.split(' '), { stdio: 'inherit' });
} else {
    // dotnet, sass, uglify
    spawn('dotnet', 'build -f netcoreapp1.0 -b Build -o Build/Output'.split(' '), { stdio: 'inherit' });
    spawn('gulp', gulpOptions.split(' '), { stdio: 'inherit' });
}