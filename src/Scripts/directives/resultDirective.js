/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that sets the dialog result.
|  @requires ../../angular/angular.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
    
/**
 * Register result directive.
 */
angular.module('zeroApp')
    .directive('result', resultDirective);

/**
 * Implement result directive.
 */
function resultDirective() {  
    return {
        restrict: 'E',
        replace: true,
        template: '<div></div>',
        link: function($scope, $element, attributes) {
            window.result = {
                success: Boolean(attributes.success),
                parameter: attributes.parameter
            };
        }
    };
}