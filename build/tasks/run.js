/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Run the ASP.net Core project.
|  @requires helpers
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

console.log('WARNING: build output for "run" vs VSCode launch is in different folders');
console.log('Use only one of these ways to launch the project.');

var helpers = require('./helpers');

helpers
    .changeToProjectDir()
    .dotnet('ef', 'database update', true)
    .dotnet('run', null, true);
