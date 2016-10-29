/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Build ASP.net project, scripts, or styles.
|  @requires helpers
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var helpers = require('./helpers');

helpers.changeToProjectDir();

switch(helpers.operation) {
    case 'sass':
    case 'uglify':
        helpers.gulp(helpers.operation);
        break;
    case 'dotnet':
        helpers.dotnet('build');
        break;
    case 'clean':
        helpers
            .clean('../build/output')
            .clean('../build/src');
        break;
    default:
        helpers
            .node('ef database update')
            .gulp();
}