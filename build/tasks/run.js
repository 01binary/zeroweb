/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Run command forwarder for Node.js integration.
|  @requires child_process
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var spawn = require('child_process').spawn;

require('./projectdir');

console.log('WARNING: build output for "run" vs VSCode launch is in different folders due to dotnet bug. Use only one of these ways to launch the project.');

spawn('dotnet', ('ef database update').split(' '), { stdio: 'inherit' }).on('exit', function() {
    spawn('dotnet', 'run'.split(' '), { stdio: 'inherit' });
});
