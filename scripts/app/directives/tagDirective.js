/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that formats metadata tags.
|  @requires ../angular/angular.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";
        
    /**
     * Register tag directive.
     */
    angular.module("zeroApp")
           .directive("tag", tagDirective);

    /**
     * Implement tag directive.
     */
    function tagDirective()
    {
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            template: "<a class=\"tag\" data-ng-transclude></a>",
            scope: {},
            link: function($scope, $element, attributes)
            {
                // Add handlers to fade background color.
                $element.mouseenter(function()
                {
                    $element.animate({ backgroundColor: '#d7dfe0'}, "fast");
                });

                $element.mouseleave(function()
                {
                    $element.animate({ backgroundColor: '#E3EBEC'}, "fast");
                });
            }
        };
    }

})();