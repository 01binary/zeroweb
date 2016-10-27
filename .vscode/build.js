/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Build command forwarder for Node.js integration
|  @requires child_process
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var spawn = require('child_process').spawn;

require('./projectdir');
spawn('dotnet', 'build -f netcoreapp1.0 -b Build -o Build/Output'.split(' '), { stdio: 'inherit' });
spawn('gulp', '--gulpfile ../.vscode/gulpfile.js'.split(' '), { stdio: 'inherit' });