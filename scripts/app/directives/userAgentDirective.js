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
        .directive("userAgent", userAgentDirective);

    /**
     * Implement userAgent directive.
     */
    function userAgentDirective()
    {
        return {
            restrict: "A",
            replace: true,
            link: function($scope, $element, attributes)
            {
                if (navigator.userAgent.indexOf("MSIE ") != -1)
                {
                    $element.addClass("ie");
                }

                if (navigator.userAgent.indexOf("Edge/") != -1 ||
                    navigator.userAgent.indexOf("MSIE 10") != -1 ||
                    navigator.userAgent.indexOf("rv:11.0") != -1)
                {
                    $element.addClass("gt-ie9");
                }
            }
        };
    }

})();