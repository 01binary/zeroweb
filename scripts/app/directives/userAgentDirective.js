/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Copies user agent to document attribute.
|  @requires ../../angular/angular.js
|  @requires ../../jquery/dist/jquery.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";
        
    /*
    * Register userAgent directive.
    */
    angular.module("zeroApp")
        .directive("userAgent", ["render2d", userAgentDirective]);

    /**
     * Implement userAgent directive.
     * @param {object} $render2dProvider - Service used to render 2d graphics.
     */
    function userAgentDirective($render2dProvider)
    {
        return {
            restrict: "A",
            replace: true,
            link: function($scope, $element, attributes)
            {
                var agent = navigator.userAgent.toLowerCase();

                if (agent.indexOf("msie ") != -1)
                {
                    $element.addClass("ie");
                }
                
                var edge = agent.indexOf("edge/") != -1
                var ie10 = agent.indexOf("msie 10") != -1;
                var ie11 = agent.indexOf("rv:11.0") != -1;

                if (ie10 || ie11 || edge)
                {
                    $element.addClass("gt-ie9");
                    
                    if (edge)
                    {
                        $element.addClass("edge");
                    }
                    else if (ie11)
                    {
                        $element.addClass("gt-ie10");
                    }
                    else if (ie10)
                    {
                        $element.addClass("ie10");
                    }
                }

                if (agent.indexOf("windows") != -1)
                {
                    $element.addClass("os-win");
                }
                
                if ($render2dProvider.getPixelRatio() > 1)
                {
                    $element.addClass("hi-dpi");
                }
            }
        };
    }

})();