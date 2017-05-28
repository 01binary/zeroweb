/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that displays formatted HTTP errors.
|  @requires ../angular/angular.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
    
/**
 * Register error directive.
 */
angular.module('zeroApp').directive('error', errorDirective);

/**
 * Implement error directive.
 */
function errorDirective()
{
    return {
        restrict: 'E',
        replace: true,
        transclude: false,
        template: '<section class="comment-entry__error error">! <span ng-show="{{errorCode}}">Failed to {{operation}}: [{{errorCode}}] {{errorMessage}}.</span><span ng-show="{{!errorCode}}">{{error}}</span></section>',
        scope: {
            operation: '=operation',
            errorCode: '=code',
            errorMessage: '=message',
            error: '=error'
        }
    };
}