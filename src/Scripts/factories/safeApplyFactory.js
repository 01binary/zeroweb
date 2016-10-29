/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Safe apply factory.
|  @requires ../../angular/angular.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

/**
 * Register safe apply factory.
 */
angular.module('zeroApp')
    .factory('safeApply', [ '$rootScope', safeApplyFactory ]);

/**
 * Implement safe apply factory.
 * @param {object} $rootScope - Root application scope.
 */
function safeApplyFactory($rootScope) {
    // https://coderwall.com/andrewreutter/comments
    return function($scope, fn) {
        var phase = $scope.$root.$$phase;

        if (phase == '$apply' || phase == '$digest') {
            // If digest cycle happens to be running, change value now.
            if (fn) {
                $scope.$eval(fn);
            }
        } else {
            // If digest cycle is not running, notify of value change.
            if (fn) {
                $scope.$apply(fn);
            } else {
                $scope.$apply();
            }
        }
    };
}