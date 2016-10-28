/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Entity Framework forwarder for Node.js integration.
|  @requires child_process
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var spawn = require('child_process').spawn;
var args = process.argv.slice(2).join(' ');

require('./projectdir');

spawn('dotnet', ('ef -b ../build -o ../build/output ' + args).split(' '), { stdio: 'inherit' });
