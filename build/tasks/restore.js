/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Restore .NET packages and create the database.
|  @requires helpers
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

require('./helpers')
    .changeToProjectDir()
    .run('dotnet restore')
    .node('ef database update');
