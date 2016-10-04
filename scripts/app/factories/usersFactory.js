/*--------------------------------------------------------*\
|   ______    __   |
|  |  __  |  |  |  |
|  | |  | |  |  |  |
|  | !__! |  |  |  |
|  !______!  !__!  |  binary : tech art
|
|  @file Factory that gets the current user.
|  @requires ../angular/angular.js
|  @requires ../angular-resource/angular-resource.js
|  @requires ../app.js
|----------------------------------------------------------
|  @author Valeriy Novytskyy
\*---------------------------------------------------------*/

(function() {

    "use strict";

    /**
     * Register users factory.
     */
    angular.module("zeroApp")
           .factory("users", ["$resource", usersFactory]);

    /**
     * Implement users factory.
     * @param {object} $resource - AJAX service.
     */
    function usersFactory($resource)
    {
        return $resource("services/users/current");
    }

})();