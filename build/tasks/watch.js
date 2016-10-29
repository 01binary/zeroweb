/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Build watch tasks.
|  @requires helpers
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

var helpers = require('./helpers');

helpers.changeToProjectDir();

if (helpers.operation) {
    helpers.gulp(helpers.operation + ':watch');
} else {
    helpers.gulp('watch');
}
