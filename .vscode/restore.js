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

spawn('dotnet', [ 'restore' ], { stdio: 'inherit' }).on('exit', function() {
    spawn('node', [ '../.vscode/ef', 'database', 'update' ], { stdio: 'inherit' });
});
