/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that resolves inline vector graphics.
|  @requires ../../angular/angular.js
|  @requires ../../jquery/dist/jquery.js
|  @requires ../services/svgService.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

'use strict';
    
/**
 * Register icon directive.
 */
angular.module('zeroApp')
    .directive('icon', [ 'svg', iconDirective ]);

/**
 * Implement icon directive.
 * @param {object} $svgProvider - Service used to load SVG fragments.
 */
function iconDirective($svgProvider)
{   
    return {
        restrict: 'E',
        replace: true,
        scope: {
            syntax: '@',
            theme: '@'
        },
        template: '<div></div>',
        link: function($scope, $element, attributes) {
            $svgProvider.load(
                // Container element.
                $element,

                // SVG uri or SVG symbol set uri with symbol id after '#'.
                attributes.src,
                
                // Fallback group - not used for simple icons.
                null,
                
                // Class to apply - not used for simple icons.
                null,
                
                // Specify width if the container is a block style element.
                attributes.width,
                
                // Specify height if the container is a block style element.
                attributes.height);
        }
    };
}