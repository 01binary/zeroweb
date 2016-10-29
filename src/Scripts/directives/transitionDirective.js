/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that animates full screen transitions.
|  @requires ../../angular/angular.js
|  @requires ../../jquery/dist/jquery.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
    
/*
* Register transition directive.
*/
angular.module('zeroApp')
    .directive('transition', transitionDirective);

/**
 * Implement transition directive.
 */
function transitionDirective() {
    return {
        restrict: 'A',
        replace: false,
        link: function($scope, $element, attributes) {
            var $overlay = $('<div></div>')
                .addClass('overlay')
                .prependTo($('body'));
            
            switch (attributes['transition']) {
                case 'fade':
                    $overlay.fadeOut(200);
                    break;
            }
        }
    };
}