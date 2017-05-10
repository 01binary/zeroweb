/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that adds document style only on tab.
|  @requires ../angular/angular.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
    
/**
 * Register focus accessibility directive.
 */
angular.module('zeroApp')
    .directive('focusAccessibility', focusAccessibilityDirective);

/**
 * Implement focus accessibility directive.
 */
function focusAccessibilityDirective() {
    var toggleClass = 'show-focus-outlines';
    return {
        restrict: 'A',
        replace: false,
        link: function($scope, $element, attributes) {

            $element.keydown(function(e) {
                if (e.key === 'Tab') {
                    $('body').addClass(toggleClass);
                }
            });

            $element.click(function() {
                $('body').removeClass(toggleClass);
            });
        }
    };
}
