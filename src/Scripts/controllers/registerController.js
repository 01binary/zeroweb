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

'use strict';
    
/**
 * Register register controller.
 */
angular.module('zeroApp')
       .controller('registerController', registerController);

/**
 * Implement register controller.
 */
function registerController() {
    $(document).ready(function() {
        window.resizeTo(window.outerWidth, 350);

        var initialFocus = $('#defaultInput');

        initialFocus.focus(function() {
            $(this).select();
        });

        initialFocus.focus();
    });
}