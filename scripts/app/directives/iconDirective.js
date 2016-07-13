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

"use strict"
    
/**
 * Register icon directive.
 */
angular.module("zeroApp")
       .directive("icon", ["svg", iconDirective]);

/**
 * Implement icon directive.
 * @param {factory} $svg - SVG factory.
 */
function iconDirective($svg)
{   
    return {
        restrict: "E",
        replace: true,
        scope:
        {
            syntax: "@",
            theme: "@"
        },
        template: "<div></div>",
        link: function($scope, $element, attributes)
        {   
            $svg.load( 
                // Pass the element being created.
                $element,
                
                // Pass the SVG uri.
                attributes.src,
                
                // Not using fallback for basic icon directive.
                null,
                
                // Not applying a class for basic icon directive.
                null);
        }
    };
}