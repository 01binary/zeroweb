/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Entity Framework build tasks.
|  @requires helpers
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var helpers = require('./helpers');

helpers
    .changeToProjectDir()
    .dotnet('ef', helpers.parameters);
