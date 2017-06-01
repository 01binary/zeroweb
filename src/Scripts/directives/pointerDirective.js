/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that displays navigation callout.
|  @requires ../jquery/dist/jquery.js
|  @requires ../angular/angular-min.js
|  @requires ../app.js
|  @requires ../app/services/render2dService.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';

/**
 * Register pointer directive.
 */
angular.module('zeroApp')
    .directive('pointer', pointerDirective);

/**
 * Implement pointer directive.
 */
function pointerDirective()
{   
    return {
        restrict: 'A',
        replace: false,
        link: function($scope, $element)
        {
            var $selected = $('a.navigation-selected');
            var width = $selected.position().left +
                $selected.width() -
                parseInt($('main').css('margin-left'), 10);
            var height = Math.ceil($element.height() * 0.7 +
                parseInt($element.css('margin-top'), 10) * 2);
            var bulletWidth = 4;
            var bulletHeight = 14;
            var bulletTop = Math.ceil(height / 2 - height * 0.1);
            var calloutTop = Math.ceil(bulletTop / 2) + 0.5;

            $('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
                'class="callout" ' +
                'width="' + width + '" height="' + height + '">' +
                '<path d="' + geometry([
                    [ 0, bulletTop ],
                    [ 0, bulletTop + bulletHeight ],
                    [ bulletWidth, bulletTop + bulletHeight ],
                    [ bulletWidth, bulletTop + 3 ]
                ]) + 'z" fill="currentColor" stroke="none"/>' +
                '<path d="' + geometry([
                    [ 0.5, bulletTop + 1 ],
                    [ 0.5, calloutTop ],
                    [ width - bulletTop / 2, calloutTop ],
                    [ width - 1, 0 ]
                ]) + '" fill="none" stroke="currentColor"/>' +
            '</svg>').insertBefore($element);
        }
    };
}

function geometry(points) {
    return points.reduce(function(acc, cur, index) {
        return acc +
            (index ? ' L ' : '') +
            cur[0] + ' ' + cur[1];
    }, 'M ');
}
