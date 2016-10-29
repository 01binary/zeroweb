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
    .directive('pointer', [ 'render2d', pointerDirective ]);

/**
 * Implement pointer directive.
 * @param {object} $render2dProvider - Service used to render 2d graphics.
 */
function pointerDirective($render2dProvider)
{   
    return {
        restrict: 'A',
        replace: false,
        link: function($scope, $element, attributes)
        {
            // Insert canvas on which adorners are drawn before the main heading.
            var $selected = $('a.navigation-selected');

            if (!$selected.length)
                return;

            var canvasWidth = $selected.position().left +
                $selected.width() -
                parseInt($('main').css('margin-left'));

            var canvasHeight = Math.ceil($element.height() * 0.7 +
                parseInt($element.css('margin-top')) * 2);

            var canvas = $render2dProvider.createCanvas(
                $element, 'callout', canvasWidth, canvasHeight);

            // Draw bullet to the left of the title.
            var context2d = $render2dProvider.getContext(canvas);
            var bulletTop = Math.ceil(canvas.clientHeight / 2 - canvas.clientHeight * 0.1);
            var calloutTop = Math.ceil(bulletTop / 2) + 0.5;

            $render2dProvider.drawBullet(
                context2d,
                $render2dProvider.getCss('callout', 'color'),
                0,
                bulletTop,
                3.5,
                14
            );

            // Draw callout line from bullet to selected navigation button.
            context2d.strokeStyle = context2d.fillStyle;
            context2d.lineWidth = 1;
            context2d.moveTo(0.5, bulletTop + 1);
            context2d.lineTo(0.5, calloutTop);
            context2d.lineTo(canvas.clientWidth - bulletTop / 2, calloutTop);
            context2d.lineTo(canvas.clientWidth - 1, 0);
            context2d.stroke();
        }
    };
}