/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Main controller.
|  @requires ../../angular/angular-min.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

"use strict";
    
/**
 * Register main controller.
 */
angular.module("zeroApp")
       .controller("mainController", [ "$location", mainController ]);

/**
 * Implement main controller.
 */
function mainController($location)
{
    this.menuClass = menuClass;
    
    function menuClass(page)
    {
        console.log($(this));
        
        var current = $location.path().substring(1);
        var ret = page === current ? "navigation-selected" : "navigation-unselected";
        
        console.log("returning " + ret);
        
        return ret;
    }
}