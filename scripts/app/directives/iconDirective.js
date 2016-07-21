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

(function() {

    "use strict";
        
    /**
     * Register icon directive.
     */
    angular.module("zeroApp")
        .directive("icon", ["svg", iconDirective]);

    /**
     * Implement icon directive.
     * @param {object} $svgProvider - Service used to load SVG fragments.
     */
    function iconDirective($svgProvider)
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
                $svgProvider.load($element, attributes.src, null, null);
            }
        };
    }

})();