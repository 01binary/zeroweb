/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Directive that formats markdown content.
|  @requires ../markdown-it/dist/markdown-it.js
|  @requires ../angular/angular.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";
        
    /**
     * Register markdown directive.
     */
    angular.module("zeroApp")
           .directive("markdown", ["$compile", markdownDirective]);

    /**
     * Implement markdown directive.
     */
    function markdownDirective($compile)
    {
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            template: "<div ng-transclude></div>",
            scope: {},
            link: function($scope, $element, attributes)
            {
                // Resolve expressions, transform to markdown, and replace DOM with result.
                $element.html(window.markdownit().render($compile($element.text())));
            }
        };
    }
})();