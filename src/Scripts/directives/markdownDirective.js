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
           .directive("markdown", markdownDirective);

    /**
     * Implement markdown directive.
     * 
     */
    function markdownDirective()
    {
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            template: "<div ng-transclude></div>",
            scope: {},
            link: function($scope, $element, attributes)
            {
                if (attributes["inline"] != undefined)
                {
                    // Process static contents.
                    $element.html(window.markdownit().render($element.text()));
                }
                else
                {
                    // Watch binding expression and process when bindings are resolved.
                    $scope.unresolvedText = $element.text();
                    $scope.stopWatching = $scope.$watch
                    (
                        function()
                        {
                            return $element.text();
                        },
                        function(value)
                        {
                            if ($scope.unresolvedText == value ||
                                attributes["ignore"] == value)
                            {
                                return;
                            }

                            $element.html(window.markdownit().render(value));
                            $scope.stopWatching();
                        }
                    );
                }
            }
        };
    }
})();