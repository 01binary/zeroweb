/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that fades colors with JavaScript.
|  @requires ../angular/angular.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
    
/**
 * Register fade directive.
 */
angular.module('zeroApp')
    .directive('fade', fadeDirective);

/**
 * Implement fade directive.
 */
function fadeDirective() {
    return {
        restrict: 'A',
        replace: false,
        transclude: false,
        scope: {},
        link: function($scope, $element, attributes) {
            var normalBackgroundColor = $element.css('backgroundColor');
            var normalForegroundColor = $element.css('color');
            var hoverBackgroundColor = null;
            var hoverForegroundColor = null;

            // Add handlers to fade background color.
            $element.mouseenter(function() {
                if (!hoverBackgroundColor) {
                    hoverBackgroundColor = $element.css('backgroundColor');
                    hoverForegroundColor = $element.css('color');
                }

                $element.stop().animate({
                    backgroundColor: hoverBackgroundColor,
                    color: hoverForegroundColor
                }, 'fast');
            });

            $element.mouseleave(function() {
                $element.stop().animate({
                    backgroundColor: normalBackgroundColor,
                    color: normalForegroundColor
                }, 'fast');
            });
        }
    };
}