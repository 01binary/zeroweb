/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Factory that loads contribution summary.
|  @requires ../angular/angular.js
|  @requires ../angular-resource/angular-resource.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

/**
 * Register contributions factory.
 */
angular.module('zeroApp')
    .factory('contrib', [ '$resource', contribFactory ]);

/**
 * Implement contributions factory.
 * @param {object} $resource - AJAX service.
 */
function contribFactory($resource) {
    return $resource('/api/contrib/:type', { type: '@type' });
}
