/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Register controller.
|  @requires ../../angular/angular-min.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";
        
    /**
     * Register register controller.
     */
    angular.module("zeroApp")
	       .controller("registerController", registerController);

    /**
     * Implement register controller.
     */
    function registerController()
    {
        /**
         * Initialize.
         */
        $(document).ready(function()
        {
            window.resizeTo(window.outerWidth, 350);
        });

        setTimeout(function()
        {
            $("#defaultInput").focus(function()
            {
                $(this).select();
            });
        }, 500);
    }

})();